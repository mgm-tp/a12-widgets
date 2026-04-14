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
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export type OptionType = "enum" | "date" | "time" | "number" | "string" | "radio" | "error" | "year-month";

export type ListOperationType = "or" | "and";

export type Data = FilterSelectorProps.FilterData & {
	sectionId?: string;
	optionType: OptionType;
	operation?: ListOperationType;
	options?: any;
};

export type FilterInFilterBarData = FilterProps & {
	id: string;
	optionType: OptionType;
	operation?: ListOperationType;
	nonRemovable?: boolean;
};

export interface FilterOption {
	label: string;
	active: boolean;
}
export interface SectionData {
	id: string;
	label?: string;
}

export const filterData: Data[] = [
	{
		id: "none-removable",
		label: "None Removable Filter",
		optionType: "enum",
		active: true,
		nonRemovable: true
	},
	{
		id: "number-filter",
		label: "Number Filter",
		optionType: "number"
	},
	{
		id: "enumeration-filter",
		label: "Enumeration Filter",
		optionType: "enum"
	},
	{
		id: "error-filter",
		label: "Filter With Error Message",
		optionType: "error",
		meta: (
			<Icon variant="error" iconTheme="custom">
				error
			</Icon>
		)
	},
	{
		id: "boolean-filter",
		label: "Boolean Filter",
		sectionId: "frequently-used-filter",
		optionType: "radio"
	},
	{
		id: "string-filter",
		label: "String Filter",
		sectionId: "frequently-used-filter",
		optionType: "string"
	},
	{
		id: "time-filter",
		label: "Time Filter",
		sectionId: "frequently-used-filter",
		optionType: "time"
	},
	{
		id: "date-filter",
		label: "Date Filter",
		sectionId: "frequently-used-filter",
		optionType: "date"
	},
	{
		id: "year-month-filter",
		label: "Year Month Filter",
		sectionId: "frequently-used-filter",
		optionType: "year-month"
	}
];
