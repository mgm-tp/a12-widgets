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

import type { Locale, Matcher } from "react-day-picker";
import { isDateRange } from "react-day-picker";
import { format, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { tz, TZDate } from "@date-fns/tz";

import type { DateRange } from "../../../datepicker/main/date-range.api.js";

import { TimeUtils } from "./time-utils.js";
import { convertDateFnsToMomentFormat, convertMomentToDateFnsFormat } from "./date-fns-utils.js";

export namespace DateTimeUtils {
	export function parseDateTimeUTC(dateString: string, dateTimeFormat: string): Date | undefined {
		const parsedDate = parse(dateString, convertMomentToDateFnsFormat(dateTimeFormat), TZDate.tz("UTC", 1970, 0, 1, 0));

		if (isValid(parsedDate)) {
			return parsedDate;
		}

		return undefined;
	}

	export function getDateTimeFormat(dateTimeFormat?: string, locale: Locale = enUS): string {
		return convertDateFnsToMomentFormat(getDateFnsDateTimeFormat(dateTimeFormat, locale));
	}

	export function getDateFnsDateTimeFormat(dateTimeFormat?: string, locale: Locale = enUS): string {
		if (dateTimeFormat) {
			return convertMomentToDateFnsFormat(dateTimeFormat);
		}

		return `${locale.formatLong.date({ width: "short" })} ${locale.formatLong.time({ width: "short" })}`;
	}

	export function formatDateTime(value?: Date, locale?: Locale, dateTimeFormat?: string): string {
		if (value) {
			return format(value, getDateFnsDateTimeFormat(dateTimeFormat, locale), { locale: locale });
		}

		return "";
	}

	export function formatUTCDateTime(value?: Date, locale?: Locale, dateTimeFormat?: string): string {
		if (value) {
			const formatString = getDateFnsDateTimeFormat(dateTimeFormat, locale);

			return format(value, formatString, {
				locale: locale,
				in: tz("UTC")
			});
		}

		return "";
	}

	export function formatTimezoneDateTime({
		date,
		timezone,
		dateTimeFormat,
		locale
	}: {
		date?: Date;
		timezone?: string;
		dateTimeFormat?: string;
		locale?: Locale;
	}): string {
		if (date) {
			if (!timezone) {
				return formatUTCDateTime(date, locale, dateTimeFormat);
			}

			return format(date, getDateFnsDateTimeFormat(dateTimeFormat), {
				locale: locale,
				in: tz(timezone)
			});
		}

		return "";
	}

	export function toISOString(dateTime?: Date, timezone?: string): string {
		return dateTime ? TimeUtils.getTimeWithTimezone(dateTime, timezone).toISOString().replace("+00:00", "Z") : "";
	}

	export function isRangeMatcher(object?: Matcher): object is DateRange {
		if (!object) {
			return false;
		}

		return isDateRange(object);
	}

	export function combineDateAndTime(date?: Date, time?: Date): Date {
		const defaultDate = new Date();
		const defaultTime = new Date(0, 0, 0, 0, 0, 0, 0);
		const combineDate = date || defaultDate;
		const combineTime = time || defaultTime;
		const newDate = new Date(
			Date.UTC(
				combineDate.getUTCFullYear(),
				combineDate.getUTCMonth(),
				combineDate.getUTCDate(),
				combineTime.getUTCHours(),
				combineTime.getUTCMinutes(),
				0,
				0
			)
		);

		if (newDate.getUTCDate() !== combineDate.getUTCDate()) {
			newDate.setUTCDate(combineDate.getUTCDate());
		}

		return newDate;
	}

	export function normalizeDateValue(value: Date): Date {
		value.setUTCFullYear(1970);
		value.setUTCMonth(0);
		value.setUTCDate(1);

		return value;
	}

	export type TimezoneConverter<T> = {
		toUTC(value: T): T;
		toTimezone(value: T): T;
	};

	export function createTimezoneConverter(timezone?: string): {
		convertDate: TimezoneConverter<Date | undefined>;
		convertDateRange: TimezoneConverter<DateRange>;
	} {
		const convertDate: TimezoneConverter<Date | undefined> = {
			toUTC: (date) => TimeUtils.convertTimezoneDateToUTC(date, timezone),
			toTimezone: (date) => TimeUtils.convertUTCToTimezoneDate(date, timezone)
		};
		const convertDateRange: TimezoneConverter<DateRange> = {
			toUTC: (dateRange) => ({
				from: convertDate.toUTC(dateRange.from ?? undefined),
				to: convertDate.toUTC(dateRange.to ?? undefined)
			}),
			toTimezone: (dateRange) => ({
				from: convertDate.toTimezone(dateRange.from ?? undefined),
				to: convertDate.toTimezone(dateRange.to ?? undefined)
			})
		};

		return {
			convertDate,
			convertDateRange
		};
	}
}

export const getDefaultMonths = (locale?: Locale): string[] => {
	return Array.from({ length: 12 }, (_, month) => format(new Date(2023, month), "LLLL", { locale: locale || enUS }));
};

export const isMatcher = (item: Matcher | undefined): item is Matcher => {
	return !!item;
};
