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

import type { CSSProperties, KeyboardEvent, ReactElement, ReactNode } from "react";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { useResizeDetector } from "react-resize-detector";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { getMobileOperatingSystem, provider } from "../../../common/main/device-detector.js";
import { ResizeHandler } from "../../resizable/resize-handler.view.js";
import type { ResizeEventHandler } from "../../resizable/resize-handler.api.js";
import { useElementDimensions } from "../../resizable/resize-hook.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { ApplicationFrameProps, StyledSlot } from "./application-frame.api.js";
import { StyledApplicationFrame } from "./application-frame.styled.js";
import { useSideBarExpandedWidth } from "./application-frame.hook.internal.js";

const {
	StyledHeader,
	StyledSidebar,
	StyledSidebarContainer,
	StyledMainContainer,
	StyledWrapper,
	StyledContent,
	StyledToggleSidebarButtonWrapper,
	StyledToggleSidebarButton,
	StyledFooter
} = StyledApplicationFrame;

const baseContentClassName = addPrefix("content");
const baseSubClassName = addPrefix("sidebar");
const baseMainClassName = addPrefix("main__container");

export function ApplicationFrame(props: ApplicationFrameProps): ReactElement<ApplicationFrameProps> {
	const {
		id,
		sub,
		disableCollapsingSub,
		style,
		className,
		main,
		content,
		footer,
		subToolbar,
		subExpandedState,
		contentToolbar,
		wrapperRef,
		htmlAttributes,
		closeSubOnClickOutside,
		useToggleButton,
		subResizableOptions,
		onExpansionChange
	} = props;

	const {
		components: {
			applicationFrame: { sidebar }
		}
	} = useTheme();

	const stickyFooterProp = props.stickyFooter ?? true;
	const subExpanded = useMemo(
		() => props.subExpanded || (disableCollapsingSub && !subExpandedState),
		[disableCollapsingSub, props.subExpanded, subExpandedState]
	);
	const lastResizedWidthRef = useRef<number | null>(null);
	const minimizedSub = subExpandedState === "minimized" && props.subExpanded !== false;
	const maximizedSub = subExpandedState === "maximized" && props.subExpanded !== false;
	const isResizableOptionsProvided = typeof subResizableOptions !== "boolean";

	const sideBarRef = useRef<HTMLDivElement | null>(null);
	const { maxWidth = undefined, minWidth = undefined } = isResizableOptionsProvided ? subResizableOptions || {} : {};
	const { absoluteMaxWidth, absoluteMinWidth } = useElementDimensions({
		elementRef: sideBarRef,
		widthConfig: { maxWidth: maxWidth, minWidth: minWidth }
	});

	const expandedMinimizedWidth = useSideBarExpandedWidth({ sideBarRef, maxWidth, minWidth });

	const getSidebarWidth = useCallback(() => {
		if (maximizedSub) {
			return "100%";
		}

		if (minimizedSub) {
			if (lastResizedWidthRef.current) {
				return `${absoluteMaxWidth ? Math.min(lastResizedWidthRef.current, absoluteMaxWidth) : lastResizedWidthRef.current}px`;
			}

			return expandedMinimizedWidth;
		}

		return subExpanded ? sidebar.expandedWidth : sidebar.width;
	}, [
		absoluteMaxWidth,
		expandedMinimizedWidth,
		maximizedSub,
		minimizedSub,
		sidebar.expandedWidth,
		sidebar.width,
		subExpanded
	]);

	const currentScreenPosition = useRef(0);
	const isPhone = provider.isPhone();

	const toggleButtonWrapperRef = useRef<HTMLElement | null>(null);
	const sideBarContainerRef = useRef<HTMLDivElement | null>(null);
	const [showIcon, setShowIcon] = useState(!!useToggleButton);
	const [showScrollbar, setShowScrollbar] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(() => getSidebarWidth());

	const hasStickyFooter = stickyFooterProp || (!isPhone && !!sub);
	const contentClassNames = joinClassNames(
		baseContentClassName,
		{ [`${baseContentClassName}--sidebar`]: sub },
		{ [`${baseContentClassName}--scrollableSidebar`]: sub && showScrollbar },
		{ [`${baseContentClassName}--collapsingDisabled`]: disableCollapsingSub },
		{ "horiz-resize": subResizableOptions }
	);
	const subClassNames = joinClassNames(
		baseSubClassName,
		{ [`${baseSubClassName}--expanded ${baseSubClassName}--overlap`]: subExpanded },
		{ [`${baseSubClassName}--${subExpandedState}`]: subExpandedState && props.subExpanded !== false },
		{ [`${baseSubClassName}--collapsible`]: !disableCollapsingSub }
	);
	const mainClassNames = joinClassNames(
		baseMainClassName,
		{ [`${baseMainClassName}--animation`]: sub },
		{ [`${baseMainClassName}--collapsed`]: subExpanded }
	);

	const shouldShowContent =
		!!content && (!sub || props.subExpanded === false ? true : subExpandedState !== "maximized");

	const getToggleButtonWrapperRef = (ref: HTMLElement | null): void => {
		toggleButtonWrapperRef.current = ref;
	};

	const toggleSidebar = useCallback((): void => {
		onExpansionChange?.(!props.subExpanded);
	}, [onExpansionChange, props.subExpanded]);

	const collapsesSideBar = useCallback(
		(element: HTMLElement): void => {
			const shouldCloseSubOnClickOutside =
				closeSubOnClickOutside !== undefined ? closeSubOnClickOutside : provider.isTablet();

			if (
				!sideBarRef.current?.contains(element) &&
				!disableCollapsingSub &&
				shouldCloseSubOnClickOutside &&
				props.subExpanded &&
				!toggleButtonWrapperRef.current?.contains(element)
			) {
				onExpansionChange?.(false);
			}
		},
		[closeSubOnClickOutside, disableCollapsingSub, props.subExpanded, onExpansionChange]
	);

	const handleResizeSidebar = useCallback((): void => {
		if (sideBarRef.current && !isPhone) {
			const isSidebarOverflowed = sideBarRef.current.scrollHeight > sideBarRef.current.offsetHeight;
			setShowScrollbar(isSidebarOverflowed);
		}
	}, [isPhone, sideBarRef]);

	const handleContentKeyUp = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			if (event.key === "Tab") {
				collapsesSideBar(event.target as HTMLElement);
			}
		},
		[collapsesSideBar]
	);

	const renderToggleSidebarButton = useCallback(
		(smallView: boolean): ReactElement => {
			const iconName = smallView
				? props.subExpanded
					? "close"
					: "more_vert"
				: props.subExpanded
					? "chevron_left"
					: "chevron_right";

			return (
				<ApplicationFrame.ToggleSidebarButton
					wrapperRef={getToggleButtonWrapperRef}
					onClick={toggleSidebar}
					subExpanded={props.subExpanded}
					icon={<Icon>{iconName}</Icon>}
					smallView={smallView}
				/>
			);
		},
		[props.subExpanded, toggleSidebar]
	);

	const handleResizeStop: ResizeEventHandler = (event, data) => {
		setSidebarWidth(`${data.width}px`);
		lastResizedWidthRef.current = data.width;

		if (isResizableOptionsProvided) {
			subResizableOptions?.onResizeStop?.(event, data);
		}
	};

	useEffect(() => {
		setSidebarWidth(getSidebarWidth());
	}, [getSidebarWidth]);

	useEffect(() => {
		const handleApplicationMouseDown = (event: MouseEvent): void => {
			collapsesSideBar(event.target as HTMLElement);
		};

		const handleTouchMove = (event: TouchEvent): void => {
			// Only detect touch move when useToggleButton is true
			if (!useToggleButton) {
				return;
			}

			const screenPosition = event.touches[0].clientY;

			if (screenPosition > currentScreenPosition.current) {
				// scroll up
				setShowIcon(true);
			} else {
				// scroll down
				setShowIcon(false);
			}

			currentScreenPosition.current = screenPosition;
		};

		window.addEventListener("mousedown", handleApplicationMouseDown);
		window.addEventListener("touchmove", handleTouchMove, false);

		return (): void => {
			window.removeEventListener("mousedown", handleApplicationMouseDown);
			window.removeEventListener("touchmove", handleTouchMove);
		};
	}, [collapsesSideBar, useToggleButton]);

	useLayoutEffect(() => {
		const IOS_MAX_SCALE = "maximum-scale=1";
		const ANDROID_INTERACTIVE_WIDGET = "interactive-widget=resizes-content";

		const metaViewport = document.querySelector("meta[name=viewport]");
		const currentContent = metaViewport?.getAttribute("content");

		// To prevent auto-zoom in when focusing on an element that has a font-size < 16px.
		if (getMobileOperatingSystem() === "iOS" && !currentContent?.includes("maximum-scale")) {
			metaViewport?.setAttribute("content", `${currentContent}, ${IOS_MAX_SCALE}`);
		}

		// Resize both the visual viewport and layout viewport to prevent the on-screen keyboard from overlapping the content.
		if (getMobileOperatingSystem() === "Android" && !currentContent?.includes("interactive-widget")) {
			metaViewport?.setAttribute("content", `${currentContent}, ${ANDROID_INTERACTIVE_WIDGET}`);
		}
	});

	useResizeDetector({
		onResize: handleResizeSidebar,
		targetRef: sideBarContainerRef,
		refreshMode: "debounce",
		refreshRate: 50
	});

	useEffect(() => {
		setShowIcon(!!useToggleButton);
	}, [useToggleButton]);

	return (
		<StyledWrapper
			id={id}
			className={joinClassNames(addPrefix("wrapper"), className)}
			style={style}
			data-role={DataRoles.ApplicationFrame}
			ref={wrapperRef}
			$stickyFooter={hasStickyFooter}
		>
			{main && (
				<StyledHeader
					className={addPrefix("header")}
					style={ApplicationFrame.getStyle(main)}
					data-role={DataRoles.ApplicationFrame.Header}
					{...htmlAttributes?.headerAttributes}
				>
					{ApplicationFrame.getContent(main)}
				</StyledHeader>
			)}
			<StyledContent
				className={contentClassNames}
				onKeyUp={handleContentKeyUp}
				data-role={DataRoles.ApplicationFrame.Content}
				$hasToggleButton={showIcon && subExpanded}
				{...htmlAttributes?.contentAttributes}
				$subExpanded={subExpanded}
				$disabledCollapsingSub={disableCollapsingSub}
			>
				{sub && (
					<ResizeHandler
						{...(isResizableOptionsProvided ? subResizableOptions : {})}
						maxWidth={absoluteMaxWidth}
						minWidth={absoluteMinWidth}
						onResizeStop={handleResizeStop}
						resizable={!!subResizableOptions && shouldShowContent && props.subExpanded}
						targetRef={sideBarRef}
					>
						<StyledSidebar
							className={subClassNames}
							style={ApplicationFrame.getStyle(sub)}
							ref={sideBarRef}
							data-role={DataRoles.ApplicationFrame.Sidebar.Wrapper}
							$width={sidebarWidth}
							$subExpanded={subExpanded}
							$disabledCollapsingSub={disableCollapsingSub}
							$minimized={minimizedSub}
							$maximized={maximizedSub}
							$resizable={!!subResizableOptions}
						>
							<StyledSidebarContainer
								className={addPrefix("sidebar__container")}
								data-role={DataRoles.ApplicationFrame.Sidebar}
								ref={sideBarContainerRef}
							>
								{subToolbar}
								{ApplicationFrame.getContent(sub)}
							</StyledSidebarContainer>
							{!disableCollapsingSub && renderToggleSidebarButton(false)}
						</StyledSidebar>
					</ResizeHandler>
				)}
				{shouldShowContent && (
					<StyledMainContainer
						className={mainClassNames}
						role="main"
						tabIndex={!isPhone ? -1 : undefined}
						style={ApplicationFrame.getStyle(content)}
						data-role={DataRoles.ApplicationFrame.Main}
						$sub={!!sub}
						$sidebarWidth={sidebarWidth}
						{...props.htmlAttributes?.mainContainerAttributes}
					>
						{contentToolbar}
						{ApplicationFrame.getContent(content)}
					</StyledMainContainer>
				)}
			</StyledContent>
			{sub && showIcon && renderToggleSidebarButton(true)}
			{footer && (
				<StyledFooter
					className={addPrefix("footer")}
					role="contentinfo"
					style={ApplicationFrame.getStyle(footer)}
					data-role={DataRoles.ApplicationFrame.Footer}
					{...props.htmlAttributes?.footerAttributes}
				>
					{ApplicationFrame.getContent(footer)}
				</StyledFooter>
			)}
		</StyledWrapper>
	);
}

