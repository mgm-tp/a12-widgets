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
	title: "Navigation/Dropdown",
	component: DropDown,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		hint: {
			control: "text",
			description: "Displays how many items match the searched keywords"
		},
		selectedItem: {
			description: "The currently selected item"
		},
		lightBackground: {
			control: "boolean",
			description: "Uses the light color for background"
		},
		horizontal: {
			control: "boolean",
			description: "Display items in horizontal layout"
		},
		selectedItemPosition: {
			control: "select",
			options: ["top", "middle", "bottom"],
			description: "Initial scroll position of the selected item"
		},
		onSelectedItemChange: {
			description: "Triggered when the selected item changes"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: DropDownItem[] = [
	{ label: "Empty item", isEmptyValue: true, tabIndex: 0, value: "empty" },
	{ label: "Armchair", tabIndex: 0, value: "armchair" },
	{ label: "Bean bag", tabIndex: 0, value: "bean-bag" },
	{ label: "Disabled item", disabled: true, tabIndex: 0, value: "disabled" },
	{ label: "Chair", tabIndex: 0, value: "chair" },
	{ label: "Desk", tabIndex: 0, value: "desk" },
	{ label: "Rocking chair", tabIndex: 0, value: "rocking-chair" },
	{ label: "Sideboard", tabIndex: 0, value: "sideboard" },
	{ label: "Waterbed", tabIndex: 0, value: "waterbed" }
];

export const Default: Story = {
	render: (args) => {
		const DefaultDemo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ background: "#555", padding: "16px", width: "320px" }}>
					<DropDown
						{...args}
						items={basicItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint={`${basicItems.length} of ${basicItems.length} options shown`}
					/>
				</div>
			);
		};

		return <DefaultDemo />;
	},
	args: {
		onSelectedItemChange: fn()
	}
};

export const Basic: Story = {
	render: (args) => {
		const BasicDemo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ background: "#555", padding: "16px", width: "320px" }}>
					<DropDown
						{...args}
						items={basicItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint={`${basicItems.length} of ${basicItems.length} options shown`}
					/>
				</div>
			);
		};

		return <BasicDemo />;
	},
	args: {
		onSelectedItemChange: fn()
	},
	parameters: {
		docs: {
			description: {
				story: "Basic dropdown with a list of selectable items. One item is disabled and one represents an empty value."
			}
		}
	}
};

export const LightBackground: Story = {
	render: () => {
		const LightDemo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ padding: "16px", width: "320px" }}>
					<DropDown
						items={basicItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint={`${basicItems.length} of ${basicItems.length} options shown`}
						lightBackground
					/>
				</div>
			);
		};

		return <LightDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Dropdown with a light background, suitable for use on light-colored surfaces."
			}
		}
	}
};

const graphicItems: DropDownItem[] = [
	{ label: "Top", graphic: <Icon>vertical_align_top</Icon>, tabIndex: 0, value: "top" },
	{ label: "Middle", graphic: <Icon>vertical_align_center</Icon>, tabIndex: 0, value: "middle" },
	{ label: "Bottom", graphic: <Icon>vertical_align_bottom</Icon>, tabIndex: 0, value: "bottom" },
	{ label: "Center", graphic: <Icon>format_align_center</Icon>, tabIndex: 0, value: "center" },
	{ label: "Justify", graphic: <Icon>format_align_justify</Icon>, disabled: true, tabIndex: 0, value: "justify" },
	{ label: "Left", graphic: <Icon>format_align_left</Icon>, tabIndex: 0, value: "left" },
	{ label: "Right", graphic: <Icon>format_align_right</Icon>, tabIndex: 0, value: "right" }
];

export const WithGraphics: Story = {
	render: () => {
		const GraphicsDemo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ background: "#555", padding: "16px", width: "320px" }}>
					<DropDown
						items={graphicItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint={`${graphicItems.length} of ${graphicItems.length} options shown`}
					/>
				</div>
			);
		};

		return <GraphicsDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Dropdown items can include a graphic element (e.g. an icon) shown before the label."
			}
		}
	}
};

export const Horizontal: Story = {
	render: () => {
		const HorizontalDemo = () => {
			const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

			return (
				<div style={{ background: "#555", padding: "16px" }}>
					<DropDown
						horizontal
						items={graphicItems}
						selectedItem={selectedItem}
						onSelectedItemChange={setSelectedItem}
						hint={`${graphicItems.length} of ${graphicItems.length} options shown`}
					/>
				</div>
			);
		};

		return <HorizontalDemo />;
	},
	parameters: {
		docs: {
			description: {
				story: "Dropdown items arranged horizontally, useful for toolbar-style selection."
			}
		}
	}
};
