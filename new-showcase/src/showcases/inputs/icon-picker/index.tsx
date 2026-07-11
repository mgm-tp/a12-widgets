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

import IconPickerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/input/icon-picker/main/icon-picker.api.json" with { type: "json" };
import { ExternalLink, Link, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../../helpers/showcase-styles.js";

import { IconPickerSaveSpaceModeShowcase } from "./save-space-mode.js";
import { IconPickerShowcase } from "./basic.js";

import saveSpaceModeCode from "!./save-space-mode.tsx?raw";
import basicCode from "!./basic.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Icon Picker",
		description: (
			<>
				<p>
					The <strong>Icon Picker</strong> Widget is an input component that allows users to pick an icon from
					either&nbsp;
					<ExternalLink href="https://fonts.google.com/icons">Material Symbols</ExternalLink> or Widget's&nbsp;
					<Link href="#/widgets/general/icon#custom-icons">Custom Icons</Link>.
				</p>
				<p>
					It inherits some general features from the <strong>Text Field</strong>&nbsp;such as states, messages, helper
					text, etc. Visit the&nbsp;
					<Link href="#/widgets/data-entry/text-field">Text Field showcase</Link> to learn more.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				content: <IconPickerShowcase />,
				description: {
					info: (
						<>
							<p>
								Use the <code>selectedIcon</code> and <code>onChange</code> properties to update the icon you chose.
							</p>
							<p>
								The&nbsp;<Icon>view_list</Icon>&nbsp;icon that is displayed next to the input will redirect you to
								the&nbsp;<ExternalLink href="https://fonts.google.com/icons">Material Symbols</ExternalLink> page where
								you can easily explore more icons. Do note, however, that some of the newer icons may not yet be
								available for our picker, so please be sure to double check your selection.
							</p>
						</>
					)
				},
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Space Saving",
				content: <IconPickerSaveSpaceModeShowcase />,
				description: (
					<p>
						In order to save space for the icon container, you can set the <code>saveSpaceMode</code> property to true
						so that the icon label is not displayed. By default, the <strong>IconPicker</strong>&nbsp;will automatically
						switch to save space mode if its width is less than <strong>208px</strong>.
					</p>
				),
				code: { name: "save-space-mode.tsx", code: saveSpaceModeCode }
			}
		]
	}
];

export default {
	label: "Icon Picker",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: IconPickerAPI, filter: ["IconPickerProps"] }],
		themingConfiguration: "iconPicker",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Icon Picker</strong> is a combination of a{" "}
				<StyledShowcaseLink href="#/widgets/data-entry/text-field#text-field-theme-configuration">
					Text Field
				</StyledShowcaseLink>{" "}
				and a{" "}
				<StyledShowcaseLink href="#/widgets/navigation/dropdown#dropdown-theme-configuration">
					Dropdown
				</StyledShowcaseLink>{" "}
				that contains a list of{" "}
				<StyledShowcaseLink href="#/widgets/general/icon#icon-theme-configuration">Icon</StyledShowcaseLink> widgets, so
				it inherits the style configurations of those components.
			</p>
		)
	}
};
