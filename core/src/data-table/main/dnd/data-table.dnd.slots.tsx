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

import type { CSSProperties, MouseEvent, MouseEventHandler, ReactElement, ReactNode, RefCallback } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css, styled } from "styled-components";

import { combine } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/combine";
import {
	draggable,
	dropTargetForElements,
	monitorForElements
} from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@com.mgmtp.a12.widgets/pragmatic-drag-and-drop/element/disable-native-drag-preview";

import { DataRoles } from "../../../common/main/data-roles.js";
import { useKeepEditableCursorInDraggable, useLatestRef } from "../../../common/main/hooks.js";
import type { DataTableRenderPropsType } from "../data-table-renderer.api.js";
import { useDataTableContext } from "../data-table.context.js";
import type { TableDragDropOptions } from "../foundation/table.api.js";
import { DataTableZIndex } from "../template/data-table.z-index.js";

import type { ClientOffset } from "./data-table.dnd.constants.js";
import {
	DEFAULT_ACCEPT_TYPE,
	DRAG_TYPE_KEY,
	DROP_TARGET_ATTRIBUTE,
	DROP_TARGET_FORBIDDEN
} from "./data-table.dnd.constants.js";
import { captureRowSnapshot, isInteractiveElement } from "./data-table.dnd.dom.js";

/**
 * Fixed overlay for the drag preview.
 */
export const StyledDnDDragPreview = styled.div.withConfig({ displayName: "StyledDataTableDnDDragPreview-sc-" })`
	position: fixed;
	pointer-events: none;
	z-index: ${DataTableZIndex.stickyHeadFootAndDnd};
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
`;

/**
 * Row preview shown during drag — fixed position following the cursor.
 */
export const StyledDnDBodyRowPreview = styled.div.withConfig({
	displayName: "StyledDataTableDnDBodyRowPreview-sc-"
})(({ theme }) => {
	const { bodyRowDnD } = theme.components.table;

	return css`
		background-color: ${bodyRowDnD.preview.background};
		box-shadow: ${bodyRowDnD.preview.boxShadow};
		opacity: ${bodyRowDnD.preview.opacity};
		position: fixed;
		pointer-events: none;
		width: 100%;
		z-index: ${DataTableZIndex.stickyHeadFootAndDnd};
	`;
});

export interface DataTableDnDBodyRowChildArgs {
	dragRef: RefCallback<HTMLTableRowElement | null>;
	onMouseOver: MouseEventHandler<HTMLElement>;
}

/**
 * Registers a body row as drag source and drop target and exposes the drag
 * connector to the caller via render-prop. Purely behavioral — the drop-gap
 * *preview* (rows parting around the projected insertion point) is written
 * imperatively by the `useDataTableDndMonitor` shift engine off the shared
 * row registry, so this wrapper renders no extra DOM around the row. The drag
 * source must attach to the actual `<tr>` — not a `display: contents` wrapper —
 * because native drag-and-drop requires `draggable="true"` on an element with a
 * real layout box.
 *
 * Reads `dragDropOptions` from `DataTableContext`; renders `null` when absent.
 */
export function DataTableDnDBodyRow<RowType>(
	props: DataTableRenderPropsType.DndBodyRowProps<RowType>
): ReactElement | null {
	const dragDropOptions = useDataTableContext<RowType>().dragDropOptions as TableDragDropOptions<RowType> | undefined;

	if (!dragDropOptions) {
		return null;
	}

	return <DataTableDnDBodyRowImpl {...props} dragDropOptions={dragDropOptions} />;
}

DataTableDnDBodyRow.displayName = "DataTableDnDBodyRow";

interface DataTableDnDBodyRowImplProps<RowType> extends DataTableRenderPropsType.DndBodyRowProps<RowType> {
	dragDropOptions: TableDragDropOptions<RowType>;
}

