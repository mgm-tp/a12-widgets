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
import { useMemo, useState, useCallback } from "react";

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableSlotProps,
	DataTableSortOrder,
	DataTableSortState,
	DataTableRowStyleGetter
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { ExternalLink, MailtoLink } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { ContextualCard } from "../../helpers/definitions.js";

import { Utils } from "./utils.js";
import { COLUMNS } from "./data.js";

type RowType = ContextualCard;

/**
 * Custom cell-content slot. Declared at module scope so the component identity
 * stays stable across renders. Falls back to `defaultContent` (the value
 * resolved from the column's `dataKey`) for all other columns.
 */
function ContextualCardCellContent(props: DataTableSlotProps.CellContent<RowType>): ReactNode {
	if (props.column.label === "Website") {
		return <ExternalLink href={props.row.website}>{props.row.website}</ExternalLink>;
	}

	if (props.column.label === "Email") {
		return <MailtoLink to={props.row.email}>{props.row.email}</MailtoLink>;
	}

	if (props.column.label === "Date of Birth") {
		return props.row.dob;
	}

	return props.defaultContent;
}

export function ColumnGroupAccessibility(): ReactElement {
	const data = useMemo(() => Utils.generateContextualCardData(5), []);
	const [sortedData, setSortedData] = useState(data);
	const [sortState, setSortState] = useState<DataTableSortState>([]);
	const [selectedRow, setSelectedRow] = useState<RowType | undefined>(undefined);

	const onSort = useCallback(
		(next: DataTableSortState, toggled: { columnId: string; order: DataTableSortOrder }) => {
			setSortState(next);

			const comparator = Utils.getDefaultComparator(toggled.columnId, toggled.order);
			setSortedData(comparator ? [...data].sort(comparator) : data);
		},
		[data]
	);

	const eventHandlers: RowEventHandlerGetter<RowType> = useCallback(
		({ row }) => ({ onClick: () => setSelectedRow(selectedRow === row ? undefined : row) }),
		[selectedRow]
	);

	const rowStyling: DataTableRowStyleGetter<RowType> = useCallback(
		({ row }) => ({
			selected: selectedRow === row,
			title: selectedRow === row ? "Selected" : "Selectable"
		}),
		[selectedRow]
	);

	return (
		<DataTable<RowType>
			data={sortedData}
			columns={COLUMNS}
			slots={{ cellContent: ContextualCardCellContent }}
			sortOptions={{ sortState, onSort }}
			rowEventHandlers={eventHandlers}
			rowStyling={rowStyling}
		/>
	);
}
