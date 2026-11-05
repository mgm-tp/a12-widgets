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
 * The active option of a {@link DropDown}, held outside the list itself.
 *
 * A combobox is built from an input that keeps the focus and a list that holds the options, so the
 * two have to agree on which option is active: the input reports it through
 * `aria-activedescendant` and hands arrow keys over, the list highlights and scrolls it. That used
 * to mean holding on to the rendered `DropDown` and calling into it — and, to move the active option
 * to a particular item, working out that item's position in the list's own flattening of the items.
 *
 * The handle here turns both around: the active option becomes state the caller renders from, and
 * moving it is a matter of naming an option.
 * @module
 */

import type { KeyboardEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import { findEdgeIndex, findItemIndex, buildNavigationModel } from "./dropdown.navigation.js";
import type {
	DropDownItem,
	DropdownNavigationHandle,
	DropdownNavigationOptions,
	DropdownNavigationTarget
} from "./dropdown.tpl.api.js";
import { isSameDropdownItem } from "./dropdown.utils.js";

interface ActiveState {
	index?: number;
	linkIndex?: number;
}

const NOTHING_ACTIVE: ActiveState = {};

/**
 * Keeps the active option of a {@link DropDown} and hands it back as a
 * {@link DropdownNavigationHandle}, to be passed to the list as its `navigation` prop.
 *
 * ```tsx
 * const navigation = useDropdownNavigation({ items, getItemKey });
 *
 * <input
 *   role="combobox"
 *   aria-activedescendant={navigation.activeItem?.id}
 *   onKeyDown={navigation.handleKeyDown}
 * />
 * <DropDown items={items} getItemKey={getItemKey} navigation={navigation} />
 * ```
 * @param options the option list the active option refers to, and how to identify an option in it
 * @returns the handle
 */
export function useDropdownNavigation<T = unknown>(options: DropdownNavigationOptions<T>): DropdownNavigationHandle<T> {
	const { items, getItemKey } = options;
	const [active, setActive] = useState<ActiveState>(NOTHING_ACTIVE);
	const target = useRef<DropdownNavigationTarget | null>(null);

	// The same flattening the list applies to `items`, so a position means the same on both sides.
	// Rows are left out: the lookups below run over the options themselves, and grouping them into
	// rows would take measuring the rendered list.
	const model = useMemo(() => buildNavigationModel(items), [items]);
	const latest = useRef({ model, getItemKey });
	latest.current = { model, getItemKey };

	const setActiveIndex = useCallback((index: number | undefined): void => {
		// Bails out when nothing changes, so that the list reporting the position it already has —
		// which it does after every update of the items — does not schedule another render.
		setActive((current) => (current.index === index ? current : { ...current, index }));
	}, []);

	const setActiveLinkIndex = useCallback((linkIndex: number | undefined): void => {
		setActive((current) => (current.linkIndex === linkIndex ? current : { ...current, linkIndex }));
	}, []);

	const setActiveItem = useCallback(
		(item: DropDownItem<T> | undefined): void => {
			const { model: currentModel, getItemKey: currentGetItemKey } = latest.current;
			setActiveIndex(
				findItemIndex(currentModel, item, (one, other) => isSameDropdownItem(one, other, currentGetItemKey))
			);
		},
		[setActiveIndex]
	);

	const moveToFirst = useCallback((): void => setActiveIndex(findEdgeIndex(latest.current.model, 1)), [setActiveIndex]);
	const moveToLast = useCallback((): void => setActiveIndex(findEdgeIndex(latest.current.model, -1)), [setActiveIndex]);
	const reset = useCallback(
		(): void => setActive((current) => (current === NOTHING_ACTIVE ? current : NOTHING_ACTIVE)),
		[]
	);

	const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>): void => {
		// Key handling stays with the list: it measures the rows of a wrapping grid and scrolls the
		// option it moves to into view, neither of which can be done without the rendered options.
		target.current?.handleForwardedKeyboardEvent(event);
	}, []);

	const attach = useCallback((attached: DropdownNavigationTarget | null): void => {
		target.current = attached;
	}, []);

	// Keeps its identity for as long as the active option and the item list do. The list re-attaches
	// itself to the handle whenever the object changes — a fresh one per render would make that guard
	// fire on every update — and callers hold it in effect dependencies.
	return useMemo(
		() => ({
			activeIndex: active.index,
			activeItem: active.index === undefined ? undefined : model.entries[active.index]?.item,
			activeLinkIndex: active.linkIndex,
			handleKeyDown,
			setActiveIndex,
			setActiveItem,
			setActiveLinkIndex,
			moveToFirst,
			moveToLast,
			reset,
			attach
		}),
		[
			active,
			model,
			handleKeyDown,
			setActiveIndex,
			setActiveItem,
			setActiveLinkIndex,
			moveToFirst,
			moveToLast,
			reset,
			attach
		]
	);
}
