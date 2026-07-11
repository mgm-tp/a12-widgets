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

import MessageBoxAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/message-box/main/message-box.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { Variants } from "./variants.js";
import { ActionsExample } from "./actions.js";
import { CustomThemeExample } from "./custom-theme.js";
import { AccessibilityMessageBoxShowcase } from "./accessibility.js";

import variantsCode from "!./variants.tsx?raw";
import actionsCode from "!./actions.tsx?raw";
import customThemeCode from "!./custom-theme?raw";
import accessibilityCode from "!./accessibility.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Message Box",
		description: (
			<p>
				The <strong>Message Box</strong> Widget is a component that allows users to display simple messages (text).
			</p>
		),
		sections: [
			{
				label: "Variants",
				description: {
					info: (
						<p>
							Besides the default <code>error</code> variant, <code>warning</code>, <code>success</code> and{" "}
							<code>info</code> can be used to demonstrate the corresponding information via the <code>variant</code>{" "}
							property.
						</p>
					),
					note: (
						<p>
							You can set invisible focus to a Message Box after it finishes rendering via the{" "}
							<code>focusOnMessage</code> property. When you have multiple message boxes, however, be sure to only set
							focus to one of them. In the example below, we've set focus to the Success Message Box.
						</p>
					)
				},
				content: <Variants />,
				code: { name: "variants.tsx", code: variantsCode }
			},
			{
				label: "Actions",
				description: (
					<p>
						Here's an example of using the <code>action</code> property to show/hide details. You can also use{" "}
						<code>children</code> to display more information.
					</p>
				),
				content: <ActionsExample />,
				code: { name: "actions.tsx", code: actionsCode }
			},
			{
				label: "Custom Theme",
				description: (
					<p>
						The widget offers various configuration options to easily customize the component. Here’s an example of how
						to create a message box with only a left border by adjusting theme customization variables.
					</p>
				),
				content: <CustomThemeExample />,
				code: { name: "customTheme.tsx", code: customThemeCode }
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>
							By default, the icons in{" "}
							<Link href="#/widgets/business-case/message-box#variants">Variants Message Box</Link> render no title and
							hidden text since they are self-explanatory. However, if you're using a custom icon with Icon Widget via
							the <code>icon</code> property, it's recommended to explicitly define them.
						</p>
						<p>
							For more details about title and hidden text behaviour, refer to the{" "}
							<Link href="#/widgets/general/icon#accessibility">Accessibility Icon</Link> showcase.
						</p>
					</>
				),
				content: <AccessibilityMessageBoxShowcase />,
				code: { name: "accessibility.tsx", code: accessibilityCode }
			}
		]
	}
];

export default {
	label: "Message Box",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: MessageBoxAPI }],
		themingConfiguration: "messageBox"
	}
};
