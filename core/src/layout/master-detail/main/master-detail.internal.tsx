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

/**
 * This is an internal module extracted for automated testing. Do not use.
 */
import type { ReactElement, ReactNode, RefObject } from "react";
import { createRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useTheme } from "styled-components";
import DOMPurify from "dompurify";
import type { CSSTransitionClassNames } from "react-transition-group/CSSTransition.js";

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import type { Container, Identifiable, Styleable } from "../../../common/main/base-props.js";
import { parseShorthandSpacing } from "../../../common/main/utils/css-utils.js";
import { ResizeHandler } from "../../resizable/resize-handler.view.js";
import type { ResizeCallbackData, ResizeHandlerProps, ResizeOptions } from "../../resizable/resize-handler.api.js";
import { useElementDimensions } from "../../resizable/resize-hook.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { MasterDetailBodyProps, MasterDetailHeaderProps, VisibleView } from "./master-detail.api.js";
import {
	StyledMasterDetailHeader,
	StyledMasterDetailLayoutBody,
	StyledMasterDetailLayoutBodyWithoutAnimation,
	StyledMasterDetailLayoutPane,
	StyledMasterDetailPlaceholder,
	StyledMasterDetailTitle
} from "./master-detail.styled.js";
import { useTransitionContext } from "./master-detail.context.js";
import { useAnimationEvents, usePaneWidthState } from "./master-detail.hook.internal.js";

const baseClassName = addPrefix("masterDetailLayout");

// CSS classes set when new items enter/ leave
// the - active classes are placeholders required by library
const CSS_CLASSES: CSSTransitionClassNames = {
	enter: `${baseClassName}Pane--enter`,
	enterActive: `${baseClassName}Pane--enter-active`,
	exit: `${baseClassName}Pane--exit`,
	exitActive: `${baseClassName}Pane--exit-active`
};

type ResizeablePaneOptions = ResizeOptions & { position: ResizeHandlerProps["position"] };

type LayoutPaneInternalProps = Container &
	Identifiable &
	Styleable & {
		isRtl: boolean;
		numOfColumns: number;
		smallView?: boolean;
		wrapperRef?: RefObject<HTMLDivElement | null>;
		resizableOptions?: ResizeablePaneOptions;
		columnsCount: number;
		dataResizeStop?: { width: number; maxWidth: number };
		firstResizablePaneOptions?: ResizeablePaneOptions;
		duration?: number;
	};

