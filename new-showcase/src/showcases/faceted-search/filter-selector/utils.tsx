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

import type { ReactNode } from "react";

import type { FilterSelectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Message } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Data, FilterInFilterBarData, FilterOption, OptionType, SectionData } from "./data.js";

export function getActiveFilters(data: Data[]): Data[] {
	return data.filter((filter) => filter.active);
}

export function getInactiveFilters(data: Data[]): Data[] {
	return data.filter((filter) => !filter.active);
}

export function getFiltersInFilterBar(filters: Data[], keepOption?: boolean): FilterInFilterBarData[] {
	return filters
		.filter((filter) => filter.active)
		.map((activeFilter) => {
			const options = keepOption ? activeFilter.options || "Inactive" : renderFilterOptions(activeFilter.optionType);

			return {
				name: activeFilter.label,
				active: options !== "Inactive",
				id: `bar-${activeFilter.id}`,
				optionType: activeFilter.optionType,
				options,
				operation: activeFilter.operation,
				nonRemovable: activeFilter.nonRemovable
			} as FilterInFilterBarData;
		});
}

export function renderFilterOptions(optionType: OptionType): string {
	switch (optionType) {
		case "enum": {
			return "Option 1, Option 3, Option 5, Option 7, Option 10";
		}

		case "radio": {
			return "Yes";
		}

		case "number": {
			return "25,000.00";
		}

		case "time": {
			return "10 - 12:00 PM";
		}

		case "date": {
			return "July 1 - July 5";
		}

		default: {
			return "Options";
		}
	}
}

export function hasFilterOptionSelected(filters: FilterOption[]): boolean {
	return filters.some((filter) => !filter.active);
}

export function noFilterOptionsSelected(filters: FilterOption[]): boolean {
	return filters.every((filter) => !filter.active);
}

export function hasFilterItemSelected(filters: Data[]): boolean {
	return filters.some((filter) => !filter.active);
}

export function noFilterItemSelected(filters: Data[]): boolean {
	return filters.every((filter) => !filter.active);
}

export function getInactiveFiltersWithSections(
	searchParam: string,
	activeFilters: Data[],
	inactiveFilters: Data[],
	sectionData?: SectionData[]
): FilterSelectorProps.Filters {
	if (searchParam.trim()) {
		const text = searchParam.trim().toLowerCase();

		return [
			...activeFilters.filter(
				(filter) => typeof filter.label === "string" && filter.label.toLowerCase().includes(text)
			),
			...inactiveFilters.filter(
				(filter) => typeof filter.label === "string" && filter.label.toLowerCase().includes(text)
			)
		];
	}

	return [
		...inactiveFilters.filter((filter) => !filter.sectionId),
		...(sectionData?.map((section) => {
			return {
				id: section.id,
				label: section.label,
				filters: inactiveFilters.filter((filter) => {
					if (filter.sectionId === section.id) {
						const { sectionId, optionType, ...rest } = filter;

						return rest;
					}

					return null;
				})
			};
		}) ?? [])
	];
}

export function getSortedFilters(filters: Data[]): Data[] {
	return filters.sort((current, next) => {
		return typeof current.label === "string" && typeof next.label === "string"
			? current.label.toLowerCase().localeCompare(next.label.toLowerCase(), undefined, { numeric: true })
			: 1;
	});
}

export function toggleFilterInList(id: string, filters: Data[]): Data[] {
	return filters.map((filter) => {
		if (filter.id === id) {
			return {
				...filter,
				active: !filter.active,
				options: filter.active ? "" : filter.options
			};
		}

		return filter;
	});
}

export function deactivateAllFilters(filters: Data[]): Data[] {
	return filters.map((filter) => ({ ...filter, active: !!filter.nonRemovable, options: "" }));
}

export function activateAllFilters(filters: Data[]): Data[] {
	return filters.map((filter) => ({ ...filter, active: true }));
}

export function isFilterActive(filterId: string, activeFilters: Data[]): boolean {
	const activeFilter = activeFilters.filter((filter) => filter.id === filterId);

	return !!activeFilter && !!activeFilter[0] && !!activeFilter[0].active;
}

export function renderCustomContent(searchParam: string, filters: FilterSelectorProps.Filters): ReactNode {
	return searchParam.trim() && filters.length === 0 && <Message>No filter was found</Message>;
}

export function handleRemoveFilter(
	removedIndex: number,
	leftOverFilters: FilterInFilterBarData[],
	filterInBarRefs: Record<string, HTMLElement | null>,
	lastRemovedFilter?: () => void
): void {
	const newFocusIndex = removedIndex < leftOverFilters.length ? removedIndex : removedIndex - 1;
	const newFocusItem = leftOverFilters[newFocusIndex];

	if (newFocusItem) {
		const ref = filterInBarRefs[newFocusItem.id];

		if (ref) {
			const focusDataRole = newFocusItem.nonRemovable ? "filter-content" : "button";
			const contentRef = (ref as HTMLElement).querySelector(`[data-role=${focusDataRole}]`);

			if (contentRef) {
				(contentRef as HTMLElement).focus();
			}
		}
	} else {
		lastRemovedFilter?.();
	}
}
