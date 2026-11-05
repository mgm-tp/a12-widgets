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

import { render } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import { renderTooltips } from "../main/tooltip-utils.js";
import { noop } from "../main/utils.js";

const TOOLTIP_CLASS = "field__tooltip";

describe("renderTooltips", () => {
	test("merges the class into an element tooltip without wrapping it", () => {
		const { getByText } = render(
			<div>{renderTooltips(<span className="own">Element tooltip</span>, TOOLTIP_CLASS)}</div>
		);
		const tooltip = getByText("Element tooltip");

		expect(tooltip.tagName).toBe("SPAN");
		expect(tooltip).toHaveClass("own");
		expect(tooltip).toHaveClass(TOOLTIP_CLASS);
	});

	test("wraps a string tooltip in a span carrying the class", () => {
		const { getByText } = render(<div>{renderTooltips("String tooltip", TOOLTIP_CLASS)}</div>);
		const tooltip = getByText("String tooltip");

		expect(tooltip.tagName).toBe("SPAN");
		expect(tooltip).toHaveClass(TOOLTIP_CLASS);
	});

	test("wraps a number tooltip in a span carrying the class", () => {
		const { getByText } = render(<div>{renderTooltips(42, TOOLTIP_CLASS)}</div>);
		const tooltip = getByText("42");

		expect(tooltip.tagName).toBe("SPAN");
		expect(tooltip).toHaveClass(TOOLTIP_CLASS);
	});

	test("wraps a fragment tooltip instead of cloning it, so React never sees a class on the fragment", () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(noop);

		const { getByText } = render(<div>{renderTooltips(<>Fragment tooltip</>, TOOLTIP_CLASS)}</div>);
		const tooltip = getByText("Fragment tooltip");

		expect(tooltip.tagName).toBe("SPAN");
		expect(tooltip).toHaveClass(TOOLTIP_CLASS);
		expect(consoleError).not.toHaveBeenCalled();

		consoleError.mockRestore();
	});

	test("keeps the order of a mixed list of tooltips", () => {
		const { container } = render(
			<div>{renderTooltips(["First", <span key="second">Second</span>, "Third"], TOOLTIP_CLASS)}</div>
		);

		expect(container.textContent).toBe("FirstSecondThird");
	});

	test("skips tooltips React does not render", () => {
		const { container } = render(<div>{renderTooltips([null, undefined, false, "Only one"], TOOLTIP_CLASS)}</div>);

		expect(container.textContent).toBe("Only one");
		expect(container.querySelectorAll(`.${TOOLTIP_CLASS}`)).toHaveLength(1);
	});

	test("renders nothing when there are no tooltips", () => {
		const { container } = render(<div>{renderTooltips(undefined, TOOLTIP_CLASS)}</div>);

		expect(container.querySelector(`.${TOOLTIP_CLASS}`)).toBeNull();
	});
});
