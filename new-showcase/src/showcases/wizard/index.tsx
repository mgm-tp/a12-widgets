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

import WizardAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/wizard/main/wizard.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { BasicShowcase } from "./basic.js";
import { ResponsiveShowcase } from "./responsive.js";
import { StatesShowcase } from "./states.js";

import basicCode from "!./basic.tsx?raw";
import responsiveCode from "!./responsive.tsx?raw";
import statesCode from "!./states.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Wizard",
		description: (
			<p>
				The <strong>Wizard</strong> Widget can be used to demonstrate a complex business process by breaking it down
				into simpler pieces.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicShowcase />,
				code: { name: "basic.tsx", code: basicCode },
				description: (
					<>
						<p>
							The <strong>Wizard</strong> comes with three main elements:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>Step</strong>: You can use this element to display a step in a Wizard.
							</BulletList.Item>
							<BulletList.Item>
								<strong>PreviousStepButton</strong>: You can use this element to display a step-navigation button on the
								left side of the Wizard.
							</BulletList.Item>
							<BulletList.Item>
								<strong>NextStepButton</strong>: You can use this element to display a step-navigation button on the
								right side of the Wizard.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							The label of each <strong>Step</strong> element can be truncated by setting the <code>truncate</code>{" "}
							property of the <strong>Wizard</strong> to <code>true</code>. The <code>title</code> property should also
							be set for each <code>Step</code> element to make the <strong>Step</strong> readable when its label is
							truncated.
						</p>
					</>
				)
			},
			{
				label: "States",
				content: <StatesShowcase />,
				code: { name: "states.tsx", code: statesCode },
				description: (
					<>
						<p>
							There are two different <strong>Step</strong> behaviors besides the default:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								Non-interactive: You can make a <strong>Step</strong> element only accessible via navigation buttons by
								setting the <code>nonInteractive</code> property to <code>true</code>.
							</BulletList.Item>
							<BulletList.Item>
								Disabled: You can make a <strong>Step</strong> element disabled by setting the <code>disabled</code>{" "}
								property to <code>true</code>.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							Moreover, there are four variants of a <strong>Step</strong> element: info (default),{" "}
							<code>finished</code>, <code>warning</code>, and <code>error</code>.
						</p>
					</>
				)
			},
			{
				label: "Responsive",
				content: <ResponsiveShowcase />,
				useConfiguration: true,
				code: { name: "responsive.tsx", code: responsiveCode },
				description: (
					<>
						<p>
							The wizard becomes responsive by setting the <code>responsive</code> property to <code>true</code>, and
							the advance options can be configurable via the <code>responsiveBehaviour</code> property.
						</p>
						<p>
							In addition, it needs to set the <code>truncate</code> property to be <code>true</code>, and add the{" "}
							<code>title</code> property for steps to support accessibility.
						</p>
					</>
				)
			}
		]
	}
];

export default {
	label: "Wizard",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: WizardAPI }],
		themingConfiguration: "wizard",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Wizard</strong> contains{" "}
				<StyledShowcaseLink href="#/widgets/general/icon#icon-theme-configuration">Icon</StyledShowcaseLink> widgets,
				therefore it inherits the style configuration of that component.
			</p>
		)
	}
};
