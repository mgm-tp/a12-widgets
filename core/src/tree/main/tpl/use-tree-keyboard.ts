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

import type { KeyboardEvent, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { Key } from "ts-key-enum";

import {
	moveItemFocusBack,
	moveItemFocusNext,
	getAllFocusableElements,
	findFirstFocusableOutside
} from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { KeyboardNavigationMode } from "../../../keyboard-navigation/main/keyboard-navigation.api.js";
import { useKeyboardNavigationMode } from "../../../keyboard-navigation/main/keyboard-navigation-context.js";

const NODE_CONTENT_SELECTOR = `[data-role="${DataRoles.Tree.Node.Content}"][tabIndex]`;
// InsertableTree uses ButtonGroup (data-role="button-group") as its action area instead of Tree.Node.Actions
const ACTION_AREA_SELECTOR = `[data-role="${DataRoles.Tree.Node.Actions}"], [data-role="${DataRoles.ButtonGroup}"]`;

interface ResolvedRow {
	currentRow: HTMLElement | undefined;
	focusIsOnActionButton: boolean;
}

function resolveCurrentRow(target: HTMLElement): ResolvedRow {
	if (target.getAttribute("data-role") === DataRoles.Tree.Node.Content) {
		return { currentRow: target, focusIsOnActionButton: false };
	}

	const expanderWrapper = target.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node.Expander}"]`);

	if (expanderWrapper) {
		const nodeContainer = expanderWrapper.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`);

		return {
			currentRow: nodeContainer?.querySelector<HTMLElement>(NODE_CONTENT_SELECTOR) ?? undefined,
			focusIsOnActionButton: false
		};
	}

	const actionArea = target.closest<HTMLElement>(ACTION_AREA_SELECTOR);

	if (actionArea) {
		const nodeContainer = actionArea.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`);

		return {
			currentRow: nodeContainer?.querySelector<HTMLElement>(NODE_CONTENT_SELECTOR) ?? undefined,
			focusIsOnActionButton: true
		};
	}

	return { currentRow: undefined, focusIsOnActionButton: false };
}

function handleArrowUpDown(
	event: KeyboardEvent<HTMLElement>,
	currentRow: HTMLElement,
	rootRef: RefObject<HTMLElement | null>,
	updateRovingTabIndex: (oldRow: HTMLElement, newRow: HTMLElement) => void
): void {
	event.preventDefault();

	if (event.key === Key.ArrowUp) {
		moveItemFocusBack(rootRef.current, currentRow, NODE_CONTENT_SELECTOR, true);
	} else {
		moveItemFocusNext(rootRef.current, currentRow, NODE_CONTENT_SELECTOR, true);
	}

	const newFocused = document.activeElement as HTMLElement;

	if (newFocused && newFocused !== currentRow) {
		updateRovingTabIndex(currentRow, newFocused);
	}
}

