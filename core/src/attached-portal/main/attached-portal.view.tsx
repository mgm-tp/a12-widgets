/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import type { ReactNode, CSSProperties, ContextType, MouseEvent as ReactMouseEvent, RefObject } from "react";
import { Component, createRef, isValidElement } from "react";
import { Key } from "ts-key-enum";
import { styled } from "styled-components";

import type { BoundaryAlignmentArgument, Position } from "../../common/main/alignment.js";
import { getBoundaryAlignment, Orientation, getPositionBoundingClientRect } from "../../common/main/alignment.js";
import {
	bindMethods,
	getVerticalWindowScrollWidth,
	joinClassNames,
	Throttler,
	addPrefix,
	isNotFullyOverlapped,
	isVisibleOnScreen,
	isElementCompletelyVisibleInContainer,
	isElementFocusable,
	getParentElement,
	IntersectionObserverHelper,
	getElementDocument,
	getElementWindow,
	getIframeOffset
} from "../../common/main/utils.js";
import { TabSandbox } from "../../common/main/tab-sandbox.view.js";
import { Portal } from "../../portal/main/portal.view.js";
import { provider } from "../../common/main/device-detector.js";
import { PortalContext } from "../../common/main/widgets-root.view.js";
import { WidgetsResizeDetector } from "../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { AttachedPortalProps } from "./attached-portal.api.js";
import { computeMaxSize, findClosestAttachedPortal, hasRectChanged } from "./attached-portal.internal.js";

export interface PortalWrapper {
	wrapperRef: HTMLElement;
	portals: {
		domElement: HTMLElement;
		closeOnOutsideClick: boolean;
		level: number;
	}[];
}

interface AttachedPortalState {
	isReferenceElementVisible: boolean;
	position: Position;
	maxHeight?: string;
	maxWidth?: string;
	referenceElementRect?: DOMRect;
}

const portalClassName = addPrefix("portal");
const POSITION_TOLERANCE = 2;

const BaseAttachedPortal = styled.div.withConfig({ displayName: "BaseAttachedPortal-sc-" })`
	display: flex;
	max-height: 100vh;
	outline: 0 solid transparent;
	position: absolute;

	> * {
		max-height: inherit;
	}
`;

export class AttachedPortal extends Component<AttachedPortalProps, AttachedPortalState> {
	static displayName = "AttachedPortal";
	declare context: ContextType<typeof PortalContext>;
	static defaultProps = {
		closeOnClickReferenceElement: true,
		focusOnReferenceElementAfterEsc: true,
		closeOnEsc: true,
		focusOnOpen: true
	};

	private attachedPortalElement: RefObject<HTMLDivElement | null>;
	private defaultOrientation = "bottom-start" as Orientation;

	private static portalWrappers: PortalWrapper[] = [];
	private originalOrientation?: Orientation;
	private isComponentMounted = false;
	private isOpened = false;
	private isResized = false;
	private windowHasScroll = false;
	private isPhone = provider.isPhone();
	private isTablet = provider.isTablet();
	private mutationObserver: MutationObserver | undefined = undefined;
	private document = getElementDocument(this.props.referenceElement);
	private window = getElementWindow(this.props.referenceElement);
	private intersectionObserver = new IntersectionObserverHelper();
	private ancestorDocuments: Document[] = [];

	private positionChangeHandler: EventListener = Throttler.create((event: Event) => {
		const target = event.target as HTMLElement;
		const portal = this.attachedPortalElement.current && this.attachedPortalElement.current.parentElement;
		const eventType = event.type;

		if (portal && target && !(target instanceof Node && portal.contains(target))) {
			const { referenceElement } = this.props;

			if (!referenceElement) {
				this.updatePortal(false);

				return;
			}

			if (eventType === "scroll") {
				this.handleScrollEvent(target, referenceElement);
			}

			if (eventType === "resize") {
				this.handleResizeEvent();
			}
		}
	});

