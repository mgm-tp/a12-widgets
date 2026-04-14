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

import DiagramAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/model-graph-diagram/main/model-graph-diagram.tpl.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { DiagramGridShowcase } from "./grid.js";
import { DiagramLabelShowcase } from "./label.js";
import { DiagramNodeShowcase } from "./node.js";
import { DiagramPortShowcase } from "./port.js";

import gridCode from "!./grid.tsx?raw";
import labelCode from "!./label.tsx?raw";
import nodeCode from "!./node.tsx?raw";
import portCode from "!./port.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Diagram Shapes",
		description: (
			<p>Widgets provides a set of components in different shapes that are designed to be used inside a diagram.</p>
		),
		sections: [
			{
				label: "Node",
				description: (
					<>
						<p>
							The <strong>DiagramNode</strong> Widget contains the following properties:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>useAsLink</code>: If this property is set to <code>true</code>, the node will be treated as if it
								were a link and will have a dashed border.
							</BulletList.Item>
							<BulletList.Item>
								<code>selected</code>: Whether the node is selected or not.
							</BulletList.Item>
							<BulletList.Item>
								<code>readonly</code>: Whether the node is readonly or not.
							</BulletList.Item>
							<BulletList.Item>
								<code>nodeAttributes</code>: You can use this property to provide additional props to the{" "}
								<strong>DiagramNode</strong> element.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <DiagramNodeShowcase />,
				code: { name: "node.tsx", code: nodeCode }
			},
			{
				label: "Label",
				description: (
					<>
						<p>
							The <strong>DiagramLabel</strong> Widget contains the following properties:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>type</code>:
								<BulletList.Unordered type="circle">
									<BulletList.Item>
										<em>main</em> (default): Contains main information.
									</BulletList.Item>
									<BulletList.Item>
										<em>sub</em>: Contains additional information. It has smaller font-size, height and lighter than the
										main label.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
							<BulletList.Item>
								<code>text</code>: Main/sub information.
							</BulletList.Item>
							<BulletList.Item>
								<code>subText</code>: Additional information that is placed next to the main/sub information.
							</BulletList.Item>
							<BulletList.Item>
								<code>selected</code>: Whether the label is selected or not.
							</BulletList.Item>
							<BulletList.Item>
								<code>readonly</code>: Whether the label is readonly or not.
							</BulletList.Item>
							<BulletList.Item>
								<code>labelAttributes</code>: You can use this property to provide additional props to the{" "}
								<strong>DiagramLabel</strong> element.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <DiagramLabelShowcase />,
				code: { name: "label.tsx", code: labelCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Port",
				description: (
					<>
						<p>
							The <strong>DiagramPort</strong> Widget is a draggable point that can be placed on a{" "}
							<strong>DiagramNode</strong> or the relationship line.
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>cornerPoint</code>: A kind of port to display on the corner of the relationship line. It's smaller
								than a default port.
							</BulletList.Item>
							<BulletList.Item>
								<code>selected</code>: Whether the port is selected or not.
							</BulletList.Item>
							<BulletList.Item>
								<code>readonly</code>: Whether the port is readonly or not.
							</BulletList.Item>
							<BulletList.Item>
								<code>portAttributes</code>: You can use this property to provide additional props to the{" "}
								<strong>DiagramPort</strong> element.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <DiagramPortShowcase />,
				code: { name: "port.tsx", code: portCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Grid",
				description: (
					<>
						<p>
							A grid is created by assembling multiple sub-grids together. We provide 2 types of points called{" "}
							<strong>GridMainPoint</strong> and <strong>GridSubPoint</strong> to create a sub-grid. While the{" "}
							<strong>GridMainPoint</strong> represents the start/end point of a sub grid, the{" "}
							<strong>GridSubPoint</strong> represents the smaller point displayed inside.
						</p>
						<p>
							The <strong>GridSubPoint</strong> contains the <code>isBeforeMainPoint</code> property to indicate whether
							the sub-point is the last point in a grid. This type of point must stand before the main point on a row in
							order to have an appropriate distance from the main point.
						</p>
					</>
				),
				content: <DiagramGridShowcase />,
				code: { name: "grid.tsx", code: gridCode }
			}
		]
	}
];

export default {
	label: "Diagram Shapes",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: DiagramAPI,
				filter: [
					"ModelDiagramNodeProps",
					"ModelDiagramLabelProps",
					"DiagramLabelType",
					"ModelDiagramPortProps",
					"ModelDiagramGridSubPointProps"
				]
			}
		],
		themingConfiguration: "diagramConfig"
	}
};
