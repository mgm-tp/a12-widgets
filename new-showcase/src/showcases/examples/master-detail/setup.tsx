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

import type { Data } from "./filter-selector/data.js";

export namespace DATA {
	export const CUSTOMER_PROJECT = [
		"Awesome Project",
		"Gorgeous Library",
		"Elegant Template",
		"Dedicated Platform",
		"Graceful Framework",
		"Pretty UI Design",
		"Gracious Project"
	].sort();

	export const NATIONALITIES = ["German", "Vietnamese", "British", "Czech", "Belgium"];

	export const filterData: Data[] = [
		{
			id: "name-filter",
			label: "Name",
			optionType: "string",
			active: true,
			nonRemovable: true
		},
		{
			id: "nationalities-filter",
			label: "Nationality",
			optionType: "enum",
			active: true,
			nonRemovable: true
		},
		{
			id: "trip-filter",
			label: "Trip's Date",
			optionType: "date"
		},
		{
			id: "customer-project-filter",
			label: "Project",
			optionType: "enum",
			operation: "or"
		},
		{
			id: "billable-filter",
			label: "Billing",
			optionType: "radio"
		},
		{
			id: "flight-cost-filter",
			label: "Flight Cost",
			optionType: "number"
		},
		{
			id: "train-cost-filter",
			label: "Train Cost",
			optionType: "number"
		},
		{
			id: "others-cost-filter",
			label: "Others Cost",
			optionType: "number"
		},
		{
			id: "total-cost-filter",
			label: "Total Cost",
			optionType: "number"
		}
	];
}
