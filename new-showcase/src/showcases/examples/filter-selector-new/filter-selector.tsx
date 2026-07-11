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

import type { ReactElement, ReactNode } from "react";
import { useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";

import {
	ContentBox,
	ContentBoxElements,
	useFilterFocusManagement,
	SizeContext,
	Table,
	Pagination,
	CssEllipsis
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { ContentBoxWrapperProps } from "../../examples/master-detail/showcase-content-box-wrapper.api.js";
import type { StringRow } from "../../examples/master-detail/master-view.js";
import { TABLE_COLUMNS, ROWS_PER_PAGE, createTableData, updateOrAddFilter } from "../../contentbox/data.js";

import type { FilterData, FilterInFilterBarData } from "./filter/type.js";
import {
	PRESET_FILTER_DEFINITIONS,
	ADDITIONAL_FILTER_DEFINITIONS,
	createFiltersFromDefinitions,
	normalizeFilterId
} from "./filter/data.js";
import { FilterPaneContent } from "./filter/filter-pane-content.js";
import { FilterBarShowcase } from "./filter/filter-bar.js";
import { FilterProvider, useFilterContext } from "./filter/filter-context.js";

export const TABLE_DATA = createTableData();

const FilterSelectorContentBoxInner = (props: ContentBoxWrapperProps): ReactElement => {
	const { onShowFilterBarOnMobile } = props;
	const context = useContext(SizeContext);
	const {
		state: { openFilterSelector, panelOptions },
		updateField,
		toggleFilterSelector,
		updateFilters
	} = useFilterContext();

	const [page, setPage] = useState(1);

	const allDefaultFilters = useMemo(
		() => [
			...createFiltersFromDefinitions(PRESET_FILTER_DEFINITIONS),
			...createFiltersFromDefinitions(ADDITIONAL_FILTER_DEFINITIONS)
		],
		[]
	);

	const [activeFiltersState, setActiveFiltersState] = useState<FilterData[]>(() =>
		props.activeFilters?.length ? props.activeFilters : allDefaultFilters.filter((f) => f.active)
	);
	const [inactiveFiltersState, setInactiveFiltersState] = useState<FilterData[]>(() =>
		props.inactiveFilters?.length ? props.inactiveFilters : allDefaultFilters.filter((f) => !f.active)
	);
	const [hiddenFilterIndices, setHiddenFilterIndices] = useState<number[]>([]);
	const [filterActions, setFilterActions] = useState<ReactNode>(null);
	const [focusedFilterId, setFocusedFilterId] = useState<string | null>(null);
	const [focusPaneOnLayoutChange, setFocusPaneOnLayoutChange] = useState(false);

	const allFilters = useMemo(
		() => [...activeFiltersState, ...inactiveFiltersState],
		[activeFiltersState, inactiveFiltersState]
	);

	const filterToggleRef = useRef<HTMLElement | null>(null);

	const { isFallbackFocus } = useFilterFocusManagement({
		filters: allFilters,
		focusedFilterId,
		hiddenIndices: hiddenFilterIndices
	});

	const prevHiddenFilterIndicesRef = useRef<number[]>([]);

	useEffect(() => {
		const prev = prevHiddenFilterIndicesRef.current;
		prevHiddenFilterIndicesRef.current = hiddenFilterIndices;

		if (!openFilterSelector || !focusedFilterId) {
			return;
		}

		const focusedIndex = allFilters.findIndex((f) => f.id === focusedFilterId);

		if (focusedIndex === -1) {
			return;
		}

		if (prev.includes(focusedIndex) && !hiddenFilterIndices.includes(focusedIndex)) {
			setFocusPaneOnLayoutChange(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hiddenFilterIndices]);

	useEffect(() => {
		if (focusPaneOnLayoutChange) {
			setFocusPaneOnLayoutChange(false);
		}
	}, [focusPaneOnLayoutChange]);

	const filteredTableData = useMemo(() => {
		const filtersWithValues = activeFiltersState.filter((f) => f.options?.toString().trim());

		if (!filtersWithValues.length) {
			return TABLE_DATA;
		}

		return TABLE_DATA.filter((row) => {
			const rowText = row.join(" ").toLowerCase();
			const matches = filtersWithValues.map((filter) => rowText.includes(filter.options.toString().toLowerCase()));
			const result = panelOptions.matchMode === "any" ? matches.some((m) => m) : matches.every((m) => m);

			return panelOptions.invertResult ? !result : result;
		});
	}, [activeFiltersState, panelOptions.matchMode, panelOptions.invertResult]);

	const toFilterInFilterBar = useCallback(
		(d: FilterData): FilterInFilterBarData => ({
			id: d.id,
			name: d.label ?? d.id,
			options: d.options ?? "",
			active: !!d.active,
			optionType: d.optionType,
			nonRemovable: !!d.nonRemovable,
			preset: !!d.preset
		}),
		[]
	);

	const handleLiveFilterChange = useCallback((newActive: FilterData[], newInactive: FilterData[]) => {
		setActiveFiltersState(newActive);
		setInactiveFiltersState(newInactive);
	}, []);

	const handleApplyFiltersFromPane = useCallback(
		(newActive: FilterData[], newInactive: FilterData[]) => {
			handleLiveFilterChange(newActive, newInactive);
			updateField("openFilterSelector", false);
		},
		[handleLiveFilterChange, updateField]
	);

	const handleRemoveFilter = useCallback((id: string, done?: () => void) => {
		if (!id) {
			return;
		}

		const normalizedId = normalizeFilterId(id);

		setActiveFiltersState((prev) => prev.filter((f) => f.id !== normalizedId));
		setInactiveFiltersState((prev) => prev.filter((f) => f.id !== normalizedId));

		done?.();
	}, []);

	const handleResetAllFilters = useCallback(() => {
		const resetFilters = allFilters.map((filter) => ({ ...filter, active: filter.preset === true, options: "" }));
		setActiveFiltersState(resetFilters.filter((f) => f.active));
		setInactiveFiltersState(resetFilters.filter((f) => !f.active));
	}, [allFilters]);

	const handleApplyFilterFromBar = useCallback(
		(updatedFilter: FilterInFilterBarData) => {
			const filterData: FilterData = {
				id: updatedFilter.id,
				label: updatedFilter.name as string,
				options: updatedFilter.options,
				active: updatedFilter.active,
				optionType: updatedFilter.optionType,
				nonRemovable: updatedFilter.nonRemovable,
				preset: updatedFilter.preset
			};
			const updatedAll = updateOrAddFilter(allFilters, filterData);
			const newActive = updatedAll.filter((f) => f.active);
			const newInactive = updatedAll.filter((f) => !f.active);
			setActiveFiltersState(newActive);
			setInactiveFiltersState(newInactive);
			updateFilters(newActive, newInactive);
		},
		[allFilters, updateFilters]
	);

	const handleClosePane = () => {
		updateField("openFilterSelector", false);
	};

	useEffect(() => onShowFilterBarOnMobile?.(allFilters.length > 0), [onShowFilterBarOnMobile, allFilters]);

	const isSmallSize = context.currentSize === "sm" || context.currentSize === "xs";
	const displayTitle = panelOptions.isPinned
		? props.title.replace("Overlay", "Docked")
		: props.title.replace("Docked", "Overlay");

	return (
		<ContentBox
			heading={
				<ContentBoxElements.Heading suffixes={isSmallSize && filterActions}>
					<CssEllipsis maxLine={1}>
						<ContentBoxElements.Title text={displayTitle} />
					</CssEllipsis>
				</ContentBoxElements.Heading>
			}
			footer={
				<ContentBoxElements.Footer>
					<Pagination
						id="multiselect-table-pagination"
						alignment="right"
						currentPage={page}
						pageCount={Math.ceil(filteredTableData.length / ROWS_PER_PAGE)}
						onPageChanged={setPage}
						pageLabelTemplate="{page} / {total}"
					/>
				</ContentBoxElements.Footer>
			}
			subHeading={
				<ContentBoxElements.SubHeading>
					<FilterBarShowcase
						isSmallSize={isSmallSize}
						filters={allFilters.map(toFilterInFilterBar)}
						onRemoveFilter={handleRemoveFilter}
						onClickApplyFilter={handleApplyFilterFromBar}
						filterToggleRef={filterToggleRef}
						onFilterPanelToggle={toggleFilterSelector}
						isFilterPanelOpen={openFilterSelector}
						onResetAllFilters={handleResetAllFilters}
						onHiddenFiltersChange={setHiddenFilterIndices}
						renderActions={setFilterActions}
						onFocusedFilterChange={setFocusedFilterId}
						isFallbackFocus={isFallbackFocus && !openFilterSelector}
					/>
				</ContentBoxElements.SubHeading>
			}
			sidePanels={{
				right: {
					hide: !openFilterSelector,
					mode: panelOptions.isPinned ? "docked" : "overlay",
					onClose: handleClosePane,
					triggerReference: filterToggleRef,
					content: (
						<FilterPaneContent
							activeFilters={activeFiltersState}
							inactiveFilters={inactiveFiltersState}
							onApplyButtonClick={handleApplyFiltersFromPane}
							onFilterChange={handleLiveFilterChange}
							onCloseButtonClick={handleClosePane}
							hiddenFilterIndices={hiddenFilterIndices}
							onFocusedFilterChange={setFocusedFilterId}
							isFallbackFocus={(isFallbackFocus && openFilterSelector) || focusPaneOnLayoutChange}
						/>
					)
				}
			}}
			padding={false}
		>
			<Table<StringRow> data={filteredTableData} columns={TABLE_COLUMNS} virtualScrollOptions={true} />
		</ContentBox>
	);
};

export const FilterSelector = (props: ContentBoxWrapperProps): ReactElement => {
	return (
		<FilterProvider>
			<FilterSelectorContentBoxInner {...props} />
		</FilterProvider>
	);
};

export default FilterSelector;
