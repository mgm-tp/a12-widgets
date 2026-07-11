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
import { fn } from "storybook/test";
import { useState, useCallback } from "react";

import { YearSelector } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearInput } from "./utils/year-validation";

const meta: Meta<typeof YearSelector> = {
	title: "Data Entry/Pickers/YearSelector",
	component: YearSelector,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		year: {
			control: "number",
			description: "The selected year value"
		},
		variant: {
			control: "select",
			options: ["select", "textbox", "autocomplete"],
			description: "Controls the rendering mode. Auto-detected when omitted."
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when no year is selected"
		},
		label: {
			control: "text",
			description: "Label for the input field"
		},
		disabled: {
			control: "boolean",
			description: "Whether the selector is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the selector is read-only"
		}
	},
	args: {
		onYearChange: fn()
	},
	decorators: [
		(Story) => (
			<div style={{ width: "300px" }}>
				<Story />
			</div>
		)
	]
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default uses the auto-detected textbox variant (no yearRange supplied).
// Includes live year validation on blur.
export const Default: Story = {
	render: (args) => {
		const [year, setYear] = useState<number | undefined>(new Date().getFullYear());
		const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

		const handleYearBlur = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
			setYearErrorMessage(validateYearInput(ev.target.value));
		}, []);

		return (
			<div style={{ width: "300px" }}>
				<YearSelector
					{...args}
					year={year}
					errorMessage={yearErrorMessage}
					onYearChange={setYear}
					onBlur={handleYearBlur}
				/>
			</div>
		);
	},
	args: {
		label: "Year",
		placeholder: "YYYY"
	}
};

export const SelectVariant: Story = {
	name: "Select variant",
	render: (args) => {
		const [year, setYear] = useState<number | undefined>(2024);

		return (
			<div style={{ width: "300px" }}>
				<YearSelector {...args} year={year} onYearChange={setYear} />
			</div>
		);
	},
	args: {
		label: "Year (select)",
		variant: "select",
		yearRange: { start: 2015, end: 2030 }
	}
};

export const AutocompleteVariant: Story = {
	name: "Autocomplete variant",
	render: (args) => {
		const [year, setYear] = useState<number | undefined>(2024);

		return (
			<div style={{ width: "300px" }}>
				<YearSelector {...args} year={year} onYearChange={setYear} />
			</div>
		);
	},
	args: {
		label: "Year (autocomplete)",
		variant: "autocomplete",
		yearRange: { start: 2015, end: 2030 }
	}
};

export const AutocompleteRelativeRange: Story = {
	name: "Autocomplete with relative range",
	render: (args) => {
		const [year, setYear] = useState<number | undefined>(2024);

		return (
			<div style={{ width: "300px" }}>
				<YearSelector {...args} year={year} onYearChange={setYear} />
			</div>
		);
	},
	args: {
		label: "Year (±5 from selected)",
		variant: "autocomplete",
		yearRange: { startOffset: -5, endOffset: 5 }
	}
};

export const WithPlaceholder: Story = {
	name: "With placeholder",
	render: (args) => {
		const [year, setYear] = useState<number | undefined>(undefined);

		return (
			<div style={{ width: "300px" }}>
				<YearSelector {...args} year={year} onYearChange={setYear} />
			</div>
		);
	},
	args: {
		label: "Year",
		variant: "select",
		placeholder: "Select a year",
		yearRange: { start: 2015, end: 2030 }
	}
};

export const Disabled: Story = {
	args: {
		label: "Year",
		variant: "select",
		year: 2024,
		yearRange: { start: 2015, end: 2030 },
		disabled: true
	}
};

export const Readonly: Story = {
	args: {
		label: "Year",
		variant: "select",
		year: 2024,
		yearRange: { start: 2015, end: 2030 },
		readonly: true
	}
};

export const WithOptionalItem: Story = {
	name: "With optional item (select)",
	render: (args) => {
		const [year, setYear] = useState<number | undefined>(undefined);

		return (
			<div style={{ width: "300px" }}>
				<YearSelector {...args} year={year} onYearChange={setYear} />
			</div>
		);
	},
	args: {
		label: "Year",
		variant: "select",
		yearRange: { start: 2020, end: 2030 },
		optionalItem: { label: "All years" }
	}
};
