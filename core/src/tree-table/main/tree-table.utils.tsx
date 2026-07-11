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

import type { ReactNode } from "react";

import type { BaseColumnType } from "../../table/main/column.api.js";
import { getDataByKey, TableInternalUtils } from "../../table/main/table.utils.js";
import { provider } from "../../common/main/device-detector.js";

import type { BaseTreeTableColumnType, BaseTreeTableNode, FlattenTreeTableNode } from "./tree-table.api.js";

export function areRowsEqual<NodeType extends BaseTreeTableNode = BaseTreeTableNode>(
	row1: FlattenTreeTableNode<NodeType>,
	row2: FlattenTreeTableNode<NodeType>
): boolean {
	if (
		row1.id !== row2.id ||
		row1.icon !== row2.icon ||
		row1.data !== row2.data ||
		row1.parent !== row2.parent ||
		row1.level !== row2.level
	) {
		return false;
	}

	if (!row2.children && !row1.children) {
		return true;
	}

	if (row1.children && row2.children) {
		return (
			row1.children.length === row2.children.length &&
			row1.children.every((row, index) => row.id === row2.children?.[index].id)
		);
	}

	return false;
}

export function getNodeContent(
	row: FlattenTreeTableNode,
	column: BaseTreeTableColumnType,
	flattenColumns?: BaseTreeTableColumnType[]
): ReactNode {
	if (column.dataGetter) {
		return <>{column.dataGetter({ row, rowIndex: 0 })}</>; // rowIndex is always 0
	} else if (flattenColumns) {
		return getDataByKey(
			row.data,
			column.dataKey ?? TableInternalUtils.getColumnIndex(column as BaseColumnType, flattenColumns as BaseColumnType[])
		);
	}

	return null;
}

export function shouldHaveHiddenText<NodeType extends BaseTreeTableNode>(params: {
	data?: FlattenTreeTableNode<NodeType>[];
	hideRoot?: boolean;
	treeTableID?: string;
	ariaLabel?: string;
	isInteractiveTable?: boolean;
}): boolean {
	const { isInteractiveTable, ariaLabel, treeTableID, data, hideRoot } = params;

	const isMobileDevices = provider.isTablet() || provider.isPhone();
	const noContent = !data?.length;

	if (!treeTableID || isMobileDevices || noContent) {
		return false;
	}

	if (!hideRoot) {
		const includeVisibleRoot = data && data.length > 0;

		return includeVisibleRoot && (isInteractiveTable || !!ariaLabel);
	}

	const hasOnlyHiddenRoot = data && data.length === 1 && data[0].level === -1;
	const hasTreeNodesWithHiddenRoot = data && data.length > 1;

	if (hasOnlyHiddenRoot) {
		return false;
	}

	return hasTreeNodesWithHiddenRoot && (isInteractiveTable || !!ariaLabel);
}
