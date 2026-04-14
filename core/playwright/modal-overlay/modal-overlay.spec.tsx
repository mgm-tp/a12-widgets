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

import { ModalOverlayExample } from "./modal-overlay.stories.js";

test.describe("Modal Overlay tests", () => {
	test("should show modal when trigger button is clicked", async ({ mount, getByDataRole }) => {
		await mount(<ModalOverlayExample />);
		const showModalButton = getByDataRole(DataRoles.Button);

		await showModalButton.click();
		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);

		await expect(modalOverlay).toBeVisible();
	});

	test("should close modal when close button is clicked and focus back to the trigger element", async ({
		mount,
		getByDataRole
	}) => {
		await mount(<ModalOverlayExample />);
		const showModalButton = getByDataRole(DataRoles.Button);

		await showModalButton.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const closeButton = getByDataRole(DataRoles.Button, modalOverlay);

		await closeButton.click();

		await expect(modalOverlay).not.toBeVisible();
		await expect(showModalButton).toBeFocused();
	});

	test("should close modal when clicking outside", async ({ mount, getByDataRole }) => {
		const component = await mount(<ModalOverlayExample closeOnOutsideClick={true} />);
		const showModalButton = getByDataRole(DataRoles.Button);

		await showModalButton.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);

		await expect(modalOverlay).toBeVisible();

		await component.click(); // Click outside the modal
		await expect(modalOverlay).not.toBeVisible();
		await expect(showModalButton).toBeFocused();
	});

	test("should not close modal when clicking outside", async ({ mount, getByDataRole }) => {
		const component = await mount(<ModalOverlayExample closeOnOutsideClick={false} />);
		const showModalButton = getByDataRole(DataRoles.Button);

		await showModalButton.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);

		await expect(modalOverlay).toBeVisible();

		await component.click(); // Click outside the modal
		await expect(modalOverlay).toBeVisible();
	});

	test("should close modal when pressing ESC", async ({ mount, getByDataRole, page }) => {
		await mount(<ModalOverlayExample onCloseESC={true} />);
		const showModalButton = getByDataRole(DataRoles.Button);

		await showModalButton.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);

		await expect(modalOverlay).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(modalOverlay).not.toBeVisible();
		await expect(showModalButton).toBeFocused();
	});

	test("should not close modal when pressing ESC", async ({ mount, getByDataRole, page }) => {
		await mount(<ModalOverlayExample onCloseESC={false} />);
		const showModalButton = getByDataRole(DataRoles.Button);

		await showModalButton.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);

		await expect(modalOverlay).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(modalOverlay).toBeVisible();
	});

	test("should close modal and not focus back to the trigger element", async ({ mount, getByDataRole }) => {
		await mount(<ModalOverlayExample focusBack={false} />);
		const showModalButton = getByDataRole(DataRoles.Button);

		await showModalButton.click();

		const modalOverlay = getByDataRole(DataRoles.Modal.Overlay);
		const closeButton = getByDataRole(DataRoles.Button, modalOverlay);

		await closeButton.click();

		await expect(modalOverlay).not.toBeVisible();
		await expect(showModalButton).not.toBeFocused();
	});
});
