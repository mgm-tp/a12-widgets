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

import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

export default {};
export function useTimePickerProps(props?: { id?: string; defaultValue?: Date; timezone?: string }): TimePickerProps {
	const { defaultValue, timezone, id } = props ?? {};
	const [value, setValue] = useState<Date | undefined>(defaultValue);
	const [errorValue, setErrorValue] = useState<string | undefined>(undefined);
	const prevValue = useRef(defaultValue);

	const onChange = useCallback(
		(time?: Date) => {
			prevValue.current = value;
			setValue(time);
			setErrorValue(undefined);
		},
		[value]
	);

	const onValidate = useCallback(({ value, valid }: { value: string; valid: boolean }) => {
		setErrorValue(!valid ? value : undefined);
	}, []);

	const errorMessage = useMemo(() => (errorValue ? `Invalid value: ${errorValue}` : undefined), [errorValue]);

	const helperText: TimePickerProps["helperText"] = useMemo(() => {
		if (value && !errorValue) {
			return (
				<p>
					Chosen time is <em>{DateTimeUtils.toISOString(value, timezone)}</em>
				</p>
			);
		}

		return <p>You haven't chosen a time yet.</p>;
	}, [errorValue, timezone, value]);

	return useMemo(
		() => ({ id: id ?? "time-picker", value, errorValue, helperText, onChange, errorMessage, onValidate }),
		[errorMessage, errorValue, helperText, id, onChange, onValidate, value]
	);
}

export function useDateTimePickerState() {
	const [accepted, setAccepted] = useState<Date | undefined>();
	const [value, setValue] = useState("");
	const [invalidValue, setInvalidValue] = useState("");

	useEffect(() => {
		if (accepted || value.trim() === "") {
			setInvalidValue("");
		}
	}, [accepted, value]);

	const onInputValidationError = useCallback((v: string) => {
		setInvalidValue(v);
		setAccepted(undefined);
	}, []);

	return {
		accepted,
		setAccepted,
		onInputChange: setValue,
		onInputValidationError,
		inputErrorMessage: invalidValue ? `Invalid value: ${invalidValue}` : undefined
	};
}
