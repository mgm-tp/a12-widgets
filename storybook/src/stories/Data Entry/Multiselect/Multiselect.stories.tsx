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
import { useState, useMemo } from "react";
import { fn } from "storybook/test";

import { Multiselect, HintTooltip, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core";

type Item = MultiselectProps.Item;

const ALL_ITEMS: Item[] = [
	{ id: "1", label: "Java" },
	{ id: "2", label: "Groovy" },
	{ id: "3", label: "JavaScript" },
	{ id: "4", label: "TypeScript" },
	{ id: "5", label: "C++" },
	{ id: "6", label: "C" },
	{ id: "7", label: "Scala" },
	{ id: "8", label: "Python" },
	{ id: "9", label: "PHP" },
	{ id: "10", label: "Ruby" },
	{ id: "11", label: "Rust" },
	{ id: "12", label: "Go" }
];

function getItemsWithSelection(selectedIds: string[]): Item[] {
	return ALL_ITEMS.map((item) => (selectedIds.includes(item.id) ? { ...item, selected: true } : item));
}

const meta: Meta<typeof Multiselect> = {
	title: "Data Entry/Multiselect",
	component: Multiselect,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		label: {
			control: "text",
			description: "Label displayed above the multiselect input"
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when no items are selected"
		},
		disabled: {
			control: "boolean",
			description: "Disables the multiselect input"
		},
		readonly: {
			control: "boolean",
			description: "Makes the multiselect input read-only"
		},
		enableSelectAllOption: {
			control: "boolean",
			description: "Show a 'select all' option at the top of the dropdown"
		},
		selectAllText: {
			control: "text",
			description: "Label for the 'select all' option"
		},
		hintTemplate: {
			control: "text",
			description: 'Informational text shown above the dropdown items, e.g. "{count} of {total} options shown"'
		},
		openOnFocus: {
			control: "boolean",
			description: "Whether the dropdown should open when the input receives focus"
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
		},
		helperText: {
			control: "text",
			description: "Helper text displayed below the input"
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
				'Where tooltips render: `false` (default) inline beside the control, `true` / `"above"` on a new line above the control, `"below"` on a new line below'
		}
	},
	args: {
		onChange: fn(),
		onItemCheck: fn(),
		onItemClick: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "multiselect-playground",
		label: "Programming Languages",
		placeholder: "Please select or start typing",
		hintTemplate: "{count} of {total} options shown",
		selectAllText: "All",
		items: ALL_ITEMS
	},
	render: (args) => (
		<div style={{ width: "100%", maxWidth: 400 }}>
			<Multiselect {...args} />
		</div>
	)
};

export const WithLabelGraphic: Story = {
	render: function WithLabelGraphicExample() {
		const [selectedItems, setSelectedItems] = useState<Item[]>([ALL_ITEMS[2]]);

		const items = useMemo(() => {
			const selectedIds = selectedItems.map((i) => i.id);

			return getItemsWithSelection(selectedIds);
		}, [selectedItems]);

		return (
			<div style={{ width: "100%", maxWidth: 400 }}>
				<Multiselect
					id="multiselect-graphic"
					label="Programming Languages"
					labelGraphic={<Icon>code</Icon>}
					placeholder="Please select or start typing"
					hintTemplate="{count} of {total} options shown"
					selectAllText="All"
					items={items}
					onChange={setSelectedItems}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "`labelGraphic` renders an additional element (typically an `Icon`) to the left of the label."
			}
		}
	}
};

export const WithPreselectedItems: Story = {
	render: function WithPreselectedItemsExample() {
		const [selectedItems, setSelectedItems] = useState<Item[]>([ALL_ITEMS[0], ALL_ITEMS[2], ALL_ITEMS[3]]);

		const items = useMemo(() => {
			const selectedIds = selectedItems.map((i) => i.id);

			return getItemsWithSelection(selectedIds);
		}, [selectedItems]);

		return (
			<div style={{ width: "100%", maxWidth: 400 }}>
				<Multiselect
					id="multiselect-preselected"
					label="Programming Languages"
					placeholder="Please select or start typing"
					hintTemplate="{count} of {total} options shown"
					selectAllText="Select All"
					items={items}
					onChange={setSelectedItems}
					helperText="Java, JavaScript and TypeScript are preselected"
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Items flagged with `selected: true` are preselected and shown as a comma-separated list in the input. `onChange` reports the full set of selected items so the consumer can keep its state in sync."
			}
		}
	}
};