function DataTableDnDBodyRowImpl<RowType>({
	rowIndex,
	row,
	dragDropOptions,
	children
}: DataTableDnDBodyRowImplProps<RowType>): ReactElement {
	const acceptType = dragDropOptions.acceptType || DEFAULT_ACCEPT_TYPE;
	const registry = useDataTableContext<RowType>().dndRowRegistry;
	const rowRef = useRef<HTMLTableRowElement | null>(null);
	// State (not just a ref) so the draggable effect re-binds when the row
	// element mounts or is replaced.
	const [rowEl, setRowEl] = useState<HTMLTableRowElement | null>(null);
	// Drag suppression while hovering interactive children. A ref, not state:
	// pragmatic-drag-and-drop evaluates `canDrag` fresh on every native
	// dragstart, so flipping it never needs a re-render.
	const dragSuppressedRef = useRef(false);
	const optionsRef = useLatestRef(dragDropOptions);

	const dragItem = useMemo<DataTableRenderPropsType.DragObject<RowType>>(() => ({ rowIndex, row }), [row, rowIndex]);

	useEffect(() => {
		const element = rowEl;

		if (!element) {
			return undefined;
		}

		// Force a `not-allowed` cursor on forbidden positions
		const forbidCursor = (event: DragEvent): void => {
			if (element.getAttribute(DROP_TARGET_ATTRIBUTE) === DROP_TARGET_FORBIDDEN && event.dataTransfer) {
				event.dataTransfer.dropEffect = "none";
			}
		};

		element.addEventListener("dragover", forbidCursor);

		const cleanup = combine(
			draggable({
				element,
				canDrag: () => !dragSuppressedRef.current && (optionsRef.current.canDrag?.({ dragItem }) ?? true),
				getInitialData: () => ({
					[DRAG_TYPE_KEY]: acceptType,
					...dragItem,
					...captureRowSnapshot(element)
				}),
				// The floating preview is rendered by DataTableDnDDragPreview; suppress
				// the browser's default ghost image (react-dnd's `getEmptyImage()`
				// equivalent).
				onGenerateDragPreview: ({ nativeSetDragImage }) => {
					disableNativeDragPreview({ nativeSetDragImage });
				},
				onDragStart: () => {
					optionsRef.current.onBeginDrag?.({ dragItem });
				}
				// `onDrop`/`onEndDrag` are intentionally NOT handled here. In a virtualized
				// table the source `<tr>` can unmount mid-drag (scrolled out of the window),
				// and pragmatic-drag-and-drop only dispatches `onDrop` to a still-registered
				// draggable — so drop resolution lives in the always-mounted table monitor
				// (`useDataTableDndMonitor`) instead.
			}),
			// The row `<tr>` is also the drop target. Its identity/gap is resolved by the
			// monitor's logical-rect hit-testing; this registration exists so pragmatic
			// reports a non-empty `dropTargets` on a genuine release (distinguishing it
			// from an Escape-cancel), and so its collision box tiles the whole body.
			dropTargetForElements({
				element,
				getData: () => ({ rowIndex, row }),
				canDrop: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType
			})
		);

		return () => {
			element.removeEventListener("dragover", forbidCursor);
			cleanup();
		};
	}, [rowEl, acceptType, dragItem, optionsRef, rowIndex, row]);

	// Register this row in the shared registry the shift engine iterates. Keyed by
	// data index; cleaned up on unmount (matters under virtualization, where rows
	// mount/unmount as they scroll).
	useEffect(() => {
		if (!registry || !rowEl) {
			return undefined;
		}

		registry.set(rowIndex, { row, element: rowEl });

		return () => {
			// Only drop the entry if this element still owns the index — a re-key may
			// have replaced it already.
			if (registry.get(rowIndex)?.element === rowEl) {
				registry.delete(rowIndex);
			}
		};
	}, [registry, rowIndex, row, rowEl]);

	const dragRef = useCallback<RefCallback<HTMLTableRowElement | null>>((node) => {
		rowRef.current = node;
		setRowEl(node);
	}, []);

	useKeepEditableCursorInDraggable(rowRef);

	const onMouseOver = useCallback<MouseEventHandler<HTMLElement>>((event: MouseEvent<HTMLElement>) => {
		dragSuppressedRef.current = isInteractiveElement(event);
	}, []);

	const renderChildren = children as ((args: DataTableDnDBodyRowChildArgs) => ReactNode) | ReactNode | undefined;
	const bodyRowContent =
		typeof renderChildren === "function"
			? (renderChildren as (args: DataTableDnDBodyRowChildArgs) => ReactNode)({ dragRef, onMouseOver })
			: renderChildren;

	return <>{bodyRowContent}</>;
}

/**
 * Pass-through drag-source slot. The default DnD path (`DataTableDnDBodyRow`)
 * attaches the drag source directly to the `<tr>` (the `display: contents` row
 * wrappers cannot carry `draggable`), so this slot is not used by the default
 * `dndBodyRowRenderer`; it exists for consumers fully overriding that renderer.
 */
