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
import { createContext, useContext, useState, useCallback } from "react";

import type { FilterData } from "./type.js";

export interface PanelOptions {
	showSearch: boolean;
	showSetFiltersOnly: boolean;
	matchMode: "any" | "all";
	invertResult: boolean;
	isPinned: boolean;
	expandCollapseState: "expanded" | "collapsed" | null;
}

export interface FilterState {
	languageFilters: {
		english: boolean;
		german: boolean;
		french: boolean;
		vietnamese: boolean;
	};
	priceFrom: string;
	priceTo: string;
	activeFilters: FilterData[];
	inactiveFilters: FilterData[];
	openFilterSelector: boolean;
	panelOptions: PanelOptions;
}

interface FilterContextValue {
	state: FilterState;
	updateField: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
	updatePanelOptions: (options: Partial<PanelOptions>) => void;
	toggleLanguage: (language: keyof FilterState["languageFilters"]) => void;
	setAllLanguages: (checked: boolean) => void;
	toggleFilterSelector: () => void;
	resetAll: () => void;
	initializeFilters: (activeFilters: FilterData[], inactiveFilters: FilterData[]) => void;
	updateFilters: (activeFilters: FilterData[], inactiveFilters: FilterData[]) => void;
	computeFilters: () => { activeFilters: FilterData[]; inactiveFilters: FilterData[] };
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

const initialState: FilterState = {
	languageFilters: {
		english: false,
		german: false,
		french: false,
		vietnamese: false
	},
	priceFrom: "",
	priceTo: "",
	activeFilters: [],
	inactiveFilters: [],
	openFilterSelector: false,
	panelOptions: {
		showSearch: false,
		showSetFiltersOnly: false,
		matchMode: "any",
		invertResult: false,
		isPinned: true,
		expandCollapseState: "collapsed"
	}
};

const LANGUAGE_MAP: Record<string, string> = {
	english: "English",
	german: "German",
	french: "French",
	vietnamese: "Vietnamese"
};

const LANGUAGE_KEYS = Object.keys(LANGUAGE_MAP) as Array<keyof typeof LANGUAGE_MAP>;

const DEFAULT_LANGUAGE_STATE = LANGUAGE_KEYS.reduce(
	(acc, key) => ({ ...acc, [key]: false }),
	{} as FilterState["languageFilters"]
);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useState<FilterState>(initialState);

	const updateField = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
		setState((prev) => ({ ...prev, [key]: value }));
	}, []);

	const updatePanelOptions = useCallback((options: Partial<PanelOptions>) => {
		setState((prev) => ({ ...prev, panelOptions: { ...prev.panelOptions, ...options } }));
	}, []);

	const toggleLanguage = useCallback((language: keyof FilterState["languageFilters"]) => {
		setState((prev) => ({
			...prev,
			languageFilters: {
				...prev.languageFilters,
				[language]: !prev.languageFilters[language]
			}
		}));
	}, []);

	const setAllLanguages = useCallback((checked: boolean) => {
		setState((prev) => ({
			...prev,
			languageFilters: LANGUAGE_KEYS.reduce(
				(acc, key) => ({ ...acc, [key]: checked }),
				{} as FilterState["languageFilters"]
			)
		}));
	}, []);

	const toggleFilterSelector = useCallback(() => {
		setState((prev) => ({ ...prev, openFilterSelector: !prev.openFilterSelector }));
	}, []);

	const resetAll = useCallback(() => {
		setState((prev) => ({
			...prev,
			languageFilters: DEFAULT_LANGUAGE_STATE,
			priceFrom: "",
			priceTo: ""
		}));
	}, []);

	const initializeFilters = useCallback((activeFilters: FilterData[], inactiveFilters: FilterData[]) => {
		const allFilters = [...activeFilters, ...inactiveFilters];
		const getFilterValue = (id: string): string => allFilters.find((f) => f.id === id)?.options?.toString() || "";

		const langs = getFilterValue("language").toLowerCase().split(", ").filter(Boolean);
		const [priceFrom = "", priceTo = ""] = getFilterValue("price").split(" - ");

		setState((prev) => ({
			...prev,
			languageFilters: LANGUAGE_KEYS.reduce(
				(acc, key) => ({ ...acc, [key]: langs.includes(key) }),
				{} as FilterState["languageFilters"]
			),
			priceFrom,
			priceTo,
			activeFilters,
			inactiveFilters
		}));
	}, []);

	const updateFilters = useCallback((activeFilters: FilterData[], inactiveFilters: FilterData[]) => {
		setState((prev) => ({
			...prev,
			activeFilters,
			inactiveFilters
		}));
	}, []);

	const computeFilters = useCallback((): { activeFilters: FilterData[]; inactiveFilters: FilterData[] } => {
		const baseCombined = [...state.activeFilters, ...state.inactiveFilters].map((f) => ({ ...f }));

		const updateOrAddFilter = (item: Partial<FilterData> & { id: string }) => {
			const idx = baseCombined.findIndex((f) => f.id === item.id);

			if (idx >= 0) {
				baseCombined[idx] = { ...baseCombined[idx], ...item };
			} else {
				baseCombined.push(item as FilterData);
			}
		};

		const selectedLanguages = Object.entries(state.languageFilters)
			.filter(([, v]) => v)
			.map(([k]) => LANGUAGE_MAP[k] || k);
		updateOrAddFilter({
			id: "language",
			label: "Language",
			optionType: "enum",
			active: selectedLanguages.length > 0,
			options: selectedLanguages.join(", ")
		});

		const priceOptions = [state.priceFrom.trim(), state.priceTo.trim()].filter(Boolean).join(" - ");
		updateOrAddFilter({
			id: "price",
			label: "Price",
			optionType: "number",
			active: priceOptions.length > 0,
			options: priceOptions
		});

		return {
			activeFilters: baseCombined.filter((f) => f.active),
			inactiveFilters: baseCombined.filter((f) => !f.active)
		};
	}, [state]);

	return (
		<FilterContext.Provider
			value={{
				state,
				updateField,
				updatePanelOptions,
				toggleLanguage,
				setAllLanguages,
				toggleFilterSelector,
				resetAll,
				initializeFilters,
				updateFilters,
				computeFilters
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilterContext = (): FilterContextValue => {
	const context = useContext(FilterContext);

	if (!context) {
		throw new Error("useFilterContext must be used within a FilterProvider");
	}

	return context;
};
