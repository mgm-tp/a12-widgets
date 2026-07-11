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
import type { FocusEvent } from "react";
import { useState, useCallback, useMemo } from "react";

import { DateInput, DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearInput } from "../YearMonthSelector/utils/year-validation";

const DATE_FORMAT = "MM/DD/YYYY";

function makeDateFormatter(timezone?: string) {
	return (date: Date) => DateTimeUtils.formatTimezoneDateTime({ date, timezone, dateTimeFormat: "L" });
}

function makeDateConverter(timezone?: string) {
	return (value: string): Date | undefined => {
		const parsed = DateTimeUtils.parseDateTimeUTC(value, DATE_FORMAT);

		if (!parsed) {
			return undefined;
		}

		return DateTimeUtils.createTimezoneConverter(timezone).convertDate.toTimezone(parsed);
	};
}

const meta: Meta<typeof DateInput> = {
	title: "Data Entry/Pickers/DatePicker/Input",
	component: DateInput,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
			description: "Whether the date picker input is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the date picker input is read-only"
		},
		hidePickerButton: {
			control: "boolean",
			description: "When true, the calendar button is hidden"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [selectedDate, setSelectedDate] = useState<Date | undefined>();
		const [invalidValue, setInvalidValue] = useState("");
		const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

		const dateFormatter = useMemo(() => makeDateFormatter(), []);
		const dateConverter = useMemo(() => makeDateConverter(), []);

		const errorMessage = invalidValue ? `Invalid date: ${invalidValue}` : undefined;

		const handleYearBlur = useCallback((event: FocusEvent<HTMLInputElement>): void => {
			setYearErrorMessage(validateYearInput(event.target.value));
		}, []);

		return (
			<div style={{ width: "360px" }}>
				<DateInput
					id="date-input-default"
					label="Date"
					placeholder={DATE_FORMAT}
					dateFormatter={dateFormatter}
					dateConverter={dateConverter}
					errorMessage={errorMessage}
					datePickerProps={{
						yearSelectorVariant: "textbox",
						onYearSelectorBlur: handleYearBlur,
						yearErrorMessage
					}}
					onSelectedDayChange={setSelectedDate}
					onInputValidationError={setInvalidValue}
					helperText={selectedDate ? `Selected: ${DateTimeUtils.toISOString(selectedDate)}` : "No date selected"}
				/>
			</div>
		);
	}
};

export const Basic: Story = {
	name: "Basic",
	render: () => {
		const BasicExample = () => {
			const [selectedDate, setSelectedDate] = useState<Date | undefined>();

			return (
				<div style={{ width: 320 }}>
					<DateInput
						id="date-picker-basic"
						label="Date Picker"
						placeholder={DATE_FORMAT}
						dateFormatter={makeDateFormatter()}
						dateConverter={makeDateConverter()}
						datePickerDialogProps={{ okLabel: "OK", title: "Select a date" }}
						onSelectedDayChange={setSelectedDate}
						helperText={
							selectedDate ? `Selected: ${DateTimeUtils.toISOString(selectedDate) ?? ""}` : "No date selected yet."
						}
					/>
				</div>
			);
		};

		return <BasicExample />;
	}
};

export const Disabled: Story = {
	render: () => (
		<div style={{ width: 320 }}>
			<DateInput
				id="date-picker-disabled"
				label="Disabled Date Picker"
				placeholder={DATE_FORMAT}
				dateFormatter={makeDateFormatter()}
				dateConverter={makeDateConverter()}
				disabled
			/>
		</div>
	)
};

export const Readonly: Story = {
	render: () => (
		<div style={{ width: 320 }}>
			<DateInput
				id="date-picker-readonly"
				label="Readonly Date Picker"
				placeholder={DATE_FORMAT}
				defaultValue={new Date(2026, 3, 19)}
				dateFormatter={makeDateFormatter()}
				dateConverter={makeDateConverter()}
				readonly
			/>
		</div>
	)
};

export const InputOnly: Story = {
	name: "Input Only (no picker button)",
	render: () => (
		<div style={{ width: 320 }}>
			<DateInput
				id="date-picker-no-button"
				label="Date Input (no picker button)"
				placeholder={DATE_FORMAT}
				dateFormatter={makeDateFormatter()}
				dateConverter={makeDateConverter()}
				hidePickerButton
				helperText={`Type a date directly in ${DATE_FORMAT} format.`}
			/>
		</div>
	)
};

export const WithYearSelectorAutocomplete: Story = {
	name: "With year selector as autocomplete",
	render: () => {
		const [selectedDate, setSelectedDate] = useState<Date | undefined>();
		const [invalidValue, setInvalidValue] = useState("");

		const dateFormatter = useMemo(() => makeDateFormatter(), []);
		const dateConverter = useMemo(() => makeDateConverter(), []);

		const errorMessage = invalidValue ? `Invalid date: ${invalidValue}` : undefined;

		return (
			<div style={{ width: "360px" }}>
				<DateInput
					id="date-input-autocomplete"
					label="Date"
					placeholder={DATE_FORMAT}
					dateFormatter={dateFormatter}
					dateConverter={dateConverter}
					errorMessage={errorMessage}
					datePickerProps={{
						yearSelectorVariant: "autocomplete",
						yearRange: { start: 2015, end: 2035 }
					}}
					onSelectedDayChange={setSelectedDate}
					onInputValidationError={setInvalidValue}
					helperText={selectedDate ? `Selected: ${DateTimeUtils.toISOString(selectedDate)}` : "No date selected"}
				/>
			</div>
		);
	}
};

export const WithError: Story = {
	name: "With error message",
	render: () => {
		const dateFormatter = useMemo(() => makeDateFormatter(), []);
		const dateConverter = useMemo(() => makeDateConverter(), []);

		return (
			<div style={{ width: "360px" }}>
				<DateInput
					id="date-input-error"
					label="Date"
					placeholder={DATE_FORMAT}
					errorMessage="Please enter a valid date"
					dateFormatter={dateFormatter}
					dateConverter={dateConverter}
				/>
			</div>
		);
	}
};

export const DateRangePicker: Story = {
	name: "Date range picker",
	render: () => {
		const [invalidValue, setInvalidValue] = useState("");

		const dateConverter = useCallback((value: string): DateRange | undefined => {
			const parts = value.split(" - ");

			if (parts.length !== 2) {
				return undefined;
			}

			const from = DateTimeUtils.parseDateTimeUTC(parts[0].trim(), DATE_FORMAT);
			const to = DateTimeUtils.parseDateTimeUTC(parts[1].trim(), DATE_FORMAT);

			if (!from || !to) {
				return undefined;
			}

			return { from, to };
		}, []);

		const errorMessage = invalidValue ? `Invalid date range: ${invalidValue}` : undefined;

		return (
			<div style={{ width: "360px" }}>
				<DateInput
					id="date-input-range"
					label="Date Range"
					placeholder={`${DATE_FORMAT} - ${DATE_FORMAT}`}
					useRangePicker
					dateFormatter={(date) => DateTimeUtils.formatTimezoneDateTime({ date, dateTimeFormat: "L" })}
					dateConverter={dateConverter}
					errorMessage={errorMessage}
					onInputValidationError={setInvalidValue}
					datePickerProps={{
						footer: {
							acceptLabel: "Apply",
							clearLabel: "Clear"
						}
					}}
				/>
			</div>
		);
	}
};
