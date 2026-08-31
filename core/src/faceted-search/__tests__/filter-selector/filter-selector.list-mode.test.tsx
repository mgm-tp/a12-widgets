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

import { FilterSelector } from "../../main/filter-selector/filter-selector.view.js";
import { FilterSelectorTemplate } from "../../main/filter-selector/tpl/filter-selector.tpl.view.js";
import type { FilterItemData, FilterSectionData } from "../../main/filter-selector/filter-selector.list-mode.api.js";
import { filterData, filterSectionData } from "../../test/setup.js";
import { DataRoles } from "../../../common/index.js";
import { A11yResourceDefinitions } from "../../../common/main/a11y-localization/a11y-resources.js";

const sampleItems: FilterItemData[] = [
	{
		id: "language",
		label: "Language",
		content: <div data-testid="language-content">Language filter content</div>,
		active: true
	},
	{
		id: "price",
		label: "Price",
		content: <div data-testid="price-content">Price filter content</div>,
		active: false
	},
	{
		id: "format",
		label: "Format",
		content: <div data-testid="format-content">Format filter content</div>,
		active: true,
		badgeVariant: "error"
	}
];

const sampleSections: FilterSectionData[] = [
	{
		id: "section-1",
		label: "Book Details",
		items: [sampleItems[0], sampleItems[1]]
	}
];

describe("FilterSelector – new items-based list mode", () => {
	test("renders items in list mode when listMode prop is provided", () => {
		const { container } = render(<FilterSelector listMode={{ items: sampleItems }} />);

		expect(container.textContent).toContain("Language");
		expect(container.textContent).toContain("Price");
		expect(container.textContent).toContain("Format");
		expect(container.firstChild).toMatchSnapshot();
	});

	test("does not render AttachedPortal popup in items mode", () => {
		const { container } = render(<FilterSelector listMode={{ items: sampleItems }} />);

		const portal = container.querySelector("[data-role*='attached-portal']");
		expect(portal).toBeNull();
	});

	test("renders headerContent at the top", () => {
		const { container } = render(
			<FilterSelector
				listMode={{ items: sampleItems, headerContent: <div data-testid="custom-header">Filter Header</div> }}
			/>
		);

		const header = container.querySelector("[data-testid='custom-header']");
		expect(header).toBeTruthy();
		expect(header!.textContent).toBe("Filter Header");
	});

	test("renders footerContent at the bottom", () => {
		const { container } = render(
			<FilterSelector listMode={{ items: sampleItems, footerContent: <div data-testid="custom-footer">Apply</div> }} />
		);

		const footer = container.querySelector("[data-testid='custom-footer']");
		expect(footer).toBeTruthy();
		expect(footer!.textContent).toBe("Apply");
	});

	test("renders actionBar slot when provided", () => {
		const { container } = render(
			<FilterSelector
				listMode={{
					items: sampleItems,
					actionBar: (
						<FilterSelectorTemplate.ActionBar>
							<FilterSelectorTemplate.SearchInput value="" onChange={vi.fn()} onClearButtonClick={vi.fn()} />
						</FilterSelectorTemplate.ActionBar>
					)
				}}
			/>
		);

		const actionBar = container.querySelector("[data-role*='action-bar']");
		expect(actionBar).toBeTruthy();
	});

	test("does not render actionBar area when omitted", () => {
		const { container } = render(<FilterSelector listMode={{ items: sampleItems }} />);

		const actionBar = container.querySelector("[data-role*='action-bar']");
		expect(actionBar).toBeNull();
	});

	test("renders filter list when no emptyContent override is provided", () => {
		const { container } = render(<FilterSelector listMode={{ items: sampleItems }} />);

		// The list should render the item labels as collapsible headings
		expect(container.textContent).toContain("Language");
		expect(container.textContent).toContain("Price");
		expect(container.textContent).toContain("Format");
	});

	test("renders section data with group headings", () => {
		const { container } = render(<FilterSelector listMode={{ items: [...sampleSections, sampleItems[2]] }} />);

		expect(container.textContent).toContain("Book Details");
		expect(container.textContent).toContain("Language");
		expect(container.textContent).toContain("Price");
		expect(container.textContent).toContain("Format");
	});

	test("forwards wrapperRef to the wrapper element", () => {
		const refFn = vi.fn();

		render(<FilterSelector listMode={{ items: sampleItems, wrapperRef: refFn }} />);

		expect(refFn).toHaveBeenCalledTimes(1);
		expect(refFn).toHaveBeenCalledWith(expect.any(HTMLDivElement));
	});

	test("wrapper element has tabIndex -1 for programmatic focus", () => {
		const refFn = vi.fn();

		render(<FilterSelector listMode={{ items: sampleItems, wrapperRef: refFn }} />);

		const wrapperEl = refFn.mock.calls[0][0] as HTMLDivElement;
		expect(wrapperEl.tabIndex).toBe(-1);
	});

	test("classic mode still renders when items is not provided", () => {
		const mountPoint = render(<button>Mount point</button>);
		const { getByDataRole } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[filterData[0], filterData[1]]}
				inactiveFilters={[filterData[2], filterData[3], filterData[4]]}
				referenceElement={mountPoint.container}
			/>
		);

		const portal = getByDataRole(DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
	});

	test("forwards badgeTitle to Badge title attribute when item is collapsed and active", () => {
		const badgeTitle = "Custom badge title";
		const item: FilterItemData = {
			id: "status",
			label: "Status",
			content: <div>Status content</div>,
			active: true,
			collapsed: true,
			badgeTitle
		};

		const { getByDataRole } = render(<FilterSelector listMode={{ items: [item] }} />);

		const badge = getByDataRole(DataRoles.Badge);
		expect(badge.getAttribute("title")).toBe(badgeTitle);
	});

	test("Badge falls back to default title when badgeTitle is omitted", () => {
		const item: FilterItemData = {
			id: "status",
			label: "Status",
			content: <div>Status content</div>,
			active: true,
			collapsed: true
		};

		const { getByDataRole } = render(<FilterSelector listMode={{ items: [item] }} />);

		const badge = getByDataRole(DataRoles.Badge);
		expect(badge.getAttribute("title")).toBe(A11yResourceDefinitions.en.filterSelectorTitles?.activeFilterBadgeTitle);
	});

	test("classic mode is not affected by new-mode-only props being absent", () => {
		const mountPoint = render(<button>Mount point</button>);
		const { getByDataRole } = render(
			<FilterSelector
				primaryContentProps={{ headingElements: "" }}
				activeFilters={[filterData[0]]}
				inactiveFilters={filterSectionData}
				referenceElement={mountPoint.container}
			/>
		);

		const portal = getByDataRole(DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
	});
});
