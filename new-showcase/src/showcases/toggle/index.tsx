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

import ToggleAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/toggle/main/toggle.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { ToggleShowcase } from "./toggle.js";
import { SimpleToggleButtonShowcase } from "./simple-toggle-button.js";

import toggleCode from "!./toggle.tsx?raw";
import simpleToggleButtonCode from "!./simple-toggle-button.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Toggle Button",
		description: (
			<p>
				The <strong>Toggle Button</strong> Widget can be used to group related actions items.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							A toggle item is selected when its value is equal to the passed <code>value</code> property.
						</p>
						<p>
							You can pass the <code>readOnly</code> or <code>disabled</code> properties to an individual toggle item or
							the entire toggle group.
						</p>
					</>
				),
				content: <ToggleShowcase />,
				code: { name: "toggle.tsx", code: toggleCode }
			},
			{
				label: "Simple Toggle Button",
				description: {
					info: (
						<>
							<p>
								Set the <code>showOnlySelectedOption</code> property to <code>true</code> to display the selected item
								only.
							</p>
							<p>
								Use the <code>variant</code> property of each <code>Toggle.Item</code> to customize the look of the
								overlay element when the item gets selected. For better Accessibility, please set <code>title</code>{" "}
								property for each <code>Toggle.Item</code>.
							</p>
							<p>Display all items by:</p>
							<ul>
								<li>hovering over it.</li>
								<li>
									focusing on it and pressing <code>Space</code> or <code>Enter</code> keys.
								</li>
							</ul>
							<p>
								Keyboard behaviors while this <code>showOnlySelectedOption</code> mode is on:
							</p>
							<ul>
								<li>
									To display all items while focusing on the Simple Toggle Button: use <code>Space</code> or{" "}
									<code>Enter</code> keys.
								</li>
								<li>
									To navigate between items: use the <code>Left</code> or <code>Right</code> arrow keys.
								</li>
								<li>
									To select an item: use the <code>Space</code> or <code>Enter</code> keys.
								</li>
								<li>
									To display the selected item only: use the <code>Escape</code> key.
								</li>
							</ul>
						</>
					)
				},
				content: <SimpleToggleButtonShowcase />,
				code: { name: "simple-toggle-button.tsx", code: simpleToggleButtonCode }
			}
		]
	}
];

export default {
	label: "Toggle Button",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ToggleAPI }],
		themingConfiguration: "toggle"
	}
};
