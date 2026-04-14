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

import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";
import BulletListAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/bullet-list/main/bullet-list.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";

import { NestedList } from "./nested.js";

import nestedListCode from "!./nested.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Nested List",
		description: (
			<>
				<p>
					With the <strong>Bullet List</strong> Widget:
				</p>
				<BulletList.Unordered>
					<BulletList.Item>
						Nesting is possible in all combinations of the{" "}
						<Link href="#/widgets/data-display/bullet-list/ordered-list">Ordered List</Link> and the{" "}
						<Link href="#/widgets/data-display/bullet-list/unordered-list">Unordered List</Link>:
						<BulletList.Unordered>
							<BulletList.Item>UL with UL</BulletList.Item>
							<BulletList.Item>UL with OL</BulletList.Item>
							<BulletList.Item>OL with UL</BulletList.Item>
							<BulletList.Item>OL with OL</BulletList.Item>
						</BulletList.Unordered>
					</BulletList.Item>
					<BulletList.Item>Nesting of lists is unlimited.</BulletList.Item>
					<BulletList.Item>List style types are configurable for every level.</BulletList.Item>
				</BulletList.Unordered>
			</>
		),
		sections: [
			{
				content: <NestedList />,
				code: { name: "nested.tsx", code: nestedListCode }
			}
		]
	}
];

export default {
	label: "Nested List",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: BulletListAPI }],
		themingConfiguration: "bulletList"
	}
};
