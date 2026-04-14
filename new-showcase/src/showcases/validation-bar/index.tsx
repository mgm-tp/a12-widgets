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

import ValidationBarAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/validation-bar/main/validation-bar.api.json" with { type: "json" };
import MobileValidationBarAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/validation-bar/main/validation-bar.mobile.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { ExampleShowcase } from "./example.js";
import { VariationsShowcase } from "./variations.js";

import exampleCode from "!./example.tsx?raw";
import variationsCode from "!./variations.tsx?raw";
import mobileCode from "!./mobile.tsx?raw";
import summaryView from "!./summary-view.tsx?raw";
import detailView from "!./detail-view.tsx?raw";
import useForm from "!./use-form.ts?raw";
import validationBarAPICode from "!./showcase-validation-bar.api.ts?raw";

const showcases: Showcase[] = [
	{
		label: "Validation Bar",
		description: (
			<>
				<p>
					The <strong>Validation Bar</strong> Widget is a component that helps to display pieces of validation
					information.
				</p>
				<p>
					The <strong>ValidationBar</strong> component is intentionally used for desktops and tablets, while the
					components under the <strong>MobileValidation</strong> namespace are for phones.
				</p>
			</>
		),
		sections: [
			{
				description: (
					<>
						<p>
							Besides the default <code>error</code> variant, <code>warning</code> and <code>info</code> can be used to
							demonstrate the corresponding validation level via the <code>variant</code> property.
						</p>
						<p>
							One can set the titles of the bar using the <code>primaryTitle</code> and <code>secondaryTitle</code>{" "}
							properties, and add useful actions via the <code>quickAccessMenu</code> property, e.g. focus on the issued
							fields or expand the detailed message.
						</p>
					</>
				),
				label: "Variations",
				content: <VariationsShowcase />,
				code: { name: "variations.tsx", code: variationsCode }
			},
			{
				description: (
					<>
						<p>
							This is a registration form example where the <strong>Validation Bar</strong> is embedded in the{" "}
							<strong>ActionContentBox</strong> component with some mobile optimizations.
						</p>
						<p>
							Using the <strong>MobileValidation.Overview</strong> component to have a quick look at how many issues to
							be resolved through the <code>leftElement</code> property, while detailed views can be shown by clicking
							it via the <code>onClick</code> handler property.
						</p>
						<p>
							Then the <strong>MobileValidation</strong> component itself is used to render an overview and detailed
							view together with some utility components, e.g. <code>PreviewList</code>, <code>Actions</code>,{" "}
							<code>Content</code>, etc.
						</p>
					</>
				),
				label: "Example",
				content: <ExampleShowcase />,
				useDarkBackground: true,
				code: [
					{ name: "example.tsx", code: exampleCode },
					{ name: "mobile.tsx", code: mobileCode },
					{ name: "summary-view.tsx", code: summaryView },
					{ name: "detail-view.tsx", code: detailView },
					{ name: "use-form.ts", code: useForm },
					{ name: "showcase-validation-bar.api.ts", code: validationBarAPICode }
				]
			}
		]
	}
];

export default {
	label: "Validation Bar",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: ValidationBarAPI, name: "ValidationBar" },
			{ declaration: MobileValidationBarAPI, name: "MobileValidationBar" }
		],
		themingConfiguration: "validationBar",
		inheritedThemeConfigurationNote: (
			<p>
				The <strong>Validation Bar</strong> contains a{" "}
				<StyledShowcaseLink href="#/widgets/data-display/list#list-theme-configuration">List</StyledShowcaseLink>{" "}
				widget, therefore it inherits the style configuration of that component.
			</p>
		)
	}
};
