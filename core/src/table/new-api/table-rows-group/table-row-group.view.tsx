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

import type { FunctionComponent, ReactNode, ReactElement } from "react";
import { useRef, useEffect, useMemo } from "react";
import { styled, useTheme } from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { TableTemplate } from "../../main/template/index.js";
import { addPrefix } from "../../../common/main/utils.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";

import type { TableComponentRenderers, TableRenderPropsType } from "../table-renderer.api.js";
import {
	flattenRowsGroup,
	TableInternalUtils,
	getDataByKey,
	getRowKey,
	identifyRowsGroup,
	isGroupHead,
	isIdenticalRow,
	isRowGroup
} from "../table.utils.js";
import { Table, DefaultTableComponentRenderers } from "../table.view.js";
import { useTableContext } from "../table.context.js";
import { RowGroupHeader } from "../table.row-group-header.view.js";

import type {
	BaseTableRowsGroupColumnType,
	TableRowsGroupProps,
	TableRowsGroupRowType
} from "./table-row-group.api.js";

const animationClassName = addPrefix("table-row-group-animation");

const StyledSubRowWrapper = styled.div.withConfig({ displayName: "StyledSubRowWrapper-sc-" })`
	overflow: hidden;
	transition:
		max-height 0.2s ease-in-out,
		opacity 0.2s ease-in-out;

	&.${animationClassName}-enter {
		opacity: 0;
		max-height: 0;
	}

	&.${animationClassName}-enter-active, &.${animationClassName}-exit {
		opacity: 1;
		max-height: var(${"--table-max-height"});
	}

	&.${animationClassName}-exit-active {
		opacity: 0;
		max-height: 0;
	}
`;

const Head: FunctionComponent<TableRenderPropsType.HeadProps> = (props) => {
	const hasVirtualScroll = useTableContext((context) => !!context.virtualScrollOptions);

	return (
		<>
			{DefaultTableComponentRenderers.headRenderer({
				...props,
				ariaHidden: hasVirtualScroll ? undefined : true
			})}
		</>
	);
};

Head.displayName = "Head";

const Body: FunctionComponent<TableRenderPropsType.BodyProps> = (props) => {
	const hasVirtualScroll = useTableContext((context) => !!context.virtualScrollOptions);

	return (
		<>
			{DefaultTableComponentRenderers.bodyRenderer({
				...props,
				role: hasVirtualScroll ? undefined : "table"
			})}
		</>
	);
};

Body.displayName = "Body";

const BodyRow: FunctionComponent<TableRenderPropsType.BodyRowProps> = (props) => {
	const columns = useTableContext((context) => context.columns);
	const rowKey = useTableContext((context) => context.rowKey);
	const hasDragDrop = useTableContext((context) => !!context.dragDropOptions);
	const rowGroupHeaderRenderer = useTableContext((context) => context.componentRenderers.rowGroupHeaderRenderer);
	const subRowWrapperRef = useRef<HTMLDivElement | null>(null);
	const subRowMeasuringWrapperRef = useRef<HTMLDivElement | null>(null);

	const {
		components: {
			table: { bodyCell }
		}
	} = useTheme();

	useEffect(() => {
		if (subRowWrapperRef.current && subRowMeasuringWrapperRef.current) {
			const height = subRowMeasuringWrapperRef.current.offsetHeight;
			subRowWrapperRef.current.style.setProperty("--table-max-height", `${height}px`);
		}
		// can update correctly whenever those bodyCell theme configurations are changed
	}, [props.row, bodyCell]);

	if (isRowGroup(props.row)) {
		return (
			<>
				{props.rowIndex === 0 && (
					<HiddenText role="rowgroup" htmlTag="div">
						<div role="row">
							{columns.map((cell, index) => {
								return (
									<div role="columnheader" key={index}>
										{cell.label}
									</div>
								);
							})}
						</div>
					</HiddenText>
				)}
				<TableTemplate.RowGroup key={props.rowIndex} ariaLabel={props.row.ariaLabel} {...props.row}>
					{props.row.head && rowGroupHeaderRenderer?.(props)}
					<TransitionGroup>
						{!props.row.collapsed && (
							<CSSTransition
								key={props.rowIndex}
								timeout={200}
								classNames={animationClassName}
								nodeRef={subRowWrapperRef}
							>
								<StyledSubRowWrapper ref={subRowWrapperRef}>
									<div ref={subRowMeasuringWrapperRef}>
										{props.row.subRows.map((subRow, index) => {
											const key = rowKey ? getRowKey(subRow, rowKey) : index;

											return hasDragDrop
												? DefaultTableComponentRenderers.dndBodyRowRenderer({ key, rowIndex: index, row: subRow })
												: DefaultTableComponentRenderers.bodyRowRenderer({ key, rowIndex: index, row: subRow });
										})}
									</div>
								</StyledSubRowWrapper>
							</CSSTransition>
						)}
					</TransitionGroup>
				</TableTemplate.RowGroup>
			</>
		);
	}

	// In case the table would like to render flat rows like Virtualized, rows group head would be rendered as a normal row, no group wrapping
	if (isGroupHead(props.row)) {
		return <>{rowGroupHeaderRenderer?.(props)}</>;
	}

	return (
		<>
			{DefaultTableComponentRenderers.bodyRowRenderer({
				...props,
				row: props.row
			})}
		</>
	);
};

