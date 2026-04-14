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

import CheckboxAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/checkbox/main/checkbox.api.json" with { type: "json" };
import CheckboxGroupAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/checkbox-group/main/checkbox-group.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";

import { CheckboxBasicShowcase } from "./checkbox-basic.js";
import { CheckboxStatesShowcase } from "./checkbox-states.js";
import { DefaultCheckboxGroupShowcase } from "./checkbox-group.js";
import { IndeterminateCheckboxShowcase } from "./indeterminate.js";
import { HelperTextCheckboxesShowcase } from "./helper-text.js";
import { CheckboxWithA11yShowcase } from "./accessibility.js";

import basicCode from "!./checkbox-basic.tsx?raw";
import statesCode from "!./checkbox-states.tsx?raw";
import defaultGroupCode from "!./checkbox-group.tsx?raw";
import indeterminateCode from "!./indeterminate.tsx?raw";
import helperTextCheckboxesCode from "!./helper-text.tsx?raw";
import withA11yCode from "!./accessibility.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Checkbox",
		description: (
			<p>
				The <strong>Checkbox</strong> Widget is an input component that allows the user to make a binary choice.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <CheckboxBasicShowcase />,
				description: (
					<p>
						By default, a <strong>Checkbox</strong> includes a checkbox and label. Additionally, you can use the{" "}
						<code>labelGraphic</code> property to add an extra graphic, which appears to the left of the label.
					</p>
				),
				code: { name: "checkbox-basic.tsx", code: basicCode }
			},
			{
				label: "States",
				content: <CheckboxStatesShowcase />,
				description: (
					<>
						<p>
							There are five <strong>Checkbox</strong> variants besides the default: <code>info</code>,{" "}
							<code>warning</code>, <code>error</code>, <code>readonly</code> and <code>disabled</code>.
						</p>
						<p>
							Having <code>infoMessage</code>, <code>warningMessage</code>, and <code>errorMessage</code> properties
							will display along a message for the corresponding state.
						</p>
					</>
				),
				code: { name: "checkbox-states.tsx", code: statesCode }
			},
			{
				label: "Checkbox Group",
				content: <DefaultCheckboxGroupShowcase />,
				description: (
					<>
						<p>
							The <strong>CheckboxGroup</strong> is used to group together a set of <strong>Checkbox</strong>. It also
							supports the <code>labelGraphic</code> property, allowing you to add an extra graphic to the main label
							group.
						</p>
						<p>
							To display all Checkboxes in CheckboxGroup on one line, set the <code>inline</code> property to true.
						</p>
					</>
				),
				code: { name: "checkbox-group.tsx", code: defaultGroupCode }
			},
			{
				label: "Indeterminate",
				content: <IndeterminateCheckboxShowcase />,
				description: (
					<>
						<p>Indeterminate: This type of checkbox supports an additional third state known as partially checked.</p>
						<p>
							One common use of an indeterminate checkbox can be found where a single indeterminate checkbox is used to
							represent and control the state of an entire group of nested options. And, each option in the group can be
							individually turned on or off with a dual state checkbox (checked / unchecked).
						</p>
						<ul>
							<li>
								If all options in the group are checked, the overall state is represented by the indeterminate checkbox
								displaying as checked.
							</li>
							<li>
								If some of the options in the group are checked, the overall state is represented with the indeterminate
								checkbox displaying as partially checked.
							</li>
							<li>
								If none of the options in the group are checked, the overall state of the group is represented with the
								indeterminate checkbox displaying as not checked.
							</li>
						</ul>
						<p>The user can use the indeterminate checkbox to change all options in the group with a single action:</p>
						<ul>
							<li>Checking the overall checkbox checks all options in the group.</li>
							<li>Unchecking the overall checkbox will uncheck all options in the group.</li>
						</ul>
						<p>
							<strong>Checkbox.Indeterminate</strong> has all the Checkbox's properties with the same usage.
						</p>
					</>
				),
				code: { name: "indeterminate.tsx", code: indeterminateCode }
			},
			{
				label: "Helper Text",
				content: <HelperTextCheckboxesShowcase />,
				description: (
					<p>
						Use <code>helperText</code> property to display an additional text below the input.
					</p>
				),
				code: { name: "helper-text.tsx", code: helperTextCheckboxesCode }
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>
							The recommended way of hiding the label while still supporting <strong>accessibility</strong> is to set{" "}
							<code>hideLabel</code> to <strong>true</strong> while still passing a descriptive label text to the{" "}
							<code>label</code> property.
							<br />
							Also the <code>title</code> property should be set along with the hidden label.
						</p>
						<p>
							The <code>ariaControls</code> property should always be set for the{" "}
							<strong>Checkbox.Indeterminate</strong>.
							<br />
							Value of <code>ariaControls</code> has to contain the list of controlled checkbox ids. <br /> <br />
							For example:
							<br />
							<strong>Checkbox.Indeterminate</strong> controls 2 checkboxes: <strong>Apple</strong> (id is{" "}
							<em>apple</em>
							), and <strong>Pear</strong> (id is <em>pear</em>). Value of <code>ariaControls</code> should be{" "}
							<strong>"apple pear"</strong>.
						</p>
					</>
				),
				content: <CheckboxWithA11yShowcase />,
				code: { name: "accessibility.tsx", code: withA11yCode }
			}
		]
	}
];

export default {
	label: "Checkbox",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				name: "Checkbox",
				declaration: CheckboxAPI,
				filter: ["CheckboxProps", "IndeterminateCheckboxProps"]
			},
			{
				name: "Checkbox Group",
				declaration: CheckboxGroupAPI
			}
		],
		themingConfiguration: "checkbox"
	}
};
