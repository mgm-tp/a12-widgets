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

import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { de } from "date-fns/locale/de";
import { enUS } from "date-fns/locale/en-US";

import { DateTimeUtils } from "../date-utils.js";

describe("com.mgmtp.a12.widgets.common.utils.dateTime", () => {
	let now: Date;
	beforeAll(() => {
		now = new Date(Date.UTC(2020, 1, 1));
		vi.useFakeTimers();
		vi.setSystemTime(now);
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	function addZeroBefore(number: number): string {
		return number < 10 ? `0${number}` : `${number}`;
	}

	test("getDateTimeFormat", () => {
		const locales = [de, enUS];
		const format = ["DD.MM.YYYY HH:mm", "MM/DD/YYYY h:mm A", "DD/MM/YYYY HH:mm"];
		expect(DateTimeUtils.getDateTimeFormat(format[0])).toEqual(format[0]);
		expect(DateTimeUtils.getDateTimeFormat(format[0], locales[0])).toEqual(format[0]);
		locales.forEach((locale, index) => {
			expect(DateTimeUtils.getDateTimeFormat(undefined, locale)).toEqual(format[index]);
		});
	});

	test("formatDateTime", () => {
		const dateTime = new Date(2020, 1, 1);
		expect(DateTimeUtils.formatDateTime(dateTime)).toEqual("02/01/2020 12:00 AM");
		expect(DateTimeUtils.formatDateTime(dateTime, de)).toEqual("01.02.2020 00:00");
		expect(DateTimeUtils.formatDateTime(dateTime, de, "LLLL")).toEqual("Samstag, 1. Februar 2020 00:00");
	});

	test("formatUTCDateTime", () => {
		const dateTime = new Date(Date.UTC(2020, 2, 2, 0, 0));
		const utcHour = dateTime.getUTCHours();

		if (utcHour > 12) {
			expect(DateTimeUtils.formatUTCDateTime(dateTime)).toEqual(`03/01/2020 ${utcHour - 12}:00 PM`);
		}

		expect(DateTimeUtils.formatUTCDateTime(dateTime, de)).toEqual(`02.03.2020 0${utcHour}:00`);
		expect(DateTimeUtils.formatUTCDateTime(dateTime, de, "LLLL")).toEqual(`Montag, 2. März 2020 0${utcHour}:00`);
	});

	test("formatTimezoneDateTime", () => {
		const testData = [
			{ timezone: "Pacific/Niue", expect: "01/31/2020 1:00 PM" },
			{ timezone: "America/Toronto", dateTimeFormat: "L LTS", expect: "01/31/2020 7:00:00 PM" },
			{ timezone: "Asia/Ho_Chi_Minh", locale: de, expect: "02/01/2020 7:00 vorm." },
			{ timezone: "Pacific/Kiritimati", dateTimeFormat: "L LTS", locale: de, expect: "01.02.2020 14:00:00" }
		];

		for (let i = 0; i < testData.length; i++) {
			expect(
				DateTimeUtils.formatTimezoneDateTime({
					date: now,
					timezone: testData[i].timezone,
					dateTimeFormat: testData[i].dateTimeFormat,
					locale: testData[i].locale
				})
			).toEqual(testData[i].expect);
		}
	});

	test("toISOString", () => {
		const testData = [
			{ expect: "2020-02-01T00:00:00.000Z" },
			{ timezone: "Pacific/Niue", expect: "2020-01-31T13:00:00.000-11:00" },
			{ timezone: "America/Toronto", expect: "2020-01-31T19:00:00.000-05:00" },
			{ timezone: "Asia/Ho_Chi_Minh", expect: "2020-02-01T07:00:00.000+07:00" },
			{ timezone: "Pacific/Kiritimati", expect: "2020-02-01T14:00:00.000+14:00" }
		];

		for (let i = 0; i < testData.length; i++) {
			expect(DateTimeUtils.toISOString(now, testData[i].timezone)).toEqual(testData[i].expect);
		}
	});

	describe("com.mgmtp.a12.widgets.common.utils.combineDateAndTime", () => {
		const date1 = new Date(Date.UTC(2020, 3, 3));
		const date2 = new Date(Date.UTC(2020, 4, 4, 9, 53, 0));
		const defaultTime = new Date(0, 0, 0, 0, 0, 0, 0);
		test("combineDateAndTime with no parameters passed in", () => {
			const hourMinute = `${addZeroBefore(defaultTime.getUTCHours())}:${addZeroBefore(defaultTime.getUTCMinutes())}`;

			if (defaultTime.getUTCHours() <= 12) {
				//The function will return default date and time.
				expect(DateTimeUtils.combineDateAndTime().toJSON()).toEqual(`2020-02-01T${hourMinute}:00.000Z`);
			} else {
				//The function will return default date and time.
				expect(DateTimeUtils.combineDateAndTime().toJSON()).toEqual(`2020-02-01T${hourMinute}:00.000Z`);
			}
		});

		test("combineDateAndTime with the first parameter passed in", () => {
			const hourMinute = `${addZeroBefore(defaultTime.getUTCHours())}:${addZeroBefore(defaultTime.getUTCMinutes())}`;

			if (defaultTime.getUTCHours() <= 12) {
				//The function will return combine date as passed in and default time.
				expect(DateTimeUtils.combineDateAndTime(date1).toJSON()).toEqual(`2020-04-03T${hourMinute}:00.000Z`);
			} else {
				//The function will return combine date as passed in and default time.
				expect(DateTimeUtils.combineDateAndTime(date1).toJSON()).toEqual(`2020-04-03T${hourMinute}:00.000Z`);
			}
		});

		test("combineDateAndTime with the second parameter passed in", () => {
			const hourMinute = `${addZeroBefore(date2.getUTCHours())}:${addZeroBefore(date2.getUTCMinutes())}`;

			if (date2.getUTCHours() < 12 && now.getUTCHours() > 0) {
				//The function will return time as passed in and default date.
				expect(DateTimeUtils.combineDateAndTime(undefined, date2).toJSON()).toEqual(`2020-01-31T${hourMinute}:00.000Z`);
			} else {
				//The function will return time as passed in and default date.
				expect(DateTimeUtils.combineDateAndTime(undefined, date2).toJSON()).toEqual(`2020-02-01T${hourMinute}:00.000Z`);
			}
		});

		test("combineDateAndTime with two parameters passed in", () => {
			const hourMinute = `${addZeroBefore(date2.getUTCHours())}:${addZeroBefore(date2.getUTCMinutes())}`;

			if (date2.getUTCHours() < 12 && now.getUTCHours() > 0) {
				expect(DateTimeUtils.combineDateAndTime(date1, date2).toJSON()).toEqual(`2020-04-03T${hourMinute}:00.000Z`);
			} else {
				expect(DateTimeUtils.combineDateAndTime(date1, date2).toJSON()).toEqual(`2020-04-03T${hourMinute}:00.000Z`);
			}
		});

		test("normalizeDateValue", () => {
			expect(DateTimeUtils.normalizeDateValue(now).toJSON()).toEqual(
				`1970-01-01T${addZeroBefore(now.getUTCHours())}:00:00.000Z`
			);
			expect(DateTimeUtils.normalizeDateValue(new Date("2020-06-09T12:15:18.000Z"))).toEqual(
				new Date("1970-01-01T12:15:18.000Z")
			);
		});
	});
});