	private getAncestorDocuments(): Document[] {
		const docs: Document[] = [];
		let currentWindow: Window = this.window;

		while (currentWindow.parent !== currentWindow) {
			currentWindow = currentWindow.parent;
			docs.push(currentWindow.document);
		}

		return docs;
	}

	private ancestorScrollHandler: EventListener = Throttler.create(() => {
		if (!this.attachedPortalElement.current) {
			return;
		}

		if (this.props.referenceElementRect && this.props.referenceElement) {
			const currentRect = this.getIframeAdjustedReferenceRect();
			this.setState({ referenceElementRect: currentRect }, () => {
				this.updatePortal(this.getPortalVisibility());
			});
		} else {
			this.updatePortal(this.getPortalVisibility());
		}
	});

	private handleScrollEvent(scrollTarget: HTMLElement, referenceElement: HTMLElement): void {
		const currentRect = this.getIframeAdjustedReferenceRect();
		const previousRect = this.state.referenceElementRect;

		const positionChanged = hasRectChanged(previousRect, currentRect);

		if (scrollTarget.contains(referenceElement) || positionChanged) {
			const shouldUpdatePortal = this.shouldUpdatePortalOnScroll(scrollTarget, referenceElement);
			const updatedRect = this.intersectionObserver.visibleElementRect || currentRect;

			this.setState({ referenceElementRect: updatedRect }, () => {
				this.updatePortal(this.getPortalVisibility(shouldUpdatePortal));
			});
		}

		if (this.isPhone) {
			this.updateWrapperSize();
		}
	}

	private shouldUpdatePortalOnScroll(scrollTarget: HTMLElement, referenceElement: HTMLElement): boolean {
		return (
			this.isTablet ||
			this.isPhone ||
			!!this.intersectionObserver.visibleElementRect ||
			isElementCompletelyVisibleInContainer(scrollTarget, referenceElement)
		);
	}

	private getIframeAdjustedReferenceRect() {
		const rawRect = getPositionBoundingClientRect(this.props.position, this.props.referenceElement);
		const iframeOffset = getIframeOffset(
			this.props.referenceElement,
			getElementDocument(this.attachedPortalElement.current)
		);

		// Avoid `...rawRect`: DOMRect fields are accessor properties on the prototype,
		// so spread drops width/height and breaks hasRectChanged downstream.
		return {
			x: rawRect.left + iframeOffset.left,
			y: rawRect.top + iframeOffset.top,
			width: rawRect.width,
			height: rawRect.height,
			top: rawRect.top + iframeOffset.top,
			bottom: rawRect.bottom + iframeOffset.top,
			left: rawRect.left + iframeOffset.left,
			right: rawRect.right + iframeOffset.left
		} as DOMRect;
	}

	private handleResizeEvent(): void {
		// setTimeout to ensure correct positioning even if browser is resized quickly
		setTimeout(() => this.updatePortal(this.getPortalVisibility()), 50);

		if (!this.attachedPortalElement.current) {
			return;
		}

		const { maxWidth, maxHeight } = computeMaxSize(
			this.getIframeAdjustedReferenceRect(),
			this.state.position.orientation
		);

		const shouldUpdateSize =
			!isVisibleOnScreen(this.attachedPortalElement.current) ||
			this.isContentOverflowingHeight(maxHeight) ||
			this.isContentOverflowingWidth(maxWidth);

		if (shouldUpdateSize) {
			this.updateWrapperSize({ maxWidth, maxHeight });
		}
	}

	private isContentOverflowingHeight(maxHeight: number): boolean {
		const element = this.attachedPortalElement.current;

		if (!element) {
			return false;
		}

		const contentHeight = element.firstElementChild?.scrollHeight ?? 0;

		return contentHeight > element.clientHeight && maxHeight > element.clientHeight;
	}

