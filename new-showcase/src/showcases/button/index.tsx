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

import ButtonAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/button/main/button.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { PrimaryButtonShowcase } from "./primary-button.js";
import { SecondaryButtonShowcase } from "./secondary-button.js";
import { IconButtonShowcase } from "./icon-button.js";
import { VerticalButtonShowcase } from "./vertical-button.js";
import { WithProgressBarShowcase } from "./with-progress-bar.js";
import { WithLoadingShowcase } from "./with-loading.js";
import { InvertButtonShowcase } from "./invert-button.js";
import { InvertIconButtonShowcase } from "./invert-icon-button.js";

import SecondaryButtonCode from "!./secondary-button.tsx?raw";
import IconButtonCode from "!./icon-button.tsx?raw";
import VerticalButtonCode from "!./vertical-button.tsx?raw";
import WithProgressBarCode from "!./with-progress-bar.tsx?raw";
import WithLoadingCode from "!./with-loading.tsx?raw";
import InvertButtonCode from "!./invert-button.tsx?raw";
import InvertIconButtonCode from "!./invert-icon-button.tsx?raw";
import PrimaryButtonCode from "!!./primary-button.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Buttons",
		description: (
			<p>
				<strong>Buttons</strong> can be used to trigger different actions such as printing or exporting. As there are
				several use cases for buttons, A12 offers you a great variety to choose from.
			</p>
		),
		sections: [
			{
				label: "Primary Buttons",
				content: <PrimaryButtonShowcase />,
				description: (
					<p>
						This example is the default primary button along with its <code>active</code>, <code>destructive</code>,{" "}
						<code>inverted</code> and <code>disabled</code> variants.
					</p>
				),
				code: { name: "primary-button.tsx", code: PrimaryButtonCode }
			},
			{
				label: "Secondary Buttons",
				content: <SecondaryButtonShowcase />,
				description: (
					<p>
						This example is the default secondary button along with its <code>active</code>, <code>destructive</code>{" "}
						and <code>disabled</code> properties applied.
					</p>
				),
				code: { name: "secondary-button.tsx", code: SecondaryButtonCode }
			},
			{
				label: "Invert Buttons",
				content: <InvertButtonShowcase />,
				description: (
					<p>
						It is recommended to invert the button on a dark background for better contrast. You can set the{" "}
						<code>invert</code> property to get this feature. Below is an example of what it looks like when combined
						with <code>primary</code> and <code>secondary</code> variants.
					</p>
				),
				code: { name: "invert-button.tsx", code: InvertButtonCode }
			},
			{
				label: "Icon Buttons",
				content: <IconButtonShowcase />,
				description: {
					info: (
						<p>
							This example is the default icon button along with its <code>active</code>, <code>destructive</code> and{" "}
							<code>disabled</code> properties applied. With <code>title</code> property, there will be a tooltip when
							hover the icon button.
						</p>
					),
					note: (
						<p>
							For Accessibility, it is important to enable the interaction hint. Otherwise, the icon button name is not
							shown on tab focus and is therefore not A11Y conform.
						</p>
					)
				},
				code: { name: "icon-button.tsx", code: IconButtonCode }
			},
			{
				label: "Invert Icon Buttons",
				content: <InvertIconButtonShowcase />,
				description: (
					<>
						<p>
							<code>invert</code> is also applied to the icon button, similar to{" "}
							<Link href="#/widgets/general/buttons/button#invert-buttons">Invert Buttons</Link>.
						</p>
						<p>
							This example demonstrates what the <strong>regular</strong>, <code>primary</code>, <code>secondary</code>,
							and <code>active</code> variants look like when they are inverted.
						</p>
						<p>
							<strong>Note:</strong> The inverted primary button's color is inherited from its parent's color property,
							not the background color property.
						</p>
					</>
				),
				code: { name: "invert-icon-button.tsx", code: InvertIconButtonCode }
			},
			{
				label: "Vertical Buttons",
				content: <VerticalButtonShowcase />,
				description: (
					<>
						<p>
							Set the <code>vertical</code> property that vertically align icon and text of Button in the center.
						</p>
						<p>
							<strong>Note:</strong> Use <code>vertical</code> only when both the icon and text are present.
						</p>
					</>
				),
				code: { name: "vertical-button.tsx", code: VerticalButtonCode }
			},
			{
				label: "With Progress Bar",
				content: <WithProgressBarShowcase />,
				description: (
					<p>
						To show Button with <Link href="#/widgets/feedback/progress-bar">Progress Bar</Link>, you can pass the
						completed percentage of the process to <code>processedPercentage</code> property.
					</p>
				),
				code: { name: "with-progress-bar.tsx", code: WithProgressBarCode }
			},
			{
				label: "With Loading",
				content: <WithLoadingShowcase />,
				description: (
					<p>
						If an action takes longer than expected to finish, loading button will be shown so that users know that
						their request is being processed. Set <code>loading</code> property to true for showing loading button.
					</p>
				),
				code: { name: "with-loading.tsx", code: WithLoadingCode }
			}
		]
	}
];

export default {
	label: "Buttons",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ButtonAPI }],
		themingConfiguration: "button"
	}
};