export const WithoutSelectAll: Story = {
	render: function WithoutSelectAllExample() {
		const [selectedItems, setSelectedItems] = useState<Item[]>([]);

		const items = useMemo(() => {
			const selectedIds = selectedItems.map((i) => i.id);

			return getItemsWithSelection(selectedIds);
		}, [selectedItems]);

		return (
			<div style={{ width: "100%", maxWidth: 400 }}>
				<Multiselect
					id="multiselect-no-select-all"
					label="Programming Languages"
					placeholder="Please select or start typing"
					hintTemplate="{count} of {total} options shown"
					enableSelectAllOption={false}
					items={items}
					onChange={setSelectedItems}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Set `enableSelectAllOption` to `false` to hide the 'select all' option at the top of the dropdown."
			}
		}
	}
};

export const DisabledAndReadonly: Story = {
	render: () => (
		<div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
			<Multiselect
				id="multiselect-disabled"
				label="Programming Languages (disabled)"
				placeholder="Please select or start typing"
				hintTemplate="{count} of {total} options shown"
				items={getItemsWithSelection(["3"])}
				onChange={fn()}
				disabled
			/>
			<Multiselect
				id="multiselect-readonly"
				label="Programming Languages (readonly)"
				placeholder="Please select or start typing"
				hintTemplate="{count} of {total} options shown"
				items={getItemsWithSelection(["1", "3", "8"])}
				onChange={fn()}
				readonly
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`disabled` blocks all interaction, while `readonly` still displays the selected values but prevents changing them."
			}
		}
	}
};

export const ValidationMessages: Story = {
	render: function ValidationMessagesExample() {
		const [selectedItems, setSelectedItems] = useState<Item[]>([]);

		const items = useMemo(() => {
			const selectedIds = selectedItems.map((i) => i.id);

			return getItemsWithSelection(selectedIds);
		}, [selectedItems]);

		return (
			<div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
				<Multiselect
					id="multiselect-error"
					label="Error state"
					placeholder="Please select or start typing"
					hintTemplate="{count} of {total} options shown"
					items={items}
					onChange={setSelectedItems}
					errorMessage="Please select at least one option"
				/>
				<Multiselect
					id="multiselect-warning"
					label="Warning state"
					placeholder="Please select or start typing"
					hintTemplate="{count} of {total} options shown"
					items={items}
					onChange={setSelectedItems}
					warningMessage="Consider selecting more options"
				/>
				<Multiselect
					id="multiselect-info"
					label="Info state"
					placeholder="Please select or start typing"
					hintTemplate="{count} of {total} options shown"
					items={items}
					onChange={setSelectedItems}
					infoMessage="You can select multiple languages"
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "`errorMessage`, `warningMessage` and `infoMessage` display validation feedback below the input."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "multiselect-message-position",
		label: "Programming Languages",
		helperText: "Helper text explaining the field",
		placeholder: "Please select or start typing",
		hintTemplate: "{count} of {total} options shown",
		items: ALL_ITEMS,
		error: true,
		errorMessage: "Please select at least one language",
		messagePosition: "below"
	},
	render: (args) => (
		<div style={{ width: 400 }}>
			<Multiselect {...args} />
		</div>
	),
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
		id: "multiselect-tooltip-position",
		label: "Programming Languages",
		helperText: "Helper text explaining the field",
		placeholder: "Please select or start typing",
		hintTemplate: "{count} of {total} options shown",
		items: ALL_ITEMS,
		tooltips: <HintTooltip text="This is a hint" id="multiselect-tooltip-position-hint" />,
		ariaDescribedby: "multiselect-tooltip-position-hint",
		breakTooltipsToNewLine: "below"
	},
	render: (args) => (
		<div style={{ width: 400 }}>
			<Multiselect {...args} />
		</div>
	),
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
