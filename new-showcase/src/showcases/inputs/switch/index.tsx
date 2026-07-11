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

import SwitchAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/switch/main/switch.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";

import { BasicSwitch } from "./basic.js";
import { StatesAndMessagesSwitch } from "./states-and-messages.js";
import { AddonsAndTooltipsSwitch } from "./addons-and-tooltips.js";
import { LabelPositionSwitch } from "./label-position.js";

import basicCode from "!./basic.tsx?raw";
import statesAndMessagesCode from "!./states-and-messages.tsx?raw";
import addonsAndTooltipsCode from "!./addons-and-tooltips.tsx?raw";
import labelPositionCode from "!./label-position.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Switch",
		description: (
			<p>
				The <strong>Switch</strong> Widget is a component that provides a way to display a boolean input where one
				option is preselected. It is similar to a <Link href="#/widgets/data-entry/checkbox">Checkbox</Link> Widget in
				many ways.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							The <code>checked</code> property determines whether the <strong>Switch</strong> is selected or not.
						</p>
						<p>
							You can modify the text content of the options via the <code>checkedOption</code> and{" "}
							<code>uncheckedOption</code> properties. If for whatever reason you'd like to hide the text content of the
							options, you can do so using the <code>hideOptions</code> property.
						</p>
						<p>
							It's possible to hide the label as well. The recommended way of doing so is by setting{" "}
							<code>hideLabel</code> to <strong>true</strong>. This hides the label in a manner that still adheres to
							accessibility best practices.
						</p>
						<p>
							It's also worth noting that the <code>for-attribute</code> will be added to the label if you supply an id
							for the <strong>Switch</strong>.
						</p>
						<p>
							By default, the switch thumb displays a "check" icon when on and a "remove" icon when off. You can replace
							these with your own customization using the <code>checkedIcon</code> and <code>uncheckedIcon</code>{" "}
							properties.
						</p>
					</>
				),
				content: <BasicSwitch />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "States & Messages",
				description: (
					<>
						<p>
							The <code>readonly</code> and <code>disabled</code> properties can be set to <strong>true</strong> to make
							the <strong>Switch</strong> readonly/disabled.
						</p>
						<p>
							The <code>info</code>, <code>error</code>, and <code>warning</code> properties can be set to{" "}
							<strong>true</strong> to add different styles to the <strong>Switch</strong>.
						</p>
						<p>
							Likewise, the <code>errorMessage</code>, <code>warningMessage</code>, and <code>infoMessage</code>{" "}
							properties can be used to display different messages (one or multiple messages can be shown at once).
						</p>
					</>
				),
				content: <StatesAndMessagesSwitch />,
				code: { name: "states-and-messages.tsx", code: statesAndMessagesCode }
			},
			{
				label: "Add-ons and Tooltips",
				description: (
					<>
						<p>
							Both <code>addOnAfter</code> and <code>tooltips</code> can be used to add additional information. The
							difference between the two properties is that <code>addOnAfter</code> adds information after the switch
							input, while <code>tooltips</code> adds the additional content below the label.
						</p>
						<p>
							Regardless of which of these properties you use, it's always important to keep{" "}
							<strong>accessibility</strong> in mind. For that reason, remember to add the ids of the tooltips or
							add-ons to the <code>ariaDescribedby</code> property so that screen readers can read them.
						</p>
					</>
				),
				content: <AddonsAndTooltipsSwitch />,
				code: { name: "addons-and-tooltips.tsx", code: addonsAndTooltipsCode }
			},
			{
				label: "Label Position",
				description: (
					<p>
						By default, the label is displayed above the switch. You can change its position using the{" "}
						<code>labelPosition</code> property, which accepts <b>top</b> (default), <b>left</b>, <b>right</b>, or{" "}
						<b>bottom</b>.
					</p>
				),
				content: <LabelPositionSwitch />,
				code: { name: "label-position.tsx", code: labelPositionCode }
			}
		]
	}
];

export default {
	label: "Switch",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: SwitchAPI }],
		themingConfiguration: "switch"
	}
};
