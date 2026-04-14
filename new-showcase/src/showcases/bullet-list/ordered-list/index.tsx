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

import BulletListAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/bullet-list/main/bullet-list.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";

import { BasicOrderedList } from "./basic.js";
import { InlineOrderedList } from "./inline.js";
import { TypesOrderedList } from "./types.js";

import basicCode from "!./basic.tsx?raw";
import inlineCode from "!./inline.tsx?raw";
import typesCode from "!./types.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Ordered List",
		description: (
			<p>
				The <strong>BulletList.Ordered</strong> Widget defines a list of items defined using the{" "}
				<strong>BulletList.Item</strong> element in which the order of the items matters. The ordering is shown by a
				numbering scheme, using Arabic numbers, letters, roman numerals, etc.
			</p>
		),
		sections: [
			{
				label: "Default",
				content: <BasicOrderedList />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Types",
				content: <TypesOrderedList />,
				description: (
					<p>
						There are four Ordered List types besides the default: <code>decimal-leading-zero</code>,{" "}
						<code>lower-roman</code>, <code>upper-roman</code>, and <code>lower-alpha</code>. You can change it by
						setting the <code>type</code> property.
					</p>
				),
				code: { name: "types.tsx", code: typesCode }
			},
			{
				label: "Inline",
				content: <InlineOrderedList />,
				description: (
					<p>
						You can set the <code>inline</code> property to <code>true</code> to display the list in one line.
					</p>
				),
				code: { name: "inline.tsx", code: inlineCode }
			}
		]
	}
];

export default {
	label: "Ordered List",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: BulletListAPI,
				filter: ["BulletListProps.OrderedProps", "BulletListProps.ItemProps", "BulletListProps.OrderedType"]
			}
		],
		themingConfiguration: "bulletList"
	}
};
