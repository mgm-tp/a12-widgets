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

import ProgressBarAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/progress-bar/main/progress-bar.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { ProgressBarShowcase } from "./progress-bar.js";

import progressBarCode from "!./progress-bar.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Progress Bar",
		description: (
			<div>
				The <strong>Progress Bar</strong> Widget is a graphical control element used to visualize the progression of an
				operation.
			</div>
		),
		sections: [
			{
				label: "Progress Bar",
				description: {
					info: (
						<>
							<p>
								The <code>percentage</code> property defines the width of the <strong>Progress Bar</strong>. When you
								pass a number that represents the progressed percentage to the <code>percentage</code> property, a
								running bar with the default background-color inherited from the wrapper element will be shown.
							</p>
							<p>
								If the wrapper element does not have a background, the <strong>Progress Bar</strong> will have its own
								color (default is <code>colors.interaction.disabled.colorLight</code>).
							</p>
							<p>
								In addition, see more examples of how the <strong>Progress Bar</strong> works with another Widget in the{" "}
								<Link href="#/widgets/general/buttons/button#with-progress-bar">Button</Link> or{" "}
								<Link href="#/widgets/data-display/list#item-with-progress-bar">List</Link>
							</p>
						</>
					)
				},
				content: <ProgressBarShowcase />,
				useConfiguration: true,
				code: { name: "progress-bar.tsx", code: progressBarCode }
			}
		]
	}
];

export default {
	label: "Progress Bar",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ProgressBarAPI }],
		themingConfiguration: "progressBar"
	}
};
