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

import type { Key, KeyboardEvent, RefObject } from "react";
import { useCallback, useRef } from "react";
import { Key as Keys } from "ts-key-enum";

import type { DragAndDropTitles } from "../../common/main/a11y-localization/index.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { isKeyboardGrabKey } from "../../common/main/utils.js";

import type { TreeModel } from "./model/index.js";
import type { TreeKeyboardMove, TreeViewDnDState } from "./tree-view-dnd.js";
import { performTreeKeyboardMove } from "./tree-view-dnd.js";

/** The keys that navigate or expand, and so belong to the tree rather than to a control inside a node. */
const ARROW_KEYS = new Set<string>([
	Keys.ArrowUp,
	Keys.ArrowDown,
	Keys.ArrowLeft,
	Keys.ArrowRight,
	Keys.Home,
	Keys.End
]);

/** Focuses a node's content element by key. The element is always rendered for a visible row. */
function focusNodeContent(key: Key): void {
	document.getElementById(`tree-node-content-${String(key)}`)?.focus();
}

/**
 * The node content the event belongs to, or `undefined` when the tree must keep its hands off the key.
 *
 * Focus on the content itself, on the expand/collapse control or on a node's action area counts as the
 * node - the same three places the legacy `Tree` accepts. Focus anywhere else inside a node is a
 * consumer's own content (a text field rendered as the label, say), and its keys are left alone.
 */
function resolveNodeContent(target: HTMLElement | null): HTMLElement | undefined {
	if (!target) {
		return undefined;
	}

	if (target.getAttribute("data-role") === DataRoles.Tree.Node.Content) {
		return target;
	}

	const scope = target.closest<HTMLElement>(
		`[data-role="${DataRoles.Tree.Node.Expander}"], [data-role="${DataRoles.Tree.Node.Actions}"]`
	);

	return scope?.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node.Content}"]`) ?? undefined;
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

	/** Whether drag-and-drop (and thus keyboard grab-and-move) is enabled. */
	dndEnabled: boolean;

	/** Live DnD state, used to run keyboard moves and announce them. Only read when {@link dndEnabled}. */
	dndStateRef: RefObject<TreeViewDnDState<RowType>>;

	/** Localized grab / drop / cancel announcements. */
	dndTitles: DragAndDropTitles | undefined;
}): (event: KeyboardEvent<HTMLElement>) => void {
	const { model, activeKey, setActiveKey, selectable, onSelect, dndEnabled, dndStateRef, dndTitles } = params;

	// Whether the active node is currently "grabbed" — while true, arrows reorder it instead of moving
	// focus. A ref (not state): flipping it never needs a re-render.
	const grabbedRef = useRef(false);

	return useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const target = event.target as HTMLElement;
			const nodeContent = resolveNodeContent(target);

			// Focus is on something the tree does not own — a consumer's own input inside a node, say.
			if (!nodeContent) {
				return;
			}

			// Focus is inside the node but not on its content: the chevron or an action button, reachable by
			// Tab in `"default"` mode and by a click in either mode. The first arrow press brings focus back to
			// the node content, as the legacy `Tree` does, and the next one navigates from there.
			if (nodeContent !== target && ARROW_KEYS.has(event.key)) {
				event.preventDefault();
				nodeContent.focus();

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

			const announceDnd = (message: string | undefined): void => {
				if (message) {
					dndStateRef.current.announce?.(message);
				}
			};

			// Run a grabbed move, then keep the (re-rendered) grabbed node active and focused so
			// consecutive presses move the same node. `performTreeKeyboardMove` gates through `canDrop`,
			// fires `onDrop`, flashes and announces the new position.
			const grabbedMove = (move: TreeKeyboardMove): void => {
				event.preventDefault();
				performTreeKeyboardMove(dndStateRef.current, index, move);
				setActiveKey(current.key);

				if (typeof requestAnimationFrame === "function") {
					requestAnimationFrame(() => focusNodeContent(current.key));
				}
			};

			// ---- Grabbed mode: arrows reorder, Space/Enter drop, Escape cancels. -------------------
			if (grabbedRef.current) {
				switch (event.key) {
					case Keys.ArrowUp:
						grabbedMove("up");
						break;
					case Keys.ArrowDown:
						grabbedMove("down");
						break;
					case Keys.Home:
						grabbedMove("top");
						break;
					case Keys.End:
						grabbedMove("bottom");
						break;
					case Keys.ArrowRight:
						grabbedMove("into");
						break;
					case Keys.ArrowLeft:
						grabbedMove("out");
						break;
					case Keys.Enter:
					case " ":
						event.preventDefault();
						grabbedRef.current = false;
						announceDnd(dndTitles?.dropped);
						break;
					case Keys.Escape:
						event.preventDefault();
						grabbedRef.current = false;
						announceDnd(dndTitles?.moveCancelled);
						break;
					default:
						break;
				}

				return;
			}

			// Picks the node up when DnD allows it; reports whether it did, so the caller can fall back to
			// selection.
			const tryGrab = (): boolean => {
				if (!dndEnabled) {
					return false;
				}

				const options = dndStateRef.current.options;

				if (!isKeyboardGrabKey(event, options.keyboardGrabKey ?? "Space")) {
					return false;
				}

				if (!(options.canDrag?.({ row: current.row }) ?? true)) {
					return false;
				}

				event.preventDefault();
				grabbedRef.current = true;
				announceDnd(dndTitles?.grabInstructions);

				return true;
			};

			// ---- Normal navigation. ----------------------------------------------------------------
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
				case " ":
					// Space grabs the node when DnD is enabled (Enter still selects); otherwise it selects.
					if (!tryGrab() && selectable) {
						event.preventDefault();
						onSelect(current.key, current.row);
					}

					break;
				case Keys.Enter:
					if (selectable) {
						event.preventDefault();
						onSelect(current.key, current.row);
					}

					break;
				default:
					break;
			}
		},
		[model, activeKey, setActiveKey, selectable, onSelect, dndEnabled, dndStateRef, dndTitles]
	);
}