	private isContentOverflowingWidth(maxWidth: number): boolean {
		const element = this.attachedPortalElement.current;

		if (!element) {
			return false;
		}

		const contentWidth = element.firstElementChild?.scrollWidth ?? 0;

		return contentWidth > element.clientWidth && maxWidth > element.clientWidth;
	}

	private getPortalVisibility(shouldShow?: boolean): boolean {
		if (this.props.hideOnReferenceElementPositionChange) {
			return false;
		}

		return shouldShow ?? true;
	}

	constructor(props: AttachedPortalProps) {
		super(props);

		this.state = {
			isReferenceElementVisible: true,
			position: { top: -9999, left: -9999, orientation: props.orientation || this.defaultOrientation },
			maxHeight: undefined,
			maxWidth: undefined,
			// The init referenceElementRect can be the value passing from outside (has been calculated) or the current position of the referenceElement.
			referenceElementRect: this.props.position
				? undefined
				: (this.props.referenceElementRect ?? this.props.referenceElement?.getBoundingClientRect())
		};
		this.originalOrientation = props.orientation;

		if (this.props.updateElementPosition) {
			this.props.updateElementPosition(() => {
				this.updatePortal(this.state.isReferenceElementVisible);
			});
		}

		this.windowHasScroll = getVerticalWindowScrollWidth() > 0;
		this.attachedPortalElement = createRef();

		if (!props.referenceElement) {
			this.document = getElementDocument(this.attachedPortalElement?.current);
			this.window = getElementWindow(this.attachedPortalElement?.current);
		}

		bindMethods(this);
	}

	private shouldShow(): boolean {
		if (this.props.position) {
			return true;
		}

		if (!this.props.referenceElement) {
			return false;
		}

		if (
			(this.props.referenceElementRect && this.props.referenceElementRect?.width > 0) ||
			isNotFullyOverlapped(this.props.referenceElement)
		) {
			return true;
		}

		const overlappedByPortalRef = this.findOverlayingPortal(this.props.referenceElement);

		if (overlappedByPortalRef) {
			const registeredWrapper = AttachedPortal.portalWrappers.find((wrapper) =>
				wrapper.wrapperRef.contains(overlappedByPortalRef)
			);

			if (registeredWrapper) {
				const registeredPortal = registeredWrapper.portals.find((portal) => {
					const portalRef = overlappedByPortalRef.firstElementChild || overlappedByPortalRef;

					return portal.domElement === portalRef || portal.domElement.contains(portalRef);
				});

				return !!(registeredPortal && registeredPortal.closeOnOutsideClick);
			}
		}

		return false;
	}

	private findOverlayingPortal(element: Element): Element | null {
		if (typeof this.document.elementFromPoint !== "function") {
			return null;
		}

		const rect = element.getBoundingClientRect();
		const { top, left, bottom, right } = rect;

		const topElement = this.document.elementFromPoint((left + right) / 2, top);
		const leftElement = this.document.elementFromPoint(left, (top + bottom) / 2);
		const bottomElement = this.document.elementFromPoint((left + right) / 2, bottom);
		const rightElement = this.document.elementFromPoint(right, (top + bottom) / 2);

		return (
			findClosestAttachedPortal(topElement) ||
			findClosestAttachedPortal(leftElement) ||
			findClosestAttachedPortal(bottomElement) ||
			findClosestAttachedPortal(rightElement)
		);
	}

	private handleRef(ref: HTMLDivElement | null): void {
		if (this.props.wrapperRef) {
			this.props.wrapperRef(ref);
		}

		this.attachedPortalElement.current = ref;

		if (ref) {
			const findResult = this.findWrapper(ref);

			if (findResult && !AttachedPortal.portalWrappers.some((item) => item.wrapperRef === findResult.ref)) {
				AttachedPortal.portalWrappers.push({
					wrapperRef: findResult.ref,
					portals: []
				});
			}

			if (findResult) {
				const portalWrapper = AttachedPortal.portalWrappers.find((item) => item.wrapperRef === findResult.ref);

				if (portalWrapper) {
					portalWrapper.portals.push({
						domElement: ref,
						level: findResult.level,
						closeOnOutsideClick: !!this.props.closeOnOutsideClick
					});
				}
			}
		} else {
			AttachedPortal.portalWrappers = AttachedPortal.portalWrappers.filter((item) =>
				this.document.body.contains(item.wrapperRef)
			);
		}
	}

