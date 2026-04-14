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

import { styled, css } from "styled-components";
import { ResponsiveContainer, PieChart } from "recharts";
import type { LayoutType } from "recharts/types/util/types.js";

import { List } from "../../list/main/list.view.js";
import { StyledListItemGraphic, StyledListItemWrapper } from "../../list/main/list.styled.js";
import { addPrefix } from "../../common/main/utils.js";
import { activeAndHover } from "../../theme/base/mixins/_interaction.js";

const baseLegendClassName = addPrefix("chart-legend");

export const StyledRechartsContainer = styled(ResponsiveContainer).withConfig({
	displayName: "StyledRechartsContainer-sc-"
})(({ theme }) => {
	const { charts } = theme.components;

	return css`
		.recharts-wrapper {
			font-size: ${charts.fontSize};
			font-family: ${charts.fontFamily};
		}

		.lineChart {
			margin-right: 20px;
		}

		.barChart__axis-label,
		.lineChart__axis-label {
			font-weight: ${charts.fontWeight};
		}

		.recharts-text {
			fill: ${charts.textColor};
		}

		.recharts-legend-wrapper {
			padding: 10px;
		}
	`;
});

export const StyledRechartsLegend = styled.ul.withConfig({ displayName: "StyledRechartsLegend-sc-" })<{
	layout?: LayoutType;
}>(({ theme, layout }) => {
	const { charts } = theme.components;

	return css`
		background-color: ${charts.legend.background};
		box-shadow: ${charts.legend.boxShadow};
		font-family: ${charts.fontFamily};
		height: 100%;
		margin: 0;
		opacity: 0.9;
		overflow: auto;
		padding: 0;
		width: 100%;

		${layout === "horizontal" &&
		css`
			display: flex;
			flex-wrap: wrap;
		`}
	`;
});

export const StyledRechartsLegendItem = styled.li.withConfig({ displayName: "StyledRechartsLegendItem-sc-" })(
	({ theme }) => {
		const { charts } = theme.components;

		return css`
			align-items: center;
			cursor: pointer;
			color: ${charts.textColor};
			display: flex;
			justify-content: space-between;
			padding: ${charts.legend.item.padding};

			:focus {
				outline: none;
			}

			${activeAndHover(css`
				background-color: ${charts.legend.item.activeAndHoverBG};
			`)};
		`;
	}
);

export const StyledRechartsLegendItemSurface = styled.div.withConfig({
	displayName: "StyledRechartsLegendItemSurface-sc-"
})(({ theme }) => {
	const { charts } = theme.components;

	return css`
		display: flex;
		margin: ${charts.legend.surface.margin};
		min-width: ${charts.legend.surface.minWidth};
	`;
});

export const StyledRechartsLegendSVGSurface = styled.svg.withConfig({
	displayName: "StyledRechartsLegendSVGSurface-sc-"
})(({ theme }) => {
	const { charts } = theme.components;

	return css`
		display: flex;
		height: ${charts.barChart.spacing};
		margin: ${charts.legend.surface.margin};
		min-width: ${charts.barChart.spacingMinWidth};
		width: ${charts.barChart.spacing};
	`;
});

export const StyledRechartsLegendItemText = styled.span.withConfig({ displayName: "StyledRechartsLegendItemText-sc-" })(
	({ theme }) => {
		const { charts } = theme.components;

		return css`
			color: ${charts.textColor};
			flex: 1 1 auto;
		`;
	}
);

export const StyledRechartsPieChartLegend = styled(List).withConfig({
	displayName: "StyledRechartsPieChartLegend-sc-"
})<{
	hideable?: boolean;
	layout?: LayoutType;
}>(({ theme, hideable, layout }) => {
	const { charts } = theme.components;
	const chartBaseSpacing = charts.legend.baseSpacing;

	return css`
		background-color: ${charts.pieChart.legend.background};
		border: ${charts.pieChart.border};
		font-family: ${charts.fontFamily};
		overflow: auto;

		${hideable &&
		css`
			background-color: ${charts.pieChart.hideableBG};
			white-space: nowrap;
		`}

		${layout === "horizontal"
			? css`
					display: inline-flex;
					flex: 1;
					flex-wrap: wrap;
					height: auto;
					${StyledListItemWrapper} {
						flex-grow: 1;
						flex-shrink: 0;
					}
				`
			: layout === "vertical" &&
				css`
					flex: none;
				`}
				  
			&.${baseLegendClassName}--top, &.${baseLegendClassName}--above {
			margin-bottom: ${chartBaseSpacing};
		}

		&.${baseLegendClassName}--bottom, &.${baseLegendClassName}--below {
			margin-top: ${chartBaseSpacing};
		}

		&.${baseLegendClassName}--right {
			margin-left: ${chartBaseSpacing};
		}

		&.${baseLegendClassName}--left {
			margin-right: ${chartBaseSpacing};
		}

		${StyledListItemGraphic} {
			border-radius: 50%;
			height: ${charts.pieChart.size};
			width: ${charts.pieChart.size};
		}
	`;
});

export const StyledPieChartLegendListItem = styled(List.Item).withConfig({
	displayName: "StyledPieChartLegendListItem-sc-"
})<{ blurred?: boolean }>(({ blurred }) => {
	return css`
		${blurred &&
		css`
			> * {
				opacity: 0.5;
			}
		`};
	`;
});

export const StyledPieChartWrapper = styled(PieChart).withConfig({ displayName: "StyledPieChartWrapper-sc-" })`
	.recharts-default-tooltip,
	.recharts-pie:focus {
		outline: none;
	}
`;
