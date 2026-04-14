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
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

const data = [
	{ name: "A", value: 400 },
	{ name: "B", value: 300 },
	{ name: "C", value: 300 },
	{ name: "D", value: 200 },
	{ name: "E", value: 278 },
	{ name: "F", value: 189 }
];

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#1E90FF", "#228B22"];

export interface PieChartProps {
	onClick?(data: any, index: number, event: MouseEvent): any;
	height?: number | string;
}

export function PieChartExample(props: PieChartProps): ReactElement<{}> {
	return (
		<ResponsiveContainer key="pie-1" height={props.height} aspect={DeviceDetector.isPhone() ? 1 : undefined}>
			<PieChart className="chart-wrapper-plasma">
				<Pie label dataKey="value" isAnimationActive data={data} fill="#8884d8" onClick={props.onClick} labelLine>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}
