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
import type { CellProps } from "recharts";

import { BarChart, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

export function DifferentStylesForBars(): ReactElement {
	const data = [
		{ product: "Apple", sale: 120 },
		{ product: "Peach", sale: 150 },
		{ product: "Banana", sale: 90 },
		{ product: "Figs", sale: 80 },
		{ product: "Grapes", sale: 100 }
	];

	const cellPropsList: CellProps[] = [
		{ fill: "#ff0080", mask: `url(#rotate45-stripe)` },
		{ fill: "#007fff", mask: `url(#rotate_45-stripe)` },
		{ fill: "#499037", mask: `url(#horizontal-stripe)` },
		{ fill: "#93f", mask: `url(#vertical-stripe)` },
		{ fill: "#ff8000", mask: `url(#diagonal-stripe)` }
	];

	const barPropsMap = {
		sale: {
			dataKey: "sale"
		}
	};

	return (
		<ResponsiveChartContainer aspect={0.5} maxHeight={300}>
			<BarChart
				data={data}
				labelKey="product"
				xAxisProps={{ dataKey: "product" }}
				xAxisLabel="Product"
				yAxisLabel="Sale"
				barPropsMap={barPropsMap}
				cellPropsList={cellPropsList}
				showLegend
			>
				<pattern id="rotate45-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
					<rect width="4" height="8" transform="translate(0,0)" fill="white" />
				</pattern>
				<mask id="rotate45-stripe">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#rotate45-pattern)" />
				</mask>

				<pattern
					id="rotate_45-pattern"
					width="8"
					height="8"
					patternUnits="userSpaceOnUse"
					patternTransform="rotate(-45)"
				>
					<rect width="4" height="8" transform="translate(0,0)" fill="white" />
				</pattern>
				<mask id="rotate_45-stripe">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#rotate_45-pattern)" />
				</mask>

				<pattern
					id="horizontal-pattern"
					width="8"
					height="8"
					patternUnits="userSpaceOnUse"
					patternTransform="rotate(90)"
				>
					<rect width="4" height="8" transform="translate(0,0)" fill="white" />
				</pattern>
				<mask id="horizontal-stripe">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#horizontal-pattern)" />
				</mask>

				<pattern id="vertical-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
					<rect width="4" height="8" transform="translate(0,0)" fill="white" />
				</pattern>
				<mask id="vertical-stripe">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#vertical-pattern)" />
				</mask>

				<mask id="diagonal-stripe">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#horizontal-pattern)" />
					<rect x="0" y="0" width="100%" height="100%" fill="url(#vertical-pattern)" />
				</mask>
			</BarChart>
		</ResponsiveChartContainer>
	);
}
