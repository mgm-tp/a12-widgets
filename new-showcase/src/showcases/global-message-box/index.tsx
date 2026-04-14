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

import GlobalMessageBoxAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/global-message-box/main/global-message-box.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { GlobalMessageBoxBasicShowcase } from "./basic.js";
import { GlobalMessageBoxVariantShowcase } from "./variants.js";
import { GlobalMessageBoxCustomizationShowcase } from "./customization.js";
import { GlobalMessageBoxAccessibility } from "./accessibility.js";

import globalMessageBoxBasicCode from "!./basic.tsx?raw";
import globalMessageBoxVariantCode from "!./variants.tsx?raw";
import globalMessageBoxCustomizationCode from "!./customization.tsx?raw";
import globalMessageBoxAccessibilityCode from "!./accessibility.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Global Message Box",
		description: (
			<p>
				The <strong>Global Message Box</strong> Widget is a component that displays a message box with a single text
				line and the rest will be cut-off by default. On mobile devices, the actions area will be moved to the new line
				if the message is too long.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <GlobalMessageBoxBasicShowcase />,
				description: (
					<>
						<p>
							The default value of <code>focusOnMount</code> property as <code>true</code>, which sets invisible focus
							to the <strong>Global Message Box</strong> when it finished rendering. You can try to press the{" "}
							<strong>TAB</strong> key to navigate to the "Close" icon button of this example.
						</p>
						<p>
							In case of multiple global message boxes, it is recommended to only set the <code>focusOnMount</code> for
							only one of them.
						</p>
					</>
				),
				code: { name: "basic.tsx", code: globalMessageBoxBasicCode }
			},
			{
				label: "Variants",
				content: <GlobalMessageBoxVariantShowcase />,
				description: (
					<p>
						There are three additional variants besides the default <code>info</code> variant: <code>success</code>,{" "}
						<code>warning</code> and <code>error</code>.
					</p>
				),
				code: { name: "variants.tsx", code: globalMessageBoxVariantCode }
			},
			{
				label: "Customization",
				content: <GlobalMessageBoxCustomizationShowcase />,
				description: (
					<p>
						This example customizes the <strong>Global Message Box</strong> by using <code>icon</code>,{" "}
						<code>actions</code> and <code>ellipsis</code> properties.
					</p>
				),
				code: { name: "customization.tsx", code: globalMessageBoxCustomizationCode }
			},
			{
				label: "Accessibility",
				content: <GlobalMessageBoxAccessibility />,
				description: (
					<>
						There are two remarkable properties of the <strong>Global Message Box</strong> that could help you improve
						the <strong>Accessibility</strong>:
						<ul>
							<li>
								<code>role</code>: will be placed at the wrapper of <code>content</code>. By default, the role is{" "}
								<code>heading</code>. To turn it off, please set it to false.
							</li>
							<li>
								<code>ariaLevel</code>: will be placed at the wrapper of <code>content</code>. By default, the ariaLevel
								is <code>2</code>. The value of <code>ariaLevel</code> should be a number which is greater than 0.
								<br />
								If the <code>role</code> is set to false, the <code>ariaLevel</code> will NOT be set either.
							</li>
						</ul>
					</>
				),
				code: { name: "accessibility.tsx", code: globalMessageBoxAccessibilityCode }
			}
		]
	}
];

export default {
	label: "Global Message Box",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: GlobalMessageBoxAPI }],
		themingConfiguration: "globalMessageBox",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Global Message Box</strong> inherits the style configuration of the{" "}
				<StyledShowcaseLink href="#/widgets/general/icon#icon-theme-configuration">Icon</StyledShowcaseLink> widget.
			</p>
		)
	}
};
