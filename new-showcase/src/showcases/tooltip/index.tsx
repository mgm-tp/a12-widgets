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

import type { JSONOutput } from "typedoc";

import TooltipAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tooltip/main/tooltip.api.json" with { type: "json" };
import HintTooltipAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tooltip/hint/main/hint.api.json" with { type: "json" };
import SuccessTooltipAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tooltip/success/main/success.api.json" with { type: "json" };
import WarningTooltipAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tooltip/warning/main/warning.api.json" with { type: "json" };
import ErrorTooltipAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tooltip/error/main/error.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { BasicTooltipShowcase } from "./tooltip.js";
import { InvertTooltipShowcase } from "./invert.js";
import { TooltipTypeShowcase } from "./type.js";
import { DesktopViewOnMobileShowcase } from "./desktop-view-on-mobile.js";

import basicCode from "!./tooltip.tsx?raw";
import invertCode from "!./invert.tsx?raw";
import typeCode from "!./type.tsx?raw";
import desktopViewOnMobileCode from "!./desktop-view-on-mobile?raw";

const showcases: Showcase[] = [
	{
		label: "Tooltip",
		description: (
			<p>
				The <strong>Tooltip</strong> Widget is a component that will be displayed upon tapping and holding a screen
				element (on mobile) or hovering over it (desktop).
			</p>
		),
		sections: [
			{
				label: "Basic Tooltip",
				content: <BasicTooltipShowcase />,
				code: { name: "tooltip.tsx", code: basicCode }
			},
			{
				label: "Desktop View on Mobile",
				description: {
					info: (
						<p>
							By default, a mobile tooltip is displayed as a modal with an overlay. However, you can display it as a
							desktop-like tooltip by using the <code>useDesktopView</code> property. Check the example below on mobile
							view to see the difference.
						</p>
					),
					note: (
						<p>
							Using this variant does not fully support <strong>accessibility</strong> on mobile devices.
						</p>
					)
				},
				content: <DesktopViewOnMobileShowcase />,
				code: { name: "desktop-view-on-mobile.tsx", code: desktopViewOnMobileCode }
			},
			{
				label: "Type",
				content: <TooltipTypeShowcase />,
				description: (
					<p>
						Besides the basic <code>Tooltip</code>, we also provide 4 different types: <code>HintTooltip</code>,{" "}
						<code>SuccessTooltip</code>, <code>WarningTooltip</code>, and <code>ErrorTooltip</code>.
					</p>
				),
				code: { name: "type.tsx", code: typeCode }
			},
			{
				label: "Invert Tooltip",
				content: <InvertTooltipShowcase />,
				description: (
					<>
						<p>It is recommended to invert the trigger button on a dark background for better contrast.</p>
						<p>
							With the basic <code>Tooltip</code>, you must provide an{" "}
							<Link href="#/widgets/general/buttons/button#invert-icon-buttons">Invert Icon Button</Link>. With variant
							tooltips (<code>HintTooltip</code>, <code>SuccessTooltip</code>, <code>WarningTooltip</code>, and{" "}
							<code>ErrorTooltip</code>), you can set the <code>invert</code> property to <code>true</code> to enable
							this feature.
						</p>
					</>
				),
				code: { name: "invert.tsx", code: invertCode }
			}
		]
	}
];

export default {
	label: "Tooltip",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: TooltipAPI as JSONOutput.DeclarationReflection },
			{ declaration: HintTooltipAPI as JSONOutput.DeclarationReflection },
			{ declaration: SuccessTooltipAPI as JSONOutput.DeclarationReflection },
			{ declaration: WarningTooltipAPI as JSONOutput.DeclarationReflection },
			{ declaration: ErrorTooltipAPI as JSONOutput.DeclarationReflection }
		],
		themingConfiguration: "tooltip",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Tooltip</strong> inherits the style configuration of the{" "}
				<StyledShowcaseLink href="#/widgets/feedback/modal-notification#modal-notification-theme-configuration">
					Modal Notification
				</StyledShowcaseLink>{" "}
				widget when displaying on touch devices (mobile, tablet).
			</p>
		)
	}
};
