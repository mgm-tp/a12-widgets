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

import type { MouseEvent, ReactNode } from "react";
import { Component } from "react";
import {
	Legend as RechartsLegend,
	Area,
	Line,
	LineChart as RechartsLineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Label as RechartsLabel,
	Tooltip,
	ComposedChart,
	ReferenceDot
} from "recharts";

import { bindMethods, addPrefix, generateUid, joinClassNames } from "../../../common/main/utils.js";
import { LegendUtils } from "../../utils/legend.utils.js";

import type { LineChartProps } from "./line-chart.api.js";
import { Legend, LineChartColors } from "./tpl/line-chart.tpl.view.js";

const baseClassName = addPrefix("lineChart");

/** @deprecated since version 38.1.1. */
export interface LineChartWidgetState {
	lineVisibilityMap: { [dataKey: string]: boolean };
	hoveringLine: string | null;
	legendHeight?: number;
	legendWidth?: number;
	legendKey?: string;
}

/**
 * @deprecated since version 38.1.1. Use Recharts directly instead.
 */
export class LineChart extends Component<LineChartProps, LineChartWidgetState> {
	static displayName = "LineChart";
	static defaultProps = {
		showAndHideLines: false
	};

	constructor(props: LineChartProps) {
		super(props);

		this.state = {
			lineVisibilityMap: this.mapLineVisibility(),
			hoveringLine: null,
			legendHeight: LegendUtils.getLegendHeight(props.height, props.legendProps),
			legendWidth: LegendUtils.getLegendWidth(props.width, props.legendProps)
		};

		bindMethods(this);
	}

	private mapLineVisibility(): { [dataKey: string]: boolean } {
		const lineVisibilityMap: { [dataKey: string]: boolean } = {};

		if (this.props.linePropsMap) {
			Object.keys(this.props.linePropsMap).forEach((key) => (lineVisibilityMap[key] = true));
		}

		return lineVisibilityMap;
	}

	private handleMouseEnterLegend(event: MouseEvent<HTMLElement>, dataKey: string): void {
		this.setState({ hoveringLine: dataKey });
	}

	private handleMouseLeaveLegend(): void {
		this.setState({ hoveringLine: null });
	}

	private handleMouseEnterLine(event: MouseEvent, dataKey: string): void {
		this.setState({ hoveringLine: dataKey });
	}

	private handleMouseLeaveLine(): void {
		this.setState({ hoveringLine: null });
	}

	private toggleLine(dataKey: string, lineShow: boolean): void {
		this.setState((prevState) => {
			return { lineVisibilityMap: { ...prevState.lineVisibilityMap, [dataKey]: !lineShow } };
		});
	}

	private renderChartLegend(): ReactNode {
		const {
			legendProps,
			linePropsMap,
			showAndHideLines,
			showLegend,
			onLegendClick,
			thresholdLineProps,
			comparableAreaProps
		} = this.props;

		if (!legendProps && !showLegend) {
			return null;
		}

		const { hoveringLine, lineVisibilityMap, legendWidth, legendHeight } = this.state;
		const { ref, ...restOfLegendProps } = legendProps ?? {};

		return (
			<RechartsLegend
				content={
					legendProps && legendProps.content ? (
						legendProps.content
					) : (
						<Legend
							linePropsMap={linePropsMap}
							onMouseEnter={this.handleMouseEnterLegend}
							onMouseLeave={this.handleMouseLeaveLegend}
							showAndHideLines={showAndHideLines}
							lineVisibilityMap={lineVisibilityMap}
							toggleLine={this.toggleLine}
							hoveringLine={hoveringLine}
							onLegendClick={onLegendClick}
							thresholdLineProps={thresholdLineProps}
							comparableAreaProps={comparableAreaProps}
							height={legendHeight}
							width={legendWidth}
						/>
					)
				}
				layout="vertical"
				wrapperStyle={LegendUtils.getLegendWrapperStyle(legendProps)}
				{...restOfLegendProps}
				align={LegendUtils.getLegendHorizontalAlignment(legendProps)}
				verticalAlign={LegendUtils.getLegendVerticalAlignment(legendProps)}
				key={this.state.legendKey}
			/>
		);
	}

