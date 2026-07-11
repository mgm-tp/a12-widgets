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

import { useRef, useCallback, useEffect } from "react";
import { useTheme } from "styled-components";
import { useResizeDetector } from "react-resize-detector";

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { TabSandbox } from "../../../common/main/tab-sandbox.view.js";
import type { CustomAnimationConfig } from "../../../layout/index.js";
import { SizeDetectorUtils } from "../../../layout/index.js";
import { useWindowSize } from "../../../layout/size-detector/main/size-detector.view.js";
import { getTransitionDuration } from "../../../common/index.js";

import { normalizePanelWidth } from "../utils.js";

import { contentBoxSidePanelAnimation } from "./contentbox-animations.js";
import { StyledContentBoxContext } from "./contentbox.context.js";
import {
	StyledContentBoxHeader,
	StyledContentBox,
	StyledContentBoxContent,
	StyledContentBoxDetailPanel,
	StyledContentBoxDetailPanelHeader,
	StyledContentBoxSidePanel,
	StyledSupportingPanesLayoutWrapper,
	StyledContentBoxWizardBar
} from "./contentbox.tpl.styled.js";
import type { ContentBoxProps, ContentBoxSidePanels } from "./contentbox.tpl.api.js";

const baseClassName = addPrefix("contentbox");

const isInsidePortal = (node: Node): boolean =>
	node instanceof Element && node.closest(`[data-role="${DataRoles.Portal}"]`) !== null;

const isOverlayPanel = (panel: ContentBoxSidePanels | undefined, isSmallScreen: boolean): boolean =>
	panel !== undefined && !panel.hide && (isSmallScreen || panel.mode === "overlay");

/** @internal */
interface ContentBoxWithSidePanelProps extends Omit<ContentBoxProps, "sidePanels"> {
	sidePanels: NonNullable<ContentBoxProps["sidePanels"]>;
	contentBoxClassName: string | undefined;
	contentBoxContentClassName: string | undefined;
	isWizardCollapsed: boolean;
	handleWizardRef: (ref: HTMLDivElement | null) => void;
	handleContentBoxContentRef: (ref: HTMLDivElement | null) => void;
}

