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

import { render } from "test-utils";
import { describe, expect, test } from "vitest";

import { ResponsiveChartContainer } from "../../bar-chart/main/bar-chart.view.js";

import { LineChart } from "../main/line-chart.view.js";

const data = [
	{ name: "Jan", desktop: 170, laptop: 30, mobile: 25, goals: [50, 70], threshold: 170 },
	{ name: "Feb", desktop: 150, laptop: 75, mobile: 30, goals: [70, 85], threshold: 100 },
	{ name: "Mar", desktop: 140, laptop: 105, mobile: 50, goals: [60, 90], threshold: 90 }
];

const linePropsMap = {
	desktop: {
		dataKey: "desktop",
		stroke: "#0088FE",
		strokeWidth: 2
	},
	laptop: {
		dataKey: "laptop",
		stroke: "#00C49F",
		strokeWidth: 2
	},
	mobile: {
		dataKey: "mobile",
		stroke: "#FF8042",
		strokeWidth: 2
	}
};

describe("com.mgmtp.a12.widgets.charts", () => {
	test("render responsive chart container with line chart", () => {
		const { container } = render(
			<ResponsiveChartContainer aspect={2} height={300}>
				<LineChart linePropsMap={linePropsMap} />
			</ResponsiveChartContainer>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render basic line chart", () => {
		const { container } = render(
			<LineChart
				width={600}
				height={300}
				data={data}
				xAxisProps={{ dataKey: "name" }}
				xAxisLabel="Name"
				yAxisLabel="Value"
				linePropsMap={linePropsMap}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render line chart with comparable area", () => {
		const { container } = render(
			<LineChart
				width={600}
				height={300}
				data={data}
				xAxisProps={{ dataKey: "name" }}
				xAxisLabel="Name"
				yAxisLabel="Value"
				linePropsMap={linePropsMap}
				showLegend
				comparableAreaProps={{ dataKey: "goals" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render line chart with threshold", () => {
		const { container } = render(
			<LineChart
				width={600}
				height={300}
				data={data}
				xAxisProps={{ dataKey: "name" }}
				xAxisLabel="Name"
				yAxisLabel="Value"
				linePropsMap={linePropsMap}
				showLegend
				thresholdLineProps={{ dataKey: "threshold" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render line chart horizontal legend", () => {
		const { container } = render(
			<LineChart
				width={600}
				height={300}
				data={data}
				xAxisDataKey="name"
				xAxisLabel="Name"
				yAxisLabel="Value"
				linePropsMap={linePropsMap}
				showLegend
				legendProps={{ layout: "horizontal" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render line chart vertical legend", () => {
		const { container } = render(
			<LineChart
				width={600}
				height={300}
				data={data}
				xAxisDataKey="name"
				xAxisLabel="Name"
				yAxisLabel="Value"
				linePropsMap={linePropsMap}
				showLegend
				legendProps={{ layout: "vertical" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render line chart with hideable legend", () => {
		const { container } = render(
			<LineChart
				width={600}
				height={300}
				data={data}
				xAxisProps={{ dataKey: "name" }}
				xAxisLabel="Name"
				yAxisLabel="Value"
				linePropsMap={linePropsMap}
				showLegend
				legendProps={{ hideable: true }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});
