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

import SelectAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/select/main/select.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { BasicSelect } from "./native-select/basic.js";
import { AdditionalCustomizations } from "./native-select/additional-customizations.js";
import { StatesAndMessagesSelect } from "./native-select/states-and-messages.js";
import { BasicCustomSelect } from "./custom-select/basic.js";

import basicSelectCode from "!./native-select/basic.tsx?raw";
import additionalCustomizationsCode from "!./native-select/additional-customizations.tsx?raw";
import statesAndMessagesCode from "!./native-select/states-and-messages.tsx?raw";
import basicCustomSelectCode from "!./custom-select/basic.tsx?raw";
import dataCode from "!./data.ts?raw";

const showcases: Showcase[] = [
	{
		label: "Select",
		description: (
			<p>
				The <strong>Select</strong> Widget is used to render a native browser select element, which allows the user to
				select one item from a dropdown. The available options can be passed in via the
				<code>items</code> property. After the user selects a value, the function passed to <code>onValueChanged</code>{" "}
				will run and it can be used to set the <code>value</code> property.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicSelect />,
				code: [
					{ name: "basic.tsx", code: basicSelectCode },
					{ name: "data.tsx", code: dataCode }
				],
				description: (
					<>
						<p>
							You can use the <code>labelGraphic</code> property to add a graphic before the label text.
						</p>
					</>
				)
			},
			{
				label: "States & Messages",
				content: <StatesAndMessagesSelect />,
				code: [
					{ name: "states-and-messages.tsx", code: statesAndMessagesCode },
					{ name: "data.tsx", code: dataCode }
				],
				description: (
					<>
						<p>
							The <code>errorMessage</code>, <code>warningMessage</code>, and <code>infoMessage</code> properties can be
							used to modify the state of the <strong>Select</strong> and display different messages (one or multiple
							messages can be shown at once).
						</p>
						<p>
							If you'd like to alter the state/styles of the Select without displaying any messages, you can use the{" "}
							<code>info</code>, <code>error</code>, and <code>warning</code> properties.
						</p>
						<p>
							Do note, that if you use one of the props that display a message, you don't need to use its accompanying
							state property. For example, if you display a message using <code>errorMessage</code>, error state/styles
							are applied automatically and the <code>error</code> property becomes unnecessary.
						</p>
						<p>
							If the dropdown contains an empty value item through <code>isEmptyValue</code> property, that item will be
							shown with specific styling in select input.
						</p>
						<p>
							In addition, the <code>disabled</code> and <code>readonly</code> properties can be used to make the entire{" "}
							<strong>Select</strong> disabled or read-only. It's also possible to disable individual items by setting
							the <code>disabled</code> property of an item to <strong>true</strong>.
						</p>
					</>
				)
			},
			{
				label: "Additional Customizations",
				content: <AdditionalCustomizations />,
				code: [
					{
						name: "additional-customizations.tsx",
						code: additionalCustomizationsCode
					},
					{ name: "data.tsx", code: dataCode }
				],
				description: (
					<>
						<p>
							The Select's items can have <code>children</code>. This allows you to easily organize related items into
							option groups.
						</p>
						<p>
							The <code>tooltips</code> and <code>helperText</code> properties can be used to provide users with
							additional information. If you do use tooltips, it's recommended to ensure accessibility by adding the ids
							of the tooltips to the <code>ariaDescribedby</code> property so that screen readers can read them.
						</p>
						<p>
							If you'd like to remove information rather than add it, it's possible to hide the label while still
							following <strong>accessibility</strong> best practices. The recommended way of doing so is by setting{" "}
							<code>hideLabel</code> to true while still passing a descriptive label text to the <code>label</code>{" "}
							property.
						</p>
						<p>
							Items inside of the <strong>Select</strong> are displayed vertically by default. If you'd prefer they
							display horizontally, you can configure the <code>Select</code> to use <code>horizontalMode</code>.
						</p>
						<p>
							Items can also be configured to display graphics. The graphics will appear alongside the text in vertical
							mode, or above the text in horizontal mode (
							<Link href="#/widgets/navigation/dropdown#items-with-graphic">just like the Dropdown widget</Link>).
						</p>
					</>
				)
			},
			{
				label: "Custom Select",
				content: <BasicCustomSelect />,
				code: [
					{ name: "index.tsx", code: basicCustomSelectCode },
					{ name: "data.tsx", code: dataCode }
				],
				description: (
					<>
						<p>
							While our standard <strong>Select</strong> Widget is simpler, it's possible that sometimes you'll need
							more control over customizations than it offers. When this is the case, we recommend using our{" "}
							<strong>CustomSelect</strong> widget.
						</p>
						<p>
							There's two different ways to use our <strong>CustomSelect</strong>. The first is to convert a standard{" "}
							<strong>Select</strong> into a <strong>CustomSelect</strong> by setting the <code>useCustomView</code>{" "}
							property to <code>true</code>. Perhaps even easier, however, is to just use the{" "}
							<strong>CustomSelect</strong> component directly.
						</p>
						<p>
							One thing to note while using the <strong>CustomSelect</strong> is that it's styled a bit differently than
							our standard <strong>Select</strong>. While the differences are subtle, it's worth keeping in mind so that
							your app can maintain a consistent UI.
						</p>
						<p>
							To open the modal on <strong>mobile</strong> or the dropdown on <strong>desktop</strong>, you can press
							the <strong>ENTER</strong>, <strong>SPACE</strong>, <strong>DOWN ARROW</strong>, or{" "}
							<strong>UP ARROW</strong> keys. To close the modal/dropdown you can press the <strong>ESC</strong> key on
							mobile or the <strong>ESC/TAB</strong> keys on desktop.
						</p>
						<p>
							In addition, similar to the standard{" "}
							<Link href="#/widgets/data-entry/select#additional-customizations">Select</Link> widget, the{" "}
							<strong>CustomSelect</strong> can also use option groups to group related items.
						</p>
						<p>
							Furthermore, it's also possible to override those open/close command keys by using the{" "}
							<code>keysToOpen</code> and <code>keysToClose</code> props. In the showcase below, you can use the{" "}
							<strong>CTRL</strong> key for opening, and the <strong>DELETE</strong> or <strong>BACKSPACE</strong> keys
							for closing.
						</p>
						<p>
							Lastly, if the dropdown contains an empty value item through <code>isEmptyValue</code> property, that item
							will be shown with specific styling in both dropdown and select input.
						</p>
					</>
				)
			}
		]
	}
];

export default {
	label: "Select",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: SelectAPI }],
		themingConfiguration: "select",
		inheritedThemeConfigurationNote: (
			<p>
				Since the <strong>Custom Select</strong> has a{" "}
				<StyledShowcaseLink href="#/widgets/navigation/dropdown#dropdown-theme-configuration">
					Dropdown
				</StyledShowcaseLink>{" "}
				widget, it inherits the style configuration of that component.
			</p>
		)
	}
};
