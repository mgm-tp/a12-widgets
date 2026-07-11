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

import type { ReactElement } from "react";
import { useMemo, useState, useCallback } from "react";

import type {
	RowEventHandlerGetter,
	RowStyleGetter,
	SortOptions,
	SortState,
	BaseColumnType,
	TableRenderPropsType,
	SortOrder,
	ColumnResizeEventHandler
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	provider,
	DefaultTableComponentRenderers,
	Table,
	ExternalLink,
	MailtoLink
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { ContextualCard } from "../../../helpers/definitions.js";

import { Utils } from "../utils.js";

type RowType = ContextualCard;
type ColumnType = BaseColumnType<RowType>;

const COLUMNS: ColumnType[] = [
	{
		label: "Name",
		dataKey: "name",
		pinning: "left",
		width: 0.7,
		sortable: true
	},
	{ label: "Username", dataKey: "username", sortable: true },
	{ label: "Phone", dataKey: "phone", sortable: true },
	{ label: "Date of Birth", dataKey: "dob" },
	{ label: "Email", dataKey: "email", width: 2 },
	{ label: "Website", dataKey: "website" },
	{ label: "Street", dataKey: "address.street", sortable: true },
	{ label: "City", dataKey: "address.city", sortable: true },
	{
		label: "Company",
		dataKey: "company.name",
		pinning: !provider.isDesktop() ? undefined : "right",
		sortable: true,
		width: 0.7
	},
	{
		label: "Business",
		dataKey: "company.bs",
		pinning: !provider.isDesktop() ? undefined : "right",
		sortable: true
	}
];

export function ResizableTableFlatShowcase(): ReactElement {
	const data = useMemo(() => Utils.generateContextualCardData(5), []);
	const [columns, setColumns] = useState(COLUMNS);
	const [sortedData, setSortedData] = useState(data);
	const [sortState, setSortState] = useState<SortState<ColumnType>>({});
	const [selectedRow, setSelectedRow] = useState<RowType | undefined>(undefined);

	const onSort: SortOptions<ColumnType>["onSort"] = useCallback(
		(params: { column: ColumnType; order: SortOrder }) => {
			setSortState(params);

			if (params.column.dataKey) {
				const comparator = Utils.getDefaultComparator(params.column.dataKey, params.order);
				setSortedData([...data].sort(comparator));
			} else {
				setSortedData(data);
			}
		},
		[data]
	);

	const eventHandlers: RowEventHandlerGetter<RowType> = useCallback(
		({ row }) => ({ onClick: () => setSelectedRow(selectedRow === row ? undefined : row) }),
		[selectedRow]
	);

	const rowStyling: RowStyleGetter<RowType> = useCallback(
		({ row }) => ({
			selected: selectedRow === row,
			title: selectedRow === row ? "Selected" : "Selectable"
		}),
		[selectedRow]
	);

	const onEndResize: ColumnResizeEventHandler<ColumnType> = useCallback(
		({ resizedWidthsGetter }): void => {
			setColumns((oldColumns) =>
				oldColumns.map((column) => {
					const newWidth = resizedWidthsGetter?.(column);

					if (newWidth === undefined) {
						return column;
					}

					const newColumn = { ...column, width: newWidth };

					if (column === sortState.column) {
						setSortState((prevSortState) => ({ ...prevSortState, column: newColumn }));
					}

					return newColumn;
				})
			);
		},
		[sortState]
	);

	const bodyContentRenderer = useCallback((props: TableRenderPropsType.BodyContentProps<RowType>) => {
		if (props.column.label === "Website") {
			return <ExternalLink href={props.row.website}>{props.row.website}</ExternalLink>;
		}

		if (props.column.label === "Email") {
			return <MailtoLink to={props.row.email}>{props.row.email}</MailtoLink>;
		}

		if (props.column.label === "Date of Birth") {
			return props.row.dob;
		}

		return DefaultTableComponentRenderers.bodyContentRenderer(props);
	}, []);

	return (
		<Table<RowType>
			data={sortedData}
			columns={columns}
			columnResizingOptions={{ onEndResize }}
			componentRenderers={{ bodyContentRenderer }}
			sortOptions={{ sortState, onSort }}
			rowEventHandlers={eventHandlers}
			rowStyling={rowStyling}
		/>
	);
}
