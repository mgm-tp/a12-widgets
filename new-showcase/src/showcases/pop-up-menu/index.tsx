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
import PopUpMenuAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/pop-up-menu/main/pop-up-menu.api.json" with { type: "json" };
import HeaderTriggerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/button/main/header-trigger/header-trigger.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { BasicShowcase } from "./basic.js";
import { WithHeaderTriggerExample } from "./with-header-trigger.js";

import basicCode from "!./basic.tsx?raw";
import withHeaderTriggerCode from "!./with-header-trigger.tsx?raw";
import multilingualCode from "!./multilingual?raw";

const showcases: Showcase[] = [
	{
		label: "Popup Menu",
		description: (
			<p>
				The <strong>Popup Menu</strong> Widget is designed for you to use when there are more than a few options to
				choose from. By clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and
				execute the relevant action.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							The <strong>Popup Menu</strong> Widget typically displays a "3-dots" button when closed and a "close"
							button when opened. You can use the <Link href="#/widgets/data-display/list">List</Link> widget for menu
							items.
						</p>
						<p>
							We've integrated the <code>PopupMenuConfigContext</code> with a default value of{" "}
							<code>enableA11YMobileDesign</code> set to <code>true</code>, prioritizing accessibility support on mobile
							and tablet devices. If you prefer to disabled this feature, you can simply set{" "}
							<code>enableA11YMobileDesign</code> to <code>false</code> when configuring the context.
						</p>
						<p>
							Note that the <code>closeOnOutsideClick</code> property is only enabled by default on desktop or when
							<code>enableA11YMobileDesign</code> is set to <code>false</code> within the configuration of the{" "}
							<code>PopupMenuConfigContext</code>.
						</p>
					</>
				),

				content: <BasicShowcase />,
				code: { name: "basic.tsx", code: basicCode },
				useConfiguration: true,
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Custom Trigger Element With Header Trigger",
				description: {
					info: (
						<>
							<p>
								You can customize the trigger element by using the <code>triggerElement</code> property. In this
								example, we use the <code>HeaderTrigger</code> widget.
							</p>
							<p>
								The <code>HeaderTrigger</code> allows you to display additional information, such as an icon or label.
								You can refer to the API definition to better understand how to use it.
							</p>
						</>
					),
					note: (
						<p>
							<strong>Accessibility</strong>: If the selected option is displayed in the <code>HeaderTrigger</code>{" "}
							element, the hidden text <strong>Selected</strong> will be made visible to screen readers. Otherwise, this
							hidden text can be removed by setting the <code>hideHiddenText</code> property to <strong>true</strong>.
						</p>
					)
				},
				content: <WithHeaderTriggerExample />,
				code: [
					{ name: "with-header-trigger.tsx", code: withHeaderTriggerCode },
					{ name: "multilingual.tsx", code: multilingualCode }
				]
			}
		]
	}
];

export default {
	label: "PopUp Menu",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: PopUpMenuAPI }, { declaration: HeaderTriggerAPI }],
		themingConfiguration: "popupMenu",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Popup Menu</strong> uses our{" "}
				<StyledShowcaseLink href="#/widgets/general/buttons/button#buttons-theme-configuration">
					Button
				</StyledShowcaseLink>{" "}
				widget, so it inherits the style configuration of that component.
			</p>
		)
	}
};
