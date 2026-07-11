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

import { Link } from "@com.mgmtp.a12.widgets/widgets-core";
import TableAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/table/main/table.api.json" with { type: "json" };
import ColumnAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/table/main/column.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { BasicShowcase } from "./basic.js";
import { WithSortingShowcase } from "./with-sorting.js";
import { WithDndShowcase } from "./with-dnd.js";

import utilsCode from "!../../showcases/table/utils.ts?raw";
import basicCode from "!./basic.tsx?raw";
import withSortingCode from "!./with-sorting.tsx?raw";
import withDndCode from "!./with-dnd.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Infinite Scroll Table",
		description: (
			<>
				<p>
					Infinite scroll tables only start loading more rows as the user scrolls down. In some cases, infinite scroll
					can replace table pagination to provide a better UI/UX.
				</p>
				<p>
					Moreover, infinite scroll tables are also windowed, which allows them to efficiently render large lists of
					rows. Under the hood, Widget tables are based on{" "}
					<Link href="https://github.com/bvaughn/react-virtualized">react-virtualized</Link>, rendering two components{" "}
					<Link href="https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md">
						InfiniteLoader
					</Link>{" "}
					and <Link href="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md">List</Link>.
				</p>
			</>
		),
		sections: [
			{
				fitToSection: true,
				fullSize: true,
				label: "Basic",
				content: <BasicShowcase />,
				code: [
					{ name: "basic.tsx", code: basicCode },
					{ name: "utils.ts", code: utilsCode }
				],
				description: {
					info: (
						<>
							<p>
								To enable infinite scroll, the <code>infiniteScrollOptions</code> property needs to be specified. There
								are 4 required fields: <code>rowHeight</code>, <code>rowCount</code>, <code>rowLoadingStatus</code> and{" "}
								<code>loadData</code>.
							</p>
							<p>
								In this example, we use <code>rowHeight</code> to specify a fixed height for the rows. The total number
								of rows is passed into <code>rowCount</code>. The <code>rowLoadingStatus</code> property is used to
								state if a row is <em>unloaded</em>, <em>loading</em>, or <em>loaded</em>. A function to fetch the rows
								and update the data is passed to <code>loadData</code>. It will be called whenever more rows need to be
								loaded.
							</p>
						</>
					),
					note: (
						<>
							<p>Infinite scroll tables only support fixed height rows.</p>
							<p>
								Also, there is an issue with synchronization of the action column size when the rows have different
								numbers of action elements in infinite scrolling mode. Unfortunately, there isn't a good way of solving
								this problem. For that reason, we recommend you avoid usage of the <code>actionColumn</code> and instead
								set an explicit fixed width for that column via the <code>width</code> and <code>fixedWidth</code>{" "}
								properties.
							</p>
						</>
					)
				}
			},
			{
				label: "With Sorting",
				content: <WithSortingShowcase />,
				code: [
					{ name: "with-sorting.tsx", code: withSortingCode },
					{ name: "utils.ts", code: utilsCode }
				],
				fitToSection: true,
				fullSize: true,
				description: {
					info: (
						<div>
							Here's how this example handles sorting and the sort event:
							<ul>
								<li>
									<code>data</code> is reset to an empty array and all the rows should be marked as unloaded using{" "}
									<code>rowLoadingStatus</code>.
								</li>
								<li>
									The table will also be scrolled to top when the sort event occurs. To implement this we get the
									reference of react-virtualized <code>List</code> by using <code>listRef</code> in{" "}
									<code>overrideListProps</code> and then call the <code>scrollToRow(0)</code> method on the event.
								</li>
								<li>
									The method <code>resetLoadMoreRowsCache</code> of the <code>InfiniteLoader</code> is also invoked to
									clear the internal cache of react-virtualized. This is necessary because the loader caches{" "}
									<code>loadData</code> invocations to prevent duplication. Therefore, the cache should be reset
									whenever the entire list is re-fetched (e.g. when sort state or filtering options change).
								</li>
							</ul>
						</div>
					),
					note: (
						<p>
							<code>resetLoadMoreRowsCache</code> does not automatically reload, therefore you may have to reload data
							on your own or pass <code>autoReload</code> as <strong>true</strong> to <code>resetLoadMoreRowCache</code>{" "}
							to reload the last batch.
						</p>
					)
				}
			},
			{
				fitToSection: true,
				fullSize: true,
				label: "With DnD",
				content: <WithDndShowcase />,
				description: (
					<div>
						<p>
							In this example, we're demonstrating how you can incorporate a drag and drop feature into your table. The
							key to implementing drag and drop inside your <code>Table</code> is the <code>dragDropOptions</code>{" "}
							property.
						</p>
						<p>
							The most essential option you'll need is <code>onDrop</code>, which you can use to take care of the logic
							concerning what should happen when the row you're dragging is dropped. Other commonly options include{" "}
							<code>canDrag</code> to indicate which rows can be dragged and <code>canDrop</code> to indicate potential
							places your selection can be dropped.
						</p>
					</div>
				),
				code: [
					{ name: "with-dnd.tsx", code: withDndCode },
					{ name: "utils.ts", code: utilsCode }
				]
			}
		]
	}
];

export default {
	label: "Infinite Scroll Table",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: TableAPI,
				filter: ["BaseTableProps", "InfiniteScrollTableProps", "TableDragDropOptions"]
			},
			{
				name: "Column",
				declaration: ColumnAPI
			}
		],
		themingConfiguration: "table"
	}
};
