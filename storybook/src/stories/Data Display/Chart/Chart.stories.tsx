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

import type { Meta, StoryObj } from "@storybook/react-vite";

import { BarChart, LineChart, PieChart } from "@com.mgmtp.a12.widgets/widgets-core";
import type { BarChartProps } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<BarChartProps> = {
	title: "Data Display/Chart",
	component: BarChart,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"⚠️ **Deprecated since v38.1.1.** BarChart, LineChart, and PieChart are deprecated. Use Recharts directly. See the migration guide in new-showcase under Get Started → Migration Instructions → Chart Widgets to Recharts."
			}
		}
	},
	tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

const salesData = [
	{ month: "Jan", revenue: 4000, costs: 2400 },
	{ month: "Feb", revenue: 3000, costs: 1398 },
	{ month: "Mar", revenue: 5000, costs: 2800 },
	{ month: "Apr", revenue: 4780, costs: 3200 },
	{ month: "May", revenue: 5890, costs: 2900 },
	{ month: "Jun", revenue: 4390, costs: 2500 }
];

export const DeprecatedBarChart: Story = {
	render: () => (
		<div style={{ width: "600px", height: "300px" }}>
			<BarChart
				data={salesData}
				labelKey="month"
				showLegend
				showTooltip
				barPropsMap={{
					revenue: { dataKey: "revenue", fill: "#4a90d9", name: "Revenue" },
					costs: { dataKey: "costs", fill: "#e57373", name: "Costs" }
				}}
				xAxisDataKey="month"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "⚠️ Deprecated. Basic bar chart with two data series. Migrate to Recharts BarChart."
			}
		}
	}
};

const trendData = [
	{ month: "Jan", value: 2400 },
	{ month: "Feb", value: 1398 },
	{ month: "Mar", value: 5800 },
	{ month: "Apr", value: 3908 },
	{ month: "May", value: 4800 },
	{ month: "Jun", value: 3800 }
];

export const DeprecatedLineChart: Story = {
	render: () => (
		<div style={{ width: "600px", height: "300px" }}>
			<LineChart
				data={trendData}
				showLegend
				showAndHideLines={false}
				linePropsMap={{
					value: { stroke: "#4a90d9", name: "Trend", type: "monotone" }
				}}
				xAxisDataKey="month"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "⚠️ Deprecated. Basic line chart. Migrate to Recharts LineChart."
			}
		}
	}
};

const categoryData = [
	{ name: "Category A", value: 400 },
	{ name: "Category B", value: 300 },
	{ name: "Category C", value: 200 },
	{ name: "Category D", value: 100 }
];

export const DeprecatedPieChart: Story = {
	render: () => (
		<div style={{ width: "400px", height: "300px" }}>
			<PieChart
				data={categoryData}
				legendProps={{ verticalAlign: "bottom" }}
				toolTipProps={{}}
				pieProps={{ dataKey: "value", nameKey: "name" }}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "⚠️ Deprecated. Basic pie chart. Migrate to Recharts PieChart."
			}
		}
	}
};
