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

import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox } from "../../helpers/showcase-styles.js";

import { BackgroundColor } from "./background-color.js";
import { FontColor } from "./font-color.js";
import { FontSize } from "./font-size.js";
import { FontStyle } from "./font-style.js";
import { FontWeight } from "./font-weight.js";
import { LineHeight } from "./line-height.js";
import { TextAlign } from "./text-align.js";
import { TextTransform } from "./text-transform.js";
import { CommonHelperList } from "./common.js";
import { Introduction } from "./introduction.js";

const showcases: Showcase[] = [
	{
		label: "Helper Classes",
		description: <Introduction />,
		sections: [
			{
				label: "Background Color",
				content: <BackgroundColor />,
				description: {
					info: (
						<>
							<p>
								The <strong>Background Color</strong> Helper Classes can help you to add the{" "}
								<strong>background colors</strong> described in the{" "}
								<Link href="#/basics/theme/colors">Widgets Colors System</Link> to the following specific
								elements/Widgets:
							</p>
							<CommonHelperList title="background color" hasIconButtonExamples />
							<p>
								The example below shows how these Widgets behave when having a <strong>Background Color</strong> Helper
								Class.
							</p>
						</>
					),
					note: (
						<div>
							<p>Take care when changing the background color as failing to do so may result in poor contrast for:</p>
							<StyledShowcaseBulletListInMessageBox>
								<BulletList.Item>The text color of the Widget</BulletList.Item>
								<BulletList.Item>The box shadow of Text Field, Text Area and Select</BulletList.Item>
								<BulletList.Item>The hover color of a Button</BulletList.Item>
							</StyledShowcaseBulletListInMessageBox>
						</div>
					)
				},
				useConfiguration: true
			},
			{
				label: "Font Color",
				content: <FontColor />,
				description: {
					info: (
						<>
							<p>
								The <strong>Font Color</strong> Helper Classes can help you to add the <strong>font colors</strong>{" "}
								described in the <Link href="#/basics/theme/colors">Widgets Colors System</Link> to the following
								specific elements/Widgets:
							</p>
							<CommonHelperList title="font color" hasIconButtonExamples />
							<p>
								The example below shows how these Widgets behave when having a <strong>Font Color</strong> Helper Class.
							</p>
						</>
					),
					note: (
						<p>
							When using Helper Classes for <strong>Font Color</strong>, please pay attention to the{" "}
							<strong>Background Color</strong>. If necessary, you can change it using the{" "}
							<strong>Background Color</strong> helper classes.
						</p>
					)
				},
				useConfiguration: true
			},
			{
				label: "Font Size",
				content: <FontSize />,
				description: (
					<>
						<p>
							The <strong>Font Size</strong> Helper Classes can help you to add the <strong>font sizes</strong>{" "}
							described in the <Link href="#/basics/theme/fonts#font-size">Widgets Fonts System</Link> to the following
							specific elements/Widgets:
						</p>
						<CommonHelperList title="font size" hasIconButtonExamples />
						<p>
							The example below shows how these Widgets behave when having a <strong>Font Size</strong> Helper Class.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Font Style",
				content: <FontStyle />,
				description: (
					<>
						<p>
							The <strong>Font Style</strong> Helper Classes can help you to add a custom <strong>font style</strong>{" "}
							property to the following specific elements/Widgets:
						</p>
						<CommonHelperList title="font style" />
						<p>
							The example below shows how the <code>h_italicFontStyle</code> turns the <strong>font style</strong> of
							these Widgets into <code>Italic</code>.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Font Weight",
				content: <FontWeight />,
				description: (
					<>
						<p>
							The <strong>Font Weight</strong> Helper Classes can help you to add the <strong>font weight</strong>{" "}
							described in the <Link href="#/basics/theme/fonts#font-weight">Widgets Fonts System</Link> to the
							following specific elements/Widgets:
						</p>
						<CommonHelperList title="font weight" />
						<p>
							The example below shows how these Widgets behave when having a <strong>Font Weight</strong> Helper Class.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Line Height",
				content: <LineHeight />,
				description: (
					<>
						<p>
							Widgets provide the <code>h_smallerLineHeight</code> and the <code>h_biggerLineHeight</code> classes for
							you to modify the <strong>line height</strong> of the following specific elements/Widgets:
						</p>
						<CommonHelperList title="line height" />
						<p>
							The example below shows how these Widgets behave when having a <strong>Line Height</strong> Helper Class.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Text Align",
				content: <TextAlign />,
				description: (
					<>
						<p>
							Widgets provide the <code>h_leftAlign</code>, <code>h_centerAlign</code> and <code>h_rightAlign</code>{" "}
							classes for you to modify the <strong>text align</strong> of the following specific elements/Widgets:
						</p>
						<CommonHelperList title="text align" />
						<p>
							The example below shows how these Widgets behave when having a <strong>Text Align</strong> Helper Class.
						</p>
					</>
				),
				useConfiguration: true
			},
			{
				label: "Text Transform",
				content: <TextTransform />,
				description: (
					<>
						<p>
							The <strong>Text Transform</strong> Helper Classes can help you to modify the{" "}
							<strong>text transform</strong> to a specific elements/Widgets:
						</p>
						<CommonHelperList title="text transform" />
						<p>
							The example below shows how these Widgets behave when having a <strong>Text Transform</strong> Helper
							Class.
						</p>
					</>
				),
				useConfiguration: true
			}
		]
	}
];

export default {
	label: "Helper Classes",
	structure: showcases
};
