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

import { render, getByDataRole, findByDataRole } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { waitFor } from "@testing-library/dom";

import { DataRoles } from "../../common/main/data-roles.js";

import { CssEllipsis } from "../main/css-ellipsis.view.js";

const SHORT_TEXT = "Lorem ipsum dolor sit amet, consectetur adipisicing elit.";
const LONG_TEXT =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ".repeat(
		30
	);

describe("com.mgmtp.a12.widgets.css-ellipsis", () => {
	test("rendering-with-max-line-1", () => {
		const { container } = render(
			<CssEllipsis maxLine={1}>
				<div>{SHORT_TEXT}</div>
			</CssEllipsis>
		);

		expect(container).toMatchSnapshot();
	});

	test("rendering-with-max-line", () => {
		const { container } = render(
			<CssEllipsis maxLine={2}>
				<div>{SHORT_TEXT}</div>
			</CssEllipsis>
		);

		expect(container).toMatchSnapshot();
	});

	test("should display full content in tooltip without cutoff when content is too long", async () => {
		const { container } = render(
			<div style={{ padding: "20px" }}>
				<CssEllipsis maxLine={2} useTooltip>
					{LONG_TEXT}
				</CssEllipsis>
			</div>
		);

		const ellipsisElement = getByDataRole(container, "css-ellipsis");

		// Mock overflow to trigger tooltip
		Object.defineProperty(ellipsisElement, "scrollHeight", {
			configurable: true,
			value: 100
		});
		Object.defineProperty(ellipsisElement, "clientHeight", {
			configurable: true,
			value: 50
		});

		await userEvent.hover(ellipsisElement);

		const tooltip = await findByDataRole(container, DataRoles.CssEllipsis.Tooltip);
		expect(tooltip).toBeInTheDocument();

		const tooltipContent = await findByDataRole(container, DataRoles.CssEllipsis.Content);
		expect(tooltipContent).toBeInTheDocument();
		expect(tooltipContent.textContent).toBe(LONG_TEXT);
	});

	test("should display full HTML content in tooltip without cutoff", async () => {
		const htmlContent = (
			<div>
				<strong>Bold text:</strong> {LONG_TEXT}
				<br />
				<em>Italic text:</em> {LONG_TEXT}
			</div>
		);

		const { container } = render(
			<div style={{ padding: "20px" }}>
				<CssEllipsis maxLine={2} useTooltip>
					{htmlContent}
				</CssEllipsis>
			</div>
		);

		const ellipsisElement = getByDataRole(container, "css-ellipsis");

		Object.defineProperty(ellipsisElement, "scrollHeight", {
			configurable: true,
			value: 100
		});
		Object.defineProperty(ellipsisElement, "clientHeight", {
			configurable: true,
			value: 50
		});

		await userEvent.hover(ellipsisElement);

		const tooltipContent = await findByDataRole(container, DataRoles.CssEllipsis.Content);
		expect(tooltipContent).toBeInTheDocument();

		// Verify HTML elements are present and content is complete
		const strongElement = tooltipContent.querySelector("strong");
		const emElement = tooltipContent.querySelector("em");

		expect(strongElement).toBeInTheDocument();
		expect(emElement).toBeInTheDocument();
		expect(strongElement?.textContent).toBe("Bold text:");
		expect(emElement?.textContent).toBe("Italic text:");
	});

	test("tooltip portal position is stable after opening with large content", async () => {
		const { container } = render(
			<div style={{ padding: "20px" }}>
				<CssEllipsis maxLine={2} useTooltip>
					{LONG_TEXT}
				</CssEllipsis>
			</div>
		);

		const ellipsisElement = getByDataRole(container, "css-ellipsis");

		// Mock overflow to trigger tooltip
		Object.defineProperty(ellipsisElement, "scrollHeight", { configurable: true, value: 100 });
		Object.defineProperty(ellipsisElement, "clientHeight", { configurable: true, value: 50 });

		await userEvent.hover(ellipsisElement);

		const portal = await findByDataRole(container, DataRoles.AttachedPortal);
		const initialStyle = { top: portal.style.top, left: portal.style.left };

		// Position should remain stable after portal settles (no jumps from maxHeight recalculation)
		await waitFor(() => {
			expect(portal.style.top).toBe(initialStyle.top);
			expect(portal.style.left).toBe(initialStyle.left);
		});
	});

	test("should display tooltip correctly when element is overlapped by screen edge (bottom)", async () => {
		const { container } = render(
			<div style={{ position: "absolute", bottom: "50px", left: "100px", width: "300px" }}>
				<CssEllipsis maxLine={2} useTooltip>
					{LONG_TEXT}
				</CssEllipsis>
			</div>
		);

		const ellipsisElement = getByDataRole(container, "css-ellipsis");

		Object.defineProperty(ellipsisElement, "scrollHeight", {
			configurable: true,
			value: 100
		});
		Object.defineProperty(ellipsisElement, "clientHeight", {
			configurable: true,
			value: 50
		});

		await userEvent.hover(ellipsisElement);

		const tooltip = await findByDataRole(container, DataRoles.CssEllipsis.Tooltip);
		expect(tooltip).toBeInTheDocument();

		// Verify content is complete and not cut off
		const tooltipContent = getByDataRole(container, DataRoles.CssEllipsis.Content);
		expect(tooltipContent.textContent).toBe(LONG_TEXT);
	});
});
