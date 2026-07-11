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

import type { FC, ReactNode } from "react";
import { useContext, useRef, useCallback, useEffect } from "react";
import { styled, css } from "styled-components";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from "react-virtualized";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { TableTemplate } from "./template/index.js";
import { StyledTableBodyRow } from "./template/table.body-row.tpl.view.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";
import { getRowKey } from "./table.utils.js";
import { useTableContext } from "./table.context.js";
import { StyledTableDnDBody, StyledTableDnDBodyHint } from "./table.dnd.view.js";

export const StyledTableVirtualizedBody = styled(TableTemplate.Body).withConfig({
	displayName: "StyledTableVirtualizedBody-sc-"
})(({ theme }) => {
	const { body } = theme.components.table;

	return css`
		.ReactVirtualized__List {
			border: ${body.border};
			outline: none;
			&:focus {
				border: ${body.focusBorder};
			}
			${StyledTableDnDBody} > div:not(${StyledTableDnDBodyHint}):not([data-role="${DataRoles.TreeTable.Dnd
				.Target}"]), ${StyledTableBodyRow} {
				height: 100%;
			}
		}
	`;
});

/** @internal */
export const VirtualizedBody: FC<TableRenderPropsType.VirtualizedBodyProps> = (props) => {
	const { tableTitles } = useContext(A11YLanguageContext);
	const rowKey = useTableContext((context) => context.rowKey);
	const gridInstance = useRef<List | null>(null);
	const rowRefs = useRef<(HTMLElement | null)[]>([]);

	const bodyRowRenderer = useTableContext((context) => {
		return context.dragDropOptions
			? context.componentRenderers.dndBodyRowRenderer
			: context.componentRenderers.bodyRowRenderer;
	});

	const { data, virtualScrollOptions, scrollToNode } = props;
	const { rowHeight, deferredMeasurementCache, style, listRef, ...restOptions } = virtualScrollOptions ?? {};

	const cacheRef = useRef(new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true }));

	const getRef = useCallback(
		(ref: List): void => {
			listRef?.(ref);
			gridInstance.current = ref;
		},
		[listRef]
	);

	// trigger update react-virtualized to recompute grid size when data change.
	useEffect(() => {
		if (gridInstance.current) {
			gridInstance.current.recomputeGridSize();
		}
	}, [data]);

	useEffect(() => {
		if (scrollToNode) {
			scrollToNode((nodeIndex, options) => {
				setTimeout(() => {
					gridInstance.current?.scrollToRow(nodeIndex);

					if (options?.autoFocus) {
						requestAnimationFrame(() => {
							const rowElement = rowRefs.current[nodeIndex];
							rowElement?.focus();
						});
					}
				});
			});
		}
	}, [scrollToNode]);

	return (
		// eslint-disable-next-line jsx-a11y/aria-role
		<StyledTableVirtualizedBody tabIndex={props.tabIndex ?? -1} role={false}>
			<AutoSizer>
				{({ height, width }): ReactNode => (
					<List
						ref={getRef}
						containerRole="rowgroup"
						role="rowgroup"
						height={height}
						width={width}
						style={style}
						rowCount={data.length}
						rowHeight={rowHeight ?? cacheRef.current.rowHeight}
						deferredMeasurementCache={rowHeight ? deferredMeasurementCache : cacheRef.current}
						rowRenderer={({ index, style, parent, key }): ReactNode => {
							const rowIndex = index;
							const row = data[rowIndex];
							const bodyRowKey = rowKey ? getRowKey(data[rowIndex], rowKey) : rowIndex;

							const registerRowRef = (element: HTMLElement | null) => {
								rowRefs.current[rowIndex] = element;
							};

							if (rowHeight) {
								return bodyRowRenderer({
									row,
									rowIndex,
									style,
									key: bodyRowKey,
									tabIndex: 0,
									wrapperRef: registerRowRef
								});
							}

							return (
								<CellMeasurer key={key} cache={cacheRef.current} parent={parent} rowIndex={rowIndex} columnIndex={0}>
									{({ measure, registerChild }): ReactNode => {
										const mergedRefCallback = (element: HTMLElement | null): void => {
											if (element && registerChild) {
												registerChild(element);
											}

											registerRowRef(element);
										};

										return bodyRowRenderer({
											row,
											rowIndex,
											style,
											key: bodyRowKey,
											tabIndex: 0,
											wrapperRef: mergedRefCallback,
											onRendered: measure,
											measureRowHeight: measure
										});
									}}
								</CellMeasurer>
							);
						}}
						{...restOptions}
						{...{ [`aria-label`]: tableTitles?.virtualizedBodyLabel }}
					/>
				)}
			</AutoSizer>
		</StyledTableVirtualizedBody>
	);
};

VirtualizedBody.displayName = "VirtualizedBody";
