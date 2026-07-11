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

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { DropDown, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta = {
	title: "Navigation/Dropdown/Advanced",
	component: DropDown,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const groupedItems: DropDownItem[] = [
	{ label: "Cost Report", tabIndex: 0, value: "cost-report" },
	{
		label: "Offer",
		id: "section-offer",
		tabIndex: 0,
		value: "offer",
		children: [
			{ label: "Coverage", tabIndex: 0, value: "offer-coverage" },
			{ label: "Clauses", disabled: true, tabIndex: 0, value: "offer-clauses" }
		]
	},
	{
		label: "Policy",
		id: "section-policy",
		tabIndex: 0,
		value: "policy",
		children: [
			{ label: "Coverage", tabIndex: 0, value: "policy-coverage" },
			{ label: "Clauses", tabIndex: 0, value: "policy-clauses" }
		]
	}
];

const secondaryTextItems: DropDownItem[] = [
	{ label: "Standard Plan", secondaryText: "Up to 5 users, 10 GB storage", tabIndex: 0, value: "standard" },
	{
		label: "Business Plan",
		secondaryText: "Up to 25 users, 100 GB storage",
		tabIndex: 0,
		value: "business",
		graphic: <Icon>star</Icon>
	},
	{
		label: "Enterprise Plan",
		secondaryText: "Unlimited users, 1 TB storage",
		tabIndex: 0,
		value: "enterprise",
		graphic: <Icon>business</Icon>
	},
	{ label: "Free Plan", secondaryText: "1 user only, 1 GB storage", disabled: true, tabIndex: 0, value: "free" }
];

export const Default: Story = {
	render: (args) => {
		const DefaultDemo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ background: "#555", padding: "16px", width: "400px" }}>
					<DropDown
						{...args}
						items={groupedItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint={`${groupedItems.length} groups`}
					/>
				</div>
			);
		};

		return <DefaultDemo />;
	},
	args: { onSelectedItemChange: fn() }
};

export const WithGroups: Story = {
	render: (args) => {
		const Demo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ background: "#555", padding: "16px", width: "400px" }}>
					<DropDown
						{...args}
						items={groupedItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint="Select a document section"
					/>
				</div>
			);
		};

		return <Demo />;
	},
	args: { onSelectedItemChange: fn() },
	parameters: {
		docs: {
			description: {
				story: "Dropdown items can be grouped using the `children` property on a parent item."
			}
		}
	}
};

export const WithSecondaryText: Story = {
	render: (args) => {
		const Demo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ background: "#555", padding: "16px", width: "380px" }}>
					<DropDown
						{...args}
						items={secondaryTextItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint="Select a pricing plan"
					/>
				</div>
			);
		};

		return <Demo />;
	},
	args: { onSelectedItemChange: fn() },
	parameters: {
		docs: {
			description: {
				story:
					"Dropdown items support a `secondaryText` property for showing additional descriptive text below the label."
			}
		}
	}
};
