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

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useCallback, useMemo } from "react";
import { de } from "date-fns/locale/de";

import {
	DateTimePicker,
	DateTimePickerInput,
	DateTimePickerTimeInput,
	DateTimeContext,
	DateTimeUtils
} from "@com.mgmtp.a12.widgets/widgets-core";

import { useDateTimePickerState } from "./hooks";

const DateTimePickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);

const meta: Meta<typeof DateTimePicker> = {
	title: "Data Entry/Pickers/DateTimePickerInput",
	component: DateTimePicker,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TimeInput: Story = {
	name: "Time Input",
	render: () => {
		const TimeInputExample = () => {
			const { accepted, setAccepted, onInputChange, onInputValidationError, inputErrorMessage } =
				useDateTimePickerState();

			return (
				<div style={{ width: 360 }}>
					<DateTimePickerWithTimeInput
						inputLabel="Date Time Picker with Time Input"
						placeholder="MM/DD/YYYY h:mm A"
						dateTimeInputFormat="MM/DD/YYYY h:mm A"
						pickerProps={{
							id: "date-time-picker-time-input",
							value: accepted,
							invalidInputMessage: "Invalid time",
							onAccept: setAccepted,
							disabled: { dayOfWeek: [0, 6] }
						}}
						inputErrorMessage={inputErrorMessage}
						onInputChange={onInputChange}
						onInputValidationError={onInputValidationError}
						helperText={
							accepted ? `Selected: ${DateTimeUtils.toISOString(accepted)}` : "You haven't chosen a date and time yet."
						}
					/>
				</div>
			);
		};

		return <TimeInputExample />;
	}
};

export const Timezone: Story = {
	name: "Timezone",
	render: () => {
		const TimezoneExample = () => {
			const negativeOffsetTimezone = "America/New_York";
			const positiveOffsetTimezone = "Europe/Berlin";

			const [positiveDateTime, setPositiveDateTime] = useState<Date | undefined>(new Date("04/22/2025 11:30 AM"));
			const [negativeDateTime, setNegativeDateTime] = useState<Date | undefined>(new Date("04/22/2025 11:30 AM"));
			const [invalidPositive, setInvalidPositive] = useState("");
			const [invalidNegative, setInvalidNegative] = useState("");

			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 400 }}>
					<DateTimePickerWithTimeInput
						inputLabel={`Timezone: ${positiveOffsetTimezone}`}
						dateTimeInputFormat="MM/DD/YYYY h:mm A"
						pickerProps={{
							id: "dt-picker-berlin",
							value: positiveDateTime,
							onAccept: setPositiveDateTime,
							timezone: positiveOffsetTimezone
						}}
						inputErrorMessage={invalidPositive || undefined}
						onInputValidationError={(v) => {
							setInvalidPositive(`Invalid value: ${v}`);
							setPositiveDateTime(undefined);
						}}
						helperText={positiveDateTime ? `ISO: ${DateTimeUtils.toISOString(positiveDateTime)}` : undefined}
					/>
					<DateTimePickerWithTimeInput
						inputLabel={`Timezone: ${negativeOffsetTimezone}`}
						dateTimeInputFormat="MM/DD/YYYY h:mm A"
						pickerProps={{
							id: "dt-picker-newyork",
							value: negativeDateTime,
							onAccept: setNegativeDateTime,
							timezone: negativeOffsetTimezone
						}}
						inputErrorMessage={invalidNegative || undefined}
						onInputValidationError={(v) => {
							setInvalidNegative(`Invalid value: ${v}`);
							setNegativeDateTime(undefined);
						}}
						helperText={negativeDateTime ? `ISO: ${DateTimeUtils.toISOString(negativeDateTime)}` : undefined}
					/>
				</div>
			);
		};

		return <TimezoneExample />;
	}
};

export const AdditionalProperties: Story = {
	name: "Additional Properties",
	render: () => {
		const AdditionalPropsExample = () => {
			const { accepted, setAccepted, onInputChange, onInputValidationError, inputErrorMessage } =
				useDateTimePickerState();

			const highlightedDay = useCallback((day: Date) => day.getDate() === 20, []);
			const bookedDays = useCallback((day: Date) => day.getDate() === 23, []);
			const highlightedDayStyle = useMemo(() => ({ backgroundColor: "rgb(255, 181, 128)" }), []);
			const bookedStyle = useMemo(() => ({ border: "2px solid currentColor" }), []);

			return (
				<DateTimeContext.Provider value={{ locale: de }}>
					<div style={{ width: 360 }}>
						<DateTimePickerWithTimeInput
							inputLabel="Custom modifiers"
							dateTimeInputFormat="MM/DD/YYYY h:mm A"
							pickerProps={{
								id: "date-time-picker-additional-props",
								value: accepted,
								onAccept: setAccepted,
								disabled: [{ before: new Date() }, { dayOfWeek: [0, 6] }],
								modifiers: { highlightedDay, booked: bookedDays },
								modifiersStyles: { booked: bookedStyle, highlightedDay: highlightedDayStyle },
								modifiersClassNames: { booked: "booked-classname" },
								yearRange: { start: 1990, end: 2025 }
							}}
							inputErrorMessage={inputErrorMessage}
							onInputChange={onInputChange}
							onInputValidationError={onInputValidationError}
							helperText={
								accepted
									? `Selected: ${DateTimeUtils.toISOString(accepted)}`
									: "Weekends and past days disabled. Day 20 highlighted, day 23 booked."
							}
						/>
					</div>
				</DateTimeContext.Provider>
			);
		};

		return <AdditionalPropsExample />;
	}
};
