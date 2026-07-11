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

import { FilterSelector } from "./filter-selector.js";

import filterSelectorCode from "!./filter-selector.tsx?raw";
import filterBarCode from "!./filter/filter-bar.tsx?raw";
import filterPaneContentCode from "!./filter/filter-pane-content.tsx?raw";
import filterContextCode from "!./filter/filter-context.tsx?raw";
import filterConfigurationCode from "!./filter/filter-configuration.tsx?raw";
import filterItemActionsCode from "!./filter/filter-item-actions.tsx?raw";
import filterOptionsCode from "!./filter/filter-options.tsx?raw";
import filterStyledCode from "!./filter/filter.styled.tsx?raw";
import sharedFilterSectionsCode from "!./filter/shared-filter-sections.tsx?raw";
import filterDataCode from "!./filter/data.tsx?raw";
import filterTypeCode from "!./filter/type.ts?raw";

const showcases: Showcase[] = [
	{
		label: "Filter Selector Example",
		description: (
			<p>
				This example shows a fully interactive <b>Filter Selector</b> integrated as a side panel of the{" "}
				<b>Content Box</b>. Filters are managed through a <b>Filter Bar</b> and a collapsible filter pane that supports
				apply, reset and live-filter actions. The panel starts in <strong>docked</strong> mode — pinned alongside the
				content — and can be switched to <strong>overlay</strong> mode via the pin control inside the panel header.
			</p>
		),
		sections: [
			{
				content: <FilterSelector title="Overview with Filter Selector" />,
				code: [
					{ name: "filter-selector.tsx", code: filterSelectorCode },
					{ name: "filter/filter-bar.tsx", code: filterBarCode },
					{ name: "filter/filter-pane-content.tsx", code: filterPaneContentCode },
					{ name: "filter/filter-context.tsx", code: filterContextCode },
					{ name: "filter/filter-configuration.tsx", code: filterConfigurationCode },
					{ name: "filter/filter-item-actions.tsx", code: filterItemActionsCode },
					{ name: "filter/filter-options.tsx", code: filterOptionsCode },
					{ name: "filter/filter.styled.tsx", code: filterStyledCode },
					{ name: "filter/shared-filter-sections.tsx", code: sharedFilterSectionsCode },
					{ name: "filter/data.tsx", code: filterDataCode },
					{ name: "filter/type.ts", code: filterTypeCode }
				],
				useDarkBackground: true
			}
		],
		featuredWidgets: [
			{
				name: "Content Box",
				url: "#/widgets/layout/content-box",
				description: "is the container for the Filter Selector side panel."
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
	label: "Filter Selector Example",
	structure: showcases,
	useFullPageLayout: true
};
