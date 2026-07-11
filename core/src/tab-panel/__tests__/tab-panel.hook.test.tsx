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

import { getAllByDataRole, getByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useState } from "react";
import { flushSync } from "react-dom";

import { Icon } from "../../icon/main/icon.view.js";
import { Badge } from "../../badge/main/badge.view.js";
import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { TabPanel } from "../main/tab-panel.view.js";
import type { TabPanelTemplateProps } from "../main/template/tab-panel.tpl.api.js";
import type { TabPanelOrientation } from "../main/tab-panel.api.js";

// ---------------------------------------------------------------------------
// Shared tab data
// ---------------------------------------------------------------------------

const groupedTabs: TabPanelTemplateProps.GroupTabProps[] = [
	{
		id: "group-1",
		groupLabel: "Group 1",
		ariaLabel: "Group 1",
		tabs: [
			{ icon: <Icon>navigation</Icon>, value: "tab-1-1", id: "tab-1-1", title: "Tab 1-1" },
			{ icon: <Icon>search</Icon>, value: "tab-1-2", id: "tab-1-2", title: "Tab 1-2" }
		]
	},
	{
		id: "group-2",
		groupLabel: "Group 2",
		ariaLabel: "Group 2",
		tabs: [
			{ icon: <Icon>settings</Icon>, value: "tab-2-1", id: "tab-2-1", title: "Tab 2-1" },
			{ icon: <Icon>event_note</Icon>, value: "tab-2-2", id: "tab-2-2", title: "Tab 2-2" }
		]
	},
	{
		id: "group-3",
		groupLabel: "Group 3",
		ariaLabel: "Group 3",
		tabs: [
			{ icon: <Icon>feedback</Icon>, value: "tab-3-1", id: "tab-3-1", title: "Tab 3-1" },
			{ icon: <Icon>directions</Icon>, value: "tab-3-2", id: "tab-3-2", title: "Tab 3-2" }
		]
	}
];

// ---------------------------------------------------------------------------
// Test component
// ---------------------------------------------------------------------------

interface GroupedTabPanelExampleProps {
	orientation?: TabPanelOrientation;
	containerStyle?: CSSProperties;
	tabs?: TabPanelTemplateProps.GroupTabProps[];
}

