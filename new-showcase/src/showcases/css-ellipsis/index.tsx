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

import CSSEllipsisAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/css-ellipsis/main/css-ellipsis.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox } from "../../helpers/showcase-styles.js";

import { BasicCssEllipsisShowcase } from "./basic.js";
import { TooltipCssEllipsisShowcase } from "./tooltip-css-ellipsis.js";

import basicCode from "!./basic.tsx?raw";
import tooltipCssEllipsisCode from "!./tooltip-css-ellipsis.tsx?raw";

const { Item } = BulletList;
const showcases: Showcase[] = [
	{
		label: "CSS Ellipsis",
		description: {
			info: (
				<p>
					The <code>CSS Ellipsis</code> widget is the A12 solution for truncating long texts. It uses{" "}
					<code>-webkit-line-clamp</code> to create the ellipsis, and it can automatically calculate the number of rows
					to clamp. The full content will be shown in a title attribute on hover by default, and it can also be
					customized to use a tooltip.
				</p>
			),
			note: (
				<div>
					<strong>
						This CSS solution has many technical limitations on the content in order for it to be properly truncated:
					</strong>
					<StyledShowcaseBulletListInMessageBox>
						<Item>
							There should be no margin/padding for the content. CSS Ellipsis will remove the padding/margin of its
							children.
						</Item>
						<Item>The content should have the same line height throughout.</Item>
						<Item>
							BulletList truncation doesn't work on Safari at the moment. If your list consists of short length items,
							consider converting it to a comma separated list instead.
						</Item>
						<Item>The parent element should have a fixed height.</Item>
					</StyledShowcaseBulletListInMessageBox>
				</div>
			)
		},
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							A <code>maxLine</code> property is provided in case the number of lines to show is known. In the first
							example, only two lines will be shown.
						</p>
						<p>
							If no <code>maxLine</code> is given, the truncation will be calculated based on the parent element's size.
							In the second example the parent element's height is set to 60px.
						</p>
						<p>In either case, a title with the full text content will be displayed on hover.</p>{" "}
					</>
				),
				content: <BasicCssEllipsisShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Ellipsis With Tooltip",
				description: (
					<div>
						<p>
							Instead of showing the title on hover, a tooltip can be shown by setting <code>useTooltip</code> to true.
						</p>
						<p>
							The <code>hint</code> variant is set by default, but if you'd like to customize the tooltip's appearance
							you can instead pass <code>success</code>, <code>warning</code> or <code>error</code> to the
							<code>tooltipVariant</code> property.
						</p>
					</div>
				),
				content: <TooltipCssEllipsisShowcase />,
				code: { name: "tooltip-css-ellipsis.tsx", code: tooltipCssEllipsisCode }
			}
		]
	}
];

export default {
	label: "CSS Ellipsis",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: CSSEllipsisAPI }],
		themingConfiguration: "cssEllipsis"
	}
};