const LayoutPane = (props: LayoutPaneInternalProps): ReactNode => {
	const paneRef = useRef<HTMLDivElement | null>(null);
	const isResizable = props.columnsCount === 2 && Boolean(props.resizableOptions);

	const [width, setWidth] = usePaneWidthState({
		paneRef,
		maxWidth: props.resizableOptions?.maxWidth,
		isResizeable: Boolean(props.resizableOptions),
		resizeStopWidth: props.dataResizeStop?.width,
		numOfColumns: props.numOfColumns,
		smallView: props.smallView
	});

	const { absoluteMaxWidth, absoluteMinWidth } = useElementDimensions({
		elementRef: paneRef,
		widthConfig: {
			maxWidth: props.resizableOptions?.maxWidth,
			minWidth: props.resizableOptions?.minWidth
		}
	});
	const {
		components: {
			masterDetailLayout: { spacingBetweenPanes }
		}
	} = useTheme();

	useEffect(() => {
		if (props.wrapperRef) {
			// Updates paneRef to point to the same element as props.wrapperRef if props.wrapperRef is defined. This ensures that both references are synchronized.
			paneRef.current = props.wrapperRef.current;
		}
	}, [props.wrapperRef]);

	const handleResizeStart = (event: MouseEvent, data: ResizeCallbackData): void => {
		setWidth(data.width);
		props.resizableOptions?.onResizeStart?.(event, data);
	};

	const handleResizeStop = (event: MouseEvent, data: ResizeCallbackData): void => {
		setWidth(data.width);
		props.resizableOptions?.onResizeStop?.(event, data);
	};

	const getLayoutGap = (): number => {
		const paddings = parseShorthandSpacing(spacingBetweenPanes);
		const padding = paddings[props.resizableOptions?.position ?? "left"];

		return parseFloat(padding) * 2;
	};

	const getPadding = (): { $left: number; $right: number } | undefined => {
		const layoutGap = getLayoutGap();

		if (!layoutGap || !props.firstResizablePaneOptions) {
			return undefined;
		}

		const isLeftPosition = props.firstResizablePaneOptions.position === "left";

		return {
			$left: isLeftPosition ? layoutGap : 0,
			$right: !isLeftPosition ? layoutGap : 0
		};
	};

	const handleWrapperRef = useCallback(
		(element: HTMLDivElement | null): void => {
			paneRef.current = element;

			if (props.wrapperRef) {
				props.wrapperRef.current = element;
			}
		},
		[props.wrapperRef]
	);

	return (
		<ResizeHandler
			{...props.resizableOptions}
			targetRef={paneRef}
			resizable={isResizable}
			onResizeStop={handleResizeStop}
			onResizeStart={handleResizeStart}
			minWidth={absoluteMinWidth}
			maxWidth={absoluteMaxWidth}
			layoutGap={getLayoutGap()}
		>
			<StyledMasterDetailLayoutPane
				$numOfColumns={props.numOfColumns}
				$smallView={props.smallView}
				$isRtl={props.isRtl}
				className={joinClassNames(
					`${baseClassName}Pane`,
					{ [`${baseClassName}Pane--rtl`]: props.isRtl },
					`${baseClassName}Pane--col-${props.numOfColumns}`,
					props.className
				)}
				style={props.style}
				id={props.id}
				data-role={DataRoles.MasterDetail.Layout.Pane}
				ref={handleWrapperRef}
				$width={width}
				$columnsCount={props.columnsCount}
				$maxWidth={isResizable ? props.resizableOptions?.maxWidth : props.dataResizeStop?.maxWidth}
				$padding={getPadding()}
				$isResizable={Boolean(props.resizableOptions)}
			>
				{props.children}
			</StyledMasterDetailLayoutPane>
		</ResizeHandler>
	);
};

LayoutPane.displayName = "LayoutPane";

// transitionEnterTimeout=1ms has the effect that onEnter, the masterDetailLayoutPane--exit class is added
// but immediately removed again to achieve the animation
/**
 * @internal
 * transitionEnterTimeout=1ms has the effect that onEnter, the masterDetailLayoutPane--exit class is added
 * but immediately removed again to achieve the animation
 */
