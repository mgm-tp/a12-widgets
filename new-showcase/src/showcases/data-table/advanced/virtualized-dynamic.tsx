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
import { useMemo, useRef } from "react";

import { Button, ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DataTableColumn, DataTableVirtualizerHandle } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import { DataTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { Utils } from "../utils.js";

type RowType = Utils.Vehicle & { id: number; notes: string };

const columns: DataTableColumn<RowType>[] = [
	{ label: "No", dataKey: "id", width: 0.5, fixedWidth: true, pinning: "left" },
	{ label: "Vehicle", dataKey: "vehicle", width: 1.5 },
	// Free text of varying length — every row ends up with its own height.
	{ label: "Notes", dataKey: "notes", width: 4 }
];

export function VirtualizedDynamicHeightsShowcase(): ReactElement {
	const data = useMemo<RowType[]>(
		() =>
			Utils.generateVehicleData(1000).map((row, index) => ({
				...row,
				id: index + 1,
				notes: `${row.manufacturer} ${row.model}, ${row.type}, ${row.fuel}, ${row.color}. `.repeat((index % 5) + 1)
			})),
		[]
	);
	const virtualizer = useRef<DataTableVirtualizerHandle | null>(null);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<ButtonGroup>
				<Button onClick={() => virtualizer.current?.scrollToIndex(500, { align: "center" })}>Jump to row 500</Button>
				<Button onClick={() => virtualizer.current?.scrollToOffset(0)}>Back to top</Button>
			</ButtonGroup>
			<DataTable<RowType>
				ariaLabel="Vehicles (virtualized, dynamic row heights)"
				data={data}
				columns={columns}
				rowKey="id"
				maxHeight="60vh"
				// No `rowHeight`: rows are measured from the DOM. `estimatedRowHeight` sizes rows
				// that have not been measured yet; keep it close to the median row height.
				virtualScrollOptions={{ estimatedRowHeight: 56, virtualizerRef: virtualizer }}
			/>
		</div>
	);
}
