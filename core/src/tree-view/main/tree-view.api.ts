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

import type { Key, ReactNode } from "react";

import type { DataRole, Identifiable, Ref, Styleable } from "../../common/main/base-props.js";

/**
 * Resolves a row's stable, unique key from a row object. Structurally compatible with the headless
 * model's resolver, so a {@link TreeViewProps} object can be passed straight to the model.
 */
export type TreeViewRowKeyGetter<RowType> = (params: { row: RowType }) => Key;

/**
 * Selection behavior of a {@link TreeView}.
 * - `"none"` — nodes are not selectable (display-only).
 * - `"single"` — at most one node is selected; selecting another replaces it.
 * - `"multiple"` — clicking toggles a node's membership in the selection.
 */
export type TreeViewSelectionMode = "none" | "single" | "multiple";

/**
 * Node-key-based scroll handle handed to {@link TreeViewProps.scrollToNode}. Scrolls the node for
 * `rowKey` into view; with `autoFocus`, moves focus to it after scrolling. A node hidden inside a
 * collapsed ancestor is not rendered, so the call is a no-op.
 */
export type TreeViewScrollToNodeHandler = (rowKey: Key, options?: { autoFocus?: boolean }) => void;

/**
 * Where a dragged node lands relative to the hovered node during a {@link TreeView} drag.
 *
 * - `"before"` — insert the dragged node as a sibling immediately **before** the target.
 * - `"after"` — insert the dragged node as a sibling immediately **after** the target.
 * - `"inside"` — reparent the dragged node **into** the target (becomes its child).
 */
export type TreeViewDropPosition = "before" | "after" | "inside";

/**
 * Drag-and-drop reparenting options for {@link TreeView}. Opt in by passing {@link TreeViewProps.dragDrop};
 * nodes then become drag sources and tree-aware drop targets. The tree owns the drop geometry and the
 * self/descendant cycle guard — {@link onDrop} only reports the resolved move; the consumer mutates
 * their own tree in response.
 */
export interface TreeViewDragDrop<RowType = unknown> {
	/** Whether a given node may be dragged. Defaults to `true`. */
	canDrag?(params: { row: RowType }): boolean;

	/**
	 * Whether `source` may be dropped onto `target` at `position`. Defaults to forbidding a drop onto the
	 * dragged node itself or into its own subtree (which would create a cycle). When provided, the cycle
	 * guard becomes the consumer's responsibility.
	 */
	canDrop?(params: { source: RowType; target: RowType; position: TreeViewDropPosition }): boolean;

	/** Fired on a completed, permitted drop. Mutate your own tree here. */
	onDrop?(params: { source: RowType; target: RowType; position: TreeViewDropPosition }): void;

	/**
	 * The drag kind. Two trees sharing an `acceptType` accept each other's nodes. Defaults to the shared
	 * tree default.
	 */
	acceptType?: string;
}

/**
 * Read-only per-node metadata handed to the render callbacks of {@link TreeView}. Mirrors the visible
 * row's position in the flattened tree without exposing the internal flatten record.
 */
export interface TreeViewNodeMeta {
	/** The node's stable key (from `rowKey`). */
	key: Key;

	/** Depth in the tree; `0` for a top-level node. */
	level: number;

	/** Whether the node can be expanded (has, or can lazily load, children). */
	expandable: boolean;

	/** Whether the node is currently expanded. */
	expanded: boolean;

	/** Whether the node's children are currently being lazily loaded (the first-expand fetch). */
	loading: boolean;

	/** Key of the parent node, or `undefined` for a top-level node. */
	parentKey?: Key;

	/** 1-based position among its siblings. */
	posinset: number;

	/** Sibling count. */
	setsize: number;
}

/**
 * Props for {@link TreeView} — the modern, headless-model-driven replacement for the legacy `Tree` and
 * its behavior HOCs (`Collapsible`/`Selectable`/`DragDrop`/`TreeAdapter`).
 *
 * The consumer's own row type flows straight through: the hierarchy is provided either as a nested
 * {@link tree} (read via {@link getChildren}) or as a flat {@link data} list plus {@link getParentId},
 * and presentation is supplied via the `get*`/`renderNode` callbacks. A stable {@link rowKey} is
 * required — expansion (and, later, selection and drag-and-drop) is keyed by it.
 *
 * @experimental
 */
