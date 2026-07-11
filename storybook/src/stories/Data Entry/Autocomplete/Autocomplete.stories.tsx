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
import { fn } from "storybook/test";

import { Autocomplete } from "@com.mgmtp.a12.widgets/widgets-core";

const LANGUAGES = [
	"Java",
	"Groovy",
	"JavaScript",
	"TypeScript",
	"C++",
	"C",
	"Scala",
	"Python",
	"PHP",
	"ActionScript",
	"AppleScript",
	"Clojure",
	"COBOL",
	"BASIC",
	"Erlang",
	"Fortran",
	"Haskell",
	"Lisp",
	"Perl",
	"Ruby",
	"Scheme"
];

const meta: Meta<typeof Autocomplete> = {
	title: "Data Entry/Autocomplete",
	component: Autocomplete,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Label displayed above the autocomplete input"
		},
		inputPlaceHolder: {
			control: "text",
			description: "Placeholder text shown in the input field"
		},
		hintTemplate: {
			control: "text",
			description: 'Template for the hint text, e.g. "{count} matches"'
		},
		disabled: {
			control: "boolean",
			description: "Disables the autocomplete input"
		},
		readonly: {
			control: "boolean",
			description: "Makes the autocomplete input read-only"
		},
		caseSensitive: {
			control: "boolean",
			description: "Only match items with corresponding case when true"
		},
		allowAddingNewItem: {
			control: "boolean",
			description: "Allow the user to enter and submit a value not in the list"
		},
		enableClearButton: {
			control: "boolean",
			description: "Show a clear button to reset the current value"
		},
		openOnFocus: {
			control: "boolean",
			description: "Open the dropdown when the input receives focus"
		},
		loading: {
			control: "boolean",
			description: "Show a progress indicator while items are loading"
		},
		errorMessage: {
			control: "text",
			description: "Error message shown below the input"
		},
		warningMessage: {
			control: "text",
			description: "Warning message shown below the input"
		},
		infoMessage: {
			control: "text",
			description: "Info message shown below the input"
		}
	},
	args: {
		onValueChange: fn(),
		onSearch: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const DefaultAutocomplete = () => {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<div style={{ width: 400 }}>
					<Autocomplete
						id="autocomplete-default"
						label="Programming Language"
						inputPlaceHolder="Please select or start typing"
						hintTemplate="{count} matches"
						items={LANGUAGES}
						value={value}
						onValueChange={(v) => setValue(v as string)}
					/>
				</div>
			);
		};

		return <DefaultAutocomplete />;
	}
};

export const WithInitialValue: Story = {
	render: () => {
		const AutocompleteWithInitial = () => {
			const [value, setValue] = useState<string | undefined>("Groovy");

			return (
				<div style={{ width: 400 }}>
					<Autocomplete
						id="autocomplete-initial"
						label="Programming Language"
						inputPlaceHolder="Please select or start typing"
						hintTemplate="{count} matches"
						items={LANGUAGES}
						initialValue="Groovy"
						value={value}
						onValueChange={(v) => setValue(v as string)}
					/>
				</div>
			);
		};

		return <AutocompleteWithInitial />;
	}
};

export const AllowAddingNewItem: Story = {
	render: () => {
		const AutocompleteAddItem = () => {
			const [value, setValue] = useState<string | undefined>(undefined);
			const [items, setItems] = useState<string[]>(LANGUAGES);

			const handleValueChange = useCallback(
				(newValue: string): void => {
					if (newValue !== "" && !items.includes(newValue)) {
						setItems((prev) => [...prev, newValue]);
					}

					setValue(newValue);
				},
				[items]
			);

			return (
				<div style={{ width: 400 }}>
					<Autocomplete
						id="autocomplete-add-item"
						label="Programming Language"
						inputPlaceHolder="Type to search or add a new entry"
						hintTemplate="{count} matches"
						items={items}
						value={value}
						onValueChange={(v) => handleValueChange(v as string)}
						allowAddingNewItem
						helperText="Type a new language name and press Enter to add it"
					/>
				</div>
			);
		};

		return <AutocompleteAddItem />;
	}
};

export const WithoutClearButton: Story = {
	render: () => {
		const AutocompleteNoClear = () => {
			const [value, setValue] = useState<string | undefined>("Python");

			return (
				<div style={{ width: 400 }}>
					<Autocomplete
						id="autocomplete-no-clear"
						label="Programming Language"
						inputPlaceHolder="Please select or start typing"
						hintTemplate="{count} matches"
						items={LANGUAGES}
						initialValue="Python"
						value={value}
						onValueChange={(v) => setValue(v as string)}
						enableClearButton={false}
					/>
				</div>
			);
		};

		return <AutocompleteNoClear />;
	}
};
