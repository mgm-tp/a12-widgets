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
import { useContext, useRef, useEffect } from "react";
import type { Index } from "react-virtualized";
import { AutoSizer, InfiniteLoader, List } from "react-virtualized";
import { styled } from "styled-components";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { TableRenderPropsType } from "./table-renderer.api.js";
import { getRowKey } from "./table.utils.js";
import { useTableContext } from "./table.context.js";
import { StyledTableVirtualizedBody } from "./table.virtualized-body.view.js";

const StyledInfiniteScrollBodyWrapper = styled.div.withConfig({
	displayName: "StyledInfiniteScrollBodyWrapper-sc-"
})`
	position: relative;
	overflow: hidden;
`;

const StyledInfiniteScrollPlaceholderBackground = styled.div.withConfig({
	displayName: "StyledInfiniteScrollPlaceholderBackground-sc-"
})`
	position: absolute;
	top: 0;
	left: 0;
	overflow: hidden;
	pointer-events: none;
`;

const StyledPlaceholderBackgroundItem = styled.div.withConfig({
	displayName: "StyledPlaceholderBackgroundItem-sc-"
})<{ $top: number; $height: number; $width: number }>`
	position: absolute;
	top: ${({ $top }) => $top}px;
	height: ${({ $height }) => $height}px;
	left: 0;
	width: ${({ $width }) => $width}px;
`;

/** @internal */
export const InfiniteScrollBody: FC<TableRenderPropsType.InfiniteScrollBodyProps> = (props) => {
	const { tableTitles } = useContext(A11YLanguageContext);
	const rowKeyApi = useTableContext((context) => context.rowKey);
	const gridInstance = useRef<List | null>(null);
	const rowRefs = useRef<(HTMLElement | null)[]>([]);
	const bodyRowRenderer = useTableContext((context) => {
		return context.dragDropOptions
			? context.componentRenderers.dndBodyRowRenderer
			: context.componentRenderers.bodyRowRenderer;
	});
	const placeHolderBodyRowRenderer = useTableContext(
		(context) => context.componentRenderers.placeHolderBodyRowRenderer
	);
	const { data, infiniteScrollOptions, scrollToNode } = props;
	const {
		rowLoadingStatus,
		rowHeight,
		rowCount,
		loadData,
		loaderRef,
		overrideListProps,
		threshold = 15,
		minimumBatchSize = 10
	} = infiniteScrollOptions;

	const { listRef, onRowsRendered: overrideOnRowRendered, style, ...restListProps } = overrideListProps ?? {};

	const isRowLoaded = ({ index }: Index): boolean => {
		return !!rowLoadingStatus(index);
	};

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
				{({ width, height }): ReactNode => {
					const viewportPlaceholderCount = Math.ceil(height / rowHeight);

					return (
						<StyledInfiniteScrollBodyWrapper style={{ width, height }}>
							<StyledInfiniteScrollPlaceholderBackground aria-hidden="true" style={{ width, height }}>
								{Array.from({ length: viewportPlaceholderCount }, (_, i) => (
									<StyledPlaceholderBackgroundItem
										key={`placeholder-bg-${i}`}
										$top={i * rowHeight}
										$height={rowHeight}
										$width={width}
									>
										{placeHolderBodyRowRenderer({
											rowIndex: i,
											role: "presentation"
										})}
									</StyledPlaceholderBackgroundItem>
								))}
							</StyledInfiniteScrollPlaceholderBackground>
							<InfiniteLoader
								ref={loaderRef}
								rowCount={rowCount}
								isRowLoaded={isRowLoaded}
								loadMoreRows={loadData}
								threshold={threshold}
								minimumBatchSize={minimumBatchSize}
							>
								{({ onRowsRendered, registerChild }): ReactNode => (
									<List
										containerRole="rowgroup"
										role="rowgroup"
										data-role={DataRoles.Table.Infinite.Row.Group}
										ref={(list): void => {
											registerChild(list);
											listRef?.(list);
											gridInstance.current = list;
										}}
										rowCount={rowCount}
										rowHeight={rowHeight}
										width={width}
										height={height}
										style={style}
										onRowsRendered={(info): void => {
											onRowsRendered(info);
											overrideOnRowRendered?.(info);
										}}
										rowRenderer={({ index, style, key }): ReactNode => {
											const row = data[index];

											const registerRowRef = (element: HTMLElement | null) => {
												rowRefs.current[index] = element;
											};

											if (rowLoadingStatus(index) === "loaded" && row) {
												const rowKey = rowKeyApi ? getRowKey(row, rowKeyApi) : key;

												return bodyRowRenderer({
													key: rowKey,
													row,
													rowIndex: index,
													style,
													role: "row",
													wrapperRef: registerRowRef
												});
											}

											return placeHolderBodyRowRenderer({ key, rowIndex: index, style, role: "row" });
										}}
										{...{ [`aria-label`]: tableTitles?.virtualizedBodyLabel }}
										{...restListProps}
									/>
								)}
							</InfiniteLoader>
						</StyledInfiniteScrollBodyWrapper>
					);
				}}
			</AutoSizer>
		</StyledTableVirtualizedBody>
	);
};

InfiniteScrollBody.displayName = "InfiniteScrollBody";
