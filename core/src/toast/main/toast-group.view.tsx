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

import type { FC, FocusEvent, ReactElement, ReactNode, RefObject } from "react";
import {
	createContext,
	useRef,
	useState,
	useCallback,
	useEffect,
	useMemo,
	isValidElement,
	Children,
	createRef
} from "react";
import { CSSTransition } from "react-transition-group";

import { getGlobalViewportBox } from "../../common/main/alignment.js";
import type { CustomClientRect } from "../../common/main/utils.js";
import { addPrefix, getParentElement, joinClassNames } from "../../common/main/utils.js";
import { TabSandbox } from "../../common/main/tab-sandbox.view.js";
import { Portal } from "../../portal/main/portal.view.js";
import { ButtonGroup } from "../../button-group/main/button-group.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import {
	StyledToastAnimation,
	StyledToastGroupWrapper,
	StyledToastGroupToolbar,
	StyledToastGroupToolbarTitle,
	StyledTransitionGroup
} from "./toast-group.styled.js";
import type { ToastGroupProps } from "./toast-group.api.js";
import type { ToastProps } from "./toast/toast.api.js";

const baseClassName = addPrefix("toast");

export const ToastGroupContext = createContext<{
	shouldStopTimeout?: boolean;
	toastCount: number;
	stackable?: boolean;
	animationTimeout?: number;
}>({ toastCount: 0 });

