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
import { useState, useEffect, useMemo, useCallback } from "react";
import { isAfter } from "date-fns";

import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core";
import { DateInput, DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

const dateFormat = "MM/DD/YYYY";
const disabled = [0, 6];
const stringOfRange = (text: string): string[] => {
	return text.split(" - ");
};

export function DateRangePicker(): ReactElement {
	const [range, setRange] = useState<DateRange | undefined>();
	const [value, setValue] = useState("");
	const [invalidValue, setInvalidValue] = useState("");

	useEffect(() => {
		if (range || value.trim() === "") {
			setInvalidValue("");
		}
	}, [range, value]);

	const errorMessage = useMemo(() => {
		return (
			!!invalidValue &&
			`Invalid date: ${invalidValue}. Please enter the correct format ${dateFormat} - ${dateFormat}.
			Also note that you should avoid selecting disabled dates and the start-date must be less than or equal to the end-date.`
		);
	}, [invalidValue]);

	const dateRangeFormatter = useCallback(
		(date: Date) => DateTimeUtils.formatTimezoneDateTime({ date, dateTimeFormat: dateFormat }),
		[]
	);

	const dateRangeConverter = useCallback((dateString: string) => {
		const fromDate = DateTimeUtils.parseDateTimeUTC(stringOfRange(dateString)[0], dateFormat);
		const toDate = DateTimeUtils.parseDateTimeUTC(stringOfRange(dateString)[1], dateFormat);

		if (!fromDate || !toDate || isAfter(fromDate, toDate)) {
			return undefined;
		}

		return DateTimeUtils.createTimezoneConverter().convertDateRange.toTimezone({
			from: fromDate,
			to: toDate
		});
	}, []);

	const chosenDate = useMemo(() => {
		return range?.from && range.to
			? `${DateTimeUtils.toISOString(range.from)} - ${DateTimeUtils.toISOString(range.to)}`
			: undefined;
	}, [range?.from, range?.to]);

	return (
		<div className="-u-width-full">
			<DateInput
				id="day-range-picker"
				label="Date Range Picker"
				useRangePicker
				dateFormatter={dateRangeFormatter}
				dateConverter={dateRangeConverter}
				datePickerProps={{
					disabled: [{ dayOfWeek: disabled }],
					footer: { acceptLabel: "OK", clearLabel: "Clear", onAccept: setRange }
				}}
				datePickerDialogProps={{ okLabel: "OK", clearLabel: "Clear", title: "Set a range" }}
				errorMessage={errorMessage}
				placeholder={`${dateFormat} - ${dateFormat}`}
				helperText={
					<p>
						{chosenDate ? (
							<>
								Chosen date is: <em>{chosenDate}</em>
							</>
						) : (
							"You haven't chosen a date yet."
						)}
					</p>
				}
				onInputChange={setValue}
				onInputValidationError={setInvalidValue}
			/>
		</div>
	);
}
