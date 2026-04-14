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
import { ReferenceLine } from "recharts";

import { BarChart, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

const CHART_DATA = [
	{ month: "Jan", sale: 145 },
	{ month: "Feb", sale: -150 },
	{ month: "Mar", sale: 90 },
	{ month: "Apr", sale: 80 },
	{ month: "May", sale: -50 },
	{ month: "Jun", sale: 130 },
	{ month: "Jul", sale: 140 }
];
const BAR_PROPS_MAP = {
	sale: {
		dataKey: "sale",
		color: "#0088FE"
	}
};

export function BarChartWithNegativeValues(): ReactElement {
	return (
		<ResponsiveChartContainer aspect={0.5} maxHeight={300}>
			<BarChart
				data={CHART_DATA}
				labelKey="month"
				xAxisProps={{ dataKey: "month" }}
				xAxisLabel="Month"
				yAxisLabel="Sale"
				barPropsMap={BAR_PROPS_MAP}
				showLegend
			>
				<ReferenceLine y={0} stroke="#8c99a6" />
			</BarChart>
		</ResponsiveChartContainer>
	);
}