	private findWrapper(element: HTMLElement | null, level = 0): { ref: HTMLElement; level: number } | null {
		if (element && element.parentElement === this.document.body) {
			return { ref: element, level };
		}

		return element ? this.findWrapper(element.parentElement, level + 1) : null;
	}

	private handlePortalClose(event?: Event): void {
		const { closeOnClickReferenceElement, referenceElement, closeOnOutsideClick } = this.props;

		if (event) {
			const target = event.target as Element;

			if (!closeOnClickReferenceElement && referenceElement && referenceElement.contains(target)) {
				return;
			}

			// Won't close if clicking on exception.
			if (
				closeOnOutsideClick &&
				typeof closeOnOutsideClick !== "boolean" &&
				closeOnOutsideClick.exception &&
				closeOnOutsideClick.exception.length > 0 &&
				closeOnOutsideClick.exception.some((elem) => elem && (elem.contains(target) || elem === target))
			) {
				return;
			}

			const clickOnPortalRef = this.findPortal(event.target as HTMLElement);

			if (clickOnPortalRef) {
				if (
					AttachedPortal.portalWrappers.some((item) => {
						const currentPortal = item.portals.find(
							(portal) => portal.domElement === this.attachedPortalElement.current
						);
						const clickOnPortal = item.portals.find((portal) => portal.domElement === clickOnPortalRef);

						return currentPortal && clickOnPortal && currentPortal.level < clickOnPortal.level;
					})
				) {
					return;
				}
			} else {
				const path = (event && "deepPath" in event && (event as any).deepPath()) || [];
				const foundPortal = this.findPortalInPath(path);

				if (foundPortal === this.attachedPortalElement.current) {
					return;
				}
			}

			if ((event as any).key === Key.Escape && this.props.focusOnReferenceElementAfterEsc && referenceElement) {
				referenceElement.focus();
			}
		}

		const mouseDownOnReferenceElement =
			event &&
			referenceElement &&
			referenceElement.contains(event.target as HTMLElement) &&
			this.props.closeOnClickReferenceElement;

		if (!mouseDownOnReferenceElement) {
			this.updatePortal(false);
		}
	}

	private findPortalInPath(path: EventTarget[]): Element | null {
		for (const node of path) {
			const element = node as Element;

			if (typeof element.classList !== "undefined" && element.classList.contains(portalClassName)) {
				return element.firstElementChild;
			}
		}

		return null;
	}

	private findPortal(element: Element | null): Element | null {
		if (element && element.classList.contains(portalClassName)) {
			return element.firstElementChild;
		}

		return element ? this.findPortal(element.parentElement) : null;
	}

	private handleWindowClick(event: MouseEvent): void {
		const mouseDownOnReferenceElement =
			this.props.referenceElement &&
			this.props.referenceElement.contains(event.target as HTMLElement) &&
			this.props.closeOnClickReferenceElement;

		if (
			(this.props.position || mouseDownOnReferenceElement) &&
			this.attachedPortalElement.current &&
			!this.props.isInRichTextEditor
		) {
			this.updatePortal(false);
		}
	}

	private handleWrapperClick(event: ReactMouseEvent<HTMLElement>): void {
		event.stopPropagation();
		this.props.onClick?.(event);
	}

	private handleClickOutside(event: Event): void {
		const { closeOnOutsideClick } = this.props;
		const notTriggerClickOutSide =
			closeOnOutsideClick &&
			typeof closeOnOutsideClick !== "boolean" &&
			closeOnOutsideClick.exception &&
			closeOnOutsideClick.exception.some((e) => e === event.target);

		if (
			(this.props.referenceElement && this.props.referenceElement.contains(event.target as HTMLElement)) ||
			notTriggerClickOutSide
		) {
			return;
		}

		this.props.onClickOutside?.(event);
	}

