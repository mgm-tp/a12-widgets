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

import { fireEvent, getByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Range } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { RichTextEditor } from "../../rich-text-editor/index.js";
import { prepopulatedRichText } from "../../rich-text-editor/main/utils/common.js";

import { BodyCell } from "../new-api/table.body-cell.view.js";
import { HeadCell } from "../new-api/table.head-cell.view.js";
import type { BaseColumnType } from "../new-api/column.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../new-api/table.view.js";

describe("com.mgmtp.a12.widgets.table.context-menu", () => {
	test("body-context-menu", async () => {
		type ColumnType = BaseColumnType;
		const rowIndex = Math.floor(Math.random());

		const contextMenuRenderer = vi.fn();
		const COLUMN_COUNT = 4;
		const data: number[] = Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100);
		const column: ColumnType = { label: "", width: 1.5, subInfo: true, fixedWidth: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, contextMenuRenderer },
					columns: []
				}}
			>
				<BodyCell rowIndex={rowIndex} row={data} column={column} />
			</TableContextProvider>
		);
		const bodyCell = getByDataRole(container, DataRoles.Table.Body.Cell);

		fireEvent.contextMenu(bodyCell);
		expect(contextMenuRenderer).toHaveBeenCalledWith({
			row: data,
			column,
			rowIndex,
			closeHandler: expect.any(Function)
		});
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
	});

	test("header-context-menu", async () => {
		type ColumnType = BaseColumnType;

		const column: ColumnType = { label: "", title: "title test" };
		const headContextMenuRenderer = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, headContextMenuRenderer },
					columns: []
				}}
			>
				<HeadCell column={column} />
			</TableContextProvider>
		);
		const headerCell = getByDataRole(container, DataRoles.Table.Header.Cell);

		fireEvent.contextMenu(headerCell);
		expect(headContextMenuRenderer).toHaveBeenCalledWith({
			column,
			closeHandler: expect.any(Function)
		});
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
	});

	test("header-context-menu-for-crossTabulation", async () => {
		type ColumnType = BaseColumnType;
		const rowIndex = Math.floor(Math.random());

		const contextMenuRenderer = vi.fn();
		const headContextMenuRenderer = vi.fn();
		const COLUMN_COUNT = 4;
		const data: number[] = Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100);
		const column: ColumnType = { label: "", verticalHeader: true };

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: { ...DefaultTableComponentRenderers, contextMenuRenderer, headContextMenuRenderer },
					columns: []
				}}
			>
				<BodyCell rowIndex={rowIndex} row={data} column={column} />
			</TableContextProvider>
		);
		const bodyCell = getByDataRole(container, DataRoles.Table.Body.Cell);

		fireEvent.contextMenu(bodyCell);
		expect(contextMenuRenderer).toHaveBeenCalledTimes(0);
		expect(headContextMenuRenderer).toHaveBeenCalledWith({
			column,
			closeHandler: expect.any(Function)
		});
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
	});

	test("Should not open context menu on Rich Text Editor element", async () => {
		type ColumnType = BaseColumnType;
		const rowIndex = Math.floor(Math.random());

		const contextMenuRenderer = vi.fn();
		const COLUMN_COUNT = 4;
		const data: number[] = Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100);
		const column: ColumnType = { label: "editor", dataKey: "editor" };

		const { queryByDataRole, getByDataRole } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						contextMenuRenderer,
						bodyContentRenderer: (props) => {
							if (props.column.dataKey === "editor") {
								return <RichTextEditor />;
							}

							return DefaultTableComponentRenderers.bodyContentRenderer(props);
						}
					},
					columns: []
				}}
			>
				<BodyCell rowIndex={rowIndex} row={data} column={column} />
			</TableContextProvider>
		);
		const editor = getByDataRole(DataRoles.RichTextEditor);

		// Right-click on the editor
		await userEvent.click(editor, { button: "right" });

		expect(contextMenuRenderer).not.toHaveBeenCalled();
		const portal = queryByDataRole(DataRoles.AttachedPortal);
		expect(portal).not.toBeInTheDocument();
	});

	test("Should not open the context menu on a non-empty readonly rich text editor element.", async () => {
		type ColumnType = BaseColumnType;
		const rowIndex = Math.floor(Math.random());

		const contextMenuRenderer = vi.fn();
		const COLUMN_COUNT = 4;
		const data: number[] = Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100);
		const column: ColumnType = { label: "editor", dataKey: "editor" };

		const { queryByDataRole, getByDataRole } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						contextMenuRenderer,
						bodyContentRenderer: (props) => {
							if (props.column.dataKey === "editor") {
								return (
									<RichTextEditor
										readonly
										initialConfig={{
											editorState: prepopulatedRichText("Hello")
										}}
									/>
								);
							}

							return DefaultTableComponentRenderers.bodyContentRenderer(props);
						}
					},
					columns: []
				}}
			>
				<BodyCell rowIndex={rowIndex} row={data} column={column} />
			</TableContextProvider>
		);
		const editor = getByDataRole(DataRoles.RichTextEditor);

		// Right-click on the editor
		await userEvent.click(editor, { button: "right" });

		expect(contextMenuRenderer).not.toHaveBeenCalled();
		const portal = queryByDataRole(DataRoles.AttachedPortal);
		expect(portal).not.toBeInTheDocument();
	});
});
