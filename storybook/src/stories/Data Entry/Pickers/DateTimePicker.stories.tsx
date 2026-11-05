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
import { useState, useCallback } from "react";
import { fn } from "storybook/test";

import { DateTimePicker } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearInput } from "../YearMonthSelector/utils/year-validation";

const meta: Meta<typeof DateTimePicker> = {
	title: "Data Entry/Pickers/DateTimePicker",
	component: DateTimePicker,
	parameters: {
		layout: "centered"
	},
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
		},
		timeRequired: {
			control: "boolean",
			description: "Specifies whether the time is mandatory."
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

export const Playground: Story = {
	args: {
		timeMode: "12h",
		yearSelectorVariant: "select"
	},
	render: function PlaygroundExample(args) {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-playground"
				value={value}
				onAccept={(date) => {
					setValue(date);
					args.onAccept?.(date);
				}}
			/>
		);
	}
};

export const YearSelectorTextbox: Story = {
	name: "Year selector as textbox",
	render: function YearSelectorTextboxExample(args) {
		const [value, setValue] = useState<Date | undefined>(new Date());
		const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

		const handleYearBlur = useCallback((event: FocusEvent<HTMLInputElement>): void => {
			setYearErrorMessage(validateYearInput(event.target.value));
		}, []);

		return (
			<DateTimePicker
				{...args}
				id="date-time-picker-textbox-year"
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
	},
	parameters: {
		docs: {
			description: {
				story:
					'`yearSelectorVariant="textbox"` renders the year as a free-text input. Combine `onYearSelectorBlur` with `yearErrorMessage` to validate the typed year and show an inline error.'
			}
		}
	}
};

export const YearSelectorVariants: Story = {
	name: "Year selector as select and autocomplete",
	render: function YearSelectorVariantsExample() {
		const [selectValue, setSelectValue] = useState<Date | undefined>(new Date());
		const [autocompleteValue, setAutocompleteValue] = useState<Date | undefined>(new Date());

		return (
			<div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
				<DateTimePicker
					id="date-time-picker-select-year"
					value={selectValue}
					yearSelectorVariant="select"
					yearRange={{ start: 2015, end: 2035 }}
					onAccept={setSelectValue}
				/>
				<DateTimePicker
					id="date-time-picker-autocomplete-year"
					value={autocompleteValue}
					yearSelectorVariant="autocomplete"
					yearRange={{ start: 2015, end: 2035 }}
					onAccept={setAutocompleteValue}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The `select` variant (left) renders a native dropdown, the `autocomplete` variant (right) a filterable combobox. `yearRange` limits the selectable years."
			}
		}
	}
};

export const With24hTimeMode: Story = {
	name: "With 24-hour time mode",
	render: function With24hTimeModeExample(args) {
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
	},
	parameters: {
		docs: {
			description: {
				story: '`timeMode="24h"` switches the time screen and clock face to the 24-hour format.'
			}
		}
	}
};

export const WithDisabledDates: Story = {
	name: "With disabled dates (weekends)",
	render: function WithDisabledDatesExample(args) {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"The `disabled` prop accepts react-day-picker `Matcher`s — here `{ dayOfWeek: [0, 6] }` disables all weekends."
			}
		}
	}
};

export const TimeRequired: Story = {
	name: "Time required",
	render: function TimeRequiredExample(args) {
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
	},
	parameters: {
		docs: {
			description: {
				story: "With `timeRequired`, a value can only be accepted after a time has been chosen in addition to the date."
			}
		}
	}
};
