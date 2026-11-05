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
import { DropDown, Icon, Link, TextField, useDropdownNavigation } from "@com.mgmtp.a12.widgets/widgets-core";

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

const graphicItems: DropDownItem[] = [
	{ label: "Top", graphic: <Icon>vertical_align_top</Icon>, tabIndex: 0, value: "top" },
	{ label: "Middle", graphic: <Icon>vertical_align_center</Icon>, tabIndex: 0, value: "middle" },
	{ label: "Bottom", graphic: <Icon>vertical_align_bottom</Icon>, tabIndex: 0, value: "bottom" },
	{ label: "Center", graphic: <Icon>format_align_center</Icon>, tabIndex: 0, value: "center" },
	{ label: "Justify", graphic: <Icon>format_align_justify</Icon>, disabled: true, tabIndex: 0, value: "justify" },
	{ label: "Left", graphic: <Icon>format_align_left</Icon>, tabIndex: 0, value: "left" },
	{ label: "Right", graphic: <Icon>format_align_right</Icon>, tabIndex: 0, value: "right" }
];

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

const meta: Meta = {
	title: "Navigation/Dropdown",
	component: DropDown,
	parameters: {
		layout: "padded"
	},
	args: {
		items: basicItems,
		onSelectedItemChange: fn()
	},
	argTypes: {
		items: {
			control: false,
			description: "List of `DropDownItem` objects to display"
		},
		hint: {
			control: "text",
			description: "Displays how many items match the searched keywords"
		},
		selectedItem: {
			control: false,
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
		keysToSelectItem: {
			control: false,
			description: "Keys that select the pre-selected item (default: Enter)"
		},
		footer: {
			control: false,
			description: "Element(s) displayed at the bottom, e.g. for loading more items"
		},
		onSelectedItemChange: {
			description: "Triggered when the selected item changes"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		items: basicItems,
		hint: `${basicItems.length} of ${basicItems.length} options shown`,
		lightBackground: false,
		horizontal: false,
		selectedItemPosition: "bottom"
	},
	render: function PlaygroundExample(args) {
		const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

		return (
			<div
				style={{
					background: args.lightBackground ? "transparent" : "#555",
					padding: "16px",
					width: args.horizontal ? undefined : "320px"
				}}
			>
				<DropDown
					{...args}
					items={args.items ?? basicItems}
					selectedItem={selectedItem}
					onSelectedItemChange={(item) => {
						setSelectedItem(item);
						args.onSelectedItemChange?.(item);
					}}
				/>
			</div>
		);
	}
};

export const Basic: Story = {
	render: function BasicExample(args) {
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
	},
	parameters: {
		docs: {
			description: {
				story:
					"Basic dropdown with a list of selectable `items`. One item is `disabled` and one represents an empty value via `isEmptyValue`."
			}
		}
	}
};

export const LightBackground: Story = {
	render: function LightBackgroundExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story: "`lightBackground` switches to a light color scheme, suitable for use on light-colored surfaces."
			}
		}
	}
};

export const WithGraphics: Story = {
	render: function WithGraphicsExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story: "Items can include a `graphic` element (e.g. an `Icon`) shown before the label."
			}
		}
	}
};

export const Horizontal: Story = {
	render: function HorizontalExample() {
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
	},
	parameters: {
		docs: {
			description: {
				story: "`horizontal` arranges the items in a horizontal layout, useful for toolbar-style selection."
			}
		}
	}
};

export const WithGroups: Story = {
	render: function WithGroupsExample() {
		const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

		return (
			<div style={{ background: "#555", padding: "16px", width: "100%", maxWidth: 400 }}>
				<DropDown
					items={groupedItems}
					selectedItem={selectedItem}
					onSelectedItemChange={setSelectedItem}
					hint="Select a document section"
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Items can be grouped by setting the `children` property on a parent item. The parent acts as a group heading."
			}
		}
	}
};

export const WithSecondaryText: Story = {
	render: function WithSecondaryTextExample() {
		const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

		return (
			<div style={{ background: "#555", padding: "16px", width: "100%", maxWidth: 380 }}>
				<DropDown
					items={secondaryTextItems}
					selectedItem={selectedItem}
					onSelectedItemChange={setSelectedItem}
					hint="Select a pricing plan"
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: "Items support a `secondaryText` property for showing additional descriptive text below the label."
			}
		}
	}
};

export const WithLinkItems: Story = {
	render: function WithLinkItemsExample() {
		const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);
		const [activatedLink, setActivatedLink] = useState<string>("none");

		return (
			<div style={{ background: "#555", padding: "16px", width: "100%", maxWidth: 400 }}>
				<DropDown
					items={basicItems}
					selectedItem={selectedItem}
					onSelectedItemChange={setSelectedItem}
					hint={`Last activated link: ${activatedLink}`}
					links={[
						<Link key="assign" useAsButton onClick={() => setActivatedLink("Assign to me")}>
							<Icon>add</Icon> Assign to me
						</Link>,
						<Link key="unassign" useAsButton onClick={() => setActivatedLink("Remove assignment")}>
							<Icon>person_remove</Icon> Remove assignment
						</Link>
					]}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`links` renders actions above the options, in a listbox of their own. They take part in the same arrow-key navigation: the links and the options form one sequence, so Down enters it at the first link and Up enters it at the last option, wrapping round at either end. Enter activates whichever of the two is active."
			}
		}
	}
};

