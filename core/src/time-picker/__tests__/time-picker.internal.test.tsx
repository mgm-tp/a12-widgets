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

import { describe, test, expect } from "vitest";

import { createDefaultTimeConverter, createDefaultTimeFormatter } from "../main/time-picker.internal.js";

const timezone = "America/New_York";

describe("com.mgmtp.a12.widgets.time-picker.internal", () => {
	test("createDefaultTimeFormatter", () => {
		const time1 = new Date(Date.UTC(2017, 12, 25, 1, 17));
		const time2 = new Date(Date.UTC(2017, 12, 25, 14, 45));

		const formatter1 = createDefaultTimeFormatter({ mode: "12h", timezone: undefined });
		expect(formatter1(undefined)).toBe("");
		expect(formatter1(time1)).toBe("01:17 AM");
		expect(formatter1(time2)).toBe("02:45 PM");

		const formatter2 = createDefaultTimeFormatter({ mode: "24h", timezone: undefined });
		expect(formatter2(undefined)).toBe("");
		expect(formatter2(time1)).toBe("01:17");
		expect(formatter2(time2)).toBe("14:45");

		const formatter3 = createDefaultTimeFormatter({ mode: "12h", timezone });
		expect(formatter3(undefined)).toBe("");
		expect(formatter3(time1)).toBe("08:17 PM");
		expect(formatter3(time2)).toBe("09:45 AM");

		const formatter4 = createDefaultTimeFormatter({ mode: "24h", timezone });
		expect(formatter4(undefined)).toBe("");
		expect(formatter4(time1)).toBe("20:17");
		expect(formatter4(time2)).toBe("09:45");
	});

	test("createDefaultTimeConverter", () => {
		const input1 = "";
		const input2 = "09:17";
		const input3 = "09:17 PM";
		const input4 = "21:17";
		const input5 = "invalid";

		const converterFor12hMode = createDefaultTimeConverter({ mode: "12h", timezone: undefined });
		expect(converterFor12hMode(input1)).toBe(undefined);

		expect(converterFor12hMode(input2)?.toISOString()).toBe("1970-01-01T09:17:00.000+00:00");
		expect(converterFor12hMode(input3)?.toISOString()).toBe("1970-01-01T21:17:00.000+00:00");
		expect(converterFor12hMode(input4)?.toISOString()).toBe(undefined);
		expect(converterFor12hMode(input5)).toBe(undefined);

		const converterFor24hMode = createDefaultTimeConverter({ mode: "24h", timezone: undefined });
		expect(converterFor24hMode(input1)).toBe(undefined);
		expect(converterFor24hMode(input2)?.toISOString()).toBe("1970-01-01T09:17:00.000+00:00");
		expect(converterFor24hMode(input3)?.toISOString()).toBe(undefined);
		expect(converterFor24hMode(input4)?.toISOString()).toBe("1970-01-01T21:17:00.000+00:00");
		expect(converterFor24hMode(input5)).toBe(undefined);

		const converterFor12hModeWithTimezone = createDefaultTimeConverter({ mode: "12h", timezone });
		expect(converterFor12hModeWithTimezone(input1)).toBe(undefined);
		expect(converterFor12hModeWithTimezone(input2)?.toISOString()).toBe("1970-01-01T14:17:00.000+00:00");
		expect(converterFor12hModeWithTimezone(input3)?.toISOString()).toBe("1970-01-01T02:17:00.000+00:00");
		expect(converterFor12hModeWithTimezone(input4)?.toISOString()).toBe(undefined);
		expect(converterFor12hModeWithTimezone(input5)).toBe(undefined);

		const converterFor24hModeWithTimezone = createDefaultTimeConverter({ mode: "24h", timezone });
		expect(converterFor24hModeWithTimezone(input1)).toBe(undefined);
		expect(converterFor24hModeWithTimezone(input2)?.toISOString()).toBe("1970-01-01T14:17:00.000+00:00");
		expect(converterFor24hModeWithTimezone(input3)?.toISOString()).toBe(undefined);
		expect(converterFor24hModeWithTimezone(input4)?.toISOString()).toBe("1970-01-01T02:17:00.000+00:00");
		expect(converterFor24hModeWithTimezone(input5)).toBe(undefined);
	});
});
