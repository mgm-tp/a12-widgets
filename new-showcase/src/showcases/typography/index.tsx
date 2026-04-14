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

import TypographyAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/typography/main/typography.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { CustomTypographyShowcase } from "./custom.js";
import { BasicTypographyShowcase } from "./basic.js";
import { CustomAddonPosition } from "./addons-position.js";

import multilingualCode from "!../pop-up-menu/multilingual?raw";
import customCode from "!./custom.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import addonsPositionCode from "!./addons-position.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Typography",
		description: (
			<div>
				<p>
					The <strong>Typography</strong> Widget provides a way to define headers without using <code>h-tags</code>.
				</p>
				<p>
					Setting the <code>level</code> for a given <code>Typography.Headline</code>, will apply appropriate styles to
					it. The <code>Typography.Headline</code> has <strong>5 levels</strong>, from 1 to 5.
				</p>
				<p>
					There is also <code>ariaLevel</code> for accessibility, which can be set independently of the level used for
					styling purposes.
				</p>
				<p>
					In addition, The <strong>Typography</strong> widget provides a <code>Typography.Section</code> which can be
					used to contain anything you'd like.
				</p>
			</div>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<>
							<p>
								To display additional information after the headline, you can use the <code>info</code> property.
							</p>
							<p>
								You can set the <code>divider</code> property to true to have a divider appear under each{" "}
								<code>Typography.Headline</code>.
							</p>
						</>
					),
					warning: (
						<div>
							Dividers won't appear if you're using the Flat Compact theme, regardless of whether the{" "}
							<code>divider</code> property is set to true.
						</div>
					)
				},
				content: <BasicTypographyShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Custom",
				description: (
					<>
						<p>
							You can use the <code>htmlTag</code> property to override the default <code>div</code> tag used in{" "}
							<code>Typography.Headline</code>
						</p>
						<p>
							The <code>addons</code> property allows for additional customization via displaying actions or other
							information at the end of the headline.
						</p>
						<p>
							It’s also possible to build a collapsible headline using the <code>collapsible</code> &{" "}
							<code>collapsed</code> properties (and optionally <code>collapseIcon</code> & <code>expandIcon</code>).
						</p>
						<p>
							If you do make your headline collapsible, it’s recommended to wrap any content below the headline inside
							of a <code>Typography.Body</code> element to help ensure the content maintains a consistent appearance.
						</p>
					</>
				),
				content: <CustomTypographyShowcase />,
				code: [
					{ name: "custom.tsx", code: customCode },
					{ name: "multilingual.tsx", code: multilingualCode }
				]
			},
			{
				label: "Addons Position",
				description: (
					<div>
						<p>
							You can set the property <code>swapAddonsPosition</code> to swap the positions of the addons and graphic
							icon (collapse or expand icon).
						</p>
						<p>
							Furthermore, the property <code>iconVerticalAlignment</code> can be used to position the addons and
							collapse icon to <code>top</code>, <code>middle</code>, or <code>bottom</code> of the panel.
						</p>
					</div>
				),
				content: <CustomAddonPosition />,
				code: [{ name: "addons-position.tsx", code: addonsPositionCode }]
			}
		]
	}
];

export default {
	label: "Typography",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: TypographyAPI }],
		themingConfiguration: "typography"
	}
};
