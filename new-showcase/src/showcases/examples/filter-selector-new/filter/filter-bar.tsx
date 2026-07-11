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

import type { ReactNode, RefObject } from "react";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";

import { getAllFocusableElements, Button, Icon, Filter, Badge, Toggle } from "@com.mgmtp.a12.widgets/widgets-core";

import type { FilterItem } from "./filter-configuration.js";
import { FilterOptionsMenu, StyledToggleShowcaseWrapper } from "./filter-configuration.js";
import { LanguageFilterSection, PriceFilterSection, GenericStringFilterSection } from "./shared-filter-sections.js";
import type { FilterInFilterBarData } from "./type.js";
import { StyledFilterBar } from "./filter.styled.js";
import { FilterOptions } from "./filter-options.js";

interface FilterBarProps {
	isSmallSize?: boolean;
	filters: FilterInFilterBarData[];
	onEditButtonClick?(): void;
	onRemoveFilter(id: string, done?: () => void): void;
	onClickApplyFilter?(filter: FilterInFilterBarData): void;
	focusFilterId?: string | null;
	onFilterPanelToggle?(): void;
	isFilterPanelOpen?: boolean;
	onResetAllFilters?(): void;
	onHiddenFiltersChange?(hiddenIndices: number[]): void;
	renderActions?: (actions: ReactNode) => void;
	onFocusedFilterChange?(filterId: string | null): void;
	isFallbackFocus?: boolean;
	filterToggleRef?: RefObject<HTMLElement | null>;
}

