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

import { type Locale } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { TZDate } from "@date-fns/tz";
import { isValid, parse } from "date-fns";

import { DateTimeUtils } from "../../../common/main/date-time/date-utils.js";

import type { DateTimePickerProps } from "../date-time-picker.api.js";

import type { DateTimePickerInputProps } from "./date-time-picker-input.api.js";

export function createDefaultDateTimeFormatter(
	params: { timezone?: string; locale?: Locale } & Pick<
		DateTimePickerInputProps<DateTimePickerProps>,
		"dateTimeInputFormat"
	>
): DateTimePickerProps.DateTimeFormatter {
	const { timezone, dateTimeInputFormat, locale = enUS } = params;

	return (dateTimeTZ) => {
		if (!dateTimeTZ) {
			return "";
		}

		if (timezone) {
			return DateTimeUtils.formatTimezoneDateTime({
				date: dateTimeTZ,
				timezone,
				dateTimeFormat: dateTimeInputFormat,
				locale: locale
			});
		}

		return DateTimeUtils.formatUTCDateTime(dateTimeTZ, locale, dateTimeInputFormat);
	};
}

export function createDefaultDateTimeConverter(
	params: { timezone?: string; locale?: Locale } & Pick<
		DateTimePickerInputProps<DateTimePickerProps>,
		"dateTimeInputFormat"
	>
): DateTimePickerProps.DateTimeConverter {
	const { timezone, dateTimeInputFormat, locale = enUS } = params;

	return (dateTimeStringTZ) => {
		const dateTimeFormat = DateTimeUtils.getDateFnsDateTimeFormat(dateTimeInputFormat, locale);

		const dateTimeUTC = parse(dateTimeStringTZ, dateTimeFormat, TZDate.tz("UTC", 1970, 0, 1, 0));

		if (!isValid(dateTimeUTC)) {
			return undefined;
		}

		return DateTimeUtils.createTimezoneConverter(timezone).convertDate.toTimezone(dateTimeUTC);
	};
}
