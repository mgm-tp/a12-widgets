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

import StatusAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/status/main/status.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { StatusShowcase } from "./basic.js";

import basicCode from "!./basic.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Status",
		description: (
			<p>
				The <strong>Status</strong> Widget is a component that helps to explicitly express the current characteristics
				of an object. It can be used to display an <strong>Icon</strong> Widget, a text, or a combination of them.
			</p>
		),
		sections: [
			{
				description: {
					info: (
						<p>
							This example shows how the <strong>Status</strong> displays when the <code>variant</code> property is
							defined as: <code>info</code> (default), <code>success</code>, <code>warning</code>, and{" "}
							<code>error</code>.
						</p>
					),
					note: (
						<p>
							To fully support <strong>Accessibility</strong>, please pass the <code>title</code> property in the{" "}
							<code>Icon</code> Widget if you're using <strong>Status</strong> with <strong>Icon Only</strong>.
						</p>
					)
				},
				content: <StatusShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			}
		]
	}
];

export default {
	label: "Status",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: StatusAPI }],
		themingConfiguration: "status"
	}
};
