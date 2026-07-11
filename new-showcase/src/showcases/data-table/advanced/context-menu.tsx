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
import { useMemo, useCallback, useState } from "react";

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	DataTableColumn,
	DataTableSlotProps,
	DataTableRowStyleGetter
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Icon, ButtonGroup, Button, PopUpMenu, List, provider } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { Transaction } from "../../../helpers/definitions.js";

import { Utils } from "../utils.js";

type RowType = Transaction;

/**
 * Context-menu content for body rows. Providing the `contextMenu` slot enables
 * the right-click context menu. Declared at module scope so the component
 * identity stays stable across renders.
 */
function RowContextMenu({ closeHandler, row, rowIndex }: DataTableSlotProps.ContextMenu<RowType>): ReactElement {
	return (
		<List border paddedRight>
			<List.Item
				text="Copy"
				graphic={<Icon>content_copy</Icon>}
				onClick={(): void => {
					alert(`Copy row with name ${row.name} at index ${rowIndex}`);
					closeHandler();
				}}
			/>
			<List.Item
				text="Paste"
				graphic={<Icon>content_paste</Icon>}
				onClick={(): void => {
					alert(`Paste row with name ${row.name} at index ${rowIndex}`);
					closeHandler();
				}}
			/>
			<List.Item
				text="Delete"
				graphic={<Icon>delete</Icon>}
				onClick={(): void => {
					alert(`Delete row with name ${row.name} at index ${rowIndex}`);
					closeHandler();
				}}
			/>
		</List>
	);
}

/**
 * Context-menu content for header cells. Providing the `headContextMenu` slot
 * enables the right-click context menu on the header.
 */
function HeadCellContextMenu({ closeHandler, column }: DataTableSlotProps.HeadContextMenu<RowType>): ReactElement {
	return (
		<List border paddedRight>
			<List.Item
				text="Show for all Options"
				graphic={<Icon>check</Icon>}
				onClick={(): void => {
					alert(`Click column with key ${column.dataKey}`);
					closeHandler();
				}}
			/>
			<List.Item
				text="Hide for all Options"
				graphic={<Icon>close</Icon>}
				onClick={(): void => {
					alert(`Click column with key ${column.dataKey}`);
					closeHandler();
				}}
			/>
			<List.Item
				text="Set as Default for all Options"
				graphic={<Icon>star</Icon>}
				onClick={(): void => {
					alert(`Click column with key ${column.dataKey}`);
					closeHandler();
				}}
			/>
		</List>
	);
}

export function ContextMenuTableShowcase(): ReactElement {
	const columns: DataTableColumn<Transaction>[] = useMemo(
		(): DataTableColumn<Transaction>[] => [
			{
				label: "Transaction Amount",
				dataKey: "amount",
				pinning: !provider.isDesktop() ? undefined : "left"
			},
			{
				label: (
					<Icon title="Day of Transaction" iconTheme="outlined">
						calendar_today
					</Icon>
				),
				dataKey: "date"
			},
			{
				label: "Business",
				dataKey: "business"
			},
			{ label: "Transaction Name", dataKey: "name" },
			{
				label: (
					<Icon title="Transaction Account" iconTheme="outlined">
						account_circle
					</Icon>
				),
				dataKey: "account"
			},
			{
				label: "",
				dataKey: "",
				pinning: "right",
				actionColumn: true,
				// Column-level render hook: owns the presentation of this column's body cells.
				renderCell: ({ row, rowIndex }): ReactElement => (
					<ButtonGroup>
						<Button disabled={rowIndex === 3} icon={<Icon>add</Icon>} title={`Add ${row.name}`} />
						<Button disabled={rowIndex === 3} destructive icon={<Icon>delete</Icon>} title={`Delete ${row.name}`} />
						<PopUpMenu
							headerTitle="Row Actions"
							disabled={rowIndex === 3}
							triggerButtonTitle={`Open row actions ${row.name}`}
							triggerButtonCloseTitle={`Close row actions ${row.name}`}
						>
							<List>
								<List.Item text="Insert above" graphic={<Icon iconTheme="custom">insert_above</Icon>} />
								<List.Item text="Insert below" graphic={<Icon iconTheme="custom">insert_below</Icon>} />
							</List>
						</PopUpMenu>
					</ButtonGroup>
				)
			}
		],
		[]
	);
	const data = useMemo(() => Utils.generateTransactionData(10), []);

	const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
	const rowStyling: DataTableRowStyleGetter<RowType> = useCallback(
		({ rowIndex }) => ({
			selected: selectedIndex === rowIndex,
			disabled: rowIndex === 3,
			disabledRightClickContextMenu: rowIndex === 3
		}),
		[selectedIndex]
	);

	const eventHandlers: RowEventHandlerGetter<RowType> = useCallback(
		({ rowIndex }) => ({
			onClick: (): void => setSelectedIndex((selectedIndex) => (selectedIndex === rowIndex ? undefined : rowIndex))
		}),
		[]
	);

	return (
		<DataTable<RowType>
			data={data}
			columns={columns}
			rowStyling={rowStyling}
			rowEventHandlers={eventHandlers}
			slots={{ contextMenu: RowContextMenu, headContextMenu: HeadCellContextMenu }}
		/>
	);
}
