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

import { MenuUtils } from "../main/menu.internal.js";
import type { FlattenedMenuItemType } from "../main/template/menu.tpl.api.js";
import { MenuTplUtils } from "../main/template/menu.tpl.internal.js";

import getBadgePosition = MenuTplUtils.getBadgePosition;

describe("com.mgmtp.a12.widgets.menu.internal", () => {
	const selectedChild = {
		id: "item-1.2",
		label: "1.2",
		items: [{ label: "1.2.1" }, { label: "1.2.2", selected: true }]
	};

	const itemWithSelectedChild: FlattenedMenuItemType = {
		id: "item",
		label: "Very long label that will not fit in there",
		items: [
			{
				id: "item-1.1",
				label: "1.1",
				disabled: true
			},
			selectedChild
		]
	};

	const itemWithNoSelectedChild: FlattenedMenuItemType = {
		id: "item",
		label: "Very long label that will not fit in there",
		items: [
			{
				id: "item-1.1",
				label: "1.1",
				disabled: true
			},
			{
				id: "item-1.2",
				label: "1.2",
				items: [{ label: "1.2.1" }, { label: "1.2.2" }]
			}
		]
	};

	test("findSelectedChild", () => {
		expect(MenuUtils.findSelectedChild(itemWithSelectedChild)).toEqual(selectedChild);
		expect(MenuUtils.findSelectedChild(itemWithNoSelectedChild)).toBeUndefined();
	});

	test("isItemEqual", () => {
		expect(MenuUtils.isItemEqual(itemWithSelectedChild, itemWithNoSelectedChild)).toBeFalsy();
		expect(MenuUtils.isItemEqual(itemWithSelectedChild, itemWithSelectedChild)).toBeTruthy();
	});

	describe("getBadgePosition", () => {
		test("should calculate badgePosition and tinyBadgePosition correctly for default values", () => {
			const result = getBadgePosition({
				badgeHeight: "20px",
				badgeRightPos: "10px",
				tinyBadgeHeight: "5px",
				tinyBadgeWidth: "5px"
			});

			expect(result).toEqual({
				badgePosition: {
					top: "calc(20px * (-0.7))",
					right: "10px"
				},
				tinyBadgePosition: {
					top: "calc(5px * (-0.5))",
					right: "calc(5px * (-0.5))"
				}
			});
		});

		test("should adjust badgePosition for subLayer", () => {
			const result = MenuTplUtils.getBadgePosition({
				subLayer: true,
				badgeHeight: "20px",
				badgeRightPos: "10px",
				tinyBadgeHeight: "5px",
				tinyBadgeWidth: "5px"
			});

			expect(result.badgePosition.top).toBe("calc(20px * (-0.75))");
		});

		test("should adjust badgePosition for hasNonLabel", () => {
			const result = getBadgePosition({
				hasNonLabel: true,
				badgeHeight: "20px",
				badgeRightPos: "10px",
				tinyBadgeHeight: "5px",
				tinyBadgeWidth: "5px"
			});

			expect(result.badgePosition.right).toBe("calc(10px / 2)");
		});

		test("should adjust badgePosition for vertical layout without subLayer", () => {
			const result = getBadgePosition({
				isVertical: true,
				badgeHeight: "20px",
				badgeRightPos: "10px",
				tinyBadgeHeight: "5px",
				tinyBadgeWidth: "5px"
			});

			expect(result.badgePosition.margin).toBe("calc(20px / 3) 0");
			expect(result.badgePosition.top).toBe("calc(20px * (-0.75))");
		});

		test("should adjust badgePosition for vertical layout with hasNonLabel", () => {
			const result = getBadgePosition({
				isVertical: true,
				hasNonLabel: true,
				badgeHeight: "20px",
				badgeRightPos: "10px",
				tinyBadgeHeight: "5px",
				tinyBadgeWidth: "5px"
			});

			expect(result.badgePosition.top).toBe("calc(20px * (-1))");
			expect(result.badgePosition.right).toBe("0");
		});
	});
});
