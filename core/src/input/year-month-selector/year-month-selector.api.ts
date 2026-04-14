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

import type { RefCallback, HTMLProps, ReactNode } from "react";

import type { BaseInputProps } from "../base/template/base.tpl.api.js";

import type { YearRange } from "./year-selector.api.js";
import type { OptionalYearMonthItem } from "./month-selector.api.js";

export interface YearMonthSelectorProps extends Omit<BaseInputProps, "hideLabel"> {
	/**
	 * The value of the selected year.
	 */
	year?: number;

	/**
	 * Month index ranges from 0 to 11 corresponding to January to December.
	 */
	month?: number;

	/**
	 * This optional item will be set as the first item of YearSelector
	 * and return an undefined value if selected.
	 */
	optionalYearItem?: OptionalYearMonthItem;

	/**
	 * This optional item will be set as the first item of MonthSelector
	 * and return an undefined value if selected.
	 */
	optionalMonthItem?: OptionalYearMonthItem;

	/**
	 *  A string array that can be used to customize month names
	 */
	months?: string[];

	/**
	 * The value of the start and end years.
	 * @default start: {@link year} - 6; end: {@link year} + 7
	 */
	yearRange?: YearRange;

	/**
	 * The hidden labels that can be used by screen reader.
	 */
	hiddenLabels?: YearMonthSelectorHiddenLabels;

	/**
	 * Which component should be mark as invalid state, year, month or both component.
	 * @default both
	 */
	invalidComponent?: "year" | "month" | "both";

	/**
	 * This function will be called every time the select for month/year change their value.
	 * @param month – The newly selected month
	 * @param year – The newly selected year
	 */
	onValueChange?(month?: number, year?: number): void;

	/**
	 * The reference of the month selector.
	 * @param instance – the month select element instance.
	 */
	monthSelectRef?: RefCallback<HTMLSelectElement>;

	/**
	 * The reference of the year selector.
	 * @param instance – the select element instance.
	 */
	yearSelectRef?: RefCallback<HTMLSelectElement>;

	/**
	 * Additional properties that will be passed to the Year Selector's HTML select Element.
	 */
	inputPropsOfYearSelector?: HTMLProps<HTMLSelectElement>;

	/**
	 * Additional properties that will be passed to the Month Selector's HTML select Element.
	 */
	inputPropsOfMonthSelector?: HTMLProps<HTMLSelectElement>;
}

export interface YearMonthSelectorHiddenLabels {
	/**
	 * A hidden label for yearSelector.
	 */
	yearLabel?: ReactNode;

	/**
	 * A hidden label for monthSelector.
	 */
	monthLabel?: ReactNode;
}
