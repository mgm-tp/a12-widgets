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

import { DATA } from "../setup.js";

import type { Data, FilterInFilterBarData, FilterOption, OptionType } from "./data.js";

const numberRegex = /^(\d+\.\d+)$|^(\d+)$/g;

export function mapFilterOptions(options: string, filterId: string): FilterOption[] {
	const optionString = filterId.includes("nationalities-filter")
		? DATA.NATIONALITIES
		: filterId.includes("customer-project-filter")
			? DATA.CUSTOMER_PROJECT
			: [];

	return optionString.map((item) => {
		return { label: item, active: options.includes(item) };
	});
}

export function setFiltersOptions(filters: Data[]): Data[] {
	return filters.map((filter) => {
		if (!filter.options && filter.optionType === "radio") {
			return { ...filter, options: "Yes" };
		}

		const options =
			!filter.options || !isValid(filter.options.toString(), filter.optionType) ? "Inactive" : filter.options;

		return { ...filter, options };
	});
}

export function parseFilterInBarToFilter(barFilter: FilterInFilterBarData): Data {
	return {
		label: barFilter.name,
		id: barFilter.id.substr(4, barFilter.id.length),
		active: barFilter.active,
		optionType: barFilter.optionType,
		options: barFilter.options,
		operation: barFilter.operation
	} as Data;
}

export function isValid(text: string, type: OptionType): boolean {
	if (type !== "number" || text === "") {
		return true;
	}

	return !!text.match(numberRegex);
}
