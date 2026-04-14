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

import { DataRoles } from "../../src/common/main/data-roles.js";

import { test, expect } from "../fixtures/playwright.config.js";

import { SupportingPanesLayoutExample } from "./supporting-panes-layout.stories.js";

test.describe("Supporting panes layout tests", () => {
	test("Render Secondary pane with default expand value", async ({ mount }) => {
		const wrapperWidth = 1000;
		const component = await mount(<SupportingPanesLayoutExample wrapperWidth={wrapperWidth} />);
		// Locate the initial pane and resize handler
		const pane = component.locator('[data-positioning="left"]').first();

		// Get the original of the pane
		const panePosition = await pane.boundingBox();
		const paneWidth = panePosition?.width;

		// Get the default width of the pane, default is 25% of the layout width
		const defaultPaneWidth = (wrapperWidth * 25) / 100;

		expect(paneWidth).toEqual(defaultPaneWidth);
	});
	test("Secondary should be collapsed and expanded when double-clicking to the resize handler", async ({
		mount,
		page,
		getByDataRole
	}) => {
		const collapsedWidth = 100;
		const expandedWidth = 200;
		const component = await mount(
			<SupportingPanesLayoutExample widthConfig={{ collapsed: collapsedWidth, expanded: expandedWidth }} />
		);

		// Locate the initial pane and resize handler
		const pane = component.locator('[data-positioning="left"]').first();
		const resizeHandler = getByDataRole(DataRoles.SupportingPanesLayoutResizeHandler, pane).first();

		// Get the original of the pane
		const panePosition = await pane.boundingBox();
		const paneWidth = panePosition?.width;

		expect(paneWidth).toEqual(expandedWidth);

		// Perform a double click on the resize handler
		await resizeHandler.dblclick();

		// Wait after transition to update the pane width
		await page.waitForTimeout(1000);

		const collapsedPanePosition = await pane.boundingBox();
		const collapsedPaneWidth = collapsedPanePosition?.width;

		expect(collapsedPaneWidth).toEqual(collapsedWidth);

		await resizeHandler.dblclick();

		const expandedPanePosition = await pane.boundingBox();
		const expandedPaneWidth = expandedPanePosition?.width;

		expect(expandedPaneWidth).toEqual(expandedPaneWidth);
	});

	test("Secondary should be expanded when the pane initial state is collapsed", async ({
		mount,
		page,
		getByDataRole
	}) => {
		const expandedWidth = 200;
		const collapsedWidth = 100;

		const component = await mount(
			<SupportingPanesLayoutExample widthConfig={{ expanded: expandedWidth, collapsed: collapsedWidth }} collapsed />
		);

		// Wait after transition to update the pane width
		await page.waitForTimeout(1000);

		// Locate the initial pane and resize handler
		const pane = component.locator('[data-positioning="left"]').first();

		// Get the original of the pane
		const panePosition = await pane.boundingBox();
		const paneWidth = panePosition?.width;

		expect(paneWidth).toEqual(collapsedWidth);

		const resizeHandler = getByDataRole(DataRoles.SupportingPanesLayoutResizeHandler, pane).first();

		// Perform a double click on the resize handler
		await resizeHandler.dblclick();

		// Wait after transition to update the pane width
		await page.waitForTimeout(1000);

		// Get the original of the pane
		const expandedPanePosition = await pane.boundingBox();
		const expandedPaneWidth = expandedPanePosition?.width;

		expect(expandedPaneWidth).toEqual(expandedWidth);
	});

	test("Hide and show pane", async ({ mount, page, getByDataRole }) => {
		const expandedWidth = "20%";
		const collapsedWidth = 100;
		const wrapperWidth = 1000;

		const component = await mount(
			<SupportingPanesLayoutExample
				widthConfig={{ expanded: expandedWidth, collapsed: collapsedWidth }}
				hide={true}
				wrapperWidth={wrapperWidth}
			/>
		);

		const leftPane = component.locator('[data-positioning="left"]').first();

		await expect(leftPane).toBeHidden();

		// Wait after transition to update the pane width
		await page.waitForTimeout(1000);
		// Locate the initial pane and resize handler
		const primaryPane = getByDataRole(DataRoles.SupportingPanesLayout.PrimaryPane);
		const showPaneButton = getByDataRole(DataRoles.Button, primaryPane).first();

		// Show the left pane
		await showPaneButton.click();

		await expect(leftPane).toBeVisible();

		const resizeHandler = getByDataRole(DataRoles.SupportingPanesLayoutResizeHandler, leftPane).first();

		// Perform a double click on the resize handler to collapse the pane
		await resizeHandler.dblclick();

		// Wait after transition to update the pane width
		await page.waitForTimeout(1000);

		// Get the original of the pane
		const collapsedPanePosition = await leftPane.boundingBox();
		const collapsedPaneWidth = collapsedPanePosition?.width;

		expect(collapsedPaneWidth).toEqual(collapsedWidth);

		// Perform a double click on the resize handler to expand the pane
		await resizeHandler.dblclick();

		// Wait after transition to update the pane width
		await page.waitForTimeout(1000);

		// Get the original of the pane
		const expandedPanePosition = await leftPane.boundingBox();
		const expandedPaneWidth = expandedPanePosition?.width;

		expect(expandedPaneWidth).toEqual((wrapperWidth * 20) / 100);

		const hidePaneButton = leftPane.locator(`[data-role=${DataRoles.Button}]`);

		// Hide the left pane
		await hidePaneButton.click();

		await expect(leftPane).toBeHidden();
	});
});
