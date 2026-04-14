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

import { describe, expect, test } from "vitest";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";

import { getWeekDates, getWeekdays } from "../main/view/utils.internal.js";

describe("Calendar utils tests", () => {
	describe("getWeekdays", () => {
		test("returns weekdays with default locale and format", () => {
			const result = getWeekdays(enUS, (date: Date) => format(date, "EEEE", { locale: enUS }));
			expect(result).toHaveLength(7);
			expect(result).toEqual(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
		});

		test("returns weekdays with custom weekStartsOn", () => {
			const result = getWeekdays(enUS, (date: Date) => format(date, "EEEE", { locale: enUS }), 1); // Week starts on Monday
			expect(result).toHaveLength(7);
			expect(result).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
		});

		test("returns weekdays with custom format", () => {
			const result = getWeekdays(enUS, (date: Date) => format(date, "EEE", { locale: enUS }));
			expect(result).toHaveLength(7);
			expect(result).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
		});
	});

	describe("getWeekDates", () => {
		test("returns correct week dates starting from the given date", () => {
			const date = new Date(2025, 4, 27); // May 27, 2025
			const weekStartsOn = 0; // Sunday
			const result = getWeekDates(date, weekStartsOn);

			expect(result).toEqual([
				new Date(2025, 4, 25), // Sunday
				new Date(2025, 4, 26), // Monday
				new Date(2025, 4, 27), // Tuesday
				new Date(2025, 4, 28), // Wednesday
				new Date(2025, 4, 29), // Thursday
				new Date(2025, 4, 30), // Friday
				new Date(2025, 4, 31) // Saturday
			]);
		});

		test("handles custom week start day", () => {
			const date = new Date(2025, 4, 27); // May 27, 2025
			const weekStartsOn = 1; // Monday
			const result = getWeekDates(date, weekStartsOn);

			expect(result).toEqual([
				new Date(2025, 4, 26), // Monday
				new Date(2025, 4, 27), // Tuesday
				new Date(2025, 4, 28), // Wednesday
				new Date(2025, 4, 29), // Thursday
				new Date(2025, 4, 30), // Friday
				new Date(2025, 4, 31), // Saturday
				new Date(2025, 5, 1) // Sunday
			]);
		});

		test("returns correct week dates with positive offset", () => {
			const date = new Date(2025, 4, 27); // May 27, 2025
			const weekStartsOn = 0; // Sunday
			const result = getWeekDates(date, weekStartsOn, 7); // Offset by 1 week

			expect(result).toEqual([
				new Date(2025, 5, 1), // Sunday
				new Date(2025, 5, 2), // Monday
				new Date(2025, 5, 3), // Tuesday
				new Date(2025, 5, 4), // Wednesday
				new Date(2025, 5, 5), // Thursday
				new Date(2025, 5, 6), // Friday
				new Date(2025, 5, 7) // Saturday
			]);
		});

		test("returns correct week dates with negative offset", () => {
			const date = new Date(2025, 4, 27); // May 27, 2025
			const weekStartsOn = 0; // Sunday
			const result = getWeekDates(date, weekStartsOn, -7); // Offset by -1 week

			expect(result).toEqual([
				new Date(2025, 4, 18), // Sunday
				new Date(2025, 4, 19), // Monday
				new Date(2025, 4, 20), // Tuesday
				new Date(2025, 4, 21), // Wednesday
				new Date(2025, 4, 22), // Thursday
				new Date(2025, 4, 23), // Friday
				new Date(2025, 4, 24) // Saturday
			]);
		});
	});
});
