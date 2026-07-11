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

import { Multiselect, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
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
	tags: ["autodocs"],
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
			description: 'Template for the hint text, e.g. "{count} of {total} options shown"'
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

export const Default: Story = {
	render: () => {
		const DefaultMultiselect = () => {
			const [selectedItems, setSelectedItems] = useState<Item[]>([]);

			const items = useMemo(() => {
				const selectedIds = selectedItems.map((i) => i.id);

				return getItemsWithSelection(selectedIds);
			}, [selectedItems]);

			return (
				<div style={{ width: 400 }}>
					<Multiselect
						id="multiselect-default"
						label="Programming Languages"
						placeholder="Please select or start typing"
						hintTemplate="{count} of {total} options shown"
						selectAllText="All"
						items={items}
						onChange={setSelectedItems}
					/>
				</div>
			);
		};

		return <DefaultMultiselect />;
	}
};

export const WithLabelGraphic: Story = {
	render: () => {
		const MultiselectWithGraphic = () => {
			const [selectedItems, setSelectedItems] = useState<Item[]>([ALL_ITEMS[2]]);

			const items = useMemo(() => {
				const selectedIds = selectedItems.map((i) => i.id);

				return getItemsWithSelection(selectedIds);
			}, [selectedItems]);

			return (
				<div style={{ width: 400 }}>
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
		};

		return <MultiselectWithGraphic />;
	}
};

export const WithPreselectedItems: Story = {
	render: () => {
		const MultiselectPreselected = () => {
			const [selectedItems, setSelectedItems] = useState<Item[]>([ALL_ITEMS[0], ALL_ITEMS[2], ALL_ITEMS[3]]);

			const items = useMemo(() => {
				const selectedIds = selectedItems.map((i) => i.id);

				return getItemsWithSelection(selectedIds);
			}, [selectedItems]);

			return (
				<div style={{ width: 400 }}>
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
		};

		return <MultiselectPreselected />;
	}
};

export const WithoutSelectAll: Story = {
	render: () => {
		const MultiselectNoSelectAll = () => {
			const [selectedItems, setSelectedItems] = useState<Item[]>([]);

			const items = useMemo(() => {
				const selectedIds = selectedItems.map((i) => i.id);

				return getItemsWithSelection(selectedIds);
			}, [selectedItems]);

			return (
				<div style={{ width: 400 }}>
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
		};

		return <MultiselectNoSelectAll />;
	}
};
