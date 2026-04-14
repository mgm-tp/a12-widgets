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
import QuickAccessButtonAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/quick-access-button/main/quick-access-button.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { PrimaryQuickAccessButtonShowcase } from "./primary.js";
import { SecondaryQuickAccessButtonShowcase } from "./secondary.js";
import { PreserveMainActionStylesShowcase } from "./preserve-main-action-styles.js";

import primaryCode from "!./primary.tsx?raw";
import secondaryCode from "!./secondary.tsx?raw";
import preserveMainActionStylesCode from "!./preserve-main-action-styles.tsx?raw";

const { Item, Unordered } = BulletList;

const showcases: Showcase[] = [
	{
		label: "Quick Access Button",
		description: (
			<>
				<p>
					The <strong>Quick Access Button</strong> Widget provides a space-efficient way to group actions.
				</p>
				<p>
					Please group actions with the same type and semantics to a QuickAccessButton since it can only reflect one
					semantic respectively.
				</p>
				<p>The QuickAccessButton consists of two areas:</p>
				<Unordered indent={false}>
					<Item>
						The main action button on the left. You can customize this button by passing an element to the{" "}
						<code>mainAction</code> property.
					</Item>
					<Item>
						The popup menu on the right. This menu contains a list of actions declared using <code>actionItems</code>{" "}
						property.
					</Item>
				</Unordered>
			</>
		),
		sections: [
			{
				label: "Primary",
				content: <PrimaryQuickAccessButtonShowcase />,
				description: {
					info: (
						<p>
							This example is the default primary Quick Access Button along with its <code>active</code>,{" "}
							<code>destructive</code> and <code>disabled</code> properties applied.
						</p>
					)
				},
				code: { name: "primary.tsx", code: primaryCode }
			},
			{
				label: "Secondary",
				content: <SecondaryQuickAccessButtonShowcase />,
				description: (
					<p>
						This example is the default secondary Quick Access Button along with its <code>active</code>,{" "}
						<code>destructive</code> and <code>disabled</code> properties applied.
					</p>
				),
				code: { name: "secondary.tsx", code: secondaryCode }
			},
			{
				label: "Preserve Main Action Styles",
				content: <PreserveMainActionStylesShowcase />,
				description: (
					<p>
						This example demonstrates the <code>preserveMainActionStyles</code> property, which maintains the main
						action's visual styling (primary, destructive) when rendering the corresponding action item in the popup
						menu.
					</p>
				),
				code: { name: "preserve-main-action-styles.tsx", code: preserveMainActionStylesCode }
			}
		]
	}
];

export default {
	label: "Quick Access Button",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: QuickAccessButtonAPI }],
		themingConfiguration: "quickAccessButton",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Quick Access Button</strong> includes the main action{" "}
				<StyledShowcaseLink href="#/widgets/general/buttons/button#buttons-theme-configuration">
					Button
				</StyledShowcaseLink>{" "}
				and{" "}
				<StyledShowcaseLink href="#/widgets/general/popup-menu#popup-menu-theme-configuration">
					Popup Menu
				</StyledShowcaseLink>{" "}
				widgets, therefore it inherits the style configurations of those components.
			</p>
		)
	}
};