export const FilterBarShowcase = (props: FilterBarProps) => {
	const filterRefs = useRef<Record<string, HTMLElement | null>>({});
	const filterButtonRef = useRef<HTMLElement>(null);
	const [showFilterView, setShowFilterView] = useState(false);
	const [currentFilter, setCurrentFilter] = useState<FilterInFilterBarData | null>(null);
	const [hiddenFilterCount, setHiddenFilterCount] = useState(0);
	const [currentRef, setCurrentRef] = useState<HTMLElement | null>(null);
	const [hasAppliedFilterChange, setHasAppliedFilterChange] = useState(false);

	const [matchMode, setMatchMode] = useState<"any" | "all">("any");
	const [invertResult, setInvertResult] = useState(false);
	const [emptyModeValue, setEmptyModeValue] = useState<"yes" | "no">("no");
	const [rangeModeValue, setRangeModeValue] = useState<"first" | "middle" | "last" | "equals">("first");
	const [isMainDirty, setIsMainDirty] = useState(false);
	const [isConfigDirty, setIsConfigDirty] = useState(false);

	const [languageFilters, setLanguageFilters] = useState({
		english: false,
		german: false,
		french: false,
		vietnamese: false
	});
	const [priceFrom, setPriceFrom] = useState("");
	const [priceTo, setPriceTo] = useState("");
	const [genericFilters, setGenericFilters] = useState<Record<string, string>>({
		author: "",
		genre: "",
		publisher: "",
		year: "",
		rating: "",
		format: "",
		availability: "",
		condition: "",
		category: ""
	});

	const {
		onClickApplyFilter,
		filters,
		onRemoveFilter,
		isSmallSize,
		focusFilterId,
		onFilterPanelToggle,
		isFilterPanelOpen = false,
		onResetAllFilters,
		onHiddenFiltersChange,
		renderActions,
		onFocusedFilterChange,
		isFallbackFocus,
		filterToggleRef
	} = props;

	const presetFilters = filters.filter((f) => f.preset && f.active);
	const hasAnySetFilter = filters.some((f) => f.active && f.options?.toString().trim() !== "");

	const hasMainData = useMemo(() => {
		if (!currentFilter) {
			return false;
		}

		if (currentFilter.id === "language") {
			return Object.values(languageFilters).some((v) => v);
		}

		if (currentFilter.id === "price") {
			return priceFrom.trim() !== "" || priceTo.trim() !== "";
		}

		if (currentFilter.id in genericFilters) {
			return genericFilters[currentFilter.id]?.trim() !== "";
		}

		return currentFilter.options?.toString().trim() !== "";
	}, [currentFilter, languageFilters, priceFrom, priceTo, genericFilters]);

	const getFirstFocusableElement = useCallback((): HTMLElement | null => {
		const popupElement = document.getElementById("filter-popup");

		if (popupElement) {
			const allFocusableElements = getAllFocusableElements(popupElement);

			return allFocusableElements.item(0);
		}

		return null;
	}, []);

	const handleResetAll = useCallback(() => {
		onResetAllFilters?.();
		setTimeout(() => {
			filterButtonRef.current?.focus();
		});
	}, [onResetAllFilters]);

	const focusFirstElement = useCallback((): void => {
		const firstElement = getFirstFocusableElement();

		if (firstElement) {
			firstElement.focus();
		}
	}, [getFirstFocusableElement]);

	const syncFilterState = useCallback(
		(filter: FilterInFilterBarData): void => {
			const options = filter.options ? filter.options.toString() : "";

			if (filter.id === "language") {
				const langs = options ? options.split(", ").map((l) => l.toLowerCase()) : [];
				setLanguageFilters({
					english: langs.includes("english"),
					german: langs.includes("german"),
					french: langs.includes("french"),
					vietnamese: langs.includes("vietnamese")
				});
			} else if (filter.id === "price") {
				if (options) {
					const [from, to] = options.split(" - ");
					setPriceFrom(from || "");
					setPriceTo(to || "");
				} else {
					setPriceFrom("");
					setPriceTo("");
				}
			} else if (filter.id in genericFilters) {
				setGenericFilters((prev) => ({ ...prev, [filter.id]: options }));
			}
		},
		[genericFilters]
	);

	const handleClickOnFilter = useCallback(
		(barFilter: FilterInFilterBarData): void => {
			setCurrentFilter(barFilter);
			setCurrentRef(filterRefs.current[barFilter.id]);
			setShowFilterView((prevState) => !prevState);
			setHasAppliedFilterChange(false);
			setIsMainDirty(false);
			setIsConfigDirty(false);
			onFocusedFilterChange?.(barFilter.id);
			syncFilterState(barFilter);
			setTimeout(focusFirstElement);
		},
		[focusFirstElement, syncFilterState, onFocusedFilterChange]
	);

	const setFilterRef = useCallback((id: string, ref: HTMLElement | null): void => {
		filterRefs.current[id] = ref;
	}, []);

	useEffect(() => {
		if (!focusFilterId) {
			return;
		}

		const ref = filterRefs.current[focusFilterId];

		if (!ref) {
			return;
		}

		const barFilter = filters.find((f) => f.id === focusFilterId);
		const focusDataRole = barFilter?.nonRemovable ? "filter-content" : "button";
		const contentRef = (ref as HTMLElement).querySelector(`[data-role=${focusDataRole}]`);

		if (contentRef) {
			(contentRef as HTMLElement).focus();
		}
	}, [focusFilterId, filters]);

	useEffect(() => {
		if (isFallbackFocus) {
			filterButtonRef.current?.focus();
		}
	}, [isFallbackFocus]);

	const handleButtonApplyClick = useCallback((): void => {
		setHasAppliedFilterChange(true);
		setIsMainDirty(false);
		setIsConfigDirty(false);
		setShowFilterView(false);

		if (currentFilter) {
			let options = "";
			let active = false;

			if (currentFilter.id === "language") {
				const languageMap: Record<string, string> = {
					english: "English",
					german: "German",
					french: "French",
					vietnamese: "Vietnamese"
				};
				const selected = Object.entries(languageFilters)
					.filter(([, v]) => v)
					.map(([k]) => languageMap[k]);
				options = selected.join(", ");
				active = selected.length > 0;
			} else if (currentFilter.id === "price") {
				const from = priceFrom.trim();
				const to = priceTo.trim();
				options = [from, to].filter(Boolean).join(" - ");
				active = options.length > 0;
			} else if (currentFilter.id in genericFilters) {
				options = genericFilters[currentFilter.id as keyof typeof genericFilters]?.trim() || "";
				active = options.length > 0;
			}

			onClickApplyFilter?.({
				...currentFilter,
				options,
				active
			} as FilterInFilterBarData);
		}
	}, [currentFilter, languageFilters, priceFrom, priceTo, genericFilters, onClickApplyFilter]);

	const onFilterViewVisibilityChange = useCallback(
		(isVisible: boolean): void => {
			setShowFilterView(isVisible);

			if (!isVisible && currentFilter && !hasAppliedFilterChange) {
				syncFilterState(currentFilter);
			}
		},
		[currentFilter, hasAppliedFilterChange, syncFilterState]
	);

	const handleLanguageToggle = useCallback((language: "english" | "german" | "french" | "vietnamese"): void => {
		setLanguageFilters((prev) => {
			const next = { ...prev, [language]: !prev[language] };
			setIsMainDirty(Object.values(next).some((v) => v));

			return next;
		});
	}, []);

	const handleSelectAllLanguages = useCallback((checked: boolean | "mixed"): void => {
		if (checked === true) {
			setLanguageFilters({ english: true, german: true, french: true, vietnamese: true });
			setIsMainDirty(true);
		} else {
			setLanguageFilters({ english: false, german: false, french: false, vietnamese: false });
			setIsMainDirty(false);
		}
	}, []);

	const getLanguageCheckState = useCallback((): boolean | "mixed" => {
		const values = Object.values(languageFilters);
		const allChecked = values.every((v) => v);
		const noneChecked = values.every((v) => !v);

		if (allChecked) {
			return true;
		}

		if (noneChecked) {
			return false;
		}

		return "mixed";
	}, [languageFilters]);

	const handlePriceFromChange = useCallback(
		(val: string): void => {
			setPriceFrom(val);
			setIsMainDirty(val.trim() !== "" || priceTo.trim() !== "");
		},
		[priceTo]
	);

	const handlePriceToChange = useCallback(
		(val: string): void => {
			setPriceTo(val);
			setIsMainDirty(priceFrom.trim() !== "" || val.trim() !== "");
		},
		[priceFrom]
	);

	const handleHiddenFiltersChange = useCallback(
		(indices: number[]): void => {
			setHiddenFilterCount(indices.length);
			onHiddenFiltersChange?.(indices);

			if (!currentFilter) {
				return;
			}

			const hiddenIds = indices.map((i) => presetFilters[i]?.id).filter(Boolean);

			if (hiddenIds.includes(currentFilter.id)) {
				setCurrentRef(null);
				setShowFilterView(false);
			}
		},
		[onHiddenFiltersChange, currentFilter, presetFilters]
	);

	const renderFilterContent = useCallback(() => {
		if (!currentFilter) {
			return null;
		}

		const filterPlaceholders: Record<string, string> = {
			author: 'e.g. "J.K. Rowling"',
			genre: 'e.g. "Fantasy"',
			publisher: 'e.g. "Penguin Books"',
			year: 'e.g. "2020"',
			rating: 'e.g. "4.5"',
			format: 'e.g. "Hardcover"',
			availability: 'e.g. "In Stock"',
			condition: 'e.g. "New"',
			category: 'e.g. "Fiction"'
		};

		switch (currentFilter.id) {
			case "language":
				return (
					<LanguageFilterSection
						english={languageFilters.english}
						german={languageFilters.german}
						french={languageFilters.french}
						vietnamese={languageFilters.vietnamese}
						onToggle={handleLanguageToggle}
						onSelectAll={handleSelectAllLanguages}
						getCheckState={getLanguageCheckState}
					/>
				);
			case "price":
				return (
					<PriceFilterSection
						priceFrom={priceFrom}
						priceTo={priceTo}
						onPriceFromChange={handlePriceFromChange}
						onPriceToChange={handlePriceToChange}
					/>
				);
			default: {
				if (currentFilter.id in genericFilters) {
					return (
						<GenericStringFilterSection
							id={currentFilter.id}
							label={typeof currentFilter.name === "string" ? currentFilter.name : currentFilter.id}
							placeholder={filterPlaceholders[currentFilter.id] || ""}
							value={genericFilters[currentFilter.id as keyof typeof genericFilters]}
							onChange={(val): void => {
								setGenericFilters((prev) => ({ ...prev, [currentFilter.id]: val }));
								setIsMainDirty(val.trim() !== "");
							}}
						/>
					);
				}

				return null;
			}
		}
	}, [
		currentFilter,
		languageFilters,
		priceFrom,
		priceTo,
		genericFilters,
		handleLanguageToggle,
		handleSelectAllLanguages,
		getLanguageCheckState,
		handlePriceFromChange,
		handlePriceToChange
	]);

	const handleFilterClose = useCallback(
		(filter: FilterInFilterBarData): void => {
			const index = filters.indexOf(filter);
			onRemoveFilter(filter.id, () => {
				const newFilters = [...filters];
				newFilters.splice(index, 1);
				setTimeout(() => {
					const newFocusIndex = index < newFilters.length ? index : index - 1;
					const newFocusItem = newFilters[newFocusIndex];

					if (newFocusItem) {
						const ref = filterRefs.current[newFocusItem.id];

						if (ref) {
							const focusDataRole = newFocusItem.nonRemovable ? "filter-content" : "button";
							const contentRef = ref.querySelector(`[data-role=${focusDataRole}]`);

							if (contentRef) {
								(contentRef as HTMLElement).focus();
							}
						}
					}
				});
			});
			setShowFilterView(false);
		},
		[filterRefs, filters, onRemoveFilter]
	);

	const setFilterButtonRef = useCallback(
		(element: HTMLButtonElement | null) => {
			filterButtonRef.current = element;

			if (filterToggleRef) {
				filterToggleRef.current = element;
			}
		},
		[filterToggleRef]
	);

	const actions = useMemo(
		() => (
			<>
				<FilterOptions
					matchMode={matchMode}
					invertResult={invertResult}
					onMatchModeChange={setMatchMode}
					onInvertResultChange={setInvertResult}
				/>
				<Button
					id="filter-panel-toggle"
					buttonRef={setFilterButtonRef}
					icon={<Icon>filter_list</Icon>}
					badge={hiddenFilterCount === 0 ? null : <Badge tiny></Badge>}
					title={isFilterPanelOpen ? "Close filter panel" : "Open filter panel"}
					onClick={onFilterPanelToggle}
				/>
				{onResetAllFilters && hasAnySetFilter && (
					<Button
						id="reset-all-filters"
						icon={<Icon>replay</Icon>}
						title="Reset all filters"
						onClick={handleResetAll}
					/>
				)}
			</>
		),
		[
			setFilterButtonRef,
			matchMode,
			invertResult,
			hiddenFilterCount,
			isFilterPanelOpen,
			onFilterPanelToggle,
			onResetAllFilters,
			hasAnySetFilter,
			handleResetAll
		]
	);

	useEffect(() => {
		if (isSmallSize) {
			const allIndices = presetFilters.map((_, index) => index);
			onHiddenFiltersChange?.(allIndices);
			renderActions?.(actions);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSmallSize, presetFilters.length]);

	if (filters.length === 0) {
		return <></>;
	}

	if (isSmallSize) {
		return null;
	}

	return (
		<>
			<StyledFilterBar compact onHiddenFiltersChange={handleHiddenFiltersChange} actions={actions}>
				{presetFilters.map((barFilter: FilterInFilterBarData) => (
					<Filter
						id={barFilter.id}
						active={barFilter.active}
						name={barFilter.name}
						options={barFilter.options}
						onClose={() => handleFilterClose(barFilter)}
						onClick={() => handleClickOnFilter(barFilter)}
						filterRef={(ref) => setFilterRef(barFilter.id, ref)}
						prefix={typeof barFilter.name === "string" ? barFilter.name.charAt(0) : barFilter.id.charAt(0)}
						compact
						nonRemovable
						onFocus={(): void => {
							onFocusedFilterChange?.(barFilter.id);
						}}
					/>
				))}
			</StyledFilterBar>
			<FilterOptionsMenu
				referenceElement={currentRef}
				isConfiguration={false}
				isOpen={showFilterView && !!currentRef && !!currentFilter}
				filterList={
					currentFilter
						? ([
								{
									headingTitle: typeof currentFilter.name === "string" ? currentFilter.name : currentFilter.id,
									content: renderFilterContent()
								}
							] as FilterItem[])
						: []
				}
				configurationFilterList={[
					{
						headingTitle: "Empty",
						content: (
							<StyledToggleShowcaseWrapper>
								<Toggle
									block
									value={emptyModeValue}
									showOnlySelectedOption
									onValueChanged={(value: string): void => {
										setEmptyModeValue(value as "yes" | "no");
										setIsConfigDirty(true);
									}}
								>
									<Toggle.Item value="yes" title="Yes">
										Yes
									</Toggle.Item>
									<Toggle.Item value="no" title="No">
										No
									</Toggle.Item>
								</Toggle>
							</StyledToggleShowcaseWrapper>
						)
					},
					{
						headingTitle: "Range",
						content: (
							<StyledToggleShowcaseWrapper>
								<Toggle
									block
									value={rangeModeValue}
									onValueChanged={(newValue: "first" | "middle" | "last" | "equals"): void => {
										setRangeModeValue(newValue);
										setIsConfigDirty(true);
									}}
								>
									<Toggle.Item value="first" title="First">
										<Icon>first_page</Icon>
									</Toggle.Item>
									<Toggle.Item value="middle" title="Middle">
										<Icon>more_horiz</Icon>
									</Toggle.Item>
									<Toggle.Item value="last" title="Last">
										<Icon>last_page</Icon>
									</Toggle.Item>
									<Toggle.Item value="equals" title="Equals">
										<Icon>drag_handle</Icon>
									</Toggle.Item>
								</Toggle>
							</StyledToggleShowcaseWrapper>
						)
					}
				]}
				onApply={handleButtonApplyClick}
				onReset={(): void => {
					setHasAppliedFilterChange(true);

					if (currentFilter) {
						// Reset value but keep filter active for presets
						const keepActive = currentFilter.preset === true;

						if (currentFilter.id === "language") {
							setLanguageFilters({
								english: false,
								german: false,
								french: false,
								vietnamese: false
							});
						} else if (currentFilter.id === "price") {
							setPriceFrom("");
							setPriceTo("");
						} else if (currentFilter.id in genericFilters) {
							setGenericFilters((prev) => ({ ...prev, [currentFilter.id]: "" }));
						}

						onClickApplyFilter?.({
							...currentFilter,
							options: "",
							active: keepActive
						} as FilterInFilterBarData);
					}

					setIsMainDirty(false);
				}}
				onVisibilityChange={onFilterViewVisibilityChange}
				isMainDirty={isMainDirty}
				isConfigDirty={isConfigDirty}
				hasMainData={hasMainData}
			/>
		</>
	);
};

export default FilterBarShowcase;
