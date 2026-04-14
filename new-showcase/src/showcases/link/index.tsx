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

import LinkAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/link/main/link/link.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLinkInMessageBox } from "../../helpers/showcase-styles.js";

import { BasicLinkShowcase } from "./basic.js";
import { ExternalLinkShowcase } from "./external-link.js";
import { MailtoLinkShowcase } from "./mailto-link.js";

import basicCode from "!./basic.tsx?raw";
import externalCode from "!./external-link.tsx?raw";
import mailtoCode from "!./mailto-link.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Link",
		description: (
			<p>
				The <strong>Link</strong> Widget represents the primary way to allow users to navigate around your application,
				by rendering a fully accessible anchor tag with the proper href.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicLinkShowcase />,
				description: {
					info: (
						<p>
							If a link does not need to be strongly visible, then the helper class for a regular font weight can be
							used. In addition, you can put an icon within a link to indicate what type of link it is. If you need to
							set values for the anchor tag used internally by the <code>Link</code> widget, you can do so using the{" "}
							<code>linkAttributes</code> property.
						</p>
					),
					note: (
						<p>
							Besides navigating to an href, a <strong>Link</strong> can trigger an interactive event through the{" "}
							<code>onClick</code> property.
							<br />
							To enhance accessibility semantics, it is recommended to set the <code>useAsButton</code> to true. This
							will add a <code>role="button"</code> to the link and allowing the event to be triggered by the Enter or
							Spacebar.
							<br />
							For more details, please refer to the{" "}
							<StyledShowcaseLinkInMessageBox href="#/widgets/feedback/toasts/toast#combination">
								Combination Toast
							</StyledShowcaseLinkInMessageBox>
							.
						</p>
					)
				},
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "External Link",
				description: (
					<p>
						An <code>ExternalLink</code> will have a default <code>target</code> attribute of <code>_blank</code>, that
						points to a target page on another domain from the domain it's published on.
					</p>
				),
				content: <ExternalLinkShowcase />,
				code: { name: "external-link.tsx", code: externalCode }
			},
			{
				label: "Mailto Link",
				description: (
					<p>
						A <code>MailtoLink</code> receives an email address via the <code>to</code> property instead of{" "}
						<code>href</code>.
					</p>
				),
				content: <MailtoLinkShowcase />,
				code: { name: "mailto-link.tsx", code: mailtoCode }
			}
		]
	}
];

export default {
	label: "Link",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: LinkAPI }],
		themingConfiguration: "link"
	}
};
