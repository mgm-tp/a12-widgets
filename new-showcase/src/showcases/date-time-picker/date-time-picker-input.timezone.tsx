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

import type { FC, FocusEvent } from "react";
import { useState, useEffect, useCallback } from "react";

import { DateTimePickerInput, DateTimePickerTimeInput, DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearOnBlur } from "../inputs/year-selector/year-selector-validation.utils.js";

const PickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);
const negativeOffsetTimezone = "America/New_York";
const positiveOffsetTimezone = "Europe/Berlin";

const DATE_TIME_FORMAT = "MM/DD/YYYY h:mm A";

export const DateTimePickerInputWithTimezone: FC = () => {
	const [positiveTimezoneDateTime, setPositiveTimezoneDateTime] = useState<Date | undefined>(
		new Date("04/22/2025 11:30 AM")
	);
	const [negativeTimezoneDateTime, setNegativeTimezoneDateTime] = useState<Date | undefined>(
		new Date("04/22/2025 11:30 AM")
	);
	const [invalidPositiveTimezoneValue, setInvalidPositiveTimezoneValue] = useState<string | undefined>(undefined);
	const [invalidNegativeTimezoneValue, setInvalidNegativeTimezoneValue] = useState<string | undefined>(undefined);

	const [positiveTimezoneValue, setPositiveTimezoneValue] = useState(
		DateTimeUtils.toISOString(positiveTimezoneDateTime) ?? ""
	);
	const [negativeTimezoneValue, setNegativeTimezoneValue] = useState(
		DateTimeUtils.toISOString(negativeTimezoneDateTime) ?? ""
	);

	const [yearErrorPositive, setYearErrorPositive] = useState<string | undefined>();
	const [yearErrorNegative, setYearErrorNegative] = useState<string | undefined>();

	useEffect(() => {
		if (positiveTimezoneDateTime || positiveTimezoneValue.trim() === "") {
			setInvalidPositiveTimezoneValue("");
		}

		if (negativeTimezoneDateTime || negativeTimezoneValue.trim() === "") {
			setInvalidNegativeTimezoneValue("");
		}
	}, [negativeTimezoneDateTime, negativeTimezoneValue, positiveTimezoneDateTime, positiveTimezoneValue]);

	const handleInputValidationError = useCallback((value: string, isPositive = true) => {
		if (isPositive) {
			setInvalidPositiveTimezoneValue(value);
			setPositiveTimezoneDateTime(undefined);
		} else {
			setNegativeTimezoneDateTime(undefined);
			setInvalidNegativeTimezoneValue(value);
		}
	}, []);

	const handleYearBlurPositive = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
		setYearErrorPositive(validateYearOnBlur(ev, { min: 1900, max: new Date().getFullYear() }));
	}, []);

	const handleYearBlurNegative = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
		setYearErrorNegative(validateYearOnBlur(ev, { min: 1900, max: new Date().getFullYear() }));
	}, []);

	const getHelperText = useCallback((timezone: string, isValid: boolean, value?: Date) => {
		return isValid
			? `Chosen date time: ${DateTimeUtils.toISOString(value, timezone)}`
			: "You haven't chosen a date and time yet.";
	}, []);

	return (
		<div className="-u-flex -u-flex-col -u-width-full" style={{ gap: "1rem" }}>
			<PickerWithTimeInput
				inputLabel={`Timezone ${negativeOffsetTimezone}`}
				pickerProps={{
					id: "date-time-picker-input-with-negative-time-zone",
					value: negativeTimezoneDateTime,
					invalidInputMessage: "Invalid value",
					onAccept: setNegativeTimezoneDateTime,
					timezone: negativeOffsetTimezone,
					onYearSelectorBlur: handleYearBlurNegative,
					yearErrorMessage: yearErrorNegative
				}}
				inputErrorMessage={invalidNegativeTimezoneValue && `Invalid value: ${invalidNegativeTimezoneValue}`}
				onInputChange={setNegativeTimezoneValue}
				dateTimeInputFormat={DATE_TIME_FORMAT}
				onInputValidationError={(value) => handleInputValidationError(value, false)}
				helperText={getHelperText(
					negativeOffsetTimezone,
					!!negativeTimezoneDateTime && !!negativeTimezoneValue,
					negativeTimezoneDateTime
				)}
			/>
			<PickerWithTimeInput
				inputLabel={`Timezone ${positiveOffsetTimezone}`}
				pickerProps={{
					id: "date-time-picker-input-with-positive-time-zone",
					value: positiveTimezoneDateTime,
					invalidInputMessage: "Invalid value",
					onAccept: setPositiveTimezoneDateTime,
					timezone: positiveOffsetTimezone,
					onYearSelectorBlur: handleYearBlurPositive,
					yearErrorMessage: yearErrorPositive
				}}
				inputErrorMessage={invalidPositiveTimezoneValue && `Invalid value: ${invalidPositiveTimezoneValue}`}
				onInputChange={setPositiveTimezoneValue}
				dateTimeInputFormat={DATE_TIME_FORMAT}
				onInputValidationError={handleInputValidationError}
				helperText={getHelperText(
					positiveOffsetTimezone,
					!!positiveTimezoneDateTime && !!positiveTimezoneValue,
					positiveTimezoneDateTime
				)}
			/>
		</div>
	);
};
