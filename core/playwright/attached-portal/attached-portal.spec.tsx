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

import { ExampleAttachedPortal, IFrameExample } from "./attached-portal.stories.js";

test.describe("Attached Portal tests", () => {
	test.describe("has given position", () => {
		test("should not close when open another portal and it covers the trigger element", async ({
			mount,
			getByDataRole
		}) => {
			const component = await mount(<ExampleAttachedPortal hasSubPortal position={{ top: 100, left: 100 }} />);
			await component.locator('[data-role="trigger-button"]').first().click();

			const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();
			await expect(attachedPortal).toBeVisible();

			await component.locator('[data-role="sub-menu-button"]').first().click();
			await expect(attachedPortal).toBeVisible();
		});
	});

	test.describe("has referenceElement", () => {
		test("should not close when open another portal and it covers the trigger element", async ({
			mount,
			getByDataRole
		}) => {
			const component = await mount(<ExampleAttachedPortal hasSubPortal hasReferenceElement />);
			await component.locator("[data-role='trigger-button']").first().click();
			const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();
			await expect(attachedPortal).toBeVisible();

			await component.locator("[data-role='sub-menu-button']").first().click();

			await expect(attachedPortal).toBeVisible();
		});
	});

	test("should close if the trigger element's position changes and hideOnReferenceElementPositionChange is set to true", async ({
		mount,
		getByDataRole
	}) => {
		const component = await mount(<ExampleAttachedPortal hideOnReferenceElementPositionChange hasReferenceElement />);
		await component.locator("[data-role='trigger-button']").first().click();
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();
		await expect(attachedPortal).toBeVisible();

		await component.locator("[data-role='trigger-change-position']").first().click();
		await expect(attachedPortal).not.toBeVisible();
	});

	test("should not close if the trigger element's position changes and hideOnReferenceElementPositionChange is set to false", async ({
		mount,
		page,
		getByDataRole
	}) => {
		const component = await mount(
			<ExampleAttachedPortal hideOnReferenceElementPositionChange={false} hasReferenceElement />
		);

		await component.locator("[data-role='trigger-button']").first().click();
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();

		await expect(attachedPortal).toBeVisible();

		const boundingBox = await attachedPortal.evaluate((element) => element.getBoundingClientRect());

		await component.locator("[data-role='trigger-change-position']").first().click();

		await page.waitForTimeout(1000);

		await expect(attachedPortal).toBeVisible();

		const boundingBoxAfterChangePosition = await attachedPortal.evaluate((element) => element.getBoundingClientRect());

		expect(boundingBoxAfterChangePosition.top).not.toEqual(boundingBox.top);
		expect(boundingBoxAfterChangePosition.left).not.toEqual(boundingBox.left);
	});

	test("should display the portal at the specified position", async ({ mount, getByDataRole }) => {
		const component = await mount(
			<ExampleAttachedPortal hideOnReferenceElementPositionChange={false} position={{ top: 100, left: 100 }} />
		);

		await component.locator("[data-role='trigger-button']").first().click();
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();

		await expect(attachedPortal).toBeVisible();

		const boundingBox = await attachedPortal.evaluate((element) => element.getBoundingClientRect());

		expect(boundingBox.top).toEqual(100);
		expect(boundingBox.left).toEqual(100);
	});

	test("should not close attached portal which opening from an overlapped reference element while scrolling when hideOnReferenceElementPositionChange is set to false", async ({
		mount,
		page,
		getByDataRole
	}) => {
		const component = await mount(
			<ExampleAttachedPortal hideOnReferenceElementPositionChange={false} hasReferenceElement />
		);

		// Make the page scrollable
		await page.evaluate(() => {
			document.body.style.height = "2000px";
			document.body.style.overflow = "auto";
		});

		await page.mouse.wheel(0, 10);
		await page.waitForTimeout(1000); // Ensure scroll completes

		const triggerButton = component.locator("[data-role='trigger-button']").first();
		await triggerButton.evaluate((el: HTMLElement) => el.click());
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();

		await expect(attachedPortal).toBeVisible();

		await page.mouse.wheel(0, -10);
		await page.waitForTimeout(1000);

		await expect(attachedPortal).toBeVisible();
	});

	test("should close attached portal which opening from an overlapped reference element while scrolling when hideOnReferenceElementPositionChange is set to true", async ({
		mount,
		page,
		getByDataRole
	}) => {
		const component = await mount(
			<ExampleAttachedPortal hideOnReferenceElementPositionChange={true} hasReferenceElement />
		);

		// Make the page scrollable
		await page.evaluate(() => {
			document.body.style.height = "2000px";
			document.body.style.overflow = "auto";
		});

		await page.mouse.wheel(0, 10);
		await page.waitForTimeout(1000); // Ensure scroll completes

		const triggerButton = component.locator("[data-role='trigger-button']").first();
		await triggerButton.evaluate((el: HTMLElement) => el.click());
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();

		await expect(attachedPortal).toBeVisible();

		await page.mouse.wheel(0, -10);
		await page.waitForTimeout(1000);

		await expect(attachedPortal).not.toBeVisible();
	});

	test.describe("interaction hint", () => {
		test("should update the position of portal when the trigger element changes the position", async ({
			mount,
			page,
			getByDataRole
		}) => {
			const component = await mount(<ExampleAttachedPortal hasReferenceElement title="Interaction Hint" />);

			const triggerElement = component.locator("[data-role='trigger-button']").first();

			await triggerElement.focus();

			const interactionHint = getByDataRole(DataRoles.InteractionHint).first();

			await expect(interactionHint).toBeVisible();

			await triggerElement.click();
			const attachedPortal = getByDataRole(DataRoles.AttachedPortal).first();

			await expect(attachedPortal).toBeVisible();
			await expect(interactionHint).not.toBeVisible();

			const attachedPortalRect = await attachedPortal.evaluate((element) => element.getBoundingClientRect());

			await component.locator("[data-role='trigger-change-position']").first().click();

			await page.waitForTimeout(2000);

			await expect(attachedPortal).toBeVisible();

			const attachedPortalRectAfterChangePosition = await attachedPortal.evaluate((element) =>
				element.getBoundingClientRect()
			);

			expect(attachedPortalRectAfterChangePosition.top).not.toEqual(attachedPortalRect.top);
			expect(attachedPortalRectAfterChangePosition.left).not.toEqual(attachedPortalRect.left);
		});
	});

	test("should show portal when it is implemented in an iframe", async ({ mount, getByDataRole }) => {
		const component = await mount(<IFrameExample />);
		const parentFrameLocator = component.frameLocator('iframe[title="Parent Iframe"]');
		const triggerButton = parentFrameLocator?.locator('[data-role="button"]');

		await triggerButton?.first().click();
		const attachedPortal = getByDataRole(DataRoles.AttachedPortal);

		await expect(attachedPortal).toBeVisible();
	});
});