export const MultiSelect: Story = {
	render: function MultiSelectExample() {
		const selectable = basicItems.filter((item) => !item.isEmptyValue && !item.disabled);
		const [selectedValues, setSelectedValues] = useState<string[]>([selectable[1].value!]);
		const allSelected = selectedValues.length === selectable.length;

		// The selection is stated on the options themselves here; `selectedItems` is the alternative when
		// the selected options are held as a list of their own.
		const items: DropDownItem[] = [
			{
				label: "Select all",
				id: "select-all",
				tabIndex: 0,
				selected: allSelected,
				indeterminate: selectedValues.length > 0 && !allSelected
			},
			...basicItems
				.filter((item) => !item.isEmptyValue)
				.map((item) => ({ ...item, id: item.value, selected: selectedValues.includes(item.value!) }))
		];

		return (
			<div style={{ background: "#555", padding: "16px", width: "100%", maxWidth: 400 }}>
				<DropDown
					selectionMode="multiple"
					items={items}
					getItemKey={(item) => item.id ?? item.label}
					hint={`${selectedValues.length} of ${selectable.length} selected`}
					onSelectionChange={(nextSelection, toggledItem) => {
						if (toggledItem.id === "select-all") {
							setSelectedValues(allSelected ? [] : selectable.map((item) => item.value!));

							return;
						}

						setSelectedValues(nextSelection.filter((item) => item.id !== "select-all").map((item) => item.id!));
					}}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					'`selectionMode="multiple"` renders a checkbox in front of every option, announces the list as `aria-multiselectable`, and toggles an option on click, Space or Enter instead of replacing the selection. The first option sets `indeterminate` to show the mixed state of a "select all" entry.'
			}
		}
	}
};

export const ExternalKeyboardNavigation: Story = {
	render: function ExternalKeyboardNavigationExample() {
		// An option can only be pointed at by `aria-activedescendant` if it has an id of its own.
		const items = basicItems.map((item) => ({ ...item, id: item.value }));
		const navigation = useDropdownNavigation({ items });
		const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

		return (
			<div style={{ background: "#555", padding: "16px", width: "100%", maxWidth: 400 }}>
				<TextField
					label="Furniture"
					value={selectedItem?.label ?? ""}
					onChange={() => undefined}
					inputProps={{
						role: "combobox",
						"aria-expanded": true,
						"aria-controls": "external-navigation-list",
						"aria-activedescendant": navigation.activeItem?.id
					}}
					onKeyDown={navigation.handleKeyDown}
				/>
				<DropDown
					id="external-navigation-list"
					items={items}
					navigation={navigation}
					selectedItem={selectedItem}
					onSelectedItemChange={setSelectedItem}
					hint={navigation.activeItem ? `Active: ${navigation.activeItem.label}` : "Use the arrow keys"}
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"The active option is held by `useDropdownNavigation` and handed to the list as its `navigation` prop, so the field above keeps the focus, forwards arrow keys with `handleKeyDown`, and can read the active option for `aria-activedescendant` without a reference to the list."
			}
		}
	}
};

export const LongList: Story = {
	render: function LongListExample() {
		const items: DropDownItem[] = Array.from({ length: 10000 }, (_unused, index) => ({
			id: `option-${index}`,
			label: `Option ${index + 1}`,
			tabIndex: 0
		}));

		return (
			<div style={{ background: "#555", padding: "16px", width: "100%", maxWidth: 400 }}>
				<DropDown virtualize items={items} hint={`${items.length} options`} />
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`virtualize` renders only the options in view, so a list of 10 000 options opens and scrolls without rendering all of them. Heights are measured as options appear, and `estimatedItemHeight` sets the height assumed before that; the options carry `aria-setsize` and `aria-posinset` so the real list size is still announced. Turn `virtualize` off on the same list for the unwindowed baseline."
			}
		}
	}
};

export const LongListWithSections: Story = {
	render: function LongListWithSectionsExample() {
		const items: DropDownItem[] = Array.from({ length: 20 }, (_unused, section) => ({
			id: `section-${section}`,
			label: `Section ${section + 1}`,
			children: Array.from({ length: 500 }, (_unusedChild, index) => ({
				id: `option-${section}-${index}`,
				label: `Section ${section + 1} — Option ${index + 1}`,
				tabIndex: 0
			}))
		}));

		return (
			<div style={{ background: "#555", padding: "16px", width: "100%", maxWidth: 400 }}>
				<DropDown virtualize items={items} hint="10 000 options in 20 sections" />
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"Sections are windowed along with their options: the headers are rows of the same window, scrolling away with the options they head, and `estimatedSectionHeight` sets the height assumed for one before it is measured. Arrowing to an option in a later section still scrolls to it — a position addresses the same option whether or not the headers are counted."
			}
		}
	}
};
