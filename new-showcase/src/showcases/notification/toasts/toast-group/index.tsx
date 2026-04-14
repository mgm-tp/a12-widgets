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

import ToastGroupAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/toast/main/toast-group.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox, StyledShowcaseLink } from "../../../../helpers/showcase-styles.js";

import { ApplicationLevelToastGroupShowcase } from "./app-level.js";

import applicationLevelCode from "!./app-level.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Toast Group",
		description: {
			info: (
				<>
					<p>
						The <strong>ToastGroup</strong> widget is used to define a collection of toasts, which helps to notify the
						user in a sequential manner.
					</p>
					<p>
						On the <strong>desktop or tablet</strong>, all toasts in the group are displayed on the screen and aligned
						with the window. Use the <code>position</code> property to adjust the group's position; it is displayed on
						the <code>top-right</code> by default. The <code>focusOnMount</code> property sets the focus on the toast
						whenever it appears on the screen.
					</p>
					<p>
						On the <strong>phone</strong>, Toasts are stacked one by one and always positioned at the bottom. Only the
						newest toast added will be visible. Closing the toast above will then reveal the one under.
					</p>
					<p>
						Displaying all toasts on a large screen (desktop or tablet) may take up a lot of spaces, so we have made the
						toasts <strong>stackable</strong>, similar to the default behavior on the phone but with a better look and
						more convenience. To enable this feature, use the <code>stackable</code> property, and it can be applied to{" "}
						<strong>all devices</strong>. The <strong>stackable</strong> toast group provides a toolbar where a user can
						put essential actions such as expanding/collapsing toasts; or closing all toasts. The{" "}
						<code>onToggleStack</code> property can also be used to determine if the toast group is expanding or
						stacking.
					</p>
					<p>
						Furthermore, it is recommended to utilize the <code>collapse</code> property to display a button for
						collapsing the content of the toast, particularly on mobile devices to free up space. In this example, the{" "}
						<strong>Collapsible</strong> checkbox works for <strong>Permanent</strong> Toasts only.
					</p>
				</>
			),
			note: (
				<StyledShowcaseBulletListInMessageBox>
					<BulletList.Item>
						By default, after the toasts are closed, the focus will be set back to the element that trigger adding
						before. But in case the trigger element is gone or the toast was shown programmatically without user
						interaction, the focus will be set back to the main content that has <code>role="main"</code>. Make sure
						that the main content always has the <code>tabIndex</code> attribute so it can get focused.
					</BulletList.Item>
					<BulletList.Item>
						To improve A11Y, it is recommended to always render the Toast Group if the <code>stackable</code> mode is on
						so that all newly added toast will be announced by screen readers.
					</BulletList.Item>
				</StyledShowcaseBulletListInMessageBox>
			)
		},
		sections: [
			{
				content: <ApplicationLevelToastGroupShowcase />,
				code: { name: "app-level.tsx", code: applicationLevelCode },
				useConfiguration: true
			}
		]
	}
];

export default {
	label: "Toast Group",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ToastGroupAPI }],
		themingConfiguration: "toastGroup",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Toast Group</strong> inherits the style configuration of the{" "}
				<StyledShowcaseLink href="#/widgets/feedback/toasts/toast#toast-theme-configuration">Toast</StyledShowcaseLink>{" "}
				widget.
			</p>
		)
	}
};
