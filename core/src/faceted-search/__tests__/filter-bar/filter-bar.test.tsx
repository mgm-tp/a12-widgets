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

import { render, getByDataRole, fireEvent } from "test-utils";
import { describe, expect, test } from "vitest";

import { Filter } from "../../main/filter/filter.view.js";
import { FilterBar } from "../../main/filter-bar/filter-bar.view.js";
import { FilterBarMobile } from "../../main/filter-bar/filter-bar.mobile.view.js";

describe("com.mgmtp.a12.widgets.filter-bar", () => {
	test("rendering-filter-bar-with-valid-classes", () => {
		const { container } = render(
			<FilterBar id="test-id" className="test-class" style={{ color: "red" }}>
				<Filter name="Category" options={["Blue", "Green", "White"]} />
				<Filter name="Food" options={["Fish", "Meat"]} />
				<Filter name="Category" options={["Blue", "Green", "White"]} />
			</FilterBar>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-bar", () => {
		const { container, rerender } = render(
			<FilterBar initialCollapsed>
				<Filter name="Category" options={["Blue", "Green", "White"]} />
			</FilterBar>
		);
		expect(container.firstChild).toMatchSnapshot();
		rerender(
			<FilterBar disabled initialCollapsed>
				<Filter name="Category" options={["Blue", "Green", "White"]} />
			</FilterBar>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate-expand-and-collapse-filter-bar", async () => {
		const { container } = render(
			<FilterBar initialCollapsed={false}>
				<Filter name="Category" options={["Blue", "Green", "White"]} />
				<Filter name="Food" options={["Fish", "Meat"]} />
				<Filter name="Category" options={["Blue", "Green", "White"]} />
			</FilterBar>
		);
		expect(container.firstChild).toMatchSnapshot();
		const action = getByDataRole(container, "filterbar-action");

		const button = getByDataRole(action, "button");
		fireEvent.click(button);
		expect(container.firstChild).toMatchSnapshot();
	});
});

describe("com.mgmtp.a12.widgets.filter-bar.mobile", () => {
	test("rendering-filter-bar-on-mobile", () => {
		const actions = "action";
		const filter = <div>test</div>;
		const { container } = render(
			<FilterBarMobile id="test-id" className="test-class" style={{ color: "red" }} actions={actions}>
				{filter}
			</FilterBarMobile>
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
