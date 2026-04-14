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

import type { MouseEvent, ReactElement } from "react";

import { LineChart, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

export function LineChartWithInteraction(): ReactElement {
	const data = [
		{ name: "A", laptop: 60, mobile: 80 },
		{ name: "B", laptop: 88, mobile: 100 },
		{ name: "C", laptop: 78, mobile: 130 },
		{ name: "D", laptop: 88, mobile: 120 },
		{ name: "E", laptop: 120, mobile: 35 },
		{ name: "F", laptop: 120, mobile: 40 },
		{ name: "G", laptop: 100, mobile: 55 }
	];

	function handleLineClick(): void {
		alert("A line has been clicked!");
	}

	function handleLegendClick(event: MouseEvent, dataKey: string): void {
		alert(`${dataKey} entry has been clicked!`);
	}

	function handleDotClick(): void {
		alert("A dot has been clicked!");
	}

	const linePropsMap = {
		laptop: {
			dataKey: "laptop",
			stroke: "#00C49F",
			strokeWidth: 5,
			r: 5,
			onClick: handleLineClick
		},
		mobile: {
			dataKey: "mobile",
			stroke: "#FF8042",
			strokeWidth: 5,
			r: 5,
			onClick: handleLineClick
		}
	};

	return (
		<ResponsiveChartContainer aspect={0.5} maxHeight={300}>
			<LineChart
				data={data}
				xAxisProps={{ dataKey: "name" }}
				xAxisLabel="Name"
				yAxisLabel="Value"
				linePropsMap={linePropsMap}
				onLegendClick={handleLegendClick}
				onDotClick={handleDotClick}
				showLegend
			/>
		</ResponsiveChartContainer>
	);
}
