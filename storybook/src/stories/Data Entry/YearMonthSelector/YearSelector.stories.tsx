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

import { HintTooltip, YearSelector } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearInput } from "./utils/year-validation";

const meta: Meta<typeof YearSelector> = {
	title: "Data Entry/Pickers/YearSelector",
	component: YearSelector,
	parameters: {
		layout: "centered"
	},
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
		yearRange: {
			control: "object",
			description:
				"Range of selectable years — absolute (`{ start, end }`) or relative offsets (`{ startOffset, endOffset }`). Ignored for the `textbox` variant."
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
		},
		messagePosition: {
			control: "select",
			options: ["above", "below"],
			description:
				'Where the error, warning and info message boxes render: `"above"` (default) between the label and the control, `"below"` directly under the control'
		},
		breakTooltipsToNewLine: {
			control: "select",
			options: [false, true, "above", "below"],
			description:
				'Where tooltips render: `false` inline beside the control, `true` / `"above"` on a new line above the control, `"below"` on a new line below. There is no single default — it follows the resolved `variant`: `"above"` for `textbox`, `false` for `select` and `autocomplete`, which is what these stories use.'
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

export const Playground: Story = {
	args: {
		label: "Year",
		variant: "select",
		year: 2024,
		yearRange: { start: 2015, end: 2030 }
	}
};

export const Variants: Story = {
	render: function VariantsExample() {
		const [textboxYear, setTextboxYear] = useState<number | undefined>(2024);
		const [selectYear, setSelectYear] = useState<number | undefined>(2024);
		const [autocompleteYear, setAutocompleteYear] = useState<number | undefined>(2024);

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<YearSelector label="Textbox" variant="textbox" year={textboxYear} onYearChange={setTextboxYear} />
				<YearSelector
					label="Select"
					variant="select"
					yearRange={{ start: 2015, end: 2030 }}
					year={selectYear}
					onYearChange={setSelectYear}
				/>
				<YearSelector
					label="Autocomplete"
					variant="autocomplete"
					yearRange={{ start: 2015, end: 2030 }}
					year={autocompleteYear}
					onYearChange={setAutocompleteYear}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The `variant` prop selects the rendering mode: a free `textbox`, a native `select` or an `autocomplete` input. When omitted, the mode is auto-detected — `autocomplete` if a `yearRange` is provided, `textbox` otherwise."
			}
		}
	}
};

export const RelativeYearRange: Story = {
	render: function RelativeYearRangeExample(args) {
		const [year, setYear] = useState<number | undefined>(2024);

		return <YearSelector {...args} year={year} onYearChange={setYear} />;
	},
	args: {
		label: "Year (±5 from selected)",
		variant: "autocomplete",
		yearRange: { startOffset: -5, endOffset: 5 }
	},
	parameters: {
		docs: {
			description: {
				story:
					"`yearRange` also accepts relative offsets (`{ startOffset, endOffset }`) from the reference year — the currently selected year, or today's year when nothing is selected."
			}
		}
	}
};

export const TextboxWithValidation: Story = {
	render: function TextboxWithValidationExample(args) {
		const [year, setYear] = useState<number | undefined>(new Date().getFullYear());
		const [yearErrorMessage, setYearErrorMessage] = useState<string | undefined>();

		const handleYearBlur = useCallback((ev: FocusEvent<HTMLInputElement>): void => {
			setYearErrorMessage(validateYearInput(ev.target.value));
		}, []);

		return (
			<YearSelector
				{...args}
				year={year}
				errorMessage={yearErrorMessage}
				onYearChange={setYear}
				onBlur={handleYearBlur}
			/>
		);
	},
	args: {
		label: "Year",
		placeholder: "YYYY"
	},
	parameters: {
		docs: {
			description: {
				story:
					"Without a `yearRange`, the auto-detected `textbox` variant accepts free input. The `onBlur` callback can be used to validate the entered value and set an `errorMessage`."
			}
		}
	}
};

export const WithPlaceholder: Story = {
	name: "With placeholder",
	render: function WithPlaceholderExample(args) {
		const [year, setYear] = useState<number | undefined>(undefined);

		return <YearSelector {...args} year={year} onYearChange={setYear} />;
	},
	args: {
		label: "Year",
		variant: "select",
		placeholder: "Select a year",
		yearRange: { start: 2015, end: 2030 }
	},
	parameters: {
		docs: {
			description: {
				story: "`placeholder` is shown while no year is selected. It has no effect when an `optionalItem` is provided."
			}
		}
	}
};

export const WithOptionalItem: Story = {
	name: "With optional item (select)",
	render: function WithOptionalItemExample(args) {
		const [year, setYear] = useState<number | undefined>(undefined);

		return <YearSelector {...args} year={year} onYearChange={setYear} />;
	},
	args: {
		label: "Year",
		variant: "select",
		yearRange: { start: 2020, end: 2030 },
		optionalItem: { label: "All years" }
	},
	parameters: {
		docs: {
			description: {
				story:
					'`optionalItem` adds a first entry (e.g. "All years") that yields an `undefined` value when selected. Applies to the `select` and `autocomplete` variants.'
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "year-selector-message-position",
		label: "Year",
		helperText: "Helper text explaining the field",
		variant: "select",
		year: 2024,
		yearRange: { start: 2015, end: 2030 },
		error: true,
		errorMessage: "Please select a valid year",
		messagePosition: "below"
	},
	parameters: {
		controls: { include: ["messagePosition"] },
		docs: {
			description: {
				story:
					'`messagePosition` places the message box relative to the control. This story starts at `"below"`, which renders it directly under the control — switch the control to `"above"` for the default placement between the label and the control.'
			}
		}
	}
};

export const TooltipPosition: Story = {
	args: {
		id: "year-selector-tooltip-position",
		label: "Year",
		helperText: "Helper text explaining the field",
		variant: "select",
		year: 2024,
		yearRange: { start: 2015, end: 2030 },
		tooltips: <HintTooltip text="This is a hint" id="year-selector-tooltip-position-hint" />,
		ariaDescribedby: "year-selector-tooltip-position-hint",
		breakTooltipsToNewLine: "below"
	},
	parameters: {
		controls: { include: ["breakTooltipsToNewLine"] },
		docs: {
			description: {
				story:
					'`breakTooltipsToNewLine` places the tooltips relative to the control. This story starts at `"below"`, which puts them on their own line under the control — switch the control to `false` for the default inline placement beside it, or to `"above"` / `true` for a line above.'
			}
		}
	}
};

export const DisabledAndReadonly: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<YearSelector label="Disabled" variant="select" year={2024} yearRange={{ start: 2015, end: 2030 }} disabled />
			<YearSelector label="Read-only" variant="select" year={2024} yearRange={{ start: 2015, end: 2030 }} readonly />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` blocks all interaction, while `readonly` keeps the value visible and focusable but not editable."
			}
		}
	}
};
