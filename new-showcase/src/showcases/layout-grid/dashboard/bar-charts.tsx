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
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

interface BarChartProps {
	height?: number | string;
}

export function BarChartsExample(props: BarChartProps): ReactElement<BarChartProps> {
	const barCharData = [
		{ name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
		{ name: "Page B", uv: -3000, pv: 1398, amt: 2210 },
		{ name: "Page C", uv: -2000, pv: -9800, amt: 2290 },
		{ name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
		{ name: "Page E", uv: -1890, pv: 4800, amt: 2181 },
		{ name: "Page F", uv: 2390, pv: -3800, amt: 2500 },
		{ name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
	];

	return (
		<ResponsiveContainer aspect={DeviceDetector.isPhone() ? 1 : undefined} height={props.height}>
			<BarChart data={barCharData} stackOffset="sign" className="chart-wrapper-plasma">
				<XAxis dataKey="name" />
				<YAxis />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Legend />
				<ReferenceLine y={0} stroke="#000" />
				<Bar dataKey="pv" fill="#8884d8" stackId="stack" />
				<Bar dataKey="uv" fill="#82ca9d" stackId="stack" />
			</BarChart>
		</ResponsiveContainer>
	);
}
