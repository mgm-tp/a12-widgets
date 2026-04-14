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

import { DetermineLocation } from "./determine-location.js";

import determineLocationCode from "!./determine-location.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Determine Location",
		description: <p>This example shows how to determine the location of a business object within a hierarchy.</p>,
		sections: [
			{
				content: <DetermineLocation />,
				code: { name: "determine-location.tsx", code: determineLocationCode },
				useDarkBackground: true
			}
		],
		featuredWidgets: [
			{
				name: "Content Box",
				url: "#/widgets/layout/content-box",
				description:
					"used to structure content with Tree which displays data, Action Bar which contains Search component."
			},
			{
				name: "Tree",
				url: "#/widgets/data-display/tree",
				description: "displays hierarchical node data with Selectable/Insertable/Collapsible abilities."
			},
			{
				name: "Modal Overlay",
				url: "#/widgets/layout/modal-overlay",
				description: "used to require information inputting for new node."
			},
			{
				name: "Autocomplete",
				url: "#/widgets/data-entry/autocomplete",
				description: "used along with Dropdown to support searching Tree node."
			}
		]
	}
];

export default {
	label: "Determine Location",
	structure: showcases
};
