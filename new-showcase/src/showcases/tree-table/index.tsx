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

import type { JSONOutput } from "typedoc";

import { Link, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import TreeTableAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tree-table/main/tree-table.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseLink } from "../../helpers/showcase-styles.js";

import { Async } from "./async.js";
import { DnDTreeTable } from "./dnd.js";
import { ResizableTreeTable } from "./resizable.js";
import { Basic } from "./basic.js";
import { ColumnGroupTreeTable } from "./column-group.js";
import { Validation } from "./validation.js";
import { VirtualScrolling } from "./virtual-scrolling.js";
import { Accessibility } from "./accessibility.js";

import asyncCode from "!./async.tsx?raw";
import dndCode from "!./dnd.tsx?raw";
import resizableCode from "!./resizable.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import columnGroupCode from "!./column-group.tsx?raw";
import validationCode from "!./validation.tsx?raw";
import virtualScrollingCode from "!./virtual-scrolling.tsx?raw";
import sharedDataCode from "!./shared/data.tsx?raw";
import sharedComplexDataCode from "!./shared/complex-data.tsx?raw";
import sharedUtilsCode from "!./shared/utils.ts?raw";
import accessibilityCode from "!./accessibility.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Tree Table",
		description: (
			<p>
				The <strong>Tree Table</strong> Widget displays hierarchical data in rows and columns. It is a combination of
				the <Link href="#/widgets/data-display/table">Table</Link> and{" "}
				<Link href="#/widgets/data-display/tree">Tree</Link>.
			</p>
		),
		sections: {
			basic: {
				sections: [
					{
						label: "Basic",
						description: (
							<>
								<p>
									You can handle events when the row or arrow button is clicked by passing corresponding handlers to the{" "}
									<code>rowEventHandlers</code> property.
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>onClick</code>: to handle an event when the row is clicked. For example, to update the
										selection state of a row.
									</BulletList.Item>
									<BulletList.Item>
										<code>onArrowClick</code>: to handle an event when the arrow button of a row is clicked. For
										example, to toggle the expanding/collapsing state of a node.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									To set states for a specific row, you can use the <code>rowStyling</code> property that provides some
									variants on whether the row is interactive, selected, disabled or highlighted.
								</p>
							</>
						),
						content: <Basic />,
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "basic.tsx", code: basicCode },
							{ name: "shared/data.tsx", code: sharedDataCode }
						]
					},
					{
						label: "Async",
						description: (
							<p>
								This example demonstrates how to create a Tree asynchronously. The fetch process will take a bit of time
								to show the hidden data. The loading icon will be shown during that time.
							</p>
						),
						content: <Async />,
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "async.tsx", code: asyncCode },
							{ name: "shared/data.tsx", code: sharedDataCode }
						]
					},
					{
						label: "Column Group",
						description: (
							<>
								<p>
									This example demonstrates how to organize columns into groups with nested sub-columns in a tree table.
									Like the regular{" "}
									<Link href="#/widgets/data-display/table/basic#column-group">Table Column Group</Link> example, you
									can create hierarchical column headers to better organize related data.
								</p>
								<p>
									The example shows an organizational structure with grouped columns for Profile information, Contact
									details (with nested E-address and Address groups), and Organization data.
								</p>
							</>
						),
						content: <ColumnGroupTreeTable />,
						fitToSection: true,
						fullSize: true,
						code: [{ name: "column-group.tsx", code: columnGroupCode }]
					},
					{
						label: "Accessibility",
						content: <Accessibility />,
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "accessibility.tsx", code: accessibilityCode },
							{ name: "shared/data.tsx", code: sharedDataCode }
						],
						description: (
							<>
								<p>
									To fully support accessibility, the <strong>TreeTable</strong> should have its own <code>id</code>. It
									will be used to create an <strong>id</strong> for the <strong>hidden text</strong> that is placed in
									front of the interactive Tree Table for screen-readers. That id will be linked to the{" "}
									<strong>aria-labelledby</strong> attribute. In addition, you can link the external ids via the{" "}
									<code>ariaLabelledby</code> property.
								</p>
								<p>
									If you'd like to add more hidden texts, you can use the <code>ariaLabel</code> property.
								</p>
								<p>
									<code>componentRenderers</code> and the <code>Root</code> properties let you customize the Tree
									Table's rendered output. When providing custom components, ensure accessibility is preserved by
									including the appropriate ARIA attributes and roles.
								</p>
								<p>
									To expose row data to the screen reader (e.g. reading the row ID when an action button is focused),
									include it in the button's <code>title</code> or use a <code>HiddenText</code> linked via button's{" "}
									<code>aria-describedby</code>/<code>aria-labelledby</code>. See the Remove Button in the example
									below.
								</p>
							</>
						)
					},
					{
						label: "Content Type Example",
						description: (
							<>
								<p>
									Provide all relevant examples of nodes and children in the initially collapsed and expandable states
									in combination with the following errors and warnings:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>The parent has a warning, the children have no issues</BulletList.Item>
									<BulletList.Item>The parent has an error, the children have no issues</BulletList.Item>
									<BulletList.Item>The parent has no issue, but the children have warnings</BulletList.Item>
									<BulletList.Item>The parent has no issue, but the children have errors</BulletList.Item>
									<BulletList.Item>The parent has a warning, the children have warnings</BulletList.Item>
									<BulletList.Item>The parent has an error, the children have errors</BulletList.Item>
								</BulletList.Unordered>
								<p>Edge cases:</p>
								<BulletList.Unordered>
									<BulletList.Item>The parent has a warning, the children have errors</BulletList.Item>
									<BulletList.Item>The parent has an error, the children have errors</BulletList.Item>
									<BulletList.Item>The parent has a warning, the children have both</BulletList.Item>
									<BulletList.Item>The parent has an error, the children have both</BulletList.Item>
								</BulletList.Unordered>
							</>
						),
						content: <Validation />,
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "validation.tsx", code: validationCode },
							{ name: "shared/data.tsx", code: sharedDataCode }
						]
					}
				]
			},
			advanced: {
				sections: [
					{
						label: "Resizable Columns",
						description: (
							<p>
								<strong>Tree Table</strong> also inherits the resize behavior of the <strong>Table</strong>. Check out
								the example <Link href="#/widgets/data-display/table/advanced#resizable-columns">Resizable Table</Link>{" "}
								to see how it works on Table.
							</p>
						),
						content: <ResizableTreeTable />,
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "resizable.tsx", code: resizableCode },
							{ name: "shared/data.tsx", code: sharedDataCode }
						]
					},
					{
						label: "Drag and Drop",
						description: (
							<p>
								Provide options to enable drag and drop by using the <code>dragDropOptions</code> property.
							</p>
						),
						content: <DnDTreeTable />,
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "dnd.tsx", code: dndCode },
							{ name: "shared/data.tsx", code: sharedDataCode },
							{ name: "shared/utils.ts", code: sharedUtilsCode }
						]
					},
					{
						label: "Virtual Scrolling",
						description: {
							info: <p>Virtual scrolling is also available for the Tree Table.</p>,
							note: (
								<p>
									The <code>rowHeight</code> property must be defined in the <code>virtualScrollOptions</code>, and the{" "}
									<code>width</code> must be specified for the Action Column to ensure row synchronization.
								</p>
							)
						},
						content: <VirtualScrolling />,
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "virtual-scrolling.tsx", code: virtualScrollingCode },
							{ name: "shared/complex-data.tsx", code: sharedComplexDataCode },
							{ name: "shared/data.tsx", code: sharedDataCode },
							{ name: "shared/utils.ts", code: sharedUtilsCode }
						]
					}
				]
			}
		}
	}
];

export default {
	label: "Tree Table",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: TreeTableAPI as JSONOutput.DeclarationReflection,
				filter: [
					"TreeTableProps",
					"TreeTableComponentRenderers",
					"TreeTableDragDropOptions",
					"TreeTableVirtualScrollOptions",
					"TreeTableScrollToNodeHandler",
					"TreeTableRowStyles",
					"TreeRowEventHandlers"
				]
			}
		],
		themingConfiguration: "treeTable",
		inheritedThemeConfigurationNote: (
			<p>
				Since the <strong>Tree Table</strong> is a combination of the{" "}
				<StyledShowcaseLink href="#/widgets/data-display/table/api#table-theme-configuration">Table</StyledShowcaseLink>{" "}
				and <StyledShowcaseLink href="#/widgets/data-display/tree#tree-theme-configuration">Tree</StyledShowcaseLink>{" "}
				widgets, it inherits the style configurations of those components.
			</p>
		)
	}
};
