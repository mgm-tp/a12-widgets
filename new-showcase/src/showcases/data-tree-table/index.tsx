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

import type { Showcase } from "../../helpers/definitions.js";

import { AccessibilityDataTreeTable } from "./accessibility.js";
import accessibilityCode from "./accessibility.tsx?raw";
import { BasicDataTreeTable } from "./basic.js";
import basicCode from "./basic.tsx?raw";
import { ControlledDataTreeTable } from "./controlled-expansion.js";
import controlledCode from "./controlled-expansion.tsx?raw";
import { DragAndDropDataTreeTable } from "./drag-and-drop.js";
import dragAndDropCode from "./drag-and-drop.tsx?raw";
import { FlatDataTreeTable } from "./flat-data.js";
import flatCode from "./flat-data.tsx?raw";
import { LazyDataTreeTable } from "./lazy-loading.js";
import lazyCode from "./lazy-loading.tsx?raw";
import { PaginatedDataTreeTable } from "./pagination.js";
import paginationCode from "./pagination.tsx?raw";
import sharedCode from "./shared.tsx?raw";
import { TreeColumnDataTreeTable } from "./tree-column.js";
import treeColumnCode from "./tree-column.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "DataTreeTable",
		description: (
			<>
				<p>
					<strong>DataTreeTable</strong> is a hierarchical wrapper over{" "}
					<Link href="#/experimental/datatable">DataTable</Link>, driven by the same headless model and your own
					consumer-owned row type — there is no node envelope. Your columns (<code>dataKey</code> /{" "}
					<code>renderCell</code>), <code>rowStyling</code>, <code>slots</code>, sorting, resizing and virtualization
					all operate on <code>RowType</code> directly. The wrapper flattens the hierarchy, owns expand/collapse,
					decorates one column with an indent + chevron, and applies <code>treegrid</code> ARIA.
				</p>
				<p>
					Feed it either a nested <code>tree</code> (+ <code>getChildren</code>) or a flat <code>data</code> (+{" "}
					<code>getParentId</code>), plus a stable <code>rowKey</code>. It is the modern counterpart to the{" "}
					<Link href="#/widgets/data-display/tree-table">TreeTable</Link> (which remains fully supported). Migrating?
					See the <Link href="#/get-started/migration-instructions/new-table-and-tree-components">migration notes</Link>
					.
				</p>
				<p>
					Rows are selectable in every example below, wired with <code>rowEventHandlers</code> and{" "}
					<code>rowStyling</code> through the <code>useRowSelection</code> helper in <code>shared.tsx</code>. Selection
					is also what makes a row <em>interactive</em>, and that is what earns it the focus ring: a row with neither an{" "}
					<code>onClick</code> nor <code>rowStyling().interactive</code> shows focus as a faint background tint alone -
					even though it is still a tab stop and still reachable with the arrow keys.
				</p>
			</>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<p>
						A nested <code>tree</code> with <code>getChildren</code> and a stable <code>rowKey</code>. The wrapper adds
						the indent + chevron to the first column; a leading folder/file icon comes from <code>getIcon</code>.
						Expansion is uncontrolled, seeded with <code>defaultExpandedKeys</code>.
					</p>
				),
				content: <BasicDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "basic.tsx", code: basicCode },
					{ name: "shared.tsx", code: sharedCode }
				]
			},
			{
				label: "Controlled Expansion",
				description: (
					<p>
						Drive expansion yourself with <code>expandedKeys</code> + <code>onExpandedChange</code> — useful for
						persistence, expand/collapse-all controls, or syncing with external state.
					</p>
				),
				content: <ControlledDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "controlled-expansion.tsx", code: controlledCode },
					{ name: "shared.tsx", code: sharedCode }
				]
			},
			{
				label: "Lazy Loading",
				description: (
					<p>
						With <code>loadChildren</code>, a folder&apos;s children are fetched the first time it expands and then held
						internally (a progress indicator shows while a fetch is in flight). <code>isLeaf</code> tells the wrapper
						which rows can never expand, so files show no chevron. Leave children <code>undefined</code> (not{" "}
						<code>[]</code>) to mark a folder as unloaded, so it shows a chevron before anything is fetched.
					</p>
				),
				content: <LazyDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "lazy-loading.tsx", code: lazyCode },
					{ name: "shared.tsx", code: sharedCode }
				]
			},
			{
				label: "Pagination",
				description: (
					<p>
						When children arrive a page at a time, keep your store as the single source of truth and drive the built-in
						load-more row from it: <code>getPagination(parentId)</code> reports <code>{"{ hasMore, total }"}</code> for
						a parent (or for the root when <code>parentId</code> is <code>undefined</code>), and <code>onLoadMore</code>{" "}
						/ <code>onLoadAll</code> append rows to your <code>data</code>. A parent whose first page is not fetched yet
						has no child rows at all — while <code>hasMore</code> is true it shows a chevron anyway, so no placeholder
						rows are needed (the <code>logs</code> folder here starts empty). Override the link texts with{" "}
						<code>loadMoreLabel</code> / <code>loadAllLabel</code>, or the whole row with <code>renderLoadMore</code>.
						Mutually exclusive with <code>loadChildren</code>.
					</p>
				),
				content: <PaginatedDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "pagination.tsx", code: paginationCode },
					{ name: "shared.tsx", code: sharedCode }
				]
			},
			{
				label: "Flat Data",
				description: (
					<p>
						Instead of a nested <code>tree</code>, hand the wrapper a flat <code>data</code> array plus{" "}
						<code>getParentId</code> and it rebuilds the hierarchy itself — convenient when your data arrives normalized
						(e.g. from a database table or a flat store). Root rows simply omit a parent id.
					</p>
				),
				content: <FlatDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "flat-data.tsx", code: flatCode },
					{ name: "shared.tsx", code: sharedCode }
				]
			},
			{
				label: "Tree Column and Scrolling",
				description: (
					<p>
						<code>treeColumnKey</code> picks the column that carries the indent and chevron (by default the first one)
						and <code>indentSize</code> sets the pixels per level. <code>renderExpandToggle</code> swaps the built-in
						chevron for your own control: call <code>toggle()</code> to flip expansion and read <code>expanded</code> /{" "}
						<code>loading</code> for the affordance. Capture the handle from <code>scrollToNode</code> and call it with
						a row key (and optional <code>{"{ autoFocus }"}</code>) to scroll that row into view; a row hidden inside a
						collapsed ancestor is a no-op.
					</p>
				),
				content: <TreeColumnDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "tree-column.tsx", code: treeColumnCode },
					{ name: "shared.tsx", code: sharedCode }
				]
			},
			{
				label: "Drag and Drop",
				description: (
					<>
						<p>
							Pass <code>dragDropOptions</code> to make rows draggable. Drop near a row&apos;s top/bottom edge to
							reorder it (<code>before</code> / <code>after</code>) or over the middle of a folder to reparent it (
							<code>inside</code>). <code>onDrop</code> reports <code>{"{ source, target, position }"}</code> and the
							consumer mutates their own tree; the self/descendant cycle guard is built in.
						</p>
						<p>
							With <code>onDropToRoot</code> provided, the empty area below the last row becomes a drop zone that moves
							the row to the top level (the counterpart of the legacy <code>TreeTable</code>&apos;s{" "}
							<code>hideRoot</code> drop onto the body); <code>canDropToRoot</code> forbids it per row. The drop appends
							to the end, so here the row that is already the last top-level one is forbidden.
						</p>
						<p>
							The same moves work from the keyboard: focus a row and press <kbd>Space</kbd> to pick it up.{" "}
							<kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd> move it before the previous or after the next sibling,{" "}
							<kbd>Home</kbd> / <kbd>End</kbd> to the first or last position among its siblings, <kbd>ArrowRight</kbd>{" "}
							nests it under the sibling above it and <kbd>ArrowLeft</kbd> moves it out to sit right after its parent.{" "}
							<kbd>Space</kbd> or <kbd>Enter</kbd> drops, <kbd>Escape</kbd> cancels, and every step is announced to
							screen readers. <code>canDrag</code> / <code>canDrop</code> gate keyboard moves exactly as they gate
							pointer drags.
						</p>
					</>
				),
				content: <DragAndDropDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "drag-and-drop.tsx", code: dragAndDropCode },
					{ name: "shared.tsx", code: sharedCode }
				]
			},
			{
				label: "Accessibility",
				content: <AccessibilityDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: [
					{ name: "accessibility.tsx", code: accessibilityCode },
					{ name: "shared.tsx", code: sharedCode }
				],
				description: {
					info: (
						<>
							<p>
								Give the table an <code>ariaLabel</code> (or link an external heading with <code>ariaLabelledby</code>)
								so screen readers announce what the <code>treegrid</code> contains. The column-level{" "}
								<code>renderCell</code> hook and the <code>slots</code> property let you replace the content of the
								cells; custom content has to keep that ARIA intact.
							</p>
							<p>
								A generic control that sits in a row - here the <strong>Delete</strong> Button of the Action Column -
								carries no data of its own, so it has to be named after its node. The DataTreeTable already renders two
								elements you can point at, no custom cell needed. Each node below shows one way to do it:
							</p>
							<BulletList.Unordered>
								<BulletList.Item>
									<strong>Documents</strong> puts the name of the node in the Button&apos;s <code>title</code>.
								</BulletList.Item>
								<BulletList.Item>
									<strong>Invoices</strong> links the Button via <code>aria-labelledby</code> to{" "}
									<code>tree-node-title-&#123;key&#125;</code>, which wraps the name of the node together with the
									hidden <em>belongs to ...</em> text, so the name of the Button states the parent node as well.
								</BulletList.Item>
								<BulletList.Item>
									<strong>Archive</strong> links to <code>tree-node-name-&#123;key&#125;</code> instead, which wraps the
									name of the node alone.
								</BulletList.Item>
								<BulletList.Item>
									<strong>2025-Q4.pdf</strong> renders its name as a <strong>TextField</strong> and links the Button to
									that input. A referenced input contributes its value, so the name of the Button follows every
									keystroke - and the hidden label of the field stays out of it.
								</BulletList.Item>
							</BulletList.Unordered>
						</>
					),
					note: (
						<p>
							The <code>aria-labelledby</code> of a Button points to the Button itself as well as to the node. That self
							reference pulls in the Button&apos;s own name (<em>Delete</em>), so no hidden text element is needed just
							to hold it. The expand/collapse control is named after its node out of the box, through the same{" "}
							<code>tree-node-name-&#123;key&#125;</code> anchor. Both anchors are the ones the legacy{" "}
							<Link href="#/widgets/data-display/tree-table">TreeTable</Link> already exposes, so an{" "}
							<code>aria-labelledby</code> written against it keeps working after the migration. The expand/collapse
							control stays outside <code>tree-node-title-&#123;key&#125;</code>, so referencing it cannot fold the
							chevron into the name.
						</p>
					)
				}
			}
		]
	}
];

export default {
	label: "DataTreeTable",
	structure: showcases
};
