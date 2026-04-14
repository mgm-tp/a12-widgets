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

import CounterAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/counter/main/counter.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { CounterVariantsShowcase } from "./variants.js";
import { BasicCounterShowcase } from "./basic.js";
import { CounterWithAddonsShowcase } from "./addons.js";
import { CounterInteractiveShowcase } from "./interactive.js";

import CounterVariantsCode from "!./variants.tsx?raw";
import BasicCounterCode from "!./basic.tsx?raw";
import CounterWithAddonsCode from "!./addons.tsx?raw";
import CounterInteractiveCode from "!./interactive.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Counter",
		description: (
			<p>
				The <strong>Counter</strong> Widget is a label widget designed in a compact format to display a numerical amount
				of its connected element.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicCounterShowcase />,
				description: (
					<>
						<p>
							The Counter provides the <code>value</code> property that receives a number or a string and can display a
							decimal number string correctly. If the <code>value</code> is <code>undefined</code>, it will display the{" "}
							<code>placeholder</code> property instead.
						</p>
						<p>
							It also provides the <code>overflowCount</code> property to display the overflow value along with an
							additional "<strong>+</strong>" mark when the <code>value</code> property gets over the limit of the
							declared <code>overflowCount</code>.
						</p>
						<p>
							For better <strong>Accessibility</strong>, you can use the <code>hiddenDescription</code> property to
							describe the Counter. It will be read by screen readers before reading the counter's value.
						</p>
						<p>
							This example shows how the Counter works when the <code>value</code> property is: <code>undefined</code>,
							a <code>number</code>, a <code>string</code>, and more than the <code>overflowCount</code> value.
						</p>
					</>
				),
				code: { name: "basic.tsx", code: BasicCounterCode },
				toggleBetweenPartialAndFullCode: true
			},

			{
				label: "Variants",
				content: <CounterVariantsShowcase />,
				description: (
					<p>
						This example shows all variants of the Counter, including the <code>default</code>, <code>secondary</code>,{" "}
						<code>constructive</code>, and <code>destructive</code> types.
					</p>
				),
				code: { name: "variants.tsx", code: CounterVariantsCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Addons & Animations",
				content: <CounterWithAddonsShowcase />,
				description: (
					<p>
						To customize the Counter with additional elements along with the <code>value</code>, you can make use of the{" "}
						<code>addonBefore</code> and <code>addonAfter</code> properties. We've also added increment and decrement
						buttons so that you can see what the different counter animations look like.
					</p>
				),
				code: { name: "addons.tsx", code: CounterWithAddonsCode },
				toggleBetweenPartialAndFullCode: true,
				useConfiguration: true
			},
			{
				label: "Interactive",
				content: <CounterInteractiveShowcase />,
				description: {
					info: (
						<>
							<p>
								To make the Counter become an interactive element, please set the <code>interactive</code> property to{" "}
								<code>true</code>. It's recommended to set the <code>title</code> property if the Counter is{" "}
								<code>interactive</code>.
							</p>
							<p>
								If the widget is intended to change the role, you can add the <code>htmlAttributes</code> property with{" "}
								an appropriate role.
							</p>
						</>
					),
					note: (
						<p>
							Interactive Counter should not be used inside an interactive element since it causes accessibility issues,
							confuses user behavior, and leads to issue with HTML syntax.
						</p>
					)
				},
				code: { name: "interactive.tsx", code: CounterInteractiveCode }
			}
		]
	}
];

export default {
	label: "Counter",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: CounterAPI }],
		themingConfiguration: "counter"
	}
};
