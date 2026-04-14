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

import { MasterDetailExample } from "./master-detail.js";

import masterDetailCode from "!./master-detail.tsx?raw";
import masterViewCode from "!./master-view.tsx?raw";
import masterDetailTemplateCode from "!./master-detail-template.tsx?raw";
import overviewCode from "!./overview.tsx?raw";
import setupCode from "!./setup.tsx?raw";
import filterSelectorCommonCode from "!./filter-selector/common.tsx?raw";
import filterSelectorDataCode from "!./filter-selector/data.tsx?raw";
import filterSelectorDateInputCode from "!./filter-selector/date-input.tsx?raw";
import filterSelectorFilterBarCode from "!./filter-selector/filter-bar.tsx?raw";
import filterSelectorCode from "!./filter-selector/filter-selector.tsx?raw";
import filterSelectorViewCode from "!./filter-selector/filter-view.tsx?raw";
import filterSelectorUseTimepickerPropsCode from "!./filter-selector/use-time-picker-props.tsx?raw";
import filterSelectorUtilsCode from "!./filter-selector/utils.tsx?raw";
import contentBoxWrapperAPICode from "!./showcase-content-box-wrapper.api.ts?raw";

const showcases: Showcase[] = [
	{
		label: "Master Detail Example",
		description: (
			<p>
				This example shows how you can customize the <Link href="#/widgets/layout/master-detail">Master Detail</Link>{" "}
				Widget in advance. You can click to each row to see the Detail pane.
			</p>
		),
		sections: [
			{
				content: <MasterDetailExample />,
				code: [
					{ name: "master-detail.tsx", code: masterDetailCode },
					{ name: "master-view.tsx", code: masterViewCode },
					{ name: "master-detail-template.tsx", code: masterDetailTemplateCode },
					{ name: "overview.tsx", code: overviewCode },
					{ name: "setup.tsx", code: setupCode },
					{ name: "filter-selector/common.tsx", code: filterSelectorCommonCode },
					{ name: "filter-selector/data.tsx", code: filterSelectorDataCode },
					{ name: "filter-selector/date-input.tsx", code: filterSelectorDateInputCode },
					{ name: "filter-selector/filter-bar.tsx", code: filterSelectorFilterBarCode },
					{ name: "filter-selector/filter-selector.tsx", code: filterSelectorCode },
					{ name: "filter-selector/filter-view.tsx", code: filterSelectorViewCode },
					{
						name: "filter-selector/use-time-picker-props.tsx",
						code: filterSelectorUseTimepickerPropsCode
					},
					{ name: "filter-selector/utils.tsx", code: filterSelectorUtilsCode },
					{ name: "showcase-content-box-wrapper.api.ts", code: contentBoxWrapperAPICode }
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
				name: "Table",
				url: "#/widgets/data-display/table",
				description: "to display data from Master view."
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
	label: "Master Detail Example",
	structure: showcases,
	useFullPageLayout: true
};
