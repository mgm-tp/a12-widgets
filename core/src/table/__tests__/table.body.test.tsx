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

import { fireEvent, render, getAllByDataRole, getByDataRole } from "test-utils";
import { DndProvider } from "react-dnd";
import { describe, test, expect, vi } from "vitest";

import { Range } from "../../common/main/utils.js";
import { DragAndDropUtils } from "../../common/main/drag-and-drop-utils.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { DefaultTableComponentRenderers, TableContextProvider } from "../main/table.view.js";
import { Body } from "../main/table.body.view.js";

describe("com.mgmtp.a12.widgets.table.body", () => {
	const COLUMN_COUNT = 4;
	const ROW_COUNT = 10;

	const data: number[][] = Array.from(new Range(ROW_COUNT)).map(() =>
		Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100)
	);

	test("bodyRowRenderer", () => {
		const bodyRowRendererFn = vi.fn();
		const dndBodyRowRendererFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						bodyRowRenderer: bodyRowRendererFn,
						dndBodyRowRenderer: dndBodyRowRendererFn
					},
					columns: []
				}}
			>
				<Body data={data} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(bodyRowRendererFn).toHaveBeenCalledTimes(ROW_COUNT);
		expect(dndBodyRowRendererFn).toHaveBeenCalledTimes(0);
	});

	test("bodyRole", () => {
		const testRole = "test-role";
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers
					},
					columns: []
				}}
			>
				<Body data={data} role={testRole} />
			</TableContextProvider>
		);

		expect(container.firstChild).toHaveAttribute("role", testRole);
	});

	test("bodyRoleForCardView", () => {
		const testRole = "test-role";
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers
					},
					columns: [],
					cardView: true
				}}
			>
				<Body data={data} role={testRole} />
			</TableContextProvider>
		);

		expect(container.firstChild).not.toHaveAttribute("role", testRole);
		expect(container.firstChild).toHaveAttribute("role", "list");
	});

	test("dndBodyRowRendererFn", () => {
		const bodyRowRendererFn = vi.fn();
		const dndBodyRowRendererFn = vi.fn();

		const { container } = render(
			<DndProvider backend={DragAndDropUtils.DefaultDndBackend} options={DragAndDropUtils.DefaultDndBackendOptions}>
				<TableContextProvider
					value={{
						componentRenderers: {
							...DefaultTableComponentRenderers,
							bodyRowRenderer: bodyRowRendererFn,
							dndBodyRowRenderer: dndBodyRowRendererFn
						},
						columns: [],
						dragDropOptions: {}
					}}
				>
					<Body data={data} />
				</TableContextProvider>
			</DndProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(bodyRowRendererFn).toHaveBeenCalledTimes(0);
		expect(dndBodyRowRendererFn).toHaveBeenCalledTimes(ROW_COUNT);
	});

	test("cannot drag and drop when dragging over the action button", () => {
		const additionalContentRendererFn = vi.fn();
		const onClickFn = vi.fn();
		const onBeginDrag = vi.fn();
		const onEndDrag = vi.fn();

		const { container } = render(
			<DndProvider backend={DragAndDropUtils.DefaultDndBackend} options={DragAndDropUtils.DefaultDndBackendOptions}>
				<TableContextProvider
					value={{
						componentRenderers: {
							...DefaultTableComponentRenderers,
							additionalContentRenderer: additionalContentRendererFn,
							bodyContentRenderer: (props) => {
								if (props.column.actionColumn) {
									return (
										<Button icon={<Icon>delete</Icon>} title="Delete" onClick={(event) => event.stopPropagation()} />
									);
								}

								return DefaultTableComponentRenderers.bodyContentRenderer(props);
							}
						},
						columns: [
							{ label: "Company", dataKey: "company.name" },
							{ label: "", actionColumn: true, pinning: "right" }
						],
						cardView: true,
						rowEventHandlers: () => ({ onClick: onClickFn }),
						dragDropOptions: {
							onBeginDrag,
							onEndDrag
						}
					}}
				>
					<Body data={data} />
				</TableContextProvider>
			</DndProvider>
		);

		const bodyRow = getAllByDataRole(container, DataRoles.Table.Body.Row)[1];
		const actionButton = getByDataRole(bodyRow, DataRoles.Button);

		fireEvent.mouseOver(actionButton);
		fireEvent.drag(actionButton);

		expect(onBeginDrag).not.toHaveBeenCalled();
		expect(onEndDrag).not.toHaveBeenCalled();
	});
});
