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

import { BasicDataTreeTable } from "./basic.js";
import { ControlledDataTreeTable } from "./controlled-expansion.js";
import { LazyDataTreeTable } from "./lazy-loading.js";
import { FlatDataTreeTable } from "./flat-data.js";
import { DragAndDropDataTreeTable } from "./drag-and-drop.js";
import sharedCode from "./shared.tsx?raw";
import basicCode from "./basic.tsx?raw";
import controlledCode from "./controlled-expansion.tsx?raw";
import lazyCode from "./lazy-loading.tsx?raw";
import flatCode from "./flat-data.tsx?raw";
import dragAndDropCode from "./drag-and-drop.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "DataTreeTable",
		description: (
			<>
				<p>
					<strong>DataTreeTable</strong> is a hierarchical wrapper over{" "}
					<Link href="#/widgets/data-display/datatable">DataTable</Link>, driven by the same headless model and your own
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
				code: { name: "controlled-expansion.tsx", code: controlledCode }
			},
			{
				label: "Lazy Loading",
				description: (
					<p>
						With <code>loadChildren</code>, a folder&apos;s children are fetched the first time it expands and then held
						internally (a progress indicator shows while a fetch is in flight). <code>isLeaf</code> tells the wrapper
						which rows can never expand, so files show no chevron. Leave children <code>undefined</code> (not{" "}
						<code>[]</code>) to mark a folder as unloaded.
					</p>
				),
				content: <LazyDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: { name: "lazy-loading.tsx", code: lazyCode }
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
				code: { name: "flat-data.tsx", code: flatCode }
			},
			{
				label: "Drag and Drop",
				description: (
					<p>
						Pass <code>dragDropOptions</code> to make rows draggable. Drop near a row&apos;s top/bottom edge to reorder
						it (<code>before</code> / <code>after</code>) or over the middle of a folder to reparent it (
						<code>inside</code>). <code>onDrop</code> reports <code>{"{ source, target, position }"}</code> and the
						consumer mutates their own tree; the self/descendant cycle guard is built in.
					</p>
				),
				content: <DragAndDropDataTreeTable />,
				fitToSection: true,
				fullSize: true,
				code: { name: "drag-and-drop.tsx", code: dragAndDropCode }
			}
		]
	}
];

export default {
	label: "DataTreeTable",
	structure: showcases
};
