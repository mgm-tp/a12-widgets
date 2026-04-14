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

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { de } from "date-fns/locale/de";
import { enUS } from "date-fns/locale/en-US";

import { TimeUtils } from "../time-utils.js";

describe("com.mgmtp.a12.widgets.common.utils.time", () => {
	let now: Date;
	beforeEach(() => {
		now = new Date(Date.UTC(2020, 1, 1));
		vi.useFakeTimers();
		vi.setSystemTime(now);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("getHourFormat", () => {
		expect(TimeUtils.getHourFormat("hh:mm A")).toEqual("hh");
		expect(TimeUtils.getHourFormat("h:mm A")).toEqual("h");
		expect(TimeUtils.getHourFormat("HH:mm")).toEqual("HH");
		expect(TimeUtils.getHourFormat("H:mm")).toEqual("H");
	});

	test("getMinuteFormat", () => {
		expect(TimeUtils.getMinuteFormat("hh:mm A")).toEqual("mm");
		expect(TimeUtils.getMinuteFormat("HH:m")).toEqual("m");
	});

	test("getFormattedHour", () => {
		for (let i = 1; i <= 24; i++) {
			const value = i > 12 ? i - 12 : i;
			expect(TimeUtils.getFormattedHour(i, "hh")).toEqual((value < 10 ? `0` : "") + `${value}`);
			expect(TimeUtils.getFormattedHour(i, "h")).toEqual(`${value}`);
			expect(TimeUtils.getFormattedHour(i, "HH")).toEqual((i < 10 ? `0` : "") + (i === 24 ? "00" : `${i}`));
			expect(TimeUtils.getFormattedHour(i, "H")).toEqual(i === 24 ? "0" : `${i}`);
		}
	});

	test("getFormattedMinute", () => {
		for (let i = 0; i <= 55; i++) {
			expect(TimeUtils.getFormattedMinute(i, "mm")).toEqual((i < 10 ? `0` : "") + `${i}`);
			expect(TimeUtils.getFormattedMinute(i, "m")).toEqual(`${i}`);
		}
	});

	test("getTimeFormat", () => {
		expect(TimeUtils.getTimeFormat("12h")).toEqual("hh:mm A");
		expect(TimeUtils.getTimeFormat("24h")).toEqual("HH:mm");
		expect(TimeUtils.getTimeFormat()).toEqual("hh:mm A");

		expect(TimeUtils.getTimeFormat("12h", true)).toEqual("hh:mm AZ");
		expect(TimeUtils.getTimeFormat("24h", true)).toEqual("HH:mmZ");
		expect(TimeUtils.getTimeFormat(undefined, true)).toEqual("hh:mm AZ");
	});

	test("getTimeWithTimezone", () => {
		const testData = [
			{ timezone: "Pacific/Niue", expect: "2020-01-31T13:00:00.000-11:00" },
			{ timezone: "America/Toronto", expect: "2020-01-31T19:00:00.000-05:00" },
			{ timezone: "Atlantic/Faroe", expect: "2020-02-01T00:00:00.000+00:00" },
			{ timezone: "Asia/Ho_Chi_Minh", expect: "2020-02-01T07:00:00.000+07:00" },
			{ timezone: "Pacific/Kiritimati", expect: "2020-02-01T14:00:00.000+14:00" }
		];

		for (let i = 0; i < testData.length; i++) {
			expect(TimeUtils.getTimeWithTimezone(now, testData[i].timezone).toISOString()).toEqual(testData[i].expect);
		}
	});

	test("formatUTCTime", () => {
		const utc = now.getUTCHours();
		const hour = utc > 12 ? utc - 12 : utc === 0 ? 12 : utc;
		const timeFormat = utc > 12 ? "PM" : "AM";
		expect(TimeUtils.formatUTCTime(now)).toEqual(`${hour}:00 ${timeFormat}`);
		expect(TimeUtils.formatUTCTime(now, de)).toEqual(`00:00`);
		expect(TimeUtils.formatUTCTime(now, enUS, "LTS")).toEqual(`${hour}:00:00 ${timeFormat}`);
	});

	test("formatTimezoneTime", () => {
		const testData = [
			{ timezone: "Pacific/Niue", expect: "1:00 PM" },
			{ timezone: "America/Toronto", timeFormat: "LTS", expect: "7:00:00 PM" },
			{ timezone: "Asia/Ho_Chi_Minh", locale: de, expect: "07:00" },
			{ timezone: "Pacific/Kiritimati", timeFormat: "LTS", locale: de, expect: "14:00:00" }
		];

		for (let i = 0; i < testData.length; i++) {
			expect(
				TimeUtils.formatTimezoneTime(now, testData[i].timezone, testData[i].timeFormat, testData[i].locale)
			).toEqual(testData[i].expect);
		}
	});

	test("convertUTCToTimezoneDate", () => {
		const testData = [
			{ timezone: "Pacific/Niue", expect: new Date("2020-02-01T11:00:00.000Z") },
			{ timezone: "America/Toronto", expect: new Date("2020-02-01T05:00:00.000Z") },
			{ timezone: "Asia/Ho_Chi_Minh", expect: new Date("2020-01-31T17:00:00.000Z") },
			{ timezone: "Pacific/Kiritimati", expect: new Date("2020-01-31T10:00:00.000Z") }
		];

		for (let i = 0; i < testData.length; i++) {
			expect(TimeUtils.convertUTCToTimezoneDate(now, testData[i].timezone)).toEqual(testData[i].expect);
		}
	});

	test("convertTimezoneDateToUTC", () => {
		const testData = [
			{ timezone: "Pacific/Niue", timezoneDate: new Date("2020-02-01T11:00:00.000Z") },
			{ timezone: "America/Toronto", timezoneDate: new Date("2020-02-01T05:00:00.000Z") },
			{ timezone: "Asia/Ho_Chi_Minh", timezoneDate: new Date("2020-01-31T17:00:00.000Z") },
			{ timezone: "Pacific/Kiritimati", timezoneDate: new Date("2020-01-31T10:00:00.000Z") }
		];

		for (let i = 0; i < testData.length; i++) {
			expect(TimeUtils.convertTimezoneDateToUTC(testData[i].timezoneDate, testData[i].timezone)).toEqual(now);
		}
	});

	test("isSameTime", () => {
		expect(TimeUtils.isSameTime(now, now)).toBeTruthy();
		expect(TimeUtils.isSameTime(undefined, undefined)).toBeTruthy();
		expect(TimeUtils.isSameTime(new Date(2020, 2, 1, 0, 0), new Date(2020, 2, 1, 0, 0))).toBeTruthy();

		expect(TimeUtils.isSameTime(now, undefined)).toBeFalsy();
		expect(TimeUtils.isSameTime(now, new Date(2020, 1, 1, 12, 0))).toBeFalsy();
		expect(TimeUtils.isSameTime(now, new Date(2020, 2, 1, 0, 0))).toBeFalsy();
	});
});
