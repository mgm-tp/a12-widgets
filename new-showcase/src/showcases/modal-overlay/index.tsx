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

import ModalOverlayAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/modal-overlay/main/modal-overlay.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { BasicModalExample } from "./basic.js";
import { MaxWidthModalExample } from "./max-width.js";
import { FullscreenWithNoGutterModalExample } from "./fullscreen-with-no-gutter.js";
import { FitToParent } from "./fit-to-parent.js";
import { AccessibilityModalExample } from "./accessibility-modal-overlay.js";

import basicCode from "!./basic.tsx?raw";
import maxWidthCode from "!./max-width.tsx?raw";
import fullscreenWithNoGutterCode from "!./fullscreen-with-no-gutter.tsx?raw";
import fitToParentCode from "!./fit-to-parent.tsx?raw";
import accessibilityCode from "!./accessibility-modal-overlay.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Modal Overlay",
		description: (
			<div>
				The <strong>Modal Overlay</strong> Widget provides a pop-up container to display information without navigating
				away from the current page.
				<br />
				It can hold any kind of content, the most common of which is the&nbsp;
				<Link href="#/widgets/layout/content-box">Content Box</Link> Widget. The content of the{" "}
				<strong>ModalOverlay</strong> is displayed centered on the screen and blocks interacting with the current page.
			</div>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<p>
							By default, you can close the modal via the <strong>ESC</strong> key, or by clicking outside if you set
							the <code>closeOnOutsideClick</code> property to true. To disable the ability of closing by ESC key, you
							can set the <code>closeOnEsc</code> property to <code>false</code>.
						</p>
					),
					note: (
						<p>
							Since closing and opening the modal is user-controlled, the default values of <code>closeOnEsc</code> and{" "}
							<code>closeOnOutsideClick</code> only take effect when used with the <code>onClose</code> callback.
						</p>
					)
				},

				content: <BasicModalExample />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Max Width",
				description: (
					<p>
						A modal can have a custom maximum width by setting the <code>maxWidth</code> property.
					</p>
				),
				useConfiguration: true,
				content: <MaxWidthModalExample />,
				code: { name: "max-width.tsx", code: maxWidthCode }
			},
			{
				label: "Fullscreen with no gutter",
				description: (
					<>
						<p>
							"Gutter" is the spacing around the modal container that you can see clearly when the modal reaches its
							maximum height or width. To remove that gutter, use the <code>noGutter</code> property.
						</p>
						<p>
							In addition, you can make the modal fullscreen by using the <code>fullscreen</code> property.
						</p>
					</>
				),
				useConfiguration: true,
				content: <FullscreenWithNoGutterModalExample />,
				code: { name: "fullscreen-with-no-gutter.tsx", code: fullscreenWithNoGutterCode }
			},
			{
				label: "Fit To Parent",
				description: {
					info: (
						<p>
							Set the <code>fitToParent</code> property to <strong>true</strong> to display the Modal Overlay within the
							parent element. The rest of behaviors remains the same, only the size of the modal is fitted.
						</p>
					),
					note: (
						<p>
							The parent's <code>position</code> attribute will be changed to <code>relative</code> so that the Modal
							Overlay can be aligned. Be aware that if the parent is positioned relative to another element (e.g.:
							fixed), the UI may break.
						</p>
					)
				},
				content: <FitToParent />,
				code: { name: "fit-to-parent.tsx", code: fitToParentCode }
			},
			{
				label: "Accessibility",
				description: {
					info: (
						<>
							<p>
								To ensure proper accessibility for screen readers, you can use the
								<code>containerAttributes</code> property to pass the necessary attributes to the modal container.
							</p>
							<p>
								In the example below, the modal includes <code>aria-labelledby</code> which references the header title
								id. When opened, screen readers will announce with the title, helping users understand the context and
								purpose of the modal.
							</p>
						</>
					)
				},
				content: <AccessibilityModalExample />,
				code: { name: "accessibility.tsx", code: accessibilityCode }
			}
		]
	}
];

export default {
	label: "Modal Overlay",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ModalOverlayAPI }],
		themingConfiguration: "modalOverlay"
	}
};
