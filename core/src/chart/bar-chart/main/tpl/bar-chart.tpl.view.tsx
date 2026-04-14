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

import type { ReactNode, MouseEvent, KeyboardEvent, ReactElement } from "react";
import { Component } from "react";

import { Button } from "../../../../button/main/button.view.js";
import { Icon } from "../../../../icon/main/icon.view.js";
import { AttachedPortal } from "../../../../attached-portal/main/attached-portal.view.js";
import { bindMethods, addPrefix, joinClassNames } from "../../../../common/main/utils.js";
import { DataRoles } from "../../../../common/main/data-roles.js";
import {
	StyledRechartsLegend,
	StyledRechartsLegendItem,
	StyledRechartsLegendItemText,
	StyledRechartsLegendSVGSurface
} from "../../../main/chart.styled.js";

import type { LegendProps, ItemProps } from "./bar-chart.tpl.api.js";

const baseLegendClassName = addPrefix("chart__legend");

/** @deprecated since version 38.1.1. */
export const BarChartColors = {
	THRESHOLD_COLOR: "#8c99a6",
	THRESHOLD_ACTIVE_DOT_STROKE: "#e2e6e9",
	THRESHOLD_FILL: "#e2e6e9",
	THRESHOLD_HOVER_FILL: "#f1f2f4",

	GRID_STROKE: "#f1f2f4",

	TOOLTIP_CURSOR_FILL: "#f56600",

	BAR_HOVER_STROKE: "#fff",

	AXES_TICK_COLOR: "#8c99a6"
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
	private hideButtonRef: HTMLButtonElement | null = null;
	private hideButtonHeight = 0;

	constructor(props: LegendProps) {
		super(props);

		this.state = {
			open: false
		};

		bindMethods(this);
	}

	componentDidMount(): void {
		if (this.props.hideable && this.hideButtonRef) {
			this.hideButtonHeight = this.hideButtonRef.clientHeight;
		}
	}

	render(): ReactNode {
		const legendContent = this.renderLegendContent();

		return this.props.hideable ? (
			<>
				<Button
					primary
					icon={<Icon>{this.state.open ? "close" : "info"}</Icon>}
					onClick={this.handleHideButtonClick}
					buttonRef={this.getHideButtonRef}
				/>
				{this.state.open && this.hideButtonRef && (
					<AttachedPortal
						closeOnClickReferenceElement={false}
						referenceElement={this.hideButtonRef}
						closeOnOutsideClick
						onVisibilityChange={this.handleAttachedPortalVisibilityChange}
						orientationList={["bottom-end", "top-end"]}
						fixedOrientation
					>
						{legendContent}
					</AttachedPortal>
				)}
			</>
		) : (
			legendContent
		);
	}

	private renderLegendContent(): ReactNode {
		const {
			style,
			dataKey,
			labelKey,
			data,
			cellPropsList,
			layout,
			hideable,
			height,
			width,
			threshold,
			...lineInteractionProps
		} = this.props;

		const className = joinClassNames(
			baseLegendClassName,
			`${baseLegendClassName}--layout-${layout}`,
			hideable ? `${baseLegendClassName}--hideable` : undefined,
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
				data-role={DataRoles.BarChart.Legend}
			>
				{data &&
					data.map((_, index) => {
						const dataItem = data[index] as { [key: string]: any };

						return (
							<Item
								key={index}
								index={index}
								label={dataItem[labelKey]}
								value={dataItem[dataKey]}
								cellProps={cellPropsList && cellPropsList[index]}
								{...lineInteractionProps}
							/>
						);
					})}
				{data && threshold && (
					<Item
						key={data.length}
						index={data.length}
						value={threshold.dataKey as string}
						threshold
						{...lineInteractionProps}
					/>
				)}
			</StyledRechartsLegend>
		);
	}

	private getHideButtonRef(ref: HTMLButtonElement | null): void {
		this.hideButtonRef = ref;
	}

	private handleHideButtonClick(): void {
		this.setState(({ open }) => ({
			open: !open
		}));
	}

	private handleAttachedPortalVisibilityChange(isVisible: boolean): void {
		if (!isVisible) {
			this.setState({ open: false });
		}
	}
}

/**
 * @deprecated since version 38.1.1.
 * This component uses customized elements. Therefore, relying solely on Recharts may not provide the same result.
 * If you still wish to implement this functionality, please refer to the existing implementation to apply the necessary customizations in your project.
 */
export function Item(props: ItemProps): ReactElement<ItemProps> {
	const className = joinClassNames(`${baseLegendClassName}-item`, props.className);

	const { style, label, cellProps, hoveringLine, value, index, threshold, onMouseEnter, onMouseLeave, onLegendClick } =
		props;

	function handleMouseEnter(event: MouseEvent<HTMLElement>): void {
		if (onMouseEnter) {
			onMouseEnter(event, index);
		}
	}

	function handleClick(event: MouseEvent<HTMLElement>): void {
		if (onLegendClick) {
			onLegendClick(event, index);
		}
	}

	function handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (event.key !== "Enter") {
			return;
		}

		handleClick(event as any);
	}

	return (
		<StyledRechartsLegendItem
			className={className}
			style={{ opacity: hoveringLine !== null && hoveringLine !== index ? 0.5 : 1, ...style }}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{cellProps && (
				<StyledRechartsLegendSVGSurface
					className={`${baseLegendClassName}-surface ${addPrefix("barChart__legend-surface")}`}
				>
					<rect height="100%" width="100%" mask={cellProps.mask as string} fill={cellProps.fill as string} />
				</StyledRechartsLegendSVGSurface>
			)}
			{threshold && (
				<StyledRechartsLegendSVGSurface
					className={`${baseLegendClassName}-surface ${addPrefix("barChart__legend-surface")}`}
				>
					<line
						stroke={BarChartColors.THRESHOLD_COLOR}
						strokeDasharray="2 4"
						strokeWidth={2}
						y1={10}
						y2={10}
						x1={0}
						x2={30}
					/>
				</StyledRechartsLegendSVGSurface>
			)}

			{label && (
				<StyledRechartsLegendItemText className={`${baseLegendClassName}-text`}>{label}:</StyledRechartsLegendItemText>
			)}
			<span>{value}</span>
		</StyledRechartsLegendItem>
	);
}

Item.displayName = "Item";
