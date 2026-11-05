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

import { describe, expect, expectTypeOf, test } from "vitest";

import type * as LegacyColumn from "../../table/main/column.api.js";
import type * as LegacyTable from "../../table/main/table.api.js";
import type * as ForkedColumn from "../main/foundation/column.api.js";
import type * as ForkedTable from "../main/foundation/table.api.js";

/*
 * `data-table/main/foundation/` is a deliberate fork of `table/main/` — see
 * `../main/foundation/README.md` for what is copied, what is trimmed and why.
 *
 * Both halves are published: the legacy one from the package root, the fork from
 * `./experimental`. This file is the guard that keeps the shared declarations
 * from drifting by accident. Divergence is *allowed* — when you intend it,
 * change the assertions below in the same commit, so it lands in review instead
 * of being discovered by a consumer who assumed the two were interchangeable.
 *
 * The assertions are type-level. `expectTypeOf` compiles to nothing, so these
 * fail the build (`pnpm exec tsc --noEmit`, `pnpm lint`) rather than the test
 * run — the `expect` calls below are what make the file a legible test too.
 *
 * `toEqualTypeOf` is strict structural equality, so it catches a changed member
 * type *and* a changed optionality. The separate `keyof` comparisons catch the
 * case plain assignability cannot: nearly every column member is optional, and
 * `{ a?: string }` is mutually assignable with `{}`, so a member added to one
 * copy alone would otherwise slip through.
 */

type Row = { id: string; name: string };

/**
 * Wraps a type in an object so a *function* type is compared as a property.
 * `expectTypeOf` treats a bare function type as callable and then wants the call
 * arguments; boxing keeps the comparison purely structural.
 */
type Boxed<T> = { readonly value: T };

describe("com.mgmtp.a12.widgets.data-table — foundation fork drift", () => {
	test("BaseColumnType stays structurally identical to the legacy Table's", () => {
		expectTypeOf<ForkedColumn.BaseColumnType<Row>>().toEqualTypeOf<LegacyColumn.BaseColumnType<Row>>();
		expectTypeOf<keyof ForkedColumn.BaseColumnType<Row>>().toEqualTypeOf<keyof LegacyColumn.BaseColumnType<Row>>();

		// A fully-populated column literal must satisfy both without a cast — the
		// property that lets a consumer move a column definition between `Table` and
		// `DataTable`.
		const column = {
			label: "Name",
			dataKey: "name",
			sortable: true,
			pinning: "left",
			width: 1.5,
			fixedWidth: true,
			actionColumn: false,
			subInfo: false,
			hiddenText: "Name column",
			minResizeWidth: 0.5,
			verticalHeader: false,
			horizontalAlignment: "center",
			verticalAlignment: "middle",
			specificHorizontalAlignment: { head: "left", body: "right", foot: "center" },
			specificVerticalAlignment: { head: "top", body: "middle", foot: "bottom" },
			sortDirections: ["asc", "desc", undefined],
			dataGetter: ({ row }) => row.name,
			subColumns: [{ label: "Sub" }]
		} satisfies LegacyColumn.BaseColumnType<Row> satisfies ForkedColumn.BaseColumnType<Row>;

		expect(column.label).toBe("Name");
	});

	test("the column helper types stay identical", () => {
		expectTypeOf<ForkedColumn.Column.Pinning>().toEqualTypeOf<LegacyColumn.Column.Pinning>();
		expectTypeOf<ForkedColumn.Column.Width>().toEqualTypeOf<LegacyColumn.Column.Width>();
		expectTypeOf<ForkedColumn.Column.HorizontalAlignment>().toEqualTypeOf<LegacyColumn.Column.HorizontalAlignment>();
		expectTypeOf<ForkedColumn.Column.VerticalAlignment>().toEqualTypeOf<LegacyColumn.Column.VerticalAlignment>();
		expectTypeOf<ForkedColumn.SortOrder>().toEqualTypeOf<LegacyColumn.SortOrder>();
		expectTypeOf<Boxed<ForkedColumn.DataGetter<Row>>>().toEqualTypeOf<Boxed<LegacyColumn.DataGetter<Row>>>();

		expect(true).toBe(true);
	});

	test("the row and cell contracts kept in the fork stay identical", () => {
		// `foundation/table.api.ts` is a *subset* of the legacy file, so only the
		// declarations it kept are compared here. The ones it deliberately dropped
		// (`BaseTableProps`, `TableContextType`, `SortOptions`, …) and the two it
		// added (`ColumnResizeDragEvent`, `ColumnResizeDragData`) are out of scope.
		expectTypeOf<ForkedTable.RowStyles>().toEqualTypeOf<LegacyTable.RowStyles>();
		expectTypeOf<keyof ForkedTable.RowStyles>().toEqualTypeOf<keyof LegacyTable.RowStyles>();

		expectTypeOf<ForkedTable.CellStyles>().toEqualTypeOf<LegacyTable.CellStyles>();
		expectTypeOf<keyof ForkedTable.CellStyles>().toEqualTypeOf<keyof LegacyTable.CellStyles>();

		expectTypeOf<ForkedTable.RowEventHandlers>().toEqualTypeOf<LegacyTable.RowEventHandlers>();
		expectTypeOf<Boxed<ForkedTable.RowStyleGetter<Row>>>().toEqualTypeOf<Boxed<LegacyTable.RowStyleGetter<Row>>>();

		/*
		 * KNOWN, INTENTIONAL DIVERGENCE — `RowKeyGetter`.
		 *
		 * The fork's params carry an optional `rowIndex` the legacy `Table` never
		 * passes; orchestrators that track row position (DataTable) do. See the doc
		 * comment on the declaration in `../main/foundation/table.api.ts`.
		 *
		 * Asserted as mutual *assignability* rather than equality, because that is
		 * the property consumers actually depend on: a `rowKey` getter written for
		 * either component keeps working in the other. If that stops holding, this
		 * fails — which is the point of pinning the divergence here instead of
		 * dropping the check.
		 */
		expectTypeOf<Boxed<ForkedTable.RowKeyGetter<Row>>>().toExtend<Boxed<LegacyTable.RowKeyGetter<Row>>>();
		expectTypeOf<Boxed<LegacyTable.RowKeyGetter<Row>>>().toExtend<Boxed<ForkedTable.RowKeyGetter<Row>>>();
		expectTypeOf<Parameters<ForkedTable.RowKeyGetter<Row>>[0]>().toEqualTypeOf<{ row: Row; rowIndex?: number }>();
		expectTypeOf<Parameters<LegacyTable.RowKeyGetter<Row>>[0]>().toEqualTypeOf<{ row: Row }>();

		/*
		 * KNOWN, INTENTIONAL DIVERGENCE — `keyboardGrabKey`, which switches the keyboard
		 * grab off. Only the fork drives keyboard reordering (`DataTable`); on the legacy
		 * `Table` the option would be dead weight. Every other key still has to match.
		 */
		expectTypeOf<Exclude<keyof ForkedTable.TableDragDropOptions<Row>, "keyboardGrabKey">>().toEqualTypeOf<
			keyof LegacyTable.TableDragDropOptions<Row>
		>();
		expectTypeOf<Extract<keyof LegacyTable.TableDragDropOptions<Row>, "keyboardGrabKey">>().toBeNever();

		expect(true).toBe(true);
	});
});
