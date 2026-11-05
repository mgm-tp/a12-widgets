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

import { blockPadding } from "../main/template/data-table.styled-utils.js";

/**
 * `blockPadding` feeds `CELL_BLOCK_PADDING_VAR`, which the fixed-row-height rule subtracts inside a
 * `calc()` to cap cell content at the cell's content box. So every result has to be a valid length
 * *there*: one invalid term invalidates the whole expression, and the cap silently disappears —
 * letting a tall cell push its row past the fixed height and desynchronise the virtualizer.
 */
describe("blockPadding", () => {
	const capIsValid = (padding: string): boolean =>
		CSS.supports("max-height", `calc(50px - ${blockPadding(padding)} - 1px)`);

	test("sums the block edges of every padding shorthand form", () => {
		expect(blockPadding("8px")).toBe("calc(8px + 8px)");
		expect(blockPadding("8px 16px")).toBe("calc(8px + 8px)");
		expect(blockPadding("8px 16px 12px")).toBe("calc(8px + 12px)");
		expect(blockPadding("8px 16px 12px 4px")).toBe("calc(8px + 12px)");
	});

	test("normalizes the unitless zero themes write, which calc() rejects as a length", () => {
		expect(blockPadding("0")).toBe("calc(0px + 0px)");
		expect(blockPadding("0 8px")).toBe("calc(0px + 0px)");
		expect(capIsValid("0")).toBe(true);
		expect(capIsValid("0 8px")).toBe(true);
	});

	test("keeps units other than px, including relative ones", () => {
		expect(blockPadding("0.5rem 1rem")).toBe("calc(0.5rem + 0.5rem)");
		expect(blockPadding("2% 4%")).toBe("calc(2% + 2%)");
		expect(capIsValid("0.5rem 1rem")).toBe(true);
	});

	test("degrades to a no-op length when the token cannot be parsed", () => {
		expect(blockPadding("")).toBe("0px");
		expect(blockPadding("inherit")).toBe("0px");
		expect(blockPadding(undefined as unknown as string)).toBe("0px");
		expect(capIsValid("inherit")).toBe(true);
	});

	test("yields a valid cap for the shorthands the table's own themes use", () => {
		for (const padding of ["0", "0px", "8px 16px", "4px 8px", "1rem", "0 0"]) {
			expect(capIsValid(padding), padding).toBe(true);
		}
	});
});
