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

import type { ReactNode, MouseEvent, SyntheticEvent, KeyboardEvent, ReactElement } from "react";
import { Component, isValidElement, cloneElement } from "react";
import type { DotProps } from "recharts";

import { AttachedPortal } from "../../../../attached-portal/main/attached-portal.view.js";
import { bindMethods, addPrefix, joinClassNames } from "../../../../common/main/utils.js";
import { DataRoles } from "../../../../common/main/data-roles.js";
import {
	StyledRechartsLegend,
	StyledRechartsLegendItem,
	StyledRechartsLegendItemSurface,
	StyledRechartsLegendItemText
} from "../../../main/chart.styled.js";

import { Button } from "./../../../../button/main/button.view.js";
import { Icon } from "./../../../../icon/main/icon.view.js";
import type { LegendProps, ItemProps } from "./line-chart.tpl.api.js";

const baseClassName = addPrefix("chart__legend");

/** @deprecated since version 38.1.1. */
export const LineChartColors = {
	COMPARABLE_CHART_COLOR: "#8c99a6",
	COMPARABLE_CHART_FILL: "#f1f2f4",
	COMPARABLE_CHART_HOVER_FILL: "#e2e6e9",
	GRID_STROKE: "#e2e6e9",
	LABEL_COLOR: "#000000",
	AXES_TICK_COLOR: "#8c99a6",
	AXES_LABEL_COLOR: "#16191d"
};

/** @deprecated since version 38.1.1. */
interface LegendState {
	open: boolean;
}

/**
 * @deprecated since version 38.1.1.
 * This component uses customized elements. Therefore, relying solely on Recharts may not provide the same result.
 * If you still wish to implement this functionality, please refer to the existing implementation to apply the necessary customizations in your project.
 */
export class Legend extends Component<LegendProps, LegendState> {
	static displayName = "Legend";
	private buttonHideRef: HTMLElement | null = null;
	private hideButtonHeight = 0;

	static defaultProps = {
		layout: "vertical",
		align: "right",
		verticalAlign: "top"
	};

	constructor(props: LegendProps) {
		super(props);
		this.state = { open: false };

		bindMethods(this);
	}

	componentDidMount(): void {
		if (this.props.hideable && this.buttonHideRef) {
			this.hideButtonHeight = this.buttonHideRef.clientHeight;
		}
	}

	private handleOnClickHideButton(): void {
		this.setState((prevState) => ({
			open: !prevState.open
		}));
	}

	private handleOnLegendVisibilityChange(isVisible: boolean): void {
		if (!isVisible) {
			this.setState({ open: false });
		}
	}

	private renderLegend(): ReactNode {
		const {
			style,
			linePropsMap,
			lineVisibilityMap,
			layout,
			hideable,
			thresholdLineProps,
			comparableAreaProps,
			height,
			width,
			...lineInteractionProps
		} = this.props;

		const className = joinClassNames(
			baseClassName,
			`${baseClassName}--layout-${layout}`,
			hideable ? `${baseClassName}--hideable` : undefined,
			this.props.className
		);

		const legendStyle = {
			maxHeight: height && (hideable ? height - this.hideButtonHeight : height - 20),
			maxWidth: width,
			...style
		};

		return (
			<StyledRechartsLegend
				className={className}
				style={legendStyle}
				layout={layout}
				data-role={DataRoles.LineChart.Legend}
			>
				{Object.keys(linePropsMap).map((dataKey) => (
					<Item
						key={dataKey}
						dataKey={dataKey}
						lineProps={linePropsMap[dataKey]}
						lineVisibility={lineVisibilityMap && lineVisibilityMap[dataKey]}
						{...lineInteractionProps}
					/>
				))}
				{thresholdLineProps && (
					<Item
						key={thresholdLineProps.dataKey as string}
						dataKey={thresholdLineProps.dataKey as string}
						lineProps={{ threshold: true, ...thresholdLineProps }}
						{...lineInteractionProps}
					/>
				)}
				{comparableAreaProps && (
					<Item
						key={comparableAreaProps.dataKey as string}
						dataKey={comparableAreaProps.dataKey as string}
						comparableAreaProps={comparableAreaProps}
						{...lineInteractionProps}
					/>
				)}
			</StyledRechartsLegend>
		);
	}

