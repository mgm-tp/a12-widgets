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

import AutocompleteAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/autocomplete/main/autocomplete.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../../helpers/showcase-styles.js";

import { AutocompleteAddingItemShowcase } from "./adding-item.js";
import { AutocompleteGroupedItemsShowcase } from "./grouped-items.js";
import { AutocompleteAsynchronousRequestsShowcase } from "./asynchronus-requests.js";
import { AutocompletePredefinedOptionsShowcase } from "./predefined-options.js";
import { AutocompleteWithLinkItemsShowcase } from "./with-link-items.js";
import { HideClearButtonShowcase } from "./hide-clear-button.js";

import addingItemsCode from "!./adding-item.tsx?raw";
import groupedItemsCode from "!./grouped-items.tsx?raw";
import asynchronousRequestsCode from "!./asynchronus-requests.tsx?raw";
import predefinedOptionsCode from "!./predefined-options.tsx?raw";
import withLinkItemsCode from "!./with-link-items.tsx?raw";
import hideClearButtonCode from "!./hide-clear-button.js?raw";
import dataCode from "!./data.ts?raw";

const showcases: Showcase[] = [
	{
		label: "Autocomplete",
		description: (
			<>
				<p>
					The <strong>Autocomplete</strong> Widget is an input component enhanced by a panel of suggested options and
					text autocompletion. The suggested options of an autocomplete could be a set of static data (see{" "}
					<Link href="#/widgets/data-entry/autocomplete#predefined-options">Predefined options</Link>) or dynamic data
					(see <Link href="#/widgets/data-entry/autocomplete#asynchronous-requests">Asynchronous requests</Link>
					).
				</p>
				<p>
					The <strong>Autocomplete</strong> was built on top of the <strong>Text Field</strong> and for this reason, it
					inherits several general features from the <strong>Text Field</strong> such as states, messages, helper text,
					etc. Visit the <Link href="#/widgets/data-entry/text-field">Text Field</Link> showcase to see these common
					features demoed.
				</p>
			</>
		),
		sections: [
			{
				label: "Predefined options",
				content: <AutocompletePredefinedOptionsShowcase />,
				description: (
					<>
						<p>
							In this showcase, the <strong>Autocomplete</strong> receives an array of predefined items as the source
							for autocompletion. When you start typing, the list will show matches that start with the typed input,
							sorted by alphabetical order, followed by the middle matches, un-ordered.
						</p>
						<p>
							You can also set a pre-selected value by <code>initialValue</code> property. When the input contains any
							text, the clear button appears to allow quick removal.
						</p>
					</>
				),
				code: [
					{ name: "predefined-options.tsx", code: predefinedOptionsCode },
					{ name: "data.tsx", code: dataCode }
				]
			},
			{
				label: "Hide the Clear Button",
				content: <HideClearButtonShowcase />,
				description: (
					<p>
						As demonstrated in{" "}
						<Link href="#/widgets/data-entry/autocomplete#predefined-options">Predefined options</Link>, the clear
						button is visible by default. However, you can disable it by setting <code>enableClearButton</code> to{" "}
						<strong>false</strong>.
					</p>
				),
				code: [
					{ name: "hide-clear-button.tsx", code: hideClearButtonCode },
					{ name: "data.tsx", code: dataCode }
				]
			},
			{
				label: "Grouped items",
				content: <AutocompleteGroupedItemsShowcase />,
				description: <p>You can group the options by nesting a set of options to one item as its children.</p>,
				code: { name: "grouped-items.tsx", code: groupedItemsCode }
			},
			{
				label: "Asynchronous requests",
				content: <AutocompleteAsynchronousRequestsShowcase />,
				description: (
					<p>
						The <strong>Autocomplete</strong> Widget provides a <code>loading</code> property for you to handle
						asynchronous cases such as loading items on open, or loading new items on search.
					</p>
				),
				code: [
					{ name: "asynchronus-requests.tsx", code: asynchronousRequestsCode },
					{
						name: "data.tsx",
						code: dataCode
					}
				]
			},
			{
				label: "Adding item",
				content: <AutocompleteAddingItemShowcase />,
				description: (
					<p>
						The <strong>Autocomplete</strong> Widget also allows to add new items to the list when having the{" "}
						<code>allowAddingNewItem</code> property. To differentiate between capital and lowercase letters of items'
						label, set <code>caseSensitive</code> to true.
					</p>
				),
				code: [
					{ name: "adding-item.tsx", code: addingItemsCode },
					{
						name: "data.tsx",
						code: dataCode
					}
				]
			},
			{
				label: "With Link Items",
				content: <AutocompleteWithLinkItemsShowcase />,
				description: (
					<p>
						The <strong>Autocomplete</strong> Widget also allows to add a list of{" "}
						<Link href="#/widgets/general/link">Link</Link> items to the list by using the <code>links</code> property.
					</p>
				),
				code: { name: "with-link-items.tsx", code: withLinkItemsCode }
			}
		]
	}
];

export default {
	label: "Autocomplete",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: AutocompleteAPI }],
		themingConfiguration: "autocomplete",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Autocomplete</strong> is a combination of the{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/text-field#text-field-theme-configuration">
					Text Field
				</StyledShowcaseLink>{" "}
				and{" "}
				<StyledShowcaseLink href="#/widgets/navigation/dropdown#dropdown-theme-configuration">
					Dropdown
				</StyledShowcaseLink>{" "}
				widgets, so it inherits the style configurations of those components.
			</p>
		)
	}
};
