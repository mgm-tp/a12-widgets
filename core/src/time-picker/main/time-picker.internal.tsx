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

import { parseIncompleteTime } from "../../common/main/date-time/date-fns-utils.js";
import { DateTimeUtils } from "../../common/main/date-time/date-utils.js";
import { TimeUtils } from "../../common/main/date-time/time-utils.js";
import { DataRoles } from "../../common/index.js";

import { TimePickerTpl } from "./time-picker.tpl.view.js";
import type { TimePickerProps } from "./time-picker.api.js";

export const timePickerBaseDataRole = DataRoles.TimePicker;

export type HeaderProps = TimePickerTpl.HeaderProps;

export const Header = TimePickerTpl.Header;

/** @internal */
export function createDefaultTimeFormatter(
	params: Pick<TimePickerProps, "mode" | "timezone">
): TimePickerProps.TimeFormatter {
	const { mode, timezone } = params;

	return (timeTZ) => {
		if (!timeTZ) {
			return "";
		}

		const timeFormat = TimeUtils.getTimeFormat(mode);

		if (timezone) {
			return TimeUtils.formatTimezoneTime(timeTZ, timezone, timeFormat);
		}

		return TimeUtils.formatUTCTime(timeTZ, undefined, timeFormat);
	};
}

/** @internal */
export function createDefaultTimeConverter(
	params: Pick<TimePickerProps, "mode" | "timezone">
): TimePickerProps.TimeConverter {
	const { mode, timezone } = params;

	return (timeStringTZ) => {
		const fixedDate = parseIncompleteTime(timeStringTZ, mode);

		if (!fixedDate) {
			return undefined;
		}

		const normalizedTime = DateTimeUtils.normalizeDateValue(fixedDate);
		const timeTZ = TimeUtils.convertUTCToTimezoneDate(normalizedTime, timezone);

		return timeTZ ? DateTimeUtils.normalizeDateValue(timeTZ) : undefined;
	};
}
