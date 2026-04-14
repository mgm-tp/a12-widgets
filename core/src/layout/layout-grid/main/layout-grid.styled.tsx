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

import { useContext } from "react";
import { styled, css } from "styled-components";

import type { SizeDetectorProps } from "../../size-detector/main/size-detector.api.js";

import { GridContext } from "./layout-grid-context.js";
import type { LayoutGridProps } from "./layout-grid.api.js";

type VerticalAlignmentType = "top" | "middle" | "bottom" | undefined;

const getVerticalAlignment = (value: VerticalAlignmentType): string => {
	switch (value) {
		case "middle":
			return "center";
		case "bottom":
			return "flex-end";
		default:
			return "flex-start";
	}
};

const modifyColumnWidth = (props: {
	currentBreakPoint: SizeDetectorProps.Size;
	size: LayoutGridProps.ColumnSize;
	maxColumns: number;
	gap?: string;
}): ReturnType<typeof css> | undefined => {
	const { currentBreakPoint, size, maxColumns, gap } = props;

	if (!currentBreakPoint) {
		return;
	}

	if (currentBreakPoint !== "xs") {
		const col = size[currentBreakPoint];

		if (col === 0) {
			return css`
				max-width: 0;
				padding: 0;
				margin: 0;
			`;
		}

		if (col) {
			const gridRatio = col / maxColumns;
			const maxWidthWithoutGap = gridRatio * 100;

			return css`
				flex-basis: ${maxWidthWithoutGap}%;
				max-width: ${gap
					? `calc(${maxWidthWithoutGap}% - (${gap} - ${gap} / ${maxColumns / col}))`
					: `${maxWidthWithoutGap}%`};
			`;
		}
	}

	return css`
		flex-basis: 100%;
		max-width: 100%;
	`;
};

const noGutterStyles = css`
	margin: 0;
	padding: 0;
	gap: 0;
`;

const customRowHeightStyles = (props: {
	customHeight: string | number;
	rowCount?: number;
	gap?: string;
}): ReturnType<typeof css> | undefined => {
	const gapInRow = props.gap?.split(" ").shift();
	const customHeightVal = typeof props.customHeight === "number" ? `${props.customHeight}px` : props.customHeight;

	const returnedVal = !props.rowCount
		? customHeightVal
		: `calc(${customHeightVal} - (${gapInRow} * ${props.rowCount - 1} / ${props.rowCount}))`;

	return css`
		min-height: ${returnedVal};
		max-height: ${returnedVal};
	`;
};

export const StyledGridRow = styled.div.withConfig({ displayName: "StyledGridRow-sc-" })<
	Pick<LayoutGridProps.RowProps, "verticalAlignment" | "fitToContent" | "layoutConfig"> & {
		customHeight?: string | number;
		rowCount?: number;
	}
>(({ theme, verticalAlignment, fitToContent, layoutConfig, customHeight, rowCount }) => {
	const { row, fit } = theme.components.layoutGrid;
	const {
		fitToParent,
		currentBreakPoint,
		verticalAlignment: gridVerticalAlignment,
		noGutter
	} = useContext(GridContext);

	return css`
		display: flex;
		flex-wrap: wrap;
		margin-bottom: ${row.marginBottom};
		gap: ${row.gap};

		${layoutConfig &&
		css`
			gap: 0;
			margin: ${row.spanOffsetMargin};
		`}

		${(gridVerticalAlignment || verticalAlignment) &&
		css`
			align-items: ${getVerticalAlignment(gridVerticalAlignment || verticalAlignment)};
		`}

		${fitToParent &&
		css`
			align-items: stretch;
			flex: ${fitToContent ? "none" : "1 0 30px"};
			gap: ${fit.rowGap};
			margin: 0;
			min-height: 30px;

			${currentBreakPoint === "xs" &&
			css`
				flex-basis: auto;
				gap: 0;
			`}
		`}

        ${noGutter &&
		`
			${noGutterStyles}
		`}

        ${customHeight &&
		css`
			${StyledGrid} && {
				${customRowHeightStyles({ customHeight, rowCount, gap: fit.gap })};
				${customRowHeightStyles({ customHeight, rowCount, gap: fit.gap })};
			}

			${StyledGridColumn} && {
				${customRowHeightStyles({ customHeight, rowCount, gap: fit.columnGap })};
				${customRowHeightStyles({ customHeight, rowCount, gap: fit.columnGap })};
			}
		`}
	`;
});

