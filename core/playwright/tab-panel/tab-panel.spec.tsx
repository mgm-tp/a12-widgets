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

import { Key } from "ts-key-enum";

import { DataRoles } from "../../src/common/main/data-roles.js";
import { getBadgeTitle } from "../../src/badge/main/badge-utils.js";
import { getA11yResource } from "../../src/common/main/a11y-localization/language-context.js";
import { Badge } from "../../src/badge/main/badge.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";
import type { TabPanelTemplateProps } from "../../src/tab-panel/main/template/tab-panel.tpl.api.js";

import { expect, test } from "../fixtures/playwright.config.js";

import { TabPanelExample, TabPanelExceedTabExample } from "./tab-panel.stories.js";

test.describe("Tab panel tests", () => {
	const BADGE_COUNT = 9;
	const FIRST_TAB_TITLE = "Navigation";
	const tabs: TabPanelTemplateProps.TabProps[] = [
		{
			icon: <Icon>navigation</Icon>,
			value: "Panel 1",
			id: "tab1",
			title: FIRST_TAB_TITLE,
			children: <Badge id="info-badge-id" count={BADGE_COUNT} />
		},
		{
			icon: <Icon>search</Icon>,
			value: "Panel 2",
			id: "tab2",
			title: "Search",
			ariaLabelledby: "info-badge-id"
		},
		{
			icon: <Icon>event_note</Icon>,
			value: "Panel 3",
			id: "tab3",
			title: "Calendar"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 4",
			disabled: true,
			id: "tab4",
			title: "Feedback"
		},
		{
			icon: <Icon>airline_seat_legroom_reduced</Icon>,
			value: "Panel 5",
			title: "Airline"
		},
		{
			icon: <Icon>accessible</Icon>,
			value: "Panel 6",
			title: "Accessible"
		}
	];

	test("Should change hint according to the changing of locale", async ({ mount, getByDataRole }) => {
		const component = await mount(<TabPanelExample tabs={tabs} />);

		const tabPanel = getByDataRole(DataRoles.TabPanel);

		expect(tabPanel).toBeTruthy();

		// Test the aria-label of the first tab
		const firstTabItem = tabPanel.locator("[data-role='tab-panel-tab']").nth(0); // First tab

		const ariaLabel = await firstTabItem.getAttribute("aria-label");

		expect(ariaLabel).toEqual(FIRST_TAB_TITLE);

		// Test the interaction hint text of the first with locale "en"
		await firstTabItem.focus();

		const interactionHint = getByDataRole(DataRoles.InteractionHint);

		expect(interactionHint).toBeTruthy();

		const interactionHintText = await interactionHint.textContent();

		const badgeEnglishTitle = getBadgeTitle({ count: BADGE_COUNT }, getA11yResource("en").badgeTitles);

		expect(interactionHintText).toEqual(`${FIRST_TAB_TITLE}, ${badgeEnglishTitle}`);

		// Change the language to German
		const changeLanguageButton = component.locator("[data-role='language-button']").first();

		await changeLanguageButton.click();

		// Test the interaction hint text of the first with locale "de"
		await firstTabItem.focus();

		const badgeGermanTitle = getBadgeTitle({ count: BADGE_COUNT }, getA11yResource("de").badgeTitles);
		const interactionHintGermanText = await interactionHint.textContent();

		expect(interactionHintGermanText).toEqual(`${FIRST_TAB_TITLE}, ${badgeGermanTitle}`);

		// Change the language back to English
		await changeLanguageButton.click();

		// Test the interaction hint text of the first with locale "en" again
		await firstTabItem.focus();

		const interactionHintEnglishText = await interactionHint.textContent();

		expect(interactionHintEnglishText).toEqual(`${FIRST_TAB_TITLE}, ${badgeEnglishTitle}`);
	});

	test("Render all items in the main tab when the number of items equals the maximum number that can be displayed in the main tab", async ({
		mount,
		getByDataRole
	}) => {
		const maxTabOnMainTab = 5;
		const tabToFitMainTab = tabs.splice(0, maxTabOnMainTab);

		await mount(<TabPanelExample tabs={tabToFitMainTab} />);

		const tabPanel = getByDataRole(DataRoles.TabPanel);

		expect(tabPanel).toBeTruthy();

		const mainTab = getByDataRole(DataRoles.TabPanel.TabList);
		await expect(mainTab.locator("li")).toHaveCount(maxTabOnMainTab);
	});

	test("Focus behavior when opening the sub-menu.", async ({ mount, getByDataRole, page }) => {
		await mount(<TabPanelExceedTabExample />);

		const waitForSubTabClosed = async (): Promise<void> => {
			await page.waitForSelector(`[data-role="${DataRoles.TabPanel.SubTabList}"]`, { state: "detached" });
		};

		const mainTab = getByDataRole(DataRoles.TabPanel.TabList);

		const condensedTab = mainTab.locator("li").last();
		await condensedTab.click();

		let subTab = getByDataRole(DataRoles.TabPanel.SubTabList);

		// Check not focused on any item in the sub-menu when opened
		const listItems = getByDataRole(DataRoles.List, subTab);
		const focusOnItem = await listItems.evaluate((el) => el.contains(document.activeElement));
		expect(focusOnItem).toBeFalsy();

		// Press ArrowDown to focus on the first item of the sub-menu
		await subTab.press(Key.ArrowDown);
		const firstItemOnSubMenu = subTab.locator("li").first();
		await expect(firstItemOnSubMenu).toBeFocused();

		// Press Escape to close the sub-menu
		await subTab.press(Key.Escape);

		await waitForSubTabClosed();
		await expect(condensedTab).toBeFocused();

		// Press ArrowUp to focus on the last item of the sub-menu
		await condensedTab.click();
		subTab = getByDataRole(DataRoles.TabPanel.SubTabList);
		await subTab.press(Key.ArrowUp);
		const lastItemOnSubMenu = subTab.locator("li").last();

		await expect(lastItemOnSubMenu).toBeFocused();
		let selectedItem = subTab.locator("li").nth(2);
		await selectedItem.click();
		await waitForSubTabClosed();

		// Focus on selected item in the sub-menu when press keyDown
		await condensedTab.click();
		subTab = getByDataRole(DataRoles.TabPanel.SubTabList);
		await subTab.press(Key.ArrowDown);
		selectedItem = subTab.locator("li").nth(2);

		await expect(selectedItem).toBeFocused();

		// Press Escape to close the sub-menu
		await subTab.press(Key.Escape);
		await waitForSubTabClosed();

		await expect(condensedTab).toBeFocused();
	});
});
