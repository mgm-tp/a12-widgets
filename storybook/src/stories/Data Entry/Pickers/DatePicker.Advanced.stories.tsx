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
import { useState, useEffect, useCallback, useMemo } from "react";
import { de } from "date-fns/locale/de";
import { TZDate } from "@date-fns/tz/date";
import { isAfter } from "date-fns";

import type { DateRange as DateRangeType } from "@com.mgmtp.a12.widgets/widgets-core";
import { DateInput, DateTimeUtils, DateTimeContext } from "@com.mgmtp.a12.widgets/widgets-core";

const DATE_FORMAT = "MM/DD/YYYY";

function formatDate(date: Date, timezone?: string): string {
	return DateTimeUtils.formatTimezoneDateTime({ date, timezone, dateTimeFormat: "L" });
}

function convertDate(value: string, timezone?: string): Date | undefined {
	const parsed = DateTimeUtils.parseDateTimeUTC(value, DATE_FORMAT);

	if (!parsed) {
		return undefined;
	}

	return DateTimeUtils.createTimezoneConverter(timezone).convertDate.toTimezone(parsed);
}

const meta: Meta<typeof DateInput> = {
	title: "Data Entry/Pickers/DatePicker/Advanced",
	component: DateInput,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AdditionalProperties: Story = {
	name: "Additional Properties",
	render: () => {
		const AdditionalPropsExample = () => {
			const [selectedDate, setSelectedDate] = useState<Date | undefined>();
			const [value, setValue] = useState("");
			const [invalidValue, setInvalidValue] = useState("");

			useEffect(() => {
				if (selectedDate || value.trim() === "") {
					setInvalidValue("");
				}
			}, [selectedDate, value]);

			const highlightedDay = useCallback((day: Date) => day.getDate() === 20, []);
			const bookedDays = useCallback((day: Date) => day.getDate() === 23, []);

			const highlightedDayStyle = useMemo(() => ({ backgroundColor: "rgb(255, 181, 128)" }), []);
			const bookedStyle = useMemo(() => ({ border: "2px solid currentColor" }), []);

			return (
				<DateTimeContext.Provider value={{ locale: de }}>
					<div style={{ width: 320 }}>
						<DateInput
							id="date-picker-additional-props"
							label="Custom with datePickerProps"
							placeholder={DATE_FORMAT}
							dateFormatter={formatDate}
							dateConverter={convertDate}
							onSelectedDayChange={setSelectedDate}
							onInputChange={setValue}
							onInputValidationError={(v) => {
								setInvalidValue(v);
								setSelectedDate(undefined);
							}}
							errorMessage={
								invalidValue ? `Invalid date: ${invalidValue}. Please use the format ${DATE_FORMAT}.` : undefined
							}
							datePickerProps={{
								disabled: [{ dayOfWeek: [0, 6] }],
								modifiers: { highlightedDay, booked: bookedDays },
								modifiersStyles: { booked: bookedStyle, highlightedDay: highlightedDayStyle },
								modifiersClassNames: { booked: "booked-classname" },
								yearRange: { start: 1990, end: 2025 }
							}}
							helperText={
								selectedDate
									? `Selected: ${DateTimeUtils.toISOString(selectedDate)}`
									: "Weekends disabled. Day 20 is highlighted, day 23 is booked."
							}
						/>
					</div>
				</DateTimeContext.Provider>
			);
		};

		return <AdditionalPropsExample />;
	}
};

export const DateRange: Story = {
	name: "Date Range",
	render: () => {
		const DateRangeExample = () => {
			const [range, setRange] = useState<DateRangeType | undefined>();
			const [value, setValue] = useState("");
			const [invalidValue, setInvalidValue] = useState("");

			useEffect(() => {
				if (range || value.trim() === "") {
					setInvalidValue("");
				}
			}, [range, value]);

			const errorMessage = useMemo(
				() =>
					invalidValue
						? `Invalid date: ${invalidValue}. Please enter the correct format ${DATE_FORMAT} - ${DATE_FORMAT}.`
						: undefined,
				[invalidValue]
			);

			const dateRangeFormatter = useCallback(
				(date: Date) => DateTimeUtils.formatTimezoneDateTime({ date, dateTimeFormat: DATE_FORMAT }),
				[]
			);

			const dateRangeConverter = useCallback((dateString: string) => {
				const parts = dateString.split(" - ");
				const fromDate = DateTimeUtils.parseDateTimeUTC(parts[0], DATE_FORMAT);
				const toDate = parts[1] ? DateTimeUtils.parseDateTimeUTC(parts[1], DATE_FORMAT) : undefined;

				if (!fromDate || !toDate || isAfter(fromDate, toDate)) {
					return undefined;
				}

				return DateTimeUtils.createTimezoneConverter().convertDateRange.toTimezone({
					from: fromDate,
					to: toDate
				});
			}, []);

			const chosenDate = useMemo(
				() =>
					range?.from && range.to
						? `${DateTimeUtils.toISOString(range.from)} - ${DateTimeUtils.toISOString(range.to)}`
						: undefined,
				[range?.from, range?.to]
			);

			return (
				<div style={{ width: 480 }}>
					<DateInput
						id="date-range-picker"
						label="Date Range Picker"
						useRangePicker
						dateFormatter={dateRangeFormatter}
						dateConverter={dateRangeConverter}
						datePickerProps={{
							disabled: [{ dayOfWeek: [0, 6] }],
							footer: { acceptLabel: "OK", clearLabel: "Clear", onAccept: setRange }
						}}
						datePickerDialogProps={{ okLabel: "OK", clearLabel: "Clear", title: "Set a range" }}
						errorMessage={errorMessage}
						placeholder={`${DATE_FORMAT} - ${DATE_FORMAT}`}
						onInputChange={setValue}
						onInputValidationError={setInvalidValue}
						helperText={
							chosenDate ? (
								<>
									Chosen range: <em>{chosenDate}</em>
								</>
							) : (
								"You haven't chosen a date range yet."
							)
						}
					/>
				</div>
			);
		};

		return <DateRangeExample />;
	}
};

export const Timezone: Story = {
	name: "Timezone",
	render: () => {
		const negativeOffsetTimeZone = "America/New_York";
		const positiveOffsetTimezone = "Europe/Berlin";

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
				<DateInput
					id="negative-timezone-date-picker"
					label={`Timezone: ${negativeOffsetTimeZone}`}
					placeholder={DATE_FORMAT}
					defaultValue={TZDate.tz(negativeOffsetTimeZone)}
					dateFormatter={(date) => formatDate(date, negativeOffsetTimeZone)}
					dateConverter={(value) => convertDate(value, negativeOffsetTimeZone)}
					datePickerProps={{ timezone: negativeOffsetTimeZone }}
				/>
				<DateInput
					id="positive-timezone-date-picker"
					label={`Timezone: ${positiveOffsetTimezone}`}
					placeholder={DATE_FORMAT}
					defaultValue={TZDate.tz(positiveOffsetTimezone)}
					dateFormatter={(date) => formatDate(date, positiveOffsetTimezone)}
					dateConverter={(value) => convertDate(value, positiveOffsetTimezone)}
					datePickerProps={{ timezone: positiveOffsetTimezone }}
				/>
			</div>
		);
	}
};

export const Accessibility: Story = {
	name: "Accessibility",
	render: () => (
		<div style={{ width: 320 }}>
			<DateInput
				id="accessibility-date-picker"
				label="Accessible Date Picker"
				placeholder={DATE_FORMAT}
				dateFormatter={formatDate}
				dateConverter={convertDate}
				helperText="Open the calendar to see accessibility attributes in action."
				datePickerProps={{ "aria-label": "Desktop Accessible Date Picker" }}
				datePickerDialogProps={{ htmlAttributes: { "aria-label": "Mobile Accessible Date Picker" } }}
			/>
		</div>
	)
};
