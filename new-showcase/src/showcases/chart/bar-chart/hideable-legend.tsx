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
import { useCallback, useMemo } from "react";

import { BarChart, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

const CHART_DATA = [
	{ product: "Apple", sale: 120 },
	{ product: "Peach", sale: 150 },
	{ product: "Banana", sale: 90 },
	{ product: "Figs", sale: 80 },
	{ product: "Grapes", sale: 100 },
	{ product: "Coconut", sale: 120 },
	{ product: "Pineapple", sale: 150 },
	{ product: "Strawberry", sale: 90 }
];
const CELL_PROPS_LIST = [
	{ fill: "#ff0080" },
	{ fill: "#007fff" },
	{ fill: "#499037" },
	{ fill: "#93f" },
	{ fill: "#ff8000" },
	{ fill: "#1abc9c" },
	{ fill: "#34495e" },
	{ fill: "#f39c12" }
];

export function HideableLegendBarChartShowcase(): ReactElement {
	const handleBarClick = useCallback((entry: any) => {
		alert(`${entry.product} bar has been clicked!`);
	}, []);

	const handleLegendClick = useCallback((event: MouseEvent, index: number) => {
		alert(`${CHART_DATA[index].product} bar has been clicked!`);
	}, []);

	const barProperMap = useMemo(
		() => ({
			sale: {
				dataKey: "sale",
				onClick: handleBarClick
			}
		}),
		[handleBarClick]
	);

	return (
		<ResponsiveChartContainer aspect={0.5} maxHeight={300}>
			<BarChart
				data={CHART_DATA}
				labelKey="product"
				xAxisProps={{ dataKey: "product" }}
				xAxisLabel="product"
				yAxisLabel="Sale"
				barPropsMap={barProperMap}
				cellPropsList={CELL_PROPS_LIST}
				onLegendClick={handleLegendClick}
				legendProps={{
					hideable: true
				}}
			/>
		</ResponsiveChartContainer>
	);
}
