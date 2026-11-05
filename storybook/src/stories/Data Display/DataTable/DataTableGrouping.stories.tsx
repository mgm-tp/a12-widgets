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
import type { ReactElement } from "react";
import { createContext, useCallback, useContext, useState } from "react";

import type { RowsGroup } from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon, Link } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableSlotProps,
	DataTableSlots
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable, DataTableRowsGroup } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Dessert, Employee } from "./data-table.data.js";
import { COLUMN_GROUP_COLUMNS, DESSERT_COLUMNS, DESSERT_GROUPS, DESSERTS, EMPLOYEES } from "./data-table.data.js";
import { useRowSelection, useSortedRows } from "./data-table.helpers.js";

const ToggleGroupContext = createContext<(groupIndex: number) => void>(() => undefined);

/**
 * Slot component declared at module scope (stable identity). Slots are mounted
 * components, so hooks — here `useContext` for the story's toggle handler —
 * are available.
 */
function CollapsibleGroupHeader({
	group,
	groupIndex,
	collapsed
}: DataTableSlotProps.RowGroupHeader<Dessert>): ReactElement {
	const toggleGroup = useContext(ToggleGroupContext);

	return (
		<Link
			useAsButton
			title={collapsed ? "Expand group" : "Collapse group"}
			linkAttributes={{ "aria-expanded": !collapsed }}
			onClick={() => toggleGroup(groupIndex)}
		>
			<Icon>{collapsed ? "chevron_right" : "expand_more"}</Icon>
			{group.head?.title}
		</Link>
	);
}

const GROUP_SLOTS: DataTableSlots<Dessert> = { rowGroupHeader: CollapsibleGroupHeader };
const dessertKey = (row: Dessert) => row.name;

function RowGroupingDemo() {
	const [data, setData] = useState<RowsGroup<Dessert>[]>(DESSERT_GROUPS);
	const { rowEventHandlers, rowStyling } = useRowSelection(dessertKey);

	const toggleGroup = useCallback((groupIndex: number) => {
		setData((prev) => prev.map((g, i) => (i === groupIndex ? { ...g, collapsed: !g.collapsed } : g)));
	}, []);

	return (
		<ToggleGroupContext.Provider value={toggleGroup}>
			<DataTableRowsGroup<Dessert>
				ariaLabel="Desserts grouped by category"
				data={data}
				columns={DESSERT_COLUMNS}
				rowKey="name"
				rowStyling={rowStyling}
				rowEventHandlers={rowEventHandlers}
				slots={GROUP_SLOTS}
			/>
		</ToggleGroupContext.Provider>
	);
}

const CROSS_TAB_COLUMNS: DataTableColumn<Dessert>[] = [
	{ ...DESSERT_COLUMNS[0], label: "Dessert name", verticalHeader: true, width: 1.5 },
	...DESSERT_COLUMNS.slice(1).map((column) => ({ ...column, sortable: true, width: undefined }))
];

function CrossTabulationDemo() {
	const { rows, sortOptions } = useSortedRows(DESSERTS);

	return (
		<DataTable<Dessert>
			ariaLabel="Nutrition cross-tabulation"
			data={rows}
			columns={CROSS_TAB_COLUMNS}
			sortOptions={sortOptions}
			cellHighlighting
		/>
	);
}

const meta: Meta<typeof DataTable<Employee>> = {
	title: "Data Display/DataTable/Grouping",
	component: DataTable,
	parameters: { layout: "padded" },
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATEFUL_DEMO = { controls: { disable: true } };

export const RowGrouping: Story = {
	render: () => <RowGroupingDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `// Slot components are mounted, so they may use hooks; give them the toggle via context.
const ToggleGroupContext = createContext<(groupIndex: number) => void>(() => undefined);

function CollapsibleGroupHeader({ group, groupIndex, collapsed }: DataTableSlotProps.RowGroupHeader<Dessert>) {
	const toggleGroup = useContext(ToggleGroupContext);

	return (
		<Link
			useAsButton
			title={collapsed ? "Expand group" : "Collapse group"}
			linkAttributes={{ "aria-expanded": !collapsed }}
			onClick={() => toggleGroup(groupIndex)}
		>
			<Icon>{collapsed ? "chevron_right" : "expand_more"}</Icon>
			{group.head?.title}
		</Link>
	);
}

const slots: DataTableSlots<Dessert> = { rowGroupHeader: CollapsibleGroupHeader };

// In the rendering component:
const [data, setData] = useState<RowsGroup<Dessert>[]>(dessertGroups);
const toggleGroup = (groupIndex: number) =>
	setData((prev) => prev.map((g, i) => (i === groupIndex ? { ...g, collapsed: !g.collapsed } : g)));

<ToggleGroupContext.Provider value={toggleGroup}>
	<DataTableRowsGroup<Dessert>
		ariaLabel="Desserts grouped by category"
		data={data}
		columns={dessertColumns}
		rowKey="name"
		slots={slots}
	/>
</ToggleGroupContext.Provider>`
			},
			description: {
				story:
					"`DataTableRowsGroup` accepts `data: RowsGroup<RowType>[]`. Provide the `rowGroupHeader` slot to render a collapsible header per group — toggle `group.collapsed` in state to expand/collapse. Row groups are not available in virtualized mode."
			}
		}
	}
};

export const ColumnGrouping: Story = {
	args: {
		ariaLabel: "Employees with grouped column headers",
		data: EMPLOYEES,
		columns: COLUMN_GROUP_COLUMNS,
		rowKey: "id"
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use `subColumns` on a `DataTableColumn` to nest leaf columns under a group header. The header renders as two rows; the group label spans its leaf columns with native `colSpan`/`rowSpan`. `pinning` is only allowed on the top-level column and is inherited by its leaves. Resizing grouped columns is covered under **Column Resizing**."
			}
		}
	}
};

export const CrossTabulation: Story = {
	name: "Cross-tabulation",
	render: () => <CrossTabulationDemo />,
	parameters: {
		...STATEFUL_DEMO,
		docs: {
			source: {
				language: "tsx",
				code: `const [sortState, setSortState] = useState<DataTableSortState>([]);
const rows = useMemo(() => sortRows(desserts, sortState), [sortState]);

const columns: DataTableColumn<Dessert>[] = [
	// The first column doubles as the row header of the cross-tab.
	{ label: "Dessert name", dataKey: "name", verticalHeader: true, width: 1.5, pinning: "left" },
	{ label: "Calories", dataKey: "calories", sortable: true },
	{ label: "Fat (g)", dataKey: "fat", sortable: true },
	{ label: "Carbs (g)", dataKey: "carbs", sortable: true },
	{ label: "Protein (g)", dataKey: "protein", sortable: true }
];

<DataTable<Dessert>
	ariaLabel="Nutrition cross-tabulation"
	data={rows}
	columns={columns}
	sortOptions={{ sortState, onSort: setSortState }}
	cellHighlighting
/>`
			},
			description: {
				story:
					"Set `verticalHeader: true` on the first column and enable `cellHighlighting` to produce a cross-tabulation layout. Hovering a cell highlights that cell along with the corresponding row vertical header and column header. Under `cellHighlighting` the cell — not the row — is the highlight unit, so no row-wide hover background is painted."
			}
		}
	}
};
