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

import type { ReactNode, ReactElement, FocusEvent } from "react";
import { useRef, useState, useCallback } from "react";

import type { DateTimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Icon,
	Button,
	DateTimePicker,
	DateTimePickerDialog,
	DateTimeUtils,
	provider,
	PickerHeaderButton,
	DateTimePickerFooter,
	DateTimePickerHeader
} from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearOnBlur } from "../inputs/year-selector/year-selector-validation.utils.js";

const customMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PickerWithTimeButton = DateTimePickerDialog(DateTimePicker);

export function DateTimeTimeButton(): ReactElement {
	const referenceElement = useRef<HTMLButtonElement | null>(null);
	const handleClear = useRef<(() => void) | undefined>(undefined);
	const handleBack = useRef<(() => void) | undefined>(undefined);
	const handleOk = useRef<(() => void) | undefined>(undefined);

	const [showPicker, setShowPicker] = useState(false);
	const [value, setValue] = useState<Date | undefined>();
	const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

	const getReferenceElement = useCallback((ref: HTMLButtonElement | null): void => {
		referenceElement.current = ref;
	}, []);

	const onAccept = useCallback((value: Date): void => {
		setValue(value);
		setShowPicker(false);
	}, []);

	const onClose = useCallback((): void => {
		setShowPicker(false);
	}, []);

	const handleYearBlur = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
		setYearErrorMessage(validateYearOnBlur(ev, { min: 1900, max: new Date().getFullYear() }));
	}, []);

	const renderFooter = useCallback(
		(value?: Date, screen?: DateTimePickerProps.Screen, isYearMonthChanged?: boolean): ReactNode => {
			return (
				<DateTimePickerFooter>
					<DateTimePickerFooter.Action>
						{screen !== "date" && (
							<Button
								icon={<Icon>fast_rewind</Icon>}
								title="Back"
								onClick={(event) => {
									event.nativeEvent.stopImmediatePropagation();

									handleBack.current?.();
								}}
							/>
						)}
					</DateTimePickerFooter.Action>
					<DateTimePickerFooter.Action>
						<Button primary label="ok" onClick={handleOk.current} />
					</DateTimePickerFooter.Action>
					<DateTimePickerFooter.Action>
						{(value || isYearMonthChanged) && (
							<Button
								destructive
								icon={<Icon>delete</Icon>}
								title="Clear"
								onClick={(event) => {
									event.nativeEvent.stopImmediatePropagation();

									handleClear.current?.();
								}}
							/>
						)}
					</DateTimePickerFooter.Action>
				</DateTimePickerFooter>
			);
		},
		[]
	);

	const renderHeader = useCallback(
		(datetime?: Date) => {
			const pickerTitle = DateTimeUtils.formatDateTime(datetime, undefined, "dddd, DD/MM/YYYY");

			return (
				<DateTimePickerHeader
					actionButtons={
						provider.hasTouch() && <PickerHeaderButton icon={<Icon>clear</Icon>} title="Clear" onClick={onClose} />
					}
				>
					{pickerTitle}
				</DateTimePickerHeader>
			);
		},
		[onClose]
	);

	return (
		<div className="-u-width-full">
			<Button
				id="date-time-picker-customization-button"
				primary
				label="Edit Date Time"
				buttonRef={getReferenceElement}
				onClick={() => setShowPicker(true)}
			/>
			{showPicker && referenceElement.current && (
				<PickerWithTimeButton
					pickerProps={{
						id: "date-time-picker-customization",
						value: value,
						clear: (handler) => (handleClear.current = handler),
						back: (handler) => (handleBack.current = handler),
						ok: (handler) => (handleOk.current = handler),
						customFooterElement: renderFooter,
						onAccept,
						onClose,
						customHeaderElement: renderHeader,
						months: customMonths,
						onYearSelectorBlur: handleYearBlur,
						yearErrorMessage
					}}
					referenceElement={referenceElement.current}
				/>
			)}
			<div style={{ marginTop: 8 }}>Value is: {DateTimeUtils.toISOString(value)}</div>
		</div>
	);
}
