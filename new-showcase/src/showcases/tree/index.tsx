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
import TreeTemplateAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tree/main/tpl/tree.tpl.api.json" with { type: "json" };
import TreeBehaviorAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tree/main/behavior/tree.behavior.api.json" with { type: "json" };
import DnDTreeAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tree/main/dnd/dnd-tree.api.json" with { type: "json" };
import InsertableTreeAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/tree/main/insertable/insertable-tree.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { DragAndDropNode } from "./drag-and-drop.js";
import { InsertableTreeShowcase } from "./insertable.js";
import { BasicTree } from "./basic.js";
import { Accessibility } from "./accessibility.js";

import dragAndDropNodeCode from "!./drag-and-drop.tsx?raw";
import insertableCode from "!./insertable.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import commonCode from "!./common.tsx?raw";
import accessibilityCode from "!./accessibility.tsx?raw";

const { Item, Unordered } = BulletList;

const showcases: Showcase[] = [
	{
		label: "Tree",
		description: (
			<>
				<p>
					The <strong>Tree</strong> Widget represents a hierarchical list. It can be used to display a file system
					including folders and files.
				</p>
				<p>Basically, to create a tree, you can use our provided templates:</p>
				<Unordered>
					<Item>
						<code>TreeContainer</code> to wrap the tree nodes.
					</Item>
					<Item>
						<code>TreeNode</code> to define a node.
					</Item>
				</Unordered>
				<p>
					Or use the <code>Tree</code> component and pass an object structure of nodes to the <code>root</code>{" "}
					property.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<>
						<p>
							You can add more behaviors to a <strong>Tree</strong>. Currently, there are 4 built-in behaviors:
						</p>
						<Unordered>
							<Item>Selectable</Item>
							<Item>Collapsible</Item>
							<Item>
								<Link href="#/widgets/data-display/tree#insertable">Insertable</Link>
							</Item>
							<Item>
								<Link href="#/widgets/data-display/tree#drag-and-drop">DragDrop</Link> (Drag &amp; Drop)
							</Item>
						</Unordered>
						<p>
							These behaviors can be described as a chain. The first in the chain must be <code>TreeAdapter</code>. You
							must pass a tree template component to the <code>TreeAdapter</code> to obtain a component that has
							behavioral tree props, then you can continue to pass it to the behaviors that you want to add. You also
							have to write the functions to handle your added behaviors.
						</p>
						<p>
							In this example, we show you how to create a selectable and collapsible tree by using the{" "}
							<code>Selectable</code> and <code>Collapsible</code> behaviors. We also provide the respective callbacks
							for handling:
						</p>
						<Unordered>
							<Item>
								<code>onToggleSelection</code>: to update the selected node.
							</Item>
							<Item>
								<code>onToggleExpansion</code>: to update the expanded/collapsed state of a node.
							</Item>
						</Unordered>
						<p>
							In addition, we provide an ability to collapse/expand programmatically a node by its id after the{" "}
							<strong>Tree</strong> is rendered:
						</p>
						<Unordered>
							<Item>
								<code>expandNodeHandler</code>: provides the collapse method.
							</Item>
							<Item>
								<code>collapseNodeHandler</code>: provides the expand method.
							</Item>
						</Unordered>
					</>
				),
				content: <BasicTree />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "basic.tsx", code: basicCode },
					{ name: "common.tsx", code: commonCode }
				]
			},
			{
				label: "Insertable",
				description: (
					<p>
						The <code>Insertable</code> behavior helps to insert new nodes into a <strong>Tree</strong>. We provide a
						handler called <code>onInsert(position, node)</code> to update the <strong>Tree</strong> based on the given
						inserted position and the node to insert.
					</p>
				),
				content: <InsertableTreeShowcase />,
				fitToSection: true,
				fullSize: true,
				code: { name: "insertable.tsx", code: insertableCode }
			},
			{
				label: "Drag and Drop",
				description: (
					<>
						<p>
							This example demonstrates how to use the <code>DragDrop</code> behavior in a <strong>Tree</strong> with
							its specialized properties:
						</p>
						<Unordered>
							<Item>
								<code>onDragDrop</code>: to define what will happen when you drag and drop a node.
							</Item>
							<Item>
								<code>canDrag</code>: whether the source can be dragged or not.
							</Item>
							<Item>
								<code>canDrop</code>: whether the target can be dropped in or not.
							</Item>
							<Item>
								<code>strictDnD</code>: whether the droppable area is limited.
								<Unordered type="circle">
									<Item>
										If this property is set to <code>true</code>,
										<Unordered type="square">
											<Item>
												dropping one node <strong>above</strong> another is allowed if the hovered node is the first
												node in the current level.
											</Item>
											<Item>
												dropping one node <strong>below</strong> another is allowed if the hovered node is collapsed or
												does not have children.
											</Item>
										</Unordered>
									</Item>
									<Item>
										If this property is set to <code>false</code>, both dropping above and below a node will be allowed.
										<Unordered type="square">
											<Item>
												<code>precedingNode</code> will be returned in drop result that indicates you are going to drop
												a node <strong>after</strong> the node you are dragging over.
											</Item>
											<Item>
												<code>subsequentNode</code> will be returned in drop result that indicates you are going to drop
												a node <strong>before</strong> the node you are dragging over.
											</Item>
										</Unordered>
									</Item>
								</Unordered>
							</Item>
						</Unordered>
						<p>
							Besides the <code>DragDrop</code> behavior, the <strong>Tree</strong> below also combines with other
							interactive behaviors:
						</p>
						<Unordered>
							<Item>Selectable</Item>
							<Item>Collapsible</Item>
						</Unordered>
					</>
				),
				content: <DragAndDropNode />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "drag-and-drop.tsx", code: dragAndDropNodeCode },
					{ name: "common.tsx", code: commonCode }
				]
			},
			{
				label: "Accessibility",
				content: <Accessibility />,
				code: [
					{ name: "accessibility.tsx", code: accessibilityCode },
					{ name: "common.tsx", code: commonCode }
				],
				fitToSection: true,
				fullSize: true,
				description: (
					<>
						<p>
							<code>tplTreeNode</code> property lets you customize the content of a tree node. When providing custom
							components, ensure accessibility is preserved by including the appropriate ARIA attributes and roles.
						</p>
						<p>
							To expose node data to the screen reader (e.g. reading the node ID when an action button is focused),
							include it in the button's <code>title</code> or use a <code>HiddenText</code> linked via button's{" "}
							<code>aria-describedby</code>/<code>aria-labelledby</code>. See the Action Button in the example below.
						</p>
					</>
				)
			}
		]
	}
];

export default {
	label: "Tree",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				name: "Tree Template",
				declaration: TreeTemplateAPI,
				filter: ["TreeTemplateProps"]
			},
			{
				name: "Tree Behavior",
				declaration: TreeBehaviorAPI,
				filter: [
					"SelectableTreeProps",
					"CollapsibleTreeProps",
					"DragAndDropTreeProps",
					"TreeNodeModel",
					"CollapsibleTreeNodeModel",
					"SelectableTreeNodeModel"
				]
			},
			{
				name: "Insertable Tree",
				declaration: InsertableTreeAPI,
				filter: ["InsertableTreeProps", "InsertableTreeProps.InsertPosition", "InsertableTreeProps.TreeNodeModel"]
			},
			{
				name: "Drag and Drop Tree",
				declaration: DnDTreeAPI,
				filter: ["DnDTreeProps"]
			}
		],
		themingConfiguration: "tree"
	}
};
