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

import type {
	CSSProperties,
	MouseEvent,
	MouseEventHandler,
	ReactElement,
	ReactNode,
	RefCallback,
	RefObject
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	draggable,
	dropTargetForElements,
	monitorForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { styled, css } from "styled-components";

import { DataRoles } from "../../common/main/data-roles.js";
import { useKeepEditableCursorInDraggable } from "../../common/main/hooks.js";

import type { TableDragDropOptions } from "./foundation/table.api.js";
import type { DataTableRenderPropsType } from "./data-table-renderer.api.js";
import { useDataTableContext } from "./data-table.context.js";
import { DataTableZIndex } from "./template/data-table.z-index.js";

/**
 * Default `acceptType` when `dragDropOptions.acceptType` is not set. Exported so the
 * tree-table DnD path stamps the same payload type the orchestrator's monitor matches on.
 *
 * @internal
 */
export const DEFAULT_ACCEPT_TYPE = "DataTableDnDRow";

/**
 * Key carrying the drag's accept type inside the pragmatic-drag-and-drop payload.
 * Drag sources stamp it in `getInitialData`; drop targets and monitors compare it
 * in `canDrop`/`canMonitor`. Two DataTables with the same `acceptType` accept each
 * other's rows.
 */
export const DRAG_TYPE_KEY = "dataTableDnDType";

interface ClientOffset {
	x: number;
	y: number;
}

/**
 * Drop hint rendered between rows as a zero-height `<tr>`. It is registered as
 * the pragmatic-drag-and-drop drop target; the visible indicator and hit-test
 * surface live on the full-width {@link StyledDnDHintCell} it wraps.
 */
export const StyledDnDHint = styled.tr.withConfig({ displayName: "StyledDataTableDnDHint-sc-" })`
	// Zero row contribution so beginning a drag never shifts the table layout.
	height: 0;
`;

/**
 * Full-width hint cell spanning every leaf column (via `colSpan`). It is a
 * zero-height box whose absolutely-positioned `::before` overlays the gap
 * between the two adjacent rows, acting as both the visual drop indicator and
 * the hit-test surface for the drop target.
 *
 * Spanning all columns is essential: a native `<tr>` cannot be made full-width
 * with `grid-column: 1 / -1`, so the box has to come from a `colSpan` cell —
 * otherwise the hint collapses to one column and most of each row gap stops
 * accepting drops.
 */
export const StyledDnDHintCell = styled.td.withConfig({ displayName: "StyledDataTableDnDHintCell-sc-" })<{
	$isOpen?: boolean;
	$isOver?: boolean;
	$edge?: "top" | "bottom";
}>(({ theme, $isOpen, $isOver, $edge }) => {
	const { bodyRowDnD } = theme.components.table;
	// The band is centred on the row gap (half above the line, half below). At the
	// table's top/bottom edge that bottom/top half would spill past the table's
	// content box; since the hint rows live inside the `overflow:auto` viewport,
	// the spill enlarges `scrollHeight` and flickers a scrollbar in/out during a
	// drag. Clamp the edge bands fully inside the content box instead: the top-edge
	// band sits just below its line, the bottom-edge band just above it.
	const bandTop =
		$edge === "top"
			? "0px"
			: $edge === "bottom"
				? `calc(-1 * ${bodyRowDnD.hint.height})`
				: `calc(${bodyRowDnD.hint.height} / -2)`;

	return css`
		padding: 0;
		border: 0;
		height: 0;
		line-height: 0;
		position: relative;
		pointer-events: ${$isOpen ? "auto" : "none"};

		${$isOpen &&
		css`
			// Must exceed body pinned cells so the drop indicator paints across the pinned
			// columns. Kept below pinned header cells so the sticky header still wins
			// visually. See DataTableZIndex for the full ladder.
			z-index: ${DataTableZIndex.stickyHeadFootAndDnd};

			&::before {
				content: "";
				position: absolute;
				left: 0;
				right: 0;
				top: ${bandTop};
				height: ${bodyRowDnD.hint.height};
				background-color: transparent;
				box-sizing: border-box;
				pointer-events: auto;

				${$isOver &&
				css`
					background-color: ${bodyRowDnD.hint.openedBG};
					border: ${bodyRowDnD.hint.openedBorder};
				`}
			}
		`}
	`;
});

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

/**
 * Whether a mouse event originated on an interactive child (button, checkbox)
 * of a draggable row, used to suppress dragging so the control stays usable.
 */
export function isInteractiveElement(event: MouseEvent<HTMLElement>): boolean {
	const target = event.target as HTMLElement;

	if (!target || !target.closest) {
		return false;
	}

	const interactive = target.closest("button, [role='button'], input[type='checkbox'], [role='checkbox']");

	return interactive !== null && !interactive.hasAttribute("disabled");
}

/**
 * Ref that always holds the latest value, so native drag callbacks registered
 * once per element can read fresh `dragDropOptions` without re-binding the
 * pragmatic adapters on every render (consumers routinely pass inline
 * `dragDropOptions` objects).
 */
export function useLatestRef<T>(value: T): RefObject<T> {
	const ref = useRef(value);

	useEffect(() => {
		ref.current = value;
	});

	return ref;
}

/**
 * Default `canDrop` evaluation shared by the drop target registration (native
 * hit testing) and the render-time "open" visual: consumer `canDrop` when
 * provided, otherwise any row except the dragged one.
 */
function canDropOnTarget<RowType>(
	options: TableDragDropOptions<RowType>,
	dragItem: DataTableRenderPropsType.DragObject<RowType>,
	hoveredItem: DataTableRenderPropsType.HoveredObject<RowType>
): boolean {
	if (options.canDrop) {
		return options.canDrop({ dragItem, hoveredItem });
	}

	return dragItem.row !== hoveredItem.row;
}

/**
 * Serialized snapshot of the dragged row, captured at drag start for the
 * default drag preview. Clones the source `<colgroup>` so the preview's native
 * `table-layout: fixed` reproduces the same per-column widths, and strips all
 * `id` attributes from the row clone: the markup is re-rendered verbatim in
 * the drag preview, so keeping ids would duplicate them in the live document
 * for the duration of the drag.
 */
export function captureRowSnapshot(
	node: HTMLTableRowElement
): Pick<DataTableRenderPropsType.DragObject<unknown>, "width" | "rowWidth" | "scrollLeft" | "snapshotHTML"> {
	const tableEl = node.closest("table");
	const viewportEl = tableEl?.closest<HTMLElement>(`[data-role="${DataRoles.Table.Viewport}"]`) ?? null;
	const colgroupHTML = tableEl?.querySelector("colgroup")?.outerHTML ?? "";

	const clone = node.cloneNode(true) as HTMLTableRowElement;
	clone.removeAttribute("id");
	clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
	const rowHTML = clone.outerHTML;

	const rowWidth = node.offsetWidth;

	return {
		width: viewportEl?.clientWidth ?? rowWidth,
		rowWidth,
		scrollLeft: viewportEl?.scrollLeft ?? 0,
		snapshotHTML: `${colgroupHTML}${rowHTML}`
	};
}

export interface UseDataTableDndMonitorArgs<RowType> {
	/** DnD options from props; the monitor is inactive without them. */
	dragDropOptions?: TableDragDropOptions<RowType>;

	/** The table element, used to detect whether a drag originated locally. */
	tableRef: { current: HTMLTableElement | null };

	/**
	 * The scroll-container element. When present it is registered as a
	 * pragmatic auto-scroll surface so dragging near its top/bottom edge scrolls
	 * the viewport — essential in virtualized mode, where the drop target for an
	 * off-window row only exists once that row is scrolled into the window.
	 */
	viewportEl?: HTMLElement | null;

	/** Model setter receiving the tracked drag, or `null` once it ends. */
	setActiveDrag: (drag: DataTableRenderPropsType.ActiveDrag<RowType> | null) => void;
}

/**
 * Per-table monitor keeping the orchestrator's `activeDrag` state in sync with
 * the pragmatic-drag-and-drop event stream. Watches every drag whose payload
 * type matches this table's `acceptType` — including drags that started in
 * another DataTable sharing the type — so drop targets can open for
 * cross-table drags, while `isLocalSource` lets the source table alone render
 * the floating drag preview.
 */
export function useDataTableDndMonitor<RowType>({
	dragDropOptions,
	tableRef,
	viewportEl,
	setActiveDrag
}: UseDataTableDndMonitorArgs<RowType>): void {
	const acceptType = dragDropOptions ? dragDropOptions.acceptType || DEFAULT_ACCEPT_TYPE : undefined;
	const optionsRef = useLatestRef(dragDropOptions);
	// Whether the in-flight drag started in THIS table. Captured at drag start (the
	// source element is mounted then) so the drop can still be attributed to the
	// source table even after the source row scrolls out of a virtualized window
	// and unmounts.
	const isLocalSourceRef = useRef(false);

	useEffect(() => {
		if (!acceptType) {
			return undefined;
		}

		return monitorForElements({
			canMonitor: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType,
			onDragStart: ({ source }) => {
				// Measured here rather than threaded through the drag payload: the
				// preview needs the source row's on-screen origin, which is still
				// intact at drag start.
				const rect = source.element.getBoundingClientRect();
				const isLocalSource = tableRef.current?.contains(source.element) ?? false;

				isLocalSourceRef.current = isLocalSource;
				setActiveDrag({
					item: source.data as unknown as DataTableRenderPropsType.DragObject<RowType>,
					initialSourceClientOffset: { x: rect.left, y: rect.top },
					isLocalSource
				});
			},
			// Drop resolution lives here, not on the per-row draggable: in a
			// virtualized table the dragged source `<tr>` can unmount mid-drag (it
			// scrolls out of the rendered window), and pragmatic-drag-and-drop only
			// dispatches `onDrop` to a draggable that is still registered. The
			// monitor is bound to the always-mounted table, so it fires regardless.
			// Scoped to the source table so a shared `acceptType` doesn't double-fire.
			onDrop: ({ source, location }) => {
				const options = optionsRef.current;

				if (options && isLocalSourceRef.current) {
					const data = source.data as unknown as DataTableRenderPropsType.DragObject<RowType>;
					const dragItem = { rowIndex: data.rowIndex, row: data.row };
					const target = location.current.dropTargets[0];
					const dropResult = target ? (target.data as unknown as DataTableRenderPropsType.DropResult<RowType>) : null;
					const canDrop = (dropResult && options.canDrop?.({ dragItem, hoveredItem: dropResult })) ?? true;

					if (dropResult && canDrop) {
						options.onDrop?.({ dragItem, dropResult });
					}

					options.onEndDrag?.({ dragItem, dropResult });
				}

				isLocalSourceRef.current = false;
				setActiveDrag(null);
			}
		});
	}, [acceptType, setActiveDrag, tableRef, optionsRef]);

	// Edge auto-scroll on the viewport. The registration is persistent and inert
	// until a compatible drag is in progress, so it is bound once the scroll
	// element exists; `canScroll` restricts it to this table's drags.
	useEffect(() => {
		if (!acceptType || !viewportEl) {
			return undefined;
		}

		return autoScrollForElements({
			element: viewportEl,
			canScroll: ({ source }) => source.data[DRAG_TYPE_KEY] === acceptType
		});
	}, [acceptType, viewportEl]);
}

export interface DataTableDnDBodyRowChildArgs {
	dragRef: RefCallback<HTMLTableRowElement | null>;
	onMouseOver: MouseEventHandler<HTMLElement>;
}

/**
 * Renders the drop hints around a body row and exposes the drag connector to the
 * caller via render-prop. The drag source must attach to the actual `<tr>` — not a
 * `display: contents` wrapper — because native drag-and-drop requires
 * `draggable="true"` on an element with a real layout box.
 *
 * Reads `dragDropOptions` from {@link DataTableContext}; renders `null` when absent.
 */
export function DataTableDnDBodyRow<RowType>(
	props: DataTableRenderPropsType.DndBodyRowProps<RowType>
): ReactElement | null {
	const dragDropOptions = useDataTableContext<RowType>((ctx) => ctx.dragDropOptions) as
		| TableDragDropOptions<RowType>
		| undefined;

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

		return draggable({
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
		});
	}, [rowEl, acceptType, dragItem, optionsRef]);

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

	return (
		<>
			{rowIndex === 0 && <DataTableDnDDropTarget rowIndex={0} row={row} />}
			{bodyRowContent}
			<DataTableDnDDropTarget rowIndex={rowIndex + 1} row={row} />
		</>
	);
}

