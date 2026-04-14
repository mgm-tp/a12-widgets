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

import type { MouseEvent } from "react";
import type { LineProps, CartesianGridProps, TooltipProps, AreaProps } from "recharts";
import type { Props as XAxisProps } from "recharts/types/cartesian/XAxis.js";
import type { Props as YAxisProps } from "recharts/types/cartesian/YAxis.js";
import type { DataKey } from "recharts/types/util/types.js";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart.js";

import type { Identifiable } from "../../../common/main/base-props.js";
import type { ChartProps } from "../../main/chart.api.js";

/**
 * @deprecated since version 38.1.1.
 */
export interface LineChartProps extends CategoricalChartProps, Identifiable {
	/**
	 * The horizontal and vertical lines of Cartesian Grid are displayed when the configuration is passed in.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [CartesianGrid]{@link https://recharts.github.io/en-US/api/CartesianGrid/}
	 */
	cartesianGridProps?: CartesianGridProps;

	/**
	 * The configuration of the x-axis.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [XAxis]{@link https://recharts.github.io/en-US/api/XAxis/}
	 */
	xAxisProps?: XAxisProps;

	/**
	 * The configuration of the y-axis.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [YAxis]{@link https://recharts.github.io/en-US/api/YAxis/}
	 */
	yAxisProps?: YAxisProps;

	/**
	 * The configuration of the x-axis.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [XAxis dataKey]{@link https://recharts.github.io/en-US/api/YAxis/#dataKey}
	 */
	xAxisDataKey?: DataKey<string | number>;

	/**
	 * The label displayed in the axis. Use Recharts instead.
	 * @deprecated since version 38.1.1.
	 * @see [XAxis label]{@link https://recharts.github.io/en-US/api/XAxis/#label}
	 */
	xAxisLabel?: number | string;

	/**
	 * The label displayed in the axis.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [YAxis label]{https://recharts.github.io/en-US/api/Label/}
	 */
	yAxisLabel?: number | string;

	/**
	 * The tooltip's configuration.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Tooltip]{@link https://recharts.github.io/en-US/api/Tooltip/}
	 */
	tooltipProps?: TooltipProps<string | number, string | number>;

	/**
	 * The configuration of lines.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Line]{@link https://recharts.github.io/en-US/api/Line/}
	 */
	linePropsMap: { [dataKey: string]: LineProps };

	/**
	 * The threshold will be displayed if the configuration is passed in.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Area]{@link https://recharts.github.io/en-US/api/Area/}
	 */
	thresholdLineProps?: LineProps;

	/**
	 * The comparable area will be displayed if the configuration is passed in.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Area]{@link https://recharts.github.io/en-US/api/Area/}
	 */
	comparableAreaProps?: AreaProps;

	/**
	 * If set true, the legend is displayed.
	 * @deprecated since version 38.1.1. If you want to display a legend, define a Recharts `Legend` instead.
	 */
	showLegend?: boolean;

	/**
	 * The configuration of the legend when {@link showLegend} is set to true.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Legend]{@link https://recharts.github.io/en-US/api/Legend/}
	 */
	legendProps?: LineChartProps.LegendProps;

	/**
	 * Provide an interface for showing and hiding lines in legend
	 * @default false
	 * @deprecated since version 38.1.1. If you want to show or hide lines, define a Recharts `Line` instead.
	 */
	showAndHideLines: boolean;

	/**
	 * The customized event handler of click on the items in this group.
	 * @param event – HTML mouse event.
	 * @param dataKey – The key of the data.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Legend onClick]{@link https://recharts.github.io/en-US/api/Legend/#onClick}
	 */
	onLegendClick?(event: MouseEvent<HTMLElement>, dataKey: string): void;

	/**
	 * The customized event handler of click on the dots in this group.
	 * @deprecated since version 38.1.1. Use Recharts instead.
	 * @see [Line activeDot]{@link https://recharts.github.io/en-US/api/Line/#activeDot}
	 */
	onDotClick?(data: object): void;
}

/**
 * @deprecated since version 38.1.1.
 */
export namespace LineChartProps {
	export type LegendProps = ChartProps.LegendProps;
}
