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

import { convertMomentToDateFnsFormat } from "../date-fns-utils.js";

describe("convertMomentFormat", () => {
	describe("convertMomentToDateFnsFormat", () => {
		test("should correctly convert Moment.js format to date-fns format", () => {
			const momentFormat = "YYYY-MM-DD HH:mm:ss A";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("yyyy-MM-dd HH:mm:ss a");
		});

		test("should correctly convert format with day of week and timezone", () => {
			const momentFormat = "dddd, MMMM D, YYYY ZZ";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("EEEE, MMMM d, yyyy xx");
		});

		test("should correctly convert format with short year and month", () => {
			const momentFormat = "YY-M-D";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("yy-M-d");
		});

		test("should correctly convert format with 12-hour time and AM/PM", () => {
			const momentFormat = "hh:mm A";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("hh:mm a");
		});

		test("should correctly convert format with seconds and milliseconds", () => {
			const momentFormat = "HH:mm:ss.SSS";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("HH:mm:ss.SSS");
		});

		test("should leave unsupported tokens unchanged", () => {
			const momentFormat = "YYYY-MM-DD [at] HH:mm:ss";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("yyyy-MM-dd [at] HH:mm:ss");
		});

		test("should correctly convert LT format to date-fns format", () => {
			const momentFormat = "LT";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("p");
		});

		test("should correctly convert LTS format to date-fns format", () => {
			const momentFormat = "LTS";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("pp");
		});

		test("should correctly convert L format to date-fns format", () => {
			const momentFormat = "L";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("P");
		});

		test("should correctly convert LL format to date-fns format", () => {
			const momentFormat = "LL";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("PP");
		});

		test("should correctly convert LLL format to date-fns format", () => {
			const momentFormat = "LLL";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("PPP");
		});

		test("should correctly convert LLLL format to date-fns format", () => {
			const momentFormat = "LLLL";
			const dateFnsFormat = convertMomentToDateFnsFormat(momentFormat);
			expect(dateFnsFormat).toBe("PPPP p");
		});
	});
});