	private renderThresholdDots(): ReactNode {
		const { data, thresholdLineProps, xAxisProps } = this.props;

		if (!data || !thresholdLineProps || !xAxisProps) {
			return undefined;
		}

		const labelKey = xAxisProps.dataKey as string;
		const thresholdKey = thresholdLineProps.dataKey as string;
		const referenceDots = [data[0], data[data.length - 1]];

		return referenceDots.map((dot: any, index) => {
			if (!dot) {
				return undefined;
			}

			return (
				<ReferenceDot
					key={index}
					x={dot[labelKey]}
					y={dot[thresholdKey]}
					isFront={true}
					stroke={LineChartColors.COMPARABLE_CHART_COLOR}
					fill={LineChartColors.COMPARABLE_CHART_COLOR}
					r={3}
				/>
			);
		});
	}

	private renderComparableAreaDots(): ReactNode {
		const { data, comparableAreaProps, xAxisProps } = this.props;

		if (!data || !comparableAreaProps || !xAxisProps) {
			return undefined;
		}

		const labelKey = xAxisProps.dataKey as string;
		const comparableKey = comparableAreaProps.dataKey as string;
		const referenceDots = [data[0], data[data.length - 1]];

		return referenceDots.map((dot: any) => {
			if (!dot) {
				return undefined;
			}

			return dot[comparableKey].map((el: number) => {
				return (
					<ReferenceDot
						key={el}
						x={dot[labelKey]}
						y={el}
						isFront={true}
						stroke={LineChartColors.COMPARABLE_CHART_COLOR}
						fill={LineChartColors.COMPARABLE_CHART_COLOR}
						r={3}
					/>
				);
			});
		});
	}

	private renderThreshold(): ReactNode {
		const { thresholdLineProps } = this.props;
		const { hoveringLine } = this.state;
		const { ref, ...restOfThresholdLineProps } = thresholdLineProps ?? {};

		return (
			thresholdLineProps && (
				<Area
					stroke={LineChartColors.COMPARABLE_CHART_COLOR}
					strokeDasharray="2 4"
					strokeWidth={2}
					fill={
						hoveringLine === thresholdLineProps.dataKey
							? LineChartColors.COMPARABLE_CHART_HOVER_FILL
							: LineChartColors.COMPARABLE_CHART_FILL
					}
					fillOpacity={1}
					{...(restOfThresholdLineProps as any)}
				/>
			)
		);
	}

	private renderComparableArea(): ReactNode {
		const { hoveringLine } = this.state;
		const { comparableAreaProps } = this.props;
		const { ref, dataKey, ...restOfComparableAreaProps } = comparableAreaProps ?? {};

		return (
			comparableAreaProps && (
				<Area
					stroke={LineChartColors.COMPARABLE_CHART_COLOR}
					strokeDasharray="2 4"
					strokeWidth={2}
					fill={
						hoveringLine === comparableAreaProps.dataKey
							? LineChartColors.COMPARABLE_CHART_HOVER_FILL
							: LineChartColors.COMPARABLE_CHART_FILL
					}
					fillOpacity={1}
					dataKey={dataKey ?? ""}
					{...restOfComparableAreaProps}
				/>
			)
		);
	}

	static getDerivedStateFromProps(
		nextProps: LineChartProps,
		currentState: LineChartWidgetState
	): LineChartWidgetState | null {
		const legendHeight = LegendUtils.getLegendHeight(nextProps.height, nextProps.legendProps);
		const legendWidth = LegendUtils.getLegendWidth(nextProps.width, nextProps.legendProps);

		if (legendHeight !== currentState.legendHeight || legendWidth !== currentState.legendWidth) {
			return { ...currentState, legendHeight, legendWidth };
		}

		return null;
	}

