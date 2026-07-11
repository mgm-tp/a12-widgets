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
import {
	useRef,
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
	Children,
	isValidElement,
	cloneElement
} from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import { joinClassNames, addPrefix } from "../../../common/main/utils.js";
import { useElementSizeDetector } from "../../size-detector/main/size-detector.view.js";

import { GridContext } from "./layout-grid-context.js";
import type { LayoutGridProps } from "./layout-grid.api.js";
import { StyledGridColumn, StyledGridContainer, StyledGridRow, StyledGrid } from "./layout-grid.styled.js";
import { LayoutGridUtils } from "./utils.js";

const baseClassName = addPrefix("layoutGrid");

/**
 * A container that tracks it's physical width as CSS class. The width is not directly the pixel value but a
 * "break point" style className for a configurable range (@see {@link BreakPoint}).
 *
 * The component listens to window resize events. Therefore resizing the browser window or changing the
 * orientation on mobile devices are handled.
 *
 * The component also listens to element resize events using the
 * [react-resize-detector]{@link https://www.npmjs.com/package/react-resize-detector} library.
 * Therefore, all changes to size - even from outside React should be properly handled.
 */

export namespace LayoutGrid {
	export const LayoutGridContext = GridContext;

	export function LayoutGridTemplate(props: LayoutGridProps.LayoutGridTemplateProps): ReactElement {
		const gridRef = useRef<HTMLDivElement | null>(null);
		const [rowCount, setRowCount] = useState(0);
		const { size, cellBorder, noGutter, fitToParent, role, verticalAlignment, children, style, id, wrapperRef } = props;

		useEffect(() => {
			// Get the number of rows inside the nearest grid to allocate the row's height based on flex-gap
			const newRowCount = gridRef.current?.querySelectorAll(
				`:scope > [data-role="${DataRoles.LayoutGrid.Row}"]`
			).length;

			if (newRowCount && rowCount !== newRowCount) {
				setRowCount(newRowCount);
			}
		}, [children, rowCount]);

		const handleGridRef = useCallback(
			(ref: HTMLDivElement | null): void => {
				gridRef.current = ref;
				wrapperRef?.(ref);
			},
			[wrapperRef]
		);

		const renderContent = useMemo((): ReactElement => {
			const classNames = joinClassNames(
				props.className,
				baseClassName,
				{ [`${baseClassName}Size--${size}`]: size },
				{ [`${baseClassName}--fit`]: fitToParent },
				{ [`${baseClassName}--noGutter`]: noGutter },
				{ [`${baseClassName}__align-${verticalAlignment}`]: verticalAlignment },
				{ [`${baseClassName}--column-border`]: cellBorder }
			);

			return (
				<StyledGrid
					size={size}
					id={id}
					className={classNames}
					style={style}
					role={role}
					data-role={DataRoles.LayoutGrid}
					ref={handleGridRef}
					fitToParent={fitToParent}
					noGutter={noGutter}
					cellBorder={cellBorder}
				>
					<LayoutGridContext.Provider
						value={{
							currentBreakPoint: size,
							noGutter: noGutter,
							fitToParent: fitToParent,
							cellBorder: cellBorder,
							verticalAlignment: verticalAlignment,
							rowCount: rowCount
						}}
					>
						{children}
					</LayoutGridContext.Provider>
				</StyledGrid>
			);
		}, [
			cellBorder,
			children,
			fitToParent,
			handleGridRef,
			id,
			noGutter,
			props.className,
			role,
			rowCount,
			size,
			style,
			verticalAlignment
		]);

		return props.disableNegativeMargin ? (
			<StyledGridContainer className={`${baseClassName}-container`} fitToParent={props.fitToParent} size={props.size}>
				{renderContent}
			</StyledGridContainer>
		) : (
			renderContent
		);
	}

	export function Grid(props: LayoutGridProps.LayoutGridProps): ReactElement<LayoutGridProps.LayoutGridProps> {
		const { wrapperRef: propWrapperRef } = props;
		const wrapperRef = useRef<HTMLDivElement | null>(null);

		const { onBreakPointChanged } = props;

		const getWrapperRef = useCallback(
			(ref: HTMLDivElement | null) => {
				wrapperRef.current = ref;
				propWrapperRef?.(ref);
			},
			[propWrapperRef]
		);

		const { breakPoint } = useElementSizeDetector({
			targetRef: wrapperRef,
			breakPoints: props.breakpoints,
			handleHeight: false
		});

		useEffect(() => {
			onBreakPointChanged?.(breakPoint);
		}, [breakPoint, onBreakPointChanged]);

		return <LayoutGridTemplate {...props} size={breakPoint.size} wrapperRef={getWrapperRef} />;
	}

