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

import type { ReactElement, FocusEvent } from "react";
import { useState, useCallback } from "react";
import { enUS } from "date-fns/locale";

import { DateTimeContext, DateTimePickerInput, DateTimePickerTimeInput } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearOnBlur } from "../inputs/year-selector/year-selector-validation.utils.js";

const PickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);

export function DateTimePickerInputContextTimeModeShowcase(): ReactElement {
	const [date24h, setDate24h] = useState<Date | undefined>();
	const [date12h, setDate12h] = useState<Date | undefined>();
	const [yearError24h, setYearError24h] = useState<string | undefined>();
	const [yearError12h, setYearError12h] = useState<string | undefined>();

	const handleYearBlur24h = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
		setYearError24h(validateYearOnBlur(ev, { min: 1900, max: new Date().getFullYear() }));
	}, []);

	const handleYearBlur12h = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
		setYearError12h(validateYearOnBlur(ev, { min: 1900, max: new Date().getFullYear() }));
	}, []);

	return (
		<div className="-u-flex -u-flex-col -u-width-full" style={{ gap: "1rem" }}>
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<PickerWithTimeInput
					inputLabel="Date Time Picker using 24h mode from context"
					pickerProps={{
						id: "context-time-mode-24h",
						value: date24h,
						onAccept: setDate24h,
						onYearSelectorBlur: handleYearBlur24h,
						yearErrorMessage: yearError24h
					}}
					dateTimeInputFormat="MM/DD/YYYY HH:mm"
				/>
				<PickerWithTimeInput
					inputLabel="Date Time Picker with prop override (12h) inside 24h context"
					pickerProps={{
						id: "context-time-mode-12h-override",
						value: date12h,
						onAccept: setDate12h,
						timeMode: "12h",
						onYearSelectorBlur: handleYearBlur12h,
						yearErrorMessage: yearError12h
					}}
					dateTimeInputFormat="MM/DD/YYYY hh:mm A"
				/>
			</DateTimeContext.Provider>
		</div>
	);
}
