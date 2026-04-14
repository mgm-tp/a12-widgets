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

import TabPanelTplAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tab-panel/main/template/tab-panel.tpl.api.json" with { type: "json" };
import TabPanelAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tab-panel/main/tab-panel.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox } from "../../helpers/showcase-styles.js";

import { TabPanelExample } from "./basic.js";
import { HorizontalTabPanelShowcase } from "./horizontal-tab-panel.js";
import { TabPanelAccessibilityShowcase } from "./accessibility.js";

import basicCode from "!./basic.tsx?raw";
import horizontalTabPanelCode from "!./horizontal-tab-panel.tsx?raw";
import tabPanelAccessibilityCode from "!./accessibility.tsx?raw";

const { Item } = BulletList;

const showcases: Showcase[] = [
	{
		label: "Tab Panel",
		description: (
			<p>
				The <strong>Tab Panel</strong> Widget makes it easy to explore and switch between different views that are
				related and at the same level of hierarchy. It contains a list of tabs and their corresponding content.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <TabPanelExample />,
				description: {
					info: (
						<>
							<p>
								Define the list of tabs by using the <code>tabs</code> property. Each tab is specified by{" "}
								<code>TabPanelTemplateProps.TabProps</code>.
							</p>
							<div>
								A tab item can have the following states:
								<BulletList.Unordered>
									<BulletList.Item>
										<code>selected</code>: The currently active tab.
									</BulletList.Item>
									<BulletList.Item>
										<code>highlighted</code>: Visually emphasizes a tab with distinct styling, useful for drawing the
										user’s attention to a specific item.
									</BulletList.Item>
									<BulletList.Item>
										<code>disabled</code>: The tab is not interactive.
									</BulletList.Item>
								</BulletList.Unordered>
								In the example below, the selected state is initially visible on the 1st tab and can be seen on other
								interactive tabs after you click them. The 3rd tab is highlighted and the 4th is disabled.
							</div>
							<p>
								To display content above the tabs, use the <code>header</code> property. Besides that,{" "}
								<strong>Tab Panel</strong> also has a template <code>TabPanelTemplate.PanelHeader</code> that provides
								you a convenient way to create the header with <code>heading</code> and <code>suffixes</code> elements.
								In the example below, we display a title and a close button by using that template.
							</p>
						</>
					),
					note: (
						<>
							<span>To fully support accessibility:</span>
							<StyledShowcaseBulletListInMessageBox>
								<Item>
									You should pass an <code>id</code> to <code>TabPanel</code> and each tab should have its own{" "}
									<code>title</code>.
								</Item>
								<Item>
									When using a tab with Badge, you should set the <code>id</code> of Badge to be the same value as the{" "}
									<code>ariaDescribedby</code> property to ensure the screen reader can read the Badge's information.
								</Item>
							</StyledShowcaseBulletListInMessageBox>
						</>
					)
				},
				code: {
					name: "basic.tsx",
					code: basicCode
				}
			},
			{
				label: "Horizontal Tab Panel",
				content: <HorizontalTabPanelShowcase />,
				description: {
					info: (
						<p>
							<strong>Tab Panel</strong> supports two orientations: <strong>vertical</strong> (default) and{" "}
							<strong>horizontal</strong>, which can be set using the <code>orientation</code> property. This example
							demonstrates the horizontal orientation.
						</p>
					)
				},
				code: {
					name: "horizontal-tab-panel.tsx",
					code: horizontalTabPanelCode
				}
			},
			{
				label: "Accessibility",
				content: <TabPanelAccessibilityShowcase />,
				description: {
					info: (
						<p>
							By default, the <strong>Tab Panel</strong> will keep the focus on tab item after selecting. However, in
							certain scenarios, such as improving accessibility for screen reader users, it is better to move the focus
							to the panel area after a tab is selected. You can enable this behavior by setting the{" "}
							<code>focusOnPanelAfterSelect</code> property to <strong>true</strong>.
						</p>
					)
				},
				code: {
					name: "tab-panel-accessibility.tsx",
					code: tabPanelAccessibilityCode
				}
			}
		]
	}
];
export default {
	label: "Tab Panel",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: TabPanelAPI
			},
			{
				declaration: TabPanelTplAPI
			}
		],
		themingConfiguration: "tabPanel"
	}
};
