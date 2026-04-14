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

import type { ReactNode, ReactElement } from "react";
import { Component } from "react";
import type { ResponsiveContainerProps } from "recharts";
import {
	Area,
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	Cell,
	Label as RechartsLabel,
	ReferenceDot,
	Tooltip,
	Legend as RechartsLegend,
	XAxis,
	YAxis,
	ComposedChart
} from "recharts";

import { provider } from "../../../common/main/device-detector.js";
import { bindMethods, addPrefix, generateUid, joinClassNames } from "../../../common/main/utils.js";
import { LegendUtils } from "../../utils/legend.utils.js";
import { StyledRechartsContainer } from "../../main/chart.styled.js";

import type { BarChartProps } from "./bar-chart.api.js";
import { BarChartColors, Legend } from "./tpl/bar-chart.tpl.view.js";

/** @deprecated since version 38.1.1. */
export interface BarChartState {
	hoveringLine: number | null;
	legendHeight?: number;
	legendWidth?: number;
	legendKey?: string;
}

const baseClassName = addPrefix("barChart");

/**
 * @deprecated since version 38.1.1. Use Recharts directly instead.
 */
export class BarChart extends Component<BarChartProps, BarChartState> {
	static displayName = "BarChart";
	static defaultProps = {
		showLegend: false,
		showTooltip: true
	};

	constructor(props: BarChartProps) {
		super(props);

		this.state = {
			hoveringLine: null,
			legendHeight: LegendUtils.getLegendHeight(props.height, props.legendProps),
			legendWidth: LegendUtils.getLegendWidth(props.width, props.legendProps)
		};
		bindMethods(this);
	}

	private handleMouseEnter(_: any, hoveringLine: number | null): void {
		this.setState({ hoveringLine });
	}

	private handleMouseLeave(): void {
		this.setState({ hoveringLine: null });
	}

	private getThresholdStyle(entry: any, dataKey: string, thresholdDataKey: string): object | undefined {
		return entry[dataKey] > entry[thresholdDataKey] ? this.props.aboveThresholdStyle : this.props.belowThresholdStyle;
	}

	private renderReferenceDots(): ReactNode {
		const { thresholdProps, data, labelKey } = this.props;

		if (!thresholdProps || (thresholdProps && thresholdProps.hide) || !data) {
			return undefined;
		}

		const referenceDotsData = [data[0], data[data.length - 1]];

		return referenceDotsData.map((dotData, index) => {
			if (!dotData) {
				return undefined;
			}

			return (
				<ReferenceDot
					key={`referenceDot-${index}`}
					x={dotData[labelKey]}
					y={dotData[thresholdProps.dataKey as string]}
					isFront={true}
					fill={BarChartColors.THRESHOLD_COLOR}
					r={3}
					stroke="none"
				/>
			);
		});
	}

	private renderReferenceActiveDot(): ReactNode {
		const { thresholdProps, data, labelKey } = this.props;

		if (!thresholdProps || (thresholdProps && thresholdProps.hide) || !data || !this.state.hoveringLine) {
			return undefined;
		}

		const activeDotData = data[this.state.hoveringLine];

		if (!activeDotData) {
			return undefined;
		}

		return (
			<ReferenceDot
				x={activeDotData[labelKey]}
				y={activeDotData[thresholdProps.dataKey as string]}
				isFront={true}
				stroke={BarChartColors.THRESHOLD_ACTIVE_DOT_STROKE}
				fill="transparent"
				r={4}
				strokeWidth="2"
				cursor="pointer"
				onMouseEnter={(dotProps, event) => this.handleMouseEnter(event, this.state.hoveringLine)}
			/>
		);
	}

	private renderThreshold(): ReactNode {
		const { thresholdProps, data } = this.props;
		const { hoveringLine } = this.state;

		if (!thresholdProps || (thresholdProps && thresholdProps.hide) || !data) {
			return undefined;
		}

		const { hide, ref, ...props } = thresholdProps;

		return (
			<Area
				{...props}
				fill={hoveringLine === data.length ? BarChartColors.THRESHOLD_FILL : BarChartColors.THRESHOLD_HOVER_FILL}
				stroke={BarChartColors.THRESHOLD_COLOR}
				strokeWidth={2}
				strokeDasharray="2 4"
			/>
		);
	}

	static getDerivedStateFromProps(nextProps: BarChartProps, currentState: BarChartState): BarChartState | null {
		const legendHeight = LegendUtils.getLegendHeight(nextProps.height, nextProps.legendProps);
		const legendWidth = LegendUtils.getLegendWidth(nextProps.width, nextProps.legendProps);

		if (legendHeight !== currentState.legendHeight || legendWidth !== currentState.legendWidth) {
			return { ...currentState, legendHeight, legendWidth };
		}

		return null;
	}

	componentDidMount(): void {
		if (this.props.showLegend || this.props.legendProps) {
			// Force legend re-render to prevent overlap with bar chart due to recharts layout calculation timing issue
			this.setState({ legendKey: generateUid() });
		}
	}

