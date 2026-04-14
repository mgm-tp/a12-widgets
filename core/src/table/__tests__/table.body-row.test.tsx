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

import type { RenderResult } from "test-utils";
import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { Range } from "../../common/main/utils.js";

import type { TableTemplateProps } from "../main/template/table.tpl.api.js";
import type { TableRenderPropsType } from "../new-api/table-renderer.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../new-api/table.view.js";
import { BodyRow } from "../new-api/table.body-row.view.js";

describe("com.mgmtp.a12.widgets.table.body-row", () => {
	const COLUMN_COUNT = 4;
	type RowType = number[];

	const data: RowType = Array.from(new Range(COLUMN_COUNT)).map(() => Math.random() * 100);

	test("default row", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<BodyRow rowIndex={1} row={data} title="title-test" />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("default row when hovering", async () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<BodyRow rowIndex={1} row={data} title="title-test" />
			</TableContextProvider>
		);

		const bodyRow = getByDataRole(container, "table-body-row");
		fireEvent.mouseOver(bodyRow);
		expect(bodyRow).toMatchSnapshot();

		expect(bodyRow).toMatchSnapshot();
	});

	test("disabled row", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<BodyRow rowIndex={1} row={data} disabled />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("selected row", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<BodyRow rowIndex={1} row={data} selected />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("interactive row", () => {
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: []
				}}
			>
				<BodyRow rowIndex={1} row={data} interactive />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("highlight variant", () => {
		const renderBodyRow = (variant: TableTemplateProps.TableHighlightVariant): RenderResult => {
			return render(
				<TableContextProvider
					value={{
						componentRenderers: DefaultTableComponentRenderers,
						columns: []
					}}
				>
					<BodyRow rowIndex={1} row={data} highlightVariant={variant} />
				</TableContextProvider>
			);
		};

		const { container: infoRow } = renderBodyRow("info");
		expect(infoRow.firstChild).toMatchSnapshot();

		const { container: successRow } = renderBodyRow("success");
		expect(successRow.firstChild).toMatchSnapshot();
	});

	test("test rowStyling context", () => {
		const option: Partial<TableRenderPropsType.BodyRowProps<RowType>> = {
			highlightVariant: "info"
		};
		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns: [],
					rowStyling: () => option
				}}
			>
				<BodyRow rowIndex={1} row={data} />
			</TableContextProvider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("other context values", () => {
		const additionalContentRendererFn = vi.fn();
		const onClickFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: {
						...DefaultTableComponentRenderers,
						additionalContentRenderer: additionalContentRendererFn
					},
					columns: [],
					cardView: true,
					rowEventHandlers: () => ({ onClick: onClickFn })
				}}
			>
				<BodyRow rowIndex={1} row={data} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(additionalContentRendererFn).toHaveBeenCalledWith({ row: data, rowIndex: 1 });

		const bodyRow = getByDataRole(container, "table-body-row");
		fireEvent.click(bodyRow);
		expect(onClickFn).toHaveBeenCalledTimes(1);
	});
});
