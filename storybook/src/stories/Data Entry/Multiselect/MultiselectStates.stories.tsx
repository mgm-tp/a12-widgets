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

import { Multiselect } from "@com.mgmtp.a12.widgets/widgets-core";
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
	title: "Data Entry/Multiselect/States",
	component: Multiselect,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	args: {
		onChange: fn(),
		onItemCheck: fn(),
		onItemClick: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div style={{ width: 400 }}>
			<Multiselect
				id="multiselect-states-default"
				label="Programming Languages (disabled)"
				placeholder="Please select or start typing"
				hintTemplate="{count} of {total} options shown"
				items={getItemsWithSelection(["3"])}
				onChange={fn()}
				disabled
			/>
		</div>
	)
};

export const Disabled: Story = {
	render: () => (
		<div style={{ width: 400 }}>
			<Multiselect
				id="multiselect-disabled"
				label="Programming Languages (disabled)"
				placeholder="Please select or start typing"
				hintTemplate="{count} of {total} options shown"
				items={getItemsWithSelection(["3"])}
				onChange={fn()}
				disabled
			/>
		</div>
	)
};

export const Readonly: Story = {
	render: () => (
		<div style={{ width: 400 }}>
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
	)
};

export const ValidationMessages: Story = {
	render: () => {
		const MultiselectValidation = () => {
			const [selectedItems, setSelectedItems] = useState<Item[]>([]);

			const items = useMemo(() => {
				const selectedIds = selectedItems.map((i) => i.id);

				return getItemsWithSelection(selectedIds);
			}, [selectedItems]);

			return (
				<div style={{ width: 400, display: "flex", flexDirection: "column", gap: 16 }}>
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
		};

		return <MultiselectValidation />;
	}
};