	private onChildrenResize(): void {
		this.updatePortal(this.state.isReferenceElementVisible, true);

		if (this.attachedPortalElement.current) {
			this.isResized = true;
			this.attachedPortalElement.current.style.opacity = "1";
		}
	}

	private updatePortalPosition(position?: DOMRect): void {
		const previousRect = this.state.referenceElementRect;

		if (previousRect?.top === undefined && previousRect?.left === undefined) {
			return;
		}

		if (hasRectChanged(previousRect, position)) {
			this.updatePortal(this.getPortalVisibility());
			this.updateReferenceElementPosition(position);
		}
	}

	private mutationObserverCallback(mutationList: MutationRecord[]): void {
		for (const mutation of mutationList) {
			if (mutation.type === "childList" && this.props.referenceElement) {
				this.intersectionObserver.getVisibleElementRect(this.props.referenceElement, this.updatePortalPosition);
			}
		}
	}

	private updateReferenceElementPosition(position?: DOMRect): void {
		this.setState({ referenceElementRect: position });
	}

	componentDidMount(): void {
		this.document.addEventListener("scroll", this.positionChangeHandler, true);
		this.window.addEventListener("resize", this.positionChangeHandler, true);

		this.ancestorDocuments = this.getAncestorDocuments();
		this.ancestorDocuments.forEach((doc) => {
			doc.addEventListener("scroll", this.ancestorScrollHandler, true);
		});

		// Fix A12W-10732: Prevent JAWS from reading the table structure when using the up arrow key to navigate to the top of the attached portal. For example, JAWS will read "table with 2 columns and 16 rows".
		this.document.querySelectorAll(`[data-role=${DataRoles.Table}]`)?.forEach((item) => {
			const interactionHint = this.attachedPortalElement.current?.querySelector(
				`[data-role=${DataRoles.InteractionHint}]`
			);

			if (this.attachedPortalElement.current?.contains(item) || interactionHint) {
				return;
			}

			return item.setAttribute("role", "presentation");
		});

		setTimeout(() => {
			this.window.addEventListener("click", this.handleWindowClick);
		});
		this.isComponentMounted = true;

		const rootNode = getParentElement(
			this.attachedPortalElement.current,
			(currentParentElement) =>
				Object.keys(currentParentElement).filter((keyName: string) => keyName.includes("__reactContainer")).length > 0
		);

		if (rootNode) {
			const config: MutationObserverInit = { childList: true, subtree: true };
			this.mutationObserver = new MutationObserver(this.mutationObserverCallback);
			this.mutationObserver.observe(rootNode, config);
		}

		if (this.props.referenceElement) {
			this.intersectionObserver.getVisibleElementRect(this.props.referenceElement, this.updateReferenceElementPosition);
		}

		const shouldShow = this.shouldShow();
		this.props.onVisibilityChange?.(shouldShow);

		if (!this.props.selfSizing) {
			this.updatePortal(shouldShow);

			if (this.attachedPortalElement.current) {
				// Avoid Jumping when open portal
				this.attachedPortalElement.current.style.opacity = "0";
			}
		} else {
			if (this.state.isReferenceElementVisible !== shouldShow) {
				this.setState({ isReferenceElementVisible: shouldShow });
			}
		}
	}

