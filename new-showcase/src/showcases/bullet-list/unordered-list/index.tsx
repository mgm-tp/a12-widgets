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

import { BasicUnorderedList } from "./basic.js";
import { InlineUnorderedList } from "./inline.js";
import { TypesUnorderedList } from "./types.js";
import { NoindentUnorderedList } from "./no-indent.js";

import basicCode from "!./basic.tsx?raw";
import inlineCode from "!./inline.tsx?raw";
import typesCode from "!./types.tsx?raw";
import noindentCode from "!./no-indent.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Unordered List",
		description: (
			<p>
				The <strong>BulletList.Unordered</strong> Widget defines a list of items in which the order of the items does
				not. In other words, an unordered list tag is used to create an unordered list. In an unordered list, each
				element in the list is defined using <strong>BulletList.Item</strong>.
			</p>
		),
		sections: [
			{
				label: "Default",
				content: <BasicUnorderedList />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Types",
				content: <TypesUnorderedList />,
				description: (
					<p>
						There are three Unordered List types besides the default: <code>circle</code>, <code>square</code>, and{" "}
						<code>none</code>. You can change it by setting the <code>type</code> property.
					</p>
				),
				code: { name: "types.tsx", code: typesCode }
			},
			{
				label: "Inline",
				content: <InlineUnorderedList />,
				description: (
					<p>
						Set the <code>inline</code> property to <code>true</code> to display the list in one line.
					</p>
				),
				code: { name: "inline.tsx", code: inlineCode }
			},
			{
				label: "No Indent",
				content: <NoindentUnorderedList />,
				description: (
					<p>
						Set the <code>indent</code> property to <code>false</code> to reduce the indent of the list.
						<br />
						By default, a bullet list always has an indent.
					</p>
				),
				code: { name: "no-indent.tsx", code: noindentCode }
			}
		]
	}
];

export default {
	label: "Unordered List",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: BulletListAPI,
				filter: ["BulletListProps.UnorderedProps", "BulletListProps.ItemProps", "BulletListProps.UnorderedType"]
			}
		],
		themingConfiguration: "bulletList"
	}
};
