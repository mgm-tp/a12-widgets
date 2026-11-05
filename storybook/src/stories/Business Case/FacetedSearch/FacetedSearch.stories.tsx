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

import { FilterBar, Filter, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof FilterBar> = {
	title: "Business Case/FacetedSearch",
	component: FilterBar,
	parameters: {
		layout: "padded"
	},
	argTypes: {
		initialCollapsed: {
			control: "boolean",
			description: "Specifies whether the Filter Bar is collapsed to a single row initially"
		},
		disabled: {
			control: "boolean",
			description: "Disables the Filter Bar and all contained filters"
		},
		compact: {
			control: "boolean",
			description: "Hides the action area (expand/collapse button) and keeps the bar collapsed"
		},
		actions: {
			control: false,
			description: "Custom actions placed at the end of the bar"
		},
		onHiddenFiltersChange: {
			control: false,
			description: "Callback fired with the indices of filters hidden by the responsive behavior"
		},
		children: {
			control: false,
			description: "The Filter chips to display"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		initialCollapsed: false,
		disabled: false,
		compact: false
	},
	render: (args) => (
		<FilterBar {...args}>
			<Filter name="Status: Active" active onClose={() => {}} />
			<Filter name="Category: Design" onClose={() => {}} />
			<Filter name="Priority: High" onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story:
					"A `FilterBar` containing `Filter` chips. `active` filters have a highlighted left border; inactive filters are dimmed. Use the controls to explore the `FilterBar` props."
			}
		}
	}
};

export const Interactive: Story = {
	render: function InteractiveExample() {
		const [activeFilters, setActiveFilters] = useState<string[]>(["status"]);

		const toggleFilter = (id: string) => {
			setActiveFilters((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
		};

		const removeFilter = (id: string) => {
			setActiveFilters((prev) => prev.filter((f) => f !== id));
		};

		const filters = [
			{ id: "status", name: "Status: Active" },
			{ id: "category", name: "Category: Design" },
			{ id: "assignee", name: "Assignee: Alice" },
			{ id: "priority", name: "Priority: High" }
		];

		return (
			<FilterBar
				actions={
					<Button onClick={() => setActiveFilters([])} secondary>
						Clear all
					</Button>
				}
			>
				{filters
					.filter((f) => activeFilters.includes(f.id))
					.map((filter) => (
						<Filter
							key={filter.id}
							name={filter.name}
							active
							onClick={() => toggleFilter(filter.id)}
							onClose={() => removeFilter(filter.id)}
						/>
					))}
				{filters
					.filter((f) => !activeFilters.includes(f.id))
					.map((filter) => (
						<Filter
							key={filter.id}
							name={filter.name}
							onClick={() => toggleFilter(filter.id)}
							onClose={() => removeFilter(filter.id)}
						/>
					))}
			</FilterBar>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"FilterBar with active and inactive Filter chips and a custom `actions` element. Click a filter to toggle its `active` state, click × (`onClose`) to remove it, or use 'Clear all' to deactivate everything."
			}
		}
	}
};

export const WithOptions: Story = {
	render: () => (
		<FilterBar>
			<Filter name="Language" active options="English, German" separator=" / " onClose={() => {}} />
			<Filter
				name="Price"
				active
				options={
					<>
						<strong>10€</strong> – <strong>50€</strong>
					</>
				}
				onClose={() => {}}
			/>
			<Filter name="Rating" options="4 stars, 5 stars" separator=" or " onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Use the `options` prop to display the current filter value inside the chip. Use `separator` to join multiple option values. The options can be a string or ReactNode."
			}
		}
	}
};

export const Compact: Story = {
	render: () => (
		<FilterBar compact>
			<Filter name="Status" options="Open" active compact onClose={() => {}} />
			<Filter name="Type" options="Bug" compact onClose={() => {}} />
			<Filter name="Sprint" options="Current" compact onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`compact` on `FilterBar` hides the action area and keeps the bar collapsed. `compact` on a `Filter` with `options` shows only the option values and moves the filter name into a tooltip."
			}
		}
	}
};

export const Overflow: Story = {
	render: () => (
		<div style={{ maxWidth: "480px" }}>
			<FilterBar initialCollapsed>
				<Filter name="Status: Active" active onClose={() => {}} />
				<Filter name="Category: Design" active onClose={() => {}} />
				<Filter name="Assignee: Alice" active onClose={() => {}} />
				<Filter name="Priority: High" active onClose={() => {}} />
				<Filter name="Sprint: Current" active onClose={() => {}} />
				<Filter name="Type: Bug" active onClose={() => {}} />
			</FilterBar>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"When filters do not fit into a single row, the collapsed FilterBar hides the overflowing chips and shows an expand/collapse arrow button. `initialCollapsed` starts the bar collapsed; `onHiddenFiltersChange` reports the indices of the hidden filters."
			}
		}
	}
};

export const NonRemovable: Story = {
	name: "Non-Removable Filter",
	render: () => (
		<FilterBar>
			<Filter name="Tenant" active nonRemovable />
			<Filter name="Status: Open" active onClose={() => {}} />
			<Filter name="Assignee: Me" onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Set `nonRemovable` on a `Filter` to hide its close button. Use this for mandatory filters that cannot be removed by the user, such as tenant or role restrictions."
			}
		}
	}
};

export const Disabled: Story = {
	render: () => (
		<FilterBar disabled>
			<Filter name="Status: Active" active disabled onClose={() => {}} />
			<Filter name="Priority: High" disabled onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story: "`disabled` on `FilterBar` and `Filter` prevents all interaction with the bar and its chips."
			}
		}
	}
};
