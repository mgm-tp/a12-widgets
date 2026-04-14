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

import PaginationAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/pagination/main/pagination.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { BasicPaginationShowcase } from "./basic.js";
import { SimplePaginationShowcase } from "./simple.js";
import { AlignmentPaginationShowcase } from "./alignment.js";

import basicCode from "!./basic.tsx?raw";
import simpleCode from "!./simple.tsx?raw";
import alignmentCode from "!./alignment.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Pagination",
		description: (
			<p>
				The <strong>Pagination</strong> Widget allows users to select a specific page from a range of pages.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicPaginationShowcase />,
				description: (
					<>
						<p>
							The <code>Pagination</code> requires the following properties:
						</p>
						<ul>
							<li>
								<code>pageCount</code>: The total number of pages
							</li>
							<li>
								<code>currentPage</code>: The currently selected page
							</li>
							<li>
								<code>onPageChanged</code>: The method to call when user change the page
							</li>
							<li>
								<code>pageLabelTemplate</code>: Define how the label is displayed. In this example, this property is set
								as <code>{"{page} of {total}"}</code>.
							</li>
						</ul>
					</>
				),
				code: { name: "basic.tsx", code: basicCode },
				useConfiguration: true
			},
			{
				label: "Alignment",
				content: <AlignmentPaginationShowcase />,
				description: (
					<p>
						By using the <code>alignment</code> property, you can make the <code>Pagination</code> float{" "}
						<code>left</code> or <code>right</code>.
					</p>
				),
				code: { name: "alignment.tsx", code: alignmentCode }
			},
			{
				label: "Simple Variant",
				content: <SimplePaginationShowcase />,
				description: (
					<p>
						This example shows the <code>Pagination</code> when the <code>type</code> property is set to{" "}
						<code>simple</code>. It is recommended for using in a dark background.
					</p>
				),
				code: { name: "simple.tsx", code: simpleCode }
			}
		]
	}
];

export default {
	label: "Pagination",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: PaginationAPI }],
		themingConfiguration: "pagination",
		inheritedThemeConfigurationNote: (
			<p>
				Since the <strong>Pagination</strong> is a combination of the{" "}
				<StyledShowcaseLink href="#/widgets/general/buttons/button#buttons-theme-configuration">
					Button
				</StyledShowcaseLink>{" "}
				and{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/select#select-theme-configuration">Select</StyledShowcaseLink>{" "}
				widgets, it inherits the style configurations of those components.
			</p>
		)
	}
};
