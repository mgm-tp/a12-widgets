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

import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import BadgeAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/badge/main/badge.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";
import {
	StyledShowcaseBulletListInMessageBox,
	StyledShowcaseLinkInMessageBox
} from "../../../helpers/showcase-styles.js";

import { BasicBadgeShowcase } from "./basic.js";
import { OverflowedCountBadgeShowcase } from "./overflowed-count.js";
import { StandaloneBadgeShowcase } from "./standalone.js";
import { TinyBadgeShowcase } from "./tiny.js";
import { AccessibilityBadgeShowcase } from "./accessibility.js";

import basicCode from "!./basic.tsx?raw";
import overflowedCountCode from "!./overflowed-count.tsx?raw";
import standaloneCode from "!./standalone.tsx?raw";
import tinyCode from "!./tiny.tsx?raw";
import accessibilityCode from "!./accessibility.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Badge",
		description: (
			<p>
				The <strong>Badge</strong> Widget is the component that generates a small badge to the top-right of its
				child(ren).
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicBadgeShowcase />,
				description: (
					<div>
						<p>
							The <strong>Badge</strong> Widget provides four notification types: <code>information</code> (default),{" "}
							<code>warning</code>, <code>error</code>, and <code>success</code>.
						</p>
						<p>
							Besides, change the <code>hidden</code> property to <code>true</code> or <code>false</code> to toggle the
							badge's visibility. In the example below, the Badge of primary button will be hidden/shown every five
							seconds.
						</p>
						<p>
							It can also be used in a Flyout Menu by providing <code>badge</code> property for each menu item. In a
							responsive menu, we provide these properties that allow a user to define a badge for the 3-dot menu item.
						</p>
						<p>
							We can also customize the hint using the <code>title</code> property, which replaces the default title of
							the badges.
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>onCondensed(condensedItems: MenuItem[])</code>: Returns an array of condensed items so that the
								user can count the total value of the badges
							</BulletList.Item>
							<BulletList.Item>
								<code>condensedBadge</code>: A badge to be displayed at the top-right of the 3-dot menu item
							</BulletList.Item>
						</BulletList.Unordered>
					</div>
				),
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Tiny",
				description: {
					info: (
						<p>
							Set the <code>tiny</code> property to <code>true</code> to display the tiny badge.
						</p>
					),
					note: (
						<p>
							Accessibility: The use of tiny badges does not fulfill contrast requirements. It is{" "}
							<strong>not recommended to use them with default colors</strong> when there are accessibility requirements
							for a project.
						</p>
					)
				},
				content: <TinyBadgeShowcase />,
				code: { name: "tiny.tsx", code: tinyCode }
			},
			{
				label: "Overflowed Count",
				content: <OverflowedCountBadgeShowcase />,
				description: (
					<div>
						<p>
							When the count is bigger than <code>overflowCount</code> (default value is <code>9999</code>),{" "}
							<code>overflowCount+</code> will be displayed.
						</p>
						<p>
							You can increase or decrease the overflow count by changing <code>overflowCount</code> property.
							<br />
							For example, the first info Badge use default <code>overflowCount</code>, the success, warning & error
							Badges were set to <code>99</code>.
						</p>
					</div>
				),
				code: { name: "overflowed-count.tsx", code: overflowedCountCode }
			},
			{
				label: "Standalone",
				content: <StandaloneBadgeShowcase />,
				description: (
					<p>
						Set <code>standalone</code> to <code>true</code> to make the Badge a standalone element.
					</p>
				),
				code: { name: "standalone.tsx", code: standaloneCode }
			},
			{
				label: "Accessibility",
				content: <AccessibilityBadgeShowcase />,
				description: {
					info: (
						<div>
							Each badge has a title and hidden text corresponding to its variant. The hidden text will have the same
							text as the title and be localized as well, it is placed in front of the count. By default, it's info, so
							they would be:
							<BulletList.Unordered>
								<BulletList.Item>
									Normal badge, for example:
									<BulletList.Unordered type="circle">
										<BulletList.Item>Title: "Info notifications"</BulletList.Item>
										<BulletList.Item>Hidden text: ", Info notifications: "</BulletList.Item>
									</BulletList.Unordered>
								</BulletList.Item>
								<BulletList.Item>
									Tiny badge, for example:
									<BulletList.Unordered type="circle">
										<BulletList.Item>Title: "Info notifications available"</BulletList.Item>
										<BulletList.Item>Hidden text: ", Info notifications available"</BulletList.Item>
									</BulletList.Unordered>
								</BulletList.Item>
							</BulletList.Unordered>
							<p>
								To customize the title and hidden text, use <code>title</code> property.
							</p>
						</div>
					),
					note: (
						<StyledShowcaseBulletListInMessageBox>
							<BulletList.Item>
								For icon buttons, the <code>-u-unseenButRead</code> does not work. To ensure screen readers announce the
								Badge's information correctly, include the Badge's content in the <code>title</code> property of the
								Button. See the last button of each example above.
							</BulletList.Item>
							<BulletList.Item>
								The{" "}
								<StyledShowcaseLinkInMessageBox href="#/widgets/data-display/interaction-hint">
									Interaction Hint
								</StyledShowcaseLinkInMessageBox>{" "}
								conveys badge details by default. If you enable it, do not include badge information in the{" "}
								<code>title</code> attribute, as this will cause duplicate announcements.
							</BulletList.Item>
						</StyledShowcaseBulletListInMessageBox>
					)
				},
				code: { name: "accessibility.tsx", code: accessibilityCode }
			}
		]
	}
];

export default {
	label: "Badge",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: BadgeAPI }],
		themingConfiguration: "badge"
	}
};
