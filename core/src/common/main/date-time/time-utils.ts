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

import type { Locale } from "date-fns";
import { format, isEqual, addMinutes } from "date-fns";
import { TZDate, tz } from "@date-fns/tz";

import { convertMomentToDateFnsFormat } from "./date-fns-utils.js";

export namespace TimeUtils {
	export function getHourFormat(format: string): string | undefined {
		if (format.indexOf("hh") >= 0) {
			return "hh";
		}

		if (format.indexOf("h") >= 0) {
			return "h";
		}

		if (format.indexOf("HH") >= 0) {
			return "HH";
		}

		if (format.indexOf("H") >= 0) {
			return "H";
		}

		return undefined;
	}

	export function getMinuteFormat(format: string): string | undefined {
		if (format.indexOf("mm") >= 0) {
			return "mm";
		}

		if (format.indexOf("m") >= 0) {
			return "m";
		}

		return undefined;
	}

	export function getFormattedHour(hour: number, hourFormat: string): string {
		const date = new Date();
		date.setHours(hour, 0, 0, 0); // Set hour, reset minutes, seconds, and milliseconds

		return format(date, convertMomentToDateFnsFormat(hourFormat));
	}

	export function getFormattedMinute(minute: number, minuteFormat: string): string {
		const date = new Date();
		date.setMinutes(minute, 0, 0); // Set minutes, reset seconds, and milliseconds

		return format(date, convertMomentToDateFnsFormat(minuteFormat));
	}

	export function getTimeFormat(mode?: "12h" | "24h", withTimezone?: boolean): string {
		if (withTimezone) {
			return mode ? (mode === "12h" ? "hh:mm AZ" : "HH:mmZ") : "hh:mm AZ";
		}

		return mode ? (mode === "12h" ? "hh:mm A" : "HH:mm") : "hh:mm A";
	}

	export function getTimeWithTimezone(time?: Date, timezone?: string): TZDate {
		if (!time) {
			return TZDate.tz("UTC");
		}

		return new TZDate(time, timezone || "UTC");
	}

	export function formatUTCTime(value?: Date, locale?: Locale, timeFormat?: string): string {
		if (value) {
			return format(value, convertMomentToDateFnsFormat(timeFormat || "LT"), { locale: locale, in: tz("UTC") });
		}

		return "";
	}

	export function formatTimezoneTime(value?: Date, timezone?: string, timeFormat?: string, locale?: Locale): string {
		if (value) {
			return format(getTimeWithTimezone(value, timezone), convertMomentToDateFnsFormat(timeFormat || "LT"), {
				locale: locale
			});
		}

		return "";
	}

	/**
	 *  This helper function switches a UTC date to a date with timezone and returns a UTC date based on the new timezone.
	 */
	export function convertUTCToTimezoneDate(utcDate?: Date, timezone?: string): Date | undefined {
		if (!utcDate) {
			return undefined;
		}

		const offsetDifference = TZDate.tz(timezone || "UTC", utcDate).getTimezoneOffset();

		return addMinutes(utcDate, offsetDifference);
	}

	/**
	 *  This helper function switches a date with timezone to a UTC date.
	 */
	export function convertTimezoneDateToUTC(timezoneDate?: Date, timezone?: string): Date | undefined {
		if (!timezoneDate) {
			return undefined;
		}

		const offsetDifference = TZDate.tz(timezone || "UTC", timezoneDate).getTimezoneOffset();

		// Adjust the date by the offset difference
		return addMinutes(timezoneDate, -offsetDifference);
	}

	/**
	 * Checks if two times are equal.
	 */
	export function isSameTime(time1?: Date, time2?: Date): boolean {
		if (time1 === undefined && time2 === undefined) {
			return true;
		}

		if (time1 === undefined || time2 === undefined) {
			return false;
		}

		return isEqual(time1, time2);
	}
}
