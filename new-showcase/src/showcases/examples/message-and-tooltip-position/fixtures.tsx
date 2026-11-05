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

import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

import { ITEMS as AUTOCOMPLETE_SOURCE } from "../../inputs/autocomplete/data.js";
import { getItems } from "../../multiselect/data.js";
import { items as SELECT_SOURCE } from "../../select/data.js";

export const SELECT_ITEMS: { value: string; label: string }[] = SELECT_SOURCE;

export const AUTOCOMPLETE_ITEMS: string[] = AUTOCOMPLETE_SOURCE;

/**
 * Multiselect marks selection on the items themselves, so the cell has to re-derive its item list
 * from the current selection rather than hold a write-only state variable.
 */
export function multiselectItemsFor(selected: MultiselectProps.Item[]): MultiselectProps.Item[] {
	return getItems(selected.map((item) => item.id));
}

export const DATE_FORMAT = "MM/DD/YYYY";

/** Minimal formatter for the Date Picker cell. */
export function dateFormatter(date: Date): string {
	return DateTimeUtils.formatTimezoneDateTime({ date, dateTimeFormat: "L" });
}

/** Minimal converter for the Date Picker cell. */
export function dateConverter(value: string): Date | undefined {
	return DateTimeUtils.parseDateTimeUTC(value, DATE_FORMAT);
}

export const TAG_INPUT_KEYS = ["\n", ";", ","];

export const TAG_INPUT_TAGS = ["Widgets", "A12", "mgm"];

export const COMPACT_FILE_OPTIONS = { name: "Antrag.pdf" };