export function DataTableDragSource<RowType>(props: DataTableRenderPropsType.DragSourceProps<RowType>): ReactElement {
	return <>{props.children}</>;
}

DataTableDragSource.displayName = "DataTableDragSource";

/**
 * Default drag preview: a fixed overlay recreating the dragged row, translated
 * by the pointer's movement since drag start. The dragged item and its initial
 * on-screen origin arrive as the `activeDrag` prop; pointer movement is observed
 * through a pragmatic-drag-and-drop monitor.
 *
 * Mounted by the orchestrator only while a locally-started drag is in progress,
 * so a monitor registered here mid-drag still receives all subsequent `onDrag`
 * events.
 *
 * The per-move `dragDelta` is local state on purpose: re-rendering the preview is
 * the whole cost of following the pointer, and nothing outside this overlay needs
 * to know where the cursor is.
 */
export function DataTableDnDDragPreview(props: DataTableRenderPropsType.DragPreviewProps): ReactElement | null {
	const { activeDrag } = props;
	// Pointer movement since drag start. Starts at zero so the preview is
	// already visible at the source row's position before the first drag event
	// arrives.
	const [dragDelta, setDragDelta] = useState<ClientOffset>({ x: 0, y: 0 });

	useEffect(() => {
		return monitorForElements({
			onDrag: ({ location }) => {
				const x = location.current.input.clientX - location.initial.input.clientX;
				const y = location.current.input.clientY - location.initial.input.clientY;

				// Keep the previous object when the delta is unchanged, so React bails out
				// instead of re-rendering. `onDrag` is dispatched from every `dragover`, and
				// the browser re-fires `dragover` on a timer (~3×/s) while the pointer is held
				// perfectly still — without this guard a motionless drag repaints the preview
				// (including its cloned row markup) for nothing.
				setDragDelta((previous) => (previous.x === x && previous.y === y ? previous : { x, y }));
			}
		});
	}, []);

	const dragItem = activeDrag.item as DataTableRenderPropsType.DragObject<unknown>;
	const { x, y } = {
		x: activeDrag.initialSourceClientOffset.x + dragDelta.x,
		y: activeDrag.initialSourceClientOffset.y + dragDelta.y
	};
	const transform = `translate(${x}px, ${y}px)`;
	// `width` is the viewport's visible width; the snapshot below may exceed it
	// (the source `<tr>` spans the full data-table track width), so we clip with
	// `overflow: hidden` to match the visible row the user sees on screen.
	const previewStyle: CSSProperties = {
		width: dragItem.width,
		overflow: "hidden",
		transform,
		WebkitTransform: transform
	};

	// The snapshot is hosted in whatever the source row lived in. A `<tr>` snapshot comes
	// with the source `<colgroup>`, and only inside a native `table-layout: fixed`
	// `<table>` do those `<col>` widths reproduce the source column sizing; a card
	// snapshot is a self-sized `<div>` and is hosted directly. Either host is translated
	// by `-scrollLeft` so what is shown matches what was under the cursor at drag start.
	const hostStyle: CSSProperties = {
		width: dragItem.rowWidth ?? "max-content",
		transform: dragItem.scrollLeft ? `translateX(${-dragItem.scrollLeft}px)` : undefined
	};
	const snapshotHTML = dragItem.snapshotHTML;
	const colgroupHTML = dragItem.snapshotColgroupHTML;

	return (
		<StyledDnDDragPreview data-role={DataRoles.Table.DragPreview}>
			<StyledDnDBodyRowPreview style={previewStyle}>
				{!snapshotHTML ? (
					`Row ${dragItem.rowIndex}`
				) : colgroupHTML === undefined ? (
					<div style={hostStyle} aria-hidden="true" dangerouslySetInnerHTML={{ __html: snapshotHTML }} />
				) : (
					<table
						style={{ ...hostStyle, tableLayout: "fixed", borderCollapse: "collapse" }}
						aria-hidden="true"
						dangerouslySetInnerHTML={{ __html: `${colgroupHTML}${snapshotHTML}` }}
					/>
				)}
			</StyledDnDBodyRowPreview>
		</StyledDnDDragPreview>
	);
}

DataTableDnDDragPreview.displayName = "DataTableDnDDragPreview";
