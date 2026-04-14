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

import type { ReactElement } from "react";
import { useCallback } from "react";

import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { TimePicker, DateTimeUtils, TimeUtils, parseIncompleteTime } from "@com.mgmtp.a12.widgets/widgets-core";

import { useTimePickerProps } from "./use-time-picker-props.js";

const TIME_FORMAT = "hh.mm A";
const TIMEZONE = "America/New_York";

function createDefaultTime(timezone?: string): Date | undefined {
	const defaultDate = new Date();
	const normalizedDate = DateTimeUtils.normalizeDateValue(defaultDate);
	const dateUTC = TimeUtils.convertTimezoneDateToUTC(defaultDate, timezone) ?? defaultDate;

	normalizedDate.setUTCHours(dateUTC.getUTCHours());
	normalizedDate.setUTCMinutes(dateUTC.getUTCMinutes());
	normalizedDate.setUTCSeconds(0);

	return TimeUtils.convertUTCToTimezoneDate(normalizedDate, timezone);
}

function useTimeFormatter(timezone?: string): TimePickerProps.TimeFormatter {
	return useCallback(
		(timeTZ) => {
			if (!timeTZ) {
				return "";
			}

			if (timezone) {
				return TimeUtils.formatTimezoneTime(timeTZ, timezone, TIME_FORMAT);
			}

			return TimeUtils.formatUTCTime(timeTZ, undefined, TIME_FORMAT);
		},
		[timezone]
	);
}

function useTimeConverter(timezone?: string): TimePickerProps.TimeConverter {
	return useCallback(
		(timeStringTZ) => {
			const timeUTC = parseIncompleteTime(timeStringTZ);

			if (!timeUTC) {
				return undefined;
			}

			const normalizedTime = DateTimeUtils.normalizeDateValue(timeUTC);
			const timeTZ = TimeUtils.convertUTCToTimezoneDate(normalizedTime, timezone);

			return timeTZ ? DateTimeUtils.normalizeDateValue(timeTZ) : undefined;
		},
		[timezone]
	);
}

export function CustomFormatShowcase(): ReactElement {
	return (
		<div className="-u-width-full">
			<TimePicker
				{...useTimePickerProps({ defaultValue: createDefaultTime(), id: "custom-format" })}
				label="Custom Format"
				placeholder={TIME_FORMAT}
				timeFormatter={useTimeFormatter()}
				timeConverter={useTimeConverter()}
			/>
			<br />
			<TimePicker
				{...useTimePickerProps({
					defaultValue: createDefaultTime(TIMEZONE),
					timezone: TIMEZONE,
					id: "custom-format-with-time-zone"
				})}
				label={`Initial time by timezone ${TIMEZONE} with custom format`}
				placeholder={TIME_FORMAT}
				timeFormatter={useTimeFormatter(TIMEZONE)}
				timeConverter={useTimeConverter(TIMEZONE)}
				timezone={TIMEZONE}
			/>
		</div>
	);
}
