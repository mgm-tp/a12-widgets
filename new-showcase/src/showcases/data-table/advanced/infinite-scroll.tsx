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

import type { DataTableColumn, DataTableRowLoadingStatus } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { Utils } from "../utils.js";

type RowType = Utils.Vehicle & { id: number };

const TOTAL_ROWS = 1000;
const NETWORK_LATENCY_MS = 600;

const columns: DataTableColumn<RowType>[] = [
	{ label: "No", dataKey: "id", width: 0.5, fixedWidth: true, pinning: "left" },
	{ label: "Vehicle", dataKey: "vehicle", width: 1.5 },
	{ label: "Manufacturer", dataKey: "manufacturer" },
	{ label: "Model", dataKey: "model" },
	{ label: "Type", dataKey: "type" },
	{ label: "Fuel", dataKey: "fuel" },
	{ label: "Color", dataKey: "color" }
];

export function InfiniteScrollTableShowcase(): ReactElement {
	// Stands in for the server: the full data set is only ever read in batches.
	const allRows = useMemo(
		() => Utils.generateVehicleData(TOTAL_ROWS).map((row, index) => ({ ...row, id: index + 1 })),
		[]
	);
	const [data, setData] = useState<(RowType | undefined)[]>(() => new Array(TOTAL_ROWS).fill(undefined));
	const [statusMap, setStatusMap] = useState<Record<number, DataTableRowLoadingStatus>>({});

	const loadData = useCallback(
		(range: { startIndex: number; stopIndex: number }) => {
			const stop = Math.min(range.stopIndex, TOTAL_ROWS - 1);

			setStatusMap((prev) => Utils.updateRowLoadingStatusMap(prev, { ...range, stopIndex: stop }, "loading"));

			return new Promise<void>((resolve) =>
				setTimeout(() => {
					setData((prev) => {
						const next = [...prev];

						for (let i = range.startIndex; i <= stop; i++) {
							next[i] = allRows[i];
						}

						return next;
					});
					setStatusMap((prev) => Utils.updateRowLoadingStatusMap(prev, { ...range, stopIndex: stop }, "loaded"));
					resolve();
				}, NETWORK_LATENCY_MS)
			);
		},
		[allRows]
	);

	return (
		<DataTable<RowType>
			ariaLabel="Vehicles (infinite scroll)"
			data={data as RowType[]}
			columns={columns}
			rowKey="id"
			maxHeight="70vh"
			infiniteScrollOptions={{
				rowHeight: 40,
				rowCount: TOTAL_ROWS,
				rowLoadingStatus: (index) => statusMap[index],
				loadData
			}}
		/>
	);
}
