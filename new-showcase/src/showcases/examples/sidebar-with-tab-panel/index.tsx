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

import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";

import { SidebarWithTabPanel } from "./sidebar-with-tab-panel.js";

import sidebarWithTabPanelCode from "!./sidebar-with-tab-panel.tsx?raw";
import tabPanelCode from "!./tab-panel.tsx?raw";
import tabPanelContentCode from "!./tab-panel-content.tsx?raw";
import dataCode from "!./data.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Sidebar with Tab Panel Example",
		description: (
			<p>
				This is an example that shows how to combine the{" "}
				<Link href="#/examples/master-detail">Master Detail Example</Link> with the{" "}
				<Link href="#/widgets/navigation/tab-panel">Tab Panel</Link> Widget.
			</p>
		),
		sections: [
			{
				content: <SidebarWithTabPanel />,
				code: [
					{ name: "sidebar-with-tab-panel.tsx", code: sidebarWithTabPanelCode },
					{ name: "tab-panel.tsx", code: tabPanelCode },
					{ name: "tab-panel-content.tsx", code: tabPanelContentCode },
					{ name: "data.tsx", code: dataCode }
				],
				useDarkBackground: true
			}
		],
		featuredWidgets: [
			{
				name: "Master Detail",
				url: "#/widgets/layout/master-detail",
				description: "responsive layout containing Master view and Detail view."
			},
			{
				name: "Tab Panel",
				url: "#/widgets/navigation/tab-panel",
				description: "displays tabs and their corresponding content."
			},
			{
				name: "Table",
				url: "#/widgets/data-display/table",
				description: "displays data from the Overview area."
			},
			{
				name: "Filter Selector",
				url: "#/widgets/business-case/faceted-search/filter-selector",
				description: "used along with Filter Bar to support searching data in the Overview area."
			},
			{
				name: "Filter Bar",
				url: "#/widgets/business-case/faceted-search/filter-bar"
			}
		]
	}
];

export default {
	label: "Sidebar with Tab Panel Example",
	structure: showcases,
	useFullPageLayout: true
};
