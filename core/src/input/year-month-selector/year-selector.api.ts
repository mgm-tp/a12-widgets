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

import type { RefCallback } from "react";

import type { DataRole } from "../../common/main/base-props.js";

import type { BaseInputProps, InputDOMProps } from "../base/template/base.tpl.api.js";

import type { OptionalYearMonthItem } from "./month-selector.api.js";

export type YearRange = {
	start: number;
	end: number;
};

export interface YearSelectorProps<
	T extends OptionalYearMonthItem | undefined = undefined,
	Year = T extends OptionalYearMonthItem ? number | undefined : number
>
	extends BaseInputProps, DataRole, InputDOMProps<HTMLSelectElement> {
	/**
	 * The value of the selected year.
	 */
	year?: number;

	/**
	 * The value of the start and end years.
	 * @default start: {@link year} - 6; end: {@link year} + 7
	 */
	yearRange?: YearRange;

	/**
	 * This optional item will be set as the first item of YearSelector
	 * and return an undefined value if selected.
	 */
	optionalItem?: T;

	/**
	 * Callback will be triggered every time users change year value.
	 */
	onYearChange?(year: Year): void;

	/**
	 * The reference of the year selector.
	 * @param instance – the year select element instance.
	 */
	yearSelectRef?: RefCallback<HTMLSelectElement>;
}
