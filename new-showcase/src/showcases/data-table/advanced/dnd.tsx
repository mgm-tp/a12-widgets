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
import { useState } from "react";

import type { DataTableDragDropOptions, DataTableColumn } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { Button, Icon, provider } from "@com.mgmtp.a12.widgets/widgets-core";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { UserCard } from "../../../helpers/definitions.js";

import { Utils } from "../utils.js";

type RowType = UserCard & { index: number };
const columns: DataTableColumn<RowType>[] = [
	{ label: "No", dataKey: "index", pinning: !provider.isDesktop() ? undefined : "left", width: 0.5 },
	{ label: "Name", dataKey: "name", pinning: !provider.isDesktop() ? undefined : "left" },
	{
		label: (
			<Icon iconTheme="outlined" title="Email">
				email
			</Icon>
		),
		dataKey: "email"
	},
	{ label: "Address", dataKey: "address.street" },
	{
		label: (
			<Icon iconTheme="outlined" title="Phone">
				contact_phone
			</Icon>
		),
		dataKey: "phone"
	},
	{ label: "Website", dataKey: "website" },
	{ label: "Company", dataKey: "company.name" },
	{
		label: "",
		actionColumn: true,
		pinning: "right",
		// Column-level render hook: owns the presentation of this column's body cells.
		renderCell: ({ row }) => <Button icon={<Icon>delete</Icon>} title={`Delete ${row.index}`} />
	}
];

export function DnDTableShowcase(): ReactElement {
	const data = Utils.generateUserCardData(20).map((d, i) => ({ ...d, index: i + 1 }));
	const [stateData, setStateData] = useState<RowType[]>(data);

	const onDrop: DataTableDragDropOptions["onDrop"] = ({ dragItem, dropResult }) => {
		const currentData = [...stateData];
		const movedItem = currentData[dragItem.rowIndex];
		let newIndex = dropResult.rowIndex;

		if (dragItem.rowIndex < dropResult.rowIndex) {
			// moving row downward, therefore subtract from droppedIndex since the dragged item is not in its place anymore
			newIndex = dropResult.rowIndex - 1;
		}

		currentData.splice(dragItem.rowIndex, 1);
		currentData.splice(newIndex, 0, movedItem);
		setStateData(currentData);
	};

	return (
		<DataTable<RowType>
			data={stateData}
			columns={columns}
			dragDropOptions={{
				onDrop
			}}
		/>
	);
}
