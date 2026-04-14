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

import { useState, useRef, useCallback, useMemo } from "react";

import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { generateUid, DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";

export function useTimePickerProps(defaultValue?: Date, timezone?: string): TimePickerProps {
	const [value, setValue] = useState<Date | undefined>(defaultValue);
	const [input, setInput] = useState<string | undefined>("");
	const [errorValue, setErrorValue] = useState<string | undefined>(undefined);
	const prevValue = useRef(defaultValue);

	const onChange: Required<TimePickerProps>["onChange"] = useCallback(
		(time) => {
			prevValue.current = value;
			setValue(time);
		},
		[value]
	);

	const onValidate: Required<TimePickerProps>["onValidate"] = useCallback(({ value, valid }) => {
		setErrorValue(!valid ? value : undefined);
	}, []);

	const errorMessage: TimePickerProps["errorMessage"] = useMemo(() => {
		return errorValue && `Invalid value: ${errorValue}`;
	}, [errorValue]);

	const helperText: TimePickerProps["helperText"] = useMemo(() => {
		const onInputChangeHelperText = input && (
			<span>
				The string you have typed is <em>{input}</em>.
			</span>
		);

		if (errorValue) {
			return onInputChangeHelperText;
		}

		if (value) {
			return (
				<>
					{onInputChangeHelperText}
					<p>
						Chosen time is <em>{DateTimeUtils.toISOString(value, timezone)}</em>.{" "}
						{prevValue.current && (
							<>
								Previous time you have chosen is <em>{DateTimeUtils.toISOString(prevValue.current, timezone)}</em>
							</>
						)}
					</p>
				</>
			);
		}

		return (
			<>
				{onInputChangeHelperText}
				<p>You haven't chosen a time yet</p>
			</>
		);
	}, [errorValue, input, timezone, value]);

	return useMemo(
		() => ({
			id: generateUid(),
			placeholder: "hh:mm A",
			value,
			errorValue,
			helperText,
			onChange,
			onInputChange: setInput,
			errorMessage,
			onValidate
		}),
		[errorMessage, errorValue, helperText, onChange, onValidate, value]
	);
}
