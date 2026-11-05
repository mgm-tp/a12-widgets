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

import controlsCode from "!./controls.tsx?raw";
import fixturesCode from "!./fixtures.tsx?raw";
import positionPlaygroundCode from "!./position-playground.tsx?raw";
import providerPlaygroundCode from "!./provider-playground.tsx?raw";

import type { Showcase } from "../../../helpers/definitions.js";

import { PositionPlayground } from "./position-playground.js";
import { ProviderPlayground } from "./provider-playground.js";

const showcases: Showcase[] = [
	{
		label: "Message and Tooltip Position",
		description: (
			<p>
				Form fields place their message box and their tooltips relative to the control, and both positions are
				configurable. Set them on a single widget with <code>messagePosition</code> and{" "}
				<code>breakTooltipsToNewLine</code> — <code>tooltipPosition</code> on Text Output — or on a whole subtree at
				once with <code>FieldDefaultConfigProvider</code>.
			</p>
		),
		sections: [
			{
				label: "Position per Widget",
				description: (
					<p>
						Use <code>messagePosition</code> to move the message box <strong>above</strong> or <strong>below</strong>{" "}
						the control, and <code>breakTooltipsToNewLine</code> — <code>tooltipPosition</code> on Text Output — to move
						the tooltips <strong>beside</strong>, <strong>above</strong> or <strong>below</strong> it. Pick an option to
						see every widget react at once, so you can check that a position you are considering works across the whole
						form and not just for one field. The two <em>default</em> options leave the respective property out
						entirely, which shows where each widget places the element on its own.
					</p>
				),
				content: <PositionPlayground />,
				useConfiguration: true,
				// Listed as an array so all three files are readable. This intentionally hides the
				// "Open in Playground" button, which only appears for a single-file snippet.
				code: [
					{ name: "position-playground.tsx", code: positionPlaygroundCode },
					{ name: "controls.tsx", code: controlsCode },
					{ name: "fixtures.tsx", code: fixturesCode }
				]
			},
			{
				label: "One Position for the Whole Form",
				description: (
					<p>
						<code>FieldDefaultConfigProvider</code> sets both positions for every data entry widget and every Text
						Output in its subtree, so a form gets one layout without repeating the properties on each field — its
						read-only fields included. Use <code>messagePosition</code> for the message box and{" "}
						<code>tooltipPosition</code> (<strong>beside</strong>, <strong>above</strong> or <strong>below</strong>) for
						the tooltips. A property set on a single widget still wins, and nested providers merge, so an inner one
						overrides only what it sets. Each field below carries either a message or a tooltip, the way a real form
						does, so both positions are visible at once.
					</p>
				),
				content: <ProviderPlayground />,
				useConfiguration: true,
				code: [{ name: "provider-playground.tsx", code: providerPlaygroundCode }]
			}
		]
	}
];

export default {
	label: "Message and Tooltip Position",
	structure: showcases
};
