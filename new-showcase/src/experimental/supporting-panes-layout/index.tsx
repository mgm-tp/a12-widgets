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

import SupportingPanesLayoutAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/supporting-panes-layout/main/supporting-panes-layout.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { Basic } from "./basic.js";
import { NestedLayout } from "./nested-layout.js";

import basicCode from "!./basic.tsx?raw";
import nestedLayoutCode from "!./nested-layout.tsx?raw";
import secondaryPaneCode from "!./secondary-pane.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Supporting Panes Layout",
		description: (
			<div>
				<p>
					The <strong>Supporting Panes Layout (SPL)</strong> widgets divides content horizontally into <em>primary</em>{" "}
					and <em>secondary</em> panes:
				</p>
				<BulletList.Unordered>
					<BulletList.Item>
						The <strong>primary pane</strong>, which takes up most of the body area, contains the main content.
					</BulletList.Item>
					<BulletList.Item>
						The <strong>secondary (supporting) pane</strong> provides additional supporting content to enhance context
						and understanding. This may include additional information, related data, contextual actions, and children
						in a parent-child relationship.
					</BulletList.Item>
				</BulletList.Unordered>
				<p>
					The <strong>SPL</strong> can be nested within itself or combined with other widgets, allowing for complex,
					multi-level designs.
				</p>
			</div>
		),
		sections: [
			{
				label: "Basic",
				content: <Basic />,
				description: (
					<div>
						<p>
							We provide a set of components <code>SupportingPanesLayoutComponents</code> to build a Supporting Panes
							Layout.
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>SupportingPanesLayout</code> is a base container that wraps the primary and secondary panes.
							</BulletList.Item>
							<BulletList.Item>
								<code>PrimaryPane</code> element to contain the main content that should always be presented. Its width
								is flexible based on the available space.
							</BulletList.Item>
							<BulletList.Item>
								<code>SecondaryPane</code> element to define supporting content. The pane is resizable, and can be
								collapsed or expanded. There are certain properties that are helpful to control its behaviors:
								<BulletList.Unordered type="circle">
									<BulletList.Item>
										<code>position</code>: Whether it will be displayed to the left or right side of the main content.
									</BulletList.Item>
									<BulletList.Item>
										<code>widthConfig</code>: The pane's width can be altered when it is expanded or collapsed. By
										default, the pane will take up 25% of the entire layout.
									</BulletList.Item>
									<BulletList.Item>
										<code>collapsed</code>: The collapse/expand state can be controlled externally with this. For
										example, by clicking a button.
									</BulletList.Item>
									<BulletList.Item>
										<code>resizeOptions</code>: To enable the resize behavior, you have to define <code>minWidth</code>{" "}
										and <code>maxWidth</code> via this configuration.
									</BulletList.Item>
									<BulletList.Item>
										<code>hide</code>: Whether the pane should be hidden or not.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							If both <code>minWidth</code> and <code>widthConfig.collapsed</code> are specified for the{" "}
							<strong>resize</strong> behavior, the supporting pane will shrink until it reaches the minimum width, then
							jump back to the collapsed state.
						</p>
						<p>
							Hovering over the gap between the supporting pane and primary pane will show the resize handle that you
							can drag, then the width of the pane will be gradually adjusted.
						</p>
						<p>
							We also provide a feature that allows users to double-click the resize handler on the supporting pane to
							collapse, expand, or reset it to its default expanded width.
						</p>
					</div>
				),
				code: [
					{ name: "basic.tsx", code: basicCode },
					{ name: "secondary-pane.tsx", code: secondaryPaneCode }
				],
				useDarkBackground: true
			},
			{
				label: "Nested Layout",
				content: <NestedLayout />,
				description: (
					<div>
						<p>
							Another layout can be specified within the <code>PrimaryPane</code> to create multi-level design.
						</p>
					</div>
				),
				code: [
					{ name: "nested-layout.tsx", code: nestedLayoutCode },
					{ name: "secondary-pane.tsx", code: secondaryPaneCode }
				],
				useDarkBackground: true
			}
		]
	}
];

export default {
	label: "Supporting Panes Layout",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: SupportingPanesLayoutAPI }],
		themingConfiguration: "supportingPanesLayout"
	}
};