export interface TreeViewProps<RowType = unknown> extends Styleable, Identifiable, DataRole, Ref<HTMLDivElement> {
	/**
	 * Nested hierarchy: the top-level nodes, each exposing its children via {@link getChildren}.
	 * Mutually exclusive with {@link data} + {@link getParentId}.
	 */
	tree?: RowType[];

	/**
	 * Reads a node's children. Defaults to `row => row.children`. Return `undefined` (or an empty array)
	 * for a leaf. Only used with {@link tree}.
	 */
	getChildren?: (row: RowType) => RowType[] | undefined;

	/**
	 * Flat hierarchy (adjacency list): every node, with its parent addressed by {@link getParentId}.
	 * Nodes whose parent key is missing/unknown become top-level. Mutually exclusive with {@link tree}.
	 */
	data?: RowType[];

	/** Reads a node's parent key. Required when using {@link data}; return `undefined` for a root. */
	getParentId?: (row: RowType) => Key | undefined;

	/** Stable, unique node key (property name or getter). Required. */
	rowKey: keyof RowType | TreeViewRowKeyGetter<RowType>;

	/**
	 * Marks a node as a definite leaf, suppressing its chevron without consulting {@link getChildren}
	 * or {@link loadChildren}. Useful with lazy loading to know which nodes can never expand.
	 */
	isLeaf?: (row: RowType) => boolean;

	/**
	 * Lazily loads a node's children the first time it is expanded. The resolved children are held
	 * internally (overlaying {@link getChildren}); the node shows a loading state until they arrive.
	 *
	 * @experimental
	 */
	loadChildren?: (row: RowType) => Promise<RowType[]>;

	/** Initially-expanded keys (uncontrolled). Ignored when {@link expandedKeys} is provided. */
	defaultExpandedKeys?: Iterable<Key>;

	/** Expand every expandable node initially (uncontrolled). Ignored when {@link expandedKeys} is provided. */
	defaultExpandAll?: boolean;

	/** Controlled expanded keys. When provided, the tree never mutates expansion on its own. */
	expandedKeys?: ReadonlySet<Key>;

	/** Fired whenever a node is expanded or collapsed. Required to drive controlled {@link expandedKeys}. */
	onExpandedChange?: (expandedKeys: Set<Key>, meta: { key: Key; expanded: boolean; row: RowType }) => void;

	/** Selection behavior. @default "none" */
	selectionMode?: TreeViewSelectionMode;

	/** Controlled selected keys. When provided, the tree never mutates selection on its own. */
	selectedKeys?: ReadonlySet<Key>;

	/** Initially-selected keys (uncontrolled). Ignored when {@link selectedKeys} is provided. */
	defaultSelectedKeys?: Iterable<Key>;

	/** Fired whenever a node's selection changes. Required to drive controlled {@link selectedKeys}. */
	onSelectionChange?: (selectedKeys: Set<Key>, meta: { key: Key; selected: boolean; row: RowType }) => void;

	/**
	 * Programmatic scroll-to-node handle, addressed by {@link rowKey}. The tree calls back with the
	 * handler once mounted; keep a reference and invoke it to scroll a node into view.
	 */
	scrollToNode?(handler: TreeViewScrollToNodeHandler): void;

	/** Reads a node's display label. Defaults to `row.label`. Ignored when {@link renderNode} is given. */
	getLabel?: (row: RowType) => ReactNode;

	/** Reads a node's leading icon. Ignored when {@link renderNode} is given. */
	getIcon?: (row: RowType) => ReactNode;

	/** Reads a node's trailing action buttons (rendered at the end of the node). */
	getActions?: (row: RowType) => ReactNode;

	/** Whether a node is disabled (greyed out, non-interactive). */
	isDisabled?: (row: RowType) => boolean;

	/**
	 * Renders the full content of a node, overriding the default icon + label. Receives the row and its
	 * {@link TreeViewNodeMeta}.
	 */
	renderNode?: (params: { row: RowType; meta: TreeViewNodeMeta }) => ReactNode;

	/** Drag-and-drop reparenting. Opt in to make nodes draggable; see {@link TreeViewDragDrop}. */
	dragDrop?: TreeViewDragDrop<RowType>;

	/** Whether the tree fills its parent's height (100%). */
	fitToParent?: boolean;

	/**
	 * Value of the container's `role` attribute (accessibility).
	 * - A string uses that value.
	 * - `false` omits the attribute.
	 * - `true`/`undefined` uses the default.
	 * @default role="tree"
	 */
	role?: string | boolean;
}
