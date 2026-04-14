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
 * This is a wrapper around Recharts' PieChart component.
 * @module
 */

import type { ReactNode } from "react";
import type { TooltipProps, PieProps } from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart.js";

import type { PieChartElementsProps } from "./tpl/pie-chart.tpl.api.js";

/**
 * @deprecated since version 38.1.1.
 */
export interface PieChartProps extends CategoricalChartProps {
	/**
	 * The configuration of the legend. If not given, the legend will not be shown.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Legend]{@link https://recharts.github.io/en-US/api/Legend/}
	 */
	legendProps?: PieChartElementsProps.LegendProps;

	/**
	 * The configuration of the tooltip.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Tooltip]{@link https://recharts.github.io/en-US/api/Tooltip/}
	 */
	toolTipProps?: TooltipProps<number | string, number | string>;

	/**
	 * The source data which each element is an object
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Pie data]{@link https://recharts.github.io/en-US/api/PieChart/#data}
	 */
	data: PieChartElementsProps.ChartData[];

	/**
	 * The configuration of pie.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Pie]{@link https://recharts.github.io/en-US/api/Pie/}
	 */
	pieProps?: Partial<PieProps>;

	/**
	 * The label displayed in the chart.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Pie label]{@link https://recharts.github.io/en-US/api/Pie/#label}
	 */
	label?: ReactNode;

	/**
	 * Defines the value of data will be rotated clockwise or counterclockwise.
	 * @default clockwise
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Pie startAngle]{@link https://recharts.github.io/en-US/api/Pie/#startAngle}
	 * @see [Pie endAngle]{@link https://recharts.github.io/en-US/api/Pie/#endAngle}
	 */
	rotation?: Rotation;
}

/**
 * @deprecated since version 38.1.1.
 * The direction in which the pie chart segments are drawn.
 * - `clockwise`: Segments are drawn in clockwise direction (default)
 * - `counterclockwise`: Segments are drawn in counterclockwise direction
 */
export type Rotation = "clockwise" | "counterclockwise";
