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

import type { RefCallback, FocusEvent } from "react";

import type { DataRole } from "../../common/main/base-props.js";

import type { BaseInputProps, InputDOMProps } from "../base/template/base.tpl.api.js";

import type { OptionalYearMonthItem } from "./month-selector.api.js";

/**
 * Absolute year range. Both fields are optional to support single-bound ranges.
 */
export type YearRange = {
	start?: number;
	end?: number;
};

/**
 * Relative year range expressed as offsets from the reference year
 * (the currently selected year, or today's year when no year is selected).
 */
export type RelativeYearRange = {
	startOffset?: number;
	endOffset?: number;
};

/** Controls which rendering mode the YearSelector uses. */
export type YearSelectorVariant = "autocomplete" | "select" | "textbox";

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
	 * The range of selectable years, either as absolute values (`YearRange`) or
	 * relative offsets from the reference year (`RelativeYearRange`).
	 * Single-bound ranges are supported; the missing side is filled automatically.
	 * Only applies when `variant="autocomplete"` or `variant="select"`. Ignored for `variant="textbox"`.
	 * @default start: referenceYear - 6; end: referenceYear + 7
	 */
	yearRange?: YearRange | RelativeYearRange;

	/**
	 * Controls the rendering mode.
	 * When omitted, the mode is auto-detected: `"autocomplete"` if {@link yearRange} is provided, `"textbox"` otherwise.
	 */
	variant?: YearSelectorVariant;

	/**
	 * The template for the hint text shown in the autocomplete dropdown.
	 * Only applies when `variant="autocomplete"`.
	 * @see {@link AutocompleteProps.hintTemplate}
	 */
	autocompleteHintTemplate?: string;

	/**
	 * Placeholder text shown when no year is selected.
	 * Has no effect when `optionalItem` is provided.
	 */
	placeholder?: string;

	/**
	 * This optional item will be set as the first item of YearSelector
	 * and return an undefined value if selected.
	 * Only applies when `variant="select"` or `variant="autocomplete"`. Has no effect on `variant="textbox"`.
	 */
	optionalItem?: T;

	/**
	 * Callback will be triggered every time users change year value.
	 */
	onYearChange?(year: Year): void;

	/**
	 * Callback invoked when the year selector loses focus.
	 * Only applies to `textbox` and `autocomplete` variants;
	 * Has no effect on `variant="select"`.
	 */
	onBlur?(event: FocusEvent<HTMLInputElement>): void;

	/**
	 * The reference of the year selector.
	 * Only applies when `variant="select"`.
	 * @param instance – the year select element instance.
	 */
	yearSelectRef?: RefCallback<HTMLSelectElement>;
}
