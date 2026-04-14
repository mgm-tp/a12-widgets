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
import { useMemo } from "react";

import type { TableDragDropOptions, BaseColumnType, TableRenderPropsType } from "@com.mgmtp.a12.widgets/widgets-core";
import { Table } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DragAndDrop, TreeDragItem, TreeDropTarget } from "./showcase-drag-and-drop.api.js";

export type TableDragItem = TableRenderPropsType.DragObject<DragAndDrop.TableRow>;
export function isTableDragItem(o: any): o is TableDragItem {
	return o["rowIndex"] !== undefined && o["row"]?.["position"]?.["component"] === "table";
}

export type TableDropResult = TableRenderPropsType.DropResult<DragAndDrop.TableRow>;
export function isTableDropResult(o: any): o is TableDropResult {
	return o["rowIndex"] !== undefined && o["row"]?.["position"]?.["component"] === "table";
}

export type TableHoveredObject = TableRenderPropsType.HoveredObject<DragAndDrop.TableRow>;
export function isTableHoveredObject(o: any): o is TableHoveredObject {
	return o["rowIndex"] !== undefined && o["row"]?.["position"]?.["component"] === "table";
}

type TableDndOptions = TableDragDropOptions<
	DragAndDrop.TableRow,
	TreeDragItem | TableDragItem,
	TreeDropTarget | TableDropResult
>;
export interface DragAndDropTableProps {
	data: DragAndDrop.TableRow[];
	onDrop: NonNullable<TableDndOptions["onDrop"]>;
	canDrop: NonNullable<TableDndOptions["canDrop"]>;
	acceptType?: string;
}

const COLUMNS: BaseColumnType<DragAndDrop.TableRow>[] = [
	{ label: "Name", pinning: "left" },
	{ label: "Workplace" },
	{ label: "Phone Number" },
	{ label: "Description" }
];

export function DragAndDropTable(props: DragAndDropTableProps): ReactElement<DragAndDropTableProps> {
	const columns = useMemo<BaseColumnType<DragAndDrop.TableRow>[]>(() => {
		return COLUMNS.map((column, index) => ({
			...column,
			dataGetter: ({ row }) => row.data[index]
		}));
	}, []);

	return (
		<Table
			data={props.data}
			columns={columns}
			dragDropOptions={{ acceptType: props.acceptType, onDrop: props.onDrop, canDrop: props.canDrop }}
		/>
	);
}
