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
import { useState, useCallback } from "react";
import { enUS } from "date-fns/locale";

import {
	DateTimePicker,
	DateTimePickerInput,
	DateTimePickerTimeInput,
	DateTimeContext,
	DateTimeUtils
} from "@com.mgmtp.a12.widgets/widgets-core";

import { useDateTimePickerState } from "./hooks";

const DateTimePickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);
const DateTimePickerField = DateTimePickerInput(DateTimePicker);

const meta: Meta<typeof DateTimePicker> = {
	title: "Data Entry/Pickers/DateTimePicker/Advanced",
	component: DateTimePicker,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ContextTimeMode: Story = {
	name: "Context Time Mode",
	render: () => {
		const ContextTimeModeExample = () => {
			const [date24h, setDate24h] = useState<Date | undefined>();
			const [date12h, setDate12h] = useState<Date | undefined>();

			return (
				<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
					<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 400 }}>
						<DateTimePickerWithTimeInput
							inputLabel="Date Time Picker using 24h mode from context"
							pickerProps={{ id: "context-time-mode-24h", value: date24h, onAccept: setDate24h }}
							dateTimeInputFormat="MM/DD/YYYY HH:mm"
						/>
						<DateTimePickerWithTimeInput
							inputLabel="Date Time Picker with prop override (12h) inside 24h context"
							pickerProps={{
								id: "context-time-mode-12h-override",
								value: date12h,
								onAccept: setDate12h,
								timeMode: "12h"
							}}
							dateTimeInputFormat="MM/DD/YYYY hh:mm A"
						/>
					</div>
				</DateTimeContext.Provider>
			);
		};

		return <ContextTimeModeExample />;
	}
};

export const CustomFormat: Story = {
	name: "Custom Format",
	render: () => {
		const CustomFormatExample = () => {
			const TIMEZONE = "America/New_York";
			const DATE_TIME_FORMAT = "DD-MM-YYYY HH.mm";

			const { accepted, setAccepted, onInputChange, onInputValidationError, inputErrorMessage } =
				useDateTimePickerState();

			const dateTimeFormatter = useCallback((dateTimeTZ?: Date): string => {
				if (!dateTimeTZ) {
					return "";
				}

				return DateTimeUtils.formatTimezoneDateTime({
					date: dateTimeTZ,
					timezone: TIMEZONE,
					dateTimeFormat: DATE_TIME_FORMAT
				});
			}, []);

			const dateTimeConverter = useCallback((inputValue: string): Date | undefined => {
				const dateTimeUTC = DateTimeUtils.parseDateTimeUTC(inputValue, DATE_TIME_FORMAT);

				if (!dateTimeUTC) {
					return undefined;
				}

				return DateTimeUtils.createTimezoneConverter(TIMEZONE).convertDate.toTimezone(dateTimeUTC);
			}, []);

			return (
				<div style={{ width: 360 }}>
					<DateTimePickerField
						inputLabel={`Custom format with ${TIMEZONE} timezone`}
						placeholder={DATE_TIME_FORMAT}
						pickerProps={{
							id: "date-time-picker-custom-format",
							value: accepted,
							onAccept: setAccepted,
							timezone: TIMEZONE
						}}
						dateTimeFormatter={dateTimeFormatter}
						dateTimeConverter={dateTimeConverter}
						inputErrorMessage={inputErrorMessage}
						onInputChange={onInputChange}
						onInputValidationError={onInputValidationError}
						helperText={
							accepted
								? `Selected: ${DateTimeUtils.toISOString(accepted, TIMEZONE)}`
								: `Enter date in ${DATE_TIME_FORMAT} format.`
						}
					/>
				</div>
			);
		};

		return <CustomFormatExample />;
	}
};

export const Accessibility: Story = {
	name: "Accessibility",
	render: () => {
		const AccessibilityExample = () => {
			const { accepted, setAccepted, onInputChange, onInputValidationError, inputErrorMessage } =
				useDateTimePickerState();

			return (
				<div style={{ width: 360 }}>
					<DateTimePickerField
						inputLabel="Accessible Date Time Picker"
						placeholder="MM/DD/YYYY h:mm A"
						dateTimeInputFormat="MM/DD/YYYY h:mm A"
						pickerProps={{
							id: "accessibility-date-time-picker",
							value: accepted,
							onAccept: setAccepted,
							desktopPickerAttributes: { "aria-label": "Desktop Accessible Date Time Picker" },
							mobilePickerAttributes: { "aria-label": "Mobile Accessible Date Time Picker" }
						}}
						inputErrorMessage={inputErrorMessage}
						onInputChange={onInputChange}
						onInputValidationError={onInputValidationError}
						helperText={
							accepted
								? `Selected: ${DateTimeUtils.toISOString(accepted)}`
								: "Open the picker to see accessibility attributes in action."
						}
					/>
				</div>
			);
		};

		return <AccessibilityExample />;
	}
};
