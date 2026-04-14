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

import { StylingInTree } from "./styling-in-tree.js";

import stylingInTreeCode from "!./styling-in-tree.tsx?raw";
import dataCode from "!./data.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Styling In Tree",
		description: (
			<p>
				This is an example that shows how you can customize the style of the{" "}
				<Link href="#/widgets/data-display/tree">Tree</Link> Widget with Selectable/Collapsible abilities.
			</p>
		),
		sections: [
			{
				content: <StylingInTree />,
				code: [
					{ name: "styling-in-tree.tsx", code: stylingInTreeCode },
					{ name: "data.tsx", code: dataCode }
				],
				useDarkBackground: true
			}
		]
	}
];

export default {
	label: "Styling In Tree Example",
	structure: showcases,
	useFullPageLayout: true
};
