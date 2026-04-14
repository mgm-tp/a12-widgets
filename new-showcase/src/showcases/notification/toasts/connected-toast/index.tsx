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

import ConnectedToastAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/toast/main/connected-toast/connected-toast.api.json" with { type: "json" };

import type { Showcase } from "../../../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../../../helpers/showcase-styles.js";

import { Basic } from "./basic.js";
import { Combination } from "./combination.js";

import basicCode from "!./basic.tsx?raw";
import combinationCode from "!./combination.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Connected Toast",
		description: (
			<p>
				The <strong>Connected Toast</strong> widget displays informative toast, which is positioned relatively to a
				trigger element, when users click or tap it.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<p>
							The <strong>Connected Toast</strong> widget has the following variants: info (default), success, warning
							and error. Use the <code>variant</code> property to set the expected one.
						</p>
					),
					note: (
						<p>
							For accessibility purposes, the portal will be focused automatically when the connected toast is shown. If
							you would like to prevent this, you can do so by setting the <code>focusOnOpen</code> property to{" "}
							<strong>false</strong>.
						</p>
					)
				},
				content: <Basic />,
				useConfiguration: true,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Combination",
				description: (
					<div>
						<p>
							A Connected Toast can automatically adjust its position on the screen if the space to display the toast is
							not enough.
							<br />
							<strong>Example:</strong> When setting the orientation of the Connected Toast to the <code>bottom</code>,
							if the bottom space is too small to display the toast, the toast will adjust to a better position where it
							can fit in.
						</p>
						<p>
							By default, a connected toast will be closed after a certain amount of time which can be set by the{" "}
							<code>duration</code> property. If you set the <code>type</code> property to <code>permanent</code>,
							connected toasts will not be closed automatically.
						</p>
						<p>
							In addition, a connected toast will disappear when its reference element is scrolled, you can disable this
							behavior by setting the <code>hideOnReferenceElementPositionChange</code> property to <code>false</code>.
						</p>
						<p>
							Moreover, you can also customize the icon by adding the <code>icon</code> property.
						</p>
					</div>
				),
				content: <Combination />,
				useConfiguration: true,
				code: { name: "combination.tsx", code: combinationCode }
			}
		]
	}
];

export default {
	label: "Connected Toast",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ConnectedToastAPI }],
		themingConfiguration: "connectedToast",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Connected Toast</strong> inherits the style configuration of the{" "}
				<StyledShowcaseLink href="#/widgets/feedback/toasts/toast#toast-theme-configuration">Toast</StyledShowcaseLink>{" "}
				widget.
			</p>
		)
	}
};
