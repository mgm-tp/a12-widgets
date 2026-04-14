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

import type { DateInputProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { DateTimeUtils, DateInput } from "@com.mgmtp.a12.widgets/widgets-core";

const dateFormat = "MM/DD/YYYY";
export function DatePickerInput(props: Omit<DateInputProps, "dateFormatter" | "dateConverter">): ReactElement {
	const [invalidValue, setInvalidValue] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		!DateTimeUtils.isRangeMatcher(props.defaultValue) ? props.defaultValue : undefined
	);
	const [value, setValue] = useState("");

	useEffect(() => {
		if (selectedDate || value.trim() === "") {
			setInvalidValue("");
		}
	}, [selectedDate, value]);

	const errorMessage = useMemo(() => {
		return !!invalidValue && `Invalid date: ${invalidValue}. ${props.errorMessage ?? ""}`;
	}, [invalidValue, props.errorMessage]);

	const dateConverter = useCallback(
		(value: string) => {
			const parsedDate = DateTimeUtils.parseDateTimeUTC(value, "MM/DD/YYYY");

			if (!parsedDate) {
				return undefined;
			}

			return DateTimeUtils.createTimezoneConverter(props.datePickerProps?.timezone).convertDate.toTimezone(parsedDate);
		},
		[props.datePickerProps?.timezone]
	);

	const dateFormatter = useCallback(
		(date: Date) => {
			return DateTimeUtils.formatTimezoneDateTime({
				date,
				timezone: props.datePickerProps?.timezone,
				dateTimeFormat: "L"
			});
		},
		[props.datePickerProps?.timezone]
	);

	const chosenDate = useMemo(
		() => DateTimeUtils.toISOString(selectedDate, props.datePickerProps?.timezone),
		[props.datePickerProps?.timezone, selectedDate]
	);

	return (
		<div className="-u-width-full">
			<DateInput
				{...props}
				placeholder={dateFormat}
				errorMessage={errorMessage || props.errorMessage}
				dateFormatter={dateFormatter}
				dateConverter={dateConverter}
				datePickerDialogProps={{ okLabel: "OK", title: "Set a date", ...props.datePickerDialogProps }}
				helperText={
					!props.readonly &&
					!props.disabled && (
						<p>
							{chosenDate ? (
								<>
									Chosen date is <em>{chosenDate}</em>
								</>
							) : (
								"You haven't chosen a date yet."
							)}
						</p>
					)
				}
				onSelectedDayChange={setSelectedDate}
				onInputChange={setValue}
				onInputValidationError={setInvalidValue}
			/>
		</div>
	);
}