export function Body(props: MasterDetailBodyProps): ReactElement {
	/**
	 * Track whether the pane is currently transitioning.
	 * This flag is used to temporarily disable maxWidth for the adjacent pane that is not being resized,
	 * 	ensuring smooth animations and preventing layout constraints during the transition.
	 */
	const { setIsTransitioning, isTransitioning } = useTransitionContext();
	const { onComponentMounted, visibleViews, animation, smallView, className, style, id } = props;
	const [dataResize, setDataResize] = useState<{ width: number; maxWidth: number }>();
	const animate = !(animation && animation.enabled === false);
	const totalVisibleViewColumns = visibleViews.reduce((current, view) => current + (view.width || 0), 0);
	const isRtl = animation?.animateSingleItem === "rtl";

	const {
		components: {
			masterDetailLayout: {
				pane: { animationDuration }
			}
		}
	} = useTheme();

	const duration = useMemo(() => {
		if (animationDuration.includes("ms")) {
			return Number(animationDuration.split("ms")[0]);
		}

		return animationDuration.includes("s") ? Number(animationDuration.split("s")[0]) * 1000 : 300;
	}, [animationDuration]);

	const handleComponentMounted = useCallback(() => {
		if (onComponentMounted) {
			requestAnimationFrame(onComponentMounted);
		}

		setIsTransitioning(false);
	}, [onComponentMounted, setIsTransitioning]);

	const BodyWrapper = useMemo(
		() => (animate ? StyledMasterDetailLayoutBody : StyledMasterDetailLayoutBodyWithoutAnimation),
		[animate]
	);

	const columnsCount = props.visibleViews.length;

	const handleResizeStop = (
		event: MouseEvent,
		data: ResizeCallbackData,
		onResizeStopCallback?: ResizeOptions["onResizeStop"]
	): void => {
		if (data.node && data.width && dataResize?.width !== data.width) {
			/**
			 * Determine the maximum allowable width for the adjacent pane that is not being resized.
			 * Setting this maximum width helps ensure a smooth animation effect and prevents unintended layout shifts.
			 */
			const maxWidth = Math.max(0, (data.node.parentElement?.offsetWidth || 0) - data.width);
			setDataResize({ width: data.width, maxWidth });
		}

		onResizeStopCallback?.(event, data);
	};

	const getResizableOptions = (view: VisibleView, index: number): ResizeablePaneOptions | undefined => {
		if (index === 0 && props.firstViewResizableOptions) {
			return {
				...props.firstViewResizableOptions,
				onResizeStop: (event, data) => handleResizeStop(event, data, props.firstViewResizableOptions?.onResizeStop),
				position: "right"
			};
		}

		if (!view.resizableOptions) {
			return undefined;
		}

		const position = index === 0 ? "right" : "left";

		return {
			...view.resizableOptions,
			onResizeStop: (event, data) => handleResizeStop(event, data, view.resizableOptions?.onResizeStop),
			position
		};
	};

	const firstResizablePaneOptions = props.visibleViews
		.map((view, index) => getResizableOptions(view, index))
		.find((options) => !!options);

	useAnimationEvents(isTransitioning, {
		onAnimationStart: animation?.onAnimationStart,
		onAnimationEnd: animation?.onAnimationEnd
	});

	return (
		<BodyWrapper
			$smallView={!!smallView}
			$isAnimateRtl={isRtl}
			$animation={animate}
			className={joinClassNames(`${baseClassName}__body`, {
				[`${baseClassName}__body--row-reverse`]: isRtl
			})}
			data-role={DataRoles.MasterDetail.Layout.Body}
		>
			{props.visibleViews.map((view, index) => {
				let num: number;

				if (props.visibleViews.length <= 1) {
					num = 12;
				} else {
					num =
						typeof view.width === "number"
							? view.width
							: totalVisibleViewColumns === 0
								? 12 / props.visibleViews.length
								: 12 - totalVisibleViewColumns;
				}

				const wrapperRef = createRef<HTMLDivElement | null>();

				const paneRenderer = (shouldRenderPlaceholder?: boolean): ReactElement => {
					return (
						<LayoutPane
							numOfColumns={num}
							smallView={smallView}
							isRtl={isRtl}
							className={className}
							style={style}
							id={id}
							wrapperRef={wrapperRef}
							columnsCount={columnsCount}
							dataResizeStop={dataResize}
							resizableOptions={getResizableOptions(view, index)}
							firstResizablePaneOptions={firstResizablePaneOptions}
							duration={duration}
						>
							{shouldRenderPlaceholder && wrapperRef.current?.innerHTML ? (
								<StyledMasterDetailPlaceholder
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(wrapperRef.current.innerHTML) ?? ""
									}}
								/>
							) : (
								view.element
							)}
						</LayoutPane>
					);
				};

				if (animate) {
					return (
						<CSSTransition
							key={view.key || "view-" + index}
							classNames={CSS_CLASSES}
							timeout={{ enter: duration, exit: duration }}
							enter
							exit
							nodeRef={wrapperRef}
							onEnter={() => setIsTransitioning(true)}
							onEntered={handleComponentMounted}
							onExit={() => setIsTransitioning(true)}
							onExited={() => setIsTransitioning(false)}
						>
							{(status) => paneRenderer(status === "exiting" || status === "exited" || status === "unmounted")}
						</CSSTransition>
					);
				}

				return <Fragment key={view.key || "view-" + index}>{paneRenderer()}</Fragment>;
			})}
		</BodyWrapper>
	);
}

Body.displayName = "Body";

export function Header(props: MasterDetailHeaderProps): ReactElement<MasterDetailHeaderProps> | null {
	return props.title ? (
		<StyledMasterDetailHeader
			className={joinClassNames(`${baseClassName}__header`, props.className)}
			style={props.style}
			id={props.id}
			data-role={DataRoles.MasterDetail.Header}
		>
			<StyledMasterDetailTitle
				className={`${baseClassName}__title`}
				key="title"
				data-role={DataRoles.MasterDetail.Layout.Title}
			>
				{props.title}
			</StyledMasterDetailTitle>
		</StyledMasterDetailHeader>
	) : null;
}

Header.displayName = "Header";
