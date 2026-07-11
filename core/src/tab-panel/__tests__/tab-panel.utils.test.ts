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

import { describe, expect, test } from "vitest";

import type { TabPanelTemplateProps } from "../main/template/index.js";
import { filterGroupedTabs, flattenTabs, isGroupedTabList } from "../main/tab-panel.utils.js";

const tab1: TabPanelTemplateProps.TabProps = { value: "navigation", id: "tab-navigation", title: "Navigation" };
const tab2: TabPanelTemplateProps.TabProps = { value: "search", id: "tab-search", title: "Search" };
const tab3: TabPanelTemplateProps.TabProps = { value: "calendar", id: "tab-calendar", title: "Calendar" };

const groups: TabPanelTemplateProps.GroupTabProps[] = [
	{ id: "group-general", groupLabel: "General", ariaLabel: "General", tabs: [tab1, tab2] },
	{ id: "group-scheduling", groupLabel: "Scheduling", ariaLabel: "Scheduling", tabs: [tab3] }
];

describe("com.mgmtp.a12.widgets.tab-panel.utils", () => {
	describe("isGroupedTabList", () => {
		test("Returns true for grouped tabs", () => {
			expect(isGroupedTabList(groups)).toBe(true);
		});

		test("Returns false for flat tabs", () => {
			expect(isGroupedTabList([tab1, tab2])).toBe(false);
		});

		test("Returns false for an empty array", () => {
			expect(isGroupedTabList([])).toBe(false);
		});
	});

	describe("flattenTabs", () => {
		test("Returns flat tabs as-is", () => {
			const flat = [tab1, tab2];
			expect(flattenTabs(flat)).toEqual(flat);
		});

		test("Flattens grouped tabs into a single array", () => {
			expect(flattenTabs(groups)).toEqual([tab1, tab2, tab3]);
		});

		test("Returns empty array for empty input", () => {
			expect(flattenTabs([])).toEqual([]);
		});
	});

	describe("filterGroupedTabs", () => {
		test("Keeps only groups containing the subset tabs", () => {
			const result = filterGroupedTabs([tab3], groups);
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe("group-scheduling");
			expect(result[0].tabs).toEqual([tab3]);
		});

		test("Filters tabs within a group", () => {
			const result = filterGroupedTabs([tab1], groups);
			expect(result).toHaveLength(1);
			expect(result[0].tabs).toEqual([tab1]);
		});

		test("Returns empty array when no tabs match", () => {
			const noMatch: TabPanelTemplateProps.TabProps = { value: "settings", id: "tab-settings", title: "Settings" };
			expect(filterGroupedTabs([noMatch], groups)).toEqual([]);
		});

		test("Returns all groups when all tabs are in the subset", () => {
			const result = filterGroupedTabs([tab1, tab2, tab3], groups);
			expect(result).toHaveLength(2);
		});
	});
});
