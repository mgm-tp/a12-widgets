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

import ModalNotificationAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/modal-notification/main/modal-notification.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { ModalNotificationBasicShowcase } from "./basic.js";
import { ModalNotificationVariantsShowcase } from "./variants.js";
import { ModalNotificationCustomizationShowcase } from "./customization.js";
import { AccessibilityModalNotificationExample } from "./accessibility-modal-notification.js";

import basicCode from "!./basic.tsx?raw";
import variantsCode from "!./variants.tsx?raw";
import customizationCode from "!./customization.tsx?raw";
import accessibilityCode from "!./accessibility-modal-notification.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Modal Notification",
		description: (
			<p>
				The <strong>Modal Notification</strong> Widget is a type of modal window that appears in front of app content to
				inform users about a task and can contain critical information, require decisions, or involve multiple tasks.{" "}
				<strong>Modal Notifications</strong> disable all app functionality when they appear, and remain on screen until
				confirmed, dismissed, or a required action has been taken.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <ModalNotificationBasicShowcase />,
				description: (
					<>
						<p>
							Since the <strong>Modal Notification</strong> extends all properties and behaviors of the{" "}
							<Link href="#/widgets/layout/modal-overlay">Modal Overlay</Link>, by providing <code>onClose</code>
							callback, you can close the modal by pressing <code>ESC</code>. To disable this behavior, set the{" "}
							<code>closeOnEsc</code> property to false.
						</p>
						<p>
							You can set the <code>enableCloseButton</code> property to true along with a <code>onClose</code> callback
							to display a close button on the top-right of the modal.
						</p>
					</>
				),
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Variants",
				content: <ModalNotificationVariantsShowcase />,
				useConfiguration: true,
				description: (
					<p>
						There are three additional variants besides the default <code>info</code> variant: <code>success</code>,{" "}
						<code>warning</code> and <code>error</code>.
					</p>
				),
				code: { name: "variants.tsx", code: variantsCode }
			},
			{
				label: "Customization",
				content: <ModalNotificationCustomizationShowcase />,
				description: (
					<p>
						This example customizes the <strong>Modal Notification</strong> by using the <code>headingButtons</code>,{" "}
						<code>footer</code>, <code>padding</code> and <code>closeOnOutsideClick</code> properties.
					</p>
				),
				code: { name: "customization.tsx", code: customizationCode }
			},
			{
				label: "Accessibility",
				content: <AccessibilityModalNotificationExample />,
				description: {
					info: (
						<>
							<p>
								By default, the <strong>Modal Notification</strong> sets the <code>aria-labelledby</code> attribute
								using the ID of the heading title. You can also provide additional HTML attributes for the container
								element via the <code>containerAttributes</code> property.
							</p>
							<p>
								In the example below, the <code>aria-label</code> is added and shown in the container through the{" "}
								<code>containerAttributes</code> property.
							</p>
						</>
					),
					note: (
						<p>
							To fully support accessibility, each <strong>Modal Notification</strong> should have its own{" "}
							<code>id</code>. It will be used to generate the heading title's id and linked to the{" "}
							<strong>aria-labelledby</strong> attribute, allowing screen readers to provide complete information to
							users.
						</p>
					)
				},
				code: { name: "accessibility-modal-notification.tsx", code: accessibilityCode }
			}
		]
	}
];

export default {
	label: "Modal Notification",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ModalNotificationAPI }],
		themingConfiguration: "modalNotification"
	}
};
