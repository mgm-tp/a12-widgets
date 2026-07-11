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

import DataTableAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/data-table/main/data-table.api.json" with { type: "json" };
import ColumnAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/table/main/column.api.json" with { type: "json" };
import DataTableRowsGroupAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/data-table/main/data-table-rows-group/data-table-rows-group.api.json" with { type: "json" };
import DataTableSlotsAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/data-table/main/data-table-slots.api.json" with { type: "json" };
import { BulletList, ExternalLink, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox } from "../../helpers/showcase-styles.js";

import { BasicTableShowcase } from "./basic-table.js";
import { ExpandableTableShowcase } from "./expandable-table.js";
import { ColumnGroupTableShowcase } from "./column-group.js";
import { RowGroupTableShowcase } from "./row-group.js";
import { ResizableTableShowcase } from "./advanced/resizable-column.js";
import { ResizableTableFlatShowcase } from "./advanced/resizable-column-flat.js";
import { CrossTabulationShowcase } from "./cross-tabulation.js";
import { CellSpanShowcase } from "./cell-span.js";
import { CustomizationTableShowcase } from "./customization.js";
import { SlotsTableShowcase } from "./slots.js";
import { DnDTableShowcase } from "./advanced/dnd.js";
import { ContextMenuTableShowcase } from "./advanced/context-menu.js";
import { VirtualizedTableShowcase } from "./advanced/virtualized.js";
import { ScrollToNodeTableShowcase } from "./scroll-to-node.js";
import { ColumnGroupAccessibility } from "./column-group-accessibility.js";
import { Accessibility } from "./accessibility.js";
import basicCode from "./basic-table.tsx?raw";
import expandableCode from "./expandable-table.tsx?raw";
import columnGroupCode from "./column-group.tsx?raw";
import columnGroupAccessibilityCode from "./column-group-accessibility.tsx?raw";
import rowGroupCode from "./row-group.tsx?raw";
import resizableCode from "./advanced/resizable-column.tsx?raw";
import resizableFlatCode from "./advanced/resizable-column-flat.tsx?raw";
import crossTabulationCode from "./cross-tabulation.tsx?raw";
import cellSpanCode from "./cell-span.tsx?raw";
import customizationCode from "./customization.tsx?raw";
import slotsCode from "./slots.tsx?raw";
import dnDCode from "./advanced/dnd.tsx?raw";
import contextMenuCode from "./advanced/context-menu.tsx?raw";
import virtualizedCode from "./advanced/virtualized.tsx?raw";
import scrollToNodeCode from "./scroll-to-node.tsx?raw";
import utilsCode from "./utils.ts?raw";
import accessibilityCode from "./accessibility.tsx?raw";
import dataCode from "./data.ts?raw";