function handleExpandCollapse(
	event: KeyboardEvent<HTMLElement>,
	target: HTMLElement,
	currentRow: HTMLElement,
	updateRovingTabIndex: (oldRow: HTMLElement, newRow: HTMLElement) => void
): void {
	const nodeContainer = target.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`);
	const expanderWrapper = nodeContainer?.querySelector<HTMLElement>(`[data-role="${DataRoles.Tree.Node.Expander}"]`);
	const expanderButton = expanderWrapper?.querySelector<HTMLButtonElement>("button");
	const isExpanded = expanderButton?.getAttribute("aria-expanded") === "true";

	if (event.key === Key.ArrowRight) {
		if (!expanderButton || expanderButton.disabled) {
			event.preventDefault();
		} else if (!isExpanded) {
			event.preventDefault();
			expanderButton.click();
		} else {
			const firstChildRow = Array.from(nodeContainer?.querySelectorAll<HTMLElement>(NODE_CONTENT_SELECTOR) ?? []).find(
				(el) => el !== target
			);

			if (firstChildRow) {
				event.preventDefault();
				firstChildRow.focus();
				updateRovingTabIndex(currentRow, firstChildRow);
			}
		}
	} else {
		if (expanderButton && !expanderButton.disabled && isExpanded) {
			event.preventDefault();
			expanderButton.click();
		} else {
			const parentNodeContainer = nodeContainer?.parentElement?.closest<HTMLElement>(
				`[data-role="${DataRoles.Tree.Node}"]`
			);
			const parentRow = parentNodeContainer?.querySelector<HTMLElement>(NODE_CONTENT_SELECTOR);

			if (parentRow) {
				event.preventDefault();
				parentRow.focus();
				updateRovingTabIndex(currentRow, parentRow);
			}
		}
	}
}

function findAdjacentNodeActionFocusable(
	rootElement: HTMLElement | null,
	fromNodeContainer: HTMLElement | null,
	direction: "prev" | "next"
): HTMLElement | undefined {
	const allNodeContents = Array.from(rootElement?.querySelectorAll<HTMLElement>(NODE_CONTENT_SELECTOR) ?? []);
	const currentNodeIndex = allNodeContents.findIndex(
		(nodeContent) => nodeContent.closest(`[data-role="${DataRoles.Tree.Node}"]`) === fromNodeContainer
	);

	if (!fromNodeContainer || currentNodeIndex === -1) {
		return undefined;
	}

	if (direction === "prev") {
		for (let i = currentNodeIndex - 1; i >= 0; i--) {
			const nodeContainer = allNodeContents[i].closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`);
			const actionArea = nodeContainer?.querySelector<HTMLElement>(ACTION_AREA_SELECTOR);

			if (actionArea) {
				const focusables = Array.from(getAllFocusableElements(actionArea));

				if (focusables.length > 0) {
					return focusables[focusables.length - 1];
				}
			}
		}
	} else {
		for (let i = currentNodeIndex + 1; i < allNodeContents.length; i++) {
			const nodeContainer = allNodeContents[i].closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`);
			const actionArea = nodeContainer?.querySelector<HTMLElement>(ACTION_AREA_SELECTOR);

			if (actionArea) {
				const focusables = Array.from(getAllFocusableElements(actionArea));

				if (focusables.length > 0) {
					return focusables[0];
				}
			}
		}
	}

	return undefined;
}

function handleShiftTabArrowOnly(
	event: KeyboardEvent<HTMLElement>,
	target: HTMLElement,
	currentRow: HTMLElement | undefined,
	focusIsOnActionButton: boolean,
	rootRef: RefObject<HTMLElement | null>,
	updateRovingTabIndex: (oldRow: HTMLElement, newRow: HTMLElement) => void,
	activeRowRef?: RefObject<HTMLElement | null>
): void {
	if (focusIsOnActionButton && rootRef.current) {
		const actionArea = target.closest<HTMLElement>(ACTION_AREA_SELECTOR);

		if (!actionArea) {
			return;
		}

		// If there are earlier buttons in this action area, go to the previous one
		const currentAreaFocusables = Array.from(getAllFocusableElements(actionArea));
		const currentIndex = currentAreaFocusables.indexOf(target);

		if (currentIndex > 0) {
			event.preventDefault();
			currentAreaFocusables[currentIndex - 1].focus();

			return;
		}

		const currentNodeContainer = actionArea?.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`) ?? null;
		const prevFocusable = findAdjacentNodeActionFocusable(rootRef.current, currentNodeContainer, "prev");

		if (prevFocusable) {
			event.preventDefault();
			prevFocusable.focus();

			return;
		}

		if (currentRow && currentRow.getAttribute("aria-selected") !== "true") {
			event.preventDefault();
			currentRow.focus();
			const activeRow = activeRowRef?.current;

			if (activeRow && activeRow !== currentRow) {
				updateRovingTabIndex(activeRow, currentRow);
			}

			return;
		}

		const exitTarget = findFirstFocusableOutside(rootRef.current, "before");

		if (exitTarget) {
			event.preventDefault();
			exitTarget.focus();
		}
	}

	if (currentRow && rootRef.current) {
		const currentNodeContainer = currentRow.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`) ?? null;
		const prevFocusable = findAdjacentNodeActionFocusable(rootRef.current, currentNodeContainer, "prev");

		if (prevFocusable) {
			event.preventDefault();
			prevFocusable.focus();

			return;
		}

		const exitTarget = findFirstFocusableOutside(rootRef.current, "before");

		if (exitTarget) {
			event.preventDefault();
			exitTarget.focus();
		}
	}
}

function handleTabFromNodeContent(
	event: KeyboardEvent<HTMLElement>,
	target: HTMLElement,
	rootRef: RefObject<HTMLElement | null>
): void {
	const nodeContainer = target.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`);
	const actionArea = nodeContainer?.querySelector<HTMLElement>(ACTION_AREA_SELECTOR);

	if (actionArea) {
		const focusableActions = Array.from(getAllFocusableElements(actionArea));

		if (focusableActions.length > 0) {
			event.preventDefault();
			focusableActions[0].focus();

			return;
		}
	}

	if (rootRef.current) {
		const exitTarget = findFirstFocusableOutside(rootRef.current, "after");

		if (exitTarget) {
			event.preventDefault();
			exitTarget.focus();
		}
	}
}

