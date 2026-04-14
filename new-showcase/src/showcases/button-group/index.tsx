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

import ButtonGroupAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/button-group/main/button-group.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { BasicShowcase } from "./basic.js";
import { FloatedShowcase } from "./floated.js";

import basicCode from "!./basic.tsx?raw";
import floatedCode from "!./floated.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Button Group",
		description: (
			<p>
				The <strong>Button Group</strong> Widget can be used to group related buttons with a gap between each button.
				Buttons need to be immediate <code>children</code> of the <strong>ButtonGroup</strong>.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Floated Button Group",
				content: <FloatedShowcase />,
				description: (
					<p>
						By passing an <code>alignment</code> property for ButtonGroup you can make it float to the <code>left</code>{" "}
						or <code>right</code>.
					</p>
				),
				code: { name: "floated.tsx", code: floatedCode }
			}
		]
	}
];

export default {
	label: "Button Group",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ButtonGroupAPI }],
		themingConfiguration: "buttonGroup"
	}
};
