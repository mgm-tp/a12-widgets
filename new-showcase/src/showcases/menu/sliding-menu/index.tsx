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

import SlidingMenuAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/menu/main/sliding-menu.api.json" with { type: "json" };
import MenuAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/menu/main/menu.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";

import { Basic } from "./basic.js";
import { CustomBackwardItem } from "./custom-backward-item.js";

import itemsCode from "!../menu.setup.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import customBackwardItemCode from "!./custom-backward-item.js?raw";

const showcases: Showcase[] = [
	{
		label: "Sliding Menu",
		description: (
			<p>
				The <strong>Sliding Menu</strong> Widget is useful in situations with limited screen real estate, such as on
				small devices or zoomed in views.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<>
							<p>
								The Sliding Menu has a similar set of features to the{" "}
								<Link href="#/widgets/navigation/menu/flyout-menu">Flyout Menu</Link> such as the ability to collapse,
								set a variant, scroll to selected items, and support accessibility.
							</p>
							<p>
								<strong>To implement accessibility:</strong>
							</p>
							<p>For the project, it is needed to have a tab circle and hide the main content when it is expanded.</p>
							<p>
								Tab circle means: after the last menu-item, the next tab goes to the sliding menu button to
								collapse/expand the menu. To have this function, widgets provided the <code>onTabOut</code> property for{" "}
								the <code>SlidingMenu</code> that will trigger when the user presses a tab key to move the focus out of
								the last menu-item. The project can handle to move the focus on button to collapse/expand the menu by
								themself when <code>onTabOut</code> was fired.
							</p>
							<p>
								In addition, if a submenu is open, it will have the hidden text " <strong>Close submenu</strong> ". To
								customize the text, use <Link href="#/basics/accessibility">A11YLanguageContext</Link>.
							</p>
						</>
					),
					note: (
						<p>
							For better <strong>Accessibility</strong> support, we encourage to provide <code>id</code> for each{" "}
							<code>MenuItem</code> in order to set the focus on the parent item when expanding/collapsing its sub-menu.
							If you do not intend to provide ids for items, please at least give the <code>id</code> for the{" "}
							<code>SlidingMenu</code>. It will then be used to generate ids for the menu items, combined with the
							item's <code>label</code> or <code>title</code>. If none of them is given, random ids will be assigned,
							and the focus will be set on the navigation wrapper.
						</p>
					)
				},
				content: <Basic />,
				code: [
					{ name: "basic.tsx", code: basicCode },
					{
						name: "menu.setup.tsx",
						code: itemsCode
					}
				]
			},
			{
				label: "Custom Backward Item",
				description: {
					info: (
						<>
							<p>
								When a menu item contains a submenu, it automatically appears as a backward navigation item at the top
								of that submenu, allowing users to easily return to the parent menu level.
							</p>
							<p>
								By default, the backward item inherits all properties from its parent item. You can use{" "}
								<code>backwardItemProps</code> property to override attributes like the label, icon, or click handler to
								customize the navigation experience.
							</p>
						</>
					)
				},
				content: <CustomBackwardItem />,
				code: [
					{ name: "custom-backward-item.tsx", code: customBackwardItemCode },
					{
						name: "menu.setup.tsx",
						code: itemsCode
					}
				]
			}
		]
	}
];

export default {
	label: "Sliding Menu",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: SlidingMenuAPI, filter: ["SlidingMenuProps"] },
			{ declaration: MenuAPI, filter: ["MenuItem"] }
		],
		themingConfiguration: "menu"
	}
};
