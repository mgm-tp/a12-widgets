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

import TextOutputAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/text-output/main/text-output.api.json" with { type: "json" };
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox, StyledShowcaseLinkInMessageBox } from "../../helpers/showcase-styles.js";

import { AdditionalCustomizations } from "./additional-customizations.js";
import { BasicTextOutput } from "./basic.js";
import { TextOutputWithAlignment } from "./with-alignment.js";

import basicCode from "!./basic.tsx?raw";
import withAlignmentCode from "!./with-alignment.tsx?raw";
import additionalCustomizationsCode from "!./additional-customizations.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Text Output",
		description: (
			<p>
				The <strong>Text Output</strong> Widget is a component that could be used to display a read-only text or simple
				elements such as links, icons, lists, etc.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<p>
							If there is no data to display, you can set the <code>noData</code> property to <code>true</code> to
							change the way the content looks. We also provide a <code>disableParagraphWrapping</code> property, which
							prevents your content from being wrapped with paragraph tags if it is set to <code>true</code>. Whether
							you use this property or not, it's still important to ensure all of your texts are wrapped with paragraph
							tags for accessibility purposes.
						</p>
					),
					note: (
						<StyledShowcaseBulletListInMessageBox>
							<BulletList.Item>
								If you're using block level elements inside the <code>TextOutput</code> such as{" "}
								<strong>paragraphs</strong>, <strong>divs</strong>, or <strong>unordered lists</strong> then the{" "}
								<code>disableParagraphWrapping</code> property should be used. This is because failing to do so could
								result in invalid HTML structures (paragraph tags should not wrap block level elements).{" "}
							</BulletList.Item>
							<BulletList.Item>
								Additionally, set the <code>disableParagraphWrapping</code> to <code>true</code> when using{" "}
								<code>TextOutput</code> in a{" "}
								<StyledShowcaseLinkInMessageBox href="#/widgets/data-display/table">
									Table
								</StyledShowcaseLinkInMessageBox>
								. Table cells already have their semantic <code>role="cell"</code>, so the semantic of the paragraph is
								not necessarily required.
							</BulletList.Item>
						</StyledShowcaseBulletListInMessageBox>
					)
				},
				content: <BasicTextOutput />,
				code: { name: "basic.tsx", code: basicCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Alignment",
				description: (
					<p>
						Use the <code>alignment</code> property to align the text: <code>left</code> (default), <code>center</code>{" "}
						or <code>right</code>.
					</p>
				),
				content: <TextOutputWithAlignment />,
				code: { name: "with-alignment.tsx", code: withAlignmentCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Additional Customizations",
				description: (
					<p>
						To display more further information, you can use these properties: <code>tooltips</code>,{" "}
						<code>errorMessage</code>, <code>warningMessage</code>, <code>infoMessage</code> and <code>addonAfter</code>
						.
					</p>
				),
				content: <AdditionalCustomizations />,
				code: { name: "additional-customizations.tsx", code: additionalCustomizationsCode },
				toggleBetweenPartialAndFullCode: true
			}
		]
	}
];

export default {
	label: "Text Output",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: TextOutputAPI }],
		themingConfiguration: "textOutput"
	}
};
