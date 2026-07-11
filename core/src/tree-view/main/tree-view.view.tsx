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
 * {@link TreeView} — the modern replacement for the legacy `Tree`. It drives rendering from the
 * headless {@link useTreeModel} (a flat list of visible rows) instead of recursively cloning the tree
 * through behavior HOCs, and composes the legacy tree's styled primitives for visual parity.
 *
 * Expansion, selection (controlled or uncontrolled) and keyboard navigation are all derived from the
 * model; the only DOM access is focusing a node by id and scrolling it into view.
 * @module
 */

import type { Key, ReactElement, ReactNode, RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";

import { DataRoles } from "../../common/main/data-roles.js";
import { addPrefix, generateUid, getRole, joinClassNames } from "../../common/main/utils.js";
import { StyledTreeContainer, StyledTreeNodesContainer } from "../../tree/main/tpl/tree-elements.styled.js";

import { useTreeModel } from "./model/index.js";
import { TreeViewNode } from "./tree-view-node.view.js";
import { useTreeViewKeyboard } from "./use-tree-view-keyboard.js";
import type { TreeViewDnDState } from "./tree-view-dnd.js";
import { useTreeViewDnDMonitor } from "./tree-view-dnd.js";
import type { TreeViewNodeMeta, TreeViewProps, TreeViewScrollToNodeHandler } from "./tree-view.api.js";

const baseClassName = addPrefix("treeWidget");

/**
 * A hierarchical tree view. See {@link TreeViewProps}.
 *
 * @experimental
 */
export function TreeView<RowType>(props: TreeViewProps<RowType>): ReactElement<TreeViewProps<RowType>> {
	const {
		className,
		style,
		id: idProp,
		dataRole,
		wrapperRef,
		fitToParent,
		role,
		selectionMode = "none",
		selectedKeys: controlledSelectedKeys,
		defaultSelectedKeys,
		onSelectionChange,
		scrollToNode,
		getLabel,
		getIcon,
		getActions,
		isDisabled,
		renderNode,
		dragDrop
	} = props;

	const model = useTreeModel(props);
	const { rows, metaByKey, toggle } = model;

	const selectable = selectionMode !== "none";

	const dndEnabled = dragDrop !== undefined;
	const indentPerLevel = useTheme().components.tree.node.indentPaddingLeft;
	const localDragRef = useRef(false);
	// Live DnD state, refreshed every render so the pragmatic adapters (bound once) read current values.
	const dndStateRef = useRef<TreeViewDnDState<RowType>>({
		options: dragDrop ?? {},
		rows,
		metaByKey,
		rowKeyOf: model.rowKeyOf,
		indentPerLevel
	});
	dndStateRef.current = { options: dragDrop ?? {}, rows, metaByKey, rowKeyOf: model.rowKeyOf, indentPerLevel };

	useTreeViewDnDMonitor(dndStateRef, localDragRef, dndEnabled);

	const isSelectionControlled = controlledSelectedKeys !== undefined;
	const [internalSelected, setInternalSelected] = useState<ReadonlySet<Key>>(
		() => new Set<Key>(defaultSelectedKeys ?? [])
	);
	const selectedKeys = isSelectionControlled ? (controlledSelectedKeys as ReadonlySet<Key>) : internalSelected;

	const [activeKeyState, setActiveKeyState] = useState<Key | undefined>(undefined);
	// The single roving tab stop: the explicitly-activated node if still visible, else the first node.
	const resolvedActiveKey =
		activeKeyState !== undefined && metaByKey.has(activeKeyState) ? activeKeyState : rows[0]?.key;

	const rootRef = useRef<HTMLDivElement>(null);
	const id = idProp || `tree-view-${generateUid()}`;

	useEffect(() => {
		wrapperRef?.(rootRef.current);
	}, [wrapperRef]);

	const onSelect = useCallback(
		(key: Key, row: RowType): void => {
			const next = new Set<Key>(selectionMode === "multiple" ? selectedKeys : []);
			const willSelect = !(selectionMode === "multiple" && next.has(key));

			if (willSelect) {
				next.add(key);
			} else {
				next.delete(key);
			}

			onSelectionChange?.(next, { key, selected: willSelect, row });

			if (!isSelectionControlled) {
				setInternalSelected(next);
			}
		},
		[selectionMode, selectedKeys, onSelectionChange, isSelectionControlled]
	);

	const handleKeyDown = useTreeViewKeyboard({
		model,
		activeKey: resolvedActiveKey,
		setActiveKey: setActiveKeyState,
		selectable,
		onSelect
	});

	const scrollToNodeHandler = useCallback<TreeViewScrollToNodeHandler>((rowKey, options) => {
		const nodeContent = document.getElementById(`tree-node-content-${String(rowKey)}`);

		if (!nodeContent) {
			return;
		}

		nodeContent.scrollIntoView({ block: "center" });

		if (options?.autoFocus) {
			setActiveKeyState(rowKey);
			nodeContent.focus();
		}
	}, []);

	useEffect(() => {
		scrollToNode?.(scrollToNodeHandler);
	}, [scrollToNode, scrollToNodeHandler]);

	const resolveLabel = useCallback(
		(row: RowType): ReactNode => getLabel?.(row) ?? (row as { label?: ReactNode }).label,
		[getLabel]
	);

	const classNames = joinClassNames(baseClassName, { [`${baseClassName}--fit`]: fitToParent }, className);

	return (
		<StyledTreeContainer
			ref={rootRef}
			id={id}
			className={classNames}
			style={style}
			data-role={dataRole ?? DataRoles.Tree}
			$fit={fitToParent}
		>
			<StyledTreeNodesContainer
				className={`${baseClassName}__nodes`}
				id={`tree-view-root-${id}`}
				data-role={DataRoles.Tree.Nodes}
				role={getRole(role, "tree")}
				$fit={fitToParent}
				onKeyDown={handleKeyDown}
			>
				{rows.map((flatRow, index) => {
					const { row, key, level, expandable, expanded, loading, parentKey, posinset, setsize } = flatRow;

					const meta: TreeViewNodeMeta = {
						key,
						level,
						expandable,
						expanded,
						loading,
						parentKey,
						posinset,
						setsize
					};

					return (
						<TreeViewNode
							key={key}
							nodeKey={String(key)}
							level={level}
							posinset={posinset}
							setsize={setsize}
							expandable={expandable}
							expanded={expanded}
							loading={loading}
							selectable={selectable}
							selected={selectedKeys.has(key)}
							disabled={!!isDisabled?.(row)}
							active={key === resolvedActiveKey}
							label={renderNode ? renderNode({ row, meta }) : resolveLabel(row)}
							icon={renderNode ? undefined : getIcon?.(row)}
							actions={getActions?.(row)}
							onToggleExpand={() => toggle(key, row)}
							onSelect={() => onSelect(key, row)}
							onActivate={() => setActiveKeyState(key)}
							rowIndex={index}
							dndEnabled={dndEnabled}
							dndStateRef={dndStateRef as unknown as RefObject<TreeViewDnDState>}
							localDragRef={localDragRef}
						/>
					);
				})}
			</StyledTreeNodesContainer>
		</StyledTreeContainer>
	);
}

TreeView.displayName = "TreeView";
