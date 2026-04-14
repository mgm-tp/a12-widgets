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

import type { FC } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";

import type { DateTimePickerInputProps, DateTimePickerTimeInputProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { DateTimePickerInput, DateTimePickerTimeInput, DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

const PickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);

export const DateTimePickerInputWithTimeInput: FC<DateTimePickerInputProps<DateTimePickerTimeInputProps>> = (props) => {
	const [acceptedDate, setAcceptedDate] = useState<Date | undefined>(undefined);
	const [value, setValue] = useState("");
	const [invalidValue, setInvalidValue] = useState("");
	const { inputLabel, pickerProps, inputErrorMessage, ...rest } = props;

	useEffect(() => {
		if (acceptedDate || value.trim() === "") {
			setInvalidValue("");
		}
	}, [acceptedDate, value]);

	const errorMessage = useMemo(() => {
		return invalidValue && `Invalid date: ${invalidValue}. ${inputErrorMessage ?? ""}`;
	}, [invalidValue, inputErrorMessage]);

	const handleInputValidationError = useCallback((value: string) => {
		setInvalidValue(value);
		setAcceptedDate(undefined);
	}, []);

	return (
		<div className="-u-width-full">
			<PickerWithTimeInput
				{...rest}
				inputLabel={inputLabel ?? "Date Time Picker with Time Input"}
				pickerProps={{
					...pickerProps,
					id: pickerProps?.id ?? "date-time-input",
					value: acceptedDate,
					invalidInputMessage: "Invalid time",
					onAccept: setAcceptedDate,
					disabled: { dayOfWeek: [0, 6] }
				}}
				dateTimeInputFormat={pickerProps?.timeMode === "24h" ? "MM/DD/YYYY H:mm" : "MM/DD/YYYY h:mm A"}
				inputErrorMessage={errorMessage}
				helperText={
					acceptedDate && value
						? `Chosen date time: ${DateTimeUtils.toISOString(acceptedDate)}`
						: "You haven't chosen a date and time yet."
				}
				onInputChange={setValue}
				onInputValidationError={handleInputValidationError}
			/>
		</div>
	);
};
