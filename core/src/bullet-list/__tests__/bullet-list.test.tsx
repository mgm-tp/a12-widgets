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
import { describe, vi, expect, test } from "vitest";

import { BulletList } from "../main/bullet-list.view.js";
import type { BulletListProps } from "../main/bullet-list.api.js";

const { Ordered, Item, Unordered } = BulletList;

describe("com.mgmtp.a12.widgets.bullet-list.ordered-list", () => {
	test("rendering-a-ordered-list-by-default", () => {
		const { container } = render(<Ordered />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-a-ordered-list-by-adding-type", () => {
		const orderedType: BulletListProps.OrderedType[] = [
			"decimal-leading-zero",
			"lower-roman",
			"upper-roman",
			"lower-alpha"
		];

		orderedType.forEach((e) => {
			const { container } = render(<Ordered type={e} />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("rendering-an-inline-ordered-list", () => {
		const { container } = render(<Ordered inline />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-a-ordered-list-by-adding-children", () => {
		const { container } = render(
			<Ordered>
				<Item>Banana</Item>
				<Item>Apple</Item>
				<Item>Orange</Item>
			</Ordered>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-a-ordered-list-by-adding-rest-of-property", () => {
		const { container } = render(
			<Ordered
				id="id"
				className="className"
				style={{
					backgroundColor: "#ff4500"
				}}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-wrapperRef", () => {
		const wrapperRef = vi.fn();
		render(<Ordered wrapperRef={wrapperRef} />);
		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.bullet-list.unordered-list", () => {
	test("rendering-an-unordered-list-by-default", () => {
		const { container } = render(<Unordered />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-an-unordered-list-by-adding-type", () => {
		const unorderedType: BulletListProps.UnorderedType[] = ["disc", "circle", "square"];

		unorderedType.forEach((e) => {
			const { container } = render(<Unordered type={e} />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	/**
	 * Testing rendering an inline and no indent Unordered List:
	 * - Unordered List should have class 'bullet-list--inline'.
	 * - Unordered List should have class 'bullet-list--no-indent'.
	 */
	test("rendering-an-inline-and-no-indent-unordered-list", () => {
		const { container } = render(<Unordered inline indent={false} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-an-unordered-list-by-adding-children", () => {
		const { container } = render(
			<Unordered>
				<Item>Banana</Item>
				<Item>Apple</Item>
				<Item>Orange</Item>
			</Unordered>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-an-unordered-list-by-adding-rest-of-property", () => {
		const { container } = render(
			<Unordered
				id="id"
				className="customClassName"
				style={{
					backgroundColor: "#ff4500"
				}}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-wrapperRef", () => {
		const wrapperRef = vi.fn();
		render(<Unordered wrapperRef={wrapperRef} />);
		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.bullet-list.item", () => {
	test("rendering-a-item-by-default", () => {
		const { container } = render(<Item>Lorem ipsum</Item>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-item-by-adding-rest-of-property", () => {
		const { container } = render(
			<Item
				id="id"
				className="customClassName"
				data-role="custom-item"
				style={{
					backgroundColor: "#ff4500"
				}}
			>
				Lorem ipsum
			</Item>
		);

		expect(container.querySelector("[data-role=custom-item]")?.textContent).toEqual("Lorem ipsum");
		expect(container.firstChild).toMatchSnapshot();
	});
});
