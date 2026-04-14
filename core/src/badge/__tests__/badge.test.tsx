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

import { getByDataRole, queryByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";

import type { BadgeProps, BadgeVariant } from "../main/badge.api.js";
import { Badge } from "../main/badge.view.js";

describe("com.mgmtp.a12.widgets.badge", () => {
	const baseDataRole = "badge";
	const props: Partial<BadgeProps> = {
		id: "test-id",
		className: "test-class",
		style: { background: "red" },
		count: 100
	};

	test("render default badge", () => {
		const { container } = render(<Badge {...props} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render standalone badge", () => {
		const { container } = render(<Badge standalone count={props.count} />);
		expect(container.firstChild).toHaveStyle({ position: "static" });
	});

	test("render light info badge", () => {
		const { container } = render(<Badge light count={props.count} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render success, warning and error badge", () => {
		["success", "warning", "error"].forEach((value) => {
			const { container } = render(<Badge variant={value as BadgeVariant} count={props.count} />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("render tiny badge", () => {
		["success", "warning", "error"].forEach((value) => {
			const { container } = render(<Badge variant={value as BadgeVariant} count={props.count} tiny />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("test custom title", () => {
		const { container } = render(<Badge count={props.count} title="Test Tile" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default overflowed badge", () => {
		const { container } = render(<Badge count={10000} />);
		expect(getByDataRole(container, `${baseDataRole}-content`).firstChild?.textContent).toBe("9999+");
	});

	test("render custom overflowed badge", () => {
		const overflowCount = 99;
		const { container } = render(<Badge count={10000} overflowCount={overflowCount} />);
		expect(getByDataRole(container, `${baseDataRole}-content`).firstChild?.textContent).toBe(`${overflowCount}+`);
	});

	test("render hidden badge", () => {
		const { container } = render(<Badge count={props.count} hidden />);
		expect(queryByDataRole(container, `${baseDataRole}-content`)).not.toBeInTheDocument();
	});

	test("render badge with given position", () => {
		const { container } = render(<Badge count={props.count} position={{ top: 0, left: 0 }} />);
		expect(container.firstChild).toMatchSnapshot();
	});
});
