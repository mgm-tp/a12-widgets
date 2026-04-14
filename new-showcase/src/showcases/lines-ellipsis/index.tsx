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

import LinesEllipsisAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/lines-ellipsis/main/lines-ellipsis.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { BasicLineEllipsisShowcase } from "./basic.js";
import { LinesEllipsisWithCustomizedEllipsisShowcase } from "./customized-ellipsis.js";
import { HtmlTruncationShowcase } from "./html-truncation.js";
import { BasedOnLineEllipsisShowcase } from "./based-on.js";

import basicCode from "!./basic.tsx?raw";
import withCustomizedEllipsisCode from "!./customized-ellipsis.tsx?raw";
import htmlTruncationCode from "!./html-truncation.tsx?raw";
import basedOnCode from "!./based-on.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Lines Ellipsis",
		description: (
			<p>
				The <strong>Lines Ellipsis</strong> Widget helps truncate multi-line texts with customizable ellipsis.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<p>
						The default maximum number of lines is <code>1</code>, but you can pass a value to the <code>maxLine</code>{" "}
						property if you'd prefer a different maximum number of lines.
					</p>
				),
				content: <BasicLineEllipsisShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Split Based On",
				description: {
					info: (
						<p>
							You can use the <code>basedOn</code> property to indicate whether you want to allow the ellipsis to start
							mid-word by setting the value to <strong>"letters"</strong> or only after a word by setting the value to{" "}
							<strong>"words"</strong>. If you don't specify a value for this property, the Widget will try to "guess"
							which would look best for each given case.
						</p>
					),
					note: (
						<p>
							If the ellipses come after the end of a word, you won't be able to see a difference between the two
							settings.
						</p>
					)
				},
				content: <BasedOnLineEllipsisShowcase />,
				code: { name: "based-on.tsx", code: basedOnCode },
				useConfiguration: true,
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Custom",
				description: (
					<>
						<p>
							You can customize the content of the ellipsis by passing a <code>ReactNode</code> via the{" "}
							<code>ellipsis</code> property.
						</p>
						<p>
							You can disable responsive behavior when the parent element resizes by setting the <code>responsive</code>{" "}
							property to false.
						</p>
					</>
				),
				content: <LinesEllipsisWithCustomizedEllipsisShowcase />,
				code: { name: "customized-ellipsis.tsx", code: withCustomizedEllipsisCode }
			},
			{
				label: "HTML Truncation",
				description: (
					<p>
						By setting <code>htmlSupport</code> to <strong>true</strong> you can enable html truncation. Please note,
						however, that this is an experimental feature.
					</p>
				),
				content: <HtmlTruncationShowcase />,
				code: { name: "html-truncation.tsx", code: htmlTruncationCode }
			}
		]
	}
];

export default {
	label: "Lines Ellipsis",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: LinesEllipsisAPI }],
		themingConfiguration: "linesEllipsis"
	}
};
