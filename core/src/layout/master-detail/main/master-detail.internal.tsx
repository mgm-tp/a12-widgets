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
import type { AnimationDefinition } from "motion/react";
import { AnimatePresence } from "motion/react";
import type { ReactElement, ReactNode } from "react";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";

import type { Container, Identifiable, Styleable } from "../../../common/main/base-props.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { parseShorthandSpacing } from "../../../common/main/utils/css-utils.js";
import type { ResizeCallbackData, ResizeHandlerProps, ResizeOptions } from "../../resizable/resize-handler.api.js";
import { ResizeHandler } from "../../resizable/resize-handler.view.js";
import { useElementDimensions } from "../../resizable/resize-hook.js";

import type { MasterDetailBodyProps, MasterDetailHeaderProps, VisibleView } from "./master-detail.api.js";
import { useTransitionContext } from "./master-detail.context.js";
import {
	useAnimationEvents,
	useMasterDetailAnimationConfig,
	usePaneWidthState
} from "./master-detail.hook.internal.js";
import {
	StyledMasterDetailHeader,
	StyledMasterDetailLayoutBody,
	StyledMasterDetailLayoutPane,
	StyledMasterDetailLayoutPaneContent,
	StyledMasterDetailLayoutPaneContentWrapper,
	StyledMasterDetailTitle
} from "./master-detail.styled.js";
import { getTransformOrigins, updateSeenOrder, type PaneTransformOrigin } from "./master-detail.utils.js";

const baseClassName = addPrefix("masterDetailLayout");

type ResizeablePaneOptions = ResizeOptions & { position: ResizeHandlerProps["position"] };

type LayoutPaneInternalProps = Container &
	Identifiable &
	Styleable & {
		isRtl: boolean;
		numOfColumns: number;
		smallView?: boolean;
		resizableOptions?: ResizeablePaneOptions;
		columnsCount: number;
		dataResizeStop?: { width: number; maxWidth: number };
		enterTransformOrigin?: PaneTransformOrigin;
		exitTransformOrigin?: PaneTransformOrigin;

		/** True while an adjacent pane is animating out, so this pane should grow to fill the freed space. */
		siblingExiting?: boolean;

		/** When true, the pane runs the enter animation on mount */
		animateEnter?: boolean;
		onEnterComplete?: () => void;
		isExistingPane?: boolean;
	};

const LayoutPane = (props: LayoutPaneInternalProps): ReactNode => {
	const { isTransitioning } = useTransitionContext();
	const paneRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);
	const [borderRadius, setBorderRadius] = useState(0);
	const isSinglePane = props.columnsCount <= 1;
	// When a pane is added, if it animates from right to left, its order should be greater than all existing panes (9999). If it animates from left to right, its order should be smaller than all existing panes (-1). This ensures the animation moves in the correct direction.
	const [enteringOrder, setEnteringOrder] = useState<number | undefined>(() =>
		props.animateEnter && isSinglePane ? (props.isRtl ? 9999 : -1) : undefined
	);
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

	useLayoutEffect(() => {
		const contentChild = contentRef.current?.firstElementChild;

		if (!isResizable || !contentChild) {
			return;
		}

		const { borderRadius: contentBorderRadius } = getComputedStyle(contentChild);
		setBorderRadius(parseFloat(contentBorderRadius.split(" ")[0] || "0") || 0);
	}, [isResizable, spacingBetweenPanes]);

	const handleWrapperRef = useCallback((element: HTMLDivElement | null): void => {
		paneRef.current = element;
	}, []);

	const targetWidth: string | undefined = props.smallView
		? "100%"
		: isResizable && typeof width === "number"
			? `${width}px`
			: isResizable && typeof width === "string"
				? width
				: undefined;

	const {
		paneVariants,
		contentVariants,
		MDAnimationStates: { hidden, visible, exit }
	} = useMasterDetailAnimationConfig({
		numOfColumns: props.numOfColumns,
		isResizable: isResizable,
		enterTransformOrigin: props.enterTransformOrigin,
		exitTransformOrigin: props.exitTransformOrigin,
		isSinglePane: props.columnsCount <= 1,
		siblingExiting: props.siblingExiting,
		isExistingPane: props.isExistingPane
	});

	const { onEnterComplete } = props;

	const handleAnimationComplete = useCallback(
		(definition: AnimationDefinition): void => {
			if (definition === visible) {
				setEnteringOrder(undefined);
				onEnterComplete?.();
			}
		},
		[onEnterComplete, visible]
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
			borderRadius={borderRadius}
		>
			<StyledMasterDetailLayoutPane
				className={joinClassNames(
					`${baseClassName}Pane`,
					`${baseClassName}Pane--col-${props.numOfColumns}`,
					props.className
				)}
				style={enteringOrder !== undefined ? { ...props.style, order: enteringOrder } : props.style}
				id={props.id}
				data-role={`${DataRoles.MasterDetail.Layout.Pane}`}
				ref={handleWrapperRef}
				$width={targetWidth}
				$flexGrow={props.numOfColumns}
				$isResizable={Boolean(props.resizableOptions)}
				$isTransitioning={isTransitioning}
				variants={paneVariants}
				custom={props.exitTransformOrigin}
				initial={props.animateEnter ? hidden : false}
				animate={visible}
				exit={exit}
				onAnimationComplete={handleAnimationComplete}
			>
				<StyledMasterDetailLayoutPaneContentWrapper data-role={DataRoles.MasterDetail.Layout.Pane.ContentWrapper}>
					<StyledMasterDetailLayoutPaneContent
						ref={contentRef}
						variants={contentVariants}
						initial={props.animateEnter ? hidden : false}
						animate={visible}
						exit={exit}
						data-role={`${DataRoles.MasterDetail.Layout.Pane.Content}`}
					>
						{props.children}
					</StyledMasterDetailLayoutPaneContent>
				</StyledMasterDetailLayoutPaneContentWrapper>
			</StyledMasterDetailLayoutPane>
		</ResizeHandler>
	);
};