const GroupedTabPanelExample = ({
	orientation,
	containerStyle,
	tabs = groupedTabs
}: GroupedTabPanelExampleProps): ReactNode => {
	const [value, setValue] = useState<string | undefined>(undefined);
	const handleSelect = useCallback(
		(tab: TabPanelTemplateProps.TabProps) => setValue((prev) => (tab.value === prev ? undefined : tab.value)),
		[]
	);

	return (
		<div style={containerStyle}>
			<TabPanel id="grouped-panel" orientation={orientation} tabs={tabs} value={value} onSelect={handleSelect} />
		</div>
	);
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getCondensedTab = (container: HTMLElement): HTMLElement =>
	container.querySelector<HTMLElement>("#grouped-panel-condensed-tab")!;

/**
 * Waits for useAdaptTabPanelResponsive to finish computing overflow and for
 * the condensed tab to be inserted into the DOM.
 */
const waitForCondensedTab = async (container: HTMLElement): Promise<HTMLElement> =>
	waitFor(() => {
		const el = getCondensedTab(container);
		expect(el).toBeInTheDocument();

		return el;
	});

describe("com.mgmtp.a12.widgets.tab-panel.hook", () => {
	describe("Grouped tab panel - condensed tab with overflow (vertical)", () => {
		test("condensed tab appears when groups overflow the available height", async () => {
			const { container } = render(
				<GroupedTabPanelExample orientation="vertical" containerStyle={{ height: 150, width: 64 }} />
			);

			const condensed = await waitForCondensedTab(container);
			expect(condensed).toBeInTheDocument();
		});

		test("ArrowDown from last visible tab moves focus to condensed tab", async () => {
			const { container } = render(
				<GroupedTabPanelExample orientation="vertical" containerStyle={{ height: 150, width: 64 }} />
			);

			const condensed = await waitForCondensedTab(container);
			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);
			const allTabs = getAllByDataRole(tabList, DataRoles.TabPanel.Tab).filter(
				(el) => el.getAttribute("aria-disabled") !== "true"
			);

			// The last enabled tab before the condensed tab
			const lastVisibleTab = allTabs[allTabs.length - 2]; // condensed tab is last
			lastVisibleTab.focus();
			await userEvent.keyboard("{ArrowDown}");
			expect(condensed).toHaveFocus();
		});

		test("ArrowUp from condensed tab moves focus to last visible tab", async () => {
			const { container } = render(
				<GroupedTabPanelExample orientation="vertical" containerStyle={{ height: 150, width: 64 }} />
			);

			const condensed = await waitForCondensedTab(container);
			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);
			const allTabs = getAllByDataRole(tabList, DataRoles.TabPanel.Tab).filter(
				(el) => el.getAttribute("aria-disabled") !== "true"
			);

			const lastVisibleTab = allTabs[allTabs.length - 2];
			condensed.focus();
			await userEvent.keyboard("{ArrowUp}");
			expect(lastVisibleTab).toHaveFocus();
		});

		test("condensed tab does not appear when all groups fit", async () => {
			const { container } = render(
				<GroupedTabPanelExample orientation="vertical" containerStyle={{ height: 600, width: 64 }} />
			);

			await waitFor(() => {
				expect(getCondensedTab(container)).not.toBeInTheDocument();
			});
		});
	});

	describe("Grouped tab panel - condensed tab with overflow (horizontal)", () => {
		test("ArrowRight from last visible tab moves focus to condensed tab", async () => {
			const { container } = render(
				<GroupedTabPanelExample orientation="horizontal" containerStyle={{ height: 64, width: 150 }} />
			);

			const condensed = await waitForCondensedTab(container);
			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);
			const allTabs = getAllByDataRole(tabList, DataRoles.TabPanel.Tab).filter(
				(el) => el.getAttribute("aria-disabled") !== "true"
			);

			const lastVisibleTab = allTabs[allTabs.length - 2];
			lastVisibleTab.focus();
			await userEvent.keyboard("{ArrowRight}");
			expect(condensed).toHaveFocus();
		});

		test("ArrowLeft from condensed tab moves focus to last visible tab", async () => {
			const { container } = render(
				<GroupedTabPanelExample orientation="horizontal" containerStyle={{ height: 64, width: 150 }} />
			);

			const condensed = await waitForCondensedTab(container);
			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);
			const allTabs = getAllByDataRole(tabList, DataRoles.TabPanel.Tab).filter(
				(el) => el.getAttribute("aria-disabled") !== "true"
			);

			const lastVisibleTab = allTabs[allTabs.length - 2];
			condensed.focus();
			await userEvent.keyboard("{ArrowLeft}");
			expect(lastVisibleTab).toHaveFocus();
		});
	});

	test("Frequent rerenders with new tabs reference do not exceed the call stack", async () => {
		const FrequentRerender = (): ReactNode => {
			const [count, setCount] = useState(1);

			const tabs: TabPanelTemplateProps.TabProps[] = [
				{
					value: "editors",
					id: "editors-tab",
					title: "Editors",
					children: <Badge id="badge" count={count} />
				}
			];

			const handleClick = (): void => {
				for (let i = 0; i < 150; i++) {
					flushSync(() => setCount((count) => count + 1));
				}
			};

			return (
				<>
					<Button dataRole="trigger" onClick={handleClick}>
						Update
					</Button>
					<TabPanel id="rapid-rerender-panel" value="editors" tabs={tabs} />
				</>
			);
		};

		const caughtErrors: Error[] = [];
		const prevOnError = window.onerror;

		// React reports uncaught render errors (e.g. "Maximum update depth exceeded") via window.onerror.
		// Override it here to collect those errors and assert none occurred after the interaction.
		window.onerror = (_msg, _src, _line, _col, error): boolean => {
			if (error) {
				caughtErrors.push(error);
			}

			return true;
		};

		const { container } = render(<FrequentRerender />);
		const trigger = getByDataRole(container, "trigger");

		await userEvent.click(trigger);

		window.onerror = prevOnError;
		expect(caughtErrors, caughtErrors.map((error) => error.message).join("\n")).toHaveLength(0);
	});
});
