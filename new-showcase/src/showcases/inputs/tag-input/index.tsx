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

import TagInputAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tag-input/main/tag-input.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../../helpers/showcase-styles.js";

import { Introduction } from "./introduction.js";
import { Basic } from "./basic.js";
import { StatesAndMessages } from "./states-and-messages.js";

import basicCode from "!./basic.tsx?raw";
import statesAndMessagesCode from "!./states-and-messages.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Tag Input",
		description: <Introduction />,
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							There are several properties that can be used to add additional information to the{" "}
							<strong>TagInput</strong>.
						</p>
						<p>
							Each of these properties adds said info to a different place: <code>tooltips</code> (
							<strong>under</strong> the label), <code>addonBefore</code> (<strong>before</strong> the input),{" "}
							<code>addonAfter</code> (<strong>after</strong> the input), and <code>helperText</code> (
							<strong>under</strong> the input).
						</p>
						<p>
							Do note that for <strong>accessibility</strong> purposes, it's important to add the ids of the tooltips
							and add-ons to the <code>ariaLabelledby</code> property so that screen readers can read them.
						</p>
						<p>
							If you'd prefer to remove information rather than add it, you can set <code>hideLabel</code> to true while
							still passing a descriptive label text to the <code>label</code> property. This hides the label in a
							manner that still adheres to <strong>accessibility</strong> best practices.
						</p>
					</>
				),
				content: <Basic />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "States & Messages",
				description: (
					<>
						<p>
							The <code>errorMessage</code>, <code>warningMessage</code>, and <code>infoMessage</code> properties can be
							used to modify the state of the <strong>TagInput</strong> and display different messages (one or multiple
							messages can be shown at once).
						</p>
						<p>
							If you'd like to alter the state/styles of the <strong>TagInput</strong> without displaying any messages,
							you can use the <code>info</code>, <code>error</code>, and <code>warning</code> properties.
						</p>
						<p>
							Do note, that if you use one of the properties that display a message, you don't need to use its
							accompanying state property. For example, if you display a message using <code>errorMessage</code>, error
							state/styles are applied automatically and the <code>error</code> property becomes unnecessary.
						</p>
						<p>
							As you may expect, the <code>readonly</code> and <code>disabled</code> properties can be used to make the{" "}
							<strong>TagInput</strong> <strong>readonly</strong> or <strong>disabled</strong>.
						</p>
					</>
				),
				content: <StatesAndMessages />,
				code: { name: "states-and-messages.tsx", code: statesAndMessagesCode }
			}
		]
	}
];

export default {
	label: "Tag Input",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: TagInputAPI }],
		themingConfiguration: "tagInput",
		inheritedThemeConfigurationNote: (
			<p>
				Since the <strong>Tag Input</strong> is a combination of the{" "}
				<StyledShowcaseLink href="#/widgets/data-display/tag#tags-theme-configuration">Tag</StyledShowcaseLink>,{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/text-area#text-area-theme-configuration">
					Text Area
				</StyledShowcaseLink>{" "}
				and{" "}
				<StyledShowcaseLink href="#/widgets/navigation/dropdown#dropdown-theme-configuration">
					Dropdown
				</StyledShowcaseLink>{" "}
				widgets, it inherits the style configurations of those components.
			</p>
		)
	}
};
