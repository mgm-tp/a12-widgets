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

import type { FC } from "react";
import { useContext, useRef, useState, useCallback, useEffect, Fragment } from "react";
import type { ResizePayload, OnResizeCallback } from "react-resize-detector";
import { useResizeDetector } from "react-resize-detector";

import {
	addPrefix,
	handleAriaHiddenOfWrapper,
	joinClassNames,
	noop,
	usePreviousProps
} from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { TabSandbox } from "../../common/main/tab-sandbox.view.js";
import { Portal } from "../../portal/main/portal.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { useDeferredMount } from "../../common/main/hooks.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ProgressIndicatorProps, ProgressIndicatorSize } from "./progress-indicator.api.js";
import {
	StyledLoadingCircle,
	StyledLoadingCircleLayer,
	StyledLoadingCircleSpinner,
	StyledLoadingHalfCircle,
	StyledLoadingInnerOverlay,
	StyledLoadingLabel,
	StyledLoadingOuterOverlay
} from "./progress-indicator.styled.js";

const baseClassName = addPrefix("loading");

export const ProgressIndicator: FC<ProgressIndicatorProps> = ({
	size = "big",
	dynamicHeightThreshold = 0.9,
	openingDelay = 0,
	...rest
}) => {
	const a11yContext = useContext(A11YLanguageContext);

	const {
		fastAppear,
		singleOverlay,
		outerOverlayVariant,
		global,
		className,
		type,
		innerOverlayVariant,
		useLoadingDots,
		label,
		style,
		color,
		id,
		hideLoadingCircle,
		noTabIndex,
		focusOnOpen,
		wrapperRef,
		scrollIntoView
	} = rest;

	const shouldFocusOnOpen = focusOnOpen || global;

	// In case the role "status" is used for the progress indicator, there will be a delay in mounting the hidden label so that screen readers can read it.
	const deferredMessageMount = useDeferredMount(shouldFocusOnOpen ? 0 : openingDelay + 500);

	const outerOverlayRef = useRef<HTMLDivElement | null>(null);
	const innerOverlayRef = useRef<HTMLDivElement | null>(null);
	const parentRef = useRef<HTMLElement | null>(null);
	const initialParentPositionRef = useRef<string | null>(null);
	const innerOverlayHeight = useRef<number | null>(null);
	const innerOverlayMediumHeight = useRef<number | null>(null);
	const parentPosChanged = useRef(false);
	const parentOverflow = useRef<{ x: string; y: string }>({ x: "", y: "" });

	const timeoutId = useRef<number | null>(null);
	const [sizeState, setSizeState] = useState<ProgressIndicatorSize | undefined>(size);
	const [visible, setVisible] = useState(false);

	const prevSize = usePreviousProps(size);

	const getOuterOverlayRef = (ref: HTMLDivElement | null): void => {
		outerOverlayRef.current = ref;
		wrapperRef?.(ref);
	};

	const updateInnerOverlayScrollHeight = useCallback((): void => {
		if (innerOverlayRef.current) {
			const baseInnerClassName = `${baseClassName}__innerOverlay`;
			innerOverlayRef.current.classList.remove(`${baseInnerClassName}--${size}`);
			innerOverlayHeight.current = innerOverlayRef.current.clientHeight;
			innerOverlayRef.current.classList.add(`${baseInnerClassName}--medium`);
			innerOverlayMediumHeight.current = innerOverlayRef.current.clientHeight;
			innerOverlayRef.current.classList.remove(`${baseInnerClassName}--medium`);
			innerOverlayRef.current.classList.add(`${baseInnerClassName}--${size}`);
		}
	}, [size]);

	const setParentOverflow = (hide = false): void => {
		if (parentRef.current) {
			parentRef.current.style.overflowX = hide ? "hidden" : parentOverflow.current.x;
			parentRef.current.style.overflowY = hide ? "hidden" : parentOverflow.current.y;
		}
	};

	/**
	 * If parent has position of "static" then set it to "relative"
	 * @param resetToDefault Reset parent's position to default
	 */
	const updateParentPos = (resetToDefault = false): void => {
		if (parentRef.current) {
			const parentComputedStyle = window.getComputedStyle(parentRef.current);
			const { position } = parentComputedStyle;

			if (!initialParentPositionRef.current) {
				initialParentPositionRef.current = position;
			}

			if (resetToDefault) {
				if (parentPosChanged) {
					parentRef.current.style.position =
						initialParentPositionRef.current !== "static" ? initialParentPositionRef.current : "";
					parentPosChanged.current = false;
				}
			} else if (!position || position === "static") {
				parentRef.current.style.position = "relative";
				parentPosChanged.current = true;
			}
		}
	};

	/**
	 * Adjust the widget size based on wrapper height
	 */
	const adjustSize = useCallback<OnResizeCallback>(
		({ height }: ResizePayload) => {
			if (!innerOverlayHeight.current || !innerOverlayMediumHeight.current) {
				updateInnerOverlayScrollHeight();
			}

			if (
				dynamicHeightThreshold &&
				innerOverlayRef.current &&
				(size === "big" || size === "default") &&
				innerOverlayHeight.current &&
				parentRef.current &&
				innerOverlayMediumHeight.current
			) {
				const wrapperHeight = height || parentRef.current.clientHeight;
				const dynamicHeight = dynamicHeightThreshold * wrapperHeight;
				setSizeState(
					dynamicHeight > innerOverlayHeight.current
						? "big"
						: dynamicHeight > innerOverlayMediumHeight.current
							? "medium"
							: "small"
				);
			}
		},
		[dynamicHeightThreshold, size, updateInnerOverlayScrollHeight]
	);

	const clearTimeout = (): void => {
		if (timeoutId.current) {
			window.clearTimeout(timeoutId.current);
			timeoutId.current = null;
		}
	};

	const handleOuterClick = (): void => {
		if (global) {
			innerOverlayRef.current?.focus();
		}
	};

	useEffect(() => {
		if (visible) {
			setParentOverflow(true);

			if (focusOnOpen) {
				innerOverlayRef.current?.focus();
			} else if (scrollIntoView && !global) {
				innerOverlayRef.current?.scrollIntoView({
					block: "center"
				});
			}
		}
	}, [focusOnOpen, global, scrollIntoView, visible]);

	useEffect(() => {
		if (global) {
			handleAriaHiddenOfWrapper();
		}

		return () => {
			if (parentRef.current) {
				setParentOverflow();
				updateParentPos(true);
			}

			if (global) {
				handleAriaHiddenOfWrapper(false);
			}

			clearTimeout();
		};
	}, [global]);

	useEffect(() => {
		const updateOuterOverlayPos = (): void => {
			if (outerOverlayRef.current && parentRef.current) {
				outerOverlayRef.current.style.top = `${parentRef.current.scrollTop}px`;
				outerOverlayRef.current.style.left = `${parentRef.current.scrollLeft}px`;
			}
		};

		const showProgressIndicator = (): void => {
			parentRef.current = outerOverlayRef.current && outerOverlayRef.current.parentElement;

			if (parentRef.current) {
				parentOverflow.current = { x: parentRef.current.style.overflowX, y: parentRef.current.style.overflowY };
			}

			updateParentPos();
			updateOuterOverlayPos();

			clearTimeout();
			timeoutId.current = window.setTimeout(() => {
				setVisible(true);
			}, openingDelay);
		};

		const handleOnLoad = (): void => {
			updateInnerOverlayScrollHeight();
			showProgressIndicator();
		};

		window.addEventListener("load", handleOnLoad);
		showProgressIndicator();

		return () => {
			window.removeEventListener("load", handleOnLoad);
		};
	}, [openingDelay, updateInnerOverlayScrollHeight]);

	useEffect(() => {
		if (size !== prevSize && size !== sizeState) {
			setSizeState(size);
		}
	}, [prevSize, size, sizeState]);

	const outerOverlayClassNames = joinClassNames(
		`${baseClassName}__outerOverlay`,
		{ [`${baseClassName}__outerOverlay--no-animation`]: fastAppear },
		{ [`${baseClassName}__outerOverlay--singleOverlay`]: singleOverlay },
		{ [`${baseClassName}__outerOverlay--${outerOverlayVariant}`]: outerOverlayVariant },
		{ [`${baseClassName}__outerOverlay--global`]: global },
		className
	);
	const innerOverlayClassNames = joinClassNames(
		`${baseClassName}__innerOverlay`,
		{ [`${baseClassName}__innerOverlay--${sizeState}`]: sizeState && sizeState !== "big" },
		{ [addPrefix("-u-flex-row")]: type === "horizontal" },
		{ [`${baseClassName}__innerOverlay--${innerOverlayVariant}`]: innerOverlayVariant }
	);
	const labelClassNames = joinClassNames(`${baseClassName}__label`, {
		[`${baseClassName}__label--dots`]: useLoadingDots
	});
	const hiddenLabelId = id ? `${id}-loading-hidden-label` : "loading-hidden-label";
	const labelId = id ? `${id}-loading-label` : "loading-label";
	const hiddenLoadingLabel = a11yContext.progressIndicatorTitles?.loadingLabel;
	const InnerOverLayWrapper = global ? TabSandbox : Fragment;
	const innerOverlayProps = global ? { focusOnOpen: true, hasFocusStyle: true } : undefined;

	useResizeDetector({
		handleWidth: false,
		targetRef: outerOverlayRef,
		onResize: adjustSize,
		refreshMode: "debounce",
		refreshRate: 0
	});

	const content = (
		<StyledLoadingOuterOverlay
			ref={getOuterOverlayRef}
			style={style}
			className={outerOverlayClassNames}
			single={singleOverlay}
			variant={outerOverlayVariant}
			visible={visible}
			global={global}
			id={id}
			tabIndex={noTabIndex ? undefined : -1}
			onClick={global ? handleOuterClick : undefined}
			onKeyDown={noop}
			data-role={DataRoles.ProgressIndicator.OuterOverlay}
			role={shouldFocusOnOpen ? undefined : "status"}
		>
			{visible && (
				<InnerOverLayWrapper {...innerOverlayProps}>
					<StyledLoadingInnerOverlay
						ref={innerOverlayRef}
						className={innerOverlayClassNames}
						tabIndex={noTabIndex ? undefined : 0}
						data-role={DataRoles.ProgressIndicator.InnerOverlay}
						single={singleOverlay}
						noAnimation={fastAppear}
						variant={innerOverlayVariant}
					>
						{!hideLoadingCircle && (
							<StyledLoadingCircle
								noAnimation={fastAppear}
								size={sizeState}
								horizontal={type === "horizontal"}
								className={`${baseClassName}__circle`}
								aria-hidden={true}
								data-role={DataRoles.ProgressIndicator.Circle}
							>
								<StyledLoadingCircleLayer className={`${baseClassName}__circle-layer`} borderColor={color}>
									<StyledLoadingHalfCircle
										className={`${baseClassName}__half-circle ${baseClassName}__half-circle--left`}
									>
										<StyledLoadingCircleSpinner
											position="left"
											className={`${baseClassName}__circle-spinner`}
											data-role={DataRoles.ProgressIndicator.CircleSpinner}
										/>
									</StyledLoadingHalfCircle>
									<StyledLoadingHalfCircle
										className={`${baseClassName}__half-circle ${baseClassName}__half-circle--right`}
									>
										<StyledLoadingCircleSpinner
											position="right"
											className={`${baseClassName}__circle-spinner`}
											data-role={DataRoles.ProgressIndicator.CircleSpinner}
										/>
									</StyledLoadingHalfCircle>
								</StyledLoadingCircleLayer>
							</StyledLoadingCircle>
						)}
						{label && (
							<StyledLoadingLabel
								useDots={useLoadingDots}
								noAnimation={fastAppear}
								small={sizeState === "small"}
								innerOverlayVariant={innerOverlayVariant}
								outerOverlayVariant={outerOverlayVariant}
								id={labelId}
								className={labelClassNames}
								style={color ? { color: color } : undefined}
								data-role={DataRoles.ProgressIndicator.Label}
								aria-hidden="true"
							>
								{label}
							</StyledLoadingLabel>
						)}
						{(label || hiddenLoadingLabel) && deferredMessageMount && (
							<HiddenText id={hiddenLabelId}>{label ?? hiddenLoadingLabel}</HiddenText>
						)}
					</StyledLoadingInnerOverlay>
				</InnerOverLayWrapper>
			)}
		</StyledLoadingOuterOverlay>
	);

	return global ? <Portal>{content}</Portal> : content;
};

ProgressIndicator.displayName = "ProgressIndicator";