	componentDidUpdate(prevProps: AttachedPortalProps, prevState: AttachedPortalState): void {
		if (this.props.orientation !== this.originalOrientation) {
			this.originalOrientation = this.props.orientation;
			const position = this.state.position;
			position.orientation = this.props.orientation || this.defaultOrientation;
			this.setState({ position: position }, () => {
				this.updatePortal(this.state.isReferenceElementVisible);
			});
		}

		if (this.props.position !== prevProps.position) {
			this.updatePortal(true);
		}

		if (!prevState.maxHeight && this.state.maxHeight) {
			this.updatePortal(this.state.isReferenceElementVisible);
		}

		if (!this.isOpened && this.props.focusOnOpen) {
			setTimeout(() => {
				const attachedPortalElement = this.attachedPortalElement.current;

				if (attachedPortalElement && attachedPortalElement.firstChild instanceof HTMLElement) {
					const firstChild = attachedPortalElement.firstChild;

					if (!isElementFocusable(firstChild)) {
						firstChild.tabIndex = -1;
					}

					const { htmlAttributes } = this.props;
					const existingRole = firstChild.getAttribute("role");

					if (!existingRole) {
						const specifiedRole = htmlAttributes?.role;
						const firstChildDataRole = firstChild.getAttribute("data-role");

						// A12W-10774: Remove the `role` attribute completely from Toast element to make JAWS work correctly.
						const defaultRole = [`${DataRoles.Toast}`].includes(firstChildDataRole ?? "") ? undefined : "dialog";

						if (specifiedRole) {
							firstChild.setAttribute("role", specifiedRole);
						} else if (defaultRole) {
							firstChild.setAttribute("role", defaultRole);
						}
					}

					firstChild.focus();
				}
			});

			this.isOpened = true;
		}

		this.updateWrapperSize();
	}

	componentWillUnmount(): void {
		this.document.removeEventListener("scroll", this.positionChangeHandler, true);
		this.window.removeEventListener("resize", this.positionChangeHandler, true);
		this.window.removeEventListener("click", this.handleWindowClick);

		this.ancestorDocuments.forEach((doc) => {
			doc.removeEventListener("scroll", this.ancestorScrollHandler, true);
		});
		this.document
			.querySelectorAll(`[data-role=${DataRoles.Table}]`)
			?.forEach((item) => item.setAttribute("role", "table"));

		this.mutationObserver?.disconnect();
		this.intersectionObserver.disconnectObserver();
	}

	render(): ReactNode {
		const { position, isReferenceElementVisible, maxWidth, maxHeight } = this.state;

		if (!isReferenceElementVisible) {
			return null;
		}

		const visibility = !this.isComponentMounted
			? "hidden"
			: maxHeight
				? "visible"
				: this.props.selfSizing
					? "visible"
					: "hidden";
		const styles = {
			top: Math.floor(position.top),
			left: Math.floor(position.left),
			...this.props.style,
			maxHeight,
			maxWidth,
			visibility
		} as CSSProperties;

		const shouldWrapChildren = !isValidElement(this.props.children);

		// If it's not a React element, wrap it with a div to ensure firstChild is always an HTMLElement
		const renderedChildren = shouldWrapChildren ? <div>{this.props.children}</div> : this.props.children;

		const { style: htmlAttributesStyle, ...restHtmlAttributes } = this.props.htmlAttributes || {};
		const mergedStyles = {
			...htmlAttributesStyle,
			...styles
		} as CSSProperties;

		const innerContent = (
			<WidgetsResizeDetector onResize={this.onChildrenResize} targetRef={this.attachedPortalElement}>
				<BaseAttachedPortal
					tabIndex={-1}
					id={this.props.id}
					style={mergedStyles}
					ref={this.handleRef}
					className={joinClassNames(
						addPrefix("attached-portal"),
						Orientation.toClassName(position.orientation),
						this.props.className
					)}
					onClick={this.handleWrapperClick}
					onMouseDown={this.props.onMouseDown}
					onMouseOver={this.props.onMouseOver}
					onMouseLeave={this.props.onMouseLeave}
					onFocus={(event) => event.stopPropagation()}
					onKeyDown={this.props.onKeyDown}
					data-role={DataRoles.AttachedPortal}
					{...restHtmlAttributes}
				>
					{renderedChildren}
				</BaseAttachedPortal>
			</WidgetsResizeDetector>
		);

		return (
			<Portal
				closeOnOutsideClick={!!this.props.closeOnOutsideClick}
				onClose={this.handlePortalClose}
				closeOnEsc={this.props.closeOnEsc}
				onClickOutside={this.handleClickOutside}
			>
				{this.props.focusOnOpen || this.props.focusOnReferenceElementAfterClose ? (
					<TabSandbox focusOnOpen={this.props.focusOnOpen} focusBack={this.props.focusOnReferenceElementAfterClose}>
						{innerContent}
					</TabSandbox>
				) : (
					innerContent
				)}
			</Portal>
		);
	}

