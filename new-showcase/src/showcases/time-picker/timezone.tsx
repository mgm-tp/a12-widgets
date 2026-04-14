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

import { TimePicker, DateTimeUtils, TimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

import { useTimePickerProps } from "./use-time-picker-props.js";

const timezone = "America/New_York";

function createDefaultTimezoneTime(): Date | undefined {
	const defaultDate = new Date();
	const normalizedDate = DateTimeUtils.normalizeDateValue(defaultDate);
	const dateUTC = TimeUtils.convertTimezoneDateToUTC(defaultDate, timezone) ?? defaultDate;

	normalizedDate.setUTCHours(dateUTC.getUTCHours());
	normalizedDate.setUTCMinutes(dateUTC.getUTCMinutes());
	normalizedDate.setUTCSeconds(0);

	return TimeUtils.convertUTCToTimezoneDate(normalizedDate, timezone);
}

export function TimezoneShowcase(): ReactElement {
	return (
		<div className="-u-width-full">
			<TimePicker
				{...useTimePickerProps({ defaultValue: createDefaultTimezoneTime(), timezone, id: "timezone" })}
				label="With America/New_York timezone"
				timezone={timezone}
			/>
		</div>
	);
}
