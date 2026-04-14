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

import type { JSONOutput } from "typedoc";

import { BulletList, provider } from "@com.mgmtp.a12.widgets/widgets-core";
import LayoutGridAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/layout-grid/main/layout-grid.api.json" with { type: "json" };
import SizeDetectorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/size-detector/main/size-detector.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox } from "../../../helpers/showcase-styles.js";

import { Breakpoints } from "./breakpoints.js";
import { OptionalBreakpointsShowcase } from "./optional-breakpoints.js";
import { Alignment } from "./alignment.js";
import { SpanAndOffset } from "./span-offset.js";

import breakpointsCode from "!./breakpoints.tsx?raw";
import optionalBreakpointsCode from "!./optional-breakpoints.tsx?raw";
import alignmentCode from "!./alignment.tsx?raw";
import spanAndOffsetCode from "!./span-offset.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Layout Grid",
		sections: {
			basic: {
				description: (
					<div>
						<p>
							The <strong>Layout Grid</strong> Widget is a grid-based layout system with <code>Row</code> and{" "}
							<code>Column</code> placed inside the <code>Grid</code>. It's fully responsive and can be used to create a
							two-dimensional layout where you can flexibly align content in any way you see fit.
						</p>
						<div>
							There are 4 grid breakpoints:
							<BulletList.Unordered>
								<BulletList.Item>
									<code>lg</code> (large) when the container's width is 992px or larger.
								</BulletList.Item>
								<BulletList.Item>
									<code>md</code> (medium) when the container's width is from 768px to 991px.
								</BulletList.Item>
								<BulletList.Item>
									<code>sm</code> (small) when the container's width is from 576px to 767px.
								</BulletList.Item>
								<BulletList.Item>
									<code>xs</code> (extra small) when the container's width is less than 576px.
								</BulletList.Item>
							</BulletList.Unordered>
						</div>
						<p>
							There are twelve columns per row in the <code>lg</code>, <code>md</code> and <code>sm</code> sizes. At the{" "}
							<code>xs</code> breakpoint, there is always one column.
						</p>
					</div>
				),
				sections: [
					{
						label: "Breakpoints",
						description: (
							<p>
								This example uses custom breakpoints. The slider below will trigger the size changed based on that given
								breakpoints.
							</p>
						),
						content: <Breakpoints />,
						useConfiguration: true,
						code: { name: "breakpoints.tsx", code: breakpointsCode }
					},
					{
						label: "Optional Breakpoints",
						description: {
							info: (
								<>
									<p>
										If no config is given for a certain size, the next largest size's information will be used. For
										instance, if no config is given for <code>md</code>, the calculation result of <code>lg</code> will
										be used.
									</p>
								</>
							),
							note: (
								<StyledShowcaseBulletListInMessageBox>
									<BulletList.Item>
										The breakpoint of a <code>Column</code> can also be optional.
									</BulletList.Item>
									<BulletList.Item>
										Which breakpoint is defined in the <code>size</code> of the <code>Column</code> should also be
										defined in the <code>breakpoints</code> of the <code>Grid</code>.
									</BulletList.Item>
								</StyledShowcaseBulletListInMessageBox>
							)
						},
						content: <OptionalBreakpointsShowcase />,
						useConfiguration: true,
						code: { name: "optional-breakpoints.tsx", code: optionalBreakpointsCode },
						toggleBetweenPartialAndFullCode: true
					},
					{
						label: "Alignment",
						content: <Alignment />,
						description: (
							<div>
								<p>
									The <code>verticalAlignment</code> property makes the content to be aligned vertically.
								</p>
								<p>It can be applied at:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>LayoutGrid</code>: applies to all rows.
									</BulletList.Item>
									<BulletList.Item>
										<code>Row</code>: applies to a specific row.
									</BulletList.Item>
									<BulletList.Item>
										<code>Column</code>: applies to a specific column.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>And it has the following values:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>undefined</code> (default value): The Column will stretch as the Row's size.
									</BulletList.Item>
									<BulletList.Item>
										<code>top</code>: The Column will align at the top of the Row. The Column's height depends on its
										content.
									</BulletList.Item>
									<BulletList.Item>
										<code>middle</code>: The Column will align in the middle of the Row. The Column's height depends on
										its content.
									</BulletList.Item>
									<BulletList.Item>
										<code>bottom</code>: The Column will align at the bottom of the Row. The Column's height depends on
										its content.
									</BulletList.Item>
								</BulletList.Unordered>
							</div>
						),
						useConfiguration: true,
						code: { name: "alignment.tsx", code: alignmentCode },
						toggleBetweenPartialAndFullCode: true
					}
				]
			},
			advanced: {
				sections: [
					{
						label: "Span and Offset",
						content: <SpanAndOffset />,
						description: (
							<div>
								<p>
									Use <code>layoutConfig</code> configuration to determine the column and offset spacer sizes within a{" "}
									<code>LayoutGrid.Row</code> when specific layouts, offsets and spans are given for different
									horizontal space situations. If no span or offset is given, the default will be <code>span=1</code>{" "}
									and <code>offset=0</code>.
								</p>
								<p>Let's play around with the configuration below:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										Responsive configuration: Allows to customize column sizes within the whole layout. The layout will
										update automatically when the config has changed. Initialization:
										<BulletList.Unordered type="circle">
											<BulletList.Item>lg: [3, 3, 6]</BulletList.Item>
											<BulletList.Item>
												md: For Responsive, it's based on <code>lg</code> initially. For Offsets and Spans, default is{" "}
												<code>span=1</code> and <code>offset=0</code>. Toggle the option "Config <code>md</code>{" "}
												breakpoint" to control it.
											</BulletList.Item>
											<BulletList.Item>sm: [6, 6, 12]</BulletList.Item>
										</BulletList.Unordered>
									</BulletList.Item>
									<BulletList.Item>
										Spans and Offsets configuration: Each breakpoint has 3 input fields for respective columns. Click{" "}
										<strong>APPLY SPANS AND OFFSETS</strong> button to apply the custom configuration for a row.
									</BulletList.Item>
								</BulletList.Unordered>
								{provider.isPhone() ? (
									<p>
										Use Desktop to interact with showcase to see how the layout change when changing the configuration.
									</p>
								) : (
									<p>Use the slider to resize the width in the DOM that affects the layout.</p>
								)}
							</div>
						),
						useConfiguration: true,
						code: { name: "span-offset.tsx", code: spanAndOffsetCode },
						toggleBetweenPartialAndFullCode: true
					}
				]
			}
		}
	}
];

export default {
	label: "Layout Grid",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ name: "Layout Grid", declaration: LayoutGridAPI as JSONOutput.DeclarationReflection },
			{ name: "Size Detector", declaration: SizeDetectorAPI as JSONOutput.DeclarationReflection }
		],
		themingConfiguration: "layoutGrid"
	}
};