	private updatePortal(
		isReferenceElementVisible: boolean = !!this.props.position ||
			(!!this.props.referenceElement && isNotFullyOverlapped(this.props.referenceElement)),
		isChildrenSelfResize = false
	): void {
		// Only update portal if portal exist in the DOM
		if (!this.attachedPortalElement.current) {
			return;
		}

		// Prevent calling onScroll event and calculating wrong position.
		if (!this.windowHasScroll) {
			this.document.removeEventListener("scroll", this.positionChangeHandler, true);
		}

		if (isReferenceElementVisible && this.attachedPortalElement.current !== null) {
			const { orientationList, fixedOrientation, adjustPositionToScreen, referenceElement } = this.props;
			const boundaryAlignmentArgument: BoundaryAlignmentArgument = {
				referenceElement: referenceElement,
				element: this.attachedPortalElement.current,
				preferredOrientation: this.state.position.orientation,
				mode: "fixed",
				orientationList,
				fixedOrientation,
				adjustPositionToScreen,
				fixedPosition: getPositionBoundingClientRect(this.props.position, referenceElement),
				...(this.props.referenceElementRect && { referenceElementRect: this.state.referenceElementRect })
			};

			const position = getBoundaryAlignment(boundaryAlignmentArgument);

			const hasPositionChanged =
				Math.abs(position.left - this.state.position.left) > POSITION_TOLERANCE ||
				Math.abs(position.top - this.state.position.top) > POSITION_TOLERANCE ||
				position.orientation !== this.state.position.orientation;

			if (
				hasPositionChanged &&
				(!this.isResized || !isVisibleOnScreen(this.attachedPortalElement.current) || !isChildrenSelfResize)
			) {
				this.setState({ position }, () => this.props.onOrientationChange?.(position.orientation));
			}
		}

		if (this.state.isReferenceElementVisible !== isReferenceElementVisible) {
			this.setState({ isReferenceElementVisible });
			this.props.onVisibilityChange?.(isReferenceElementVisible);
		}

		setTimeout(() => {
			if (!this.windowHasScroll && isReferenceElementVisible) {
				this.document.addEventListener("scroll", this.positionChangeHandler, true);
			}
		});
	}

	private updateWrapperSize(
		{ maxWidth, maxHeight } = computeMaxSize(this.getIframeAdjustedReferenceRect(), this.state.position.orientation)
	): void {
		const referenceElementRect = this.getIframeAdjustedReferenceRect();

		if (this.props.selfSizing || !referenceElementRect) {
			return;
		}

		// For "top" position, subtract arrow margin-bottom to prevent overlap
		if (this.state.position.orientation.startsWith("top") && this.attachedPortalElement.current) {
			const firstChild = this.attachedPortalElement.current.firstElementChild;

			if (firstChild) {
				const marginBottom = parseFloat(this.window.getComputedStyle(firstChild).marginBottom) || 0;
				maxHeight = Math.max(0, maxHeight - marginBottom);
			}
		}

		if (parseFloat(this.state.maxHeight || "0") !== maxHeight || parseFloat(this.state.maxWidth || "0") !== maxWidth) {
			this.setState({ maxHeight: maxHeight + "px", maxWidth: maxWidth + "px" }, () => {
				this.props.onSizeChange?.(maxWidth, maxHeight);
			});
		}
	}
}
AttachedPortal.contextType = PortalContext;
