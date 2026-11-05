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

import { getByDataRole, getByRole, queryByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { BarChart, ResponsiveChartContainer } from "../main/bar-chart.view.js";

const data = [
	{ month: "Jan", sale: 90, threshold: 100 },
	{ month: "Feb", sale: 145, threshold: 100 },
	{ month: "Mar", sale: 20, threshold: 100 }
];

const cellPropsList = [{ fill: "#ff0080" }, { fill: "#056294" }, { fill: "#499037" }];

const barPropsMap = {
	rating: {
		dataKey: "rating",
		color: "#0088FE"
	}
};

/**
 * The legend renders one child element per bar, each labelled `<name>:`. Reading those labels keeps these
 * assertions clear of the chart's SVG geometry, which recharts derives from measured legend text and which
 * therefore differs by a pixel between platforms.
 */
const legendLabelsIn = (legend: HTMLElement): string[] =>
	[...legend.children].map((item) => item.textContent?.replace(/:$/, "") ?? "");

describe("com.mgmtp.a12.widgets.charts", () => {
	test("render responsive chart container with bar chart", () => {
		const { container } = render(
			<ResponsiveChartContainer aspect={2} width={600}>
				<BarChart labelKey="month" barPropsMap={barPropsMap} />
			</ResponsiveChartContainer>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render basic bar chart", () => {
		const { container } = render(
			<BarChart
				width={600}
				height={300}
				data={data}
				labelKey="month"
				barPropsMap={barPropsMap}
				xAxisProps={{ dataKey: "month", tick: false }}
				yAxisProps={{ hide: true }}
				showLegend={false}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render bar chart with different categories", () => {
		const { container } = render(
			<BarChart
				width={600}
				height={300}
				data={data}
				labelKey="month"
				xAxisProps={{ dataKey: "month", tick: false }}
				yAxisProps={{ hide: true }}
				barPropsMap={barPropsMap}
				cellPropsList={cellPropsList}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render bar chart with threshold", () => {
		const { container } = render(
			<BarChart
				width={600}
				height={300}
				data={data}
				labelKey="month"
				barPropsMap={barPropsMap}
				xAxisProps={{ dataKey: "month", tick: false }}
				yAxisProps={{ hide: true }}
				showLegend={false}
				thresholdProps={{ dataKey: "threshold", hide: true }}
				aboveThresholdStyle={{ fill: "#2a9027" }}
				belowThresholdStyle={{ fill: "#c92b3a" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render bar chart with horizontal legend", () => {
		const { container } = render(
			<BarChart
				width={600}
				height={300}
				data={data}
				labelKey="month"
				xAxisProps={{ dataKey: "month" }}
				xAxisLabel="Month"
				yAxisLabel="Sale"
				barPropsMap={barPropsMap}
				showLegend
				legendProps={{ layout: "horizontal" }}
			/>
		);

		const legend = getByDataRole(container, DataRoles.BarChart.Legend);
		expect(legend.className).toContain("chart__legend--layout-horizontal");
		expect(legendLabelsIn(legend)).toEqual(data.map((entry) => entry.month));
	});

	test("render bar chart with vertical legend", () => {
		const { container } = render(
			<BarChart
				width={600}
				height={300}
				data={data}
				labelKey="month"
				xAxisProps={{ dataKey: "month" }}
				xAxisLabel="Month"
				yAxisLabel="Sale"
				barPropsMap={barPropsMap}
				showLegend
				legendProps={{ layout: "vertical" }}
			/>
		);

		const legend = getByDataRole(container, DataRoles.BarChart.Legend);
		expect(legend.className).toContain("chart__legend--layout-vertical");
		expect(legendLabelsIn(legend)).toEqual(data.map((entry) => entry.month));
	});

	test("render bar chart with hideable legend", async () => {
		const { container } = render(
			<BarChart
				width={600}
				height={300}
				data={data}
				labelKey="month"
				xAxisProps={{ dataKey: "month" }}
				xAxisLabel="Month"
				yAxisLabel="Sale"
				barPropsMap={barPropsMap}
				showLegend
				legendProps={{ hideable: true }}
			/>
		);

		// A hideable legend starts collapsed behind a toggle and only then opens in a portal.
		expect(queryByDataRole(container, DataRoles.BarChart.Legend)).toBeNull();

		await userEvent.click(getByRole(container, "button"));

		const legend = getByDataRole(document.body, DataRoles.BarChart.Legend);
		expect(legend.className).toContain("chart__legend--hideable");
		expect(legendLabelsIn(legend)).toEqual(data.map((entry) => entry.month));
	});
});
