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
import { useCallback, useState, useEffect } from "react";

import type { DateTimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { DateTimePicker, DateTimePickerInput, DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

const PickerWithTimeInput = DateTimePickerInput(DateTimePicker);
const timezone = "America/New_York";

const DATE_TIME_FORMAT = "DD-MM-YYYY HH.mm";

function useDateTimeFormatter(): DateTimePickerProps.DateTimeFormatter {
	return useCallback((dateTimeTZ) => {
		if (!dateTimeTZ) {
			return "";
		}

		return DateTimeUtils.formatTimezoneDateTime({ date: dateTimeTZ, timezone, dateTimeFormat: DATE_TIME_FORMAT });
	}, []);
}

function useDateTimeConverter(): DateTimePickerProps.DateTimeConverter {
	return useCallback((value) => {
		const dateTimeUTC = DateTimeUtils.parseDateTimeUTC(value, DATE_TIME_FORMAT);

		if (!dateTimeUTC) {
			return undefined;
		}

		return DateTimeUtils.createTimezoneConverter(timezone).convertDate.toTimezone(dateTimeUTC);
	}, []);
}

export const DateTimePickerInputCustomFormat: FC = () => {
	const [acceptedDatetime, setAcceptedDatetime] = useState<Date | undefined>();
	const [invalidValue, setInvalidValue] = useState<string | undefined>(undefined);
	const [value, setValue] = useState("");

	useEffect(() => {
		if (acceptedDatetime || value.trim() === "") {
			setInvalidValue("");
		}
	}, [acceptedDatetime, value]);

	const handleInputValidationError = useCallback((value: string) => {
		setInvalidValue(value);
		setAcceptedDatetime(undefined);
	}, []);

	return (
		<PickerWithTimeInput
			inputLabel={`With timezone ${timezone}`}
			pickerProps={{
				id: "date-time-picker-input-custom-format",
				value: acceptedDatetime,
				onAccept: setAcceptedDatetime,
				timezone
			}}
			dateTimeFormatter={useDateTimeFormatter()}
			dateTimeConverter={useDateTimeConverter()}
			inputErrorMessage={invalidValue && `Invalid value: ${invalidValue}`}
			onInputChange={setValue}
			onInputValidationError={handleInputValidationError}
			helperText={
				acceptedDatetime && value
					? `Chosen date time: ${DateTimeUtils.toISOString(acceptedDatetime, timezone)}`
					: "You haven't chosen a date and time yet."
			}
			placeholder={DATE_TIME_FORMAT}
		/>
	);
};
