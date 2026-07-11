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

import type { FocusEvent } from "react";

export interface YearValidationOptions {
	/** When true, an empty value is treated as an error. */
	required?: boolean;

	/** Inclusive lower bound for the year range check. */
	min?: number;

	/** Inclusive upper bound for the year range check. */
	max?: number;
}

export function validateYearOnBlur(
	ev: FocusEvent<HTMLInputElement>,
	options: YearValidationOptions = {}
): string | undefined {
	const val = (ev.currentTarget as HTMLInputElement).value;
	const { required = false, min, max } = options;

	if (!val) {
		return required ? "Please select a year" : undefined;
	}

	if (!/^\d{4}$/.test(val)) {
		return "Enter a 4-digit year (YYYY)";
	}

	if (min !== undefined && max !== undefined) {
		const num = parseInt(val, 10);

		if (num < min || num > max) {
			return `Year must be between ${min} and ${max}`;
		}
	}

	return undefined;
}
