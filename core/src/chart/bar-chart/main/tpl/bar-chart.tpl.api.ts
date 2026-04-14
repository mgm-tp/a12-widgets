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
import type { CellProps } from "recharts";
import type { LayoutType } from "recharts/types/util/types.js";

import type { Styleable, Identifiable } from "../../../../common/main/base-props.js";

import type { BarChartProps } from "../bar-chart.api.js";

/**
 * @deprecated since version 38.1.1.
 */
export interface LegendProps extends BarChartProps.LegendProps, LineInteractionProps {
	/**
	 * The key of data displayed.
	 */
	dataKey: string;

	/**
	 * The label of data displayed.
	 */
	labelKey: string;

	/**
	 * The data of legend.
	 */
	data?: ReadonlyArray<object>;

	/**
	 * Customize the cell of the legend. e.g. fill
	 */
	cellPropsList?: CellProps[];

	/**
	 * If set true, the legend can be hideable.
	 */
	hideable?: boolean;

	/** @internal
	 */
	layout?: LayoutType;

	/** @internal
	 */
	height?: number;

	/** @internal
	 */
	width?: number;

	/** @internal
	 */
	threshold?: BarChartProps.ThresholdProps;
}

/**
 * @deprecated since version 38.1.1.
 */
export interface ItemProps extends Styleable, Identifiable, LineInteractionProps {
	/**
	 * The label of item.
	 */
	label?: string;

	/**
	 * The value of item.
	 */
	value?: number | string;

	/**
	 * Customize the cell of the BarChart. e.g. fill
	 */
	cellProps?: CellProps;

	/**
	 * Index of item.
	 */
	index: number;

	/**
	 * If set true, the threshold is displayed.
	 */
	threshold?: boolean;
}

/**
 * @deprecated since version 38.1.1.
 */
export interface LineInteractionProps {
	/**
	 * The customized event handler of mouseenter.
	 * @param event – the mouse event triggered by the interaction.
	 * @param index – the index of the item being interacted with.
	 */
	onMouseEnter?(event: MouseEvent<HTMLElement>, index: number): void;

	/**
	 * The customized event handler of mouseleave.
	 */
	onMouseLeave?(): void;

	/**
	 * Defines which line is hovering.
	 */
	hoveringLine?: number | null;

	/**
	 * The customized event handler of click on the items in this group.
	 * @param event – the mouse event triggered by the legend item click.
	 * @param index – the index of the clicked legend item.
	 */
	onLegendClick?(event: MouseEvent<HTMLElement>, index: number): void;
}
