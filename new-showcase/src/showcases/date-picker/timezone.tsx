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
import { TZDate } from "@date-fns/tz";

import { DatePickerInput } from "./date-picker-input.js";

const negativeOffsetTimeZone = "America/New_York";
const positiveOffsetTimezone = "Europe/Berlin";

export function Timezone(): ReactElement {
	return (
		<div className="-u-flex -u-flex-col -u-width-full" style={{ gap: "15px" }}>
			<DatePickerInput
				id="negative-timezone-date-picker"
				label={`Timezone ${negativeOffsetTimeZone}`}
				defaultValue={TZDate.tz(negativeOffsetTimeZone)}
				datePickerProps={{ timezone: negativeOffsetTimeZone, yearSelectorVariant: "select" }}
			/>
			<DatePickerInput
				id="positive-timezone-date-picker"
				label={`Timezone ${positiveOffsetTimezone}`}
				defaultValue={TZDate.tz(positiveOffsetTimezone)}
				datePickerProps={{ timezone: positiveOffsetTimezone, yearSelectorVariant: "select" }}
			/>
		</div>
	);
}
