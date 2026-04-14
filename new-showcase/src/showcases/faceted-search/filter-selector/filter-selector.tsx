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

import type { FC, ReactNode } from "react";
import { useState, useCallback, useMemo } from "react";

import type { FilterSelectorProps, FilterSelectorTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	FilterSelector,
	FilterSelectorMobile,
	FilterSelectorTemplate,
	ContentBoxElements,
	Message,
	Checkbox,
	Button,
	Icon,
	PopUpMenu,
	ButtonGroup
} from "@com.mgmtp.a12.widgets/widgets-core";

import { FilterViewTemplate } from "./template.js";
import * as Utils from "./utils.js";
import type { Data } from "./data.js";
import { sectionData } from "./data.js";

export type ShowcaseFilterSelectorProps = {
	isMobile?: boolean;
	activeFilters: Data[];
	inactiveFilters: Data[];
	currentFilterId?: string;
	referenceElement: HTMLElement | null;
	onVisibilityChange?(isVisible: boolean): void;
	onCloseButtonClick(): void;
	onApplyButtonClick(activeFilters: Data[], inactiveFilters: Data[]): void;
};

export const ShowcaseFilterSelector: FC<ShowcaseFilterSelectorProps> = (props: ShowcaseFilterSelectorProps) => {
	const [activeFilters, setActiveFilters] = useState<Data[]>(props.activeFilters);
	const [inactiveFilters, setInactiveFilters] = useState<Data[]>(props.inactiveFilters);
	const [searchParam, setSearchParam] = useState("");
	const [renderFilterView, setRenderFilterView] = useState(!!props.currentFilterId);
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [currentFilterId, setCurrentFilterId] = useState<string | undefined>(props.currentFilterId);

	const { onApplyButtonClick, onCloseButtonClick, onVisibilityChange, isMobile } = props;

	const handleFilterToggle = useCallback(
		(id: string): void => {
			const newActiveFilters = Utils.toggleFilterInList(id, activeFilters);
			const newInactiveFilters = Utils.toggleFilterInList(id, inactiveFilters);
			const isFilterActive = Utils.isFilterActive(id, [...newActiveFilters, ...newInactiveFilters]);

			setActiveFilters(newActiveFilters);
			setInactiveFilters(newInactiveFilters);
			setCurrentFilterId((prevState) => (isFilterActive ? id : prevState));
			setRenderFilterView((prevState) => (isFilterActive ? true : prevState));
		},
		[activeFilters, inactiveFilters]
	);

	const handleFilterClick = useCallback(
		(id: string): void => {
			setRenderFilterView((prevState) => (id !== currentFilterId ? true : !prevState));
			setCurrentFilterId(id);
		},
		[currentFilterId]
	);

	const handleSearchChange = useCallback((value: string): void => {
		setSearchParam(value);
	}, []);

	const handleButtonApplyClick = useCallback((): void => {
		const filters = activeFilters.concat(inactiveFilters);
		const newActiveFilters: Data[] = [...Utils.getActiveFilters(filters)];
		const newInActiveFilters: Data[] = [...Utils.getInactiveFilters(filters)];
		setActiveFilters(newActiveFilters);
		setInactiveFilters(newInActiveFilters);

		onApplyButtonClick?.(newActiveFilters, newInActiveFilters);
	}, [activeFilters, inactiveFilters, onApplyButtonClick]);

	const handleSelectAllChange = useCallback((checked: boolean): void => {
		setActiveFilters((prevState) =>
			checked ? Utils.activateAllFilters(prevState) : Utils.deactivateAllFilters(prevState)
		);
		setInactiveFilters((prevState) =>
			checked ? Utils.activateAllFilters(prevState) : Utils.deactivateAllFilters(prevState)
		);
	}, []);

	const handleCloseFilterMobile = useCallback((): void => {
		setSearchParam("");
		onCloseButtonClick();
	}, [onCloseButtonClick]);

	const handleVisibilityChange = useCallback(
		(isVisible: boolean): void => {
			setSearchParam("");
			onVisibilityChange?.(isVisible);
		},
		[onVisibilityChange]
	);

	const renderFilterViewById = useMemo(
		() =>
			(id?: string): ReactNode => {
				const filterToRender = [...activeFilters, ...inactiveFilters].find((filter) => filter.id === id);

				if (!id || !filterToRender) {
					if (isMobile) {
						return null;
					}

					return (
						<FilterSelectorTemplate.Content
							headingElements={<ContentBoxElements.Title text="Filter Options" ariaLevel={2} />}
							padding={false}
						>
							<Message>No filter selected</Message>
						</FilterSelectorTemplate.Content>
					);
				}

				return (
					<FilterViewTemplate.FilterOptions
						{...filterToRender}
						name={filterToRender.label}
						optionType={filterToRender.optionType}
						id={filterToRender.id}
						noTitle={isMobile}
					/>
				);
			},
		[activeFilters, inactiveFilters, isMobile]
	);

	const renderActionElement = useMemo(
		() =>
			(filters: Data[]): ReactNode => {
				return (
					<Checkbox.Indeterminate
						label="De/Select All"
						id="de-select-all"
						checked={
							Utils.noFilterItemSelected(filters) ? false : Utils.hasFilterItemSelected(filters) ? "mixed" : true
						}
						onChange={handleSelectAllChange}
					/>
				);
			},
		[handleSelectAllChange]
	);

	const renderMobileButton = useMemo(
		() =>
			(filters: Data[]): ReactNode => {
				return (
					<>
						<ContentBoxElements.HeadingActionButton
							icon={<Icon>search</Icon>}
							active={showSearchBar}
							onClick={() => setShowSearchBar((prevState) => !prevState)}
							buttonAttributes={{ "aria-expanded": showSearchBar }}
							title="search"
						/>
						<ContentBoxElements.HeadingAddon>
							<PopUpMenu headerTitle="Actions" triggerButtonTitle="Open actions menu">
								<Button
									disabled={!Utils.hasFilterItemSelected(filters)}
									onClick={() => handleSelectAllChange(true)}
									label="Select All"
								/>
								<Button
									destructive
									disabled={Utils.hasFilterItemSelected(filters)}
									onClick={() => handleSelectAllChange(false)}
									label="Clear All"
								/>
							</PopUpMenu>
						</ContentBoxElements.HeadingAddon>
					</>
				);
			},
		[handleSelectAllChange, showSearchBar]
	);

	const getPrimaryContentProps = useMemo(
		() =>
			(
				searchParam: string,
				filters: FilterSelectorProps.Filters
			): FilterSelectorTemplateProps.ContentProps & { ariaLabelledby: string } => {
				return {
					headingButtons: isMobile ? renderMobileButton([...activeFilters, ...inactiveFilters]) : undefined,
					headingElements: <ContentBoxElements.Title text="Filter Selector" id="header-filter-left" ariaLevel={2} />,
					ariaLabelledby: "header-filter-left",
					children: Utils.renderCustomContent(searchParam, filters)
				};
			},
		[activeFilters, inactiveFilters, isMobile, renderMobileButton]
	);

	const renderFooter = useMemo(
		() =>
			(withCancelButton?: boolean): ReactNode => {
				return (
					<ButtonGroup alignment="right">
						{withCancelButton && (
							<Button destructive onClick={handleCloseFilterMobile}>
								Cancel
							</Button>
						)}
						<Button primary onClick={handleButtonApplyClick}>
							Apply
						</Button>
					</ButtonGroup>
				);
			},
		[handleButtonApplyClick, handleCloseFilterMobile]
	);

	const renderFilterOptions = useMemo(
		() =>
			(filter: FilterSelectorProps.FilterData): ReactNode => {
				if (filter.active) {
					const f = [...activeFilters, ...inactiveFilters].find((item) => item.id === filter.id);

					return f?.options !== "Inactive" ? f?.options : <em>Inactive</em>;
				}

				return "";
			},
		[activeFilters, inactiveFilters]
	);

	const filters = useMemo(() => [...activeFilters, ...inactiveFilters], [activeFilters, inactiveFilters]);
	const inactiveFiltersWithSection = useMemo(
		() => Utils.getInactiveFiltersWithSections(searchParam, activeFilters, inactiveFilters, sectionData),
		[activeFilters, inactiveFilters, searchParam]
	);
	const sortedActiveFilters = (!searchParam.trim() && Utils.getSortedFilters(activeFilters)) || [];

	return props.isMobile ? (
		<FilterSelectorMobile
			currentFilterId={currentFilterId}
			activeFilters={sortedActiveFilters}
			inactiveFilters={inactiveFiltersWithSection}
			onFilterToggle={handleFilterToggle}
			onFilterClick={handleFilterClick}
			onSearchChange={handleSearchChange}
			renderFilterView={renderFilterView ? renderFilterViewById : undefined}
			primaryContentProps={getPrimaryContentProps(searchParam, inactiveFiltersWithSection)}
			footerContent={renderFooter(true)}
			inputPlaceholder="Filter search"
			inputHiddenLabel="Filter Search"
			id="filter-selector-example"
			hideSearchBar={!showSearchBar}
			renderFilterOptions={renderFilterOptions}
			onClose={handleCloseFilterMobile}
		/>
	) : (
		props.referenceElement && (
			<FilterSelector
				referenceElement={props.referenceElement}
				activeFilters={sortedActiveFilters}
				inactiveFilters={inactiveFiltersWithSection}
				onFilterToggle={handleFilterToggle}
				onSearchChange={handleSearchChange}
				renderFilterView={renderFilterViewById}
				onVisibilityChange={handleVisibilityChange}
				primaryContentProps={getPrimaryContentProps(searchParam, inactiveFiltersWithSection)}
				actionElement={renderActionElement(filters)}
				footerContent={renderFooter()}
				inputPlaceholder="Filter search"
				inputHiddenLabel="Filter Search"
				id="filter-selector-example"
			/>
		)
	);
};
