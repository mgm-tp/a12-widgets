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

import { Link } from "@com.mgmtp.a12.widgets/widgets-core";
import CollapsiblePanelAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/collapsible-panel/main/collapsible-panel.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { ClosedCollapsiblePanel } from "./closed-collapsible-panel.js";
import { Addons } from "./addons.js";
import { AccessibilityCollapsiblePanel } from "./accessibility-collapsible-panel.js";

import closedCollapsiblePanelCode from "!./closed-collapsible-panel.tsx?raw";
import addonsCode from "!./addons.tsx?raw";
import accessibilityCollapsiblePanelCode from "!./accessibility-collapsible-panel.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Collapsible Panel",
		description: (
			<p>
				The <strong>Collapsible Panel</strong> Widget is a container that holds other controls and provides an easy
				expansion/collapse mechanism.
				<br />
				Besides, there is also the <Link href="#/widgets/utils/typography">Typography</Link> Widget that provides all
				features of the <strong>Collapsible Panel</strong> and in addition allows creating a visual hierarchy.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <ClosedCollapsiblePanel />,
				code: { name: "closed-collapsible-panel.tsx", code: closedCollapsiblePanelCode }
			},
			{
				label: "Addons",
				content: <Addons />,
				description: (
					<div>
						<p>
							Use the <code>addons</code> property to display elements on the right side.
						</p>
						<p>
							You can also set the property <code>swapAddonsPosition</code> to swap the positions of the addons and
							collapsed icon (arrow icon).
						</p>
					</div>
				),
				code: { name: "addons.tsx", code: addonsCode },
				useConfiguration: true
			},
			{
				label: "Accessibility",
				content: <AccessibilityCollapsiblePanel />,
				code: { name: "accessibility-collapsible-panel.tsx", code: accessibilityCollapsiblePanelCode },
				description: (
					<>
						To better support accessibility, we have provided <code>role</code> and <code>ariaLevel</code> properties.
						<br />
						These properties aren't assigned any values by default.
						<p>
							In this example, we set the <code>role</code> to <code>heading</code> and the <code>ariaLevel</code> to{" "}
							<code>2</code>.
						</p>
					</>
				)
			}
		]
	}
];

export default {
	label: "Collapsible Panel",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: CollapsiblePanelAPI }],
		themingConfiguration: "collapsiblePanel"
	}
};