	render(): ReactNode {
		const { hideable } = this.props;

		return hideable
			? [
					<Button
						key="legend__button"
						primary
						icon={<Icon>{this.state.open ? "close" : "info"}</Icon>}
						onClick={this.handleOnClickHideButton}
						buttonRef={(ref) => {
							this.buttonHideRef = ref;
						}}
					/>,
					this.state.open && this.buttonHideRef && (
						<AttachedPortal
							closeOnClickReferenceElement={false}
							key="legend__portal"
							referenceElement={this.buttonHideRef}
							closeOnOutsideClick
							onVisibilityChange={this.handleOnLegendVisibilityChange}
							orientationList={["bottom-end", "top-end"]}
							fixedOrientation
						>
							{this.renderLegend()}
						</AttachedPortal>
					)
				]
			: this.renderLegend();
	}
}

/**
 * @deprecated since version 38.1.1.
 * This component uses customized elements. Therefore, relying solely on Recharts may not provide the same result.
 * If you still wish to implement this functionality, please refer to the existing implementation to apply the necessary customizations in your project.
 */
export function Item(props: ItemProps): ReactElement<ItemProps> {
	const className = joinClassNames(`${baseClassName}-item`, props.className);

	const {
		style,
		lineProps,
		dataKey,
		lineVisibility,
		onMouseEnter,
		onMouseLeave,
		toggleLine,
		showAndHideLines,
		hoveringLine,
		onLegendClick,
		comparableAreaProps
	} = props;

	function handleMouseEnter(event: MouseEvent<HTMLElement>): void {
		if (onMouseEnter) {
			onMouseEnter(event, dataKey);
		}
	}

	function handleClick(event: SyntheticEvent<HTMLElement>): void {
		if (onLegendClick) {
			onLegendClick(event, dataKey);
		}
	}

	function handleToggleLine(): void {
		if (toggleLine && lineVisibility !== undefined) {
			toggleLine(dataKey, lineVisibility);
		}
	}

	function handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (event.key !== "Enter") {
			return;
		}

		handleClick(event);
	}

	return (
		<StyledRechartsLegendItem
			className={className}
			style={{ opacity: hoveringLine && hoveringLine !== dataKey ? 0.5 : 1, ...style }}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{lineProps &&
				!lineProps.threshold &&
				(lineProps ? (
					isValidElement<DotProps>(lineProps.dot) ? (
						cloneElement(lineProps.dot, { fill: lineProps.fill })
					) : (
						<StyledRechartsLegendItemSurface className={`${baseClassName}-surface`}>
							<svg width={30} height={5}>
								<line
									fill={lineProps.fill !== null ? lineProps.fill : undefined}
									stroke={lineProps.stroke}
									strokeDasharray={lineProps.strokeDasharray}
									strokeWidth={lineProps.strokeWidth}
									y1={lineProps.strokeWidth}
									y2={lineProps.strokeWidth}
									x1={0}
									x2={30}
								/>
							</svg>
						</StyledRechartsLegendItemSurface>
					)
				) : undefined)}
			{lineProps && lineProps.threshold && (
				<StyledRechartsLegendItemSurface className={`${baseClassName}-surface`}>
					<svg width={30} height={5}>
						<line
							fill={lineProps.fill || LineChartColors.COMPARABLE_CHART_FILL}
							stroke={lineProps.stroke || LineChartColors.COMPARABLE_CHART_COLOR}
							strokeDasharray={lineProps.strokeDasharray ? lineProps.strokeDasharray : "5 5"}
							strokeWidth={lineProps.strokeWidth ? lineProps.strokeWidth : 3}
							y1={lineProps.strokeWidth}
							y2={lineProps.strokeWidth}
							x1={0}
							x2={30}
						/>
					</svg>
				</StyledRechartsLegendItemSurface>
			)}
			{comparableAreaProps && (
				<StyledRechartsLegendItemSurface className={`${baseClassName}-surface`}>
					<svg width={30} height={15}>
						<rect
							height="100%"
							width="100%"
							mask={comparableAreaProps.mask}
							fill={comparableAreaProps.fill || LineChartColors.COMPARABLE_CHART_FILL}
							stroke={comparableAreaProps.stroke || LineChartColors.COMPARABLE_CHART_COLOR}
							strokeDasharray={comparableAreaProps.strokeDasharray || "5 5"}
							strokeWidth={comparableAreaProps.strokeWidth || 3}
						/>
					</svg>
				</StyledRechartsLegendItemSurface>
			)}
			<StyledRechartsLegendItemText className={`${baseClassName}-text`}>{dataKey}</StyledRechartsLegendItemText>
			{showAndHideLines && (
				<Button
					icon={lineVisibility ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
					onClick={handleToggleLine}
				/>
			)}
		</StyledRechartsLegendItem>
	);
}

Item.displayName = "Item";
