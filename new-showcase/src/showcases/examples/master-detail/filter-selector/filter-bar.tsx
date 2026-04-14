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

import type { FC } from "react";
import { useRef, useState, useCallback } from "react";

import {
	Filter,
	FilterBar,
	FilterBarMobile,
	FilterSelectorTemplate,
	AttachedPortal,
	Button,
	ButtonGroup,
	ButtonGroupContainer,
	Counter,
	getAllFocusableElements
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { FilterInFilterBarData, ListOperationType } from "./data.js";
import { handleRemoveFilter } from "./common.js";
import { isValid, parseFilterInBarToFilter } from "./utils.js";
import { FilterView } from "./filter-view.js";

interface MasterDetailFilterBarProps {
	isSmallSize?: boolean;
	filters: FilterInFilterBarData[];
	onEditButtonClick?(): void;
	onRemoveFilter(id: string, done?: () => void): void;
	onClickFilter?(filter: FilterInFilterBarData): void;
	onClickApplyFilter?(filter: FilterInFilterBarData): void;
}

export const MasterDetailFilterBar: FC<MasterDetailFilterBarProps> = (props) => {
	const filterRefs = useRef<Record<string, HTMLElement | null>>({});
	const [showFilterView, setShowFilterView] = useState(false);
	const [currentFilter, setCurrentFilter] = useState<FilterInFilterBarData | null>(null);
	const [currentRef, setCurrentRef] = useState<HTMLElement | null>(null);
	const [options, setOptions] = useState("");
	const [operation, setOperation] = useState<ListOperationType | undefined>(undefined);

	const { onClickApplyFilter, filters, onRemoveFilter, isSmallSize, onEditButtonClick, onClickFilter } = props;

	const getFirstFocusableElement = useCallback((): HTMLElement | null => {
		const popupElement = document.getElementById("filter-popup");

		if (popupElement) {
			const allFocusableElements = getAllFocusableElements(popupElement);

			return allFocusableElements.item(0);
		}

		return null;
	}, []);

	const focusFirstElement = useCallback((): void => {
		const firstElement = getFirstFocusableElement();

		if (firstElement) {
			firstElement.focus();
		}
	}, [getFirstFocusableElement]);

	const handleClickOnFilter = useCallback(
		(barFilter: FilterInFilterBarData): void => {
			const options = barFilter.options ? barFilter.options.toString() : "";
			setCurrentFilter(barFilter);
			setCurrentRef(filterRefs.current[barFilter.id]);
			setShowFilterView((prevState) => !prevState);
			setOptions(options);
			setTimeout(focusFirstElement);
		},
		[focusFirstElement]
	);

	const getFilterRefs = useCallback(
		(id: string, ref: HTMLElement | null): void => {
			filterRefs.current[id] = ref;
		},
		[filterRefs]
	);

	const handleButtonApplyClick = useCallback((): void => {
		setShowFilterView(false);

		if (currentFilter) {
			const barFilterOption =
				options !== "" ? (isValid(options, currentFilter.optionType) ? options : "Inactive") : "Inactive";

			onClickApplyFilter?.({
				...currentFilter,
				options: barFilterOption,
				active: barFilterOption !== "Inactive" && barFilterOption !== "",
				operation
			} as FilterInFilterBarData);
		}
	}, [currentFilter, operation, options, onClickApplyFilter]);

	const getOptionData = useCallback((options: string, operation?: ListOperationType): void => {
		setOptions(options);
		setOperation(operation);
	}, []);

	const onFilterViewVisibilityChange = useCallback((isVisible: boolean): void => {
		setShowFilterView(isVisible);
	}, []);

	const handleFilterClose = useCallback(
		(filter: FilterInFilterBarData): void => {
			const index = filters.indexOf(filter);
			onRemoveFilter(filter.id, () => {
				const newFilters = [...filters];
				newFilters.splice(index, 1);
				setTimeout(() => handleRemoveFilter(index, newFilters, filterRefs.current));
			});
			setShowFilterView(false);
		},
		[filterRefs, filters, onRemoveFilter]
	);

	if (filters.length === 0) {
		return <></>;
	}

	if (isSmallSize) {
		return (
			<FilterBarMobile actions={<Button secondary label="Edit" onClick={onEditButtonClick} />}>
				{filters.slice(0, 2).map((barFilter) => (
					<Filter
						id={`${barFilter.id}-mobile`}
						active={barFilter.active}
						name={barFilter.name}
						options={barFilter.options}
						key={barFilter.id}
						onClose={() => onRemoveFilter(barFilter.id)}
						onClick={() => onClickFilter?.(barFilter)}
						nonRemovable={barFilter.nonRemovable}
					/>
				))}
				{filters.length > 2 && <Counter value={filters.length - 2} overflowCount={9} />}
			</FilterBarMobile>
		);
	}

	return (
		<>
			<FilterBar>
				{filters.map((barFilter) => (
					<Filter
						id={barFilter.id}
						active={barFilter.active}
						name={barFilter.name}
						options={barFilter.options}
						key={barFilter.id}
						onClose={() => handleFilterClose(barFilter)}
						onClick={() => handleClickOnFilter(barFilter)}
						filterRef={(ref) => getFilterRefs(barFilter.id, ref)}
						nonRemovable={barFilter.nonRemovable}
						ariaExpanded={showFilterView && currentFilter?.id === barFilter.id}
					/>
				))}
			</FilterBar>
			{showFilterView && currentRef && currentFilter && (
				<AttachedPortal
					referenceElement={currentRef}
					orientationList={["bottom-start", "bottom-end", "top-start", "top-end"]}
					fixedOrientation
					closeOnOutsideClick
					closeOnClickReferenceElement={false}
					onVisibilityChange={onFilterViewVisibilityChange}
					focusOnReferenceElementAfterClose
				>
					<FilterSelectorTemplate
						id="filter-popup"
						secondaryContent={
							<FilterView.View
								filter={parseFilterInBarToFilter(currentFilter)}
								getOptionData={getOptionData}
								isMobile={isSmallSize}
							/>
						}
						footerContent={
							<ButtonGroupContainer>
								<ButtonGroup alignment="right">
									<Button primary onClick={handleButtonApplyClick}>
										Apply
									</Button>
								</ButtonGroup>
							</ButtonGroupContainer>
						}
					/>
				</AttachedPortal>
			)}
		</>
	);
};
