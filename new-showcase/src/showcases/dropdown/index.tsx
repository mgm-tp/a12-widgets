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

import DropdownAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/dropdown/main/template/dropdown.tpl.api.json" with { type: "json" };
import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { DropDownWithGraphicShowcase } from "./items-with-graphic.js";
import { Basic } from "./basic.js";
import { ExtendedDropdownShowcase } from "./extended-dropdown.js";
import { WithLinkItems } from "./with-link-items.js";
import { DropDownWithLabelRendererShowcase } from "./items-with-label-renderer.js";

import basicCode from "!./basic.tsx?raw";
import dropDownWithGraphicShowcaseCode from "!./items-with-graphic.tsx?raw";
import withLinkItemsCode from "!./with-link-items.tsx?raw";
import extendedDropdownShowcaseCode from "!./extended-dropdown.tsx?raw";
import itemsWithLabelRendererCode from "!./items-with-label-renderer.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Dropdown",
		description: (
			<p>
				The <strong>Dropdown</strong> Widget presents a list of options from which a user can select one or several
				options. A selected option can represent a value in a form, or can be used as an action to filter or sort
				existing content.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							By default, you can use the up/down arrow keys to move between the Dropdown's items when focusing on the
							Dropdown.
						</p>
						<p>
							The Dropdown also provides a footer to display additional elements that provide extended functionality
							such as loading more items. To enable this feature, use the <code>footer</code> property.
						</p>
						<p>
							In addition, if you'd like to have a lighter background, you can use the <code>lightBackground</code>{" "}
							property.
						</p>
					</>
				),
				content: <Basic />,
				useConfiguration: true,
				code: { name: "./basic.tsx", code: basicCode }
			},
			{
				label: "Items With Graphic",
				description: (
					<>
						<p>
							To display an icon along with the label, define the <code>graphic</code> property in DropdownItem.
						</p>
						<p>
							To display items horizontally, set the <code>horizontal</code> property to true. In this mode, you can use
							both left/right arrow keys and up/down arrow keys to move between the Dropdown's items. You can go to the{" "}
							<Link href="#/widgets/data-entry/icon-picker">Icon Picker</Link> widget to see how the horizontal Dropdown
							is used.
						</p>
					</>
				),
				content: <DropDownWithGraphicShowcase />,
				useConfiguration: true,
				code: { name: "items-with-graphic.tsx", code: dropDownWithGraphicShowcaseCode }
			},
			{
				label: "Extended",
				description: <p>It's considered extended when an item contains another list of DropdownItem.</p>,
				content: <ExtendedDropdownShowcase />,
				useConfiguration: true,
				code: { name: "extended-dropdown.tsx", code: extendedDropdownShowcaseCode }
			},
			{
				label: "With Link Items",
				description: (
					<p>
						You can add a list of <Link href="#/widgets/general/link">Link</Link> Widgets to the <code>links</code>{" "}
						property to provide additional items with functionalities to the <strong>Dropdown</strong>.
					</p>
				),
				content: <WithLinkItems />,
				useConfiguration: true,
				code: { name: "with-link-items.tsx", code: withLinkItemsCode }
			},
			{
				label: "Custom Label Renderer",
				description: (
					<>
						<p>
							For advanced use cases, you can customize how dropdown items are displayed by using the{" "}
							<code>labelRenderer</code> property. This enables you to create visually rich dropdowns content such as
							icons, descriptions, badges, or multi-line labels.
						</p>
					</>
				),
				content: <DropDownWithLabelRendererShowcase />,
				useConfiguration: false,
				code: { name: "items-with-label-renderer.tsx", code: itemsWithLabelRendererCode }
			}
		]
	}
];

export default {
	label: "Dropdown",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: DropdownAPI }],
		themingConfiguration: "dropdown"
	}
};
