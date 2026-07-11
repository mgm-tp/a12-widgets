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
import { useState } from "react";
import { fn } from "storybook/test";

import { YearMonthSelector } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof YearMonthSelector> = {
	title: "Data Entry/YearMonthSelector",
	component: YearMonthSelector,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		year: {
			control: "number",
			description: "The currently selected year"
		},
		month: {
			control: "number",
			description: "The currently selected month (0–11, where 0 = January)"
		},
		months: {
			control: "object",
			description: "Custom month name labels (array of 12 strings)"
		},
		yearRange: {
			control: "object",
			description: "Override for the available year range ({ start, end })"
		},
		disabled: {
			control: "boolean",
			description: "Whether the selectors are disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the selectors are read-only"
		},
		invalidComponent: {
			control: "select",
			options: ["year", "month", "both"],
			description: "Which selector(s) should display as invalid"
		}
	},
	args: {
		onValueChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "default-year-month-selector",
		label: "Year Month Selector",
		hiddenLabels: { yearLabel: "Year", monthLabel: "Month" }
	}
};

export const WithPreselectedValue: Story = {
	args: {
		id: "preselected-year-month-selector",
		label: "Year Month Selector (pre-selected)",
		year: 2024,
		month: 5,
		hiddenLabels: { yearLabel: "Year", monthLabel: "Month" }
	}
};

export const WithCustomMonths: Story = {
	args: {
		id: "custom-months-selector",
		label: "Year Month Selector with Custom Month Names",
		year: 2026,
		month: 0,
		months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		hiddenLabels: { yearLabel: "Year", monthLabel: "Month" }
	}
};

export const WithCustomYearRange: Story = {
	args: {
		id: "year-range-selector",
		label: "Year Month Selector (2020–2030 only)",
		year: 2025,
		month: 3,
		yearRange: { start: 2020, end: 2030 },
		hiddenLabels: { yearLabel: "Year", monthLabel: "Month" }
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-year-month-selector",
		label: "Disabled Year Month Selector",
		year: 2024,
		month: 6,
		disabled: true,
		hiddenLabels: { yearLabel: "Year", monthLabel: "Month" }
	}
};

export const WithValidationError: Story = {
	args: {
		id: "invalid-year-month-selector",
		label: "Year Month Selector with Validation Error",
		year: 2024,
		month: 0,
		error: true,
		errorMessage: "Please select a valid year and month.",
		invalidComponent: "both",
		hiddenLabels: { yearLabel: "Year", monthLabel: "Month" }
	}
};

export const Controlled: Story = {
	render: () => {
		const ControlledExample = () => {
			const [month, setMonth] = useState<number | undefined>(new Date().getMonth());
			const [year, setYear] = useState<number | undefined>(new Date().getFullYear());

			return (
				<div>
					<YearMonthSelector
						id="controlled-year-month-selector"
						label="Controlled Year Month Selector"
						year={year}
						month={month}
						onValueChange={(m, y) => {
							setMonth(m);
							setYear(y);
						}}
						hiddenLabels={{ yearLabel: "Year", monthLabel: "Month" }}
					/>
					<p style={{ marginTop: 12 }}>
						Selected: <strong>{year ?? "—"}</strong> / <strong>{month !== undefined ? month + 1 : "—"}</strong>
					</p>
				</div>
			);
		};

		return <ControlledExample />;
	}
};
