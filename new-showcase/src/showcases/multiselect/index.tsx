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

import MultiselectAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/multiselect/main/multiselect.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { BasicMultiselect } from "./basic.js";
import { AdditionalCustomizationsMultiselect } from "./additional-customizations.js";
import { MessagesMultiselect } from "./messages.js";
import { HideSelectAllOption } from "./hide-select-all-option.js";

import basicCode from "!./basic.tsx?raw";
import additionalCustomizationsCode from "!./additional-customizations.tsx?raw";
import messagesCode from "!./messages.tsx?raw";
import dataCode from "!./data.ts?raw";
import hideSelectAllOptionCode from "!./hide-select-all-option.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Multiselect",
		description: (
			<>
				<p>
					The <strong>Multiselect</strong> Widget is an input component that allows users to choose multiple items from
					a list.
				</p>
				<p>
					It uses the <strong>Text Field</strong>, therefore it also inherits some general features from the Text Field
					such as states, messages, helper text,... Visit the&nbsp;
					<Link href="#/widgets/data-entry/text-field">showcase</Link> to see more behaviors.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicMultiselect />,
				description: (
					<>
						<p>
							By default, the list of items will be opened when the input is focused on. To prevent this behavior, you
							can set the <code>openOnFocus</code> property to <code>false</code>.
						</p>
						<p>
							You can use the <code>labelGraphic</code> property to add a graphic before the label text.
						</p>
						<p>
							The <code>disabled</code> and <code>readonly</code> properties can be used to disable the Multiselect or
							make it readonly.
						</p>
					</>
				),
				code: [
					{ name: "basic.tsx", code: basicCode },
					{ name: "data.ts", code: dataCode }
				]
			},
			{
				label: "Hide the Select All option",
				content: <HideSelectAllOption />,
				description: (
					<>
						<p>
							As demonstrated in <Link href="#/widgets/data-entry/multiselect#basic">Basic</Link>, the select all items
							option is visible by default. However, you can disable it by setting the{" "}
							<code>enableSelectAllOption</code> to <strong>false</strong>. It is recommended to use this property when
							the Multiselect enforces a limit on how many items can be selected.
						</p>
						<p>
							In the showcase below, the <strong>All</strong> option is not displayed and you can select up to 3 items.
						</p>
					</>
				),
				code: [
					{ name: "hide-select-all-option.tsx", code: hideSelectAllOptionCode },
					{ name: "data.ts", code: dataCode }
				]
			},
			{
				label: "Messages",
				content: <MessagesMultiselect />,
				description: (
					<p>
						Different types of messages can be shown by using the various message properties: <code>infoMessage</code>,{" "}
						<code>errorMessage</code>, and <code>warningMessage</code>. A single message or multiple can be shown based
						on your use case.
					</p>
				),
				code: [
					{ name: "messages.tsx", code: messagesCode },
					{ name: "data.ts", code: dataCode }
				]
			},
			{
				label: "Additional Customizations",
				content: <AdditionalCustomizationsMultiselect />,
				description: (
					<>
						<p>
							You can use <code>tooltips</code> or <code>helperText</code> to provide users with additional information.
						</p>
						<p>
							To simplify the appearance of the Multiselect, it's also possible to hide the label. The recommended way
							of doing this to support <strong>accessibility</strong> is to set <code>hideLabel</code> to true while
							still passing a descriptive label text to the <code>label</code> property.
						</p>
					</>
				),
				code: [
					{ name: "additional-customizations.tsx", code: additionalCustomizationsCode },
					{ name: "data.ts", code: dataCode }
				],
				toggleBetweenPartialAndFullCode: true
			}
		]
	}
];

export default {
	label: "Multiselect",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: MultiselectAPI }],
		themingConfiguration: "multiselect",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Multiselect</strong> includes a{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/text-field#text-field-theme-configuration">
					Text Field
				</StyledShowcaseLink>{" "}
				and a{" "}
				<StyledShowcaseLink href="#/widgets/navigation/dropdown#dropdown-theme-configuration">
					Dropdown
				</StyledShowcaseLink>{" "}
				that contains{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/checkbox#checkbox-theme-configuration">
					Checkbox
				</StyledShowcaseLink>{" "}
				options, therefore it inherits the style configurations of those components.
			</p>
		)
	}
};
