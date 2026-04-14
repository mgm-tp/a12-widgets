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

import type { ReactNode } from "react";
import { useRef, useState, useCallback, useEffect } from "react";

import { useIsMount } from "../../../common/main/hooks.js";

import { ResizeHandle } from "./resize/resize-handle.view.js";
import type { SupportingPanesLayoutProps } from "./supporting-panes-layout.api.js";
import { SecondaryPaneAnimation } from "./secondary-pane-animation.js";
import { useLayoutWidth } from "./supporting-panes-layout.utils.js";

export function SPLSecondaryPane(props: SupportingPanesLayoutProps.SecondaryPaneProps): ReactNode {
	const {
		children,
		widthConfig,
		collapsed: collapsedProp = false,
		hide,
		position,
		resizeOptions,
		wrapperRef,
		onToggleCollapsed,
		htmlAttributes,
		...rest
	} = props;

	const { minWidth, maxWidth, onResizeStart, onResize, onResizeStop } = resizeOptions ?? {};
	const { collapsed: collapsedWidthProp, expanded: expandedWidthProp = "25%" } = widthConfig ?? {};

	const paneRef = useRef<HTMLElement | null>(null);
	const isResized = useRef(false);
	const isExpandingOrCollapsing = useRef(false);
	const isMounted = useIsMount();

	const { resizeMaxWidth, resizeMinWidth, collapsedWidth, expandedWidth } = useLayoutWidth({
		paneRef,
		hide,
		widthConfig: {
			collapsed: collapsedWidthProp,
			expanded: expandedWidthProp,
			minResize: minWidth,
			maxResize: maxWidth
		}
	});

	const [paneWidth, setPaneWidth] = useState<number | string>(
		collapsedProp ? (collapsedWidthProp ?? 0) : expandedWidthProp
	);

	const width = typeof paneWidth === "number" ? `${paneWidth}px` : paneWidth;

	const handlePaneRef = useCallback(
		(instance: HTMLDivElement | null) => {
			paneRef.current = instance;
			wrapperRef?.(instance);
		},
		[wrapperRef]
	);

	const handleEndResize = useCallback(
		(
			event: MouseEvent,
			payload: {
				resizedElement: HTMLElement | null;
				siblingElement: HTMLElement | null;
				resizedElementWidth: number;
				siblingElementWidth: number;
			}
		) => {
			setPaneWidth(payload.resizedElementWidth);
			isResized.current = true;
			isExpandingOrCollapsing.current = false;
			onResizeStop?.(event, { ...payload, isAtCollapsedWidth: payload.resizedElementWidth === collapsedWidth });
		},
		[collapsedWidth, onResizeStop]
	);

	const handleDoubleClick = useCallback(() => {
		isResized.current = false;
		isExpandingOrCollapsing.current = true;

		if (collapsedProp) {
			// Expand if the pane is currently collapsed
			setPaneWidth(expandedWidth);
			onToggleCollapsed?.();
		} else if (paneWidth === expandedWidth || paneWidth === expandedWidthProp) {
			// If currently expanded, collapse it
			setPaneWidth(collapsedWidth);
			onToggleCollapsed?.();
		} else {
			// If partially resized, reset to default expanded width
			setPaneWidth(expandedWidth);
		}
	}, [collapsedProp, paneWidth, expandedWidth, expandedWidthProp, onToggleCollapsed, collapsedWidth]);

	useEffect(() => {
		if (!hide) {
			setPaneWidth(
				collapsedProp
					? collapsedWidth
					: typeof paneWidth === "number" && paneWidth > collapsedWidth
						? paneWidth
						: expandedWidthProp
			);
		}
	}, [collapsedProp, collapsedWidth, expandedWidth, expandedWidthProp, hide, paneWidth]);

	useEffect(() => {
		if (isMounted) {
			isExpandingOrCollapsing.current = true;
		}
	}, [isMounted, collapsedProp, paneWidth]);

	const resizeHandleRenderer = useCallback(
		(position: SupportingPanesLayoutProps.SecondaryPanePosition) => (
			<ResizeHandle
				targetPosition={position}
				targetRef={paneRef}
				minWidth={resizeMinWidth}
				maxWidth={resizeMaxWidth}
				collapsedWidth={collapsedWidth}
				onResizeEnd={handleEndResize}
				onResize={onResize}
				onResizeStart={onResizeStart}
				onDoubleClick={handleDoubleClick}
			/>
		),
		[collapsedWidth, handleDoubleClick, handleEndResize, onResize, onResizeStart, resizeMaxWidth, resizeMinWidth]
	);

	return (
		<SecondaryPaneAnimation
			{...rest}
			hide={hide}
			width={width}
			position={position}
			isResized={isResized}
			collapsed={collapsedProp}
			isExpandingOrCollapsing={isExpandingOrCollapsing}
			ref={handlePaneRef}
			resizeHandleRenderer={resizeHandleRenderer}
			htmlAttributes={htmlAttributes}
		>
			{children}
		</SecondaryPaneAnimation>
	);
}

SPLSecondaryPane.displayName = "SPLSecondaryPane";
