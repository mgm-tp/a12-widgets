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

import { fireEvent, getAllByDataRole, render } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { ResponsiveChartContainer } from "../../bar-chart/main/bar-chart.view.js";

import { PieChart } from "../main/pie-chart.view.js";

const data = [
	{ name: "Jan", value: 20, color: "#ffcd29" },
	{ name: "Feb", value: 14, color: "#196719" },
	{ name: "Mar", value: 23, color: "#056294" }
];

describe("com.mgmtp.a12.widgets.charts", () => {
	test("render responsive chart container with pie chart", () => {
		const { container } = render(
			<ResponsiveChartContainer aspect={1.5} height={400}>
				<PieChart data={data} />
			</ResponsiveChartContainer>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render basic pie chart", () => {
		const { container } = render(
			<PieChart width={600} height={400} innerRadius="50%" outerRadius="100%" data={data} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render pie chart with horizontal legend", () => {
		const { container } = render(
			<PieChart
				width={600}
				height={400}
				innerRadius="50%"
				outerRadius="100%"
				data={data}
				legendProps={{
					verticalAlign: "bottom",
					layout: "horizontal",
					width: 300
				}}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render pie chart with vertical legend", () => {
		const { container } = render(
			<PieChart
				width={600}
				height={400}
				innerRadius="50%"
				outerRadius="100%"
				data={data}
				legendProps={{
					verticalAlign: "bottom",
					layout: "vertical",
					width: 300
				}}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render pie chart with hideable legend", () => {
		const { container } = render(
			<PieChart
				width={600}
				height={400}
				innerRadius="50%"
				outerRadius="100%"
				data={data}
				legendProps={{ hideable: true }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render pie chart with unsorted legend", () => {
		const { container } = render(
			<PieChart
				width={600}
				height={400}
				innerRadius="50%"
				outerRadius="100%"
				data={data}
				legendProps={{ enableLegendSorting: false }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating chart legend event", () => {
		const onMouseEnter = vi.fn();
		const onMouseLeave = vi.fn();
		const onClick = vi.fn();
		const { container } = render(
			<PieChart
				width={600}
				height={400}
				innerRadius="50%"
				outerRadius="100%"
				data={data}
				legendProps={{
					onMouseEnter,
					onMouseLeave,
					onClick
				}}
			/>
		);
		const legendItems = getAllByDataRole(container, "list-item-content");
		const takenEventLegendIndex = 2;

		fireEvent.mouseEnter(legendItems[takenEventLegendIndex]);
		expect(onMouseEnter).toHaveBeenCalledTimes(1);
		legendItems.forEach((item, index) => {
			expect(window.getComputedStyle(item).opacity).toBe(index === takenEventLegendIndex ? "1" : "0.5");
		});

		fireEvent.mouseLeave(legendItems[takenEventLegendIndex]);
		expect(onMouseLeave).toHaveBeenCalledTimes(1);
		legendItems.forEach((item) => {
			expect(window.getComputedStyle(item).opacity).toBe("1");
		});

		fireEvent.click(legendItems[takenEventLegendIndex]);
		expect(onClick).toHaveBeenCalledTimes(1);
		legendItems.forEach((item, index) => {
			expect(window.getComputedStyle(item).opacity).toBe(index === takenEventLegendIndex ? "1" : "0.5");
		});
		fireEvent.mouseDown(container.getElementsByClassName("pie-chart")[0]);
		legendItems.forEach((item) => {
			expect(window.getComputedStyle(item).opacity).toBe("1");
		});
	});
});
