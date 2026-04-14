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
import { useState, useRef, useCallback, useMemo } from "react";

import {
	FilterBar,
	Filter,
	FilterSelectorTemplate,
	FilterBarMobile,
	ActionContentbox,
	ContentBoxElements,
	SubActionBarTpl,
	Button,
	Icon,
	ButtonGroupContainer,
	ButtonGroup,
	noop,
	provider,
	ModalOverlay,
	AttachedPortal,
	Badge,
	TextField,
	Counter
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { Data, FilterInFilterBarData } from "./data.js";
import { filterData, contentInContentBox } from "./data.js";
import * as Utils from "./utils.js";
import { FilterViewTemplate } from "./template.js";
import { ShowcaseFilterSelector } from "./filter-selector.js";

export function FilterSelectorShowcase(): ReactElement {
	const isMobile = provider.isPhone();

	const [activeFilters, setActiveFilters] = useState(Utils.getActiveFilters(filterData));
	const [inactiveFilters, setInactiveFilters] = useState(Utils.getInactiveFilters(filterData));
	const [filtersInFilterBar, setFiltersInFilterBar] = useState(
		Utils.getFiltersInFilterBar(Utils.getActiveFilters(filterData))
	);
	const [currentFilterId, setCurrentFilterId] = useState<string | undefined>(undefined);

	const [openFilterSelector, setOpenFilterSelector] = useState(false);
	const [showMobileFilterBar, setShowMobileFilterBar] = useState(false);
	const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

	const triggerElement = useRef<HTMLElement | null>(null);
	const searchBarInputRef = useRef<HTMLElement | null>(null);
	const filterInBarRefs = useRef<Record<string, HTMLElement | null>>({});

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
		setShowMobileFilterBar(filtersInFilterBar.length > 0);
	}, [filtersInFilterBar.length]);

	const onFilterSelectorApplyButtonClick = useCallback((activeFilters: Data[], inactiveFilters: Data[]): void => {
		const filtersInFilterBar = Utils.getFiltersInFilterBar(activeFilters.concat(inactiveFilters));
		setOpenFilterSelector(false);
		setFiltersInFilterBar([...filtersInFilterBar]);
		setActiveFilters(activeFilters);
		setInactiveFilters(inactiveFilters);
		setShowMobileFilterBar(filtersInFilterBar.length > 0);
	}, []);

	const handleDesktopFilterButtonClick = useCallback((): void => {
		setOpenFilterSelector((prevState) => !prevState);
	}, []);

	const handleMobileFilterButtonClick = useCallback((): void => {
		if (filtersInFilterBar.length === 0) {
			setOpenFilterSelector(true);
		} else {
			setShowMobileFilterBar((prevState) => !prevState);
		}
	}, [filtersInFilterBar.length]);

	const handleMobileEditButtonClick = useCallback((): void => {
		setOpenFilterSelector(true);
		setCurrentFilterId(undefined);
	}, []);

	const handleMobileSearchButtonClick = useCallback((): void => {
		setShowMobileSearchBar((prevState) => !prevState);

		if (showMobileSearchBar) {
			searchBarInputRef.current?.focus();
		}
	}, [showMobileSearchBar]);

	const removeFilterInFilterBar = useCallback(
		(id: string): void => {
			const filterId = id.substring(4, id.length);
			const newFilters = [
				...Utils.toggleFilterInList(filterId, activeFilters),
				...Utils.toggleFilterInList(filterId, inactiveFilters)
			];
			const newActiveFilters = Utils.getActiveFilters(newFilters);
			const newInactiveFilters = Utils.getInactiveFilters(newFilters);
			setActiveFilters(newActiveFilters);
			setInactiveFilters(newInactiveFilters);
			setFiltersInFilterBar((prevState) => prevState.filter((barFilter) => barFilter.id !== id));
		},
		[activeFilters, inactiveFilters]
	);

	const handleFilterClose = useCallback(
		(filter: FilterInFilterBarData): void => {
			removeFilterInFilterBar(filter.id);

			setTimeout(() => {
				Utils.handleRemoveFilter(
					filtersInFilterBar.indexOf(filter),
					filtersInFilterBar.filter((barFilter) => barFilter.id !== filter.id),
					filterInBarRefs.current
				);
			});
		},
		[filtersInFilterBar, removeFilterInFilterBar]
	);

	const handleFilterInFilterBarMobileClick = useCallback((filterId: string): void => {
		setOpenFilterSelector(true);
		setCurrentFilterId(filterId.substring(4, filterId.length));
	}, []);

	const renderButtons = useMemo(
		() =>
			(isMobile: boolean): ReactElement | undefined => {
				if (isMobile) {
					return undefined;
				}

				return (
					<div className="-u-flex -u-justify-end h_zeroMargin">
						<FilterSelectorTemplate.SearchInput className="-u-margin-r-sm" placeholder="Search" onChange={() => {}} />
						<Button
							buttonRef={getFilterButtonRef}
							onClick={handleDesktopFilterButtonClick}
							icon={<Icon>{openFilterSelector ? "close" : "filter_list"}</Icon>}
							buttonAttributes={{ "aria-expanded": openFilterSelector }}
							title={openFilterSelector ? "Close filter" : "Open filter"}
						/>
					</div>
				);
			},
		[getFilterButtonRef, handleDesktopFilterButtonClick, openFilterSelector]
	);

	const renderHeadingButtons = useMemo(
		() =>
			(isMobile: boolean): ReactNode => {
				if (!isMobile) {
					return null;
				}

				return (
					<>
						<ContentBoxElements.HeadingActionButton
							icon={<Icon>search</Icon>}
							active={showMobileSearchBar}
							onClick={handleMobileSearchButtonClick}
							buttonAttributes={{ "aria-expanded": showMobileSearchBar }}
							title="Search"
						/>
						<ContentBoxElements.HeadingActionButton
							icon={<Icon>filter_list</Icon>}
							active={showMobileFilterBar}
							onClick={handleMobileFilterButtonClick}
							buttonAttributes={{ "aria-expanded": showMobileFilterBar }}
							badge={<Badge tiny variant="info" light hidden={showMobileFilterBar || !filtersInFilterBar.length} />}
							title="Filter"
						/>
					</>
				);
			},
		[
			filtersInFilterBar.length,
			handleMobileFilterButtonClick,
			handleMobileSearchButtonClick,
			showMobileFilterBar,
			showMobileSearchBar
		]
	);

	const renderSubHeadingElements = useMemo(
		() =>
			(isMobile: boolean): ReactNode => {
				if (isMobile) {
					return (
						<>
							<SubActionBarTpl hidden={!showMobileSearchBar}>
								<TextField
									onChange={noop}
									key="search"
									placeholder="Search..."
									suffixes={<Button icon={<Icon>search</Icon>} title="Search" onClick={() => undefined} />}
									inputRef={(ref) => {
										searchBarInputRef.current = ref;
									}}
								/>
							</SubActionBarTpl>
							<SubActionBarTpl hidden={!showMobileFilterBar}>
								<FilterBarMobile actions={<Button secondary label="Edit" onClick={handleMobileEditButtonClick} />}>
									{filtersInFilterBar.slice(0, 2).map((barFilter) => (
										<Filter
											id={`${barFilter.id}-mobile`}
											active={barFilter.active}
											name={barFilter.name}
											options={barFilter.options}
											key={barFilter.id}
											onClose={() => removeFilterInFilterBar(barFilter.id)}
											onClick={() => handleFilterInFilterBarMobileClick(barFilter.id)}
											nonRemovable={barFilter.nonRemovable}
										/>
									))}
									{filtersInFilterBar.length > 2 && <Counter value={filtersInFilterBar.length - 2} overflowCount={9} />}
								</FilterBarMobile>
							</SubActionBarTpl>
						</>
					);
				}

				filterInBarRefs.current = {};

				return (
					<>
						{filtersInFilterBar.length > 0 && (
							<FilterBar>
								{filtersInFilterBar.map((barFilter) => (
									<FilterInBar
										{...barFilter}
										active={barFilter.active}
										key={barFilter.id}
										onClose={() => handleFilterClose(barFilter)}
										nonRemovable={barFilter.nonRemovable}
										filterRef={(ref) => {
											filterInBarRefs.current[barFilter.id] = ref;
										}}
									/>
								))}
							</FilterBar>
						)}
					</>
				);
			},
		[
			filtersInFilterBar,
			handleMobileEditButtonClick,
			handleFilterClose,
			handleFilterInFilterBarMobileClick,
			removeFilterInFilterBar,
			showMobileFilterBar,
			showMobileSearchBar
		]
	);

	return (
		<ActionContentbox
			buttons={renderButtons(isMobile)}
			headingButtons={renderHeadingButtons(isMobile)}
			headingElements={<ContentBoxElements.Title text="FilterSelector" />}
			subActionBar={renderSubHeadingElements(isMobile)}
			footer={<ContentBoxElements.Footer />}
		>
			<>
				{openFilterSelector && (
					<ShowcaseFilterSelector
						activeFilters={activeFilters}
						inactiveFilters={inactiveFilters}
						referenceElement={triggerElement.current}
						onVisibilityChange={onFilterSelectorVisibilityChange}
						onCloseButtonClick={onFilterSelectorCloseButtonClick}
						onApplyButtonClick={onFilterSelectorApplyButtonClick}
						currentFilterId={currentFilterId}
						isMobile={isMobile}
					/>
				)}
				<p>{contentInContentBox}</p>
			</>
		</ActionContentbox>
	);
}

