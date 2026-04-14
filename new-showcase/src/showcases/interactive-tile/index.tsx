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

import InteractiveTileAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/interactive-tile/main/interactive-tile.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { InteractiveTileExample } from "./interactive-tile.js";
import { Accessibility } from "./accessibility.js";

import InteractiveTileCode from "!./interactive-tile.tsx?raw";
import AccessibilityCode from "!./accessibility.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Interactive Tile",
		description: (
			<>
				<p>
					An <strong>Interactive Tile</strong> is a button-like component that allows user to freely define the content
					area. It is ideal for showcasing various types of content in a more visualized and scannable format.
				</p>
				<p>
					This Widget offers two variants: <code>primary</code>, and <code>secondary</code>. Each variant will have
					three additional states:
				</p>
				<BulletList.Unordered>
					<BulletList.Item>
						<code>active</code>: The activated tile will have a specific color.
					</BulletList.Item>
					<BulletList.Item>
						<code>disabled</code>: The disabled tile will have a specific color and will not be clickable.
					</BulletList.Item>
					<BulletList.Item>
						<code>selected</code>: The selected tile will display a checkmark icon in the top-right corner.
					</BulletList.Item>
				</BulletList.Unordered>
			</>
		),
		sections: [
			{
				label: "Basic",
				content: <InteractiveTileExample />,
				code: { name: "interactive-tile.tsx", code: InteractiveTileCode }
			},
			{
				label: "Accessibility",
				content: <Accessibility />,
				description: (
					<>
						<p>
							For better accessibility, it is necessary to provide alternative text for some interactive tiles including
							icons. The text can be set via the <code>aria-label</code> attribute within <code>htmlAttributes</code>.
						</p>
						<p>
							If the widget is intended to be used as a <strong>link</strong>, you should add the{" "}
							<code>htmlAttributes</code> property with <code>role: "link"</code> to set the correct semantics for
							accessibility.
						</p>
					</>
				),
				code: { name: "accessibility.tsx", code: AccessibilityCode }
			}
		]
	}
];

export default {
	label: "Interactive Tile",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: InteractiveTileAPI }],
		themingConfiguration: "interactiveTile"
	}
};
