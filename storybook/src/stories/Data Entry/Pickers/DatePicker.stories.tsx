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

import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearInput } from "../YearMonthSelector/utils/year-validation";

const meta: Meta<typeof DatePicker> = {
	title: "Data Entry/Pickers/DatePicker",
	component: DatePicker,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		yearSelectorVariant: {
			control: "select",
			options: ["select", "textbox", "autocomplete"],
			description: "Controls the rendering mode of the year selector in the calendar header. Defaults to `select`."
		},
		yearRange: {
			control: "object",
			description: "Override the year selection range shown in the calendar header."
		}
	},
	args: {
		onChange: fn()
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

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());
		const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

		const handleYearBlur = useCallback((event: FocusEvent<HTMLInputElement>): void => {
			setYearErrorMessage(validateYearInput(event.target.value));
		}, []);

		return (
			<DatePicker
				{...args}
				value={value}
				onChange={setValue}
				yearSelectorVariant="textbox"
				onYearSelectorBlur={handleYearBlur}
				yearErrorMessage={yearErrorMessage}
			/>
		);
	}
};

export const WithYearSelectorSelect: Story = {
	name: "With year selector as select",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return <DatePicker {...args} value={value} onChange={setValue} />;
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

		return <DatePicker {...args} value={value} onChange={setValue} />;
	},
	args: {
		yearSelectorVariant: "autocomplete",
		yearRange: { start: 2015, end: 2035 }
	}
};

export const DateRangePicker: Story = {
	name: "Date range picker",
	render: (args) => {
		const [range, setRange] = useState<DateRange | undefined>();

		return (
			<DatePicker
				{...args}
				selected={range ? { from: range.from, to: range.to } : undefined}
				onDateRangeChange={setRange}
				footer={{
					acceptLabel: "Apply",
					clearLabel: "Clear",
					onAccept: (r) => setRange(r),
					onClear: () => setRange(undefined)
				}}
			/>
		);
	}
};

export const WithDisabledDates: Story = {
	name: "With disabled dates (weekends)",
	render: (args) => {
		const [value, setValue] = useState<Date | undefined>(new Date());

		return <DatePicker {...args} value={value} onChange={setValue} disabled={{ dayOfWeek: [0, 6] }} />;
	}
};
