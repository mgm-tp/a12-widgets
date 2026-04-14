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

import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import PortalAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/portal/main/portal.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { Basic } from "./basic.js";

import basicCode from "!./basic.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Portal",
		sections: [
			{
				description: {
					info: (
						<div>
							<p>
								The <strong>Portal</strong> Widget transports its children into a new React Portal which is appended to
								the document body or root element. In the widgets showcase, we render all the portals inside the root
								div of the React tree. To do that, wrap the outermost element of your application using the{" "}
								<code>WidgetsRoot</code> component.
							</p>
							<p>There are several remarkable properties:</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>closeOnEsc</code>: should the portal close when the ESC key is hit, the default value of this
									property is <code>true</code>.
								</BulletList.Item>
								<BulletList.Item>
									<code>closeOnOutsideClick</code>: should the portal close when you click outside it.
								</BulletList.Item>
								<BulletList.Item>
									<code>onClose</code>: triggers when the portal is closed.
								</BulletList.Item>
								<BulletList.Item>
									<code>onClickOutside</code>: triggers when click outside the portal.
								</BulletList.Item>
							</BulletList.Unordered>
						</div>
					)
				},
				content: <Basic />,
				code: { name: "basic.tsx", code: basicCode }
			}
		]
	}
];

export default {
	label: "Portal",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: PortalAPI }],
		themingConfiguration: "portal"
	}
};
