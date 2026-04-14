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

import { expect, test } from "@playwright/experimental-ct-react";

import { Icon } from "../../src/icon/main/icon.view.js";
import { List } from "../../src/list/main/list.view.js";
import { PopUpMenu } from "../../src/pop-up-menu/main/pop-up-menu.view.js";
import { DataRoles } from "../../src/common/main/data-roles.js";

test.describe("Popup Menu desktop", () => {
	test.describe("desktop", () => {
		test("Should close popup menu when click outside and the focus is set back to the trigger element", async ({
			mount,
			page
		}) => {
			const component = await mount(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>}>
					<List data-testid="list-test">
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
			);

			const buttonTriggerSelector = `[data-role="popup-trigger-element"]`;
			const popupMenuSelector = `[data-role=${DataRoles.Popup.Menu}]`;

			// Click the trigger element to open popup menu
			await component.locator(buttonTriggerSelector).first().click();

			await expect(component.locator(popupMenuSelector)).toBeVisible();

			await page.mouse.click(0, 0);
			await expect(component.locator(popupMenuSelector)).not.toBeVisible();
			await expect(component.locator(buttonTriggerSelector)).toBeFocused();
		});

		test("Should close popup menu when click outside and the focus is not set back to the trigger element if focusOnTriggerElementAfterClose is false", async ({
			mount,
			page
		}) => {
			const component = await mount(
				<PopUpMenu icon={<Icon>arrow_drop_up</Icon>} focusOnTriggerElementAfterClose={false}>
					<List data-testid="list-test">
						<List.Item text="List item" />
						<List.Item text="List item" />
						<List.Item text="List item" />
					</List>
				</PopUpMenu>
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
});