const FilterInBar = (props: FilterInFilterBarData): ReactElement => {
	const [openFilterOptions, setOpenFilterOptions] = useState(false);
	const filterRef = useRef<HTMLDivElement | null>(null);

	const handleFilterRef = useCallback(
		(ref: HTMLDivElement | null): void => {
			filterRef.current = ref;
			props.filterRef?.(ref);
		},
		[props]
	);

	const onFilterOptionsVisibilityChange = useCallback((isVisible?: boolean): void => {
		setOpenFilterOptions(!!isVisible);
	}, []);

	const onFilterClick = useCallback((): void => {
		setOpenFilterOptions((prevState) => !prevState);
	}, []);

	const onButtonSearchClick = useCallback((): void => {
		setOpenFilterOptions(false);
	}, []);

	return (
		<>
			<Filter
				{...props}
				key={props.id}
				filterRef={handleFilterRef}
				onClick={onFilterClick}
				ariaExpanded={openFilterOptions}
			/>
			{filterRef.current && openFilterOptions ? (
				provider.hasTouch() ? (
					<ModalOverlay closeOnOutsideClick onClose={onFilterOptionsVisibilityChange}>
						<FilterSelectorTemplate
							primaryContent={<FilterViewTemplate.FilterOptions {...props} />}
							footerContent={
								<ButtonGroupContainer>
									<ButtonGroup alignment="right">
										<Button primary onClick={onButtonSearchClick}>
											Apply
										</Button>
									</ButtonGroup>
								</ButtonGroupContainer>
							}
						/>
					</ModalOverlay>
				) : (
					<AttachedPortal
						referenceElement={filterRef.current}
						orientationList={["bottom-start", "bottom-end", "top-start", "top-end"]}
						fixedOrientation
						closeOnOutsideClick
						closeOnClickReferenceElement={false}
						onVisibilityChange={onFilterOptionsVisibilityChange}
						focusOnReferenceElementAfterClose
					>
						<FilterSelectorTemplate
							id="filter-popup"
							secondaryContent={<FilterViewTemplate.FilterOptions {...props} />}
							footerContent={
								<ButtonGroupContainer>
									<ButtonGroup alignment="right">
										<Button primary onClick={onButtonSearchClick}>
											Apply
										</Button>
									</ButtonGroup>
								</ButtonGroupContainer>
							}
						/>
					</AttachedPortal>
				)
			) : undefined}
		</>
	);
};
