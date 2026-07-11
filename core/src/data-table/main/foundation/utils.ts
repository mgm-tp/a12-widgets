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

import { get } from "lodash-es";
import type { ReactNode } from "react";

import type { BaseColumnType } from "./column.api.js";

/**
 * Read a value out of a row by a `lodash.get`-style key path.
 */
export function getDataByKey<RowType>(row: RowType, key: string | number): ReactNode {
	return get(row, key);
}

/**
 * Flatten nested columns into a single list of leaf columns.
 */
export function flattenAllColumns<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
>(columns: ColumnType[]): ColumnType[] {
	const result: ColumnType[] = [];
	columns.forEach((col) => {
		if (!col.subColumns || col.subColumns.length === 0) {
			result.push(col);
		} else if (col.subColumns.length > 0) {
			result.push(...flattenAllColumns<RowType, ColumnType>(col.subColumns as ColumnType[]));
		}
	});

	return result;
}

/**
 * Check whether a column has sub columns.
 */
export function isColumnGroup<RowType>(
	column: BaseColumnType<RowType>
): column is BaseColumnType<RowType> & { subColumns: BaseColumnType<RowType>[] } {
	return !!(column.subColumns && column.subColumns.length > 0);
}

const hasSubColumns = <T>(
	column: BaseColumnType<T> | undefined
): column is BaseColumnType<T> & { subColumns: NonNullable<BaseColumnType<T>["subColumns"]> } =>
	!!column?.subColumns?.length;

const getDistanceToFarthestLeaf = <T>(column: BaseColumnType<T>): number =>
	hasSubColumns(column) ? 1 + Math.max(...column.subColumns.map(getDistanceToFarthestLeaf)) : 0;

/**
 * The maximum nesting depth of a set of columns (1 for a flat list).
 */
export const getMaxColumnDepth = <T>(columns: BaseColumnType<T>[]): number =>
	columns?.length ? Math.max(...columns.map((column) => 1 + getDistanceToFarthestLeaf(column))) : 1;
