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

import { describe, expect, test } from "vitest";

import { Range } from "../../../common/main/utils.js";
import type { LayoutResult, LayoutResultItem, Layoutable, ViewWidth } from "../main/master-detail.api.js";
import { MasterDetailLayout } from "../main/master-detail.api.js";
import { FocusLastLayout } from "../main/master-detail.default-model.js";

interface Layout extends Layoutable {
	id: number;
}

describe("com.mgmtp.a12.widgets.masterdetail", () => {
	function layoutables(first: number, last: number): Layout[] {
		return Array.from(new Range(first, last + 1)).map((i) => {
			return { id: i };
		});
	}

	function layout(count: number, position: number): LayoutResult<Layoutable> {
		const items = layoutables(1, count);
		const layoutManager = new FocusLastLayout(items);
		layoutManager.goto(items[position]);

		return layoutManager.layout();
	}

	function layoutResult(first: number, last: number, width?: ViewWidth): LayoutResultItem<Layoutable>[] {
		return layoutables(first, last).map((l) => {
			return width !== undefined
				? {
						layoutable: l,
						width: width
					}
				: {
						layoutable: l,
						width: undefined
					};
		});
	}

	test("initialState", () => {
		const layout_5_0 = layout(5, 0);
		expect(MasterDetailLayout.visible(layout_5_0)).toEqual(layoutResult(1, 1, 12));
	});

	test("firstTwo", () => {
		const layout_5_1 = layout(5, 1);
		expect(MasterDetailLayout.visible(layout_5_1)).toEqual(layoutResult(1, 2, 6));
	});

	test("twoAndThree", () => {
		const layout_5_2 = layout(5, 2);
		expect(MasterDetailLayout.visible(layout_5_2)).toEqual(layoutResult(2, 3, 6));
	});

	test("hiddenItemsBeforeWindow", () => {
		const items = layoutables(1, 5);
		const lm = new FocusLastLayout(items);
		lm.goto(items[2]); // head = items[2] ({id:3})
		const result = lm.layout();
		// first=1, last=2, so items[0] is hidden
		expect(result.items).toHaveLength(3);
		expect(result.items[0]).toEqual({ layoutable: items[0], width: undefined });
		expect(result.items[1]).toEqual({ layoutable: items[1], width: 6 });
		expect(result.items[2]).toEqual({ layoutable: items[2], width: 6 });
	});

	test("gotoThrowsForUnknownView", () => {
		const items = layoutables(1, 5);
		const lm = new FocusLastLayout(items);
		expect(() => lm.goto({ id: 99 })).toThrow("view not in list of views");
	});

	test("singleColumn", () => {
		const items = layoutables(1, 5);
		const lm = new FocusLastLayout(items);
		lm.columnCount = 1;
		lm.goto(items[3]); // head = items[3] ({id:4})
		const result = lm.layout();
		// first=last=3, so only items[3] visible with width 12
		expect(MasterDetailLayout.visible(result)).toEqual([{ layoutable: items[3], width: 12 }]);
		// items[0..2] are hidden
		expect(result.items.filter((i) => i.width === undefined)).toHaveLength(3);
	});

	test("threeColumns", () => {
		const items = layoutables(1, 5);
		const lm = new FocusLastLayout(items);
		lm.columnCount = 3;
		lm.goto(items[3]); // head = items[3] ({id:4})
		const result = lm.layout();
		// first=1, last=3, visibleCount=3 → width=4 each
		expect(MasterDetailLayout.visible(result)).toEqual([
			{ layoutable: items[1], width: 4 },
			{ layoutable: items[2], width: 4 },
			{ layoutable: items[3], width: 4 }
		]);
	});

	test("preferredWidthOnLastItem", () => {
		const items: Layout[] = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4, preferredWidth: 8 }];
		const lm = new FocusLastLayout(items);
		lm.columnCount = 2;
		lm.goto(items[3]); // head = items[3] (preferredWidth:8)
		const result = lm.layout();
		// last has preferredWidth=8 → last:8, previous:12-8=4
		expect(MasterDetailLayout.visible(result)).toEqual([
			{ layoutable: items[2], width: 4 },
			{ layoutable: items[3], width: 8 }
		]);
	});
});
