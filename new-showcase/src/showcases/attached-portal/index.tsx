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
import AttachedPortalAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/attached-portal/main/attached-portal.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { Basic } from "./basic.js";

import basicCode from "!./basic.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Attached Portal",
		sections: [
			{
				description: {
					info: (
						<div>
							<p>
								The <strong>Attached Portal</strong> Widget positions a given element relative to a reference element,
								so that if possible, the element will be fully visible inside the current browser viewport.
							</p>
							<p>There are several remarkable properties:</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<code>referenceElement</code>: the element that is used to align the Attached Portal. It can be
									undefined if the <code>position</code> property is defined.
								</BulletList.Item>
								<BulletList.Item>
									<code>position</code>: opens the Attached Portal at a given position.
								</BulletList.Item>
								<BulletList.Item>
									<code>orientation</code>: aligns the portal to the <code>referenceElement</code>. The default value of
									this property is <strong>bottom-start</strong>. However, this property does not take effect on mobile
									devices. Instead, the Attached Portal will automatically select the orientation that best fits the
									screen.
								</BulletList.Item>
								<BulletList.Item>
									<code>referenceElementRect</code>: a DOMRect object provides information about the trigger element's
									size and its position relative to the viewport. It is useful for recalculating the orientation of the{" "}
									<strong>Attached Portal</strong> when the reference element is overlapped by other elements.
								</BulletList.Item>
							</BulletList.Unordered>
							<p>
								<strong>Note:</strong> When applying the <strong>Attached Portal</strong> in other places where the
								triggering element might be overlapped by other elements, you should use the{" "}
								<code>IntersectionObserverHelper</code> utility. This function will observe and get the visible
								element's position, then pass it in the <code>referenceElementRect</code> property which will help the{" "}
								<strong>Attached Portal</strong> to be displayed in correct orientation according to the triggering
								element. You can check out the code below to see how to do the observation when the mouse is over the
								button <strong>SHOW/HIDE</strong>, and when the mouse leaves.
							</p>
						</div>
					)
				},
				content: <Basic />,
				code: { name: "basic.tsx", code: basicCode },
				useConfiguration: true
			}
		]
	}
];

export default {
	label: "Attached Portal",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: AttachedPortalAPI }],
		themingConfiguration: "attachedPortal"
	}
};
