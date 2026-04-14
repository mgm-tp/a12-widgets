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

import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";

import {
	createDefaultDateTimeConverter,
	createDefaultDateTimeFormatter
} from "../main/wrapper/date-time-picker-input.internal.js";

const timezone = "America/New_York";
const format = "DD-MM-YYYY HH.mm";

describe("com.mgmtp.a12.widgets.date-time-picker-input.internal", () => {
	test("createDefaultDateTimeFormatter", () => {
		const dateTime1 = new Date(Date.UTC(2023, 3, 7, 1, 17));
		const dateTime2 = new Date(Date.UTC(2023, 12, 7, 14, 45));

		const formatter1 = createDefaultDateTimeFormatter({ timezone: undefined });
		expect(formatter1(undefined)).toBe("");
		expect(formatter1(dateTime1)).toBe("04/07/2023 1:17 AM");
		expect(formatter1(dateTime2)).toBe("01/07/2024 2:45 PM");

		const formatter2 = createDefaultDateTimeFormatter({ timezone: undefined, dateTimeInputFormat: format });
		expect(formatter2(undefined)).toBe("");
		expect(formatter2(dateTime1)).toBe("07-04-2023 01.17");
		expect(formatter2(dateTime2)).toBe("07-01-2024 14.45");

		const formatter3 = createDefaultDateTimeFormatter({ timezone, dateTimeInputFormat: format });
		expect(formatter3(undefined)).toBe("");
		expect(formatter3(dateTime1)).toBe("06-04-2023 21.17");
		expect(formatter3(dateTime2)).toBe("07-01-2024 09.45");
	});

	test("createDefaultDateTimeConverter", () => {
		const input1 = "";
		const input2 = "8/3/2023 09:17 PM";
		const input3 = "invalid";

		const converter1 = createDefaultDateTimeConverter({ timezone: undefined, dateTimeInputFormat: "M/D/YYYY h:mm A" });
		expect(converter1(input1)).toBe(undefined);
		expect(DateTimeUtils.toISOString(converter1(input2))).toBe("2023-08-03T21:17:00.000Z");
		expect(converter1(input3)).toBe(undefined);

		const converter2 = createDefaultDateTimeConverter({ timezone, dateTimeInputFormat: "M/D/YYYY h:mm A" });
		expect(converter2(input1)).toBe(undefined);
		expect(DateTimeUtils.toISOString(converter2(input2))).toBe("2023-08-04T01:17:00.000Z");
		expect(converter2(input3)).toBe(undefined);
	});
});