const showcases: Showcase[] = [
	{
		label: "DataTable",
		description: (
			<>
				<p>
					The <strong>DataTable</strong> Widget is a presentational component that visualizes a data set in fully
					customizable rows and columns. It's often used to embed structured data in a way such that users can easily
					scan and look for patterns and insights. A <strong>DataTable</strong> can include:
				</p>
				<BulletList.Unordered>
					<BulletList.Item>A corresponding visualization</BulletList.Item>
					<BulletList.Item>Navigation</BulletList.Item>
					<BulletList.Item>Tools to query and manipulate data</BulletList.Item>
				</BulletList.Unordered>
			</>
		),
		sections: {
			basic: {
				sections: [
					{
						label: "Basic",
						content: <BasicTableShowcase />,
						description: (
							<>
								<p>
									A <strong>DataTable</strong> has two important properties you should take note of:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>data</code>: let you define the data that should be displayed as rows in the table.
									</BulletList.Item>
									<BulletList.Item>
										<code>columns</code>: let you define the columns of the table. Each column is of type{" "}
										<code>DataTableColumn</code> which lets you specify the column's label, width, alignments, pinning
										and so forth.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									Other key properties you'll frequently use are <code>width</code>, <code>fixedWidth</code>,{" "}
									<code>pinning</code> and <code>actionColumn</code>.
								</p>
								<p>
									The default value of <code>width</code> is <strong>1.0</strong>, but other decimal values (up to 2
									decimal places) can also be passed; <strong>0.5</strong> or <strong>1.3</strong>, for example.
								</p>
								<p>
									Normally the widths of the various columns are calculated automatically based on the table's width,
									the <strong>width</strong> property of each column and the total number of columns.
								</p>
								<p>
									However, for columns where <code>fixedWidth</code> is set to <strong>true</strong>, a fixed width of{" "}
									<strong>width*150px</strong> will be applied. Unlike normal columns, those with fixed widths will NOT
									shrink/expand as the width of the table changes. By default, columns have <code>fixedWidth</code> set
									to <strong>false</strong>, except for pinned columns where its set to <strong>true</strong>.
								</p>
								<p>
									Speaking of pinned columns, when screen space is limited it may not be possible for all of your
									columns to display at once without scrolling. If some of your columns are particularly important, you
									can prioritize them to display without scrolling by setting their <code>pinning</code> property to{" "}
									<strong>true</strong>.
								</p>
								<p>
									If you need to include some type of actions in your table such as editing or deleting, you can use an{" "}
									<code>actionColumn</code> (or multiple action columns).
								</p>
								<p>The example below uses many features of the DataTable widget:</p>
								<BulletList.Unordered>
									<BulletList.Item>Pinned Column, Column Width and Column Alignment</BulletList.Item>
									<BulletList.Item>Action Column</BulletList.Item>
									<BulletList.Item>Select & Sort</BulletList.Item>
									<BulletList.Item>Row Highlighting</BulletList.Item>
								</BulletList.Unordered>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "basic-table.tsx", code: basicCode },
							{ name: "utils.ts", code: utilsCode }
						]
					},
					{
						label: "Expandable",
						content: <ExpandableTableShowcase />,
						description: {
							info: (
								<>
									<p>
										The example below optimizes the DataTable widget with additional contents for the Header Row and
										Body Rows.
									</p>
									<p>
										You can trigger the Filter Header Cell to display the filters for the Body's data. These filters
										have been added to this example through the column-level <code>renderFilter</code> hook — providing
										it on any column activates the header filter row.
									</p>
									<p>
										You can also expand each Row to see the additional content. These additional contents are made of{" "}
										<code>DataTableTemplate.ExpandableRow</code>, <code>DataTableTemplate.ExpandableRowBody</code> and{" "}
										<code>DataTableTemplate.ExpandableRowFooter</code> returned from the <code>render</code> function of
										the <code>rowExpansion</code> property. Also, the column-level <code>renderFooter</code> hook has
										been used to create the Footer of the nested history table.
									</p>
									<p>Besides, additional features have also been added to make this example feel more alive:</p>
									<BulletList.Unordered>
										<BulletList.Item>
											<Link href="#/widgets/data-display/pagination">Pagination</Link> widget has been used to navigate
											between pages of the table.
										</BulletList.Item>
										<BulletList.Item>Action Column</BulletList.Item>
										<BulletList.Item>Select & Sort</BulletList.Item>
										<BulletList.Item>Row Highlighting</BulletList.Item>
									</BulletList.Unordered>
								</>
							),
							note: (
								<>
									<span>
										The recommended way of supporting <strong>accessibility</strong> for the expandable table is to pass
										the <code>buttonAttributes</code> and <code>title</code> properties into the Icon Button that
										triggers opening/closing the expandable row. For the sake of clarity, let's look at an example:
									</span>
									<StyledShowcaseBulletListInMessageBox>
										<BulletList.Item>
											Set <code>buttonAttributes</code> to <code>&#123;"aria-expanded"=true/false&#125;</code> when the
											Icon Button is clicked/not clicked.
										</BulletList.Item>
										<BulletList.Item>
											Set <code>title</code> to <code>open/close</code> when the Icon Button is clicked/not clicked.
										</BulletList.Item>
									</StyledShowcaseBulletListInMessageBox>
								</>
							)
						},
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "expandable-table.tsx", code: expandableCode },
							{ name: "utils.ts", code: utilsCode }
						]
					},
					{
						label: "Column Grouping",
						content: <ColumnGroupTableShowcase />,
						description: (
							<>
								<p>
									In some cases that you need to create a multi-column table, you can make any Column expand across its
									Sub-columns by passing the <code>subColumns</code> property to its data. The DataTable allows to nest
									its Columns to upmost 3 levels. To further customize the header Cell of the spanned Column, please use
									the <code>headCellGroup</code> slot provided in the <code>slots</code> property.
								</p>
								<p>Each spanned Column will have the following behaviors:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										The <code>horizontalAlignment</code> and <code>verticalAlignment</code> properties are centered by
										default and have no effect on its <code>subColumns</code>.
									</BulletList.Item>
									<BulletList.Item>
										The following properties will be ignored:
										<BulletList.Unordered type="circle">
											<BulletList.Item>
												<code>sortable</code>
											</BulletList.Item>
											<BulletList.Item>
												<code>sortDirections</code>
											</BulletList.Item>
											<BulletList.Item>
												<code>width</code>
											</BulletList.Item>
											<BulletList.Item>
												<code>fixedWidth</code>
											</BulletList.Item>
											<BulletList.Item>
												specific <code>horizontalAlignment</code>: <code>{`{body, foot}`}</code>
											</BulletList.Item>
											<BulletList.Item>
												specific <code>verticalAlignment</code>: <code>{`{body, foot}`}</code>
											</BulletList.Item>
										</BulletList.Unordered>
									</BulletList.Item>
									<BulletList.Item>
										The <code>pinning</code> only works for the <strong>first-level</strong> column-span.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									In this example, besides of the multi-columns, additional features have also been added to make it
									more alive:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>Pinned columns</BulletList.Item>
									<BulletList.Item>Select & Sort</BulletList.Item>
									<BulletList.Item>Row Highlighting</BulletList.Item>
								</BulletList.Unordered>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "column-group.tsx", code: columnGroupCode },
							{ name: "utils.ts", code: utilsCode },
							{ name: "data.ts", code: dataCode }
						]
					},
					{
						label: "Column Grouping Accessibility",
						content: <ColumnGroupAccessibility />,
						description: (
							<>
								<p>
									This example demonstrates column grouping with the DataTable's built-in accessibility support. Unlike
									the production Table widget — which gates the enhanced ARIA mode behind an{" "}
									<code>enableColumnGroupA11y</code> opt-in — DataTable applies the semantic attributes unconditionally,
									so column-grouped tables are screen-reader-friendly out of the box.
								</p>
								<p>The DataTable surfaces the following without any prop toggle:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										Native <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>,{" "}
										<code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code> and <code>&lt;td&gt;</code> elements (no overridden
										ARIA roles required)
									</BulletList.Item>
									<BulletList.Item>
										<code>aria-colspan</code> and <code>aria-rowspan</code> on grouped header cells, sized to the
										underlying column-group span
									</BulletList.Item>
									<BulletList.Item>
										<code>scope="colgroup"</code> on group headers and <code>scope="col"</code> on leaf headers
									</BulletList.Item>
									<BulletList.Item>
										<code>aria-rowindex</code> on body rows so screen readers announce position within the full grid
									</BulletList.Item>
								</BulletList.Unordered>
								<p>Additional features included in this example:</p>
								<BulletList.Unordered>
									<BulletList.Item>Column grouping with sub-columns</BulletList.Item>
									<BulletList.Item>Sortable columns</BulletList.Item>
									<BulletList.Item>Row selection</BulletList.Item>
									<BulletList.Item>Interactive elements (email links)</BulletList.Item>
								</BulletList.Unordered>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "column-group-accessibility.tsx", code: columnGroupAccessibilityCode },
							{ name: "utils.ts", code: utilsCode },
							{ name: "data.ts", code: dataCode }
						]
					},
					{
						label: "Row Grouping",
						content: <RowGroupTableShowcase />,
						description: {
							info: (
								<>
									<p>
										This example makes use of the <strong>DataTableRowsGroup</strong> widget that is recommended to use
										when the table requires grouping rows.
									</p>
									<p>
										The <code>data</code> property used in the DataTableRowsGroup is a set of <strong>RowsGroup</strong>{" "}
										which contain the following properties:
									</p>
									<BulletList.Unordered>
										<BulletList.Item>
											<code>head</code>: the title of the group.
										</BulletList.Item>
										<BulletList.Item>
											<code>subRows</code>: rows that should be grouped.
										</BulletList.Item>
										<BulletList.Item>
											<code>ariaLabel</code>: should be used to make screen readers recognize and read it as a group by
											setting the value the same as the <code>head</code> property.
										</BulletList.Item>
										<BulletList.Item>
											<code>collapsed</code>: to hide or show corresponding sub rows.
										</BulletList.Item>
									</BulletList.Unordered>
									<p>
										To collapse/expand a row group, pass an <code>onGroupHeaderClick</code> handler that toggles the
										group's <code>collapsed</code> state. The visual content of the group header can be customized
										through the <code>rowGroupHeader</code> slot of the <code>slots</code> property.
									</p>
								</>
							),
							note: (
								<>
									<span>
										Accessibility comes built in: when an <code>onGroupHeaderClick</code> handler is provided, the group
										header content is automatically wrapped in a native <code>&lt;button&gt;</code> element that carries
										the appropriate <code>aria-expanded</code> state, so keyboard interaction and screen-reader
										semantics work out of the box.
									</span>
									<span>
										A custom <code>rowGroupHeader</code> slot therefore only needs to render the visual content, for
										example:
									</span>
									<StyledShowcaseBulletListInMessageBox>
										<BulletList.Item>
											A collapse indicator (e.g. an <code>Icon</code>) that reflects the <code>collapsed</code> prop of
											the slot.
										</BulletList.Item>
										<BulletList.Item>
											The group title, available as the slot's <code>defaultContent</code> prop.
										</BulletList.Item>
									</StyledShowcaseBulletListInMessageBox>
								</>
							)
						},
						fitToSection: true,
						fullSize: true,
						code: { name: "row-group.tsx", code: rowGroupCode }
					},
					{
						label: "Cross Tabulation",
						content: <CrossTabulationShowcase />,
						description: (
							<>
								<p>
									To create a Cross Tabulation similar to the following example, please define the columns as usual and
									set <code>verticalHeader</code> to the one that is expected to be a vertical header. That column will
									be pinned left by default. Once <code>verticalHeader</code> property is set, the other left side pin
									would be considered as a vertical header as well.
								</p>
								<p>
									A vertical header is actually a normal column filled with body cell content but has the same styling
									as the horizontal header, so it could only be sorted vertically.
								</p>
								<p>
									It is recommended to also use the <code>cellHiglighting</code> property for Cross Tabulation to make
									the corresponding Header Cells highlighted when hovering over the Body Cells.
								</p>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: { name: "cross-tabulation.tsx", code: crossTabulationCode }
					},
					{
						label: "Cell Spanning",
						content: <CellSpanShowcase />,
						description: (
							<>
								<p>
									A body cell can merge horizontally over the following columns by providing the column-level{" "}
									<code>cellSpan</code> hook. It receives the same context as <code>renderCell</code> (<code>row</code>,{" "}
									<code>rowIndex</code>, <code>column</code>, <code>columnIndex</code>, <code>value</code>) and returns{" "}
									<code>{`{ colSpan }`}</code>; a <code>colSpan</code> greater than 1 renders a single{" "}
									<code>{`<td colSpan>`}</code> and the covered columns emit no cell. This is resolved per row, so it is
									ideal for summary / total rows where a label should stretch across several descriptive columns.
								</p>
								<p>The resolved span is clamped so the table stays well-formed:</p>
								<BulletList.Unordered>
									<BulletList.Item>it never exceeds the number of remaining leaf columns, and</BulletList.Item>
									<BulletList.Item>
										it never crosses a <code>pinning</code> boundary — every covered column must share the origin's
										pinning side.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									Spanning works in virtualized and infinite-scroll modes too. Note that only horizontal merging (
									<code>colSpan</code>) is supported — vertical merging (<code>rowSpan</code>) is intentionally out of
									scope.
								</p>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: { name: "cell-span.tsx", code: cellSpanCode }
					},
					{
						label: "Customizations",
						content: <CustomizationTableShowcase />,
						description: (
							<>
								<p>The DataTable offers many options for customization.</p>
								<p>In this example:</p>
								<BulletList.Unordered>
									<BulletList.Item>
										The <em>Status</em> Column has been configured as <code>subInfo</code> to mark the cells of that
										column as sub-info areas. You can do this by setting the <code>subInfo</code> property of any Column
										to <code>true</code>.
									</BulletList.Item>
									<BulletList.Item>There are 3 Row variants: selected, success, and disabled.</BulletList.Item>
									<BulletList.Item>
										Cells in the <em>Description</em> Column have been configured as <strong>secondaryCell</strong> to
										mark them as secondary info. You can do this by setting the <code>useSecondaryColor</code> of the{" "}
										<code>cellStyling</code> property to <code>true</code>.
									</BulletList.Item>
								</BulletList.Unordered>
							</>
						),
						code: { name: "customization.tsx", code: customizationCode },
						fitToSection: true,
						fullSize: true
					},
					{
						label: "Slots & column render hooks",
						content: <SlotsTableShowcase />,
						description: (
							<>
								<p>
									The <code>slots</code> property and the column-level render hooks are the two complementary ways of
									customizing how the DataTable renders.
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<strong>Column render hooks</strong> (<code>renderCell</code>, <code>renderHeader</code>,{" "}
										<code>renderFooter</code>, <code>renderFilter</code>) own one column&apos;s presentation while{" "}
										<code>dataKey</code>/<code>dataGetter</code> keep resolving the value. Providing{" "}
										<code>renderFooter</code> or <code>renderFilter</code> on any column activates the footer or the
										header filter row.
									</BulletList.Item>
									<BulletList.Item>
										<strong>Slots are components</strong>, not render functions: they receive fully resolved props
										(container slots receive the pre-built subtree as <code>children</code>), may use hooks, and can
										compose the self-wiring primitives (<code>DataTable.Row</code>, <code>DataTable.Head</code>, …) so
										sorting, selection, keyboard navigation and context menus keep working.
									</BulletList.Item>
									<BulletList.Item>
										Slot component identities must be <strong>stable across renders</strong> — declare them at module
										scope or memoize them; an inline <code>{"slots={{ row: (p) => … }}"}</code> object remounts the
										subtree on every render.
									</BulletList.Item>
								</BulletList.Unordered>
							</>
						),
						code: { name: "slots.tsx", code: slotsCode },
						fitToSection: true,
						fullSize: true
					},
					{
						label: "Accessibility",
						content: <Accessibility />,
						code: { name: "accessibility.tsx", code: accessibilityCode },
						fitToSection: true,
						fullSize: true,
						description: (
							<>
								<p>
									The <code>slots</code> property and the column-level render hooks (<code>renderCell</code>,{" "}
									<code>renderHeader</code>) let you customize what the table renders. When providing custom content,
									ensure accessibility is preserved by including the appropriate ARIA attributes and roles.
								</p>
								<p>
									To expose row data to the screen reader (e.g. reading the row ID when an action button is focused),
									include it in the button's <code>title</code> or use a <code>HiddenText</code> linked via button's{" "}
									<code>aria-describedby</code>/<code>aria-labelledby</code>. See the Checkbox and Action Column in the
									example below.
								</p>
							</>
						)
					}
				]
			},
			advanced: {
				sections: [
					{
						label: "Resizable Columns",
						content: <ResizableTableShowcase />,
						description: (
							<>
								<p>
									This example introduces the behavior of resizing columns by using the <code>onEndResize</code> handler
									of the <code>columnResizingOptions</code> property. Each column has a property called{" "}
									<code>minResizeWidth</code> to define the smallest width that a column can be resized to. By default,{" "}
									<code>minResizeWidth</code> is <code>0.1</code>.
								</p>
								<p>
									For the action column, the resizing behavior will not be applied since its width always requires
									keeping all of its children visible.
								</p>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "resizable-column.tsx", code: resizableCode },
							{ name: "utils.ts", code: utilsCode }
						]
					},
					{
						label: "Resizable Columns (Flat)",
						content: <ResizableTableFlatShowcase />,
						description: (
							<>
								<p>
									Same as the previous example but with a flat list of columns (no nested <code>subColumns</code>/column
									groups). Useful when every column is a leaf and you want to verify resizing behavior in the simpler
									single-row header case.
								</p>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "resizable-column-flat.tsx", code: resizableFlatCode },
							{ name: "utils.ts", code: utilsCode }
						]
					},
					{
						label: "Drag and Drop",
						content: <DnDTableShowcase />,
						description: (
							<>
								<p>
									To implement a "Drag and Drop DataTable", an object of type <code>DragDropOptions</code> should be
									passed to <code>DataTable</code> via the <code>dragDropOptions</code> property.
								</p>
								<p>
									In this example, the "onDrop" function is defined to handle the <code>onDrop</code> event. Once the
									event is triggered, the function will move the dragged row to the location where the row is dropped by
									updating the data.
								</p>
								<p>
									<strong>Note:</strong> We can still disable the drag and drop feature for specific interactive
									elements on the table rows (such as buttons, checkboxes, and radio buttons) by setting the{" "}
									<code>canDrag</code> return value to <code>false</code> via the <code>dragDropOptions</code> property.
								</p>
							</>
						),
						fitToSection: true,
						fullSize: true,
						code: [
							{ name: "dnd.tsx", code: dnDCode },
							{ name: "utils.ts", code: utilsCode }
						]
					},
					{
						label: "Virtualized",
						content: <VirtualizedTableShowcase />,
						fitToSection: true,
						fullSize: true,
						description: {
							info: (
								<div>
									<p>
										This showcase demonstrates a windowed table where only rows in (and near) the visible viewport are
										committed to the DOM. Windowing keeps scroll performance constant regardless of dataset size.
									</p>
									<p>
										Pass an object to <code>virtualScrollOptions</code> with at minimum a fixed <code>rowHeight</code>{" "}
										and optionally an <code>overscan</code> (number of rows rendered above and below the viewport).
										Internally, DataTable virtualizes with&nbsp;
										<ExternalLink href="https://tanstack.com/virtual">@tanstack/react-virtual</ExternalLink>, but the
										virtualizer is not part of the public surface — consumers configure it only through{" "}
										<code>virtualScrollOptions</code>.
									</p>
									<p>
										Virtualized mode requires <code>maxHeight</code> so the table has a bounded scroll container. Column
										widths resolve exactly as in non-virtualized mode (a column without a <code>width</code> defaults to{" "}
										<code>width: 1</code> and flexes), since all rows share one <code>colgroup</code>. Dynamic row
										heights <em>are not supported</em> in this v1 surface — set a single <code>rowHeight</code> that
										fits every row. To programmatically scroll to a row, use the table-level <code>scrollToNode</code>{" "}
										prop (see the &quot;Scroll to Node&quot; example).
									</p>
									<p>
										For escape-hatch control, the&nbsp;
										<code>slots.virtualizedBody</code> slot lets you replace the entire virtualized{" "}
										<code>&lt;tbody&gt;</code> implementation while still receiving the orchestrator's row-render
										callbacks.
									</p>
								</div>
							),
							warning: (
								<>
									<p>
										Virtualized tables come with their own limitations — windowing can decrease perceived performance if
										the user is reading sequentially, since rows have to mount as they come into view. Use windowing
										only when the dataset is large enough that eagerly rendering every row would hurt mount time or
										scroll smoothness.
									</p>
								</>
							)
						},
						code: [
							{ name: "virtualized.tsx", code: virtualizedCode },
							{ name: "utils.ts", code: utilsCode }
						]
					},
					{
						label: "Context Menu",
						content: <ContextMenuTableShowcase />,
						fitToSection: true,
						fullSize: true,
						description: (
							<>
								<p>
									To create a <strong>DataTable</strong> with context menu settings which can be displayed by
									right-clicking on a Row or a Column Header, you can make use of the <code>contextMenu</code> and the{" "}
									<code>headContextMenu</code> slots of the <code>slots</code> property:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>contextMenu</code>: you can use this slot component to customize the context menu for each row
										by using its provided properties:
										<BulletList.Unordered type="circle">
											<BulletList.Item>
												<code>rowIndex</code>: the index value of the right-clicked row.
											</BulletList.Item>
											<BulletList.Item>
												<code>row</code>: the data of the right-clicked row.
											</BulletList.Item>
											<BulletList.Item>
												<code>closeHandler</code>: the handler for you to close the context menu.
											</BulletList.Item>
										</BulletList.Unordered>
									</BulletList.Item>
									<BulletList.Item>
										<code>headContextMenu</code>: You can use this slot component to customize the context menu for each
										DataTable Header by using its provided properties:
										<BulletList.Unordered type="circle">
											<BulletList.Item>
												<code>column</code>: the data of the column where the Header Cell got right-clicked.
											</BulletList.Item>
											<BulletList.Item>
												<code>closeHandler</code>: the handler for you to close the context menu.
											</BulletList.Item>
										</BulletList.Unordered>
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									To disable the context menu from some specific Rows, you can set the{" "}
									<code>disabledRightClickContextMenu</code> property to <strong>true</strong> while decorating those
									Rows with the <code>RowStyling</code> property.
								</p>
								<p>In this example, the DataTable has been configured with context menus for Headers and Rows.</p>
							</>
						),
						code: [
							{ name: "context-menu.tsx", code: contextMenuCode },
							{ name: "utils.ts", code: utilsCode }
						]
					},
					{
						label: "Scroll to Node",
						content: <ScrollToNodeTableShowcase />,
						fitToSection: true,
						fullSize: true,
						description: (
							<>
								<p>
									The <code>scrollToNode</code> property allows you to programmatically scroll to a specific row in the
									table by its index. This is useful when you need to navigate to a particular row in response to user
									actions or application state changes.
								</p>
								<p>
									The <code>scrollToNode</code> property accepts a callback function that receives a handler. This
									handler can be called with two parameters:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>nodeId</code>: The zero-based index of the row to scroll to.
									</BulletList.Item>
									<BulletList.Item>
										<code>options</code>: An optional object with an <code>autoFocus</code> property that, when set to{" "}
										<strong>true</strong>, will focus the row after scrolling.
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									This feature works seamlessly with standard tables, virtualized tables, and infinite scroll tables.
								</p>
							</>
						),
						code: [{ name: "scroll-to-node.tsx", code: scrollToNodeCode }]
					}
				]
			}
		}
	}
];

export default {
	label: "DataTable",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				name: "DataTable",
				declaration: DataTableAPI,
				filter: ["DataTableProps", "DataTableVirtualScrollOptions", "DataTableInfiniteScrollOptions"]
			},
			{
				name: "DataTableSlots",
				declaration: DataTableSlotsAPI,
				filter: ["DataTableSlots", "DataTableRowExpansion"]
			},
			{
				name: "Column",
				declaration: ColumnAPI
			},
			{
				name: "Row Group",
				declaration: DataTableRowsGroupAPI,
				filter: ["DataTableRowsGroupProps", "RowsGroup"]
			}
		],
		themingConfiguration: "table"
	}
};
