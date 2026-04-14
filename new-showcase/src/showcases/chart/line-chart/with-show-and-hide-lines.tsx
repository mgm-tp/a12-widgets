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

import type { ReactElement } from "react";

import { LineChart, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

export function LineChartWithShowAndHideLines(): ReactElement {
	const data = [
		{ name: "A", desktop: 170, laptop: 30, tablet: 5, mobile: 25 },
		{ name: "B", desktop: 150, laptop: 75, tablet: 10, mobile: 30 },
		{ name: "C", desktop: 140, laptop: 88, tablet: 20, mobile: 50 },
		{ name: "D", desktop: 125, laptop: 112, tablet: 24, mobile: 72 },
		{ name: "E", desktop: 100, laptop: 150, tablet: 30, mobile: 120 },
		{ name: "F", desktop: 70, laptop: 165, tablet: 45, mobile: 180 },
		{ name: "G", desktop: 50, laptop: 180, tablet: 63, mobile: 200 }
	];

	const linePropsMap = {
		desktop: {
			dataKey: "desktop",
			stroke: "#0088FE",
			strokeWidth: 2,
			isAnimationActive: false
		},
		laptop: {
			dataKey: "laptop",
			stroke: "#00C49F",
			strokeWidth: 2,
			isAnimationActive: false
		},
		tablet: {
			dataKey: "tablet",
			stroke: "#FFBB28",
			strokeWidth: 2,
			isAnimationActive: false
		},
		mobile: {
			dataKey: "mobile",
			stroke: "#FF8042",
			strokeWidth: 2,
			isAnimationActive: false
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
				showAndHideLines
				showLegend
			/>
		</ResponsiveChartContainer>
	);
}
