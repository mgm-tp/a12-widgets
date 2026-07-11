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

import TextFieldAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/text-field/main/template/text-field.tpl.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";

import { Basic } from "./basic.js";
import { States } from "./states.js";
import { AdditionalCustomizations } from "./additional-customizations.js";
import { BufferedTextField } from "./buffered-text-field.js";

import basicCode from "!./basic.tsx?raw";
import statesCode from "!./states.tsx?raw";
import additionalCustomizationsCode from "!./additional-customizations.tsx?raw";
import bufferedTextFieldCode from "!./buffered-text-field.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Text Field",
		description: (
			<p>
				The <strong>Text Field</strong> (previously called <strong>Text Line</strong>) Widget is a controlled component
				that allows users to type text and handle click, keyboard and value changed event. This widget also supports
				accessibility and provides additional functionalities such as affixes, add-ons, and helper text.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <Basic />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "States",
				content: <States />,
				description: (
					<>
						<p>
							There are five variants beside the default: <code>info</code>, <code>warning</code>, <code>error</code>,{" "}
							<code>readonly</code>, and <code>disabled</code>.
						</p>
						<p>
							The <code>infoMessage</code>, <code>warningMessage</code> and <code>errorMessage</code> properties can
							also be used to display different messages (one or multiple messages can be shown at once).
						</p>
					</>
				),
				code: { name: "states.tsx", code: statesCode }
			},
			{
				label: "Additional Customizations",
				content: <AdditionalCustomizations />,
				description: {
					info: (
						<>
							<p>
								This example combines some of the features that the <code>Text Field</code> widget provides altogether,
								including:
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
								<BulletList.Item>
									<code>textAlignment</code> - the alignment of the text.
								</BulletList.Item>
							</BulletList.Unordered>
							<p>
								The widget also provides the <code>TextAffix</code> component that allows you to display the given text
								as a prefix or suffix. See the second example for more details.
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
				useConfiguration: true,
				code: { name: "additional-customizations.tsx", code: additionalCustomizationsCode }
			},
			{
				label: "Buffered Text Field",
				content: <BufferedTextField />,
				description: (
					<>
						<p>
							You can make a Stateful Text Field by using the higher-order components (HOC) <code>BufferedInput</code>{" "}
							and <code>HTMLInputAdapter</code> to wrap the <code>TextField</code>.
						</p>
						<p>
							Unlike the <strong>TextField</strong> component which requires you to control its value and manually
							update the component any time the value is changed, the <strong>BufferedTextField</strong> below is a
							stateful component which has its value handled internally.
						</p>
						<p>
							In addition to sharing most of the same functionalities as the <strong>Text Field</strong>, the
							BufferedTextField also allows you to provide an initial value via the <code>initialValue</code> property.
							Business logic can be handled using the <code>onValueSubmit</code> property, which is fired whenever the
							input loses focus.
						</p>
						<p>
							While values normally update when blur events occurs, a useful feature these HOCs provide is allowing you
							to trigger a value change when pressing the ENTER key. This provides you with additional flexibility and
							can be enabled via the usage of the optional <code>submitOnEnter</code> property.
						</p>
					</>
				),
				code: { name: "buffered-text-field.tsx", code: bufferedTextFieldCode }
			}
		]
	}
];

export default {
	label: "Text Field",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: TextFieldAPI }],
		themingConfiguration: "textField"
	}
};
