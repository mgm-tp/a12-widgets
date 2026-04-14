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

import { getAllByDataRole, render, fireEvent } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { noop } from "../../common/main/utils.js";

import { Pagination } from "../main/pagination.view.js";

describe("com.mgmtp.a12.widgets.simple-pagination", () => {
	test("render simple pagination", () => {
		const { container } = render(
			<Pagination type="simple" currentPage={3} onPageChanged={noop} pageCount={5} pageLabelTemplate="{page}/{total}" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("render all disabled simple pagination", () => {
		const { container } = render(
			<Pagination
				type="simple"
				disabled
				currentPage={3}
				onPageChanged={noop}
				pageCount={5}
				pageLabelTemplate="{page}/{total}"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("render simple pagination with disabled navigation button when current page is first page", () => {
		const { container } = render(
			<Pagination type="simple" currentPage={1} onPageChanged={noop} pageCount={5} pageLabelTemplate="{page}/{total}" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("render simple pagination with disabled navigation button when current page is last page", () => {
		const { container } = render(
			<Pagination type="simple" currentPage={5} onPageChanged={noop} pageCount={5} pageLabelTemplate="{page}/{total}" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("render left aligned simple pagination", () => {
		const { container } = render(
			<Pagination
				type="simple"
				alignment="left"
				currentPage={3}
				onPageChanged={noop}
				pageCount={5}
				pageLabelTemplate="{page}/{total}"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("render right aligned simple pagination", () => {
		const { container } = render(
			<Pagination
				type="simple"
				alignment="right"
				currentPage={3}
				onPageChanged={noop}
				pageCount={5}
				pageLabelTemplate="{page}/{total}"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("click previous page button of simple pagination", () => {
		const onPageChangedSpy = vi.fn();

		const { container } = render(
			<Pagination
				type="simple"
				currentPage={3}
				onPageChanged={onPageChangedSpy}
				pageCount={5}
				pageLabelTemplate="{page}/{total}"
			/>
		);

		const paginationButtons = getAllByDataRole(container, "button");

		//Click on Previous page button
		fireEvent.click(paginationButtons[0]);
		expect(onPageChangedSpy).toHaveBeenCalledWith(2);
	});
	test("click next page button of simple pagination", () => {
		const onPageChangedSpy = vi.fn();

		const { container } = render(
			<Pagination
				type="simple"
				currentPage={3}
				onPageChanged={onPageChangedSpy}
				pageCount={5}
				pageLabelTemplate="{page}/{total}"
			/>
		);

		const paginationButtons = getAllByDataRole(container, "button");

		//Click on Next page button
		fireEvent.click(paginationButtons[1]);
		expect(onPageChangedSpy).toHaveBeenCalledWith(4);
	});
});
