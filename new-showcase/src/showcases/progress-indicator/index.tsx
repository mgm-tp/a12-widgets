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

import ProgressIndicatorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/progress-indicator/main/progress-indicator.api.json" with { type: "json" };
import { Link, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { ProgressIndicatorFastAppearShowcase } from "./fast-appear.js";
import { AccessibilityProgressIndicator } from "./accessibility.js";
import { GlobalProgressIndicatorShowcase } from "./global.js";
import { CustomLabel } from "./custom-label.js";
import { Basic } from "./basic.js";
import { OverlayVariant } from "./overlay-variants.js";

import fastAppearCode from "!./fast-appear.tsx?raw";
import accessibilityCode from "!./accessibility.tsx?raw";
import globalCode from "!./global.tsx?raw";
import customLabelCode from "!./custom-label.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import overlayVariantCode from "!./overlay-variants.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Progress Indicator",
		description: (
			<p>
				The <strong>Progress Indicator</strong> Widget can be used to inform users about the status of background
				processes such as saving updates or fetching data from an external source by providing an animated overlay on
				its parent element.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<>
							<p>
								The parent element's height must be defined. For example: <code>100%</code> or <code>100px</code>.
							</p>
							<p>
								By default, when the <code>innerOverlay</code> size reaches 90% of the parent's height and the{" "}
								<code>size</code> property is <code>default</code>, its size will be changed to <code>medium</code> or{" "}
								<code>small</code>. You can change the threshold by setting <code>dynamicHeightThreshold</code> property
								to a different number to set it to <code>false</code> to disable.
							</p>
						</>
					)
				},
				useConfiguration: true,
				content: <Basic />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Customization",
				description: {
					info: (
						<div>
							You can customize a Progress Indicator by using below configurations:
							<BulletList.Unordered>
								<BulletList.Item>
									<code>label</code>: add a custom label.
								</BulletList.Item>
								<BulletList.Item>
									<code>type</code>: display the label and circle in vertical or horizontal alignment
								</BulletList.Item>
								<BulletList.Item>
									<code>useLoadingDots</code>: specify whether display the loading dots after the label.
								</BulletList.Item>
								<BulletList.Item>
									<code>color</code>: customize the color of the loading indicator.
								</BulletList.Item>
								<BulletList.Item>
									<code>size</code>: customize the size of the loading indicator (big, medium, small), the default value
									is big.
								</BulletList.Item>
								<BulletList.Item>
									<code>singleOverlay</code>: display the single overlay.
								</BulletList.Item>
							</BulletList.Unordered>
						</div>
					)
				},
				useConfiguration: true,
				content: <CustomLabel />,
				code: { name: "custom-label.tsx", code: customLabelCode }
			},
			{
				label: "Visibility and Overlay Variants",
				description: (
					<p>
						You can decide to change visibility and overlay variant of Progress Indicator's parts by defining{" "}
						<code>outerOverlayVariant</code>, <code>innerOverlayVariant</code>, and <code>hideLoadingCircle</code>{" "}
						properties.
					</p>
				),
				useConfiguration: true,
				content: <OverlayVariant />,
				code: { name: "overlay-variants.tsx", code: overlayVariantCode }
			},
			{
				label: "Fast Appear",
				content: <ProgressIndicatorFastAppearShowcase />,
				description: (
					<>
						<p>
							You can set the <code>fastAppear</code> property to true to make the Progress Indicator appears faster
							than normal.
						</p>
						<p>
							The inner-overlay, the circle and the label will be appear immediately when the Progress Indicator is
							shown.
						</p>
						<p>
							By default, there is no delaying. You can delay the appearance of Progress Indicator by setting the delay
							time to the <code>openingDelay</code> property.
						</p>
					</>
				),
				useConfiguration: true,
				code: { name: "fast-appear.tsx", code: fastAppearCode }
			},
			{
				label: "Global",
				description: (
					<>
						<p>
							Set <code>global</code> to true to make the Progress Indicator cover the entire window.
						</p>
						<p>
							If you're on desktop, press <code>Esc</code> to close the <strong>Progress Indicator</strong> after
							opening it. Otherwise, if you're on a mobile device it will close automatically after 3 seconds.
						</p>
					</>
				),
				code: { name: "global.tsx", code: globalCode },
				content: <GlobalProgressIndicatorShowcase />
			},
			{
				label: "Accessibility",
				description: {
					info: (
						<div>
							<BulletList.Unordered>
								<BulletList.Item>
									The progress indicator will be focused and automatically scrolled into the visible view if the{" "}
									<code>focusOnOpen</code> or <code>global</code> property is set to <code>true</code>.<br />
									On the contrary, enabling the <code>scrollIntoView</code> property will make the indicator scrolling
									without the need for focus. It's handy if you don't want to be interrupted when the progress indicator
									appears.
								</BulletList.Item>
								<BulletList.Item>
									The <code>label</code> should always be set. If there is no label, the{" "}
									<strong>Progress Indicator</strong> will have a hidden text to fully support accessibility. For more
									detail, please go to <Link href="#/basics/accessibility">Accessibility</Link>.
								</BulletList.Item>
							</BulletList.Unordered>
						</div>
					),
					note: (
						<div>
							After the content has finished loading and the Progress Indicator has disappeared, we{" "}
							<strong>recommend</strong> to focus on the content's wrapper element.
						</div>
					)
				},
				content: <AccessibilityProgressIndicator />,
				code: { name: "accessibility.tsx", code: accessibilityCode },
				useConfiguration: true
			}
		]
	}
];

export default {
	label: "Progress Indicator",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ProgressIndicatorAPI }],
		themingConfiguration: "progressIndicator"
	}
};