export const StyledGridColumn = styled.div.withConfig({ displayName: "StyledGridColumn-sc-" })<
	Pick<LayoutGridProps.ColumnProps, "verticalAlignment" | "size" | "spacerColumn"> & {
		maxColumns: number;
		isUsingSpanOffset?: boolean;
		customHeight?: LayoutGridProps.ColumnHeight;
	}
>(({ theme, verticalAlignment, maxColumns, size, spacerColumn, isUsingSpanOffset, customHeight }) => {
	const { fit, cell, column, row } = theme.components.layoutGrid;
	const { fitToParent, cellBorder, currentBreakPoint, noGutter } = useContext(GridContext);

	return css`
		${!spacerColumn &&
		css`
			display: block;

			${verticalAlignment &&
			css`
				align-self: ${getVerticalAlignment(verticalAlignment)};
			`}

			${fitToParent &&
			css`
				display: flex;
				flex-direction: column;
				gap: ${currentBreakPoint === "xs" ? 0 : fit.columnGap};
				max-height: 100%;
				overflow: auto;
				padding: 0;

				// Creating a gap for elements that are used inside layoutGrid--fit
				& > *:not([data-role*="layout-grid"]) {
					box-shadow: none;
					display: flex;
					overflow: auto;
					margin: ${currentBreakPoint === "xs" && fit.mobileColumnChildMargin};
					margin-bottom: ${currentBreakPoint !== "xs" && fit.columnChildMarginBottom};
				}
			`}
		
			${cellBorder &&
			css`
				& > *:not([data-role*="layout-grid"]) {
					border: ${cell.border};
				}
			`}
		`}

		${isUsingSpanOffset &&
		css`
			margin-bottom: ${column.marginBottom};
			padding: ${column.padding};
		`}

		${size &&
		css`
			${modifyColumnWidth({
				currentBreakPoint,
				size,
				maxColumns,
				gap:
					currentBreakPoint === "xs"
						? undefined
						: fitToParent
							? `${fit.rowGap}`.split(" ").pop()
							: !noGutter && !isUsingSpanOffset && !spacerColumn
								? `${row.gap}`.split(" ").pop()
								: undefined
			})}
		`}

		${noGutter &&
		css`
			${noGutterStyles}
			${fitToParent &&
			css`
				& > *:not([data-role*="layout-grid"]) {
					margin: 0;
				}
			`}
		`}
	  
	  	${customHeight &&
		currentBreakPoint &&
		css`
			height: ${typeof customHeight[currentBreakPoint] === "number"
				? `${customHeight[currentBreakPoint]}px`
				: customHeight[currentBreakPoint]};
			max-height: none;
		`}
	`;
});

export const StyledGrid = styled.div.withConfig({ displayName: "StyledGrid-sc-" })<
	Pick<LayoutGridProps.LayoutGridTemplateProps, "fitToParent" | "noGutter" | "size" | "cellBorder">
>(({ theme, fitToParent, noGutter, size, cellBorder }) => {
	const { fit } = theme.components.layoutGrid;

	return css`
		width: 100%;

		${fitToParent &&
		css`
			display: flex;
			flex-direction: column;
			height: 100%;
			gap: ${fit.gap};
			overflow: auto;

			${size === "xs" &&
			css`
				height: auto;
				gap: 0;
				width: 100%;
			`}
		`}

		${noGutter &&
		css`
			gap: 0;
			padding: 0;
		`};

		// Remove the bottom spacing of the last row on Dashboard
		${cellBorder &&
		fitToParent &&
		size !== "xs" &&
		css`
			margin-bottom: -${fit.columnChildMarginBottom};
			height: calc(100% + ${fit.columnChildMarginBottom});
		`}
	`;
});

export const StyledGridContainer = styled.div.withConfig({ displayName: "StyledGridContainer-sc-" })<
	Pick<LayoutGridProps.LayoutGridTemplateProps, "fitToParent" | "size">
>(({ theme, fitToParent, size }) => {
	return css`
		height: 100%;
		overflow: auto;
		padding: ${size === "xs" ? 0 : theme.components.layoutGrid.container.padding};

		${fitToParent &&
		css`
			${StyledGrid} {
				overflow: visible;
			}
		`}
	`;
});
