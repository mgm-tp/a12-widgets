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

import { useRef, useEffect, useState } from "react";

import type { FilterSelectorProps } from "../filter-selector/filter-selector.api.js";

export interface UseFilterFocusManagementOptions {
	/** List of filters being displayed */
	filters: FilterSelectorProps.FilterData[];

	/** ID of the currently focused filter element */
	focusedFilterId?: string | null;

	/** Indices of currently hidden filters */
	hiddenIndices: number[];
}

export interface UseFilterFocusManagementResult {
	/** True when the focused filter's visibility changed (hidden/visible) */
	isFallbackFocus: boolean;
}

/**
 * Focus management hook that detects when a focused filter's visibility changes.
 *
 * Returns `isFallbackFocus: true` when:
 * - The currently focused filter is moved into hiddenIndices (becomes hidden)
 * - The currently focused filter is removed from hiddenIndices (becomes visible)
 *
 * Usage:
 * ```tsx
 * const { isFallbackFocus } = useFocusManagement({
 *   filters: allFilters,
 *   focusedFilterId: currentFocusedId,
 *   hiddenIndices
 * });
 *
 * // Use isFallbackFocus to determine whether to transfer focus to fallback element
 * ```
 */
export function useFilterFocusManagement({
	filters,
	focusedFilterId,
	hiddenIndices
}: UseFilterFocusManagementOptions): UseFilterFocusManagementResult {
	const prevHiddenIndicesRef = useRef<number[]>([]);
	const [isFallbackFocus, setIsFallbackFocus] = useState(false);

	useEffect(() => {
		const focusedIndex = filters.findIndex((filter) => filter.id === focusedFilterId);

		// Skip if no focused filter and reset fallback focus state
		if (!focusedFilterId || focusedIndex < 0) {
			prevHiddenIndicesRef.current = [...hiddenIndices];
			setIsFallbackFocus(false);

			return;
		}

		const prevHidden = prevHiddenIndicesRef.current;
		const wasHidden = prevHidden.includes(focusedIndex);
		const isNowHidden = hiddenIndices.includes(focusedIndex);

		setIsFallbackFocus(wasHidden !== isNowHidden);
		prevHiddenIndicesRef.current = [...hiddenIndices];
	}, [filters, focusedFilterId, hiddenIndices]);

	return {
		isFallbackFocus
	};
}
