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
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import type {
	BaseColumnType,
	ColumnVisibilityItem,
	ColumnVisibilityMap,
	ColumnVisibilityPanelProps
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Badge,
	Button,
	ColumnVisibilityPanel,
	hasColumnVisibilityDeviation,
	Icon,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { Employee } from "../Table/table.data.js";
import { EMPLOYEES } from "../Table/table.data.js";

/** A column definition plus what the panel needs to list it. */
interface DemoColumn extends BaseColumnType<Employee> {
	id: string;
	icon?: ReactNode;
	panelTitle?: string;
	hideable?: false;
	initiallyHidden?: boolean;
}

const COLUMNS: DemoColumn[] = [
	{ id: "id", label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, hideable: false },
	{ id: "firstName", label: "First Name", dataKey: "firstName", width: 1, icon: <Icon>person</Icon> },
	{ id: "lastName", label: "Last Name", dataKey: "lastName", width: 1 },
	{ id: "department", label: "Department", dataKey: "department", width: 1.5 },
	{ id: "role", label: "Role", dataKey: "role", width: 1.5 },
	{ id: "status", label: "Status", dataKey: "status", width: 1, initiallyHidden: true }
];

const MANY_COLUMNS: DemoColumn[] = [
	...COLUMNS,
	...Array.from({ length: 12 }, (_, index) => ({
		id: `metric-${index}`,
		label: `Quarterly performance metric number ${index + 1}, including the year-over-year comparison`,
		dataKey: "role" as const,
		width: 1.5,
		initiallyHidden: index > 2
	}))
];

const ICON_COLUMNS: DemoColumn[] = [
	{ id: "id", label: "ID", dataKey: "id", width: 0.4, fixedWidth: true },
	{ id: "firstName", label: "First Name", dataKey: "firstName", width: 1, icon: <Icon>person</Icon> },
	{
		// A column whose header carries an icon only: the panel names its row by `title`.
		id: "status",
		label: <Icon>warning</Icon>,
		dataKey: "status",
		width: 0.6,
		icon: <Icon>warning</Icon>,
		panelTitle: "Warnings",
		hiddenText: "Warnings"
	},
	{ id: "role", label: "Role", dataKey: "role", width: 1.5 }
];

interface DemoProps extends Partial<ColumnVisibilityPanelProps> {
	columns?: DemoColumn[];
}

function ColumnVisibilityDemo({ columns = COLUMNS, ...panelProps }: DemoProps): ReactNode {
	const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
	const [open, setOpen] = useState(false);
	const [visibility, setVisibility] = useState<ColumnVisibilityMap>(() =>
		Object.fromEntries(columns.map((column) => [column.id, !column.initiallyHidden]))
	);

	const items: ColumnVisibilityItem[] = useMemo(
		() =>
			columns.map((column) => ({
				id: column.id,
				label: typeof column.label === "string" ? column.label : undefined,
				icon: column.icon,
				title: column.panelTitle,
				visible: visibility[column.id] ?? true,
				disabled: column.hideable === false,
				defaultVisible: !column.initiallyHidden
			})),
		[columns, visibility]
	);

	// Hiding a column is the consumer's business: the table is given fewer columns.
	const visibleColumns = useMemo(
		() => columns.filter((column) => visibility[column.id] ?? true),
		[columns, visibility]
	);

	const handleToggle = useCallback(() => setOpen((wasOpen) => !wasOpen), []);
	const handleClose = useCallback(() => setOpen(false), []);

	return (
		<>
			<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
				<Button
					buttonRef={setTrigger}
					icon={<Icon>view_column</Icon>}
					title={open ? "Close column selection" : "Select columns"}
					badge={<Badge tiny light hidden={open || !hasColumnVisibilityDeviation(items)} title="Columns customized" />}
					buttonAttributes={{ "aria-expanded": open, "aria-haspopup": "dialog" }}
					onClick={handleToggle}
				/>
			</div>
			{open && (
				<ColumnVisibilityPanel
					items={items}
					triggerElement={trigger}
					onVisibilityChange={setVisibility}
					onClose={handleClose}
					{...panelProps}
				/>
			)}
			<Table<Employee> data={EMPLOYEES} columns={visibleColumns} />
		</>
	);
}

const meta: Meta = {
	title: "Data Display/Column Visibility Panel",
	parameters: { layout: "padded" }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => <ColumnVisibilityDemo />,
	parameters: {
		docs: {
			description: {
				story:
					"The panel lists the table's columns and reports the visibility the user asks for. The trigger button, " +
					"where it sits and which columns the table then renders stay with the consumer. `Status` starts out " +
					"hidden through `defaultVisible: false`, which is also what the reset action returns to. `ID` is listed " +
					"as `disabled`, which is how a column that must not be hidden — a key column, an action column, the " +
					"hierarchical column of a tree — is shown; the reset action leaves it as it is."
			}
		}
	}
};

export const IconOnlyColumn: Story = {
	name: "Icon-only Column",
	render: () => <ColumnVisibilityDemo columns={ICON_COLUMNS} />,
	parameters: {
		docs: {
			description: {
				story:
					"An item without a `label` renders its `icon` alone and is named by its `title`, so that the row still " +
					"has an accessible name. An item with neither renders an empty row."
			}
		}
	}
};

export const LongList: Story = {
	name: "Long List and Long Labels",
	render: () => <ColumnVisibilityDemo columns={MANY_COLUMNS} />,
	parameters: {
		docs: {
			description: {
				story:
					"Once the list is longer than the themed maximum height it scrolls while the title and the reset action " +
					"stay pinned. Labels longer than the themed width band wrap instead of widening the panel " +
					"(`theme.components.columnVisibilityPanel.minWidth` / `maxWidth` / `list.maxHeight`)."
			}
		}
	}
};

export const SearchAndShowAll: Story = {
	name: "Search and Show All",
	render: () => <ColumnVisibilityDemo columns={MANY_COLUMNS} searchable showAll />,
	parameters: {
		docs: {
			description: {
				story:
					"For a table with more columns than fit on a screen, `searchable` adds a search field that narrows the list " +
					"by column name (by `title` where the label is not a text) and takes the focus when the panel opens, and " +
					"`showAll` adds an action that shows every column the list currently holds. While a search narrows the " +
					"list, show-all applies to the narrowed list only — to what the user can see — and never to a disabled row."
			}
		}
	}
};

export const ModalPresentation: Story = {
	render: () => <ColumnVisibilityDemo presentation="modal" />,
	parameters: {
		docs: {
			description: {
				story:
					'`presentation="modal"` puts the panel in a modal overlay with an explicit close button, which is what ' +
					'`presentation="auto"` (the default) does on its own on a small screen or a touch device.'
			}
		}
	}
};

export const CloseOnTabOut: Story = {
	render: () => <ColumnVisibilityDemo closeOnTabOut />,
	parameters: {
		docs: {
			description: {
				story:
					"By default TAB cycles inside the dialog until ESC, an outside click or the close button closes it. " +
					"With `closeOnTabOut`, shown here, tabbing past the last row closes the panel and returns the focus to " +
					"the trigger, so that tabbing on continues where the panel was opened."
			}
		}
	}
};
