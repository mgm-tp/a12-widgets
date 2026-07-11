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

import type { RelativeYearRange, YearRange, YearSelectorVariant } from "./year-selector.api.js";

const DEFAULT_BEFORE = 6;
const DEFAULT_AFTER = 7;
const DEFAULT_SPAN = DEFAULT_BEFORE + DEFAULT_AFTER;

/** @internal */
export function isRelativeYearRange(range: YearRange | RelativeYearRange): range is RelativeYearRange {
	return "startOffset" in range || "endOffset" in range;
}

/** @internal */
export function resolveYearRange(
	yearRange: YearRange | RelativeYearRange | undefined,
	referenceYear: number
): { start: number; end: number } {
	if (!yearRange) {
		return { start: referenceYear - DEFAULT_BEFORE, end: referenceYear + DEFAULT_AFTER };
	}

	if (isRelativeYearRange(yearRange)) {
		return {
			start: referenceYear + (yearRange.startOffset ?? -DEFAULT_BEFORE),
			end: referenceYear + (yearRange.endOffset ?? DEFAULT_AFTER)
		};
	}

	const { start, end } = yearRange;

	if (start !== undefined && end !== undefined) {
		return { start, end };
	}

	if (start !== undefined) {
		return { start, end: start + DEFAULT_SPAN };
	}

	if (end !== undefined) {
		return { start: end - DEFAULT_SPAN, end };
	}

	return { start: referenceYear - DEFAULT_BEFORE, end: referenceYear + DEFAULT_AFTER };
}

/** @internal */
export function clampRangeToYear(
	range: { start: number; end: number },
	year: number | undefined
): { start: number; end: number } {
	if (year === undefined) {
		return range;
	}

	return { start: Math.min(range.start, year), end: Math.max(range.end, year) };
}

/**
 * Converts Autocomplete value to string.
 * Handles both typed input (string) and selected item (DropDownItem).
 * Falls back to empty string.
 * @internal
 */
export function normalizeAutocompleteValue(rawValue: string | unknown): string {
	if (typeof rawValue === "string") {
		return rawValue;
	}

	if (typeof rawValue === "object" && rawValue !== null && "value" in rawValue) {
		return String((rawValue as { value?: string }).value ?? "");
	}

	return "";
}

/**
 * Determines year commit state from digit input.
 * - "" → undefined (cleared)
 * - 4 digits → valid year string
 * - otherwise → null (incomplete)
 * @internal
 */
export function parseYearDigits(digits: string): string | undefined | null {
	if (!digits) {
		return undefined;
	}

	if (/^\d{4}$/.test(digits)) {
		return digits;
	}

	return null;
}

/** @internal */
export function detectVariant(
	variant: YearSelectorVariant | undefined,
	yearRange: YearRange | RelativeYearRange | undefined
): YearSelectorVariant {
	if (variant !== undefined) {
		return variant;
	}

	return yearRange !== undefined ? "autocomplete" : "textbox";
}