/**
 * Drop indicator rendered between rows. Reads `dragDropOptions` from
 * {@link DataTableContext} so it is invokable through the `dropTargetRenderer`
 * slot. When no `dragDropOptions` is set, renders `null`.
 */
export function DataTableDnDDropTarget<RowType>(
	props: DataTableRenderPropsType.DropTargetProps<RowType>
): ReactElement | null {
	const dragDropOptions = useDataTableContext<RowType>((ctx) => ctx.dragDropOptions) as
		| TableDragDropOptions<RowType>
		| undefined;

	if (!dragDropOptions) {
		return null;
	}

	return <DataTableDnDDropTargetImpl {...props} dragDropOptions={dragDropOptions} />;
}

DataTableDnDDropTarget.displayName = "DataTableDnDDropTarget";

interface DataTableDnDDropTargetImplProps<RowType> extends DataTableRenderPropsType.DropTargetProps<RowType> {
	dragDropOptions: TableDragDropOptions<RowType>;
}

function DataTableDnDDropTargetImpl<RowType>({
	rowIndex,
	row,
	dragDropOptions
}: DataTableDnDDropTargetImplProps<RowType>): ReactElement {
	const acceptType = dragDropOptions.acceptType || DEFAULT_ACCEPT_TYPE;
	// `leafPinning` is sized to the leaf-column count; the hint cell must span all
	// of them so the indicator fills the full row width (see StyledDnDHintCell).
	const colSpan = useDataTableContext<RowType>((ctx) => ctx.leafPinning.length) || 1;
	const activeDrag = useDataTableContext<RowType>((ctx) => ctx.activeDrag) as
		| DataTableRenderPropsType.ActiveDrag<RowType>
		| null
		| undefined;
	const [hintEl, setHintEl] = useState<HTMLTableRowElement | null>(null);
	const [isOver, setIsOver] = useState(false);
	const optionsRef = useLatestRef(dragDropOptions);

	useEffect(() => {
		const element = hintEl;

		if (!element) {
			return undefined;
		}

		return dropTargetForElements({
			element,
			getData: () => ({ rowIndex, row }),
			canDrop: ({ source }) => {
				if (source.data[DRAG_TYPE_KEY] !== acceptType) {
					return false;
				}

				const dragItem = source.data as unknown as DataTableRenderPropsType.DragObject<RowType>;

				return canDropOnTarget(optionsRef.current, dragItem, { rowIndex, row });
			},
			onDragEnter: () => setIsOver(true),
			onDragLeave: () => setIsOver(false),
			onDrop: () => setIsOver(false)
		});
	}, [hintEl, acceptType, rowIndex, row, optionsRef]);

	// Visual open state while a compatible drag is in progress (from this table
	// or another one sharing the accept type). Evaluated for every target — an
	// invalid gap never lights up, it only stays hit-testable via the native
	// `canDrop` above.
	const isOpen = !!activeDrag && canDropOnTarget(dragDropOptions, activeDrag.item, { rowIndex, row });

	// Recognise the table's top/bottom edge so the band can be clamped inside the
	// content box (see StyledDnDHintCell): the first gap is `rowIndex === 0`, the
	// last gap is `rowIndex === rowCount` (rendered at the last row's index + 1).
	const rowCount = useDataTableContext<RowType>((ctx) => ctx.rowCount) ?? 0;
	const edge: "top" | "bottom" | undefined = rowIndex === 0 ? "top" : rowIndex === rowCount ? "bottom" : undefined;

	const setRef = useCallback((node: HTMLTableRowElement | null) => {
		setHintEl(node);
	}, []);

	return (
		<StyledDnDHint ref={setRef} data-role={DataRoles.Table.DnDHint} aria-hidden="true">
			<StyledDnDHintCell colSpan={colSpan} $isOpen={isOpen} $isOver={isOver} $edge={edge} />
		</StyledDnDHint>
	);
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
 * on-screen origin come from `activeDrag`; pointer movement is observed through a
 * pragmatic-drag-and-drop monitor.
 *
 * Mounted by the orchestrator only while a locally-started drag is in progress,
 * so a monitor registered here mid-drag still receives all subsequent `onDrag`
 * events.
 */
export function DataTableDnDDragPreview(): ReactElement | null {
	const activeDrag = useDataTableContext((ctx) => ctx.activeDrag);
	// Pointer movement since drag start. Starts at zero so the preview is
	// already visible at the source row's position before the first drag event
	// arrives.
	const [dragDelta, setDragDelta] = useState<ClientOffset>({ x: 0, y: 0 });

	useEffect(() => {
		return monitorForElements({
			onDrag: ({ location }) => {
				setDragDelta({
					x: location.current.input.clientX - location.initial.input.clientX,
					y: location.current.input.clientY - location.initial.input.clientY
				});
			}
		});
	}, []);

	if (!activeDrag) {
		return null;
	}

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

	// `snapshotHTML` is the cloned `<colgroup>` + the row's `outerHTML`; in a native
	// `table-layout: fixed` `<table>` the `<col>` widths reproduce the source column
	// sizing. Translated by `-scrollLeft` so the visible columns match what was under
	// the cursor at drag start.
	const tableStyle: CSSProperties = {
		tableLayout: "fixed",
		width: dragItem.rowWidth ?? "max-content",
		borderCollapse: "collapse",
		transform: dragItem.scrollLeft ? `translateX(${-dragItem.scrollLeft}px)` : undefined
	};

	return (
		<StyledDnDDragPreview>
			<StyledDnDBodyRowPreview style={previewStyle}>
				{dragItem.snapshotHTML ? (
					<table style={tableStyle} aria-hidden="true" dangerouslySetInnerHTML={{ __html: dragItem.snapshotHTML }} />
				) : (
					`Row ${dragItem.rowIndex}`
				)}
			</StyledDnDBodyRowPreview>
		</StyledDnDDragPreview>
	);
}

DataTableDnDDragPreview.displayName = "DataTableDnDDragPreview";
