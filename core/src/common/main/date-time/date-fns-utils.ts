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

import { isValid, parse } from "date-fns";
import { TZDate } from "@date-fns/tz";

import type { TimePickerProps } from "../../../time-picker/main/time-picker.api.js";

/**
 * Parses an incomplete time string into a Date object.
 * @param timeString
 * @param mode if given, strictly parse using the given mode. Otherwise, try to parse using all formats.
 */
export function parseIncompleteTime(timeString: string, mode?: TimePickerProps.ClockMode): Date | null {
	if (!timeString) {
		return null;
	}

	const formats12h = ["hh:mma", "hh:mm a", "h:mm a", "hh:mm"];
	const formats24h = ["H:mm", "HH:mm"];
	let formats;

	switch (mode) {
		case "12h":
			formats = formats12h;
			break;
		case "24h":
			formats = formats24h;
			break;
		default:
			formats = [...formats12h, ...formats24h];
			break;
	}

	for (const timeFormat of formats) {
		const parsedDate = parse(timeString, timeFormat, TZDate.tz("UTC", 1970, 0, 1, 0));

		if (isValid(parsedDate)) {
			return parsedDate;
		}
	}

	return null;
}

/**
 * Converts a Moment.js date format string to a date-fns format string.
 * This function maps Moment.js tokens to their equivalent date-fns tokens
 * using a predefined token map. Unsupported tokens are left unchanged.
 *
 * @param momentFormat - The date format string in Moment.js syntax.
 * @returns The equivalent date format string in date-fns syntax.
 */
export function convertMomentToDateFnsFormat(momentFormat: string): string {
	const tokenMap: Record<string, string> = {
		// Year
		YYYY: "yyyy",
		YY: "yy",

		// Month
		MMMM: "MMMM",
		MMM: "MMM",
		MM: "MM",
		M: "M",

		// Day of Month
		DD: "dd",
		D: "d",

		// Day of Week
		dddd: "EEEE",
		ddd: "EEE",
		dd: "EE",
		d: "E",

		// Hour
		HH: "HH",
		H: "H",
		hh: "hh",
		h: "h",

		// Minute
		mm: "mm",
		m: "m",

		// Second
		ss: "ss",
		s: "s",

		// AM/PM
		A: "a",
		a: "a",

		// Timezone
		ZZ: "xx",
		Z: "xxx",

		// Shorthand formats
		LTS: "pp", // Time with seconds and AM/PM
		LT: "p", // Time with AM/PM
		LLLL: "PPPP p", // Full date and time
		LLL: "PPP", // Date and time
		LL: "PP", // Date with full month
		L: "P" // Date
	};

	// Replace Moment.js tokens with date-fns tokens
	return momentFormat.replace(
		/Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|A|a|Z{1,2}|L{1,4}T{0,1}S{0,1}/g,
		(match) => tokenMap[match] || match
	);
}

/**
 * Converts a date-fns date format string to a Moment.js date format string.
 * This function maps date-fns tokens to their equivalent Moment.js tokens
 * using a predefined reverse token map. Unsupported tokens are left unchanged.
 *
 * @param dateFnsFormat - The date format string in date-fns syntax.
 * @returns The equivalent date format string in Moment.js syntax.
 */
export function convertDateFnsToMomentFormat(dateFnsFormat: string): string {
	const reverseTokenMap: Record<string, string> = {
		// Year
		yyyy: "YYYY",
		yy: "YY",
		y: "YYYY",

		// Month
		MMMM: "MMMM",
		MMM: "MMM",
		MM: "MM",
		M: "M",

		// Day of Month
		dd: "DD",
		d: "D",

		// Day of Week
		EEEE: "dddd",
		EEE: "ddd",
		EE: "dd",
		E: "d",

		// Hour
		HH: "HH",
		H: "H",
		hh: "hh",
		h: "h",

		// Minute
		mm: "mm",
		m: "m",

		// Second
		ss: "ss",
		s: "s",

		// AM/PM
		a: "A",

		// Timezone
		xx: "ZZ",
		xxx: "Z",

		// Shorthand formats
		pp: "LTS", // Time with seconds and AM/PM
		p: "LT", // Time with AM/PM
		PPPP: "LLLL", // Full date and time
		PPP: "LLL", // Date and time
		PP: "LL", // Date with full month
		P: "L" // Date
	};

	// Replace date-fns tokens with Moment.js tokens
	return dateFnsFormat.replace(
		/yyyy|yy|y|MMMM|MMM|MM|M|dd|d|EEEE|EEE|EE|E|HH|H|hh|h|mm|m|ss|s|a|xxx|xx|pp|p|PPPP|PPP|PP|P/g,
		(match) => reverseTokenMap[match] || match
	);
}
