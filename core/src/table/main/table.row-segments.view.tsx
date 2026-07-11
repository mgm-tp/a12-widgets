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

import type { FC, ComponentType, ReactNode } from "react";
import { useMemo, useCallback } from "react";

import type { TableTemplateProps } from "./template/table.tpl.api.js";
import type { BaseColumnType } from "./column.api.js";
import { useTableContext } from "./table.context.js";
import { getRowSegments } from "./table.utils.js";

/** @internal */
export const RowSegments: FC<RowSegments.Props> = ({ SegmentComponent, cellRenderer }) => {
	const columns = useTableContext((context) => context.columns);
	const rowSegments = useMemo(() => getRowSegments(columns), [columns]);
	const { left, scroll, right } = rowSegments;

	const segmentRenderer = useCallback(
		(columns: BaseColumnType[], segmentType: TableTemplateProps.RowSegmentType) => {
			const offset = segmentType === "left" ? 0 : segmentType === "scroll" ? left.length : left.length + scroll.length;

			return (
				columns.length > 0 && (
					<SegmentComponent type={segmentType} key={segmentType}>
						{columns.map((column, indexInSegment) => {
							const indexInRow = offset + indexInSegment;

							return cellRenderer({
								segmentType,
								column,
								indexInSegment,
								indexInRow,
								key: `${segmentType}-${indexInRow}` // Unique key for each child
							});
						})}
					</SegmentComponent>
				)
			);
		},
		[SegmentComponent, cellRenderer, left.length, scroll.length]
	);

	return (
		<>
			{segmentRenderer(left, "left")}
			{segmentRenderer(scroll, "scroll")}
			{segmentRenderer(right, "right")}
		</>
	);
};

RowSegments.displayName = "RowSegments";

export namespace RowSegments {
	export interface Props {
		/** @internal*/
		SegmentComponent: ComponentType<TableTemplateProps.RowSegmentProps>;

		/** @internal*/
		cellRenderer: CellRenderer;
	}

	export type CellRenderer = (props: {
		/** @internal*/
		column: BaseColumnType;

		/** @internal*/
		indexInRow: number;

		/** @internal*/
		indexInSegment: number;

		/** @internal*/
		segmentType: TableTemplateProps.RowSegmentType;

		/** @internal*/
		key?: string;
	}) => ReactNode;
}
