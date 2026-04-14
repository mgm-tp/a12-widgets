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

import { provider, ExternalLink } from "@com.mgmtp.a12.widgets/widgets-core";
import CalloutAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/callout/main/callout.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { BasicCallout } from "./basic.js";
import { ResizableAndDraggableCallout } from "./resizable-draggable.js";
import { AccessibilityCallout } from "./accessibility-callout.js";

import basicCode from "!./basic.tsx?raw";
import resizableAndDraggableCode from "!./resizable-draggable.tsx?raw";
import accessibilityCode from "!./accessibility-callout.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Callout",
		description: (
			<p>
				The <strong>Callout</strong> Widget renders content as a pop-up over all other content. It can help you use
				screen space more effectively and reduce screen clutter.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicCallout />,
				description: (
					<p>
						By default, the <strong>Callout</strong> will close automatically when a touch is detected outside of its
						element, or when the Escape key is triggered. In addition, you can close it by clicking on the close button
						in the top right corner like the examples below.
					</p>
				),
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Resizable and Draggable",
				content: !provider.isPhone() ? (
					<ResizableAndDraggableCallout />
				) : (
					<p>This feature is not intended to be used on phone.</p>
				),
				description: (
					<p>
						Besides the basic example, the <strong>Callout</strong> is using{" "}
						<ExternalLink href="https://www.npmjs.com/package/react-rnd">react-rnd</ExternalLink> that makes it
						resizable and draggable. To enable this feature, use the <code>resizeAndDragOptions</code> property to
						configure options for resizing and dragging. But note that currently, the{" "}
						<strong>Resizable and Draggable Callout</strong> is not intended to be used on phone.
					</p>
				),
				code: { name: "resizable-draggable.tsx", code: resizableAndDraggableCode }
			},
			{
				label: "Accessibility",
				content: <AccessibilityCallout />,
				description: {
					info: (
						<>
							<p>
								By default, the <strong>Callout</strong> will have the <code>aria-labelledby</code> attribute using the
								ID of the heading title. You can also provide additional HTML attributes for the callout via the{" "}
								<code>htmlAttributes</code> property.
							</p>
							<p>
								In the example below, the <code>aria-label</code> is added and shown in the container through the{" "}
								<code>htmlAttributes</code> property.
							</p>
						</>
					),
					note: (
						<p>
							To fully support accessibility, each <strong>Callout</strong> should have its own <code>id</code>. It will
							be used to generate the header title's id and linked to the <strong>aria-labelledby</strong> attribute,
							allowing screen readers to provide complete information to users.
						</p>
					)
				},
				code: { name: "accessibility.tsx", code: accessibilityCode }
			}
		]
	}
];

export default {
	label: "Callout",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: CalloutAPI }],
		themingConfiguration: "callout"
	}
};
