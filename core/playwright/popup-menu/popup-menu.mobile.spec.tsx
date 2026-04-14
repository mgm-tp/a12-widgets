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

import { expect, test } from "../fixtures/playwright.config.js";

import { ExamplePopUpMenu, ExamplePopUpMenuWithApplicationFrame } from "./popup-menu.stories.js";

test.describe("Popup Menu mobile", () => {
	test.describe("without A11YMobileDesign", () => {
		test("Should close popup menu when click outside and the focus is set back to the trigger element", async ({
			mount,
			getByDataRole,
			page
		}) => {
			await mount(<ExamplePopUpMenu enableA11YMobileDesign={false} />);

			const buttonTrigger = getByDataRole(DataRoles.Popup.TriggerElement);
			const popupMenu = getByDataRole(DataRoles.Popup.Menu);

			await buttonTrigger.first().click();

			await expect(popupMenu).toBeVisible();

			await page.mouse.click(0, 0);

			await expect(popupMenu).not.toBeVisible();
			await expect(buttonTrigger).toBeFocused();
		});
		test("Should close popup menu when click outside and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async ({
			mount,
			page
		}) => {
			const component = await mount(
				<ExamplePopUpMenu enableA11YMobileDesign={false} focusOnTriggerElementAfterClose={false} />
			);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;

			await component.locator(buttonTriggerSelector).first().click();

			await expect(component.locator(popupMenuSelector)).toBeVisible();

			await page.mouse.click(0, 0);

			await expect(component.locator(popupMenuSelector)).not.toBeVisible();
			await expect(component.locator(buttonTriggerSelector)).not.toBeFocused();
		});
	});
	test.describe("with A11YMobileDesign", () => {
		test("Should close popup menu when click close button and the focus is set back to the trigger element", async ({
			mount
		}) => {
			const component = await mount(<ExamplePopUpMenu enableA11YMobileDesign={true} />);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;
			const closeButtonSelector = `[data-role=${DataRoles.Popup.CloseButton}]`;

			await component.locator(buttonTriggerSelector).first().click();

			await expect(component.locator(popupMenuSelector)).toBeVisible();

			await component.locator(closeButtonSelector).first().click();

			await expect(component.locator(popupMenuSelector)).not.toBeVisible();
			await expect(component.locator(buttonTriggerSelector)).toBeFocused();
		});

		test("Should close popup menu when click close button and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async ({
			mount
		}) => {
			const component = await mount(
				<ExamplePopUpMenu enableA11YMobileDesign={true} focusOnTriggerElementAfterClose={false} />
			);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;
			const closeButtonSelector = `[data-role=${DataRoles.Popup.CloseButton}]`;

			await component.locator(buttonTriggerSelector).first().click();

			await expect(component.locator(popupMenuSelector)).toBeVisible();

			await component.locator(closeButtonSelector).first().click();

			await expect(component.locator(popupMenuSelector)).not.toBeVisible();
			await expect(component.locator(buttonTriggerSelector)).not.toBeFocused();
		});

		test("Should disabled elements in background when opening", async ({ mount }) => {
			const component = await mount(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;
			const applicationFrame = `[data-role="application-frame"]`;
			const applicationFrameHeader = `[data-role="application-frame-header"]`;

			await component.locator(buttonTriggerSelector).first().click();

			await expect(component.locator(popupMenuSelector)).toBeVisible();

			expect(await component.locator(applicationFrame).first().getAttribute("aria-hidden")).toBe("true");
			expect(await component.locator(applicationFrameHeader).first().getAttribute("aria-hidden")).toBe("true");
		});

		test("Should enable elements in background by clicking close button to close", async ({ mount }) => {
			const component = await mount(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;
			const applicationFrameSelector = `[data-role="application-frame"]`;
			const applicationFrameHeaderSelector = `[data-role="application-frame-header"]`;
			const closeButtonSelector = `[data-role=${DataRoles.Popup.CloseButton}]`;

			await component.locator(buttonTriggerSelector).first().click();

			const popupMenu = component.locator(popupMenuSelector);
			const applicationFrame = component.locator(applicationFrameSelector).first();
			const applicationFrameHeader = component.locator(applicationFrameHeaderSelector).first();

			await expect(popupMenu).toBeVisible();

			expect(await applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(await applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			await component.locator(closeButtonSelector).first().click();

			await expect(popupMenu).not.toBeVisible();
			await expect(applicationFrame).not.toHaveAttribute("aria-hidden");
			await expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
		});

		test("Should enable elements in background by press Escape to close", async ({ mount }) => {
			const component = await mount(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;
			const applicationFrameSelector = `[data-role="application-frame"]`;
			const applicationFrameHeaderSelector = `[data-role="application-frame-header"]`;

			await component.locator(buttonTriggerSelector).first().click();

			const popupMenu = component.locator(popupMenuSelector);
			const applicationFrame = component.locator(applicationFrameSelector).first();
			const applicationFrameHeader = component.locator(applicationFrameHeaderSelector).first();

			await expect(popupMenu).toBeVisible();
			expect(await applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(await applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			await popupMenu.press("Escape");

			await expect(popupMenu).not.toBeVisible();
			await expect(applicationFrame).not.toHaveAttribute("aria-hidden");
			await expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
		});

		test("Should enable elements in background by selecting item and close popup", async ({ mount }) => {
			const component = await mount(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;
			const listItemSelector = `[data-role="second-item"]`;
			const applicationFrameSelector = `[data-role="application-frame"]`;
			const applicationFrameHeaderSelector = `[data-role="application-frame-header"]`;

			await component.locator(buttonTriggerSelector).first().click();
			const applicationFrame = component.locator(applicationFrameSelector).first();
			const applicationFrameHeader = component.locator(applicationFrameHeaderSelector).first();

			const popupMenu = component.locator(popupMenuSelector);

			await expect(popupMenu).toBeVisible();

			expect(await applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(await applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			await component.locator(listItemSelector).first().click();

			await expect(popupMenu).not.toBeVisible();
			await expect(applicationFrame).not.toHaveAttribute("aria-hidden");
			await expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
		});

		test("Should disabled elements background by clicking the item to open modal overlay and enable after closing modal overlay", async ({
			mount
		}) => {
			const component = await mount(<ExamplePopUpMenuWithApplicationFrame />);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;
			const listItemSelector = `[data-role="first-item"]`;
			const applicationFrameSelector = `[data-role="application-frame"]`;
			const applicationFrameHeaderSelector = `[data-role="application-frame-header"]`;

			await component.locator(buttonTriggerSelector).first().click();

			const popupMenu = component.locator(popupMenuSelector);
			const applicationFrame = component.locator(applicationFrameSelector).first();
			const applicationFrameHeader = component.locator(applicationFrameHeaderSelector).first();

			await expect(popupMenu).toBeVisible();

			await component.locator(listItemSelector).first().click();

			const modal = component.locator(".modal-notification");

			await expect(modal).toBeVisible();
			await expect(popupMenu).not.toBeVisible();

			expect(await applicationFrame.getAttribute("aria-hidden")).toBe("true");
			expect(await applicationFrameHeader.getAttribute("aria-hidden")).toBe("true");

			await modal.locator("[data-role=button]").first().click();

			await expect(applicationFrame).not.toHaveAttribute("aria-hidden");
			await expect(applicationFrameHeader).not.toHaveAttribute("aria-hidden");
		});
	});
});
