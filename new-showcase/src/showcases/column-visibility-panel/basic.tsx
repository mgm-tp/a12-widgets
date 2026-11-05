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

import type { ReactElement, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import type {
	BaseColumnType,
	ColumnVisibilityItem,
	ColumnVisibilityMap,
	ColumnVisibilityPanelPresentation
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Badge,
	Button,
	ColumnVisibilityPanel,
	hasColumnVisibilityDeviation,
	Icon,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core";

interface Employee {
	id: number;
	name: string;
	department: string;
	role: string;
	location: string;
	warnings: string;
}

const EMPLOYEES: Employee[] = [
	{ id: 1, name: "Alice Smith", department: "Engineering", role: "Senior Engineer", location: "Munich", warnings: "" },
	{ id: 2, name: "Bob Johnson", department: "Sales", role: "Account Manager", location: "Hamburg", warnings: "2" },
	{ id: 3, name: "Carol Williams", department: "Marketing", role: "Designer", location: "Berlin", warnings: "" },
	{ id: 4, name: "David Brown", department: "Finance", role: "Analyst", location: "Prague", warnings: "1" }
];

/** A column definition plus what the panel needs to list it. */
interface ManagedColumn extends BaseColumnType<Employee> {
	id: string;

	/** The icon of the column's header cell, repeated in the panel's row. */
	panelIcon?: ReactNode;

	/** The name of a column whose header carries no text. */
	panelTitle?: string;

	/** A column the end user must not hide, e.g. a key or an action column. */
	hideable?: false;

	/** A column the table starts out without. It is what the panel's reset action returns to. */
	initiallyHidden?: boolean;
}

const COLUMNS: ManagedColumn[] = [
	{ id: "id", label: "ID", dataKey: "id", width: 0.4, fixedWidth: true, hideable: false },
	{ id: "name", label: "Name", dataKey: "name", width: 1.5, panelIcon: <Icon>person</Icon> },
	{ id: "department", label: "Department", dataKey: "department", width: 1.5 },
	{ id: "role", label: "Role", dataKey: "role", width: 1.5 },
	{ id: "location", label: "Location", dataKey: "location", width: 1, initiallyHidden: true },
	{
		id: "warnings",
		label: <Icon>warning</Icon>,
		hiddenText: "Warnings",
		dataKey: "warnings",
		width: 0.5,
		panelIcon: <Icon>warning</Icon>,
		panelTitle: "Warnings"
	}
];

export interface ColumnVisibilityShowcaseProps {
	/**
	 * Left at its default (`"auto"`) the panel is anchored to the trigger and turns into a modal on
	 * a small screen or a touch device.
	 */
	presentation?: ColumnVisibilityPanelPresentation;

	/** Adds a search field that narrows the list to the columns whose name matches. */
	searchable?: boolean;

	/** Adds an action that shows every column the list currently holds. */
	showAll?: boolean;
}

export function ColumnVisibilityShowcase({
	presentation,
	searchable,
	showAll
}: ColumnVisibilityShowcaseProps): ReactElement {
	const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
	const [open, setOpen] = useState(false);
	const [visibility, setVisibility] = useState<ColumnVisibilityMap>(() =>
		Object.fromEntries(COLUMNS.map((column) => [column.id, !column.initiallyHidden]))
	);

	const items: ColumnVisibilityItem[] = useMemo(
		() =>
			COLUMNS.map((column) => ({
				id: column.id,
				label: typeof column.label === "string" ? column.label : undefined,
				icon: column.panelIcon,
				title: column.panelTitle,
				visible: visibility[column.id] ?? true,
				disabled: column.hideable === false,
				defaultVisible: !column.initiallyHidden
			})),
		[visibility]
	);

	// Which columns the table renders is the consumer's business — the panel only reports the state.
	const visibleColumns = useMemo(() => COLUMNS.filter((column) => visibility[column.id] ?? true), [visibility]);

	const handleToggle = useCallback(() => setOpen((wasOpen) => !wasOpen), []);
	const handleClose = useCallback(() => setOpen(false), []);

	return (
		<div className="-u-width-full">
			<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
				<Button
					buttonRef={setTrigger}
					icon={<Icon>view_column</Icon>}
					title={open ? "Close column selection" : "Select columns"}
					badge={
						<Badge
							tiny
							light
							hidden={open || !hasColumnVisibilityDeviation(items)}
							title="The columns are customized"
						/>
					}
					buttonAttributes={{ "aria-expanded": open, "aria-haspopup": "dialog" }}
					onClick={handleToggle}
				/>
			</div>
			{open && (
				<ColumnVisibilityPanel
					items={items}
					triggerElement={trigger}
					presentation={presentation}
					searchable={searchable}
					showAll={showAll}
					onVisibilityChange={setVisibility}
					onClose={handleClose}
				/>
			)}
			<Table<Employee> data={EMPLOYEES} columns={visibleColumns} />
		</div>
	);
}
