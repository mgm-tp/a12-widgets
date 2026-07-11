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

import type { Showcase } from "../../helpers/definitions.js";

import { BasicTreeView } from "./basic.js";
import { ControlledExpansionTreeView } from "./controlled-expansion.js";
import { LazyLoadingTreeView } from "./lazy-loading.js";
import { DragAndDropTreeView } from "./drag-and-drop.js";

import basicCode from "!./basic.tsx?raw";
import controlledExpansionCode from "!./controlled-expansion.tsx?raw";
import lazyLoadingCode from "!./lazy-loading.tsx?raw";
import dragAndDropCode from "!./drag-and-drop.tsx?raw";

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
						folder as unloaded.
					</p>
				),
				content: <LazyLoadingTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "lazy-loading.tsx", code: lazyLoadingCode }
			},
			{
				label: "Drag and Drop",
				description: (
					<p>
						Pass <code>dragDrop</code> to make nodes draggable. Drop near a node&apos;s top/bottom edge to reorder it (
						<code>before</code> / <code>after</code>) or over the middle of a folder to reparent it (<code>inside</code>
						). <code>onDrop</code> reports <code>{"{ source, target, position }"}</code> and the consumer mutates their
						own tree; the self/descendant cycle guard is built in.
					</p>
				),
				content: <DragAndDropTreeView />,
				fitToSection: true,
				fullSize: true,
				code: { name: "drag-and-drop.tsx", code: dragAndDropCode }
			}
		]
	}
];

export default {
	label: "TreeView",
	structure: showcases
};
