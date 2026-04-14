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

import FilterAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/faceted-search/main/filter/filter.api.json" with { type: "json" };
import FilterBarAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/faceted-search/main/filter-bar/filter-bar.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";

import { BasicFilterBarShowcase } from "./basic.js";

import basicFilterBarShowcaseCode from "!./basic.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Filter Bar",
		sections: [
			{
				description: {
					info: (
						<div>
							<p>
								The <strong>Filter Bar</strong> Widget is designed to group the <strong>Filter</strong> elements that
								represents the faceted search settings.
								<br />
								In cases where the width of the parent element is defined, the <strong>Filter Bar</strong> will truncate
								its <strong>Filter</strong> elements into new rows to fit the parent's width. When the total height of
								those rows exceeds the pre-defined height of the <strong>Filter Bar</strong>, it will display a toggle
								button at the bottom-right for you to expand/collapse the <strong>Filter</strong> elements.
							</p>
							<p>
								You can specify whether the <strong>Filter Bar</strong> is collapsed initially by using the{" "}
								<code>initiallyCollapsed</code> property. By default, this property is set to <strong>false</strong>.
							</p>
							<p>
								The <strong>Filter</strong> widget requires the <code>name</code> property to display the name of the
								filter. Potential filtering options can be shown by passing them to the <code>options</code> property.
								By default, options will be separated by the "," mark. You can customize this separator by using the{" "}
								<code>separator</code> property.
							</p>
							<p>
								This example shows the <strong>Filter Bar</strong> widget wrapping most of the variants and
								customizations of the <strong>Filter</strong> widget.
							</p>
						</div>
					),
					note: (
						<p>
							To fully support accessibility, each <strong>Filter</strong> should have its own <code>id</code>. It will
							be used to generate IDs for inner elements; such as the name, action button, etc. These IDs will be linked
							to the <strong>aria-labelledby</strong> attribute, allowing screen readers to provide complete information
							to users.
							<br />
							For example: Indicate which <strong>Filter</strong> the action button belongs to when it receives focus.
						</p>
					)
				},
				content: <BasicFilterBarShowcase />,
				useDarkBackground: true,
				code: {
					name: "basic.tsx",
					code: basicFilterBarShowcaseCode
				}
			}
		]
	}
];
export default {
	label: "Filter Bar",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: FilterBarAPI }, { declaration: FilterAPI }],
		themingConfiguration: ["filterBar", "filter"]
	}
};