export const ToastGroup: FC<ToastGroupProps> = ({
	children,
	className: classNameProp,
	direction: directionProp,
	focusBackHandler,
	id,
	mobile,
	onClose,
	stackable,
	style,
	wrapperRef,
	animationTimeout = 400,
	closeOnEsc = true,
	focusBack = true,
	position = "top-right",
	alignTo = "window"
}): ReactElement<ToastGroupProps> | null => {
	const prevActiveElementRef = useRef<HTMLElement | null>(null);
	const groupWrapperRef = useRef<HTMLDivElement | null>(null);
	const stackToolbarRef = useRef<HTMLDivElement | null>(null);
	const portalRef = useRef<HTMLElement | undefined>(undefined);
	const temporaryToastCount = useRef(0);

	const direction = directionProp || getDirectionByPosition(position);
	const orderedChildrenArray = getOrderedChildrenArray(children, direction, !!stackable);

	const [stacking, setStacking] = useState(true);
	const [isInteracting, setIsInteracting] = useState<boolean | undefined>(undefined);

	const handleToggleStack = useCallback((): boolean => {
		const nextStackingState = !stacking;
		setStacking(nextStackingState);

		setTimeout(() => {
			stackToolbarRef.current?.focus();

			if (groupWrapperRef.current) {
				groupWrapperRef.current.scrollTop = 0;
			}
		});

		return nextStackingState;
	}, [stacking]);

	const handleStackToolbarRef = useCallback((ref: HTMLDivElement | null): void => {
		stackToolbarRef.current = ref;
	}, []);

	const handleWrapperRef = useCallback(
		(ref: HTMLDivElement | null): void => {
			if (ref) {
				if (mobile) {
					updatePositionOnMobile(ref);
				} else {
					const viewportRef = getViewportRef(alignTo as ToastGroupProps.Viewport, ref);
					updatePosition(ref, viewportRef, position as ToastGroupProps.Position);
				}

				portalRef.current = getParentElement(ref, (element) => element.getAttribute("data-role") === DataRoles.Portal);
			}

			wrapperRef?.(ref);
			groupWrapperRef.current = ref;
		},
		[mobile, alignTo, position, wrapperRef]
	);

	const handleInteraction = useCallback(() => {
		setIsInteracting(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		if (!portalRef.current?.contains(document.activeElement)) {
			setIsInteracting(temporaryToastCount.current ? false : undefined);
		}
	}, []);

	const handleBlur = useCallback((event: FocusEvent) => {
		if (!portalRef.current?.contains(event.relatedTarget)) {
			setIsInteracting(temporaryToastCount.current ? false : undefined);
		}
	}, []);

	const keyupListener = useCallback(
		(event: KeyboardEvent): void => {
			const { current: prevActiveElement } = prevActiveElementRef;

			if (event.key !== "Escape" || !prevActiveElement || !closeOnEsc) {
				return;
			}

			const belongsToToastGroup =
				!!getParentElement(prevActiveElement, (p) => p.classList.contains(`${baseClassName}-group`)) ||
				prevActiveElement.classList.contains(`${baseClassName}-group`);
			const notBelongsToAnyPortal =
				document.contains(prevActiveElement) &&
				!getParentElement(prevActiveElement, (p) => p.classList.contains(addPrefix("portal")));

			if (belongsToToastGroup || notBelongsToAnyPortal) {
				onClose?.();
			}
		},
		[closeOnEsc, onClose]
	);

	const keydownCaptureListener = useCallback(() => {
		prevActiveElementRef.current = document.activeElement as HTMLElement;
	}, []);

	useEffect(() => {
		if (stackable) {
			if (orderedChildrenArray.length < 2) {
				setStacking(true);
			}

			if ((isInteracting === false && temporaryToastCount.current === 0) || orderedChildrenArray.length === 0) {
				setIsInteracting(undefined);
			}
		}
	}, [orderedChildrenArray, stackable, isInteracting]);

	useEffect(() => {
		if (typeof stackable === "object" && stackable.onToggleStack) {
			stackable.onToggleStack(handleToggleStack);
		}
	}, [handleToggleStack, stackable]);

	useEffect(() => {
		window.addEventListener("keyup", keyupListener);
		window.addEventListener("keydown", keydownCaptureListener, true);

		return (): void => {
			window.removeEventListener("keyup", keyupListener);
			window.removeEventListener("keydown", keydownCaptureListener, true);
		};
	}, [keydownCaptureListener, keyupListener]);

	const className = joinClassNames(
		{ [`${baseClassName}-group--mobile`]: mobile },
		`${baseClassName}-group`,
		classNameProp
	);

	const renderingStackedContent = useMemo(() => {
		const orderedToastArray = orderedChildrenArray.filter((children) => isValidElement<ToastProps>(children));
		const stackedToastRef: RefObject<HTMLDivElement | null> = createRef();

		return (
			<CSSTransition
				classNames={`${baseClassName}-stacked`}
				key={isValidElement<ToastProps>(orderedToastArray[0]) ? orderedToastArray[0].key : undefined}
				timeout={animationTimeout || 400}
				nodeRef={stackedToastRef}
			>
				<StyledToastAnimation ref={stackedToastRef}>{orderedToastArray[0]}</StyledToastAnimation>
			</CSSTransition>
		);
	}, [animationTimeout, orderedChildrenArray]);

	const renderingContent = useMemo(() => {
		return orderedChildrenArray.map((child, index) => {
			if (isValidElement<ToastProps>(child)) {
				const childRef: RefObject<HTMLDivElement | null> = createRef();

				return (
					<CSSTransition
						onEnter={() => {
							if (child.props.type === "temporary") {
								temporaryToastCount.current = temporaryToastCount.current + 1;
							}
						}}
						onExiting={() => {
							if (child.props.type === "temporary") {
								if (temporaryToastCount.current > 1) {
									temporaryToastCount.current = temporaryToastCount.current - 1;
								} else {
									// Prevent resetting isInteracting to undefined before the last toast completely exited
									setTimeout(() => {
										temporaryToastCount.current = 0;
									});
								}
							}
						}}
						key={child.key || "toast-" + index}
						classNames={baseClassName}
						timeout={animationTimeout || 400}
						nodeRef={childRef}
					>
						<StyledToastAnimation ref={childRef}>{child}</StyledToastAnimation>
					</CSSTransition>
				);
			}

			return child;
		});
	}, [animationTimeout, orderedChildrenArray]);

	if (stackable) {
		return (
			<Portal>
				<div role="status" aria-atomic={false}>
					{orderedChildrenArray.length ? (
						<TabSandbox focusBackHandler={focusBackHandler} focusOnOpen={false}>
							<StyledToastGroupWrapper
								isMobile={mobile}
								tabIndex={-1}
								ref={handleWrapperRef}
								style={style}
								className={className}
								data-role={DataRoles.Toast.Group}
								id={id}
								onMouseEnter={handleInteraction}
								onMouseLeave={handleMouseLeave}
								onFocus={handleInteraction}
								onBlur={handleBlur}
								$stackable
								$stacking={stacking && orderedChildrenArray.length > 1}
								$direction={direction}
							>
								{orderedChildrenArray.length > 1 && (
									<StyledToastGroupToolbar
										$stacking={stacking}
										ref={handleStackToolbarRef}
										data-role={DataRoles.Toast.Group.Toolbar}
									>
										{typeof stackable === "object" && (
											<>
												{stackable.toolbarTitle && (
													<StyledToastGroupToolbarTitle
														data-role={DataRoles.Toast.Group.Toolbar.Title}
														role="heading"
														aria-level={2}
														// Force re-rendering of the toolbar title to ensure screen readers announce the updated count.
														key={`toolbar-title-${orderedChildrenArray.length}`}
													>
														{stackable.toolbarTitle}
													</StyledToastGroupToolbarTitle>
												)}
												{stackable.toolbarItems && (
													<ButtonGroup data-role={DataRoles.Toast.Group.Toolbar.ItemsGroup}>
														{stackable.toolbarItems}
													</ButtonGroup>
												)}
											</>
										)}
									</StyledToastGroupToolbar>
								)}
								<ToastGroupContext.Provider
									value={{
										shouldStopTimeout: isInteracting,
										toastCount: orderedChildrenArray.length,
										stackable: true,
										animationTimeout: animationTimeout || 400
									}}
								>
									<StyledTransitionGroup
										key={stacking ? `toast-${orderedChildrenArray.length}` : undefined}
										$isMobile={mobile}
										className={`${baseClassName}-container`}
										tabIndex={-1}
										data-role={DataRoles.Toast.Container}
									>
										{stacking ? renderingStackedContent : renderingContent}
									</StyledTransitionGroup>
								</ToastGroupContext.Provider>
							</StyledToastGroupWrapper>
						</TabSandbox>
					) : null}
				</div>
			</Portal>
		);
	}

	return orderedChildrenArray.length ? (
		<Portal>
			<TabSandbox focusBackHandler={focusBackHandler} focusBack={focusBack} focusOnOpen={false}>
				<StyledToastGroupWrapper
					isMobile={mobile}
					tabIndex={-1}
					ref={handleWrapperRef}
					style={style}
					className={className}
					data-role={DataRoles.Toast.Group}
					id={id}
					$direction={direction}
				>
					<StyledTransitionGroup
						$isMobile={mobile}
						className={`${baseClassName}-container`}
						tabIndex={-1}
						data-role={DataRoles.Toast.Container}
					>
						{renderingContent}
					</StyledTransitionGroup>
				</StyledToastGroupWrapper>
			</TabSandbox>
		</Portal>
	) : null;
};

ToastGroup.displayName = "ToastGroup";

function getDirectionByPosition(position: ToastGroupProps.Position): ToastGroupProps.Direction {
	switch (position) {
		case "top-left":
		case "top-right":
			return "top-down";
		case "bottom-left":
		case "bottom-right":
		default:
			return "bottom-up";
	}
}

function getOrderedChildrenArray(
	children: ReactNode,
	direction: ToastGroupProps.Direction,
	stackable = false
): ReactNode[] {
	const childrenArray = Children.toArray(children);

	if (stackable) {
		return childrenArray.reverse();
	}

	switch (direction) {
		case "top-down":
			return childrenArray;
		case "bottom-up":
		default:
			return childrenArray.reverse();
	}
}

function getViewportRef(viewport: ToastGroupProps.Viewport, toastGroupRef: HTMLElement): HTMLElement {
	switch (viewport) {
		case "parent":
			return toastGroupRef.parentElement ? toastGroupRef.parentElement : document.body;
		case "window":
			return document.body;
		default:
			return viewport;
	}
}

function updatePosition(wrapperRef: HTMLElement, viewportRef: HTMLElement, position: ToastGroupProps.Position): void {
	resetPosition(wrapperRef);

	const sides = position.split("-") as ("top" | "left" | "bottom" | "right")[];
	sides.forEach((side) => (wrapperRef.style[side] = "0px"));

	if (viewportRef !== document.body) {
		const globalViewportRect = getGlobalViewportBox();
		const viewportRect = viewportRef.getBoundingClientRect();

		switch (position) {
			case "bottom-left":
				updateLeftBottom(wrapperRef, viewportRect, globalViewportRect);
				break;
			case "bottom-right":
				updateRightBottom(wrapperRef, viewportRect, globalViewportRect);
				break;
			case "top-left":
				updateLeftTop(wrapperRef, viewportRect, globalViewportRect);
				break;
			case "top-right":
			default:
				updateRightTop(wrapperRef, viewportRect, globalViewportRect);
		}
	}
}

function resetPosition(wrapperRef: HTMLElement): void {
	wrapperRef.style.bottom = "";
	wrapperRef.style.left = "";
	wrapperRef.style.top = "";
	wrapperRef.style.right = "";
}

function updateLeftBottom(
	wrapperRef: HTMLElement,
	viewportRect: CustomClientRect,
	globalViewportRect: CustomClientRect
): void {
	wrapperRef.style.marginBottom = `${globalViewportRect.bottom - viewportRect.bottom}px`;
	wrapperRef.style.marginLeft = `${viewportRect.left - globalViewportRect.left}px`;
}

function updateRightBottom(
	wrapperRef: HTMLElement,
	viewportRect: CustomClientRect,
	globalViewportRect: CustomClientRect
): void {
	wrapperRef.style.marginBottom = `${globalViewportRect.bottom - viewportRect.bottom}px`;
	wrapperRef.style.marginRight = `${globalViewportRect.right - viewportRect.right}px`;
}

function updateLeftTop(
	wrapperRef: HTMLElement,
	viewportRect: CustomClientRect,
	globalViewportRect: CustomClientRect
): void {
	wrapperRef.style.marginTop = `${viewportRect.top - globalViewportRect.top}px`;
	wrapperRef.style.marginLeft = `${viewportRect.left - globalViewportRect.left}px`;
}

function updateRightTop(
	wrapperRef: HTMLElement,
	viewportRect: CustomClientRect,
	globalViewportRect: CustomClientRect
): void {
	wrapperRef.style.marginTop = `${viewportRect.top - globalViewportRect.top}px`;
	wrapperRef.style.marginRight = `${globalViewportRect.right - viewportRect.right}px`;
}

function updatePositionOnMobile(wrapperRef: HTMLElement): void {
	wrapperRef.style.bottom = "0px";
	wrapperRef.style.right = "0px";
	wrapperRef.style.left = "0px";
}
