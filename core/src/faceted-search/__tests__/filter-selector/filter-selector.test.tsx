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

import { render, getByDataRole, fireEvent, waitFor, getAllByDataRole } from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { FilterSelector } from "../../main/filter-selector/filter-selector.view.js";
import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { filterData, filterSectionData } from "../../test/setup.js";
import { DataRoles } from "../../../common/main/data-roles.js";

const headingElement = <ContentBoxElements.Title text="Filter Selector" id="header-filter-test" />;

describe("com.mgmtp.a12.widgets.filter-selector", () => {
	test("rendering-properties", () => {
		const props = {
			id: "test-id",
			className: "test-className",
			style: { color: "red" },
			footerContent: "footContent"
		};

		const mountPoint = render(<button>Mount point</button>);
		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[filterData[0], filterData[1]]}
				inactiveFilters={[filterData[2], filterData[3], filterData[4]]}
				referenceElement={mountPoint.container}
				{...props}
			/>
		);
		fireEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toMatchSnapshot();
	});

	test("rendering-primaryContent", () => {
		const actionElement = <div id="actionElement">action element</div>;
		const props = {
			actionElement: actionElement,
			primaryContentProps: { ariaLabelledby: "ariaLabelledby", headingElements: headingElement, children: "children" }
		};
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				activeFilters={[filterData[0], filterData[1]]}
				inactiveFilters={[filterData[2], filterData[3], filterData[4]]}
				referenceElement={mountPoint.container}
				{...props}
			/>
		);
		fireEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toMatchSnapshot();
	});

	test("rendering-section", () => {
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[filterData[0], filterData[1]]}
				inactiveFilters={filterSectionData}
				referenceElement={mountPoint.container}
			/>
		);
		fireEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toMatchSnapshot();
	});

	test("rendering-list-item", () => {
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[]}
				inactiveFilters={[]}
				disabled
				referenceElement={mountPoint.container}
			/>
		);
		fireEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toMatchSnapshot();
	});

	test("rendering-secondary-content", () => {
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[]}
				inactiveFilters={[]}
				disabled
				renderFilterView={() => "test"}
				renderFilterOptions={() => "filter option"}
				referenceElement={mountPoint.container}
			/>
		);
		fireEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toMatchSnapshot();
	});

	test("filter-selector-item-checkbox-click-event", () => {
		const onFilterClickSpy = vi.fn();
		let filterId;
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[filterData[3]]}
				inactiveFilters={[]}
				renderFilterView={() => "test"}
				renderFilterOptions={() => "filter option"}
				referenceElement={mountPoint.container}
				onFilterClick={(id) => {
					filterId = id;
					onFilterClickSpy();
				}}
			/>
		);
		fireEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		const itemCheckboxInputLabel = getByDataRole(container, DataRoles.Checkbox.Control.Inner.HiddenLabel);
		fireEvent.click(itemCheckboxInputLabel);

		expect(filterId).toEqual(filterData[3].id);
		expect(onFilterClickSpy).toHaveBeenCalledTimes(1);
	});

	test("Focus is set to the Filter Selector's search input by default", async () => {
		const mountPoint = render(<button>Mount point</button>);
		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[]}
				inactiveFilters={[]}
				referenceElement={mountPoint.container}
			/>
		);

		fireEvent.click(mountPoint.container);

		await waitFor(() => {
			const searchInput = getByDataRole(container, DataRoles.TextField.Input);

			expect(searchInput).toHaveFocus();
		});
	});

	test("Focus is set to Filter Selector when `hideSearchBar` is true", async () => {
		const mountPoint = render(<button>Mount point</button>);
		const { container } = render(
			<FilterSelector
				hideSearchBar
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[]}
				inactiveFilters={[]}
				referenceElement={mountPoint.container}
			/>
		);

		fireEvent.click(mountPoint.container);

		await waitFor(() => {
			const filterSelector = getByDataRole(container, DataRoles.FilterSelector);

			expect(filterSelector).toHaveFocus();
		});
	});

	test("Check event on filter item and graphic item if both `onFilterClick` and `onFilterToggle` are provided", async () => {
		const onFilterClickSpy = vi.fn();
		const onFilterToggleSpy = vi.fn();
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: headingElement }}
				activeFilters={[filterData[0]]}
				inactiveFilters={[filterData[1], filterData[2]]}
				referenceElement={mountPoint.container}
				onFilterClick={onFilterClickSpy}
				onFilterToggle={onFilterToggleSpy}
				renderFilterView={() => (
					<div data-testid="secondary-view">
						<button data-testid="interactive-button">Interactive Button</button>
					</div>
				)}
			/>
		);

		await userEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		const filterItems = getAllByDataRole(container, DataRoles.List.Item.Content);
		expect(filterItems.length).toBe(3);

		// Test 1: Click on filter item should trigger only onFilterClick
		await userEvent.click(filterItems[0]);
		expect(onFilterClickSpy).toHaveBeenCalledTimes(1);
		expect(onFilterToggleSpy).not.toHaveBeenCalled();

		// Verify that focus moves to the first interactive element in the secondary view
		await waitFor(() => {
			const firstInteractiveElement = container.querySelector('[data-testid="interactive-button"]');
			expect(firstInteractiveElement).toHaveFocus();
		});

		onFilterClickSpy.mockClear();
		onFilterToggleSpy.mockClear();

		// Test 2: Click on graphic element should trigger only onFilterToggle
		const filterItemGraphic = getByDataRole(filterItems[1], DataRoles.List.Item.Graphic);
		await userEvent.click(filterItemGraphic);

		expect(onFilterToggleSpy).toHaveBeenCalledTimes(1);
		expect(onFilterClickSpy).not.toHaveBeenCalled();

		// Verify that focus moves to the first interactive element in the secondary view
		await waitFor(() => {
			const firstInteractiveElement = container.querySelector('[data-testid="interactive-button"]');
			expect(firstInteractiveElement).toHaveFocus();
		});
	});

	test("Check event on filter item and graphic item when only `onFilterClick` is provided", async () => {
		const onFilterClickSpy = vi.fn();
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: headingElement }}
				activeFilters={[filterData[0]]}
				inactiveFilters={[filterData[1], filterData[2]]}
				referenceElement={mountPoint.container}
				onFilterClick={onFilterClickSpy}
				renderFilterView={() => (
					<div data-testid="secondary-view">
						<button data-testid="interactive-button">Interactive Button</button>
					</div>
				)}
			/>
		);

		await userEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		const filterItems = getAllByDataRole(container, DataRoles.List.Item.Content);
		expect(filterItems.length).toBe(3);

		// Test 1: Click on filter item should trigger onFilterClick
		await userEvent.click(filterItems[0]);
		expect(onFilterClickSpy).toHaveBeenCalledTimes(1);

		onFilterClickSpy.mockClear();

		// Test 2: Click on graphic element should fallback to onFilterClick
		const filterItemGraphic = getByDataRole(filterItems[1], DataRoles.List.Item.Graphic);
		await userEvent.click(filterItemGraphic);

		expect(onFilterClickSpy).toHaveBeenCalledTimes(1);

		// Verify that focus moves to the first interactive element in the secondary view
		await waitFor(() => {
			const firstInteractiveElement = container.querySelector('[data-testid="interactive-button"]');
			expect(firstInteractiveElement).toHaveFocus();
		});
	});

	test("Check event on filter item and graphic item when only `onFilterToggle` is provided", async () => {
		const onFilterToggleSpy = vi.fn();
		const mountPoint = render(<button>Mount point</button>);

		const { container } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: headingElement }}
				activeFilters={[filterData[0]]}
				inactiveFilters={[filterData[1], filterData[2]]}
				referenceElement={mountPoint.container}
				onFilterToggle={onFilterToggleSpy}
				renderFilterView={() => (
					<div data-testid="secondary-view">
						<button data-testid="interactive-button">Interactive Button</button>
					</div>
				)}
			/>
		);

		await userEvent.click(mountPoint.container);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();

		const filterItems = getAllByDataRole(container, DataRoles.List.Item.Content);
		expect(filterItems.length).toBe(3);

		// Test 1: Click on filter item should not trigger onFilterToggleSpy
		await userEvent.click(filterItems[0]);
		expect(onFilterToggleSpy).not.toHaveBeenCalled();

		// Test 2: Click on graphic element should trigger onFilterToggle
		const filterItemGraphic = getByDataRole(filterItems[1], DataRoles.List.Item.Graphic);
		await userEvent.click(filterItemGraphic);

		expect(onFilterToggleSpy).toHaveBeenCalledTimes(1);

		// Verify that focus moves to the first interactive element in the secondary view
		await waitFor(() => {
			const firstInteractiveElement = container.querySelector('[data-testid="interactive-button"]');
			expect(firstInteractiveElement).toHaveFocus();
		});
	});
});
