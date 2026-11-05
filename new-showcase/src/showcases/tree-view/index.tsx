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

import accessibilityCode from "!./accessibility.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import controlledExpansionCode from "!./controlled-expansion.tsx?raw";
import dragAndDropCode from "!./drag-and-drop.tsx?raw";
import flatDataCode from "!./flat-data.tsx?raw";
import lazyLoadingCode from "!./lazy-loading.tsx?raw";
import nodeActionsCode from "!./node-actions.tsx?raw";

import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { AccessibilityTreeView } from "./accessibility.js";
import { BasicTreeView } from "./basic.js";
import { ControlledExpansionTreeView } from "./controlled-expansion.js";
import { DragAndDropTreeView } from "./drag-and-drop.js";
import { FlatDataTreeView } from "./flat-data.js";
import { LazyLoadingTreeView } from "./lazy-loading.js";
import { NodeActionsTreeView } from "./node-actions.js";

const showcases: Showcase[] = [
	{
		label: "TreeView",
		description: (
			<>
				<p>
					<strong>TreeView</strong> is the modern, headless-model-driven tree. It replaces the legacy <code>Tree</code>{" "}
					template and its behavior HOCs (<code>Selectable</code> / <code>Collapsible</code> / <code>DragDrop</code> /{" "}
					<code>TreeAdapter</code>) with a single component: pass your own row type and either a nested{" "}
					<code>tree</code> (+ <code>getChildren</code>) or a flat <code>data</code> (+ <code>getParentId</code>), plus
					a stable <code>rowKey</code>.
				</p>
				<p>
					Expansion and selection are controlled or uncontrolled, keyboard navigation follows the WAI-ARIA tree pattern,
					and drag-and-drop reparenting is built in. Migrating from the legacy <code>Tree</code>? See the{" "}
					<Link href="#/get-started/migration-instructions/new-table-and-tree-components">migration notes</Link>.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<p>
						A selectable, collapsible tree from a nested data structure. Presentation is supplied via{" "}
						<code>getLabel</code> / <code>getIcon</code>; selection uses <code>selectionMode</code> +{" "}
						<code>selectedKeys</code> / <code>onSelectionChange</code>. Click a node, or focus it and use the arrow keys
						and Enter/Space.
					</p>
				),
				content: <BasicTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Flat Data",
				description: (
					<p>
						Instead of a nested <code>tree</code>, hand the tree a flat <code>data</code> array plus{" "}
						<code>getParentId</code> and it rebuilds the hierarchy itself — convenient when your data arrives normalized
						(e.g. from a database table or a flat store). Root nodes simply return <code>undefined</code> as their
						parent.
					</p>
				),
				content: <FlatDataTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "flat-data.tsx", code: flatDataCode }
			},
			{
				label: "Controlled Expansion",
				description: (
					<p>
						Drive expansion yourself with <code>expandedKeys</code> + <code>onExpandedChange</code> instead of the
						uncontrolled <code>defaultExpandedKeys</code> — useful for persisting expansion, syncing it with external
						state, or wiring up expand/collapse-all controls.
					</p>
				),
				content: <ControlledExpansionTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "controlled-expansion.tsx", code: controlledExpansionCode }
			},
			{
				label: "Lazy Loading",
				description: (
					<p>
						With <code>loadChildren</code>, a folder&apos;s children are fetched the first time it expands and then
						cached (a progress indicator shows while a fetch is in flight). <code>isLeaf</code> marks the rows that can
						never expand, so files show no arrow. Leave children <code>undefined</code> (not <code>[]</code>) to mark a
						folder as unloaded, so it shows an arrow before anything is fetched.
					</p>
				),
				content: <LazyLoadingTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "lazy-loading.tsx", code: lazyLoadingCode }
			},
			{
				label: "Node Actions and Scrolling",
				description: (
					<>
						<p>
							<code>getActions</code> renders trailing controls at the end of a node — here a download button per file.
							Stop the click from propagating so it does not also select the node, and name the button after its node
							(the Accessibility example below shows the <code>aria-labelledby</code> variants). <code>isDisabled</code>{" "}
							greys a node out and makes it non-interactive; here the <em>batch-2</em> folder.
						</p>
						<p>
							<code>fitToParent</code> makes the tree fill its host&apos;s height and scroll inside it; without it the
							tree grows to its content. Capture the handle from <code>scrollToNode</code> and call it with a node key
							(and optional <code>{"{ autoFocus }"}</code>) to scroll that node into view. A node hidden inside a
							collapsed ancestor is not rendered, so the call is a no-op.
						</p>
					</>
				),
				content: <NodeActionsTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "node-actions.tsx", code: nodeActionsCode }
			},
			{
				label: "Drag and Drop",
				description: (
					<>
						<p>
							Pass <code>dragDrop</code> to make nodes draggable. Drop near a node&apos;s top/bottom edge to reorder it
							(<code>before</code> / <code>after</code>) or over the middle of a folder to reparent it (
							<code>inside</code>
							). <code>onDrop</code> reports <code>{"{ source, target, position }"}</code> and the consumer mutates
							their own tree; the self/descendant cycle guard is built in.
						</p>
						<p>
							With <code>onDropToRoot</code> provided, the empty area below the last node becomes a drop zone that moves
							the node to the top level; <code>canDropToRoot</code> forbids it per node. The drop appends to the end, so
							here the node that is already the last top-level one is forbidden.
						</p>
						<p>
							The same moves work from the keyboard: focus a node and press <kbd>Space</kbd> to pick it up.{" "}
							<kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd> move it before the previous or after the next sibling,{" "}
							<kbd>Home</kbd> / <kbd>End</kbd> to the first or last position among its siblings, <kbd>ArrowRight</kbd>{" "}
							nests it under the sibling above it and <kbd>ArrowLeft</kbd> moves it out to sit right after its parent.{" "}
							<kbd>Space</kbd> or <kbd>Enter</kbd> drops, <kbd>Escape</kbd> cancels, and every step is announced to
							screen readers. <code>canDrop</code> gates keyboard moves exactly as it gates pointer drops.
						</p>
					</>
				),
				content: <DragAndDropTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "drag-and-drop.tsx", code: dragAndDropCode }
			},
			{
				label: "Accessibility",
				content: <AccessibilityTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "accessibility.tsx", code: accessibilityCode },
				description: {
					info: (
						<>
							<p>
								<code>getLabel</code>, <code>getActions</code> and <code>renderNode</code> let you customize the content
								of a node. When providing custom components, ensure accessibility is preserved by including the
								appropriate ARIA attributes and roles.
							</p>
							<p>
								A generic control that sits in a node - here the <strong>Edit</strong> Button of the action area -
								carries no data of its own, so it has to be named after its node. The TreeView already renders an
								element you can point at, so no extra hidden text is needed. Each node below shows one way to do it:
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<strong>Documents</strong> links the Button via <code>aria-labelledby</code> to{" "}
									<code>tree-node-name-&#123;key&#125;</code>, the element that wraps the label. Its label is markup
									rather than plain text, and referencing the element handles that without a special case.
								</BulletList.Item>
								<BulletList.Item>
									<strong>Invoices</strong> puts the name of the node in the Button&apos;s <code>title</code>. This
									works only where the name is available as plain text.
								</BulletList.Item>
								<BulletList.Item>
									<strong>Contracts</strong> renders its label as a <strong>TextField</strong> and links the Button to
									that input. A referenced input contributes its value, so the name of the Button follows every
									keystroke - and the hidden label of the field stays out of it.
								</BulletList.Item>
							</BulletList.Unordered>
						</>
					),
					note: (
						<p>
							The <code>aria-labelledby</code> of a Button points to the Button itself as well as to the node. That self
							reference pulls in the Button&apos;s own name (<em>Edit</em>), so no hidden text element is needed just to
							hold it. Do not point at the element wrapping the whole node title here: in a TreeView it wraps the action
							buttons as well, so a Button would fold itself into its own name. The{" "}
							<Link href="#/experimental/datatreetable">DataTreeTable</Link>, whose actions live in their own column,
							exposes <code>tree-node-title-&#123;key&#125;</code> for exactly that purpose.
						</p>
					)
				}
			}
		]
	}
];

export default {
	label: "TreeView",
	structure: showcases
};
