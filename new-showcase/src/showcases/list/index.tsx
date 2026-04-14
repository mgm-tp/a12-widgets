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

import { Link, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import ListAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/list/main/list.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { Basic } from "./basic.js";
import { ListElements } from "./list-elements.js";
import { Combination } from "./combination.js";
import { ItemWithProgressBar } from "./item-with-progress-bar.js";

import basicCode from "!./basic.tsx?raw";
import listElementsCode from "!./list-elements.tsx?raw";
import combinationCode from "!./combination.tsx?raw";
import itemWithProgressBarCode from "!./item-with-progress-bar.tsx?raw";

const { Unordered, Item } = BulletList;

const showcases: Showcase[] = [
	{
		label: "List",
		description: (
			<p>
				The <strong>List</strong> Widget is a component that displays as a continuous, vertical indexes of text or
				images. They are composed of items containing primary and supplemental actions, which are represented by icons
				and text.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							To give the <strong>List</strong> a border, set the <code>border</code> property to <code>true</code>.
						</p>
						<p>
							If you'd like to have a divider between list items, pass the <code>divider</code> property to the{" "}
							<strong>List</strong> or the individual <strong>List.Item</strong> you want to have dividers.
						</p>
						<p>
							The example below adds a divider between the interactive and non-interactive items. We also use the{" "}
							<code>selected</code>, <code>readonly</code>, and <code>disabled</code> properties to set state for the
							list items.
						</p>
					</>
				),
				content: <Basic />,
				code: { name: "basic.tsx", code: basicCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "List Elements",
				description: (
					<>
						<p>If you'd like the item to display more information, you can use these properties:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>secondaryText</code>: to display a secondary text. By default, it will be placed below the item
								text. To swap its position and the text, you can pass the <code>flipped</code> property to the{" "}
								<code>List</code> or respective <code>List.Item</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>graphic</code>: to display an element before the text. Pass the <code>paddedLeft</code> property
								to the <code>List</code> to make the item which doesn't have a graphic align with the others.
							</BulletList.Item>
							<BulletList.Item>
								<code>meta</code>: to display an element after the text. Pass the <code>paddedRight</code> property to
								the <code>List</code> to make the item which doesn't have a graphic align with the others.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							In addition, you can make the list items look like a group by adding a <code>List.SubHeader</code>. By
							default, the sub header doesn't a have background. To make it stand out from the list, set{" "}
							<code>fill</code> to <code>true</code>.
						</p>
					</>
				),
				content: <ListElements />,
				useConfiguration: true,
				code: { name: "list-elements.tsx", code: listElementsCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Item With Progress Bar",
				content: <ItemWithProgressBar />,
				description: (
					<>
						<p>
							To show <strong>List.Item</strong> and <strong>Button</strong> with{" "}
							<Link href="#/widgets/feedback/progress-bar#progress-bar">Progress Bar</Link>, you can pass the completed
							percentage of the process to the <code>processedPercentage</code> property.
						</p>
						<p>Click the button DOWNLOAD to see the progress bar.</p>
					</>
				),
				code: { name: "item-with-progress-bar.tsx", code: itemWithProgressBarCode }
			},
			{
				label: "Combination",
				content: <Combination />,
				description: {
					info: (
						<>
							<p>
								This example is a combination of all elements from the List, also demonstrates how to customize the
								theme for the <strong>List</strong> on your own.
							</p>
							For <strong>Accessibility</strong>:
							<Unordered>
								<Item>
									Because of semantic reasons, it is not recommended to use the list item as interactive wrapper with
									other interactive elements inside. Instead, the list item itself should not be interactive and the
									main action should be made available via button or icon button.
								</Item>
								<Item>
									If a list item has no <code>onClick</code> handler provided, it is considered non-interactive and
									should be explicitly marked with either the <code>readonly</code> or <code>disabled</code> property to
									properly indicate its state.
								</Item>
							</Unordered>
						</>
					),
					note: (
						<p>
							If there are any interactive elements in the <code>meta</code> or <code>graphic</code> of the list item,
							when hover or focus on these elements, the hover or focus style of the interactive list item will not be
							applied.
						</p>
					)
				},
				code: { name: "combination.tsx", code: combinationCode },
				useDarkBackground: true
			}
		]
	}
];

export default {
	label: "List",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ListAPI }],
		themingConfiguration: "list"
	}
};
