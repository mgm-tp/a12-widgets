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

import type { ReactNode, Key, ReactElement } from "react";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import type { InfiniteLoader, List as ReactVirtualizedList } from "react-virtualized";

import type { BaseColumnType, RowLoadingStatus, SortState } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Table,
	ResponsiveImageContainer,
	Icon,
	generateUid,
	provider as DeviceDetector
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { UserCard } from "../../helpers/definitions.js";
import { Utils } from "../../showcases/table/utils.js";

const ROW_COUNT = 2000;

type RowType = UserCard & { id: number };

type ColumnType = BaseColumnType<RowType>;

const columns: ColumnType[] = [
	{
		label: "Image",
		dataGetter: ({ row }): ReactNode => {
			const image = Math.floor(row.id % 9) + 1;

			return <ResponsiveImageContainer src={`images/user_avatar_${image}.png`} alt={`image ${image}`} />;
		},
		width: 0.9,
		pinning: "left"
	},
	{ label: "Name", dataKey: "name", sortable: true, pinning: !DeviceDetector.isPhone() ? "left" : undefined },
	{
		label: (
			<Icon iconTheme="outlined" title="Email">
				email
			</Icon>
		),
		dataKey: "email",
		sortable: true
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
	{ label: "Company", dataKey: "company.name" }
];

function getData(data: RowType[], { column, order }: SortState<ColumnType>): RowType[] {
	if (!column?.dataKey) {
		return data;
	}

	const comparator = Utils.getDefaultComparator(column.dataKey, order);

	return [...data].sort(comparator);
}

export function WithSortingShowcase(): ReactElement {
	const DATA: RowType[] = useMemo(
		() => Utils.generateUserCardData(ROW_COUNT).map((value, index) => ({ ...value, id: index })),
		[]
	);
	const [data, setData] = useState<RowType[]>([]);
	const [sortState, setSortState] = useState<SortState<ColumnType> | undefined>(undefined);
	const [rowStatusMap, setRowStatusMap] = useState<Record<number, RowLoadingStatus>>({});
	const requestId = useRef<string | null>(null);
	const loaderRef = useRef<InfiniteLoader | null>(null);
	const listRef = useRef<ReactVirtualizedList | null>(null);

	const isFirstRender = useRef<boolean | null>(true);
	const [overscanRange, setOverscanRange] = useState<{ start: number; stop: number } | null>(null);

	// this effect is to discard data of the rows that are too far from the current visible range
	// it is an advanced feature to save memory
	useEffect(() => {
		if (overscanRange) {
			const start = Math.max(overscanRange.start - 100, 0);
			const stop = Math.min(overscanRange.stop + 100, ROW_COUNT - 1);
			setData((current) => {
				const newData = [];

				for (let i = start; i <= stop; i++) {
					newData[i] = current[i];
				}

				return newData;
			});

			setRowStatusMap((current) => {
				const newData: Record<number, RowLoadingStatus> = {};

				for (let i = start; i <= stop; i++) {
					newData[i] = current[i];
				}

				return newData;
			});
		}
	}, [overscanRange]);

	// when sort state changes, the data and loading status map need to be reset
	useEffect(() => {
		if (!isFirstRender.current) {
			setData([]);
			setRowStatusMap({});
			requestId.current = generateUid();
		}
	}, [sortState]);

	const loadData = useCallback(
		(params: { startIndex: number; stopIndex: number }) => {
			setRowStatusMap((map) => Utils.updateRowLoadingStatusMap(map, params, "loading"));
			const currentId = requestId.current;

			return new Promise<void>((resolve) =>
				setTimeout(() => {
					if (currentId === requestId.current) {
						const allData = getData(DATA, sortState ?? {});
						setData((prevData) => {
							const nextData = [...prevData];

							for (let i = params.startIndex; i <= params.stopIndex; i++) {
								nextData[i] = allData[i];
							}

							return nextData;
						});
						setRowStatusMap((map) => Utils.updateRowLoadingStatusMap(map, params, "loaded"));
					}

					resolve();
				}, 2000 * Math.random())
			);
		},
		[DATA, sortState]
	);

	// when the data is reset, the table is scrolled to top and internal cache should be reset using resetLoadMoreRowsCache
	// additionally, it is necessary to fetch the initial batch again
	useEffect(() => {
		if (!isFirstRender.current && data.length === 0) {
			listRef.current?.scrollToRow(0);
			loaderRef.current?.resetLoadMoreRowsCache();
			void loadData({ startIndex: 0, stopIndex: 20 });
		}
	}, [loadData, data]);

	useEffect(() => {
		isFirstRender.current = false;
	}, []);

	return (
		<Table<RowType>
			style={{ height: 600 }}
			data={data}
			rowKey={({ row }): Key => row.id}
			columns={columns}
			sortOptions={{ sortState, onSort: setSortState }}
			infiniteScrollOptions={{
				rowLoadingStatus: (index): RowLoadingStatus => rowStatusMap[index],
				rowHeight: 90,
				loadData,
				rowCount: ROW_COUNT,
				loaderRef: (ref): void => {
					loaderRef.current = ref;
				},
				overrideListProps: {
					listRef: (ref): void => {
						listRef.current = ref;
					},
					onRowsRendered: (info): void => {
						setOverscanRange((current) => {
							if (current?.start === info.startIndex && current?.stop === info.stopIndex) {
								return current;
							}

							return { start: info.overscanStartIndex, stop: info.overscanStopIndex };
						});
					}
				}
			}}
		/>
	);
}
