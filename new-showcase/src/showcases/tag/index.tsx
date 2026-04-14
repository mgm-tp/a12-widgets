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

import TagAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tag/main/tag/tag.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { DefaultTagShowcase } from "./tag.js";
import { RemovableTagShowcase } from "./removable-tag.js";
import { ExtendedTagShowcase } from "./extended-tag.js";

import defaultTagCode from "!./tag.tsx?raw";
import removableTagCode from "!./removable-tag.tsx?raw";
import extendedTagCode from "!./extended-tag.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Tag",
		description: (
			<p>
				The <strong>Tag</strong> Widget is a component that is designed for items that need to be labeled, categorized,
				or organized using keywords that describe them.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<div>
						<p>
							The <strong>Tag</strong> Widget could contain anything such as text, link, icon and more. This is done by
							setting the <code>children</code> property within the <strong>Tag</strong>. To group tags with a gap
							between each tag, those tags need to be wrapped inside the <strong>TagGroup</strong>.
						</p>
						<p>
							In addition, you can customize the tag's content. In this example, we pass the <strong>div</strong>{" "}
							element and apply a red color style to the text.
						</p>
					</div>
				),
				content: <DefaultTagShowcase />,
				code: { name: "tag.tsx", code: defaultTagCode }
			},
			{
				label: "Extended Tag",
				description: (
					<p>
						Besides the basic one, the appearance of a <strong>Tag</strong> can be extended by using the{" "}
						<code>icon</code> and <code>color</code> properties.
					</p>
				),
				content: <ExtendedTagShowcase />,
				code: { name: "extended-tag.tsx", code: extendedTagCode }
			},
			{
				label: "Removable Tag",
				description: {
					info: (
						<p>
							You can create a removable <strong>Tag</strong> by setting the <code>removable</code> property to true.
							When the remove button is active, clicking it will trigger the event defined by the <code>onRemove</code>{" "}
							property.
							<br />
							To disable the remove button, set the <code>disabledRemoveButton</code> property to true.
						</p>
					),
					note: (
						<p>
							To fully support accessibility, each <strong>Tag</strong> should have its own <code>id</code>. It will be
							used to generate IDs for inner elements; such as the name, remove button, etc. These IDs will be linked to
							the <strong>aria-labelledby</strong> attribute, allowing screen readers to provide complete information to
							users.
						</p>
					)
				},
				content: <RemovableTagShowcase />,
				code: { name: "removable-tag.tsx", code: removableTagCode }
			}
		]
	}
];

export default {
	label: "Tag",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: TagAPI }],
		themingConfiguration: "tag"
	}
};
