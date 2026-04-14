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

import type { RefCallback } from "react";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

import type { BaseInputProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { FieldName, FormData, Issue, ValidationResult } from "./showcase-validation-bar.api.js";

type Register = (
	fieldName: FieldName,
	validator: Validator
) => Pick<BaseInputProps, "error" | "errorMessage" | "warning" | "warningMessage"> & {
	onChange(value: unknown): void;
	value: any;
	inputRef: RefCallback<HTMLInputElement>;
};

type FieldController = {
	[fieldName in FieldName]?: { ref: HTMLInputElement | null; validator: Validator };
};

type Validator = (value: any) => { errorMessage?: string | false; warningMessage?: string | false };

export function useForm(initialData: FormData) {
	const [validationResult, setValidationResult] = useState<ValidationResult>({});
	const [formData, setFormData] = useState(() => initialData);
	const fieldControllers = useRef<FieldController>({});

	const register: Register = useCallback(
		(fieldName, validator) => {
			fieldControllers.current = {
				...fieldControllers.current,
				[fieldName]: { ...fieldControllers.current[fieldName], validator }
			};

			const value = formData[fieldName];
			const { errorMessage, warningMessage } = validator(value);

			return {
				value,
				error: !!errorMessage,
				warning: !!warningMessage,
				errorMessage: errorMessage || undefined,
				warningMessage: warningMessage || undefined,
				onChange: (newValue): void => setFormData((oldFormData) => ({ ...oldFormData, [fieldName]: newValue })),
				inputRef: (ref): void => {
					fieldControllers.current = {
						...fieldControllers.current,
						[fieldName]: { ...fieldControllers.current[fieldName], ref }
					};
				}
			};
		},
		[formData]
	);

	const goToField = useCallback((fieldName: FieldName) => {
		const ref = fieldControllers.current[fieldName]?.ref;
		ref?.focus();
	}, []);

	useEffect(() => {
		const issues: Issue[] = [];

		Object.entries(fieldControllers.current).forEach(([key, value]) => {
			const fieldName = key as FieldName;
			const validationResult = value.validator(formData[fieldName]);

			if (!validationResult) {
				return;
			}

			const { errorMessage, warningMessage } = validationResult;

			if (errorMessage) {
				issues.push({ fieldName, variant: "error", message: errorMessage });
			}

			if (warningMessage) {
				issues.push({ fieldName, variant: "warning", message: warningMessage });
			}
		});

		setValidationResult(() => ({
			issues,
			errors: issues.filter(({ variant }) => variant === "error"),
			warnings: issues.filter(({ variant }) => variant === "warning")
		}));
	}, [formData]);

	return useMemo(() => ({ register, goToField, ...validationResult }), [goToField, register, validationResult]);
}
