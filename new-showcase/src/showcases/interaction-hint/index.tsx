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

import InteractionHintAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/interaction-hint/main/interaction-hint.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { InteractionHintShowcase } from "./basic.js";
import { InteractionHintTypeShowcase } from "./type.js";

import basicCode from "!./basic.tsx?raw";
import typeCode from "!./type.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Interaction Hint",
		description: (
			<>
				<p>
					The <strong>Interaction Hint</strong> is designed to enhance the accessibility and usability of interactive
					elements for users who rely on keyboard controls or screen readers. Its primary purpose is to provide
					immediate, clear, and contextual information about the functionality of buttons, links, and other interactive
					elements through the <code>title</code> attribute. This ensures that all users, regardless of their input
					method, can easily understand the purpose and action of each element.
				</p>
				<p>
					The <code>InteractionHintConfigProvider</code> centralizes settings that control the behavior of Interaction
					Hint through the <code>enableInteractionHint</code> configuration.
					<br />
					By default, the hint is deactivated in all interactive elements. If needed, this behavior can be enabled for
					interactive elements by setting <code>enableInteractionHint = true</code>. This ensures that when users
					interact with elements via keyboard navigation, hovering, or tabbing, the default browser tooltip is
					suppressed, preventing redundancy and improving compatibility with assistive technologies.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<>
							<p>
								This example showcases how the <strong>Interaction Hint</strong> can effectively replace the traditional{" "}
								<code>title</code> attribute for an interactive element. When the element is hovered over or focused on,
								the hint appears, offering users clear and accessible information about its purpose and function.
							</p>
							<p>
								For accessibility purposes, the value of the <code>title</code> attribute is transferred to the{" "}
								<code>aria-label</code>. This ensures that screen readers announce both the content of the element and
								the interaction hint, providing a more complete user experience.
							</p>
						</>
					),
					note: (
						<p>
							<strong>Interaction Hint</strong> is only recommended for interactive elements, such as buttons, links or
							element with <code>role="button"</code> or <code>role="link"</code>.
						</p>
					)
				},
				content: <InteractionHintShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Type",
				description: (
					<p>
						There are four Interaction Hint types besides the default: <code>info</code>, <code>success</code>,{" "}
						<code>warning</code>, and <code>error</code>. You can change it by setting <code>variant</code> property.
					</p>
				),
				content: <InteractionHintTypeShowcase />,
				code: { name: "type.tsx", code: typeCode }
			}
		]
	}
];

export default {
	label: "Interaction Hint",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: InteractionHintAPI }],
		themingConfiguration: "interactionHint"
	}
};
