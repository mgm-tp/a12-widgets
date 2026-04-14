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

import PieChartAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/chart/pie-chart/main/pie-chart.api.json" with { type: "json" };
import PieChartTplAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/chart/pie-chart/main/tpl/pie-chart.tpl.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import {
	StyledShowcaseExternalLinkInMessageBox,
	StyledShowcaseLinkInMessageBox
} from "../../../helpers/showcase-styles.js";

import { BasicPieChart } from "./basic.js";
import { PieChartWithLabelShowCase } from "./with-label.js";
import { PieChartVisibilityEntriesOfLegendShowCase } from "./with-visibility-entries.js";
import { PieChartWithCounterclockwiseRotation } from "./with-counterclockwise-rotation.js";
import { PieChartWithCustomizedRotationShowCase } from "./with-customized-rotation.js";

import basicCode from "!./basic.tsx?raw";
import withLabelCode from "!./with-label.tsx?raw";
import visibilityEntriesOfLegendCode from "!./with-visibility-entries.tsx?raw";
import pieChartWithCounterclockwiseRotationCode from "!./with-counterclockwise-rotation.tsx?raw";
import pieChartWithCustomizedRotationCode from "!./with-customized-rotation.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Deprecated Pie Chart",
		description: {
			info: (
				<>
					<p>
						The <strong>Pie Chart</strong> Widget enables you to compare individual values or percentages in relation to
						a whole. It's ideal for displaying data such as regional sales figures, poll results, or any other value
						that can be broken down categorically and compared to the big picture.
					</p>
					<p>
						It also has some general features as the <strong>Bar Chart</strong> such as legend position, hideable
						legend, percentage dimension. Visit the{" "}
						<Link href="#/widgets/data-display/charts/bar-chart">Bar Chart</Link> showcase to see more behaviors.
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
					<p>
						To make the <strong>PieChart</strong> adapts to the size of parent container, please wrap it inside{" "}
						<code>ResponsiveChartContainer</code> component.
					</p>
				),
				content: <BasicPieChart />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Visibility of Legend Entries",
				content: <PieChartVisibilityEntriesOfLegendShowCase />,
				useConfiguration: true,
				toggleBetweenPartialAndFullCode: true,
				code: { name: "with-visibility-entries.tsx", code: visibilityEntriesOfLegendCode }
			},
			{
				label: "Labels",
				description: (
					<>
						<p>
							You can use the <code>label</code> property to display the chart's labels.
						</p>
						<p>The PieChart widget provides two label slots: primary and secondary.</p>
						<p>
							When hovering any cells or legend's entries, the corresponding segment label and value will be displayed
							in the center of the pie.
						</p>
					</>
				),
				content: <PieChartWithLabelShowCase />,
				code: { name: "with-label.tsx", code: withLabelCode },
				useConfiguration: true
			},
			{
				label: "Counterclockwise",
				description: (
					<p>
						You can use the <code>rotation</code> property to rotate the data with <strong>clockwise</strong> or{" "}
						<strong>counterclockwise</strong>. Default is <strong>clockwise</strong>.
					</p>
				),
				content: <PieChartWithCounterclockwiseRotation />,
				code: { name: "with-counterclockwise-rotation.tsx", code: pieChartWithCounterclockwiseRotationCode }
			},
			{
				label: "Customized Rotation",
				description: (
					<p>
						Adjust the <code>startAngle</code> property to customize rotation in degrees. Default is{" "}
						<strong>-270 </strong>
						to start from 12 o'clock.
					</p>
				),
				content: <PieChartWithCustomizedRotationShowCase />,
				code: { name: "with-customized-rotation.tsx", code: pieChartWithCustomizedRotationCode }
			}
		]
	}
];

export default {
	label: "Deprecated Pie Chart",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ name: "Pie Chart", declaration: PieChartAPI },
			{ name: "Pie Chart Templates", declaration: PieChartTplAPI }
		],
		themingConfiguration: "charts"
	}
};
