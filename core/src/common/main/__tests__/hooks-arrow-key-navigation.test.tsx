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

import { describe, test, expect } from "vitest";
import { useEffect, useRef, useState } from "react";
import { render, getAllByDataRole } from "test-utils";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../data-roles.js";
import { useArrowKeyNavigation } from "../hooks.js";

/**
 * Force a re-render after mount so elementRef.current is non-null when
 * useArrowKeyNavigation captures it (it reads ref.current during render).
 */
function NavList({ allowTabNavigation = false }: { allowTabNavigation?: boolean }) {
	const ref = useRef<HTMLUListElement>(null);
	const [, rerender] = useState(0);

	useEffect(() => {
		rerender(1);
	}, []);

	useArrowKeyNavigation({ elementRef: ref, allowTabNavigation });

	return (
		<ul ref={ref}>
			<li tabIndex={0} data-role={DataRoles.List.Item.Content}>
				Item 0
			</li>
			<li tabIndex={0} data-role={DataRoles.List.Item.Content}>
				Item 1
			</li>
			<li tabIndex={0} data-role={DataRoles.List.Item.Content}>
				Item 2
			</li>
		</ul>
	);
}

/**
 * Navigation list with allowAllDirections enabled.
 * All arrow keys (Up, Down, Left, Right) navigate through items.
 */
function AllDirectionsNavList() {
	const ref = useRef<HTMLUListElement>(null);
	const [, rerender] = useState(0);

	useEffect(() => {
		rerender(1);
	}, []);

	useArrowKeyNavigation({ elementRef: ref, allowAllDirections: true });

	return (
		<ul ref={ref}>
			<li tabIndex={0} data-role={DataRoles.List.Item.Content}>
				Home
			</li>
			<li tabIndex={0} data-role={DataRoles.List.Item.Content}>
				Profile
			</li>
			<li tabIndex={0} data-role={DataRoles.List.Item.Content}>
				Settings
			</li>
		</ul>
	);
}

describe("com.mgmtp.a12.widgets.hooks", () => {
	test("Tab wraps from last to first when allowTabNavigation=true", async () => {
		const { container } = render(<NavList allowTabNavigation={true} />);
		const items = getAllByDataRole(container, DataRoles.List.Item.Content);
		items[2].focus();
		await userEvent.tab();
		expect(items[0]).toHaveFocus();
	});

	test("ArrowDown navigates to next item", async () => {
		const { container } = render(<NavList />);
		const items = getAllByDataRole(container, DataRoles.List.Item.Content);
		items[0].focus();
		await userEvent.keyboard("{ArrowDown}");
		expect(items[1]).toHaveFocus();
	});

	test("ArrowUp wraps to last item", async () => {
		const { container } = render(<NavList />);
		const items = getAllByDataRole(container, DataRoles.List.Item.Content);
		items[0].focus();
		await userEvent.keyboard("{ArrowUp}");
		expect(items[2]).toHaveFocus();
	});

	describe("useArrowKeyNavigation with allowAllDirections", () => {
		test("ArrowRight navigates to next item", async () => {
			const { container } = render(<AllDirectionsNavList />);
			const items = getAllByDataRole(container, DataRoles.List.Item.Content);

			items[0].focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(document.activeElement).toBe(items[1]);
		});

		test("ArrowLeft navigates to previous item", async () => {
			const { container } = render(<AllDirectionsNavList />);
			const items = getAllByDataRole(container, DataRoles.List.Item.Content);

			items[1].focus();
			await userEvent.keyboard("{ArrowLeft}");
			expect(document.activeElement).toBe(items[0]);
		});

		test("ArrowDown navigates to next item", async () => {
			const { container } = render(<AllDirectionsNavList />);
			const items = getAllByDataRole(container, DataRoles.List.Item.Content);

			items[0].focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(document.activeElement).toBe(items[1]);
		});

		test("ArrowUp navigates to previous item", async () => {
			const { container } = render(<AllDirectionsNavList />);
			const items = getAllByDataRole(container, DataRoles.List.Item.Content);

			items[1].focus();
			await userEvent.keyboard("{ArrowUp}");
			expect(document.activeElement).toBe(items[0]);
		});

		test("ArrowLeft from first item wraps to last item", async () => {
			const { container } = render(<AllDirectionsNavList />);
			const items = getAllByDataRole(container, DataRoles.List.Item.Content);

			items[0].focus();
			await userEvent.keyboard("{ArrowLeft}");
			expect(document.activeElement).toBe(items[2]);
		});

		test("ArrowRight from last item wraps to first item", async () => {
			const { container } = render(<AllDirectionsNavList />);
			const items = getAllByDataRole(container, DataRoles.List.Item.Content);

			items[2].focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(document.activeElement).toBe(items[0]);
		});
	});
});
