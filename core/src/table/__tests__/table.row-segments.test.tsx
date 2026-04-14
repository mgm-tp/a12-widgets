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

import { getAllByDataRole, render } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { BodyRowSegmentTpl } from "../main/template/table.body-row-segment.tpl.view.js";
import type { BaseColumnType } from "../new-api/column.api.js";
import { DefaultTableComponentRenderers, TableContextProvider } from "../new-api/table.view.js";
import { RowSegments } from "../new-api/table.row-segments.view.js";

describe("com.mgmtp.a12.widgets.table.row-segments", () => {
	test("default", () => {
		const columns: BaseColumnType[] = [
			{ label: "", pinning: "left" },
			{ label: "", pinning: "left" },
			{ label: "" },
			{ label: "" },
			{ label: "", pinning: "right" },
			{ label: "", pinning: "right" }
		];
		const cellRenderedFn = vi.fn();

		const { container } = render(
			<TableContextProvider
				value={{
					componentRenderers: DefaultTableComponentRenderers,
					columns
				}}
			>
				<RowSegments SegmentComponent={BodyRowSegmentTpl} cellRenderer={cellRenderedFn} />
			</TableContextProvider>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(cellRenderedFn).toHaveBeenCalledTimes(columns.length);

		const leftSegment = getAllByDataRole(container, "table-body-row--left");
		expect(leftSegment).toHaveLength(1);

		const scrollSegment = getAllByDataRole(container, "table-body-row--scroll");
		expect(scrollSegment).toHaveLength(1);

		const rightSegment = getAllByDataRole(container, "table-body-row--right");
		expect(rightSegment).toHaveLength(1);
	});
});
