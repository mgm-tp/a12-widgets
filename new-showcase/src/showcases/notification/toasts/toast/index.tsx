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

import ToastAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/toast/main/toast/toast.api.json" with { type: "json" };

import type { Showcase } from "../../../../helpers/definitions.js";

import { BasicToastShowcase } from "./basic.js";
import { CombinationToastShowcase } from "./collapsible.js";

import basicToastCode from "!./basic.tsx?raw";
import combinationToastCode from "!./collapsible.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Toast",
		description: (
			<p>
				The <strong>Toast</strong> widget is used to give feedback to users after an action has taken place.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicToastShowcase />,
				useConfiguration: true,
				description: (
					<p>
						To display elements like <strong>header, footer and message</strong>, you can use the <code>header</code>,{" "}
						<code>footer</code> and
						<code>message</code> properties. In addition, there are four Toast variants: info (default), success,
						warning, and error. You can change it by setting the <code>variant</code> property.
					</p>
				),
				code: { name: "basic.tsx", code: basicToastCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Combination",
				content: <CombinationToastShowcase />,
				code: { name: "collapsible.tsx", code: combinationToastCode },
				description: (
					<>
						<p>
							You can customize the icon by adding the <code>icon</code> property.
						</p>
						<p>
							You can add a collapse button by using the <code>collapse</code> property to handle the content being
							passed.
						</p>
					</>
				)
			}
		]
	}
];

export default {
	label: "Toast",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ToastAPI }],
		themingConfiguration: "toast"
	}
};