function handleTabFromActionArea(
	event: KeyboardEvent<HTMLElement>,
	target: HTMLElement,
	rootRef: RefObject<HTMLElement | null>,
	keyboardNavMode: KeyboardNavigationMode
): void {
	const actionArea = target.closest<HTMLElement>(ACTION_AREA_SELECTOR);

	if (!actionArea || keyboardNavMode !== "arrow-only") {
		return;
	}

	// If there are more buttons in this action area, go to the next one
	const currentAreaFocusables = Array.from(getAllFocusableElements(actionArea));
	const currentIndex = currentAreaFocusables.indexOf(target);

	if (currentIndex !== -1 && currentIndex < currentAreaFocusables.length - 1) {
		event.preventDefault();
		currentAreaFocusables[currentIndex + 1].focus();

		return;
	}

	const currentNodeContainer = actionArea.closest<HTMLElement>(`[data-role="${DataRoles.Tree.Node}"]`) ?? null;
	const nextFocusable = findAdjacentNodeActionFocusable(rootRef.current, currentNodeContainer, "next");

	if (nextFocusable) {
		event.preventDefault();
		nextFocusable.focus();

		return;
	}

	if (rootRef.current) {
		const exitTarget = findFirstFocusableOutside(rootRef.current, "after");

		if (exitTarget) {
			event.preventDefault();
			exitTarget.focus();
		}
	}
}

export function useTreeKeyboardNavigation(rootRef: RefObject<HTMLElement | null> = { current: null }): {
	handleOnKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
} {
	const keyboardNavMode = useKeyboardNavigationMode("tree");
	const activeRowRef = useRef<HTMLElement | null>(null);
	const savedTabIndicesRef = useRef<Map<HTMLElement, number>>(new Map());

	const applyRovingTabIndex = useCallback((): void => {
		if (!rootRef.current) {
			return;
		}

		const allRows = Array.from(rootRef.current.querySelectorAll<HTMLElement>(NODE_CONTENT_SELECTOR));

		if (keyboardNavMode !== "arrow-only") {
			for (const [row, originalTabIndex] of savedTabIndicesRef.current) {
				if (allRows.includes(row)) {
					row.tabIndex = originalTabIndex;
				}
			}

			savedTabIndicesRef.current.clear();

			return;
		}

		if (allRows.length === 0) {
			return;
		}

		const activeRow =
			activeRowRef.current && allRows.includes(activeRowRef.current) ? activeRowRef.current : allRows[0];

		for (const row of allRows) {
			if (!savedTabIndicesRef.current.has(row)) {
				savedTabIndicesRef.current.set(row, row.tabIndex);
			}

			row.tabIndex = row === activeRow ? 0 : -1;
		}

		activeRowRef.current = activeRow;
	}, [keyboardNavMode, rootRef]);

	useEffect(() => {
		applyRovingTabIndex();
	}, [applyRovingTabIndex]);

	const updateRovingTabIndex = useCallback(
		(oldRow: HTMLElement, newRow: HTMLElement): void => {
			if (keyboardNavMode !== "arrow-only" || oldRow === newRow) {
				return;
			}

			oldRow.tabIndex = -1;
			newRow.tabIndex = 0;
			activeRowRef.current = newRow;
		},
		[keyboardNavMode]
	);

	const handleOnKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const target = event.target as HTMLElement;
			const { currentRow, focusIsOnActionButton } = resolveCurrentRow(target);

			if ((event.key === Key.ArrowUp || event.key === Key.ArrowDown) && currentRow) {
				handleArrowUpDown(event, currentRow, rootRef, updateRovingTabIndex);

				return;
			}

			if ((event.key === Key.ArrowRight || event.key === Key.ArrowLeft) && currentRow) {
				handleExpandCollapse(event, target, currentRow, updateRovingTabIndex);

				return;
			}

			if (event.key === Key.Tab && event.shiftKey && keyboardNavMode === "arrow-only") {
				handleShiftTabArrowOnly(
					event,
					target,
					currentRow,
					focusIsOnActionButton,
					rootRef,
					updateRovingTabIndex,
					activeRowRef
				);

				return;
			}

			if (event.key === Key.Tab && !event.shiftKey && currentRow && !focusIsOnActionButton) {
				if (keyboardNavMode !== "arrow-only") {
					return;
				}

				handleTabFromNodeContent(event, target, rootRef);

				return;
			}

			if (event.key === Key.Tab && !event.shiftKey) {
				handleTabFromActionArea(event, target, rootRef, keyboardNavMode);
			}
		},
		[rootRef, keyboardNavMode, updateRovingTabIndex]
	);

	return { handleOnKeyDown };
}