	componentDidMount(): void {
		if (this.props.showLegend || this.props.legendProps) {
			// Regenerate legend to prevent overlap with line chart
			this.setState({ legendKey: generateUid() });
		}
	}

	render(): ReactNode {
		const {
			className,
			children,
			cartesianGridProps,
			tooltipProps,
			xAxisProps,
			yAxisProps,
			xAxisLabel,
			yAxisLabel,
			linePropsMap,
			legendProps,
			showLegend,
			showAndHideLines,
			onLegendClick,
			thresholdLineProps,
			comparableAreaProps,
			...rest
		} = this.props;

		const classNames = joinClassNames(baseClassName, className);
		const { hoveringLine, lineVisibilityMap } = this.state;
		const ChartWrapper = comparableAreaProps || thresholdLineProps ? ComposedChart : RechartsLineChart;
		const { ref, ...restOfCartesianGridProps } = cartesianGridProps ?? {};

		return (
			<ChartWrapper className={classNames} layout="horizontal" {...rest}>
				{children}

				{cartesianGridProps && (
					<CartesianGrid
						stroke={LineChartColors.GRID_STROKE}
						strokeWidth={2}
						strokeDasharray="2 4"
						{...restOfCartesianGridProps}
					/>
				)}

				{cartesianGridProps && cartesianGridProps.vertical && (
					<YAxis
						yAxisId="right"
						orientation="right"
						axisLine={{ stroke: LineChartColors.GRID_STROKE, strokeWidth: 2 }}
					/>
				)}
				{cartesianGridProps && cartesianGridProps.horizontal && (
					<XAxis
						xAxisId="top"
						orientation="top"
						axisLine={{ stroke: LineChartColors.GRID_STROKE, strokeWidth: 2 }}
						tick={false}
					/>
				)}
				<XAxis
					height={48}
					tick={{ fill: LineChartColors.AXES_TICK_COLOR }}
					stroke={LineChartColors.AXES_TICK_COLOR}
					{...xAxisProps}
				>
					{xAxisLabel && (
						<RechartsLabel
							className={`${baseClassName}__axis-label`}
							value={xAxisLabel}
							position="insideBottom"
							fill={LineChartColors.AXES_LABEL_COLOR}
						/>
					)}
				</XAxis>
				<YAxis
					width={56}
					tick={{ fill: LineChartColors.AXES_TICK_COLOR }}
					stroke={LineChartColors.AXES_TICK_COLOR}
					{...yAxisProps}
				>
					{yAxisLabel && (
						<RechartsLabel
							className={`${baseClassName}__axis-label`}
							value={yAxisLabel}
							position="insideLeft"
							angle={-90}
							fill={LineChartColors.AXES_LABEL_COLOR}
						/>
					)}
				</YAxis>

				<Tooltip separator=" " wrapperStyle={{ backgroundColor: "red" }} {...tooltipProps} />

				{this.renderThreshold()}
				{this.renderThresholdDots()}

				{this.renderComparableArea()}
				{this.renderComparableAreaDots()}

				{Object.keys(linePropsMap).map((key) => {
					const lineProps = linePropsMap[key];
					const { ref, ...restOfLineProps } = lineProps;

					if (!lineVisibilityMap[key]) {
						return null;
					}

					return (
						<Line
							key={key}
							strokeOpacity={hoveringLine && hoveringLine !== key ? 0.4 : 1}
							activeDot={{
								onClick: (data: object) => {
									this.props.onDotClick?.(data);
								},
								r: 5
							}}
							fill={hoveringLine ? (hoveringLine !== key ? undefined : (lineProps.stroke as string)) : undefined}
							onMouseEnter={(curveProps, event) => this.handleMouseEnterLine(event, key)}
							onMouseLeave={this.handleMouseLeaveLine}
							{...restOfLineProps}
						/>
					);
				})}

				{this.renderChartLegend()}
			</ChartWrapper>
		);
	}
}
