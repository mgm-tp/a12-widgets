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

import CardAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/card/main/card.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { BasicCardShowcase } from "./basic.js";
import { PrimaryActionCardShowcase } from "./primary-action.js";

import basicCode from "!./basic.tsx?raw";
import primaryActionCode from "!./primary-action.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Card",
		description: (
			<div>
				<p>
					The <strong>Card</strong> Widget is a component that is designed to display content and actions for a single
					topic.
				</p>
				<p>
					They should be easy to scan for relevant and actionable information. Elements, like texts and images, should
					be placed on them in a way that clearly indicates hierarchy.
				</p>
			</div>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<div>
						<p>
							Card layouts can vary to support the types of content they contain. The following elements are commonly
							found among that variety.
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>Card</code> hold all card elements, and their size is determined by the space those elements
								occupy. Card elevation is expressed by the container.
							</BulletList.Item>
							<BulletList.Item>
								<code>Card.Media</code> includes an image to reinforce the content.
							</BulletList.Item>
							<BulletList.Item>
								<code>Card.Content</code> supports a wide variety of content, including text, action buttons, links, and
								more.
							</BulletList.Item>
						</BulletList.Unordered>
					</div>
				),
				content: <BasicCardShowcase />,
				useConfiguration: true,
				code: { name: "basic.tsx", code: basicCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Primary Action",
				description: (
					<div>
						<p>
							Often a card allow users to interact with the entirety of its surface to trigger its main action, be it an
							expansion, a link to another screen or some other behavior. The action area of the card can be specified
							by wrapping its contents in a <code>Card.ActionArea</code> component.
						</p>
						<p>
							Besides, a card can also offer supplemental actions which should stand detached from the main action area
							in order to avoid event overlap, such as wrapping a <code>Card.Media</code> in a{" "}
							<code>Card.ActionArea</code> component.
						</p>
					</div>
				),

				content: <PrimaryActionCardShowcase />,
				useDarkBackground: true,
				code: { name: "primary-action.tsx", code: primaryActionCode }
			}
		]
	}
];

export default {
	label: "Card",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: CardAPI }],
		themingConfiguration: "card"
	}
};
