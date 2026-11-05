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

import additionalCustomizationsCode from "!./additional-customizations.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import messagePositionCode from "!./message-position.tsx?raw";
import statesAndMessagesCode from "!./states-and-messages.tsx?raw";

import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import RadioAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/radio/main/radio.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox, StyledShowcaseLinkInMessageBox } from "../../helpers/showcase-styles.js";

import { AdditionalCustomizationsRadio } from "./additional-customizations.js";
import { Basic } from "./basic.js";
import { MessagePosition } from "./message-position.js";
import { StatesAndMessagesRadio } from "./states-and-messages.js";

const showcases: Showcase[] = [
	{
		label: "Radio",
		description: (
			<p>
				The <strong>Radio</strong> Widget is an input component that allows users to select a single option out of a
				set.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <Basic />,
				description: (
					<>
						<p>
							Setting the <code>inline</code> property to <strong>true</strong> will cause the <strong>Radio</strong> to
							display inline.
						</p>
						<p>
							The <code>readonly</code> or <code>disabled</code> properties can be used on any given{" "}
							<code>Radio.Item</code>, or the Radio itself.
						</p>
					</>
				),
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "States & Messages",
				description: (
					<>
						<p>
							The <code>errorMessage</code>, <code>warningMessage</code>, and <code>infoMessage</code> properties can be
							used to modify the state of the Radio and display different messages (one or multiple messages can be
							shown at once).
						</p>
						<p>
							If you'd like to alter the state/styles of the Radio without displaying any messages, you can use the{" "}
							<code>info</code>, <code>error</code>, and <code>warning</code> properties.
						</p>
						<p>
							Do note, that if you use one of the props that display a message, you don't need to use its accompanying
							state property. For example, if you display a message using <code>errorMessage</code>, error state/styles
							are applied automatically and the <code>error</code> property becomes unnecessary.
						</p>
					</>
				),
				content: <StatesAndMessagesRadio />,
				code: { name: "states-and-messages.tsx", code: statesAndMessagesCode }
			},
			{
				label: "Message and Tooltip Position",
				content: <MessagePosition />,
				description: {
					info: (
						<>
							<p>
								Use <code>messagePosition</code> to render the <code>errorMessage</code>, <code>warningMessage</code>{" "}
								and <code>infoMessage</code> boxes either <code>above</code> the control, between the label and the
								control, or <code>below</code> it.
							</p>
							<p>
								<code>breakTooltipsToNewLine</code> does the same for the tooltips: <code>false</code> keeps them beside
								the control, <code>"above"</code> and <code>"below"</code> move them onto their own line.
							</p>
						</>
					),
					note: (
						<StyledShowcaseBulletListInMessageBox>
							<BulletList.Item>
								Despite the name, <code>breakTooltipsToNewLine</code> sets a position rather than a yes/no line break.
								It will be renamed to <code>tooltipPosition</code> in the next breaking release.
							</BulletList.Item>
							<BulletList.Item>
								<code>FieldDefaultConfigProvider</code> sets <code>messagePosition</code> and{" "}
								<code>tooltipPosition</code> for every data entry widget and every Text Output in a subtree at once. A
								property on a single widget still wins, and nested providers merge. <code>tooltipPosition</code> takes{" "}
								<code>"beside"</code>, <code>"above"</code> or <code>"below"</code>, where <code>"beside"</code> is{" "}
								<code>breakTooltipsToNewLine</code>'s <code>false</code>. See{" "}
								<StyledShowcaseLinkInMessageBox href="#/examples/message-and-tooltip-position">
									Examples {">"} Message and Tooltip Position
								</StyledShowcaseLinkInMessageBox>{" "}
								for a runnable example.
							</BulletList.Item>
						</StyledShowcaseBulletListInMessageBox>
					)
				},
				useConfiguration: true,
				code: { name: "message-position.tsx", code: messagePositionCode }
			},
			{
				label: "Additional Customizations",
				description: (
					<>
						<p>
							The <code>tooltips</code> and <code>helperText</code> properties can be used to provide users with
							additional information.
						</p>
						<p>
							If you do use tooltips, it's recommended to ensure accessibility by adding the ids of the tooltips to the{" "}
							<code>ariaDescribedby</code> property so that screen readers can read them.
						</p>
						<p>
							Finally, it's possible to pass DOM properties to the radio group wrapper via the{" "}
							<code>groupDOMProps</code> property.
						</p>
					</>
				),
				content: <AdditionalCustomizationsRadio />,
				code: { name: "additional-customizations.tsx", code: additionalCustomizationsCode }
			}
		]
	}
];

export default {
	label: "Radio",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: RadioAPI }],
		themingConfiguration: "radio"
	}
};
