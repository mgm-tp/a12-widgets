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

/**
 * The LayoutGrid tracks the width of it's DOM element and sets
 * a respective CSS class depending on the width.
 * The change in width can be triggered by window resize or direct or indirect CSS.
 *
 * @module
 */

import type { Container, Identifiable, Ref, Styleable } from "../../../common/main/base-props.js";
import type { SizeDetectorProps } from "../../size-detector/main/size-detector.api.js";

export namespace LayoutGridProps {
	export interface GridContextType {
		/**
		 * The returned breakpoint at the current size.
		 * @default null
		 */
		currentBreakPoint: "xs" | "sm" | "md" | "lg" | null;

		/**
		 * If true, all spaces between the rows and columns will be removed.
		 */
		noGutter?: boolean;

		/**
		 * If true, the rows will stretch to fill the container.
		 */
		fitToParent?: boolean;

		/**
		 * If true, a border will be added around the content of a column.
		 */
		cellBorder?: boolean;

		/**
		 * Specifies the vertical alignment.
		 */
		verticalAlignment?: "top" | "middle" | "bottom";

		/** @internal */
		rowCount?: number;
	}

	export interface LayoutGridBaseProps extends Identifiable, Styleable, Container {
		/**
		 * Specify the alignment vertically.
		 *
		 * @default undefined.
		 * That means, if not specify vertical alignment for:
		 * - LayoutGrid or Column: the columns will stretch as its parent's size.
		 * - Row: content will stretch as Row's size.
		 */
		verticalAlignment?: "top" | "middle" | "bottom";
	}

	export interface LayoutGridTemplateProps extends LayoutGridBaseProps, Ref<HTMLDivElement> {
		/**
		 * Add a border around the content of a column
		 */
		cellBorder?: boolean;

		/**
		 * Breakpoints of the LayoutGrid. The best fitting one will be used by LayoutGrid.
		 */
		breakpoints?: SizeDetectorProps.BreakPoint[];

		/**
		 * If true, all spaces between the rows and columns will be removed.
		 */
		noGutter?: boolean;

		/**
		 * If true, the rows will stretch to fill the container.
		 */
		fitToParent?: boolean;

		/**
		 * If true, the LayoutGrid will be wrapped in a div and has a spacing around.
		 */
		disableNegativeMargin?: boolean;

		/**
		 * Value of the role attribute, in order to support the Accessibility.
		 * @see [Roles]{@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles}
		 */
		role?: string;

		/**
		 * The current size of the container or viewport.
		 */
		size: SizeDetectorProps.Size;

		/**
		 * A callback will be triggered when the breakpoint is changed.
		 */
		onBreakPointChanged?(newBreakPoint: SizeDetectorProps.BreakPoint): void;
	}

	export type LayoutGridProps = Omit<LayoutGridTemplateProps, "width" | "size">;

	export interface RowProps extends LayoutGridBaseProps {
		/**
		 * To specify the height of a row.
		 */
		height?: number | string;

		/**
		 * If true, the rows will stretch to fill the container.
		 */
		fitToContent?: boolean;

		/**
		 * Configuration for determining the column and offset spacer sizes within a {@link LayoutGrid.Row}
		 * when specific layouts, offsets and spans are given for different horizontal space situations.
		 */
		layoutConfig?: LayoutConfig;

		/**
		 * Value of the role attribute, in order to support the Accessibility.
		 */
		role?: string;
	}

	/**
	 * This configuration will be used to calculate the size of columns inside a row, based on the given layout,
	 * offset,
	 * and span. If no config is given for a certain size, the next larger size information will be used. E.g. if no
	 * config is given for "sm", calculation result of "md" will be used. If no span or offset is given, the default
	 * will be span=1 and offset=0
	 */
	export type LayoutConfig = {
		/**
		 * Layout to use depending on the current horizontal space available.
		 */
		layout: ResponsiveConfig;

		/**
		 * Offsets of all row children for the different space situations.
		 */
		offsets?: ResponsiveConfig;

		/**
		 * Spans of all row children for the different space situations.
		 */
		spans?: ResponsiveConfig;
	};

	/**
	 * Hold layout configuration for different breakpoints
	 */
	export interface ResponsiveConfig {
		/**
		 * A list of numbers that represent the size of columns for the lg layout.
		 */
		lg: ColumnNumber[];

		/**
		 * A list of numbers that represent the size of columns for the md layout.
		 */
		md?: ColumnNumber[];

		/**
		 * A list of numbers that represent the size of columns for the sm layout.
		 */
		sm?: ColumnNumber[];
	}

	export type ColumnNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

	/**
	 * Result of calculation happens internally inside LayoutGrid's Row, which can be used as the size for inner columns
	 */
	export type SizeCalculationResult = {
		columnSize: ColumnSize;
		spacerSize: ColumnSize;
	}[];

	/**
	 * Size of column per breakpoint
	 */
	export interface ColumnSize {
		/**
		 * Size of column at the small layout.
		 */
		sm?: ColumnNumber;

		/**
		 * Size of column at the medium layout.
		 */
		md?: ColumnNumber;

		/**
		 * Size of column at the large layout.
		 */
		lg: ColumnNumber;
	}

	export interface ColumnHeight {
		/**
		 * Height of the column at the extra-small layout.
		 */
		xs?: string | number;

		/**
		 * Height of the column at the small layout.
		 */
		sm?: string | number;

		/**
		 * Height of the column at the medium layout.
		 */
		md?: string | number;

		/**
		 * Height of the column at the extra-small layout.
		 */
		lg?: string | number;
	}

	export interface ColumnProps extends LayoutGridBaseProps {
		/**
		 * Size of a column, for each layout. The prop is optional because there is no need to provide a size when used
		 * inside a {@link LayoutGrid.Row} with {@link RowProps.layoutConfig}. Please provide a size if
		 * layoutConfig is not set, otherwise nothing will be rendered.
		 */
		size?: ColumnSize;

		/**
		 * A specific height of the column.
		 */
		height?: ColumnHeight;

		/**
		 * Indicate if the column is being used as spacer column. In this case, the content will be ignored.
		 */
		spacerColumn?: boolean;

		/**
		 * Value of the role attribute, in order to support the Accessibility.
		 */
		role?: string;
	}
}
