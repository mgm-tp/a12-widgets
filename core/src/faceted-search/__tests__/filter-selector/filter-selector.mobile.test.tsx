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

import { render, getByDataRole, getAllByDataRole } from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { filterData, filterSectionData } from "../../test/setup.js";
import { Button } from "../../../button/main/button.view.js";
import { FilterSelectorMobile } from "../../main/filter-selector/filter-selector.mobile.js";
import type { FilterSelectorMobileProps } from "../../main/filter-selector/filter-selector.mobile.api.js";
import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

const headingElement = <ContentBoxElements.Title text="Filter Selector" id="header-filter-test" />;

function setupTest(props: Partial<FilterSelectorMobileProps>) {
	return render(
		<FilterSelectorMobile
			primaryContentProps={{
				ariaLabelledby: "header-filter-left",
				headingElements: headingElement
			}}
			activeFilters={[filterData[0], filterData[1]]}
			inactiveFilters={[filterData[2], filterData[3], filterData[4]]}
			currentFilterId={filterData[0].id}
			{...props}
		/>
	);
}

describe("com.mgmtp.a12.widgets.filter-selector.mobile", () => {
	test("rendering-default", () => {
		const { container } = setupTest({});
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-with-properties", () => {
		const footContent = <Button label="Apply" />;
		const { container } = setupTest({
			id: "id-test",
			className: "className-test",
			style: { color: "red" },
			footerContent: footContent,
			inputPlaceholder: "input placeholder",
			inputHiddenLabel: "Filter Search",
			inputProps: { data: "test" },
			hideSearchBar: true,
			disabled: true
		});

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-primary-content", () => {
		const actionElement = <div id="actionElement">action element</div>;
		const { container } = setupTest({
			actionElement: actionElement,
			primaryContentProps: { children: "No data", headingElements: headingElement }
		});
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-section", () => {
		const { container } = setupTest({ inactiveFilters: filterSectionData });
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-secondary-content", () => {
		const { container } = setupTest({
			renderFilterView: () => "test",
			renderFilterOptions: () => "filter option"
		});
		expect(container.firstChild).toMatchSnapshot();
	});

	test("on-search-change-event", async () => {
		const onSearchChangeSpy = vi.fn();
		const { container } = setupTest({
			onSearchChange: onSearchChangeSpy
		});
		const searchInput = getByDataRole(container, DataRoles.TextField.Input);
		await userEvent.fill(searchInput, filterData[0].label as string);
		expect(onSearchChangeSpy).toHaveBeenCalledWith(filterData[0].label);
	});

	test("filter-events", async () => {
		const onClickSpy = vi.fn();
		const onToggleSpy = vi.fn();
		const { container } = setupTest({
			onFilterClick: onClickSpy,
			onFilterToggle: onToggleSpy
		});
		const filterItems = getAllByDataRole(container, DataRoles.List.Item.Content);
		await userEvent.click(filterItems[0]);
		expect(onClickSpy.mock.calls[0][0]).toBe(filterData[0].id);

		const filterItemGraphic = getByDataRole(filterItems[1], DataRoles.List.Item.Graphic);
		await userEvent.click(filterItemGraphic);
		expect(onToggleSpy.mock.calls[0][0]).toBe(filterData[1].id);
	});

	test("Check event on filter item and graphic item if both `onFilterClick` and `onFilterToggle` are provided", async () => {
		const onFilterClickSpy = vi.fn();
		const onFilterToggleSpy = vi.fn();
		const { container } = setupTest({
			onFilterClick: onFilterClickSpy,
			onFilterToggle: onFilterToggleSpy,
			renderFilterView: () => (
				<div data-testid="secondary-view">
					<button data-testid="interactive-button">Interactive Button</button>
				</div>
			)
		});

		const filterItems = getAllByDataRole(container, DataRoles.List.Item.Content);
		expect(filterItems.length).toBe(5);

		// Test 1: Click on filter item should trigger only onFilterClick
		await userEvent.click(filterItems[0]);
		expect(onFilterClickSpy).toHaveBeenCalledTimes(1);
		expect(onFilterToggleSpy).not.toHaveBeenCalled();

		onFilterClickSpy.mockClear();
		onFilterToggleSpy.mockClear();

		// Test 2: Click on graphic element should trigger only onFilterToggle
		const filterItemGraphic = getByDataRole(filterItems[1], DataRoles.List.Item.Graphic);
		await userEvent.click(filterItemGraphic);

		expect(onFilterToggleSpy).toHaveBeenCalledTimes(1);
		expect(onFilterClickSpy).not.toHaveBeenCalled();
	});

	test("Check event on filter item and graphic item when only `onFilterClick` is provided", async () => {
		const onFilterClickSpy = vi.fn();
		const { container } = setupTest({
			onFilterClick: onFilterClickSpy,
			renderFilterView: () => (
				<div data-testid="secondary-view">
					<button data-testid="interactive-button">Interactive Button</button>
				</div>
			)
		});

		const filterItems = getAllByDataRole(container, DataRoles.List.Item.Content);
		expect(filterItems.length).toBe(5);

		// Test 1: Click on filter item should trigger onFilterClick
		await userEvent.click(filterItems[0]);
		expect(onFilterClickSpy).toHaveBeenCalledTimes(1);

		onFilterClickSpy.mockClear();

		// Test 2: Click on graphic element should not fallback to onFilterClick on mobile
		const filterItemGraphic = getByDataRole(filterItems[1], DataRoles.List.Item.Graphic);
		await userEvent.click(filterItemGraphic);

		expect(onFilterClickSpy).not.toHaveBeenCalled();
	});

	test("Check event on filter item and graphic item when only `onFilterToggle` is provided", async () => {
		const onFilterToggleSpy = vi.fn();
		const { container } = setupTest({
			onFilterToggle: onFilterToggleSpy,
			renderFilterView: () => (
				<div data-testid="secondary-view">
					<button data-testid="interactive-button">Interactive Button</button>
				</div>
			)
		});

		const filterItems = getAllByDataRole(container, DataRoles.List.Item.Content);
		expect(filterItems.length).toBe(5);

		// Test 1: Click on filter item should not trigger onFilterToggle
		await userEvent.click(filterItems[0]);
		expect(onFilterToggleSpy).not.toHaveBeenCalled();

		// Test 2: Click on graphic element should trigger onFilterToggle
		const filterItemGraphic = getByDataRole(filterItems[1], DataRoles.List.Item.Graphic);
		await userEvent.click(filterItemGraphic);

		expect(onFilterToggleSpy).toHaveBeenCalledTimes(1);
	});
});
