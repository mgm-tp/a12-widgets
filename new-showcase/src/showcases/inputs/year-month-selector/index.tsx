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

import YearMonthSelectorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/year-month-selector/year-month-selector.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../../helpers/showcase-styles.js";

import { YearMonthSelectorExample } from "./year-month-selector.js";
import { YearMonthSelectorWithDifferentLocale } from "./with-different-locale.js";
import { YearMonthSelectorWithCustomMonths } from "./year-month-selector-with-custom-months.js";
import { YearMonthSelectorWithOptionalValue } from "./optional-value.js";

import basicCode from "!./year-month-selector.tsx?raw";
import withDifferentLocale from "!./with-different-locale.tsx?raw";
import withCustomMonths from "!./year-month-selector-with-custom-months.tsx?raw";
import withOptionalValue from "!./optional-value.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Year and Month Selector",
		description: (
			<>
				<p>
					The <strong>Year Month Selector</strong> is a combination of the <strong>MonthSelector</strong> and the{" "}
					<strong>YearSelector</strong> Widgets that allows users to select both a month and a year.
				</p>
				<p>
					The <strong>Year Month Selector</strong> uses the <strong>Select</strong> Widget, therefore it inherits some
					general features from the <strong>Select</strong> such as states, messages, helper text, etc. Visit the{" "}
					<Link href="#/widgets/data-entry/select">Select</Link> showcase to see these common features demoed.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							The <strong>Year Month Selector</strong> provides the <code>onValueChange</code> property to handle the
							selected value and you can set it to the <code>year</code> and the <code>month</code> properties to be
							displayed.
						</p>
						<p>
							To support <strong>accessibility</strong>, use the <code>hiddenLabels</code> property to set the hidden
							label for each selector.
						</p>
					</>
				),
				content: <YearMonthSelectorExample />,
				code: { name: "year-month-selector.tsx", code: basicCode }
			},
			{
				label: "Locale",
				description: (
					<p>
						The entries will be displayed in the given <code>locale</code>.
					</p>
				),
				content: <YearMonthSelectorWithDifferentLocale />,
				code: { name: "with-different-locale.tsx", code: withDifferentLocale }
			},
			{
				label: "Custom Months",
				description: (
					<p>
						Use the <code>months</code> property to customize the name of the months.
					</p>
				),
				content: <YearMonthSelectorWithCustomMonths />,
				code: { name: "year-month-selector-with-custom-months.tsx", code: withCustomMonths }
			},
			{
				label: "Optional Values",
				description: (
					<>
						<p>
							Use the <code>optionalYearItem</code> property and/or the <code>optionalMonthItem</code> property to add
							an item to the corresponding selector. It will return an <code>undefined</code> value if selected.
						</p>
					</>
				),
				content: <YearMonthSelectorWithOptionalValue />,
				code: { name: "optional-value.tsx", code: withOptionalValue }
			}
		]
	}
];

export default {
	label: "Year/Month Selector",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: YearMonthSelectorAPI }],
		themingConfiguration: "yearMonthSelector",
		inheritedThemeConfigurationNote: (
			<p>
				Since the <strong>Year Month Selector</strong> is a combination of the <strong>Year Selector</strong> and{" "}
				<strong>Month Selector</strong>, it inherits the style configurations of our{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/select#select-theme-configuration">Select</StyledShowcaseLink>{" "}
				widget.
			</p>
		)
	}
};
