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

import basicCode from "!./basic.tsx?raw";
import searchAndShowAllCode from "!./search-and-show-all.tsx?raw";
import smallScreenCode from "!./small-screen.tsx?raw";

import { Link } from "@com.mgmtp.a12.widgets/widgets-core";
import ColumnVisibilityPanelAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/column-visibility-panel/main/column-visibility-panel.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { ColumnVisibilityShowcase } from "./basic.js";
import { SearchAndShowAllShowcase } from "./search-and-show-all.js";
import { SmallScreenShowcase } from "./small-screen.js";

const showcases: Showcase[] = [
	{
		label: "Column Visibility Panel",
		description: (
			<p>
				The <strong>Column Visibility Panel</strong> lets the end user decide which columns a table shows. It lists one
				checkbox per column, keeps the panel open while the user toggles them and offers an action that restores the
				columns' default visibility. It works with every table widget —{" "}
				<Link href="#/widgets/data-display/table">Table</Link>,{" "}
				<Link href="#/widgets/data-display/tree-table">Tree Table</Link> and <code>DataTable</code> — because it takes a
				plain list of items instead of a column model.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: {
					info: (
						<>
							<p>
								The panel owns its surface: the width band the column names are read in, the list that scrolls once it
								grows too long, the dialog semantics and the presentation on a small screen. What stays with you is the
								trigger that opens it, where you place it, and which columns you then hand to the table — the panel
								reports the visibility, it does not hide anything itself.
							</p>
							<p>
								Give an item <code>defaultVisible: false</code> for a column the table starts out without, and{" "}
								<code>disabled</code> for a column the user must not hide, such as a key column, an action column or the
								hierarchical column of a tree. The reset action is disabled while nothing deviates from those defaults,
								and <code>hasColumnVisibilityDeviation</code> tells you the same thing for marking your trigger.
							</p>
						</>
					),
					note: (
						<p>
							The panel is a dialog: it is announced with its title, and it closes on ESC, on an outside click and — in
							the modal presentation — through its close button, always returning the focus to the trigger. TAB wraps
							around inside it; set <code>closeOnTabOut</code> to <code>true</code> to have the focus leave the panel
							instead, closing it and continuing where it was opened.
						</p>
					)
				},
				content: <ColumnVisibilityShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Search and Show All",
				description: {
					info: (
						<>
							<p>
								For a table with more columns than fit on a screen, <code>searchable</code> adds a search field that
								narrows the list to the columns whose name matches what is typed — by the item's <code>title</code>{" "}
								where its label is not a text — and takes the focus when the panel opens. <code>showAll</code> adds an
								action that shows every column the list currently holds, so the user need not tick them back on one by
								one.
							</p>
							<p>
								While a search narrows the list, show-all applies to the narrowed list only, i.e. to what the user can
								see, and it never touches a <code>disabled</code> row.
							</p>
						</>
					)
				},
				content: <SearchAndShowAllShowcase />,
				code: [
					{ name: "search-and-show-all.tsx", code: searchAndShowAllCode },
					{ name: "basic.tsx", code: basicCode }
				]
			},
			{
				label: "Small Screens",
				description: (
					<p>
						With the default <code>presentation="auto"</code> the panel is anchored to the trigger on a desktop and
						turns into a modal with an explicit close button on a small screen or a touch device. Set{" "}
						<code>presentation</code> to <code>"modal"</code> or <code>"attached"</code> to decide it yourself — this
						example forces the modal.
					</p>
				),
				content: <SmallScreenShowcase />,
				code: [
					{ name: "small-screen.tsx", code: smallScreenCode },
					{ name: "basic.tsx", code: basicCode }
				]
			}
		]
	}
];

export default {
	label: "Column Visibility Panel",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ColumnVisibilityPanelAPI }],
		themingConfiguration: "columnVisibilityPanel"
	}
};
