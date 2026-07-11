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
import { fn } from "storybook/test";
import type { FocusEvent } from "react";
import { useState, useCallback } from "react";

import { DateTimePicker } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearInput } from "../YearMonthSelector/utils/year-validation";

const meta: Meta<typeof DateTimePicker> = {
	title: "Data Entry/Pickers/DateTimePicker",
	component: DateTimePicker,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		timeMode: {
			control: "select",
			options: ["12h", "24h"],
			description: "Whether the clock displays in 12-hour or 24-hour mode."
		},
		yearSelectorVariant: {
			control: "select",
			options: ["select", "textbox", "autocomplete"],
			description: "Controls the rendering mode of the year selector in the calendar header."
		},
		initialScreen: {
			control: "select",
			options: ["date", "time", "hour", "minute"],
			description: "The initial screen shown when the picker opens."
		}
	},
	args: {
		onChange: fn(),
		onAccept: fn(),
		onClose: fn()
	},
	decorators: [
		(Story) => (
			<div style={{ minWidth: "320px" }}>
				<Story />
			</div>
		)
	]
};

export default meta;
type Story = StoryObj<typeof meta>;
// Default uses the textbox variant (no yearRange supplied).
// Includes live year validation on blur.
export const Default: Story = {
	name: "Default (12h time)",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());
		const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

		const handleYearBlur = useCallback((event: FocusEvent<HTMLInputElement>): void => {
			setYearErrorMessage(validateYearInput(event.target.value));
		}, []);

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-default"
				value={value}
				yearSelectorVariant="textbox"
				onYearSelectorBlur={handleYearBlur}
				yearErrorMessage={yearErrorMessage}
				onAccept={(date) => {
					setValue(date);
					args.onAccept?.(date);
				}}
			/>
		);
	}
};

export const With24hTimeMode: Story = {
	name: "With 24-hour time mode",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-24h"
				value={value}
				timeMode="24h"
				onAccept={(date) => {
					setValue(date);
					args.onAccept?.(date);
				}}
			/>
		);
	},
	args: {
		timeMode: "24h"
	}
};

export const WithYearSelectorSelect: Story = {
	name: "With year selector as select",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-select-year"
				value={value}
				yearSelectorVariant="select"
				yearRange={{ start: 2015, end: 2035 }}
				onAccept={(date) => {
					setValue(date);
					args.onAccept?.(date);
				}}
			/>
		);
	},
	args: {
		yearSelectorVariant: "select",
		yearRange: { start: 2015, end: 2035 }
	}
};

export const WithYearSelectorAutocomplete: Story = {
	name: "With year selector as autocomplete",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-autocomplete-year"
				value={value}
				yearSelectorVariant="autocomplete"
				yearRange={{ start: 2015, end: 2035 }}
				onAccept={(date) => {
					setValue(date);
					args.onAccept?.(date);
				}}
			/>
		);
	},
	args: {
		yearSelectorVariant: "autocomplete",
		yearRange: { start: 2015, end: 2035 }
	}
};

export const WithDisabledDates: Story = {
	name: "With disabled dates (weekends)",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-disabled-dates"
				value={value}
				disabled={{ dayOfWeek: [0, 6] }}
				onAccept={(date) => {
					setValue(date);
					args.onAccept?.(date);
				}}
			/>
		);
	}
};

export const TimeRequired: Story = {
	name: "Time required",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-time-required"
				value={value}
				timeRequired
				onAccept={(date) => {
					setValue(date);
					args.onAccept?.(date);
				}}
			/>
		);
	},
	args: {
		timeRequired: true
	}
};
