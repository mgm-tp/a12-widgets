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

import type { FC, ChangeEvent } from "react";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";

import {
	Button,
	ButtonGroup,
	Icon,
	noop,
	ContentBoxElements,
	Message,
	Toggle,
	FilterSelector,
	FilterSelectorTemplate
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { FilterItemData, FilterSectionData } from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledFilterHeader } from "../../../faceted-search/filter-selector-new/filter-selector-showcase-template.js";

import { LanguageFilterSection, PriceFilterSection, GenericStringFilterSection } from "./shared-filter-sections.js";
import type { FilterData } from "./type.js";
import { useFilterContext } from "./filter-context.js";
import { StyledResetButton, StyledSearchWrapper } from "./filter.styled.js";
import { StyledToggleShowcaseWrapper } from "./filter-configuration.js";
import { FilterOptions } from "./filter-options.js";
import { FilterItemActions } from "./filter-item-actions.js";
import type { FilterConfigItem } from "./filter-item-actions.js";

export interface FilterPaneContentProps {
	activeFilters: FilterData[];
	inactiveFilters: FilterData[];
	onApplyButtonClick(activeFilters: FilterData[], inactiveFilters: FilterData[]): void;
	onCloseButtonClick?: () => void;
	isFallbackFocus?: boolean;
	onFilterChange?: (activeFilters: FilterData[], inactiveFilters: FilterData[]) => void;
	onPinChange?: (isPinned: boolean) => void;
	hiddenFilterIndices?: number[];
	onFocusedFilterChange?: (filterId: string | null) => void;
}

