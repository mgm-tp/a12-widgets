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

import type { MouseEvent, SyntheticEvent } from "react";
import type { AreaProps, LineProps } from "recharts";

import type { Styleable, Identifiable } from "../../../../common/main/base-props.js";
import type { ChartProps } from "../../../main/chart.api.js";

import type { LineChartProps } from "../line-chart.api.js";

/**
 * @deprecated since version 38.1.1.
 */
export interface LegendProps extends LineInteractionProps, LineChartProps.LegendProps {
	/**
	 * The configuration of lines.
	 */
	linePropsMap: { [dataKey: string]: LineProps };

	/**
	 * Defines visibility of lines.
	 */
	lineVisibilityMap?: { [dataKey: string]: boolean };

	/**
	 * The layout of legend items.
	 */
	layout?: ChartProps.Layout;

	/**
	 * If set true, the legend can be hideable.
	 */
	hideable?: boolean;

	/**
	 * The threshold will be displayed if the configuration is passed in.
	 */
	thresholdLineProps?: LineProps;

	/**
	 * The comparable area will be displayed if the configuration is passed in.
	 */
	comparableAreaProps?: AreaProps;

	/** @internal
	 */
	height?: number;

	/** @internal
	 */
	width?: number;
}

/**
 * @deprecated since version 38.1.1.
 */
export interface ItemProps extends Styleable, Identifiable, LineInteractionProps {
	/**
	 * The key of data displayed.
	 */
	dataKey: string;

	/**
	 * The configuration of lines.
	 */
	lineProps?: LineProps & { threshold?: boolean };

	/**
	 * The threshold will be displayed if the configuration is passed in.
	 */
	thresholdProps?: AreaProps;

	/**
	 * The comparable area will be displayed if the configuration is passed in.
	 */
	comparableAreaProps?: AreaProps;

	/**
	 * If set true, the line is displayed.
	 */
	lineVisibility?: boolean;
}

/**
 * @deprecated since version 38.1.1.
 */
export interface LineInteractionProps {
	/**
	 * The customized event handler of mouseenter.
	 * @param event – HTML mouse event.
	 * @param dataKey – The key of the data.
	 */
	onMouseEnter?(event: MouseEvent<HTMLElement>, dataKey: string): void;

	/**
	 * The customized event handler of mouseleave.
	 */
	onMouseLeave?(): void;

	/**
	 * The customized event handler of click on the items in this group.
	 * @param event – Synthetic mouse event.
	 * @param dataKey – The key of the data.
	 */
	onLegendClick?(event: SyntheticEvent<HTMLElement>, dataKey: string): void;

	/**
	 * Provide an interface for showing and hiding lines in legend
	 * @default false
	 */
	showAndHideLines?: boolean;

	/**
	 * Notifies that the visibility of the portal is changed
	 * @param dataKey – The key of the data.
	 * @param lineVisibility – Whether the line is visible or not.
	 */
	toggleLine?(dataKey: string, lineVisibility: boolean): void;

	/**
	 * Callback fired when the button visibility is clicked if {@link showAndHideLines} is set to true.
	 */
	hoveringLine?: string | null;
}
