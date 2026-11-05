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
 * Windowed option list for the {@link DropDown}: only the options in view (plus a small overscan)
 * are mounted, while a spacer keeps the scroll height of the full list. Option heights are measured
 * as they appear, so options of differing height — a secondary text, a wrapping label — position
 * correctly without the caller declaring a fixed row height.
 * @module
 */

import { useVirtualizer } from "@tanstack/react-virtual";
import type { CSSProperties, ReactElement, ReactNode, RefCallback } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledDropdownVirtualSpacer } from "./dropdown.tpl.styled.js";

const OVERSCAN = 8;

/** How the option should sit in the viewport once scrolled to. */
export type VirtualScrollAlignment = "auto" | "start" | "center" | "end";

/** Lets the option list be scrolled to options that are not currently mounted. */
export interface DropdownVirtualizerHandle {
	scrollToIndex(index: number, align?: VirtualScrollAlignment): void;
}

export interface VirtualizedDropdownContentProps {
	/** Number of rows the list renders — its options and the section headers between them. */
	count: number;

	/** Height assumed for the row at `index` while it has not been measured. */
	estimateRowHeight(index: number): number;

	getScrollElement(): HTMLElement | null;

	handleRef(handle: DropdownVirtualizerHandle | null): void;

	renderRow(index: number, style: CSSProperties, measureRef: RefCallback<HTMLElement>): ReactNode;
}

export function VirtualizedDropdownContent({
	count,
	estimateRowHeight,
	getScrollElement,
	handleRef,
	renderRow
}: VirtualizedDropdownContentProps): ReactElement {
	// Held in a ref, so that a caller passing a fresh callback on every render does not make TanStack
	// re-measure the whole list each time.
	const estimate = useRef(estimateRowHeight);
	estimate.current = estimateRowHeight;

	const estimateSize = useCallback((index: number): number => estimate.current(index), []);
	const virtualizer = useVirtualizer({
		count,
		getScrollElement,
		estimateSize,
		overscan: OVERSCAN
	});

	// Every mounted option reports its real height. `data-index` is how TanStack attributes a
	// measurement to an item, so it has to be stamped before the node is handed over.
	//
	// One ref per option, kept for as long as the list lives: a fresh callback each render would make
	// React detach and re-attach every mounted option — dropping it from the item registry and having
	// TanStack re-measure it — and would defeat the memo on the options themselves.
	const measureRefFor = useMemo(() => {
		const refs = new Map<number, RefCallback<HTMLElement>>();

		return (index: number): RefCallback<HTMLElement> => {
			let ref = refs.get(index);

			if (!ref) {
				ref = (node): void => {
					if (node) {
						node.dataset.index = String(index);
					}

					virtualizer.measureElement(node);
				};

				refs.set(index, ref);
			}

			return ref;
		};
	}, [virtualizer]);

	// Same for the style that positions an option: one that has not moved keeps the very object it was
	// given, so that the memo on it holds while its neighbours are re-rendered.
	const styleFor = useMemo(() => {
		const styles = new Map<number, { offset: number; style: CSSProperties }>();

		return (index: number, offset: number): CSSProperties => {
			const cached = styles.get(index);

			if (cached?.offset === offset) {
				return cached.style;
			}

			const style: CSSProperties = {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				transform: `translateY(${offset}px)`
			};

			styles.set(index, { offset, style });

			return style;
		};
	}, []);

	// A stable handle, so registering it does not depend on the virtualizer's render cycle.
	const handle = useRef<DropdownVirtualizerHandle>({ scrollToIndex: () => undefined });
	handle.current.scrollToIndex = (index: number, align: VirtualScrollAlignment = "auto"): void =>
		virtualizer.scrollToIndex(index, { align });

	useEffect(() => {
		handleRef(handle.current);

		return (): void => handleRef(null);
	}, [handleRef]);

	return (
		<StyledDropdownVirtualSpacer
			// Presentational: it exists to hold the scroll height, and taking it out of the accessibility
			// tree keeps the options the effective children of the listbox.
			role="presentation"
			data-role={DataRoles.Dropdown.VirtualSpacer}
			style={{ height: virtualizer.getTotalSize() }}
		>
			{virtualizer
				.getVirtualItems()
				.map((virtualItem) =>
					renderRow(virtualItem.index, styleFor(virtualItem.index, virtualItem.start), measureRefFor(virtualItem.index))
				)}
		</StyledDropdownVirtualSpacer>
	);
}

VirtualizedDropdownContent.displayName = "VirtualizedDropdownContent";
