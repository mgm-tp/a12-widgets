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

import type { ReactNode, MouseEvent as ReactMouseEvent, ReactElement, CSSProperties } from "react";
import { PureComponent, Children } from "react";
import type { Margin, PolarViewBox } from "recharts/types/util/types.js";
import type { CellProps } from "recharts";
import { Cell, Legend, Pie, Tooltip, Label as RechartsLabel } from "recharts";

import { addPrefix, bindMethods, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { LegendUtils } from "../../utils/legend.utils.js";
import { StyledPieChartWrapper } from "../../main/chart.styled.js";

import type { PieChartProps, Rotation } from "./pie-chart.api.js";
import { PieChartElements } from "./tpl/pie-chart.tpl.view.js";
import type { PieChartElementsProps } from "./tpl/pie-chart.tpl.api.js";

const baseClassName = addPrefix("pie-chart");

interface PieChartState {
	margin: Margin;
	hoveringDataKey: string;
	clickDataKey: string;
	legendHeight?: number;
	legendWidth?: number;
}

/**
 * @deprecated since version 38.2.1. Use Recharts directly instead.
 */
export class PieChart extends PureComponent<PieChartProps, PieChartState> {
	static displayName = "PieChart";
	static defaultProps = {
		data: [],
		rotation: "clockwise"
	};

	private containerRef: HTMLElement | null;
	private pieRef: SVGGElement | null;

	constructor(props: PieChartProps) {
		super(props);

		this.state = {
			margin: {},
			hoveringDataKey: "",
			clickDataKey: ""
		};

		this.containerRef = null;
		this.pieRef = null;

		bindMethods(this);
	}

	componentDidMount(): void {
		document.addEventListener("mousedown", this.handleOutsideLegendAndPieClickEvent);
	}

	static getDerivedStateFromProps(nextProps: PieChartProps, currentState: PieChartState): PieChartState {
		const { width, height, legendProps } = nextProps;

		return {
			...currentState,
			legendHeight: getLegendHeight(height, legendProps),
			legendWidth: getLegendWidth(width, legendProps)
		};
	}

	componentWillUnmount(): void {
		document.removeEventListener("mousedown", this.handleOutsideLegendAndPieClickEvent);
	}

	render(): ReactNode {
		const {
			children,
			legendProps,
			toolTipProps,
			pieProps,
			data,
			innerRadius,
			outerRadius,
			style,
			className,
			label,
			rotation,
			...rest
		} = this.props;

		const { ref, ...restOfPieProps } = pieProps ?? {};
		const {
			ref: legendPropRef,
			onClick,
			onMouseLeave,
			onMouseEnter,
			enableLegendSorting,
			...restOfLegendProps
		} = legendProps ?? {};

		const classNames = joinClassNames(baseClassName, className);

		const customizedData = this.getDataByRotation(data, rotation);

		return (
			<PieChartElements.labelMarginContext.Provider
				value={{
					getLabelMargin: this.handleMargin
				}}
			>
				<StyledPieChartWrapper
					className={classNames}
					style={style}
					margin={this.state.margin}
					{...rest}
					ref={this.handleChartRef}
				>
					<Pie
						strokeWidth={0}
						startAngle={-270}
						{...restOfPieProps}
						data={customizedData}
						dataKey="value"
						nameKey="name"
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						onMouseEnter={this.handlePieMouseEnter}
						onMouseLeave={this.handlePieMouseLeave}
						onClick={this.handlePieClick}
						ref={this.handlePieRef}
					>
						{customizedData.map(this.renderChartCells)}
						{Children.map(label, (element) => (
							<RechartsLabel
								content={({ viewBox, offset }) => {
									return (
										<PieChartElements.labelContentContext.Provider
											value={{
												viewBox: viewBox as PolarViewBox,
												offset: offset || 0
											}}
										>
											{element}
										</PieChartElements.labelContentContext.Provider>
									);
								}}
							/>
						))}
					</Pie>
					<Tooltip {...toolTipProps} />
					{legendProps && (
						<Legend
							layout="vertical"
							content={this.props.legendProps?.content ?? this.renderLegendContent}
							{...restOfLegendProps}
							wrapperStyle={this.getLegendWrapperStyle()}
							align={LegendUtils.getLegendHorizontalAlignment(legendProps)}
							verticalAlign={LegendUtils.getLegendVerticalAlignment(legendProps)}
						/>
					)}
				</StyledPieChartWrapper>
			</PieChartElements.labelMarginContext.Provider>
		);
	}

	private getLegendWrapperStyle(): CSSProperties | undefined {
		const { legendProps } = this.props;

		if (!legendProps) {
			return;
		}

		let wrapperStyle;

		if (
			legendProps.verticalAlign === "above" ||
			legendProps.verticalAlign === "below" ||
			legendProps.layout === "horizontal"
		) {
			const verticalAlignmentStyle = { display: "flex", width: "100%" };

			if (legendProps.align === "right") {
				wrapperStyle = { ...verticalAlignmentStyle, justifyContent: "flex-end" };
			}

			if (legendProps.align === "left") {
				wrapperStyle = { ...verticalAlignmentStyle, justifyContent: "flex-start" };
			}

			if (legendProps.align === "center") {
				wrapperStyle = { ...verticalAlignmentStyle, justifyContent: "center" };
			}
		}

		return wrapperStyle;
	}

	private getDataByRotation(
		data: PieChartElementsProps.ChartData[],
		rotation?: Rotation
	): PieChartElementsProps.ChartData[] {
		const sortedData = this.sortData(data);

		return rotation === "clockwise" ? sortedData.slice().reverse() : sortedData;
	}

	private handleOutsideLegendAndPieClickEvent(event: MouseEvent): void {
		const target = event.srcElement || event.target;
		const legendDOM = this.containerRef?.querySelector(`[data-role="${DataRoles.PieChart.Legend}"]`);

		if (
			legendDOM &&
			this.pieRef &&
			target &&
			target instanceof Node &&
			!legendDOM.contains(target) &&
			!this.pieRef.contains(target)
		) {
			this.setState({
				clickDataKey: ""
			});
		}
	}

	private handleChartRef(ref: any | null): void {
		if (!ref) {
			this.containerRef = null;

			return;
		}

		this.containerRef = ref.container;
	}

	private handlePieRef(ref: unknown | null): void {
		if (!isPie(ref)) {
			this.pieRef = null;

			return;
		}

		this.pieRef = ref.pieRef;

		function isPie(reference: unknown | null): reference is Pie {
			return reference instanceof Pie && reference.pieRef instanceof Element;
		}
	}

	private handleMargin(margin: Margin): void {
		if (JSON.stringify(this.state.margin) === JSON.stringify(margin)) {
			return;
		}

		this.setState({
			margin
		});
	}

	private handleLegendVisibilityChange(isVisible: boolean): void {
		if (!isVisible) {
			this.setState({
				clickDataKey: ""
			});
		}
	}

	private sortData(data: PieChartElementsProps.ChartData[]): PieChartElementsProps.ChartData[] {
		const { legendProps } = this.props;
		const { enableLegendSorting = true } = legendProps ?? {};

		return legendProps && enableLegendSorting ? data.sort((a, b) => b.value - a.value) : data;
	}

	private renderLegendContent(): ReactElement | null {
		const { legendProps, style, data } = this.props;

		if (!legendProps) {
			return null;
		}

		const customizedData = this.sortData(data);
		const { ref, onMouseEnter, onMouseLeave, onClick, ...restOfLegendsProps } = legendProps;

		return (
			<PieChartElements.Legend
				data={customizedData}
				activeDataKey={this.state.hoveringDataKey || this.state.clickDataKey}
				onMouseEnter={this.handleLegendItemMouseEnter}
				onMouseLeave={this.handleLegendItemMouseLeave}
				onClick={this.handleLegendClick}
				onLegendVisibilityChange={this.handleLegendVisibilityChange}
				height={this.state.legendHeight}
				width={this.state.legendWidth}
				style={style}
				{...restOfLegendsProps}
			/>
		);
	}

	private renderChartCells(entry: PieChartElementsProps.ChartData, index: number): ReactNode {
		let opacity = 1;
		const { hoveringDataKey, clickDataKey } = this.state;

		if (hoveringDataKey) {
			if (hoveringDataKey !== entry.name) {
				opacity = 0.5;
			}
		} else if (clickDataKey && clickDataKey !== entry.name) {
			opacity = 0.5;
		}

		return <Cell key={`cell-${index}`} fill={entry.color} opacity={opacity} style={{ outline: "none" }} />;
	}

	private handlePieClick(
		cellProps: CellProps & PieChartElementsProps.ChartData,
		index: number,
		event: ReactMouseEvent
	): void {
		const { legendProps, pieProps } = this.props;

		if (pieProps && pieProps.onClick) {
			pieProps.onClick(cellProps, index, event);
		}

		if (legendProps) {
			this.setState({
				clickDataKey: cellProps.name
			});
		}
	}

	private handlePieMouseEnter(
		cellProps: CellProps & PieChartElementsProps.ChartData,
		index: number,
		event: ReactMouseEvent
	): void {
		const { pieProps } = this.props;

		if (pieProps && pieProps.onMouseEnter) {
			pieProps.onMouseEnter(cellProps, index, event);
		}

		this.setState({
			hoveringDataKey: cellProps.name
		});
	}

	private handlePieMouseLeave(
		cellProps: CellProps & PieChartElementsProps.ChartData,
		index: number,
		event: ReactMouseEvent
	): void {
		const { pieProps } = this.props;

		if (pieProps && pieProps.onMouseLeave) {
			pieProps.onMouseLeave(cellProps, index, event);
		}

		this.setState({
			hoveringDataKey: ""
		});
	}

	private handleLegendItemMouseEnter(data: PieChartElementsProps.ChartData, event: ReactMouseEvent<HTMLElement>): void {
		const { legendProps } = this.props;

		if (legendProps && legendProps.onMouseEnter) {
			legendProps.onMouseEnter(data, event);
		}

		this.setState({
			hoveringDataKey: data.name
		});
	}

	private handleLegendItemMouseLeave(data: PieChartElementsProps.ChartData, event: ReactMouseEvent<HTMLElement>): void {
		const { legendProps } = this.props;

		if (legendProps && legendProps.onMouseLeave) {
			legendProps.onMouseLeave(data, event);
		}

		this.setState({
			hoveringDataKey: ""
		});
	}

	private handleLegendClick(data: PieChartElementsProps.ChartData, event: ReactMouseEvent<HTMLElement>): void {
		const { legendProps } = this.props;

		if (legendProps && legendProps.onClick) {
			legendProps.onClick(data, event);
		}

		this.setState({
			clickDataKey: data.name
		});
	}
}

function getLegendWidth(width?: number, legendProps?: PieChartElementsProps.LegendProps): number | undefined {
	return legendProps?.width || (width ? (legendProps?.hideable ? width : width / 2) : undefined);
}

function getLegendHeight(height?: number, legendProps?: PieChartElementsProps.LegendProps): number | undefined {
	return legendProps?.height || height;
}
