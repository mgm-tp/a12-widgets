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
import { useCallback, useMemo, useState } from "react";

import type { RowEventHandlerGetter } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableRowStyleGetter } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { Utils } from "./utils.js";

type RowType = Utils.Vehicle & { id: number };

const columns: DataTableColumn<RowType>[] = [
	{ label: "Vehicle", dataKey: "vehicle" },
	{ label: "Manufacturer", dataKey: "manufacturer" },
	{ label: "Model", dataKey: "model" },
	{ label: "Type", dataKey: "type" },
	{ label: "Fuel", dataKey: "fuel" },
	{ label: "Color", dataKey: "color" }
];

export function CardViewShowcase(): ReactElement {
	const data = useMemo(() => Utils.generateVehicleData(8).map((row, index) => ({ ...row, id: index + 1 })), []);
	const [selectedId, setSelectedId] = useState<number | undefined>();

	// Selection is wired exactly as in the table layout — card view shares the same model.
	const rowEventHandlers: RowEventHandlerGetter<RowType> = useCallback(
		({ row }) => ({ onClick: () => setSelectedId((prev) => (prev === row.id ? undefined : row.id)) }),
		[]
	);

	const rowStyling: DataTableRowStyleGetter<RowType> = useCallback(
		({ row }) => ({ selected: row.id === selectedId, interactive: true }),
		[selectedId]
	);

	return (
		<DataTable<RowType>
			ariaLabel="Vehicles (card view)"
			data={data}
			columns={columns}
			rowKey="id"
			cardView
			rowEventHandlers={rowEventHandlers}
			rowStyling={rowStyling}
		/>
	);
}
