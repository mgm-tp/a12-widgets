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

import type { Day, Locale } from "date-fns";
import { endOfMonth, endOfWeek, isBefore, isSameDay, startOfMonth, addDays, format, startOfWeek } from "date-fns";

export const getWeekdays = (
	locale: Locale,
	weekDayFormatter?: (date: Date) => string,
	weekStartsOn?: Day
): string[] => {
	const start = startOfWeek(new Date(), { locale, weekStartsOn });

	return Array.from(
		{ length: 7 },
		(_, i) => weekDayFormatter?.(addDays(start, i)) ?? format(addDays(start, i), "EEEE", { locale })
	);
};

export const getWeekDates = (date: Date, weekStartsOn?: Day, offset = 0): Date[] => {
	const shiftedDate = addDays(date, offset);
	const start = startOfWeek(shiftedDate, { weekStartsOn });

	return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export function getMonthViewDates({ date, weekStartsOn }: { date: Date; weekStartsOn: Day }): Date[] {
	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(date);
	const monthDays: Date[] = [];

	let currDay = startOfWeek(monthStart, { weekStartsOn });

	// Days before the start of the month
	while (isBefore(currDay, monthStart)) {
		monthDays.push(currDay);
		currDay = addDays(currDay, 1);
	}

	// Days in the month
	while (!isBefore(monthEnd, currDay)) {
		monthDays.push(currDay);
		currDay = addDays(currDay, 1);
	}

	const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn });

	// Days after the end of the month
	while (isBefore(currDay, lastWeekEnd) || isSameDay(currDay, lastWeekEnd)) {
		monthDays.push(currDay);
		currDay = addDays(currDay, 1);
	}

	return monthDays;
}
