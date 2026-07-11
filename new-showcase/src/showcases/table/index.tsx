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

import TableAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/table/main/table.api.json" with { type: "json" };
import ColumnAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/table/main/column.api.json" with { type: "json" };
import TableRowsGroupAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/table/main/table-rows-group/table-row-group.api.json" with { type: "json" };
import TableRendererAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/table/main/table-renderer.api.json" with { type: "json" };
import { BulletList, ExternalLink, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";
import { StyledShowcaseBulletListInMessageBox, StyledShowcaseLinkInMessageBox } from "../../helpers/showcase-styles.js";

import { BasicTableShowcase } from "./basic-table.js";
import { ExpandableTableShowcase } from "./expandable-table.js";
import { ColumnGroupTableShowcase } from "./column-group.js";
import { RowGroupTableShowcase } from "./row-group.js";
import { ResizableTableShowcase } from "./advanced/resizable-column.js";
import { ResizableTableFlatShowcase } from "./advanced/resizable-column-flat.js";
import { CrossTabulationShowcase } from "./cross-tabulation.js";
import { CustomizationTableShowcase } from "./customization.js";
import { DnDTableShowcase } from "./advanced/dnd.js";
import { ContextMenuTableShowcase } from "./advanced/context-menu.js";
import { VirtualizedTableShowcase } from "./advanced/virtualized.js";
import { ScrollToNodeTableShowcase } from "./scroll-to-node.js";
import { ColumnGroupAccessibility } from "./column-group-accessibility.js";
import { Accessibility } from "./accessibility.js";

import basicCode from "!./basic-table.tsx?raw";
import expandableCode from "!./expandable-table.tsx?raw";
import columnGroupCode from "!./column-group.tsx?raw";
import columnGroupAccessibilityCode from "!./column-group-accessibility.tsx?raw";
import rowGroupCode from "!./row-group.tsx?raw";
import resizableCode from "!././advanced/resizable-column.tsx?raw";
import resizableFlatCode from "!./advanced/resizable-column-flat.tsx?raw";
import crossTabulationCode from "!./cross-tabulation.tsx?raw";
import customizationCode from "!./customization.tsx?raw";
import dnDCode from "!./advanced/dnd.tsx?raw";
import contextMenuCode from "!./advanced/context-menu.tsx?raw";
import virtualizedCode from "!./advanced/virtualized.tsx?raw";
import scrollToNodeCode from "!./scroll-to-node.tsx?raw";
import utilsCode from "!./utils.ts?raw";
import accessibilityCode from "!./accessibility.tsx?raw";
import dataCode from "!./data.ts?raw";

const showcases: Showcase[] = [
	{
		label: "Table",
		description: (
			<>
				<p>
					The <strong>Table</strong> Widget is a presentational component that visualizes a data set in fully
					customizable rows and columns. It's often used to embed structured data in a way such that users can easily
					scan and look for patterns and insights. A <strong>Table</strong> can include:
				</p>
				<BulletList.Unordered>
					<BulletList.Item>A corresponding visualization</BulletList.Item>
					<BulletList.Item>Navigation</BulletList.Item>
					<BulletList.Item>Tools to query and manipulate data</BulletList.Item>
				</BulletList.Unordered>
				<p>
					Please have a look at the <Link href="#/examples/multiselect-table">Multiselect Table</Link> where we already
					implemented some features as an example.
				</p>
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
									A <strong>Table</strong> has two important properties you should take note of:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>data</code>: let you define the data that should be displayed as rows in the table.
									</BulletList.Item>
									<BulletList.Item>
										<code>columns</code>: let you define the columns of the table. Each column is of type{" "}
										<code>BaseColumnType</code> which lets you specify the column's label, width, alignments, pinning
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
								<p>The example below uses many features of the Table widget:</p>
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
										The example below optimizes the Table widget with additional contents for the Header Row and Body
										Rows.
									</p>
									<p>
										You can trigger the Filter Header Cell to display the filters for the Body's data. These filters
										have been added to this example by creating the <code>headFilterContentRenderer</code> of the{" "}
										<code>componentRenderers</code> property.
									</p>
									<p>
										You can also expand each Row to see the additional content. These additional contents are made of{" "}
										<code>TableTemplate.BodyRow</code>, <code>TableTemplate.ExpandableRow</code>,{" "}
										<code>TableTemplate.ExpandableRowBody</code> and <code>TableTemplate.ExpandableRowFooter</code> as
										the <code>additionalContentRenderer</code>
										inside the <code>componentRenderers</code> property. Also, the <code>footContentRenderer</code> and{" "}
										<code>footRowRenderer</code> of <code>componentRenderers</code> property has also been used to
										create the Footer.
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
									Sub-columns by passing the <code>subColumns</code> property to its data. The Table allows to nest its
									Columns to upmost 3 levels. To further customize the header Cell of the spanned Column, please use the{" "}
									<code>headCellGroupRenderer</code> provided in the <code>componentRenderers</code> property.
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
									This example demonstrates how to use the Table widget with column grouping and{" "}
									<code>enableColumnGroupA11y</code> enabled. When <code>enableColumnGroupA11y</code> is set to{" "}
									<code>true</code>, the table uses proper ARIA attributes and semantic HTML structure to provide better
									support for screen readers.
								</p>
								<p>
									With <code>enableColumnGroupA11y</code> enabled, the table will:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										Use <code>role="grid"</code> for the table container
									</BulletList.Item>
									<BulletList.Item>
										Use <code>role="rowgroup"</code> for header and body sections
									</BulletList.Item>
									<BulletList.Item>
										Use <code>role="row"</code> for each row
									</BulletList.Item>
									<BulletList.Item>
										Use <code>role="columnheader"</code> for header cells with appropriate <code>aria-colspan</code> and{" "}
										<code>aria-rowspan</code> attributes
									</BulletList.Item>
									<BulletList.Item>
										Use <code>role="cell"</code> for body cells
									</BulletList.Item>
									<BulletList.Item>
										Provide proper <code>aria-rowindex</code> and <code>aria-colindex</code> for better navigation
									</BulletList.Item>
								</BulletList.Unordered>
								<p>
									This enhanced accessibility mode ensures that screen readers can accurately announce the table
									structure, making it easier for users with visual impairments to navigate and understand the grouped
									columns.
								</p>
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
										This example makes use of the <strong>TableRowsGroup</strong> widget that is recommended to use when
										the table requires grouping rows.
									</p>
									<p>
										The <code>data</code> property used in the TableRowsGroup is a set of <strong>RowsGroup</strong>{" "}
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
										To collapse/expand a row group, you can customize the row group header by using{" "}
										<code>rowGroupHeaderRenderer</code> with an action button which is responsible for updating the row
										corresponding to the <code>collapsed</code> state.
									</p>
								</>
							),
							note: (
								<>
									<span>
										In this example, we follow A11Y requirements by using the{" "}
										<StyledShowcaseLinkInMessageBox href="#/widgets/general/link">Link</StyledShowcaseLinkInMessageBox>{" "}
										Widget with appropriate ARIA attributes, such as <code>role="button"</code> and{" "}
										<code>aria-expanded="true/false"</code>. This ensures compliance with hover, tab focus, and semantic
										standards.
									</span>
									<span>
										Additionally, accessibility in custom components using <code>rowGroupHeaderRenderer</code> can be
										enhanced by:
									</span>
									<StyledShowcaseBulletListInMessageBox>
										<BulletList.Item>
											Set <code>linkAttributes</code> to <code>{`{"aria-expanded": true/false}`}</code> depending on the
											collapsed state of the row.
										</BulletList.Item>
										<BulletList.Item>
											Set <code>title</code> to <code>Expand group/Collapse group</code> depending on the collapsed
											state of the row.
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
						label: "Customizations",
						content: <CustomizationTableShowcase />,
						description: (
							<>
								<p>The Table offers many options for customization.</p>
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
						label: "Accessibility",
						content: <Accessibility />,
						code: { name: "accessibility.tsx", code: accessibilityCode },
						fitToSection: true,
						fullSize: true,
						description: (
							<>
								<p>
									<code>componentRenderers</code> property lets you customize the table's rendered. When providing
									custom components, ensure accessibility is preserved by including the appropriate ARIA attributes and
									roles.
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
									To implement a "Drag and Drop Table", an object of type <code>DragDropOptions</code> should be passed
									to <code>Table</code> via the <code>dragDropOptions</code> property.
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
										This showcase demonstrates how to create a windowed table, with dynamic content size like images.
										This helps to improve rendering performance, since only part of the <strong>Table</strong> is
										rendered into the browser's DOM.
									</p>
									<p>
										The basic idea is enabling windowed rendering, by setting the <code>virtualScrollOptions</code>{" "}
										property to true. Behind the scenes, it enables rendering with&nbsp;
										<ExternalLink href="https://github.com/bvaughn/react-virtualized">react-virtualized</ExternalLink>.
										The <code>virtualScrollOptions</code> property can also take an object of type{" "}
										<code>ListProps</code> which is then passed to the original&nbsp;
										<ExternalLink href="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md">
											react-virtualized List
										</ExternalLink>{" "}
										component. In the <code>ListProps</code>, the <code>scrollToIndex</code> property is very useful for
										scrolling to a specific row in the table.
									</p>
									<p>
										For text-only content, simply enabling the <code>virtualScrollOptions</code> property should be
										enough. However, because images are loaded asynchronously, they need special treatment. To update
										the size measurement of the row, pass the <code>onRendered</code> callback to the{" "}
										<code>onLoad</code> event. For more information on how rows are measured, please see:&nbsp;
										<ExternalLink href="https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md">
											CellMeasurer
										</ExternalLink>
										.
									</p>
									<p>
										In this example, we have 1000 rows, and each row contains a different image of a different size.
										This results in our table being unusable due to poor performance from numerous complex operations
										such as scroll bar synchronization going on behind the scenes. Fortunately, with windowing we can
										avert these performance issues and our table with 1,000 rows behaves no differently than a table
										with only 10 rows.
									</p>
								</div>
							),
							note: (
								<div>
									<strong>For Accessibility:</strong> Because of the complicated HTML structure of the table body, the
									screen reader NVDA on Firefox can't detect columns and rows correctly. We DO NOT recommend using
									Virtualized Table for projects that need to support accessibility.
								</div>
							),
							warning: (
								<>
									<p>
										Virtualized <strong>Tables</strong> come with their own limitations. For that reason, you should
										think carefully before enabling virtualization. Sometimes windowing can actually decrease perceived
										performance because the user has to wait for each individual list item to load on scroll instead of
										waiting for one eager load of the entire list on mount. Beyond that, the dynamic calculation of the
										row heights will result in the scrollbar being updated incrementally which may result in a small
										"jump" effect when scrolling.
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
									To create a <strong>Table</strong> with context menu settings which can be displayed by right-clicking
									on a Row or a Column Header, you can make use of the <code>contextMenuRenderer</code> and the{" "}
									<code>headContextMenuRenderer</code> of the <code>componentRenderers</code> property:
								</p>
								<BulletList.Unordered>
									<BulletList.Item>
										<code>contextMenuRenderer</code>: you can use this renderer function to customize the context menu
										for each row by using its provided properties:
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
										<code>headContextMenuRenderer</code>: You can use this renderer function to customize the context
										menu for each Table Header by using its provided properties:
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
								<p>In this example, the Table has been configured with context menus for Headers and Rows.</p>
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
	label: "Table",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				name: "Table",
				declaration: TableAPI,
				filter: ["BaseTableProps", "RowStyles", "InfiniteScrollTableProps", "TableDragDropOptions"]
			},
			{
				name: "TableRenderer",
				declaration: TableRendererAPI,
				filter: ["TableComponentRenderers"]
			},
			{
				name: "Column",
				declaration: ColumnAPI
			},
			{
				name: "Row Group",
				declaration: TableRowsGroupAPI,
				filter: ["TableRowsGroupProps", "RowsGroup"]
			}
		],
		themingConfiguration: "table"
	}
};
