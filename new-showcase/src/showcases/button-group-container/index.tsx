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

import ButtonGroupContainerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/button-group-container/main/button-group-container.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { AlignmentShowcase } from "./alignment.js";
import { IconButtonResponsiveShowcase } from "./icon-button-responsive.js";
import { ResponsiveShowcase } from "./responsive.js";
import { PreserveSemanticStyles } from "./preserve-semantic-styles.js";

import AlignmentCode from "!./alignment.tsx?raw";
import IconButtonResponsiveCode from "!./icon-button-responsive.tsx?raw";
import ResponsiveCode from "!./responsive.tsx?raw";
import PreserveSemanticStylesCode from "!./preserve-semantic-styles.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Button Group Container",
		description: (
			<p>
				The <strong>Button Group Container</strong> Widget provides a container for arranging a group of related
				Buttons.
			</p>
		),
		sections: [
			{
				label: "Alignment",
				content: <AlignmentShowcase />,
				code: { name: "alignment.tsx", code: AlignmentCode }
			},
			{
				label: "Preserving Semantic Button Types",
				content: <PreserveSemanticStyles />,
				description: (
					<>
						<p>
							This showcase demonstrates all possible button types and states in a responsive{" "}
							<code>ButtonGroupContainer</code>: icon buttons, text buttons, and <code>QuickAccessButtons</code> in{" "}
							<strong>primary</strong>, <strong>secondary</strong>, <strong>default</strong>, <strong>active</strong>,{" "}
							<strong>disabled</strong>, and <strong>destructive</strong> types.
						</p>
						<p>
							When these button collapsed into the popup menu, you can see how button styling is preserved using the{" "}
							<code>preserveSemanticStyles</code> property to maintain semantic styling (colors, states) when buttons
							are collapsed into the popup menu.
						</p>
					</>
				),
				useConfiguration: true,
				code: { name: "preserveSemanticStyles.tsx", code: PreserveSemanticStylesCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Responsive",
				content: <ResponsiveShowcase />,
				description: (
					<p>
						When <code>responsive</code> is set to true, if there is not enough space to show all of the buttons, the{" "}
						<code>ButtonGroupContainer</code> will group them into a <code>PopupMenu</code>, starting from left to
						right.
					</p>
				),
				useConfiguration: true,
				code: { name: "responsive.tsx", code: ResponsiveCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Responsive with icon buttons",
				content: <IconButtonResponsiveShowcase />,
				description: (
					<p>
						This is an example of using icon buttons inside a responsive <code>ButtonGroupContainer</code>.
						<br />
						Each icon button should be given a <code>title</code>. When an icon button is grouped inside of the{" "}
						<code>PopupMenu</code>, its <code>title</code> will be used as button's label.
					</p>
				),
				useConfiguration: true,
				code: { name: "icon-button-responsive.tsx", code: IconButtonResponsiveCode },
				toggleBetweenPartialAndFullCode: true
			}
		]
	}
];

export default {
	label: "Button Group Container",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ButtonGroupContainerAPI }],
		themingConfiguration: "buttonGroupContainer"
	}
};
