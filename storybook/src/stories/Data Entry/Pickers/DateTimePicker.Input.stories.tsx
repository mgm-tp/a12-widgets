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

import type { ReactNode, FocusEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useCallback, useRef, useEffect } from "react";

import {
	DateTimePicker,
	DateTimePickerInput,
	DateTimePickerDialog,
	DateTimePickerFooter,
	DateTimePickerHeader,
	DateTimeUtils,
	Button,
	Icon,
	PickerHeaderButton,
	provider
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { DateTimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearInput } from "../YearMonthSelector/utils/year-validation";

const DateTimePickerInputComponent = DateTimePickerInput(DateTimePicker);
const DateTimePickerWithDialog = DateTimePickerDialog(DateTimePicker);

const meta: Meta<typeof DateTimePicker> = {
	title: "Data Entry/Pickers/DateTimePicker/Input",
	component: DateTimePicker,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "Default (12h)",
	render: () => {
		const [acceptedDate, setAcceptedDate] = useState<Date | undefined>();
		const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

		const handleYearBlur = useCallback((event: FocusEvent<HTMLInputElement>): void => {
			setYearErrorMessage(validateYearInput(event.target.value));
		}, []);

		return (
			<div style={{ width: "360px" }}>
				<DateTimePickerInputComponent
					inputLabel="Date & Time"
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={
						{
							id: "dtp-input-default",
							value: acceptedDate,
							timeMode: "12h",
							yearSelectorVariant: "textbox",
							onYearSelectorBlur: handleYearBlur,
							yearErrorMessage,
							onAccept: setAcceptedDate
						} as DateTimePickerProps
					}
					helperText={acceptedDate ? `Selected: ${acceptedDate.toISOString()}` : "No date/time selected"}
				/>
			</div>
		);
	}
};

export const Basic: Story = {
	name: "Basic",
	render: () => {
		const BasicExample = () => {
			const [acceptedDatetime, setAcceptedDatetime] = useState<Date | undefined>();
			const [invalidValue, setInvalidValue] = useState("");
			const [value, setValue] = useState("");

			useEffect(() => {
				if (acceptedDatetime || value.trim() === "") {
					setInvalidValue("");
				}
			}, [acceptedDatetime, value]);

			return (
				<div style={{ width: 360 }}>
					<DateTimePickerInputComponent
						inputLabel="Date & Time Picker"
						placeholder="MM/DD/YYYY h:mm A"
						dateTimeInputFormat="MM/DD/YYYY h:mm A"
						pickerProps={{
							id: "date-time-picker-basic",
							value: acceptedDatetime,
							onAccept: setAcceptedDatetime
						}}
						inputErrorMessage={invalidValue ? `Invalid value: ${invalidValue}` : undefined}
						onInputChange={setValue}
						onInputValidationError={(v) => {
							setInvalidValue(v);
							setAcceptedDatetime(undefined);
						}}
						helperText={
							acceptedDatetime && value
								? `Selected: ${DateTimeUtils.toISOString(acceptedDatetime)}`
								: "No date and time selected yet."
						}
					/>
				</div>
			);
		};

		return <BasicExample />;
	}
};

export const With24hMode: Story = {
	name: "24-hour mode",
	render: () => {
		const [acceptedDate, setAcceptedDate] = useState<Date | undefined>();

		return (
			<div style={{ width: "360px" }}>
				<DateTimePickerInputComponent
					inputLabel="Date & Time (24h)"
					dateTimeInputFormat="MM/DD/YYYY H:mm"
					pickerProps={
						{
							id: "dtp-input-24h",
							value: acceptedDate,
							timeMode: "24h",
							onAccept: setAcceptedDate
						} as DateTimePickerProps
					}
					helperText={acceptedDate ? `Selected: ${acceptedDate.toISOString()}` : "No date/time selected"}
				/>
			</div>
		);
	}
};

export const WithYearSelectorAutocomplete: Story = {
	name: "With year selector as autocomplete",
	render: () => {
		const [acceptedDate, setAcceptedDate] = useState<Date | undefined>();

		return (
			<div style={{ width: "360px" }}>
				<DateTimePickerInputComponent
					inputLabel="Date & Time"
					dateTimeInputFormat="MM/DD/YYYY h:mm A"
					pickerProps={
						{
							id: "dtp-input-autocomplete-year",
							value: acceptedDate,
							timeMode: "12h",
							yearSelectorVariant: "autocomplete",
							yearRange: { start: 2015, end: 2035 },
							onAccept: setAcceptedDate
						} as DateTimePickerProps
					}
					helperText={acceptedDate ? `Selected: ${acceptedDate.toISOString()}` : "No date/time selected"}
				/>
			</div>
		);
	}
};

export const Disabled: Story = {
	render: () => (
		<div style={{ width: 360 }}>
			<DateTimePickerInputComponent
				inputLabel="Disabled Date & Time Picker"
				placeholder="MM/DD/YYYY h:mm A"
				disabled
				pickerProps={{ id: "date-time-picker-disabled" }}
			/>
		</div>
	)
};

export const Readonly: Story = {
	render: () => (
		<div style={{ width: "360px" }}>
			<DateTimePickerInputComponent
				inputLabel="Date & Time"
				readonly
				initialText="04/19/2026 2:30 PM"
				dateTimeInputFormat="MM/DD/YYYY h:mm A"
				pickerProps={
					{
						id: "dtp-input-readonly",
						timeMode: "12h"
					} as DateTimePickerProps
				}
			/>
		</div>
	)
};

export const TimeButton: Story = {
	name: "Time Button",
	render: () => {
		const TimeButtonExample = () => {
			const referenceElement = useRef<HTMLButtonElement | null>(null);
			const handleClear = useRef<(() => void) | undefined>(undefined);
			const handleBack = useRef<(() => void) | undefined>(undefined);
			const handleOk = useRef<(() => void) | undefined>(undefined);

			const [showPicker, setShowPicker] = useState(false);
			const [value, setValue] = useState<Date | undefined>();

			const onAccept = useCallback((date: Date) => {
				setValue(date);
				setShowPicker(false);
			}, []);

			const onClose = useCallback(() => setShowPicker(false), []);

			const renderFooter = useCallback(
				(_value?: Date, screen?: DateTimePickerProps.Screen, isYearMonthChanged?: boolean): ReactNode => (
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
							<Button primary label="OK" onClick={handleOk.current} />
						</DateTimePickerFooter.Action>
						<DateTimePickerFooter.Action>
							{(_value || isYearMonthChanged) && (
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
				),
				[]
			);

			const renderHeader = useCallback(
				(datetime?: Date): ReactNode => {
					const pickerTitle = DateTimeUtils.formatDateTime(datetime, undefined, "dddd, DD/MM/YYYY");

					return (
						<DateTimePickerHeader
							actionButtons={
								provider.hasTouch() && <PickerHeaderButton icon={<Icon>clear</Icon>} title="Close" onClick={onClose} />
							}
						>
							{pickerTitle}
						</DateTimePickerHeader>
					);
				},
				[onClose]
			);

			return (
				<div>
					<Button
						id="time-button-trigger"
						primary
						label="Edit Date Time"
						buttonRef={(ref) => {
							referenceElement.current = ref;
						}}
						onClick={() => setShowPicker(true)}
					/>
					{showPicker && referenceElement.current && (
						<DateTimePickerWithDialog
							pickerProps={{
								id: "date-time-picker-time-button",
								value,
								clear: (handler) => (handleClear.current = handler),
								back: (handler) => (handleBack.current = handler),
								ok: (handler) => (handleOk.current = handler),
								customFooterElement: renderFooter,
								onAccept,
								onClose,
								customHeaderElement: renderHeader
							}}
							referenceElement={referenceElement.current}
						/>
					)}
					<div style={{ marginTop: 8 }}>Value is: {DateTimeUtils.toISOString(value)}</div>
				</div>
			);
		};

		return <TimeButtonExample />;
	}
};