	render(): ReactNode {
		const {
			data,
			labelKey,
			children,
			cartesianGridProps,
			xAxisProps,
			xAxisLabel,
			xAxisLabelProps,
			yAxisProps,
			yAxisLabel,
			yAxisLabelProps,
			tooltipProps,
			barPropsMap,
			cellPropsList,
			legendProps,
			thresholdProps,
			showLegend,
			showTooltip,
			className,
			onLegendClick,
			...rest
		} = this.props;

		const classNames = joinClassNames(baseClassName, className);
		const { hoveringLine, legendWidth, legendHeight } = this.state;
		const Wrapper = thresholdProps && !thresholdProps.hide ? ComposedChart : RechartsBarChart;
		const { ref, ...restOfCartesianGridProps } = cartesianGridProps ?? {};

		return (
			<Wrapper layout="horizontal" data={data} onMouseLeave={this.handleMouseLeave} className={classNames} {...rest}>
				{cartesianGridProps && (
					<CartesianGrid
						stroke={BarChartColors.GRID_STROKE}
						strokeWidth={2}
						strokeDasharray="2 4"
						{...restOfCartesianGridProps}
					/>
				)}
				{cartesianGridProps && cartesianGridProps.vertical && (
					<YAxis
						yAxisId="right"
						orientation="right"
						axisLine={{ stroke: BarChartColors.GRID_STROKE, strokeWidth: 2 }}
					/>
				)}
				{cartesianGridProps && cartesianGridProps.horizontal && (
					<XAxis
						xAxisId="top"
						orientation="top"
						axisLine={{ stroke: BarChartColors.GRID_STROKE, strokeWidth: 2 }}
						tick={false}
					/>
				)}
				{showTooltip && (
					<Tooltip cursor={{ fill: BarChartColors.TOOLTIP_CURSOR_FILL, opacity: 0.25 }} {...tooltipProps} />
				)}
				{this.renderThreshold()}
				{Object.keys(barPropsMap).map((key) => {
					const barProps = barPropsMap[key];
					const { color, ref, ...restOfBarProps } = barProps;

					return (
						<Bar
							key={key}
							fill={color}
							{...restOfBarProps}
							onMouseEnter={this.handleMouseEnter}
							onMouseLeave={this.handleMouseLeave}
						>
							{data &&
								data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										cursor="pointer"
										opacity={hoveringLine !== null && hoveringLine !== index ? 0.5 : 1}
										stroke={hoveringLine === index ? BarChartColors.BAR_HOVER_STROKE : undefined}
										strokeWidth={1}
										{...(thresholdProps && this.getThresholdStyle(entry, key, thresholdProps.dataKey as string))}
										{...(cellPropsList && cellPropsList[index])}
									/>
								))}
						</Bar>
					);
				})}

				{this.renderReferenceDots()}
				{this.renderReferenceActiveDot()}

				<XAxis
					height={48}
					tick={{ fill: BarChartColors.AXES_TICK_COLOR }}
					stroke={BarChartColors.AXES_TICK_COLOR}
					{...xAxisProps}
				>
					{xAxisLabel && (
						<RechartsLabel
							className={`${baseClassName}__axis-label`}
							value={xAxisLabel}
							offset={0}
							position="insideBottom"
							{...xAxisLabelProps}
						/>
					)}
				</XAxis>
				<YAxis
					width={56}
					tick={{ fill: BarChartColors.AXES_TICK_COLOR }}
					stroke={BarChartColors.AXES_TICK_COLOR}
					{...yAxisProps}
				>
					{yAxisLabel && (
						<RechartsLabel
							className={`${baseClassName}__axis-label`}
							value={yAxisLabel}
							position="insideLeft"
							angle={-90}
							{...yAxisLabelProps}
						/>
					)}
				</YAxis>

				{(showLegend || legendProps) &&
					Object.keys(barPropsMap).map((key) => {
						const { ref, ...restOfLegendProps } = legendProps ?? {};

						return (
							<RechartsLegend
								key={`legend-${key}${this.state.legendKey}`}
								layout="vertical"
								wrapperStyle={LegendUtils.getLegendWrapperStyle(legendProps)}
								content={
									<Legend
										labelKey={labelKey}
										dataKey={key}
										data={data}
										cellPropsList={cellPropsList}
										hoveringLine={hoveringLine}
										threshold={thresholdProps}
										onMouseEnter={this.handleMouseEnter}
										onMouseLeave={this.handleMouseLeave}
										onLegendClick={onLegendClick}
										hideable={legendProps ? legendProps.hideable : false}
										height={legendHeight}
										width={legendWidth}
									/>
								}
								{...restOfLegendProps}
								align={LegendUtils.getLegendHorizontalAlignment(legendProps)}
								verticalAlign={LegendUtils.getLegendVerticalAlignment(legendProps)}
							/>
						);
					})}

				{children}
			</Wrapper>
		);
	}
}

type ResponsiveChartContainerProps = ResponsiveContainerProps;

/**
 * @deprecated since version 38.1.1. Use Recharts directly instead.
 */
export function ResponsiveChartContainer(
	props: ResponsiveChartContainerProps
): ReactElement<ResponsiveChartContainerProps> {
	const { width, ...rest } = props;

	return <StyledRechartsContainer width={provider.isDesktop() ? width : "100%"} {...rest} />;
}

ResponsiveChartContainer.displayName = "ResponsiveChartContainer";
