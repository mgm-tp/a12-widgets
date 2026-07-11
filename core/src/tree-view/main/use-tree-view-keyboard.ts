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
 * Model-driven keyboard navigation for {@link TreeView}. Operates purely on the flattened, ordered
 * `model.rows` (index arithmetic) instead of querying the DOM tree structure — the modern replacement
 * for the legacy tree's DOM-walking keyboard hook.
 *
 * Implements the WAI-ARIA tree pattern: Up/Down move to the adjacent visible node, Right expands (or
 * steps into the first child), Left collapses (or steps to the parent), Home/End jump to the ends, and
 * Enter/Space select.
 * @module
 */

import type { Key, KeyboardEvent } from "react";
import { useCallback } from "react";
import { Key as Keys } from "ts-key-enum";

import { DataRoles } from "../../common/main/data-roles.js";

import type { TreeModel } from "./model/index.js";

/** Focuses a node's content element by key. The element is always rendered for a visible row. */
function focusNodeContent(key: Key): void {
	document.getElementById(`tree-node-content-${String(key)}`)?.focus();
}

/**
 * Returns a keydown handler for the tree container that drives roving focus and expand/collapse from
 * the headless model.
 *
 * @internal
 */
export function useTreeViewKeyboard<RowType>(params: {
	model: TreeModel<RowType>;
	activeKey: Key | undefined;
	setActiveKey: (key: Key) => void;
	selectable: boolean;
	onSelect: (key: Key, row: RowType) => void;
}): (event: KeyboardEvent<HTMLElement>) => void {
	const { model, activeKey, setActiveKey, selectable, onSelect } = params;

	return useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			// Only react when focus is on a node's content (the roving tab stop) — never hijack keys from
			// action buttons or other focusable content inside a node.
			if ((event.target as HTMLElement)?.getAttribute("data-role") !== DataRoles.Tree.Node.Content) {
				return;
			}

			const { rows } = model;

			if (rows.length === 0) {
				return;
			}

			const currentKey = activeKey ?? rows[0]!.key;
			const index = rows.findIndex((row) => row.key === currentKey);

			if (index === -1) {
				return;
			}

			const current = rows[index]!;

			const focusIndex = (target: number): void => {
				const clamped = Math.max(0, Math.min(rows.length - 1, target));
				const next = rows[clamped];

				if (next && next.key !== current.key) {
					event.preventDefault();
					setActiveKey(next.key);
					focusNodeContent(next.key);
				}
			};

			const focusKey = (key: Key): void => {
				event.preventDefault();
				setActiveKey(key);
				focusNodeContent(key);
			};

			switch (event.key) {
				case Keys.ArrowDown:
					focusIndex(index + 1);
					break;
				case Keys.ArrowUp:
					focusIndex(index - 1);
					break;
				case Keys.Home:
					focusIndex(0);
					break;
				case Keys.End:
					focusIndex(rows.length - 1);
					break;
				case Keys.ArrowRight:
					if (current.expandable && !current.expanded) {
						event.preventDefault();
						model.toggle(current.key, current.row);
					} else if (current.expandable && current.expanded) {
						// First child is the immediately following row in the flattened order.
						focusIndex(index + 1);
					}

					break;
				case Keys.ArrowLeft:
					if (current.expandable && current.expanded) {
						event.preventDefault();
						model.toggle(current.key, current.row);
					} else if (current.parentKey !== undefined) {
						focusKey(current.parentKey);
					}

					break;
				case Keys.Enter:
				case " ":
					if (selectable) {
						event.preventDefault();
						onSelect(current.key, current.row);
					}

					break;
				default:
					break;
			}
		},
		[model, activeKey, setActiveKey, selectable, onSelect]
	);
}
