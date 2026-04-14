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

import TextAreaAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/text-area/main/template/text-area.tpl.api.json" with { type: "json" };
import { Link, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";

import { Basic } from "./basic.js";
import { BufferedTextArea } from "./buffered-text-area.js";
import { AdditionalCustomizations } from "./additional-customizations.js";

import basicCode from "!./basic.tsx?raw";
import bufferedTextAreaCode from "!./buffered-text-area.tsx?raw";
import additionalCustomizationsCode from "!./additional-customizations.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Text Area",
		description: (
			<>
				<p>
					The <strong>Text Area</strong> Widget is a controlled component that allows users to type multi-line text.
				</p>
				<p>
					The <strong>Text Area</strong> was built on top of the <strong>Text Field</strong> and for this reason, it
					inherits several general features from the <strong>Text Field</strong> such as states, messages, helper text,
					etc. Visit the <Link href="#/widgets/data-entry/text-field">Text Field</Link> showcase to see these common
					features demoed.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				content: <Basic />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Additional Customizations",
				description: {
					info: (
						<>
							<p>
								This example combines some of the features that <code>TextAreaStateless</code> widget provides
								altogether, including:
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>labelGraphic</code> - placed on the left of the input's label.
								</BulletList.Item>
								<BulletList.Item>
									<code>addonBefore</code> - placed on the left of the input.
								</BulletList.Item>
								<BulletList.Item>
									<code>prefixes</code> - placed inside the input, on the left.
								</BulletList.Item>
								<BulletList.Item>
									<code>suffixes</code> - placed inside the input, on the right.
								</BulletList.Item>
								<BulletList.Item>
									<code>addonAfter</code> - placed on the right of the input.
								</BulletList.Item>
								<BulletList.Item>
									<code>helperText</code> - placed below the input.
								</BulletList.Item>
							</BulletList.Unordered>
							<p>
								The widget can also expand the input's height when the text gets longer. To enable this functionality,
								set the <code>autoExpand</code> property to <code>true</code>.
							</p>
						</>
					),
					note: (
						<p>
							To fully support accessibility, each <strong>tooltip</strong> or <strong>affix</strong> should have its
							own <code>id</code>. That <code>id</code> should be passed in as a value of the{" "}
							<code>ariaDescribedby</code> property.
						</p>
					)
				},
				content: <AdditionalCustomizations />,
				code: { name: "additional-customizations.tsx", code: additionalCustomizationsCode }
			},
			{
				label: "Buffered TextArea",
				content: <BufferedTextArea />,
				description: (
					<>
						<p>
							You can make a Stateful Text Area by using the higher-order component (HOC) <code>BufferedInput</code> to
							wrap the <code>TextAreaStateless</code>.
						</p>
						<p>
							Unlike the <code>TextAreaStateless</code> component which requires you to control its value and manually
							update the component any time the value is changed, the <code>BufferedTextArea</code> below is a stateful
							component which has its value handled internally.
						</p>
						<p>
							In addition to sharing most of the same functionalities as the <code>TextAreaStateless</code>, the
							BufferedTextArea also allows you to provide an initial value via the <code>initialValue</code> property.
							Business logic can be handled using the <code>onValueSubmit</code> property, which is fired whenever the
							input loses focus.
						</p>
					</>
				),
				code: { name: "buffered-text-area.tsx", code: bufferedTextAreaCode }
			}
		]
	}
];

export default {
	label: "Text Area",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: TextAreaAPI }],
		themingConfiguration: "textArea"
	}
};
