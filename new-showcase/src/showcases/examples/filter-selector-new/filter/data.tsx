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

import type { FilterData, FilterDefinition } from "./type.js";

export const FILTER_ID_PREFIX = "bar-";

export const PRESET_FILTER_DEFINITIONS: FilterDefinition[] = [
	{ id: "author", label: "Author", optionType: "string", defaultValue: "J.K. Rowling", isPreset: true },
	{ id: "genre", label: "Genre", optionType: "enum", defaultValue: "Fantasy", isPreset: true },
	{ id: "publisher", label: "Publisher", optionType: "string", defaultValue: "Penguin", isPreset: true },
	{ id: "year", label: "Year", optionType: "number", defaultValue: "2020", isPreset: true },
	{ id: "rating", label: "Rating", optionType: "number", defaultValue: "4.5", isPreset: true },
	{ id: "format", label: "Format", optionType: "enum", defaultValue: "Hardcover", isPreset: true },
	{ id: "availability", label: "Availability", optionType: "enum", defaultValue: "In Stock", isPreset: true },
	{ id: "condition", label: "Condition", optionType: "enum", defaultValue: "New", isPreset: true },
	{ id: "category", label: "Category", optionType: "enum", defaultValue: "Fiction", isPreset: true }
];

export const ADDITIONAL_FILTER_DEFINITIONS: FilterDefinition[] = [
	{ id: "language", label: "Language", optionType: "enum" },
	{ id: "price", label: "Price", optionType: "number" }
];

export const createFilterFromDefinition = (definition: FilterDefinition): FilterData => ({
	id: definition.id,
	label: definition.label,
	optionType: definition.optionType,
	active: !!definition.isPreset,
	options: "",
	...(definition.isPreset && { preset: true })
});

export const createFiltersFromDefinitions = (definitions: FilterDefinition[]): FilterData[] =>
	definitions.map(createFilterFromDefinition);

export const normalizeFilterId = (id: string): string => {
	return id.startsWith(FILTER_ID_PREFIX) ? id.substring(FILTER_ID_PREFIX.length) : id;
};
