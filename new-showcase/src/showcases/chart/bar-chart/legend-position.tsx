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
// start code removal
import { useState, useCallback } from "react";
// end code removal

import type { BarChartProps, BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	BarChart,
	ResponsiveChartContainer,
	Icon,
	Radio,
	LayoutGrid,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { CodeSnippetGenerationWrapper } from "../../../helpers/showcase-example.js";
import { ConfigurationView } from "../../../helpers/configuration-view.js";

const { Grid, Column, Row } = LayoutGrid;

type PositionCellType = ReactNode;
type PositionRowType = PositionCellType[];
const CHART_DATA = [
	{ month: "Jan", sale: 123 },
	{ month: "Feb", sale: 150 },
	{ month: "Mar", sale: 90 },
	{ month: "Apr", sale: 80 },
	{ month: "May", sale: 100 },
	{ month: "Jun", sale: 70 },
	{ month: "Jul", sale: 107 },
	{ month: "Aug", sale: 96 }
];

const BAR_PROPS_MAP = {
	sale: {
		dataKey: "sale",
		color: "#0088FE"
	}
};
// end code removal

export function LegendPosition(): ReactElement {
	// start code removal
	const [verticalAlign, setVerticalAlign] = useState<BarChartProps.VerticalAlign>("top");
	const [horizontalAlign, setHorizontalAlign] = useState<BarChartProps.Align>("right");

	const handleHorizontalAlign = useCallback((value: string): void => {
		setHorizontalAlign(value as BarChartProps.Align);
	}, []);

	const handleVerticalAlign = useCallback((value: string): void => {
		setVerticalAlign(value as BarChartProps.VerticalAlign);
	}, []);

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<Grid>
					<Row>
						<Column size={{ sm: 12, md: 8, lg: 9 }}>
							<PositionTableShowcase />
						</Column>
						<Column size={{ sm: 12, md: 4, lg: 3 }}>
							<Radio label="Legend horizontal align" onValueChanged={handleHorizontalAlign} value={horizontalAlign}>
								<Radio.Item label="right (default)" value="right" />
								<Radio.Item label="center" value="center" />
								<Radio.Item label="left" value="left" />
							</Radio>
							<br />
							<Radio label="Legend vertical align" onValueChanged={handleVerticalAlign} value={verticalAlign}>
								<Radio.Item label="above" value="above" />
								<Radio.Item label="top (default)" value="top" />
								<Radio.Item label="middle" value="middle" />
								<Radio.Item label="bottom" value="bottom" />
								<Radio.Item label="below" value="below" />
							</Radio>
						</Column>
					</Row>
				</Grid>
			}
		>
			<CodeSnippetGenerationWrapper>
				<ResponsiveChartContainer height={500}>
					<BarChart
						data={CHART_DATA}
						labelKey="month"
						xAxisProps={{ dataKey: "month" }}
						xAxisLabel="Month"
						yAxisLabel="Sale"
						barPropsMap={BAR_PROPS_MAP}
						legendProps={{
							align: horizontalAlign,
							verticalAlign,
							layout: verticalAlign === "below" || verticalAlign === "above" ? "horizontal" : "vertical",
							width: verticalAlign === "below" || verticalAlign === "above" ? 290 : undefined
						}}
					/>
				</ResponsiveChartContainer>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}

// start code removal
const SUGGESTED_ICON = <Icon variant="success">check_circle</Icon>;
const NOT_SUGGESTED_ICON = <Icon variant="error">cancel</Icon>;
const COLUMN_NAMES: BaseColumnType[] = [
	{ label: "", pinning: "left", width: 0.5 },
	{ label: "Left", width: 0.5 },
	{ label: "Center", width: 0.5 },
	{ label: "Right", width: 0.5 }
];
const VERTICAL_POSITION_SUPPORT = [
	["Above", NOT_SUGGESTED_ICON, NOT_SUGGESTED_ICON, NOT_SUGGESTED_ICON],
	["Top", SUGGESTED_ICON, NOT_SUGGESTED_ICON, SUGGESTED_ICON],
	["Middle", SUGGESTED_ICON, NOT_SUGGESTED_ICON, SUGGESTED_ICON],
	["Bottom", NOT_SUGGESTED_ICON, NOT_SUGGESTED_ICON, NOT_SUGGESTED_ICON],
	["Below", SUGGESTED_ICON, SUGGESTED_ICON, SUGGESTED_ICON]
];

export function PositionTableShowcase(): ReactElement {
	return (
		<div>
			<strong>Position support for a vertical legend</strong>
			<Table<PositionRowType> columns={COLUMN_NAMES} data={VERTICAL_POSITION_SUPPORT} style={{ maxWidth: 500 }} />
			<div className="-u-flex -u-justify-start">
				<p className="-u-flex">
					{SUGGESTED_ICON} <span className="-u-margin-l-xs -u-margin-r-sm">Suggested</span>
				</p>
				<p className="-u-flex">
					{NOT_SUGGESTED_ICON} <span className="-u-margin-l-xs">Not suggested</span>
				</p>
			</div>
		</div>
	);
}
// end code removal
