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

import FilterSelectorListAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/faceted-search/main/filter-selector/filter-selector.list-mode.api.json" with { type: "json" };
import FilterSelectorTemplateAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/faceted-search/main/filter-selector/tpl/filter-selector.tpl.api.json" with { type: "json" };
import FilterSelectorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/faceted-search/main/filter-selector/filter-selector.api.json" with { type: "json" };
import FilterSelectorMobileAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/faceted-search/main/filter-selector/filter-selector.mobile.api.json" with { type: "json" };
import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../../helpers/showcase-styles.js";

import { DockedFilterSelector } from "../filter-selector-new/docked-filter-selector.js";
import { OverlayFilterSelector } from "../filter-selector-new/overlay-filter-selector.js";

import { FilterSelectorShowcase } from "./showcase.js";

import filterSelectorShowcaseCode from "!./showcase.tsx?raw";
import filterSelectorCode from "!./filter-selector.tsx?raw";
import dataCode from "!./data.tsx?raw";
import templateCode from "!./template.tsx?raw";
import utilsCode from "!./utils.tsx?raw";
import filterSelectorDockedCode from "!../filter-selector-new/docked-filter-selector.tsx?raw";
import filterSelectorOverlayCode from "!../filter-selector-new/overlay-filter-selector.tsx?raw";
import filterSelectorSharedCode from "!../filter-selector-new/filter-selector-showcase-template.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Filter Selector",
		sections: [
			{
				label: "Docked Filter Selector",
				description: (
					<p>
						In <strong>docked</strong> mode the <b>Filter Selector</b> side panel is pinned alongside the content. For a
						fully interactive example with <b>Filter Bar</b> integration, see{" "}
						<Link href="#/examples/filter-selector">Examples &gt; Filter Selector</Link>.
					</p>
				),
				content: <DockedFilterSelector />,
				code: [
					{ name: "docked-filter-selector.tsx", code: filterSelectorDockedCode },
					{ name: "filter-selector-showcase-template.tsx", code: filterSelectorSharedCode }
				],
				useDarkBackground: true,
				fullSize: true,
				fitToSection: false
			},
			{
				label: "Overlay Filter Selector",
				description: (
					<p>
						In <strong>overlay</strong> mode the <b>Filter Selector</b> side panel floats on top of the content without
						reducing the main area width. For a fully interactive example with <b>Filter Bar</b> integration, see{" "}
						<Link href="#/examples/filter-selector">Examples &gt; Filter Selector</Link>.
					</p>
				),
				content: <OverlayFilterSelector />,
				code: [
					{ name: "overlay-filter-selector.tsx", code: filterSelectorOverlayCode },
					{ name: "filter-selector.tsx", code: filterSelectorSharedCode }
				],
				useDarkBackground: true,
				fullSize: true,
				fitToSection: false
			},
			{
				label: "Legacy Filter Selector",
				description: (
					<div>
						<p>
							<strong>Note:</strong> This is the legacy implementation of the Filter Selector. It uses the{" "}
							<code>FilterSelector</code> widget which renders the filter list and filter content side by side in a
							separate panel.
						</p>
						<p>
							The <b>Filter Selector</b> Widget is the container that visualizes the faceted search settings by
							displaying two content areas side by side:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								The left panel: contains a list of filters. You can set the filter lists by using the{" "}
								<code>activeFilters</code> and the <code>inactiveFilters</code> properties.
							</BulletList.Item>
							<BulletList.Item>
								The right panel: displays the filter's content. You can customize the content of each filter by using
								the <code>renderFilterView</code> property.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							On small views, you can use the <b>FilterSelectorMobile</b> widget to display filters in a modal.
						</p>
						<p>
							The following example shows the combination of the <b>FilterSelector</b> & <b>FilterBar</b>. You can also
							take a look at <Link href="#/examples/master-detail">Examples &gt; Master Detail</Link> for advanced
							customizations.
						</p>
					</div>
				),
				content: <FilterSelectorShowcase />,
				useDarkBackground: true,
				fitToSection: true,
				code: [
					{ name: "showcase.tsx", code: filterSelectorShowcaseCode },
					{ name: "filter-selector.tsx", code: filterSelectorCode },
					{ name: "data.tsx", code: dataCode },
					{ name: "template.tsx", code: templateCode },
					{ name: "utils.tsx", code: utilsCode }
				]
			}
		]
	}
];

export default {
	label: "Filter Selector",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: FilterSelectorListAPI },
			{ declaration: FilterSelectorTemplateAPI },
			{ declaration: FilterSelectorAPI },
			{ declaration: FilterSelectorMobileAPI }
		],
		themingConfiguration: "filterSelector",
		inheritedThemeConfigurationNote: (
			<p>
				The <b>Filter Selector</b> inherits the style configurations of several widgets:{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/checkbox#checkbox-theme-configuration">
					Checkbox
				</StyledShowcaseLink>
				, <StyledShowcaseLink href="#/widgets/data-display/list#list-theme-configuration">List</StyledShowcaseLink>,{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/text-field#text-field-theme-configuration">
					Text Field
				</StyledShowcaseLink>
				,{" "}
				<StyledShowcaseLink href="#/widgets/general/buttons/button#buttons-theme-configuration">
					Button
				</StyledShowcaseLink>
				.
			</p>
		)
	}
};
