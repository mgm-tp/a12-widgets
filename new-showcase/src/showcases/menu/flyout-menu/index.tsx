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

import FlyoutMenuAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/menu/main/flyout-menu.api.json" with { type: "json" };
import MenuAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/menu/main/menu.api.json" with { type: "json" };
import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";

import { HorizontalMenuWithGroup } from "./horizontal-menu-with-group.js";
import { HorizontalMenu } from "./horizontal-menu.js";
import { MenuWithA11yTitles } from "./menu-with-a11y-titles.js";
import { VerticalMenu } from "./vertical-menu.js";
import { ScrollToSelectedItemMenu } from "./scroll-to-selected-item.js";
import { MenuWithVariants } from "./with-variants.js";

import itemsCode from "!../menu.setup.tsx?raw";
import horizontalMenuWithGroupCode from "!./horizontal-menu-with-group.tsx?raw";
import horizontalMenuCode from "!./horizontal-menu.tsx?raw";
import menuWithA11yTitlesCode from "!./menu-with-a11y-titles.tsx?raw";
import verticalMenuCode from "!./vertical-menu.tsx?raw";
import scrollToSelectedItemMenuCode from "!./scroll-to-selected-item.tsx?raw";
import menuWithVariantsCode from "!./with-variants.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Flyout Menu",
		description: (
			<p>
				The <strong>Flyout Menu</strong> Widget comes with <code>horizontal</code> and <code>vertical</code> variants
				for you to fit your menus and menu items with different use cases.
			</p>
		),
		sections: [
			{
				label: "Horizontal Menu",
				description: (
					<p>
						In horizontal mode, the items will be shown from left to right and will be condensed when there is no more
						space. Set the <code>type</code> property to <code>horizontal</code> to enable this feature.
					</p>
				),
				content: <HorizontalMenu />,
				code: [
					{ name: "horizontal-menu.tsx", code: horizontalMenuCode },
					{
						name: "menu.setup.tsx",
						code: itemsCode
					}
				]
			},
			{
				label: "Horizontal Menu With Group",
				description: (
					<>
						<p>
							Lists of menu items can now have both regular items and groups of items with the newly defined type{" "}
							<code>MenuItemType[]</code>. It is a union type created by combining <code>MenuItem</code> and{" "}
							<code>MenuGroup</code>.
						</p>
						<div>
							<p>
								You must ensure that you use the properties below correctly so that the menu groups can work as
								expected.
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>type</code> <strong>(required)</strong>: This property only has one value <code>group</code>,
									and it is handy for distinguishing a group from a regular item.
								</BulletList.Item>
								<BulletList.Item>
									<code>items</code> <strong>(required)</strong>: This property define a list of menu items within a
									group, it must be used wherever <strong>type</strong> is specified.
								</BulletList.Item>
								<BulletList.Item>
									<code>label</code>: This property defines the group label. When specified, it serves as a tooltip when
									hovering over the group divider in the non-condensed view and as a sub-header in the condensed view.
								</BulletList.Item>
							</BulletList.Unordered>
							<p>
								<strong>Note:</strong> If you want to hide the group title in the horizontal flyout menu, do not provide
								a label for the group.
							</p>
						</div>
					</>
				),
				content: <HorizontalMenuWithGroup />,
				code: [
					{ name: "horizontal-menu-with-group.tsx", code: horizontalMenuWithGroupCode },
					{
						name: "menu.setup.tsx",
						code: itemsCode
					}
				]
			},
			{
				label: "Vertical Menu",
				description: (
					<>
						<p>
							In vertical mode, the items will be shown from top to bottom, and both the text and icons of the menu
							items will be shown. Set the <code>type</code> property to <code>vertical</code> to enable this feature.
						</p>
						<p>
							In addition, the menu can be collapsed to save space by setting the <code>collapsed</code> property to{" "}
							<code>true</code>. If this setting is applied, the text of the menu items will be hidden, and only their
							placeholders will be shown. The placeholder here is the provided icon or the first letter of the label.{" "}
							<strong>Be aware that</strong>, if the label of multiple items start with the same character, their
							placeholders will be the same and difficult to distinguish.
						</p>
						<p>
							On mobile, please use the <Link href="#/widgets/navigation/menu/sliding-menu">Sliding Menu</Link> instead.
						</p>
					</>
				),
				content: <VerticalMenu />,
				useConfiguration: true,
				code: [
					{ name: "vertical-menu.tsx", code: verticalMenuCode },
					{
						name: "menu.setup.tsx",
						code: itemsCode
					}
				]
			},
			{
				label: "Scroll to Selected Item",
				description: (
					<p>
						For Vertical Menu, set the <code>scrollToSelectedItem</code> property to <code>true</code> to make the menu
						scroll to the selected item's position on page load.
					</p>
				),
				content: <ScrollToSelectedItemMenu />,
				code: [
					{ name: "scroll-to-selected-item.tsx", code: scrollToSelectedItemMenuCode },
					{
						name: "menu.setup.tsx",
						code: itemsCode
					}
				]
			},
			{
				label: "Menu With Variants",
				description: (
					<p>
						The <strong>Flyout Menu</strong> also provides a set of variants to indicate the status of a menu item. You
						can use the <code>variant</code> property to select your desired status: <code>open</code>,{" "}
						<code>info</code>, <code>error</code>, <code>warning</code>, <code>inProgress</code>, or <code>done</code>.
						Once it is defined, a specific icon corresponding to that variant will be shown.
					</p>
				),
				content: <MenuWithVariants />,
				code: { name: "menu-with-variants.tsx", code: menuWithVariantsCode },
				useConfiguration: true,
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>Both the horizontal and vertical menus have a number of features to support accessibility.</p>
						<p>By default, these hidden texts below will be read by screen readers:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								The condensed item has the text <strong>" Further menuitems"</strong>.
							</BulletList.Item>
							<BulletList.Item>
								The menu item which <strong>has children</strong> has the text <strong>" Open submenu "</strong>.
							</BulletList.Item>
							<BulletList.Item>
								On <strong>mobile</strong>:
								<BulletList.Unordered type="circle">
									<BulletList.Item>
										The <strong>selected</strong> menu item which <strong>has children</strong> has the text{" "}
										<strong>"Chosen level: "</strong>.
									</BulletList.Item>
									<BulletList.Item>
										The <strong>selected</strong> menu item has the text <strong>"Current page: "</strong>.
									</BulletList.Item>
									<BulletList.Item>
										The <strong>disabled</strong> menu item has the text <strong>"Inactive: "</strong>.
									</BulletList.Item>
								</BulletList.Unordered>
							</BulletList.Item>
							<BulletList.Item>
								On <strong>desktop</strong>, screen reader will read based on <code>aria-current</code> attribute.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							If the menu is used as a main menu of the page, set the <code>useAs</code> property to{" "}
							<strong>main</strong>, it will have an <code>aria-label</code> attribute with localized text. In this
							example, the localized text is:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>English: "Main navigation"</BulletList.Item>
							<BulletList.Item>German: "Hauptnavigation"</BulletList.Item>
						</BulletList.Unordered>
						<p>
							To customize the text, use <Link href="#/basics/accessibility">A11YLanguageContext</Link>.
						</p>
						<p>
							In addition, you can use the <code>mainContainerLabel</code> property to customize the{" "}
							<code>aria-label</code> attribute without depending on <code>useAs="main"</code>.
						</p>
						<p>
							If you pass a <code>title</code> to a <strong>MenuItem</strong>, that menu item will have a{" "}
							<code>title</code> and an <code>aria-label</code> attribute.
						</p>
					</>
				),
				content: <MenuWithA11yTitles />,
				code: { name: "menu-with-a11y-titles.tsx", code: menuWithA11yTitlesCode }
			}
		]
	}
];

export default {
	label: "Flyout Menu",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: FlyoutMenuAPI }, { declaration: MenuAPI, filter: ["MenuItem", "MenuGroup"] }],
		themingConfiguration: "menu"
	}
};
