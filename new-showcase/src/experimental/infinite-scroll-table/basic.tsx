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

import type { ReactNode, ReactElement } from "react";
import { useMemo, useState, useCallback } from "react";

import type { BaseColumnType, RowLoadingStatus } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Table,
	Button,
	ButtonGroup,
	Icon,
	CssEllipsis,
	provider as DeviceDetector
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { UserCard } from "../../helpers/definitions.js";
import { Utils } from "../../showcases/table/utils.js";

export type RowType = UserCard;

const ROW_COUNT = 500;

const columns: BaseColumnType<RowType>[] = [
	{ label: "Name", dataKey: "name", pinning: !DeviceDetector.isPhone() ? "left" : undefined },
	{
		label: "Contact",
		subColumns: [
			{ label: "Email", dataKey: "email" },
			{ label: "Phone number", dataKey: "phone" }
		]
	},
	{ label: "Website", dataKey: "website" },
	{ label: "Company", width: 0.8, dataGetter: ({ row }) => <CssEllipsis useTooltip>{row.company.name}</CssEllipsis> },
	{
		dataGetter: ({ rowIndex }): ReactNode =>
			rowIndex % 2 === 0 ? (
				<Button title="Remove" icon={<Icon>remove_circle</Icon>} />
			) : (
				<ButtonGroup>
					<Button title="Remove" icon={<Icon>remove_circle</Icon>} />
					<Button title="Add" icon={<Icon>add</Icon>} />
				</ButtonGroup>
			),
		label: "",
		fixedWidth: true,
		width: 0.8,
		pinning: "right"
	}
];

export function BasicShowcase(): ReactElement {
	const DATA: RowType[] = useMemo(() => Utils.generateUserCardData(ROW_COUNT), []);
	const [data, setData] = useState<(RowType | undefined)[]>([]);

	const [rowStatusMap, setRowStatusMap] = useState<Record<number, RowLoadingStatus>>({});

	const loadData = useCallback(
		(params: { startIndex: number; stopIndex: number }) => {
			setRowStatusMap((map) => Utils.updateRowLoadingStatusMap(map, params, "loading"));

			return new Promise<void>((resolve) =>
				setTimeout(() => {
					setData((data) => {
						const newData = [...data];

						for (let rowIndex = params.startIndex; rowIndex <= params.stopIndex; rowIndex++) {
							newData[rowIndex] = DATA[rowIndex];
						}

						return newData;
					});
					setRowStatusMap((current) => Utils.updateRowLoadingStatusMap(current, params, "loaded"));
					resolve();
				}, 2000 * Math.random())
			);
		},
		[DATA]
	);

	return (
		<Table<RowType>
			data={data}
			columns={columns}
			style={{ height: 600 }}
			infiniteScrollOptions={{
				rowLoadingStatus: (index): RowLoadingStatus => rowStatusMap[index],
				rowHeight: 50,
				loadData,
				rowCount: ROW_COUNT
			}}
		/>
	);
}
