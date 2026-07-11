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

import type { FilterProps, FilterSelectorProps } from "@com.mgmtp.a12.widgets/widgets-core";

export type OptionType = "enum" | "date" | "time" | "number" | "string" | "radio" | "error" | "year-month";

export type ListOperationType = "or" | "and";

export type FilterData = FilterSelectorProps.FilterData & {
	sectionId?: string;
	optionType: OptionType;
	operation?: ListOperationType;
	options?: any;
	preset?: boolean;
};

export type FilterInFilterBarData = FilterProps & {
	id: string;
	optionType: OptionType;
	operation?: ListOperationType;
	nonRemovable?: boolean;
	preset?: boolean;
};

export interface SectionData {
	id: string;
	label?: string;
}

export interface FilterDefinition {
	id: string;
	label: string;
	optionType: OptionType;
	defaultValue?: string;
	isPreset?: boolean;
}

// Types for useFilterPanel hook
export interface ConfigModeDefinition {
	id: string;
	label: string;
	options: readonly string[];
	defaultValue: string;
}

export interface FilterPanelDefinition {
	id: string;
	label: string;
	optionType: OptionType;
	preset?: boolean;
	defaultValue?: unknown;
	configModes?: ConfigModeDefinition[];
	badgeVariant?: "info" | "error";
}

export interface FilterSectionDefinition {
	id: string;
	label: string;
	filterIds: string[];
}

export type LayoutEntry = { type: "filter"; filterId: string } | { type: "section"; section: FilterSectionDefinition };

export interface FilterPanelSchema {
	definitions: ReadonlyMap<string, FilterPanelDefinition>;
	layout: readonly LayoutEntry[];
}

export interface FilterPanelFilterState {
	value: unknown;
	active: boolean;
	configValues: ReadonlyMap<string, string>;
}

export interface GlobalState {
	matchMode: "any" | "all";
	invertResult: boolean;
	showSearch: boolean;
	searchValue: string;
	showSetFiltersOnly: boolean;
	isPinned: boolean;
}

export interface PanelState {
	global: GlobalState;
	filters: Map<string, FilterPanelFilterState>;
	openPanels: Record<string, boolean>;
	activeConfigMenuId: string | null;
	expandCollapseSignal: "expanded" | "collapsed" | null;
	lastAppliedSnapshot: ReadonlyMap<string, unknown>;
}

export interface FilterPanelActions {
	setFilterValue: (filterId: string, value: unknown) => void;
	resetFilter: (filterId: string) => void;
	resetAll: () => void;
	applyAll: () => void;
	togglePanel: (filterId: string) => void;
	toggleConfigMenu: (filterId: string) => void;
	setGlobal: <K extends keyof GlobalState>(key: K, value: GlobalState[K]) => void;
	expandAll: () => void;
	collapseAll: () => void;
}

export interface UseFilterPanelOptions {
	onApply?: (filterValues: ReadonlyMap<string, unknown>, matchMode: "any" | "all", invertResult: boolean) => void;
	onFilterChange?: (
		filterValues: ReadonlyMap<string, unknown>,
		matchMode: "any" | "all",
		invertResult: boolean
	) => void;
	onPinChange?: (isPinned: boolean) => void;
}

export interface UseFilterPanelReturn {
	state: PanelState;
	actions: FilterPanelActions;
	isDirty: boolean;
	activeFilterCount: number;
	listCollapsedProp: boolean | undefined;
}
