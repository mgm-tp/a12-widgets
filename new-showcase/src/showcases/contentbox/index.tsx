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

import { Link, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import ActionContentboxAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/contentbox/main/action-contentbox/action-contentbox.api.json" with { type: "json" };
import ContentboxAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/contentbox/main/template/contentbox.tpl.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { BasicContentBox } from "./basic-contentbox.js";
import { CombinationContentbox } from "./combination-contentbox.js";
import { SubActionBarWithAnimationShowcase } from "./subactionbar.js";
import { ActionBarGroupContentBox } from "./action-bar-group.js";
import { NavigationContentbox } from "./navigation-contentbox.js";
import { PaddingConfiguration } from "./padding-configuration.js";
import { CustomHeading } from "./custom-heading.js";

import basicContentBoxCode from "!./basic-contentbox.tsx?raw";
import combinationContentboxCode from "!./combination-contentbox.tsx?raw";
import subActionBarWithAnimationCode from "!./subactionbar.tsx?raw";
import actionBarGroupContentBoxCode from "!./action-bar-group.tsx?raw";
import navigationContentboxCode from "!./navigation-contentbox.tsx?raw";
import paddingConfigurationCode from "!./padding-configuration?raw";
import customHeadingCode from "!./custom-heading?raw";

const showcases: Showcase[] = [
	{
		label: "Content Box",
		description: (
			<p>
				The <b>Content Box</b> Widget is a template component used to organize content and actions in a consistent way.
				It consists of the following areas: Header (heading, notification, subheading), Content and Footer.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicContentBox />,
				code: { name: "basic-contentbox.tsx", code: basicContentBoxCode },
				useDarkBackground: true
			},
			{
				label: "Custom Heading",
				content: <CustomHeading />,
				code: { name: "custom-heading.tsx", code: customHeadingCode },
				useDarkBackground: true,
				description: (
					<p>
						You also can use the <code>componentRenderers</code> property to customize the heading. This example shows
						how to use custom heading with the <code>HiddenText</code> component. In that case, the heading is invisible
						but still be read by screen readers.
					</p>
				)
			},
			{
				label: "Navigation Contentbox",
				content: <NavigationContentbox />,
				useDarkBackground: true,
				code: { name: "navigation-contentbox.tsx", code: navigationContentboxCode },
				description: (
					<p>
						When the <code>listenToNavigationContext</code> property is enabled, the <b>Content Box</b> will look for{" "}
						the <code>onBackButtonClicked</code> and the <code>onCloseButtonClicked</code> handlers in the context then
						render a back button and a close button respectively if they are present.
					</p>
				)
			},
			{
				label: "SubActionBar",
				description: (
					<p>
						The <b>Content Box</b> provides a <code>SubActionBarTpl</code> wrapper that could help you to optimize the
						display of the <b>Action Bar</b> on small devices with additional animation when toggling its visibility.
					</p>
				),
				content: <SubActionBarWithAnimationShowcase />,
				useDarkBackground: true,
				code: { name: "subactionbar.tsx", code: subActionBarWithAnimationCode }
			},
			{
				label: "Group ActionBar",
				content: <ActionBarGroupContentBox />,
				useDarkBackground: true,
				code: { name: "action-bar-group.tsx", code: actionBarGroupContentBoxCode }
			},
			{
				label: "Padding Configuration",
				description: (
					<div>
						<p>
							You can customize the padding of the content in <b>Content Box</b> by using the <code>padding</code>{" "}
							property. The value of the padding is set to:
						</p>
						<ul>
							<li>
								<strong>true</strong> (default): There is a padding to the left, right, and bottom of the Contentbox's
								content.
							</li>
							<li>
								<strong>false</strong>: No padding applied.
							</li>
							<li>
								<strong>custom value</strong>: You can also set your custom value for padding. For example:{" "}
								<code>padding="12px 24px"</code> or <code>padding=24</code>.
							</li>
						</ul>
					</div>
				),
				content: <PaddingConfiguration />,
				useConfiguration: true,
				code: { name: "padding-configuration.tsx", code: paddingConfigurationCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Combination",
				content: <CombinationContentbox />,
				description: (
					<p>
						This example shows how the <b>Content Box</b> widget works with a combination of Widgets, including Wizard,
						Message Box, Flyout Menu, and Breadcrumb.
					</p>
				),
				useDarkBackground: true,
				code: { name: "combination-contentbox.tsx", code: combinationContentboxCode }
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>
							To improve Accessibility, the <b>Content Box</b> provides some titles based on the locale for:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>ContentBoxElements.Title</strong>: The title always has the <code>role = heading</code>. But
								there is no default aria-level. You have to pass it in manually by using <code>ariaLevel</code>{" "}
								property.
							</BulletList.Item>
							<BulletList.Item>
								<strong>Footer</strong>: There is a hidden heading which is placed inside the footer if it contains
								children. The <code>headingTitle</code> property is used to customize the title of the hidden heading.
								By default, it would be:
								<BulletList.Unordered type="circle">
									<BulletList.Item>
										English: <i>"Action Section"</i>
									</BulletList.Item>
									<BulletList.Item>
										German: <i>"Aktionsbereich"</i>
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									Refers to <Link href="#/widgets/layout/content-box#basic">Basic Contentbox</Link> example.
								</p>
							</BulletList.Item>
							<BulletList.Item>
								<strong>Back button</strong>: The ContentBox provides a navigation back button which is placed inside
								the heading and before the title. This button has a localized title:
								<BulletList.Unordered type="circle">
									<BulletList.Item>
										English: <i>"Back"</i>
									</BulletList.Item>
									<BulletList.Item>
										German: <i>"Zurück"</i>
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									Refers to <Link href="#/widgets/layout/content-box#navigation-contentbox">Navigation</Link> example.
								</p>
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				)
			}
		]
	}
];

export default {
	label: "Content Box",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ name: "Contentbox", declaration: ContentboxAPI },
			{ name: "Action Contentbox", declaration: ActionContentboxAPI }
		],
		themingConfiguration: "contentBox"
	}
};
