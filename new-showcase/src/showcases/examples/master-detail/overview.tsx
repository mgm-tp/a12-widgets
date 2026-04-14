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

import type { ChangeEvent, ReactNode, ReactElement } from "react";
import { useContext, useRef, useState, useCallback, useMemo, useEffect } from "react";

import {
	ActionContentbox,
	SubActionBarTpl,
	ContentBoxElements,
	Badge,
	SizeContext,
	TextField,
	Icon,
	Button
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { Data, FilterInFilterBarData } from "./filter-selector/data.js";
import * as Utils from "./filter-selector/common.js";
import { Actions, HeadingButtons } from "./master-detail-template.js";
import { MasterDetailFilterSelector } from "./filter-selector/filter-selector.js";
import { MasterDetailFilterBar } from "./filter-selector/filter-bar.js";
import { DATA } from "./setup.js";
import { setFiltersOptions } from "./filter-selector/utils.js";
import type { ContentBoxWrapperProps } from "./showcase-content-box-wrapper.api.js";

export const Overview = (props: ContentBoxWrapperProps): ReactElement => {
	const { onShowFilterBarOnMobile, onApplyFilter, onRemoveFilter } = props;
	const context = useContext(SizeContext);

	const triggerElement = useRef<HTMLElement | null>(null);
	const searchBarInputRef = useRef<HTMLElement | null>(null);

	const [openFilterSelector, setOpenFilterSelector] = useState(false);
	const [activeFilters, setActiveFilters] = useState(setFiltersOptions(Utils.getActiveFilters(DATA.filterData)));
	const [inactiveFilters, setInactiveFilter] = useState(setFiltersOptions(Utils.getInactiveFilters(DATA.filterData)));
	const [filtersInFilterBar, setFiltersInFilterBar] = useState<FilterInFilterBarData[]>(props.filtersInFilterBar ?? []);
	const [searchBarText, setSearchBarText] = useState("");
	const [showFilterBarOnMobile, setShowFilterBarOnMobile] = useState(false);
	const [showSearchBarOnMobile, setShowSearchBarOnMobile] = useState(false);
	const [currentFilterId, setCurrentFilterId] = useState<string | undefined>(undefined);
	const [showHiddenFilterText, setShowHiddenFilterText] = useState(false);

	const getFilterButtonRef = useCallback((ref: HTMLButtonElement) => {
		if (ref) {
			triggerElement.current = ref;
		}
	}, []);

	const onFilterSelectorVisibilityChange = useCallback((isVisible: boolean): void => {
		setOpenFilterSelector(isVisible);
		triggerElement.current?.focus();
	}, []);

	const onFilterSelectorCloseButtonClick = useCallback((): void => {
		setOpenFilterSelector(false);
		setShowFilterBarOnMobile(filtersInFilterBar.length > 0);
		onShowFilterBarOnMobile?.(filtersInFilterBar.length > 0);
	}, [filtersInFilterBar.length, onShowFilterBarOnMobile]);

	const onFilterSelectorApplyButtonClick = useCallback(
		(activeFilters: Data[], inactiveFilters: Data[]): void => {
			const filtersInFilterBar = Utils.getFiltersInFilterBar(activeFilters.concat(inactiveFilters), true);
			setOpenFilterSelector(false);
			setFiltersInFilterBar(filtersInFilterBar);
			setActiveFilters(activeFilters);
			setInactiveFilter(inactiveFilters);
			setShowFilterBarOnMobile(filtersInFilterBar.length > 0);
			onApplyFilter?.(activeFilters, inactiveFilters, filtersInFilterBar);
			onShowFilterBarOnMobile?.(filtersInFilterBar.length > 0);
		},
		[onApplyFilter, onShowFilterBarOnMobile]
	);

	const onClickApplyFilterViewDesktop = useCallback(
		(changedFilter: FilterInFilterBarData): void => {
			const newFiltersInBar = filtersInFilterBar.map((barFilter) => {
				if (barFilter.id === changedFilter.id) {
					return changedFilter;
				}

				return barFilter;
			});
			const newActiveFilters = activeFilters.map((filter) => {
				if (changedFilter.id.substr(4, changedFilter.id.length) === filter.id) {
					return { ...filter, options: changedFilter.options, operation: changedFilter.operation };
				}

				return filter;
			});
			setFiltersInFilterBar(newFiltersInBar);
			setActiveFilters(newActiveFilters);
			onApplyFilter?.(newActiveFilters, inactiveFilters, newFiltersInBar);
		},
		[activeFilters, filtersInFilterBar, inactiveFilters, onApplyFilter]
	);

	const clickFilterButtonOnLargeSize = useCallback((): void => {
		setOpenFilterSelector((prevState) => !prevState);
	}, []);

	const onSearchBarChange = useCallback((ev: ChangeEvent<HTMLInputElement>): void => {
		setSearchBarText(ev.target.value);
	}, []);

	const clickEditButtonSmSize = useCallback((): void => {
		setOpenFilterSelector(true);
		setCurrentFilterId(undefined);
	}, []);

	const clickFilterButtonSmSize = useCallback((): void => {
		if (filtersInFilterBar.length === 0) {
			setOpenFilterSelector(true);
		} else {
			setShowFilterBarOnMobile((prevState) => !prevState);
		}
	}, [filtersInFilterBar.length]);

	const clickFilterInBarSmSize = useCallback((barFilter: FilterInFilterBarData): void => {
		setOpenFilterSelector(true);
		setCurrentFilterId(barFilter.id.substr(4, barFilter.id.length));
	}, []);

	const clickSearchButtonSmSize = useCallback((): void => {
		setShowSearchBarOnMobile((prevState) => !prevState);

		if (showSearchBarOnMobile) {
			searchBarInputRef.current?.focus();
		}
	}, [showSearchBarOnMobile]);

	const removeFilterInFilterBar = useCallback(
		(id: string, done?: () => void): void => {
			const filterId = id.substr(4, id.length);
			const newFilters = [
				...Utils.toggleFilterInList(filterId, activeFilters),
				...Utils.toggleFilterInList(filterId, inactiveFilters)
			];
			const newActiveFilters = Utils.getActiveFilters(newFilters);
			const newInactiveFilters = Utils.getInactiveFilters(newFilters);
			setActiveFilters(newActiveFilters);
			setInactiveFilter(newInactiveFilters);
			setFiltersInFilterBar((prevState) => prevState.filter((barFilter) => barFilter.id !== id));
			done?.();
			onRemoveFilter?.(id, newActiveFilters, newInactiveFilters, filtersInFilterBar);
		},
		[activeFilters, filtersInFilterBar, inactiveFilters, onRemoveFilter]
	);

	const renderSubHeadingElements = useMemo(
		() =>
			(isSmallSize: boolean): ReactNode => {
				const { NoFilterChosen } = Utils;
				const content = !isSmallSize ? (
					<>
						<ContentBoxElements.ActionBar>
							<Actions
								filterButtonIcon={<Icon>{openFilterSelector ? "close" : "filter_list"}</Icon>}
								buttonRef={getFilterButtonRef}
								onClick={clickFilterButtonOnLargeSize}
								isMobile={isSmallSize}
								filterSelectorIsOpening={openFilterSelector}
							/>
						</ContentBoxElements.ActionBar>
						<MasterDetailFilterBar
							filters={filtersInFilterBar}
							onRemoveFilter={removeFilterInFilterBar}
							onClickApplyFilter={onClickApplyFilterViewDesktop}
						/>
					</>
				) : (
					<>
						<SubActionBarTpl hidden={!showSearchBarOnMobile}>
							<TextField
								onChange={onSearchBarChange}
								value={searchBarText}
								key="search"
								placeholder="Search..."
								suffixes={<Button icon={<Icon>search</Icon>} title="Search" onClick={() => undefined} />}
								inputRef={(ref) => {
									searchBarInputRef.current = ref;
								}}
							/>
						</SubActionBarTpl>
						<SubActionBarTpl hidden={!showFilterBarOnMobile}>
							<MasterDetailFilterBar
								isSmallSize={isSmallSize}
								filters={filtersInFilterBar}
								onEditButtonClick={clickEditButtonSmSize}
								onRemoveFilter={removeFilterInFilterBar}
								onClickFilter={clickFilterInBarSmSize}
							/>
						</SubActionBarTpl>
					</>
				);

				return (
					<>
						{content}
						{showHiddenFilterText && <NoFilterChosen onBlur={() => setShowHiddenFilterText(false)} />}
					</>
				);
			},
		[
			clickEditButtonSmSize,
			clickFilterButtonOnLargeSize,
			clickFilterInBarSmSize,
			filtersInFilterBar,
			onClickApplyFilterViewDesktop,
			onSearchBarChange,
			openFilterSelector,
			removeFilterInFilterBar,
			searchBarText,
			showFilterBarOnMobile,
			showHiddenFilterText,
			showSearchBarOnMobile,
			getFilterButtonRef
		]
	);

	useEffect(() => onShowFilterBarOnMobile?.(showFilterBarOnMobile), [onShowFilterBarOnMobile, showFilterBarOnMobile]);

	useEffect(() => {
		const { activeFilters, inactiveFilters, showFilterBarOnMobile } = props;

		if (activeFilters && inactiveFilters && showFilterBarOnMobile !== undefined) {
			setShowFilterBarOnMobile(showFilterBarOnMobile);
			setActiveFilters(activeFilters);
			setInactiveFilter(inactiveFilters);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => setShowHiddenFilterText(filtersInFilterBar.length === 0), [filtersInFilterBar.length]);

	const isSmallSize = context.currentSize === "sm" || context.currentSize === "xs";

	return (
		<ActionContentbox
			headingButtons={
				isSmallSize && (
					<HeadingButtons
						searchActive={showSearchBarOnMobile}
						searchBadge={<Badge tiny light variant="info" hidden={showSearchBarOnMobile || searchBarText === ""} />}
						filterActive={showFilterBarOnMobile && filtersInFilterBar.length > 0}
						filterBadge={
							<Badge tiny light variant="info" hidden={showFilterBarOnMobile || filtersInFilterBar.length === 0} />
						}
						onFilterButtonClick={clickFilterButtonSmSize}
						onSearchButtonClick={clickSearchButtonSmSize}
					/>
				)
			}
			headingElements={<ContentBoxElements.Title text={props.title} />}
			subActionBar={renderSubHeadingElements(isSmallSize)}
			padding={false}
			buttons={isSmallSize ? <Button label="Add" icon={<Icon>add</Icon>} /> : undefined}
		>
			{openFilterSelector && (
				<MasterDetailFilterSelector
					activeFilters={activeFilters}
					inactiveFilters={inactiveFilters}
					referenceElement={triggerElement.current}
					onVisibilityChange={onFilterSelectorVisibilityChange}
					onCloseButtonClick={onFilterSelectorCloseButtonClick}
					onApplyButtonClick={onFilterSelectorApplyButtonClick}
					currentFilterId={currentFilterId}
					isSmallSize={isSmallSize}
				/>
			)}
			{props.children}
		</ActionContentbox>
	);
};
