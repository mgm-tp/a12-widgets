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
import { useCallback, useState, useEffect } from "react";

import { DateTimePicker, DateTimePickerInput, DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearOnBlur } from "../inputs/year-selector/year-selector-validation.utils.js";

const PickerWithTimeInput = DateTimePickerInput(DateTimePicker);

export const AccessibilityDateTimePickerShowcase: FC = () => {
	const [acceptedDatetime, setAcceptedDatetime] = useState<Date | undefined>();
	const [invalidValue, setInvalidValue] = useState<string | undefined>(undefined);
	const [value, setValue] = useState("");
	const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

	useEffect(() => {
		if (acceptedDatetime || value.trim() === "") {
			setInvalidValue("");
		}
	}, [acceptedDatetime, value]);

	const handleInputValidationError = useCallback((value: string) => {
		setInvalidValue(value);
		setAcceptedDatetime(undefined);
	}, []);

	const handleYearBlur = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
		setYearErrorMessage(validateYearOnBlur(ev, { min: 1900, max: new Date().getFullYear() }));
	}, []);

	return (
		<PickerWithTimeInput
			inputLabel="Accessible Date Time Picker"
			pickerProps={{
				id: "accessibility-date-time-picker",
				value: acceptedDatetime,
				onAccept: setAcceptedDatetime,
				desktopPickerAttributes: {
					"aria-label": "Desktop Accessible Date Time Picker"
				},
				mobilePickerAttributes: {
					"aria-label": "Mobile Accessible Date Time Picker"
				},
				onYearSelectorBlur: handleYearBlur,
				yearErrorMessage
			}}
			inputErrorMessage={invalidValue && `Invalid value: ${invalidValue}`}
			onInputChange={setValue}
			onInputValidationError={handleInputValidationError}
			helperText={
				acceptedDatetime && value
					? `Chosen date time: ${DateTimeUtils.toISOString(acceptedDatetime)}`
					: "You haven't chosen a date and time yet."
			}
		/>
	);
};
