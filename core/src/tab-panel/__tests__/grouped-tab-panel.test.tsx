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

import { getAllByDataRole, getByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { TabPanel } from "../main/tab-panel.view.js";
import type { TabPanelTemplateProps } from "../main/template/tab-panel.tpl.api.js";

const groupedTabs: TabPanelTemplateProps.GroupTabProps[] = [
	{
		id: "group-nav",
		groupLabel: "Navigation",
		ariaLabel: "Navigation Group",
		tabs: [
			{ icon: <Icon>navigation</Icon>, value: "Map", id: "tab-map", title: "Map" },
			{ icon: <Icon>directions</Icon>, value: "Directions", id: "tab-directions", title: "Directions" }
		]
	},
	{
		id: "group-content",
		groupLabel: "Content",
		ariaLabel: "Content Group",
		tabs: [
			{ icon: <Icon>search</Icon>, value: "Search", id: "tab-search", title: "Search" },
			{ icon: <Icon>event_note</Icon>, value: "Calendar", id: "tab-calendar", title: "Calendar" }
		]
	},
	{
		id: "group-settings",
		groupLabel: "Settings",
		ariaLabel: "Settings Group",
		tabs: [
			{ icon: <Icon>settings</Icon>, value: "Settings", id: "tab-settings", title: "Settings" },
			{ icon: <Icon>feedback</Icon>, value: "Feedback", id: "tab-feedback", title: "Feedback", disabled: true }
		]
	}
];

interface GroupedTabPanelExampleProps {
	orientation: "vertical" | "horizontal";
}

const GroupedTabPanelExample = ({ orientation }: GroupedTabPanelExampleProps): ReactNode => {
	const [value, setValue] = useState<string | undefined>(undefined);
	const handleSelect = useCallback(
		(tab: TabPanelTemplateProps.TabProps) => setValue((prev) => (tab.value === prev ? undefined : tab.value)),
		[]
	);

	return (
		<TabPanel id="grouped-panel" orientation={orientation} tabs={groupedTabs} value={value} onSelect={handleSelect} />
	);
};

const totalTabCount = groupedTabs.reduce((sum, g) => sum + g.tabs.length, 0);

describe("com.mgmtp.a12.widgets.grouped-tab-panel", () => {
	describe("Vertical grouped tab panel", () => {
		test("renders correct group structure: tablist, groups, dividers, group tab lists, tabs, and disabled state", () => {
			const { container } = render(<GroupedTabPanelExample orientation="vertical" />);

			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);
			expect(tabList).toBeInTheDocument();
			expect(tabList).toHaveAttribute("role", "group");

			const groups = getAllByDataRole(container, DataRoles.TabPanel.Group.TabList);
			expect(groups).toHaveLength(groupedTabs.length);
			groups.forEach((group) => expect(group).toHaveAttribute("aria-orientation", "vertical"));

			const dividers = getAllByDataRole(container, DataRoles.TabPanel.Group.Divider);
			expect(dividers).toHaveLength(groupedTabs.length - 1);
			dividers.forEach((divider) => expect(divider).toHaveAttribute("role", "separator"));

			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			expect(tabs).toHaveLength(totalTabCount);

			const disabledTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Feedback");
			expect(disabledTab).toBeInTheDocument();
			expect(disabledTab).toHaveAttribute("aria-disabled", "true");
		});

		test("clicking a tab marks it as selected and deselects others", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="vertical" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const mapTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Map")!;
			const searchTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Search")!;

			await userEvent.click(mapTab);
			expect(mapTab).toHaveAttribute("aria-selected", "true");
			expect(searchTab).toHaveAttribute("aria-selected", "false");

			await userEvent.click(searchTab);
			expect(searchTab).toHaveAttribute("aria-selected", "true");
			expect(mapTab).toHaveAttribute("aria-selected", "false");
		});

		test("ArrowDown navigates across group boundaries", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="vertical" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const enabledTabs = tabs.filter((tab) => tab.getAttribute("aria-disabled") !== "true");

			enabledTabs[0].focus();
			expect(enabledTabs[0]).toHaveFocus();

			await userEvent.keyboard("{ArrowDown}");
			expect(enabledTabs[1]).toHaveFocus();

			await userEvent.keyboard("{ArrowDown}");
			expect(enabledTabs[2]).toHaveFocus();

			await userEvent.keyboard("{ArrowDown}");
			expect(enabledTabs[3]).toHaveFocus();

			await userEvent.keyboard("{ArrowDown}");
			expect(enabledTabs[4]).toHaveFocus();
		});

		test("ArrowUp navigates across group boundaries", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="vertical" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const enabledTabs = tabs.filter((tab) => tab.getAttribute("aria-disabled") !== "true");

			enabledTabs[4].focus();
			expect(enabledTabs[4]).toHaveFocus();

			await userEvent.keyboard("{ArrowUp}");
			expect(enabledTabs[3]).toHaveFocus();

			await userEvent.keyboard("{ArrowUp}");
			expect(enabledTabs[2]).toHaveFocus();

			await userEvent.keyboard("{ArrowUp}");
			expect(enabledTabs[1]).toHaveFocus();

			await userEvent.keyboard("{ArrowUp}");
			expect(enabledTabs[0]).toHaveFocus();
		});

		test("Tab moves focus out of the tablist", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="vertical" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const mapTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Map")!;
			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);

			mapTab.focus();
			expect(mapTab).toHaveFocus();

			await userEvent.keyboard("{Tab}");
			expect(tabList.contains(document.activeElement)).toBe(false);
		});
	});

	describe("Horizontal grouped tab panel", () => {
		test("renders correct group structure: tablist, groups, dividers, group tab lists, tabs, and disabled state", () => {
			const { container } = render(<GroupedTabPanelExample orientation="horizontal" />);

			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);
			expect(tabList).toBeInTheDocument();
			expect(tabList).toHaveAttribute("role", "group");

			const groups = getAllByDataRole(container, DataRoles.TabPanel.Group.TabList);
			expect(groups).toHaveLength(groupedTabs.length);
			groups.forEach((group) => expect(group).toHaveAttribute("aria-orientation", "horizontal"));

			const dividers = getAllByDataRole(container, DataRoles.TabPanel.Group.Divider);
			expect(dividers).toHaveLength(groupedTabs.length - 1);
			dividers.forEach((divider) => expect(divider).toHaveAttribute("role", "separator"));

			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			expect(tabs).toHaveLength(totalTabCount);

			const disabledTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Feedback");
			expect(disabledTab).toBeInTheDocument();
			expect(disabledTab).toHaveAttribute("aria-disabled", "true");
		});

		test("clicking a tab marks it as selected and deselects others", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="horizontal" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const mapTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Map")!;
			const calendarTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Calendar")!;

			await userEvent.click(mapTab);
			expect(mapTab).toHaveAttribute("aria-selected", "true");
			expect(calendarTab).toHaveAttribute("aria-selected", "false");

			await userEvent.click(calendarTab);
			expect(calendarTab).toHaveAttribute("aria-selected", "true");
			expect(mapTab).toHaveAttribute("aria-selected", "false");
		});

		test("ArrowRight navigates across group boundaries", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="horizontal" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const enabledTabs = tabs.filter((tab) => tab.getAttribute("aria-disabled") !== "true");

			enabledTabs[0].focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(enabledTabs[1]).toHaveFocus();

			await userEvent.keyboard("{ArrowRight}");
			expect(enabledTabs[2]).toHaveFocus(); // Crosses group boundary

			await userEvent.keyboard("{ArrowRight}");
			expect(enabledTabs[3]).toHaveFocus();
		});

		test("ArrowLeft navigates across group boundaries", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="horizontal" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const enabledTabs = tabs.filter((tab) => tab.getAttribute("aria-disabled") !== "true");

			enabledTabs[3].focus();
			await userEvent.keyboard("{ArrowLeft}");
			expect(enabledTabs[2]).toHaveFocus();

			await userEvent.keyboard("{ArrowLeft}");
			expect(enabledTabs[1]).toHaveFocus();

			await userEvent.keyboard("{ArrowLeft}");
			expect(enabledTabs[0]).toHaveFocus();
		});

		test("Tab moves focus out of the tablist", async () => {
			const { container } = render(<GroupedTabPanelExample orientation="horizontal" />);
			const tabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const mapTab = tabs.find((tab) => tab.getAttribute("aria-label") === "Map")!;
			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);

			mapTab.focus();
			expect(mapTab).toHaveFocus();

			await userEvent.keyboard("{Tab}");
			expect(tabList.contains(document.activeElement)).toBe(false);
		});
	});
});
