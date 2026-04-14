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

import YearSelectorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/year-month-selector/year-selector.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../../helpers/showcase-styles.js";

import { CustomYearRangeSelectorExample } from "./custom-year-range-selector.js";
import { BasicYearSelector } from "./basic.js";
import { YearSelectorWithOptionalValue } from "./optional-value.js";

import customYearRangeCode from "!./custom-year-range-selector.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import withOptionalValueCode from "!./optional-value.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Year Selector",
		description: (
			<>
				<p>
					The <strong>Year Selector</strong> Widget is an input component that allows users to select a year.
				</p>
				<p>
					The <strong>Year Selector</strong> uses the <strong>Select</strong> Widget, therefore it inherits some general
					features from the <strong>Select</strong> such as states, messages, helper text, etc. Visit the{" "}
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
							The <strong>YearSelector</strong> widget provides the <code>onYearChange</code> property to handle the
							selected year and set it to the <code>year</code> property to be displayed.
						</p>
						<p>
							The recommended way of hiding the label while still supporting <strong>accessibility</strong> is to set{" "}
							<code>hideLabel</code> to <strong>true</strong> while still passing a descriptive label text to the{" "}
							<code>label</code> property.
						</p>
					</>
				),
				content: <BasicYearSelector />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Custom Range",
				content: <CustomYearRangeSelectorExample />,
				description: (
					<p>
						By default, the range starts from <code>(current year - 6)</code> to <code>(current year + 7)</code>. Use{" "}
						<code>yearRange</code> to customize the range.
					</p>
				),
				code: { name: "custom-year-range-selector.tsx", code: customYearRangeCode }
			},
			{
				label: "Optional Value",
				description: (
					<p>
						Use the <code>optionalItem</code> property to set it as the first item of the YearSelector. It will return
						an <code>undefined</code> value if selected.
					</p>
				),
				content: <YearSelectorWithOptionalValue />,
				code: { name: "optional-value.tsx", code: withOptionalValueCode }
			}
		]
	}
];

export default {
	label: "Year Selector",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: YearSelectorAPI }],
		themingConfiguration: "yearSelector",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Year Selector</strong> does not have its own theme variables. Instead, it uses and inherits the
				style configuration of our{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/select#select-theme-configuration">Select</StyledShowcaseLink>{" "}
				widget.
			</p>
		)
	}
};
