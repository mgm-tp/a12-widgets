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

import type { MouseEvent, CSSProperties } from "react";
import { memo, useMemo, useEffect, useCallback } from "react";

import { joinClassNames } from "../../common/main/utils.js";

import { TableTemplate } from "./template/index.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";
import { useTableContext } from "./table.context.js";
import { RowSegments } from "./table.row-segments.view.js";
import { TableInternalUtils } from "./table.utils.js";
import { getColumnSpan, getMaxColumnDepth } from "./template/table-head-grid/table-head-grid.utils.js";

/** @internal */
export const BodyRow = memo(function BodyRow(props: TableRenderPropsType.BodyRowProps) {
	const bodyCellRenderer = useTableContext((context) => context.componentRenderers.bodyCellRenderer);
	const additionalContentRenderer = useTableContext((context) => context.componentRenderers.additionalContentRenderer);
	const cardView = useTableContext((context) => context.cardView);
	const hasVirtualScroll = useTableContext((context) => !!context.virtualScrollOptions);
	const columns = useTableContext((context) => context.columns);
	const enableColumnGroupA11y = useTableContext((context) => context.enableColumnGroupA11y);

	const {
		row,
		rowIndex,
		className,
		style,
		title,
		role,
		selected,
		highlightVariant,
		highlighted,
		disabled,
		interactive: propsInteractive,
		onClick: propsOnClick,
		measureRowHeight,
		wrapperRef,
		...rest
	} = props;

	const tableDisabled = useTableContext((context) => context.disabled);
	const rowStylesDisabled = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.disabled);
	const rowStylesHighlightVariant = useTableContext(
		(context) => context.rowStyling?.({ row, rowIndex })?.highlightVariant
	);
	const rowStylesSelected = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.selected);
	const rowStylesHighlighted = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.highlighted);
	const rowStylesInteractive = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.interactive);
	const rowStylesStyle = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.style);
	const rowStylesClassName = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.className);
	const rowStylesTitle = useTableContext((context) => context.rowStyling?.({ row, rowIndex })?.title);
	const cellHighlighting = useTableContext((context) => context.cellHighlighting);

	const isDisabled = tableDisabled ?? disabled ?? rowStylesDisabled;
	const rowHighlightVariant = highlightVariant ?? rowStylesHighlightVariant;
	const isSelected = selected ?? rowStylesSelected;

	const rowEventHandlers = useTableContext((context) => context.rowEventHandlers);
	const setIsInteractiveTable = useTableContext((context) => context.setIsInteractiveTable);

	const onClick = useMemo(() => {
		const onClickHandler = rowEventHandlers?.({ row, rowIndex }).onClick;

		if (propsOnClick || onClickHandler) {
			return (event: MouseEvent<HTMLElement>): void => {
				propsOnClick?.(event);
				onClickHandler?.(event);
			};
		} else {
			return undefined;
		}
	}, [propsOnClick, row, rowEventHandlers, rowIndex]);

	const isInteractiveBodyRow = useTableContext((context) => {
		// Disable interactive state when enable cellHighlighting mode
		if (cellHighlighting) {
			return false;
		}

		const hasOnClick = !!propsOnClick || !!context.rowEventHandlers?.({ row, rowIndex })?.onClick;

		return propsInteractive ?? rowStylesInteractive ?? hasOnClick;
	});

	useEffect(() => {
		setIsInteractiveTable?.((value: boolean) => value || isInteractiveBodyRow);
	}, [isInteractiveBodyRow, setIsInteractiveTable]);

	const styles: {
		bodyRow: CSSProperties;
		expandableBodyRowWrapper?: CSSProperties;
	} = useMemo(() => {
		if (hasVirtualScroll && additionalContentRenderer) {
			const { virtualizedStyles, nonVirtualizedStyles } = TableInternalUtils.splitVirtualizedStyles(style ?? {});

			return {
				bodyRow: { ...rowStylesStyle, ...nonVirtualizedStyles },
				expandableBodyRowWrapper: virtualizedStyles
			};
		}

		return { bodyRow: { ...rowStylesStyle, ...style } };
	}, [additionalContentRenderer, rowStylesStyle, style, hasVirtualScroll]);

	const cellRenderer: RowSegments.CellRenderer = useCallback(
		({ column, segmentType, indexInRow }) => {
			let ariaColIndex: number | undefined;

			if (enableColumnGroupA11y) {
				ariaColIndex =
					1 +
					columns.slice(0, indexInRow).reduce((count, col) => {
						return count + getColumnSpan(col);
					}, 0);
			}

			if (segmentType === "right") {
				return bodyCellRenderer({
					key: indexInRow,
					column,
					row,
					rowIndex,
					...(ariaColIndex !== undefined && { ariaColIndex })
				});
			}

			const firstCell = indexInRow === 0;
			const useSelectedTitle = isSelected && firstCell;
			const useHighlightTitle = firstCell ? rowHighlightVariant : undefined;

			return bodyCellRenderer({
				key: indexInRow,
				column,
				row,
				rowIndex,
				firstCell,
				useSelectedTitle,
				useHighlightTitle,
				...(ariaColIndex !== undefined && { ariaColIndex })
			});
		},
		[bodyCellRenderer, isSelected, row, rowHighlightVariant, rowIndex, enableColumnGroupA11y, columns]
	);

	const additionalContent = useMemo(() => {
		return additionalContentRenderer?.({ row, rowIndex, measureRowHeight });
	}, [additionalContentRenderer, row, rowIndex, measureRowHeight]);

	// Calculate aria-rowindex based on header row count
	const ariaRowIndex = useMemo(() => {
		if (cardView || !enableColumnGroupA11y) {
			return undefined;
		}

		// For enhanced accessibility mode, calculate header rows
		const headerRowCount = getMaxColumnDepth(columns);

		return headerRowCount + rowIndex + 1;
	}, [cardView, enableColumnGroupA11y, columns, rowIndex]);

	const content = (
		<TableTemplate.BodyRow
			{...rest}
			wrapperRef={additionalContent ? undefined : wrapperRef}
			selected={isSelected && !cellHighlighting} // Disable selected state when enable cellHighlighting mode
			onClick={onClick}
			interactive={isInteractiveBodyRow}
			highlightVariant={rowHighlightVariant}
			highlighted={highlighted ?? rowStylesHighlighted}
			style={styles.bodyRow}
			className={joinClassNames(className, rowStylesClassName)}
			title={title ?? rowStylesTitle}
			disabled={isDisabled}
			role={role ?? (cardView ? "list" : undefined)}
			ariaSelected={!cardView ? !!isSelected : undefined}
			ariaRowIndex={ariaRowIndex}
		>
			<RowSegments SegmentComponent={TableTemplate.BodyRowSegment} cellRenderer={cellRenderer} />
		</TableTemplate.BodyRow>
	);

	return additionalContentRenderer ? (
		<TableTemplate.ExpandableBodyRowWrapper style={styles.expandableBodyRowWrapper} wrapperRef={wrapperRef}>
			{content}
			{additionalContent}
		</TableTemplate.ExpandableBodyRowWrapper>
	) : (
		content
	);
});

BodyRow.displayName = "BodyRow";
