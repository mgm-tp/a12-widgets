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
import { parse } from "date-fns/parse";
import { TZDate } from "@date-fns/tz";
import { isValid } from "date-fns/isValid";

import type { DateInputProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	DateTimeUtils,
	DateInput as DateInputWidget,
	convertMomentToDateFnsFormat
} from "@com.mgmtp.a12.widgets/widgets-core";

const dateFormat = "MM/DD/YYYY";

export function DateInput(props: Omit<DateInputProps, "dateFormatter" | "dateConverter">): ReactElement {
	const { onSelectedDayChange } = props;
	const [invalidValue, setInvalidValue] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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
			const date = parse(
				value,
				convertMomentToDateFnsFormat(dateFormat),
				TZDate.tz(props.datePickerProps?.timezone || "UTC")
			);

			if (!date || !isValid(date)) {
				return undefined;
			}

			return date;
		},
		[props.datePickerProps?.timezone]
	);

	const dateFormatter = useCallback(
		(date: Date) =>
			DateTimeUtils.formatTimezoneDateTime({ date, timezone: props.datePickerProps?.timezone, dateTimeFormat: "L" }),
		[props.datePickerProps?.timezone]
	);

	const handleSelectedDayChange = useCallback(
		(selectedDate?: Date) => {
			setSelectedDate(selectedDate);
			onSelectedDayChange?.(selectedDate);
		},
		[onSelectedDayChange]
	);

	return (
		<DateInputWidget
			{...props}
			placeholder={dateFormat}
			errorMessage={errorMessage}
			dateFormatter={dateFormatter}
			dateConverter={dateConverter}
			datePickerDialogProps={{ okLabel: "OK" }}
			onSelectedDayChange={handleSelectedDayChange}
			onInputChange={setValue}
			onInputValidationError={setInvalidValue}
		/>
	);
}