BodyRow.displayName = "BodyRow";

const DndBodyRow: FunctionComponent<TableRenderPropsType.BodyRowProps> = (props) => {
	const columns = useTableContext((context) => context.columns);
	const rowKey = useTableContext((context) => context.rowKey);
	const rowGroupHeaderRenderer = useTableContext((context) => context.componentRenderers.rowGroupHeaderRenderer);
	const subRowWrapperRef = useRef<HTMLDivElement | null>(null);
	const subRowMeasuringWrapperRef = useRef<HTMLDivElement | null>(null);

	const {
		components: {
			table: { bodyCell }
		}
	} = useTheme();

	useEffect(() => {
		if (subRowWrapperRef.current && subRowMeasuringWrapperRef.current) {
			const height = subRowMeasuringWrapperRef.current.offsetHeight;
			subRowWrapperRef.current.style.setProperty("--table-max-height", `${height}px`);
		}
		// can update correctly whenever those bodyCell theme configurations are changed
	}, [props.row, bodyCell]);

	if (isRowGroup(props.row)) {
		return (
			<>
				{props.rowIndex === 0 && (
					<HiddenText role="rowgroup" htmlTag="div">
						<div role="row">
							{columns.map((cell, index) => {
								return (
									<div role="columnheader" key={index}>
										{cell.label}
									</div>
								);
							})}
						</div>
					</HiddenText>
				)}
				<TableTemplate.RowGroup key={props.rowIndex} ariaLabel={props.row.ariaLabel} {...props.row}>
					{props.row.head && rowGroupHeaderRenderer?.(props)}
					<TransitionGroup>
						{!props.row.collapsed && (
							<CSSTransition
								key={props.rowIndex}
								timeout={200}
								classNames={animationClassName}
								nodeRef={subRowWrapperRef}
							>
								<StyledSubRowWrapper ref={subRowWrapperRef}>
									<div ref={subRowMeasuringWrapperRef}>
										{props.row.subRows.map((subRow, index) => {
											const key = rowKey ? getRowKey(subRow, rowKey) : index;

											return DefaultTableComponentRenderers.dndBodyRowRenderer({ key, rowIndex: index, row: subRow });
										})}
									</div>
								</StyledSubRowWrapper>
							</CSSTransition>
						)}
					</TransitionGroup>
				</TableTemplate.RowGroup>
			</>
		);
	}

	if (isGroupHead(props.row)) {
		return <>{rowGroupHeaderRenderer?.(props)}</>;
	}

	return <>{DefaultTableComponentRenderers.dndBodyRowRenderer(props)}</>;
};

DndBodyRow.displayName = "DndBodyRow";

const BodyContent: FunctionComponent<TableRenderPropsType.BodyContentProps> = (props) => {
	const flattenColumns = useTableContext((context) => context.flattenColumns);
	const { column, row, rowIndex } = props;
	let cellContent: ReactNode = undefined;

	if (column.dataGetter) {
		cellContent = <>{column.dataGetter({ row, rowIndex })}</>;
	} else if (flattenColumns) {
		cellContent = getDataByKey(
			isIdenticalRow(row) ? row.data : row,
			column.dataKey ?? TableInternalUtils.getColumnIndex(column, flattenColumns)
		);
	}

	return <>{cellContent}</>;
};

BodyContent.displayName = "BodyContent";

export const DefaultTableRowsGroupComponentRenderers: Partial<TableComponentRenderers<any, any>> = {
	headRenderer: (props) => <Head {...props} />,
	bodyRenderer: (props) => <Body {...props} />,
	bodyRowRenderer: ({ key, ...props }) => <BodyRow key={key} {...props} />,
	dndBodyRowRenderer: ({ key, ...props }) => <DndBodyRow key={key} {...props} />,
	bodyContentRenderer: (props) => <BodyContent {...props} />,
	rowGroupHeaderRenderer: (props) => <RowGroupHeader {...props} />
};

export function TableRowsGroup<
	RowType = unknown,
	ColumnType extends BaseTableRowsGroupColumnType<RowType> = BaseTableRowsGroupColumnType<RowType>
>(props: TableRowsGroupProps<RowType, ColumnType>): ReactElement<TableRowsGroupProps> {
	const componentRenderers = useMemo<Partial<TableComponentRenderers<TableRowsGroupRowType<RowType>, ColumnType>>>(
		() => ({ ...DefaultTableRowsGroupComponentRenderers, ...props.componentRenderers }),
		[props.componentRenderers]
	);

	const data: TableRowsGroupRowType<RowType>[] | undefined = useMemo(() => {
		if (props.data && props.virtualScrollOptions) {
			return flattenRowsGroup(identifyRowsGroup(props.data));
		}

		return props.data ? identifyRowsGroup(props.data) : undefined;
	}, [props.data, props.virtualScrollOptions]);

	return (
		<Table<TableRowsGroupRowType<RowType>, ColumnType>
			{...props}
			componentRenderers={componentRenderers}
			data={data}
			role={!props.virtualScrollOptions ? false : undefined}
		/>
	);
}

TableRowsGroup.displayName = "TableRowsGroup";
