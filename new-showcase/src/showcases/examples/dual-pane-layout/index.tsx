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

import type { Showcase } from "../../../helpers/definitions.js";

import { DualPaneLayoutExample } from "./dual-pane-layout.js";

import dualPaneLayoutCode from "!./dual-pane-layout.tsx?raw";
import embeddedContentBoxCode from "!./embedded-content-box.tsx?raw";
import tableDataCode from "!./table-data.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Dual Pane Layout",
		description: (
			<p>This example shows how you can create a Dual Pane Layout with the Available view and Selected view.</p>
		),
		sections: [
			{
				content: <DualPaneLayoutExample />,
				code: [
					{ name: "dual-pane-layout.tsx", code: dualPaneLayoutCode },
					{ name: "embedded-content-box.tsx", code: embeddedContentBoxCode },
					{ name: "table-data.tsx", code: tableDataCode }
				],
				useDarkBackground: true,
				fitToSection: true
			}
		],
		featuredWidgets: [
			{
				name: "Layout Grid",
				url: "#/widgets/layout/layout-grid",
				description: "divides content into Available view and Selected view."
			},

			{
				name: "Content Box",
				url: "#/widgets/layout/content-box",
				description: "is the container for every pane."
			},
			{
				name: "Table",
				url: "#/widgets/data-display/table",
				description: "displays data in every pane."
			},
			{
				name: "Filter Selector",
				url: "#/widgets/business-case/faceted-search/filter-selector",
				description: "used along with Filter Bar to visualize the faceted search."
			},
			{
				name: "Filter Bar",
				url: "#/widgets/business-case/faceted-search/filter-bar"
			}
		]
	}
];

export default {
	label: "Dual Pane Layout Example",
	structure: showcases,
	useFullPageLayout: true
};
