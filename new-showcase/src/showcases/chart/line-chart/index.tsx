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

import LineChartAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/chart/line-chart/main/line-chart.api.json" with { type: "json" };
import LineChartTplAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/chart/line-chart/main/tpl/line-chart.tpl.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import {
	StyledShowcaseExternalLinkInMessageBox,
	StyledShowcaseLinkInMessageBox
} from "../../../helpers/showcase-styles.js";

import { BasicLineChart } from "./basic.js";
import { LineChartWithComparableArea } from "./with-comparable-area.js";
import { LineChartWithDisparateDataPoints } from "./with-disparate-data-points.js";
import { LineChartWithInteraction } from "./with-interaction.js";
import { LineChartWithShowAndHideLines } from "./with-show-and-hide-lines.js";
import { LineChartWithThreshold } from "./with-threshold.js";
import { SimpleLineChart } from "./simple.js";

import basicCode from "!./basic.tsx?raw";
import withComparableCode from "!./with-comparable-area.tsx?raw";
import withDisparateCode from "!./with-disparate-data-points.tsx?raw";
import withInteractionCode from "!./with-interaction.tsx?raw";
import withShowAndHideCode from "!./with-show-and-hide-lines.tsx?raw";
import withThresholdCode from "!./with-threshold.tsx?raw";
import simpleCode from "!./simple.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Deprecated Line Chart",
		description: {
			info: (
				<>
					<p>
						The <strong>Line Chart</strong> Widget shows continuous data values represented by points connected by
						straight line segments of one or more quantities over a period of time.
					</p>
					<p>
						It’s often used to show trends and perform comparative analysis. The Y-Axis (labels on the left side) shows
						numeric values, while the X-Axis (labels at the bottom) shows a time-series or comparison category.
					</p>
					<p>
						It also has some general features as the <strong>Bar Chart</strong> such as hideable legend, percentage
						dimension. Visit the <Link href="#/widgets/data-display/charts/bar-chart">Bar Chart</Link> showcase to see
						more behaviors.
					</p>
				</>
			),
			note: (
				<>
					<p>
						Since version <strong>38.1.1</strong>, Chart Widgets are deprecated. We recommend using{" "}
						<StyledShowcaseExternalLinkInMessageBox href="https://recharts.org/">
							Recharts
						</StyledShowcaseExternalLinkInMessageBox>{" "}
						directly for any charting needs.
						<br />
						For the detailed migration guide, please refer to{" "}
						<StyledShowcaseLinkInMessageBox href="#/get-started/migration-instructions/chart-widgets-to-recharts">
							Chart Widgets to Recharts
						</StyledShowcaseLinkInMessageBox>
						.
					</p>
				</>
			)
		},
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							The <strong>LineChart</strong> receives an array of data values represented by points. To make chart adapt
							to the size of parent container, the line chart needs to be wrapped inside the{" "}
							<code>ResponsiveChartContainer</code> component.
						</p>
						<p>
							In addition, it's able to drawn the horizontal and vertical grid lines by using the{" "}
							<code>cartesianGridProps</code> property. You can also use the <code>tickCount</code> property to hold the
							number of tick marks on the x-axis.
						</p>
					</>
				),
				content: <BasicLineChart />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Simple Line Chart",
				description: (
					<p>
						The <strong>YAxis</strong> will not display in the chart if set the <code>hide</code> of the{" "}
						<code>yAxisProps</code> property to <code>true</code>.
					</p>
				),
				content: <SimpleLineChart />,
				code: { name: "simple.tsx", code: simpleCode }
			},
			{
				label: "Disparate Data Points",
				content: <LineChartWithDisparateDataPoints />,
				code: { name: "with-disparate-data-points.tsx", code: withDisparateCode }
			},
			{
				label: "Interactions",
				description: <p>Click on any legend entry or line will trigger an alert.</p>,
				content: <LineChartWithInteraction />,
				code: { name: "with-interaction.tsx", code: withInteractionCode }
			},
			{
				label: "Show and Hide Lines",
				description: (
					<p>
						By setting the <code>showAndHideLines</code> property to <code>true</code>, the interface for showing and
						hiding lines in legend will be displayed.
					</p>
				),
				content: <LineChartWithShowAndHideLines />,
				code: { name: "with-show-and-hide-lines.tsx", code: withShowAndHideCode }
			},
			{
				label: "Comparable Threshold",
				description: (
					<p>
						To display comparable threshold, use the <code>thresholdLineProps</code> property.
					</p>
				),
				content: <LineChartWithThreshold />,
				code: { name: "with-threshold.tsx", code: withThresholdCode }
			},
			{
				label: "Comparable Area",
				description: (
					<p>
						To display comparable area, use the <code>comparableAreaProps</code> property.
					</p>
				),
				content: <LineChartWithComparableArea />,
				code: { name: "with-comparable-area.tsx", code: withComparableCode }
			}
		]
	}
];

export default {
	label: "Deprecated Line Chart",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: LineChartAPI }, { declaration: LineChartTplAPI }],
		themingConfiguration: "charts"
	}
};