/** @internal */
export const ContentBoxWithSidePanel = ({
	sidePanels,
	contentBoxClassName,
	contentBoxContentClassName,
	isWizardCollapsed,
	handleWizardRef,
	handleContentBoxContentRef,
	wrapperRef,
	id,
	onKeyDown,
	onFocus,
	onBlur,
	style,
	role,
	ariaLabel,
	boxShadow = "default",
	tabIndex,
	padding = true,
	embedded,
	heading,
	notificationArea,
	subHeading,
	wizardBar,
	footer,
	children
}: ContentBoxWithSidePanelProps) => {
	const { transitionDuration, contentTransitionDuration, maxWidth, minWidth } =
		useTheme().components.contentBox.sidePanels;
	const duration = getTransitionDuration(transitionDuration) * 1000;

	const detailPanelRef = useRef<HTMLDivElement | null>(null);
	const supportingPanesWrapperRef = useRef<HTMLDivElement | null>(null);
	const leftPanelFocusBackHandler = useRef<(() => void) | null>(null);
	const rightPanelFocusBackHandler = useRef<(() => void) | null>(null);
	const leftSidePanelRef = useRef<HTMLElement | null>(null);
	const rightSidePanelRef = useRef<HTMLElement | null>(null);

	const { ref: resizeRef, width: contentBoxWidth = 0 } = useResizeDetector({ refreshMode: "debounce", refreshRate: 0 });

	const { breakPoint } = useWindowSize();

	const getWrapperRef = useCallback(
		(ref: HTMLDivElement | null) => {
			wrapperRef?.(ref);
			resizeRef(ref);
		},
		[wrapperRef, resizeRef]
	);

	const handleDetailPanelRef = useCallback((ref: HTMLDivElement | null) => {
		detailPanelRef.current = ref;
	}, []);

	const handleSupportingPanesWrapperRef = useCallback((ref: HTMLDivElement | null) => {
		supportingPanesWrapperRef.current = ref;
	}, []);

	useEffect(() => {
		if (sidePanels.left?.hide && leftPanelFocusBackHandler.current) {
			const timeoutId = setTimeout(() => {
				leftPanelFocusBackHandler.current?.();
			}, duration);

			return () => clearTimeout(timeoutId);
		}

		return;
	}, [duration, sidePanels.left?.hide]);

	useEffect(() => {
		if (sidePanels.right?.hide && rightPanelFocusBackHandler.current) {
			const timeoutId = setTimeout(() => {
				rightPanelFocusBackHandler.current?.();
			}, duration);

			return () => clearTimeout(timeoutId);
		}

		return;
	}, [duration, sidePanels.right?.hide]);

	const [, sm, md] = SizeDetectorUtils.DefaultBreakPoints;
	const isSmallSize = breakPoint.width <= sm.width || contentBoxWidth <= minWidth;
	const isMediumOrSmallerSize = breakPoint.width <= md.width || contentBoxWidth <= minWidth;
	const { left, right } = sidePanels;

	useEffect(() => {
		const leftIsOverlay = isOverlayPanel(left, isMediumOrSmallerSize);
		const rightIsOverlay = isOverlayPanel(right, isMediumOrSmallerSize);

		if (!leftIsOverlay && !rightIsOverlay) {
			return;
		}

		const handleMouseDown = (event: MouseEvent): void => {
			const target = event.target as Node;
			const isOutside = (panelRef?: HTMLElement | null, buttonRef?: HTMLElement | null): boolean => {
				return !!panelRef && !panelRef.contains(target) && !buttonRef?.contains(target) && !isInsidePortal(target);
			};

			if (leftIsOverlay && isOutside(leftSidePanelRef.current, left?.triggerReference?.current)) {
				left?.onClose?.();
			}

			if (rightIsOverlay && isOutside(rightSidePanelRef.current, right?.triggerReference?.current)) {
				right?.onClose?.();
			}
		};

		document.addEventListener("mousedown", handleMouseDown);

		return (): void => {
			document.removeEventListener("mousedown", handleMouseDown);
		};
	}, [left, right, isMediumOrSmallerSize, leftSidePanelRef, rightSidePanelRef, sidePanels]);

	const createPanelAnimation = (width?: string | number): CustomAnimationConfig => {
		const widthValue = normalizePanelWidth(width, minWidth, isSmallSize, maxWidth);

		return contentBoxSidePanelAnimation({
			contentDuration: getTransitionDuration(contentTransitionDuration),
			paneDuration: getTransitionDuration(transitionDuration),
			maxWidth,
			minWidth,
			width: widthValue,
			isSmallSize
		});
	};

	return (
		<StyledContentBoxContext.Provider value={{ embedded }}>
			<StyledContentBox
				ref={getWrapperRef}
				onKeyDown={onKeyDown}
				onFocus={onFocus}
				onBlur={onBlur}
				id={id}
				className={contentBoxClassName}
				style={style}
				tabIndex={-1}
				data-role={DataRoles.Contentbox}
				role={role}
				aria-label={ariaLabel}
				$boxShadow={boxShadow}
			>
				{heading && (
					<StyledContentBoxHeader
						className={`${baseClassName}__header`}
						data-role={DataRoles.Contentbox.Header}
						$noGrow
					>
						{heading}
					</StyledContentBoxHeader>
				)}
				<StyledSupportingPanesLayoutWrapper wrapperRef={handleSupportingPanesWrapperRef}>
					{left && (
						<StyledContentBoxSidePanel
							wrapperRef={(el): void => {
								leftSidePanelRef.current = el;
							}}
							position="left"
							$mode={isMediumOrSmallerSize ? "overlay" : left.mode}
							hide={left.hide}
							customAnimation={createPanelAnimation(left.width)}
						>
							<TabSandbox
								focusOnOpen={!left.hide}
								focusBackHandler={(handler): void => {
									leftPanelFocusBackHandler.current = handler;
								}}
							>
								{left.content}
							</TabSandbox>
						</StyledContentBoxSidePanel>
					)}
					<StyledContentBoxDetailPanel wrapperRef={handleDetailPanelRef}>
						{(wizardBar || notificationArea || subHeading) && (
							<StyledContentBoxDetailPanelHeader>
								{wizardBar && (
									<StyledContentBoxWizardBar
										className={joinClassNames(`${baseClassName}__wizard-bar`, {
											[`${baseClassName}__wizard-bar--collapsed`]: isWizardCollapsed
										})}
										ref={handleWizardRef}
										data-role={DataRoles.Contentbox.WizardBar}
										collapsed={isWizardCollapsed}
									>
										{wizardBar}
									</StyledContentBoxWizardBar>
								)}
								{notificationArea}
								{subHeading}
							</StyledContentBoxDetailPanelHeader>
						)}
						<StyledContentBoxContent
							className={contentBoxContentClassName}
							style={typeof padding !== "boolean" ? { padding } : {}}
							ref={handleContentBoxContentRef}
							data-role={DataRoles.Contentbox.Content}
							tabIndex={tabIndex}
							padding={padding}
							$nonFooter={!footer}
						>
							{children}
						</StyledContentBoxContent>
						{footer}
					</StyledContentBoxDetailPanel>
					{right && (
						<StyledContentBoxSidePanel
							wrapperRef={(el): void => {
								rightSidePanelRef.current = el;
							}}
							position="right"
							$mode={isMediumOrSmallerSize ? "overlay" : right.mode}
							hide={right.hide}
							customAnimation={createPanelAnimation(right.width)}
						>
							<TabSandbox
								focusOnOpen={!right.hide}
								focusBackHandler={(handler): void => {
									rightPanelFocusBackHandler.current = handler;
								}}
							>
								{right.content}
							</TabSandbox>
						</StyledContentBoxSidePanel>
					)}
				</StyledSupportingPanesLayoutWrapper>
			</StyledContentBox>
		</StyledContentBoxContext.Provider>
	);
};

ContentBoxWithSidePanel.displayName = "ContentBoxWithSidePanel";
