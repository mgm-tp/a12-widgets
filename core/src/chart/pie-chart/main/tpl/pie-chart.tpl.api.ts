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

import type { TextProps as RechartsTextProps } from "recharts";
import type { MouseEvent, ReactNode } from "react";

import type { Styleable, Identifiable } from "../../../../common/main/base-props.js";
import type { ChartProps } from "../../../main/chart.api.js";

/**
 * @deprecated since version 38.1.1.
 */
export namespace PieChartElementsProps {
	export interface LegendProps extends ChartProps.LegendProps {
		/**
		 * Show entries whose value is either negative or zero.
		 * @default false
		 */
		showNonPositiveEntries?: boolean;

		/**
		 * Whether the legend entries should be sorted by their values.
		 *
		 * *Note:* The order of the pie elements will always be similar to the legends.
		 *
		 * @default true
		 */
		enableLegendSorting?: boolean;

		/**
		 * The customized event handler of mouseenter.
		 */
		onMouseEnter?(data: ChartData, event: MouseEvent<HTMLElement>): void;

		/**
		 * The customized event handler of mouseleave.
		 */
		onMouseLeave?(data: ChartData, event: MouseEvent<HTMLElement>): void;

		/**
		 * The customized event handler of click.
		 */
		onClick?(data: ChartData, event: MouseEvent<HTMLElement>): void;
	}

	export interface LegendItemProps extends Styleable, Identifiable {
		/**
		 * The source data which each element is an object
		 */
		data: ChartData;

		/**
		 * The customized event handler of mouseenter.
		 */
		onMouseEnter?(data: ChartData, event: MouseEvent<HTMLElement>): void;

		/**
		 * The customized event handler of mouseleave.
		 */
		onMouseLeave?(data: ChartData, event: MouseEvent<HTMLElement>): void;

		/**
		 * The customized event handler of click.
		 */
		onClick?(data: ChartData, event: MouseEvent<HTMLElement>): void;
	}

	export type TextType = "primary" | "secondary";

	export interface TextProps extends RechartsTextProps {
		/**
		 * Type of text
		 * @default primary
		 */
		type: TextType;

		/**
		 * Position of text
		 */
		position: TextPosition;
	}

	export type TextPosition = "center" | "top-left" | "bottom-left" | "top-right" | "bottom-right" | "top" | "bottom";

	export interface LabelProps extends Identifiable {
		/**
		 * The offset to the specified "position"
		 * @default 5
		 */
		offset: number;

		/**
		 * Gap between 2 text tags.
		 * @default 20
		 */
		gap: number;

		/**
		 * Displays the primary text.
		 */
		primaryText?: ReactNode;

		/**
		 * Displays the secondary text.
		 */
		secondaryText?: ReactNode;
	}

	export interface ChartData {
		/**
		 * The name of data.
		 */
		name: string;

		/**
		 * The value of data.
		 */
		value: number;

		/**
		 * The color of data.
		 */
		color?: string;
	}
}
