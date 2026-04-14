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

import type { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { render, getAllByDataRole, fireEvent, getByDataRole, queryByDataRole } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { DragAndDropUtils } from "../../common/main/drag-and-drop-utils.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { TreeTable } from "../main/tree-table.view.js";
import type {
	TreeTableRowStyling,
	TreeTableRowEventHandlers,
	TreeTableComponentRenderers
} from "../main/tree-table.api.js";

import {
	GROUP_COLUMNS,
	COLUMNS,
	TREE_TABLE_NODE,
	createComplexColumns,
	COMPLEX_TREE_TABLE_NODE_CREATOR,
	createTableData
} from "./data.js";

describe("com.mgmtp.a12.widgets.tree-table", () => {
	test("rendering basic tree table with handler", () => {
		const onClick = vi.fn();
		const onArrowClick = vi.fn();
		const rowEventHandlers: TreeTableRowEventHandlers = ({ row }) => {
			return {
				onArrowClick: () => {
					onArrowClick(row);
				},
				onClick: () => {
					onClick(row);
				}
			};
		};

		const { container } = render(
			<TreeTable id="test" root={TREE_TABLE_NODE} columns={COLUMNS} rowEventHandlers={rowEventHandlers} />
		);
		expect(container.firstChild).toMatchSnapshot();

		const expanders: HTMLElement[] = getAllByDataRole(container, `tree-node-expander`);
		const random = Math.floor(Math.random() * expanders.length);
		const expanderButton = getByDataRole(expanders[random], `button`);
		const nodeId = expanders[random]?.getAttribute("id")?.replace("tree-node-arrow-", "");

		const row = expanders[random]?.closest<HTMLElement>(`[data-role=${DataRoles.Table.Body.Row}]`);
		fireEvent.click(expanderButton);
		expect(onArrowClick).toHaveBeenCalledTimes(1);
		expect(onArrowClick.mock.calls[0][0].id.toString()).toBe(nodeId);

		row && fireEvent.click(row);
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick.mock.calls[0][0].id.toString()).toBe(nodeId);
	});

	test("rendering basic tree table with column group", () => {
		const { container } = render(<TreeTable id="test" root={TREE_TABLE_NODE} columns={GROUP_COLUMNS} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering tree table with row styling", () => {
		const rowStyling: TreeTableRowStyling = ({ row }) => {
			return {
				highlightVariant: row.id === 1 ? "success" : "info",
				interactive: row.id === 2,
				selected: row.id === 3,
				disabled: row.id === 5
			};
		};

		const { container } = render(
			<TreeTable id="test" root={TREE_TABLE_NODE} rowStyling={rowStyling} columns={COLUMNS} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering tree table with dnd", () => {
		const { container } = render(
			<DndProvider backend={DragAndDropUtils.DefaultDndBackend} options={DragAndDropUtils.DefaultDndBackendOptions}>
				<TreeTable
					id="test"
					root={COMPLEX_TREE_TABLE_NODE_CREATOR()}
					columns={createComplexColumns()}
					dragDropOptions={{
						canDrag: ({ dragItem }): boolean => {
							if (dragItem.row.data.locked) {
								return false;
							}

							return true;
						},
						canDrop({ hoveredItem }): boolean {
							if (hoveredItem.row.data.locked) {
								return false;
							}

							return true;
						},
						onDrop(): void {}
					}}
				/>
			</DndProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering basic tree table with virtual scroll", () => {
		const { container } = render(
			<TreeTable
				id="test"
				root={TREE_TABLE_NODE}
				columns={COLUMNS}
				virtualScrollOptions={{
					rowHeight: 70
				}}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering resizable tree table", () => {
		const onEndResizeFn = vi.fn();
		const { container } = render(
			<TreeTable
				id="test"
				root={TREE_TABLE_NODE}
				columns={COLUMNS}
				columnResizingOptions={{ onResize: onEndResizeFn }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering tree table with additionalContentRenderer", () => {
		const componentRenderers: Partial<TreeTableComponentRenderers> = {
			additionalContentRenderer: ({ row }): ReactNode => <div>Row {row.id}</div>
		};
		const { container } = render(
			<TreeTable id="test" root={TREE_TABLE_NODE} columns={COLUMNS} componentRenderers={componentRenderers} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("interactive tree table with hidden root should have hidden text by default", () => {
		const onClick = vi.fn();
		const onArrowClick = vi.fn();
		const rowEventHandlers: TreeTableRowEventHandlers = ({ row }) => ({
			onArrowClick: () => onArrowClick(row),
			onClick: () => onClick(row)
		});

		const { container } = render(
			<div data-role="example-wrapper">
				<TreeTable
					id="test"
					hideRoot
					root={TREE_TABLE_NODE}
					columns={COLUMNS}
					rowEventHandlers={rowEventHandlers}
					ariaLabel="test label"
				/>
			</div>
		);

		const firstElement = queryByDataRole(container, "example-wrapper")?.firstElementChild;

		expect(container.firstChild).toMatchSnapshot();
		expect(firstElement).toBeTruthy();
		expect(firstElement?.getAttribute("data-role")).toBe(DataRoles.HiddenText);
	});

	test("empty tree table with only hidden root which is given via 'root' property should not have hidden text", () => {
		const onClick = vi.fn();
		const onArrowClick = vi.fn();
		const rowEventHandlers: TreeTableRowEventHandlers = ({ row }) => ({
			onArrowClick: () => onArrowClick(row),
			onClick: () => onClick(row)
		});

		const { container } = render(
			<div data-role="example-wrapper">
				<TreeTable
					id="test"
					hideRoot
					root={{ id: 1, icon: <Icon>computer</Icon>, data: ["My Computer", ...createTableData()], children: [] }}
					columns={COLUMNS}
					rowEventHandlers={rowEventHandlers}
					ariaLabel="test label"
				/>
			</div>
		);

		const firstElement = queryByDataRole(container, "example-wrapper")?.firstElementChild;

		expect(firstElement).toBeTruthy();
		expect(firstElement?.getAttribute("data-role")).toBe(`${DataRoles.Tree}`);
	});

	test("empty tree table with only hidden root which is given via 'data' property should not have hidden text", () => {
		const onClick = vi.fn();
		const onArrowClick = vi.fn();
		const rowEventHandlers: TreeTableRowEventHandlers = ({ row }) => ({
			onArrowClick: () => onArrowClick(row),
			onClick: () => onClick(row)
		});

		const { container } = render(
			<div data-role="example-wrapper">
				<TreeTable
					id="test"
					hideRoot
					data={[
						{ id: 1, icon: <Icon>computer</Icon>, data: ["My Computer", ...createTableData()], level: -1, children: [] }
					]}
					columns={COLUMNS}
					rowEventHandlers={rowEventHandlers}
					ariaLabel="test label"
				/>
			</div>
		);

		const firstElement = queryByDataRole(container, "example-wrapper")?.firstElementChild;

		expect(container.firstChild).toMatchSnapshot();
		expect(firstElement).toBeTruthy();
		expect(firstElement?.getAttribute("data-role")).toBe(`${DataRoles.Tree}`);
	});
});
