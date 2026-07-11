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
		layout: "padded",
		docs: {
			description: {
				component:
					"FacetedSearch provides filter chips (Filter), a responsive container (FilterBar), and a filter picker panel (FilterSelector). FilterBar collapses filters that overflow the available width into a '+N more' button."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "Basic Filter Bar",
	render: () => (
		<FilterBar>
			<Filter name="Status: Active" active onClose={() => {}} />
			<Filter name="Category: Design" onClose={() => {}} />
			<Filter name="Priority: High" onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story:
					"FilterBar containing Filter chips. Active filters have a highlighted left border; inactive filters are dimmed. Use onClose to allow removal."
			}
		}
	}
};

export const BasicFilterBar: Story = {
	render: () => {
		const BasicFilterBarExample = () => {
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
		};

		return <BasicFilterBarExample />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"FilterBar with active and inactive Filter chips. Click a filter to toggle its active state. Click × to remove it."
			}
		}
	}
};

export const CompactMode: Story = {
	render: () => (
		<FilterBar compact>
			<Filter name="Status: Open" active compact onClose={() => {}} />
			<Filter name="Type: Bug" compact onClose={() => {}} />
			<Filter name="Sprint: Current" compact onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story: "FilterBar and Filter in compact mode for dense layouts."
			}
		}
	}
};

export const DisabledState: Story = {
	render: () => (
		<FilterBar disabled>
			<Filter name="Status: Active" active disabled onClose={() => {}} />
			<Filter name="Priority: High" disabled onClose={() => {}} />
		</FilterBar>
	),
	parameters: {
		docs: {
			description: {
				story: "Disabled FilterBar and filters — no interaction possible."
			}
		}
	}
};

export const FilterWithOptions: Story = {
	name: "Filter with Options",
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
					"Use the options prop to display the current filter value inside the chip. Use separator to join multiple option values. The options can be a string or ReactNode."
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
					"Set nonRemovable on a Filter to hide its close button. Use this for mandatory filters that cannot be removed by the user, such as tenant or role restrictions."
			}
		}
	}
};
