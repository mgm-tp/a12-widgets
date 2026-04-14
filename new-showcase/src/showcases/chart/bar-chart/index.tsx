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

import BarChartAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/chart/bar-chart/main/bar-chart.api.json" with { type: "json" };
import BarChartTplAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/chart/bar-chart/main/tpl/bar-chart.tpl.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import {
	StyledShowcaseExternalLinkInMessageBox,
	StyledShowcaseLinkInMessageBox
} from "../../../helpers/showcase-styles.js";

import { BasicBarChart } from "./basic.js";
import { BarChartWithNegativeValues } from "./with-negative-values.js";
import { BarChartWithThreshold } from "./threshold.js";
import { SimpleBarChart } from "./simple-bar-chart.js";
import { DifferentStylesForBars } from "./different-styles-for-bars.js";
import { LegendPosition } from "./legend-position.js";
import { WithPercentageDimension } from "./with-percentage-dimension.js";
import { HideableLegendBarChartShowcase } from "./hideable-legend.js";

import basicCode from "!./basic.tsx?raw";
import barChartWithNegativeValuesCode from "!./with-negative-values.tsx?raw";
import barChartWithThresholdCode from "!./threshold.tsx?raw";
import simpleBarChartCode from "!./simple-bar-chart.tsx?raw";
import differentStylesForBarsCode from "!./different-styles-for-bars.tsx?raw";
import legendPositionCode from "!./legend-position.tsx?raw";
import withPercentageDimensionCode from "!./with-percentage-dimension.tsx?raw";
import hideableLegendBarChartCode from "!./hideable-legend.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Deprecated Bar Chart",
		description: {
			info: (
				<p>
					The <strong>Bar Chart</strong> Widget offers the possibility to display multi-dimensional data in your model
					by using an X/Y-plane to display a bar for each data point. The height of a bar provides information about the
					value of the corresponding data point.
				</p>
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
							The <strong>BarChart</strong> receives an array of information of all the rectangles <code>data</code>. To
							make the chart adapts to the size of the parent container, the BarChart needs to be wrapped inside{" "}
							<code>ResponsiveChartContainer</code> component.
						</p>
						<p>
							In addition, it can be drawn the horizontal and vertical grid lines by using{" "}
							<code>cartesianGridProps</code> property.
						</p>
					</>
				),
				content: <BasicBarChart />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Simple Bar Chart",
				description: (
					<p>
						The <strong>YAxis</strong> will not display in the chart if set <code>hide</code> to <code>true</code> for
						the <code>yAxisProps</code> property.
					</p>
				),
				content: <SimpleBarChart />,
				code: { name: "simple-bar-chart.tsx", code: simpleBarChartCode }
			},
			{
				label: "Legend Position",
				description: (
					<>
						<p>
							You can choose the options to display the Legend of <strong>BarChart</strong> by passing the properties of
							the <code>legendProps</code>:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>align</strong>: Align the legend horizontally, default is <code>right</code>;
							</BulletList.Item>
							<BulletList.Item>
								<strong>verticalAlign</strong>: Align the legend vertically, default is <code>top</code>.
							</BulletList.Item>
							<BulletList.Item>
								<strong>layout</strong>: Legend's layout, default is <code>vertical</code>.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							When you hover or click any cells, the cell and the corresponding legend item will be highlighted, all
							other cells and legend items will be blurred. This also works when you hover or click any legend items.
						</p>
					</>
				),
				content: <LegendPosition />,
				useConfiguration: true,
				code: { name: "legend-position.tsx", code: legendPositionCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Different Styles for Bars",
				description: (
					<>
						<p>
							You can customize the color of the bars and respective legends corresponding by defining an array of{" "}
							<code>fill</code> for the <code>cellPropsList</code> property.
						</p>

						<p>
							You can also use the HTML SVG <code>pattern</code>, <code>rect</code>, and <code>mask</code> elements to
							customize stripes for the bar.
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								The <code>pattern</code> element defines a graphics object which can be redrawn at repeated x- and
								y-coordinate intervals ("tiled") to cover an area.
							</BulletList.Item>
							<BulletList.Item>
								The <code>rect</code> element is used to create a rectangle and variations of a rectangle shape.
							</BulletList.Item>
							<BulletList.Item>
								The <code>mask</code> element defines an alpha mask for compositing the current object into the
								background.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <DifferentStylesForBars />,
				code: { name: "different-styles-for-bars.tsx", code: differentStylesForBarsCode }
			},
			{
				label: "Hideable Legend",
				description: (
					<p>
						The legend will be hidden as a popup if you set the <code>hideable</code> of the <code>legendProps</code>{" "}
						property to true and you can click on the trigger button to toggle it open/close. <br /> Widgets also
						provide the customized click event handler for the bars and legend.
					</p>
				),
				content: <HideableLegendBarChartShowcase />,
				code: { name: "hideable-legend.tsx", code: hideableLegendBarChartCode }
			},
			{
				label: "Negative Values",
				content: <BarChartWithNegativeValues />,
				code: { name: "with-negative-values.tsx", code: barChartWithNegativeValuesCode }
			},
			{
				label: "Threshold",
				description: (
					<p>
						Thresholds can be used to filter values in a chart, which can be useful for analyzing data. In this example,
						values that do not meet a threshold have a red color.
					</p>
				),
				content: <BarChartWithThreshold />,
				code: { name: "threshold.tsx", code: barChartWithThresholdCode }
			},
			{
				label: "Percentage Dimension",
				description: (
					<p>
						In this showcase, the width of the chart container is 600px on desktop and 320px on mobile. Change the
						slider to see how the legend and chart change.
					</p>
				),
				content: <WithPercentageDimension />,
				useConfiguration: true,
				code: { name: "with-percentage-dimension.tsx", code: withPercentageDimensionCode },
				toggleBetweenPartialAndFullCode: true
			}
		]
	}
];

export default {
	label: "Deprecated Bar Chart",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: BarChartAPI }, { declaration: BarChartTplAPI }],
		themingConfiguration: "charts"
	}
};