const validateFilterValue = (filterId: string, value: string): string | undefined => {
	if (/[!@#$%^&*()+=[\]{};':"\\|,.<>/?]/.test(value)) {
		return "Special characters are not allowed";
	}

	if (filterId === "format" && value.length > 0 && !/^[a-zA-Z0-9\s-]+$/.test(value)) {
		return "Only letters, numbers, spaces and hyphens are allowed";
	}

	return undefined;
};

export const FilterPaneContent: FC<FilterPaneContentProps> = (props) => {
	const {
		activeFilters,
		inactiveFilters,
		onApplyButtonClick,
		onFilterChange,
		hiddenFilterIndices = [],
		isFallbackFocus,
		onFocusedFilterChange
	} = props;
	const paneRef = useRef<HTMLDivElement | null>(null);
	const {
		state: {
			languageFilters,
			priceFrom,
			priceTo,
			activeFilters: activeFiltersState,
			inactiveFilters: inactiveFiltersState,
			panelOptions
		},
		updateField,
		updatePanelOptions,
		toggleLanguage,
		setAllLanguages,
		resetAll,
		initializeFilters,
		updateFilters,
		computeFilters
	} = useFilterContext();

	const setPaneRef = (ref: HTMLDivElement | null): void => {
		paneRef.current = ref;
	};

	useEffect(() => {
		if (isFallbackFocus && paneRef.current) {
			paneRef.current.focus();
		}
	}, [isFallbackFocus]);

	const [isInitialized, setIsInitialized] = useState(false);
	const [emptyModeValue, setEmptyModeValue] = useState<"yes" | "no">("no");
	const [rangeModeValue, setRangeModeValue] = useState<"first" | "middle" | "last" | "equals">("first");
	const { showSearch, showSetFiltersOnly, isPinned, matchMode, invertResult, expandCollapseState } = panelOptions;
	const [searchValue, setSearchValue] = useState("");
	const [isDirty, setIsDirty] = useState(false);
	const [openConfigFilterId, setOpenConfigFilterId] = useState<string | null>(null);
	const [individualCollapsedStates, setIndividualCollapsedStates] = useState<Map<string, boolean>>(new Map());

	const allFilters = useMemo(
		() => (isInitialized ? [...activeFiltersState, ...inactiveFiltersState] : [...activeFilters, ...inactiveFilters]),
		[isInitialized, activeFiltersState, inactiveFiltersState, activeFilters, inactiveFilters]
	);

	const hasData = useMemo(() => {
		const hasLanguageData = Object.values(languageFilters).some((v) => v);
		const hasPriceData = priceFrom.trim() !== "" || priceTo.trim() !== "";
		const hasFilterOptions = allFilters.some((f) => f.options?.toString().trim());

		return hasLanguageData || hasPriceData || hasFilterOptions;
	}, [languageFilters, priceFrom, priceTo, allFilters]);

	const hasDataFromProps = useMemo(
		() => [...activeFilters, ...inactiveFilters].some((f) => f.active && f.options?.toString().trim() !== ""),
		[activeFilters, inactiveFilters]
	);

	const hasAnyError = useMemo(
		() =>
			hiddenFilterIndices.some((index) => {
				const filter = allFilters[index];

				return filter ? !!validateFilterValue(filter.id, filter.options?.toString() ?? "") : false;
			}),
		[hiddenFilterIndices, allFilters]
	);

	useEffect(() => {
		if (isInitialized) {
			return;
		}

		initializeFilters(activeFilters, inactiveFilters);
		setIsInitialized(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isInitialized) {
			return;
		}

		updateFilters(activeFilters, inactiveFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFilters, inactiveFilters]);

	const emitFilterChanges = useCallback(
		(newActive: FilterData[], newInactive: FilterData[]) => {
			updateFilters(newActive, newInactive);
			onFilterChange?.(newActive, newInactive);
		},
		[updateFilters, onFilterChange]
	);

	const handleApply = useCallback((): void => {
		const { activeFilters: newActive, inactiveFilters: newInactive } = computeFilters();
		onApplyButtonClick(newActive, newInactive);
		emitFilterChanges(newActive, newInactive);
		setIsDirty(false);
	}, [computeFilters, onApplyButtonClick, emitFilterChanges]);

	const handleResetAll = useCallback((): void => {
		resetAll();

		const clearedFilters = allFilters.map((filter) => ({
			...filter,
			active: filter.preset === true,
			options: ""
		}));
		const newActive = clearedFilters.filter((filter) => filter.active);
		const newInactive = clearedFilters.filter((filter) => !filter.active);
		emitFilterChanges(newActive, newInactive);
		setIsDirty(false);
	}, [resetAll, allFilters, emitFilterChanges]);

	const handleLanguageToggle = useCallback(
		(language: keyof typeof languageFilters): void => {
			toggleLanguage(language);
			setIsDirty(true);
		},
		[toggleLanguage]
	);

	const handleSelectAllLanguages = useCallback(
		(checked: boolean | "mixed"): void => {
			setAllLanguages(checked === true);
			setIsDirty(true);
		},
		[setAllLanguages]
	);

	const getLanguageCheckState = useCallback((): boolean | "mixed" => {
		const values = Object.values(languageFilters);

		if (values.every((value) => value)) {
			return true;
		}

		if (values.every((value) => !value)) {
			return false;
		}

		return "mixed";
	}, [languageFilters]);

	const createChangeHandler = useCallback(
		(key: "priceFrom" | "priceTo") => (value: string) => {
			updateField(key, value);
			setIsDirty(true);
		},
		[updateField]
	);

	const createCollapseChangeHandler = useCallback(
		(filterId: string) =>
			(isCollapsed: boolean): void => {
				setIndividualCollapsedStates((prev) => {
					const newMap = new Map(prev);
					newMap.set(filterId, isCollapsed);

					return newMap;
				});
			},
		[]
	);

	const emptyModeConfig = useMemo(
		() => (
			<StyledToggleShowcaseWrapper>
				<Toggle
					block
					value={emptyModeValue}
					showOnlySelectedOption
					onValueChanged={(value: string): void => setEmptyModeValue(value as "yes" | "no")}
				>
					<Toggle.Item value="yes" title="Yes">
						Yes
					</Toggle.Item>
					<Toggle.Item value="no" title="No">
						No
					</Toggle.Item>
				</Toggle>
			</StyledToggleShowcaseWrapper>
		),
		[emptyModeValue]
	);

	const rangeModeConfig = useMemo(
		() => (
			<StyledToggleShowcaseWrapper>
				<Toggle
					block
					value={rangeModeValue}
					onValueChanged={(newValue: "first" | "middle" | "last" | "equals"): void => setRangeModeValue(newValue)}
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
		),
		[rangeModeValue]
	);

	const sharedConfigItems = useMemo(
		(): FilterConfigItem[] => [
			{ label: "Empty", content: emptyModeConfig },
			{ label: "Range", content: rangeModeConfig }
		],
		[emptyModeConfig, rangeModeConfig]
	);

	const presetHiddenFilterIds = useMemo(
		() =>
			new Set(
				hiddenFilterIndices
					.map((index) => allFilters[index])
					.filter(Boolean)
					.filter((f) => f.preset === true)
					.map((f) => f.id)
			),
		[hiddenFilterIndices, allFilters]
	);

	const allHiddenFilterIds = useMemo(
		() => new Set(hiddenFilterIndices.map((index) => allFilters[index]?.id).filter(Boolean) as string[]),
		[hiddenFilterIndices, allFilters]
	);

	const getItemCollapsedState = useCallback(
		(itemId: string): boolean => {
			if (individualCollapsedStates.has(itemId)) {
				return individualCollapsedStates.get(itemId) ?? false;
			}

			return expandCollapseState === "collapsed";
		},
		[individualCollapsedStates, expandCollapseState]
	);

	const filterItems = useMemo<(FilterItemData | FilterSectionData)[]>(() => {
		const hiddenItems = hiddenFilterIndices
			.map((index) => {
				const filter = allFilters[index];

				if (!filter) {
					return null;
				}

				const filterName = typeof (filter as any)?.name === "string" ? (filter as any)?.name : filter.id;
				const filterValue = filter.options?.toString() || "";
				const hasValue = filterValue.trim().length > 0;
				const errorMessage = validateFilterValue(filter.id, filterValue);
				const hasError = !!errorMessage;

				const onReset = (): void => {
					const updated = { ...filter, options: "", active: filter.preset === true };
					const updatedAll = allFilters.map((f) => (f.id === filter.id ? updated : f));
					const newActive = updatedAll.filter((f) => f.active);
					const newInactive = updatedAll.filter((f) => !f.active);

					updateFilters(newActive, newInactive);
					setIsDirty(true);
				};

				return {
					id: filter.id,
					label: filterName,
					onFocus: () => onFocusedFilterChange?.(filter.id),
					content: (
						<GenericStringFilterSection
							id={`hidden-${filter.id}`}
							label={filterName}
							placeholder={`Enter ${filterName.toLowerCase()}...`}
							value={filterValue}
							onChange={(value: string): void => {
								const updatedFilter = {
									...filter,
									options: value,
									active: value.trim().length > 0 || filter.preset === true
								};
								const updatedAll = allFilters.map((f) => (f.id === filter.id ? updatedFilter : f));
								const newActive = updatedAll.filter((f) => f.active);
								const newInactive = updatedAll.filter((f) => !f.active);

								updateFilters(newActive, newInactive);
								setIsDirty(true);
							}}
							error={hasError}
							errorMessage={errorMessage}
						/>
					),
					active: hasValue,
					badgeVariant: (hasError ? "error" : "info") as "error" | "info",
					meta: (
						<FilterItemActions
							active={hasValue}
							onReset={onReset}
							filterId={filter.id}
							onConfigOpenChange={(open) => setOpenConfigFilterId(open ? filter.id : null)}
						/>
					),
					showMeta: openConfigFilterId === filter.id,
					collapsed: getItemCollapsedState(filter.id),
					onCollapseChange: createCollapseChangeHandler(filter.id)
				};
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		const languageOnReset = (): void => {
			setAllLanguages(false);
			setIsDirty(true);
		};

		const priceOnReset = (): void => {
			updateField("priceFrom", "");
			updateField("priceTo", "");
			setIsDirty(true);
		};

		const presetItems = hiddenItems.filter((item) => presetHiddenFilterIds.has(item.id));
		const nonPresetItems = hiddenItems.filter((item) => !presetHiddenFilterIds.has(item.id));
		const hasPresetNonPresetBoundary = presetItems.length > 0 && nonPresetItems.length > 0;
		const allHiddenOrdered = [...presetItems, ...nonPresetItems];

		const markedHiddenItems = allHiddenOrdered.map((item, i) => {
			const isLastPreset = hasPresetNonPresetBoundary && i === presetItems.length - 1;
			const isLastHidden = i === allHiddenOrdered.length - 1;

			return isLastPreset || isLastHidden ? { ...item, lastHiddenItem: true as const } : item;
		});

		return [
			...markedHiddenItems,
			{
				id: "book-details",
				label: "Book Details",
				items: [
					{
						id: "Language",
						label: "Language",
						content: (
							<LanguageFilterSection
								english={languageFilters.english}
								german={languageFilters.german}
								french={languageFilters.french}
								vietnamese={languageFilters.vietnamese}
								onToggle={handleLanguageToggle}
								onSelectAll={handleSelectAllLanguages}
								getCheckState={getLanguageCheckState}
							/>
						),
						active: Object.values(languageFilters).some((value) => value),
						showMeta: openConfigFilterId === "Language",
						meta: (
							<FilterItemActions
								active={Object.values(languageFilters).some((value) => value)}
								onReset={languageOnReset}
								configItems={sharedConfigItems}
								filterId="Language"
								onConfigOpenChange={(open) => setOpenConfigFilterId(open ? "Language" : null)}
							/>
						),
						collapsed: getItemCollapsedState("Language"),
						onCollapseChange: createCollapseChangeHandler("Language")
					},
					{
						id: "Price",
						label: "Price",
						content: (
							<PriceFilterSection
								priceFrom={priceFrom}
								priceTo={priceTo}
								onPriceFromChange={createChangeHandler("priceFrom")}
								onPriceToChange={createChangeHandler("priceTo")}
							/>
						),
						active: !!(priceFrom || priceTo),
						showMeta: openConfigFilterId === "Price",
						meta: (
							<FilterItemActions
								active={!!(priceFrom.trim() || priceTo.trim())}
								onReset={priceOnReset}
								configItems={sharedConfigItems}
								filterId="Price"
								onConfigOpenChange={(open) => setOpenConfigFilterId(open ? "Price" : null)}
							/>
						),
						collapsed: getItemCollapsedState("Price"),
						onCollapseChange: createCollapseChangeHandler("Price")
					}
				]
			},
			{
				id: "Delivery",
				label: "Delivery",
				content: <Message className="-u-text-xs -u-padding-0">No values are set for this filter.</Message>,
				meta: <FilterItemActions active={false} onReset={noop} filterId="Delivery" />,
				collapsed: getItemCollapsedState("Delivery"),
				onCollapseChange: createCollapseChangeHandler("Delivery")
			}
		];
	}, [
		hiddenFilterIndices,
		languageFilters,
		handleLanguageToggle,
		handleSelectAllLanguages,
		getLanguageCheckState,
		openConfigFilterId,
		sharedConfigItems,
		getItemCollapsedState,
		createCollapseChangeHandler,
		priceFrom,
		priceTo,
		createChangeHandler,
		allFilters,
		updateFilters,
		onFocusedFilterChange,
		setAllLanguages,
		updateField,
		presetHiddenFilterIds
	]);

	const matchesSearch = useCallback(
		(filterName: string): boolean => {
			if (!searchValue.trim()) {
				return true;
			}

			return filterName.toLowerCase().includes(searchValue.toLowerCase());
		},
		[searchValue]
	);

	const visibleFilterItems = useMemo(() => {
		const filtered = filterItems
			.map((entry) => {
				if ("items" in entry) {
					const visibleItems = entry.items.filter(
						(item) => matchesSearch(item.label) && (!showSetFiltersOnly || item.active)
					);

					return { ...entry, items: visibleItems };
				}

				if (!matchesSearch(entry.label)) {
					return null;
				}

				if (showSetFiltersOnly && !entry.active) {
					return null;
				}

				return entry;
			})
			.filter(Boolean) as (FilterItemData | FilterSectionData)[];

		const flatItems = filtered.filter((e): e is FilterItemData => !("items" in e));
		const visibleHiddenItems = flatItems.filter((item) => allHiddenFilterIds.has(item.id));
		const lastVisibleHiddenId =
			visibleHiddenItems.length > 0 ? visibleHiddenItems[visibleHiddenItems.length - 1].id : undefined;
		const lastPresetIndex = flatItems.reduce((acc, item, i) => (presetHiddenFilterIds.has(item.id) ? i : acc), -1);
		const hasVisibleNonPresetHidden =
			lastPresetIndex >= 0 &&
			flatItems
				.slice(lastPresetIndex + 1)
				.some((item) => allHiddenFilterIds.has(item.id) && !presetHiddenFilterIds.has(item.id));
		const internalBoundaryId = hasVisibleNonPresetHidden ? flatItems[lastPresetIndex]?.id : undefined;

		return filtered.map((entry) => {
			if ("items" in entry) {
				return entry;
			}

			const shouldMark = entry.id === lastVisibleHiddenId || entry.id === internalBoundaryId;

			if (!!entry.lastHiddenItem === shouldMark) {
				return entry;
			}

			return { ...entry, lastHiddenItem: shouldMark || undefined };
		});
	}, [filterItems, matchesSearch, showSetFiltersOnly, presetHiddenFilterIds, allHiddenFilterIds]);

	const actualExpandCollapseState = useMemo((): "expanded" | "collapsed" | null => {
		const visibleItemIds = visibleFilterItems
			.filter((item): item is FilterItemData => !("items" in item))
			.map((item) => item.id);

		if (visibleItemIds.length === 0) {
			return null;
		}

		const collapsedStates = visibleItemIds.map((id) => {
			if (individualCollapsedStates.has(id)) {
				return individualCollapsedStates.get(id);
			}

			return expandCollapseState === "collapsed";
		});

		const allExpanded = collapsedStates.every((collapsed) => collapsed === false);
		const allCollapsed = collapsedStates.every((collapsed) => collapsed === true);

		if (allExpanded) {
			return "expanded";
		} else if (allCollapsed) {
			return "collapsed";
		} else {
			return null;
		}
	}, [visibleFilterItems, individualCollapsedStates, expandCollapseState]);

	const handleExpandAll = useCallback((): void => {
		updatePanelOptions({ expandCollapseState: "expanded" });
		setIndividualCollapsedStates(new Map());
	}, [updatePanelOptions]);

	const handleCollapseAll = useCallback((): void => {
		updatePanelOptions({ expandCollapseState: "collapsed" });
		setIndividualCollapsedStates(new Map());
	}, [updatePanelOptions]);

	const hasAnyVisibleItems = useMemo(() => {
		return visibleFilterItems.some((item) => {
			if ("items" in item) {
				return item.items.length > 0;
			}

			return true;
		});
	}, [visibleFilterItems]);

	return (
		<FilterSelector
			listMode={{
				items: visibleFilterItems,
				wrapperRef: setPaneRef,
				headerContent: (
					<StyledFilterHeader>
						<ContentBoxElements.Title ariaLevel={2} key="title" text="Filters" />
						<FilterOptions
							showSearch={showSearch}
							showSetFiltersOnly={showSetFiltersOnly}
							isPinned={isPinned}
							matchMode={matchMode}
							invertResult={invertResult}
							expandCollapseState={actualExpandCollapseState}
							onShowSearchChange={(value): void => updatePanelOptions({ showSearch: value })}
							onShowSetFiltersOnlyChange={(value): void => updatePanelOptions({ showSetFiltersOnly: value })}
							onPinChange={(value): void => {
								updatePanelOptions({ isPinned: value });
								props.onPinChange?.(value);
							}}
							onMatchModeChange={(value): void => updatePanelOptions({ matchMode: value })}
							onInvertResultChange={(value): void => updatePanelOptions({ invertResult: value })}
							onExpandAll={handleExpandAll}
							onCollapseAll={handleCollapseAll}
						/>
						<Button icon={<Icon>close</Icon>} title="Close" onClick={props.onCloseButtonClick ?? noop} />
					</StyledFilterHeader>
				),
				actionBar: showSearch ? (
					<StyledSearchWrapper>
						<FilterSelectorTemplate.SearchInput
							value={searchValue}
							onChange={(e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value)}
							onClearButtonClick={(): void => setSearchValue("")}
							placeholder="Search filters..."
						/>
					</StyledSearchWrapper>
				) : undefined,
				footerContent: (
					<ContentBoxElements.Footer>
						<ButtonGroup alignment="right">
							<StyledResetButton
								label="RESET"
								secondary
								onClick={handleResetAll}
								icon={<Icon>replay</Icon>}
								disabled={!isDirty && !hasData && !hasDataFromProps}
							/>
							<Button label="APPLY" primary onClick={handleApply} disabled={hasAnyError || (!isDirty && !hasData)} />
						</ButtonGroup>
					</ContentBoxElements.Footer>
				)
			}}
		>
			{(searchValue.trim() || showSetFiltersOnly) && !hasAnyVisibleItems ? (
				<Message>{searchValue.trim() ? "No filters match your search." : "No filters are currently set."}</Message>
			) : undefined}
		</FilterSelector>
	);
};