	export function Row(props: LayoutGridProps.RowProps): ReactElement<LayoutGridProps.RowProps> {
		const { height, fitToContent, verticalAlignment, layoutConfig, children, className, id, role, style } = props;
		const { noGutter, rowCount } = useContext(LayoutGridContext);
		const rowRef = useRef<HTMLDivElement | null>(null);
		const columnCount = Children.count(children);

		const calculationResult = useMemo(
			() => LayoutGridUtils.calculateSize(columnCount, layoutConfig),
			[columnCount, layoutConfig]
		);

		const classNames = joinClassNames(
			`${baseClassName}__row`,
			{ [`${baseClassName}__row--fitContent`]: fitToContent },
			{ [`${baseClassName}__row--align-${verticalAlignment}`]: verticalAlignment },
			{ [`${baseClassName}__row--noGutter`]: noGutter },
			className
		);

		return (
			<StyledGridRow
				id={id}
				className={classNames}
				data-role={DataRoles.LayoutGrid.Row}
				customHeight={height}
				fitToContent={fitToContent}
				layoutConfig={layoutConfig}
				verticalAlignment={verticalAlignment}
				role={role}
				style={style}
				ref={rowRef}
				rowCount={rowCount}
			>
				{calculationResult
					? Children.map(props.children, (child, index) => {
							return isValidElement<
								LayoutGridProps.ColumnProps & {
									isUsingSpanOffset?: boolean;
								}
							>(child) ? (
								<>
									<Column spacerColumn size={calculationResult[index].spacerSize} />
									{cloneElement(child, {
										size: calculationResult[index].columnSize,
										isUsingSpanOffset: !!calculationResult
									})}
								</>
							) : null;
						})
					: children}
			</StyledGridRow>
		);
	}

	export function Column(
		props: LayoutGridProps.ColumnProps & {
			isUsingSpanOffset?: boolean;
		}
	): ReactElement<LayoutGridProps.ColumnProps> | null {
		const { size, verticalAlignment, spacerColumn, height, isUsingSpanOffset, children, className, id, style, role } =
			props;
		const { currentBreakPoint, noGutter, ...rest } = useContext(LayoutGridContext);
		const columnRef = useRef<HTMLDivElement | null>(null);
		const [rowCount, setRowCount] = useState(0);

		useEffect(() => {
			// Get the number of rows inside the nearest column to allocate the row's height based on flex-gap
			const newRowCount = columnRef.current?.querySelectorAll(
				`:scope > [data-role="${DataRoles.LayoutGrid.Row}"]`
			).length;

			if (newRowCount && rowCount !== newRowCount) {
				setRowCount(newRowCount);
			}
		}, [children, rowCount]);

		const classNames = useMemo(() => {
			if (!size) {
				return undefined;
			}

			return joinClassNames(
				{ [`${baseClassName}__column`]: !spacerColumn },
				{ [`${baseClassName}__column--xs`]: !spacerColumn },
				{ [`${baseClassName}__column--sm-${size.sm}`]: size.sm !== undefined },
				{ [`${baseClassName}__column--md-${size.md}`]: size.md !== undefined },
				{ [`${baseClassName}__column--lg-${size.lg}`]: size.lg !== undefined },
				{ [`${baseClassName}__column--spacer`]: spacerColumn },
				{ [`${baseClassName}__column--align-${verticalAlignment}`]: verticalAlignment && !spacerColumn },
				{ [`${baseClassName}__column--noGutter`]: noGutter },
				className
			);
		}, [className, noGutter, size, spacerColumn, verticalAlignment]);

		if (!size) {
			return null;
		}

		return (
			<StyledGridColumn
				id={id}
				className={classNames}
				role={role}
				style={style}
				data-role={DataRoles.LayoutGrid.Column}
				maxColumns={currentBreakPoint === "xs" ? 1 : 12}
				isUsingSpanOffset={isUsingSpanOffset}
				verticalAlignment={verticalAlignment}
				size={size}
				customHeight={height}
				spacerColumn={spacerColumn}
				ref={columnRef}
			>
				<LayoutGridContext.Provider value={{ currentBreakPoint, noGutter, ...rest, rowCount }}>
					{!spacerColumn && children}
				</LayoutGridContext.Provider>
			</StyledGridColumn>
		);
	}
}