LayoutPane.displayName = "LayoutPane";

/**
 * @internal
 */
export function Body(props: MasterDetailBodyProps): ReactElement {
	/**
	 * Track whether the pane is currently transitioning.
	 * This flag is used to temporarily disable maxWidth for the adjacent pane that is not being resized,
	 * 	ensuring smooth animations and preventing layout constraints during the transition.
	 */
	const { setIsTransitioning, isTransitioning } = useTransitionContext();
	const { onComponentMounted, visibleViews, animation, smallView, className, style, id } = props;
	const [dataResize, setDataResize] = useState<{
		width: number;
		maxWidth: number;
	}>();
	const animate = !(animation && animation.enabled === false);
	const totalVisibleViewColumns = visibleViews.reduce((current, view) => current + (view.width || 0), 0);
	const actualColumnsCount = props.visibleViews.length;

	const [committedColumnsCount, setCommittedColumnsCount] = useState(actualColumnsCount);

	if (animate && actualColumnsCount > committedColumnsCount) {
		setCommittedColumnsCount(actualColumnsCount);
	}

	const columnsCount = animate ? Math.max(actualColumnsCount, committedColumnsCount) : actualColumnsCount;
	const isSinglePane = columnsCount <= 1;

	const isClosing = columnsCount > actualColumnsCount;
	const isRtl = animation?.animateSingleItem === "rtl";

	const handleComponentMounted = useCallback(() => {
		if (onComponentMounted) {
			requestAnimationFrame(onComponentMounted);
		}

		setIsTransitioning(false);
	}, [onComponentMounted, setIsTransitioning]);

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

	useAnimationEvents(isTransitioning, {
		onAnimationStart: animation?.onAnimationStart,
		onAnimationEnd: animation?.onAnimationEnd
	});

	const seenOrderRef = useRef<string[]>([]);
	const prevViewKeysRef = useRef<string[]>([]);
	const isFirstRender = useRef(true);

	// Synchronously track the historical order of pane keys so that exiting panes
	// (kept in the DOM by AnimatePresence) receive a CSS `order` that preserves
	// their visual position in the flex row, regardless of DOM insertion order.
	const currentKeys = props.visibleViews.map((v, i) => v.key ?? v.id ?? "view-" + i);

	updateSeenOrder(seenOrderRef.current, currentKeys);

	const enteringKeys = currentKeys.filter((key) => !prevViewKeysRef.current.includes(key));
	const hasEnteringPane = !isFirstRender.current && enteringKeys.length > 0;

	useEffect(() => {
		const currKeys = props.visibleViews.map((v, i) => v.key ?? v.id ?? "view-" + i);

		if (isFirstRender.current) {
			isFirstRender.current = false;
			prevViewKeysRef.current = currKeys;

			return;
		}

		if (animate) {
			const prevSet = new Set(prevViewKeysRef.current);
			const currSet = new Set(currKeys);
			const hasChange = currKeys.some((k) => !prevSet.has(k)) || prevViewKeysRef.current.some((k) => !currSet.has(k));

			if (hasChange) {
				setIsTransitioning(true);
			}
		}

		prevViewKeysRef.current = currKeys;
	}, [animate, props.visibleViews, setIsTransitioning]);

	const handleEnterComplete = useCallback(() => {
		handleComponentMounted();
	}, [handleComponentMounted]);

	const handleExitComplete = useCallback(() => {
		setCommittedColumnsCount(actualColumnsCount);
		setIsTransitioning(false);
	}, [actualColumnsCount, setIsTransitioning]);

	const renderPane = (view: VisibleView, index: number): ReactElement => {
		let num: number;

		if (isSinglePane) {
			num = 12;
		} else {
			num =
				typeof view.width === "number"
					? view.width
					: totalVisibleViewColumns === 0
						? 12 / columnsCount
						: 12 - totalVisibleViewColumns;
		}

		const key = view.key ?? view.id ?? "view-" + index;
		const paneOrder = seenOrderRef.current.indexOf(key);
		const isExistingPane = hasEnteringPane && !enteringKeys.includes(key);

		return (
			<LayoutPane
				key={key}
				numOfColumns={num}
				smallView={smallView}
				isRtl={isRtl}
				className={className}
				style={{ ...style, order: paneOrder >= 0 ? paneOrder : index }}
				id={id}
				columnsCount={columnsCount}
				siblingExiting={isClosing}
				dataResizeStop={dataResize}
				resizableOptions={getResizableOptions(view, index)}
				{...getTransformOrigins(index, columnsCount, isRtl)}
				animateEnter={animate}
				isExistingPane={isExistingPane}
				onEnterComplete={animate ? handleEnterComplete : undefined}
			>
				{view.element}
			</LayoutPane>
		);
	};

	return (
		<StyledMasterDetailLayoutBody
			$smallView={!!smallView}
			$isSingleView={animation?.animateSingleItem !== undefined}
			className={`${baseClassName}__body`}
			data-role={DataRoles.MasterDetail.Layout.Body}
		>
			{animate ? (
				<AnimatePresence
					initial={false}
					onExitComplete={handleExitComplete}
					custom={isSinglePane ? (isRtl ? "left center" : "right center") : undefined}
				>
					{props.visibleViews.map((view, index) => renderPane(view, index))}
				</AnimatePresence>
			) : (
				props.visibleViews.map((view, index) => (
					<Fragment key={view.key ?? view.id ?? "view-" + index}>{renderPane(view, index)}</Fragment>
				))
			)}
		</StyledMasterDetailLayoutBody>
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