ApplicationFrame.displayName = "ApplicationFrame";

export namespace ApplicationFrame {
	const isStyledSlot = (e: ReactNode | StyledSlot): e is StyledSlot =>
		e instanceof Object &&
		Object.prototype.hasOwnProperty.call(e, "content") &&
		Object.prototype.hasOwnProperty.call(e, "style");

	export function getContent(e: ReactNode | StyledSlot): ReactNode {
		return isStyledSlot(e) ? e.content : e;
	}

	export function getStyle(e: ReactNode | StyledSlot): CSSProperties {
		return isStyledSlot(e) ? e.style : {};
	}

	export function ToggleSidebarButton(
		props: ApplicationFrameProps.ToggleSidebarButtonProps
	): ReactElement<ApplicationFrameProps.ToggleSidebarButtonProps> {
		const { applicationFrameTitles: a11yTitles } = useContext(A11YLanguageContext);
		const { onClick, icon, smallView, subExpanded, wrapperRef } = props;
		const baseToggleClassName = addPrefix("sidebar__trigger");

		return (
			<StyledToggleSidebarButtonWrapper
				ref={wrapperRef}
				className={joinClassNames(
					baseToggleClassName,
					smallView ? `${baseToggleClassName}--smallView` : `${baseToggleClassName}--largeView`,
					subExpanded ? `${baseToggleClassName}--closed` : `${baseToggleClassName}--opened`
				)}
				data-role={DataRoles.ApplicationFrame.ToggleSidebarButton}
				$smallView={smallView}
			>
				<StyledToggleSidebarButton
					buttonAttributes={{ "aria-expanded": !!subExpanded }}
					title={subExpanded ? a11yTitles?.sidebarCollapseButton : a11yTitles?.sidebarExpandButton}
					icon={icon}
					onClick={onClick}
					$subExpanded={subExpanded}
					$smallView={smallView}
				/>
			</StyledToggleSidebarButtonWrapper>
		);
	}
}
