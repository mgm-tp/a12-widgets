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

import type { CSSProperties } from "react";

import type { ChartProps } from "../main/chart.api.js";

export namespace LegendUtils {
	export function getLegendHorizontalAlignment(legendProps?: ChartProps.LegendProps): ChartProps.Align {
		if (legendProps && legendProps.verticalAlign) {
			if (legendProps.verticalAlign === "above" || legendProps.verticalAlign === "below") {
				return "center";
			} else if (legendProps.align) {
				return legendProps.align;
			}
		}

		return "right";
	}

	export function getLegendVerticalAlignment(legendProps?: ChartProps.LegendProps): "top" | "middle" | "bottom" {
		if (!legendProps || !legendProps.verticalAlign || legendProps.verticalAlign === "above") {
			return "top";
		}

		return legendProps.verticalAlign === "below" ? "bottom" : legendProps.verticalAlign;
	}

	export function getLegendWidth(width?: number, legendProps?: ChartProps.LegendProps): number | undefined {
		return legendProps?.width || (width && width / 2) || undefined;
	}

	export function getLegendHeight(height?: number, legendProps?: ChartProps.LegendProps): number | undefined {
		return legendProps?.height || height;
	}

	export function getLegendWrapperStyle(legendProps: ChartProps.LegendProps | undefined): CSSProperties | undefined {
		if (!legendProps) {
			return undefined;
		}

		let wrapperStyle;

		if (legendProps.hideable) {
			wrapperStyle = { top: 0, right: -5 };
		} else {
			wrapperStyle =
				legendProps.layout === "horizontal"
					? legendProps.align === "center"
						? { display: "flex", justifyContent: "center", width: "100%" }
						: { width: "auto" }
					: undefined;
		}

		if (legendProps.verticalAlign === "above" || legendProps.verticalAlign === "below") {
			if (legendProps.align === "right") {
				wrapperStyle = { right: 5, width: "auto" };
			}

			if (legendProps.align === "left") {
				wrapperStyle = { left: 5, width: "auto" };
			}
		}

		return { ...wrapperStyle, ...legendProps.wrapperStyle };
	}
}
