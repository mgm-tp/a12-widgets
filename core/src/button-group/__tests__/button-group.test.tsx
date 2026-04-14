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
import { describe, expect, test } from "vitest";

import { ButtonGroup } from "../main/button-group.view.js";

const baseClassName = "button-group";

describe("com.mgmtp.a12.widgets.button-group", () => {
	/**
	 * Testing button group default:
	 *  - Button group should use div-tag
	 *  - Button group should have base class 'button-group'
	 *  - The number of buttons rendered should equal the number of buttons passed in
	 *  - Doesn't have any alignment
	 */
	test("rendering-button-group-by-default", () => {
		const { container } = render(
			<ButtonGroup id="button-group-id">
				<button type="button" />
				<button type="button" />
				<button type="button" />
			</ButtonGroup>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Testing button group is aligned to left side:
	 *  - Button group should have class 'h_floatLeft'
	 *  - Left align button group should have class 'button-group--left'
	 */
	test("rendering-button-group-on-left-side", () => {
		const { container } = render(<ButtonGroup alignment="left" />);

		expect(container.getElementsByClassName("h_floatLeft")).toHaveLength(1);
		expect(container.getElementsByClassName(`${baseClassName}--left`)).toHaveLength(1);
	});

	/**
	 * Testing button group is aligned to right side:
	 *  - Button group should have class 'h_floatRight'
	 *  - Right align button group should have class 'button-group--right'
	 */
	test("rendering-button-group-on-right-side", () => {
		const { container } = render(<ButtonGroup alignment="right" />);

		expect(container.getElementsByClassName(`${"h_floatRight"}`)).toHaveLength(1);
		expect(container.getElementsByClassName(`${baseClassName}--right`)).toHaveLength(1);
	});

	/**
	 * Testing rendering vertical button group
	 */
	test("rendering-vertical-button-group", () => {
		const { container } = render(
			<ButtonGroup vertical>
				<button type="button" />
				<button type="button" />
				<button type="button" />
			</ButtonGroup>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Testing rendering of additional class and style when user defines it in the props
	 */
	test("rendering-additional-class-when-defined", () => {
		const { container } = render(<ButtonGroup className="test" style={{ color: "red" }} />);

		expect(container.firstChild).toMatchSnapshot();
	});
});
