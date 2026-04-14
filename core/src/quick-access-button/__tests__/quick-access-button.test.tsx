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

import { getByDataRole, render, fireEvent, waitFor, getAllByDataRole, setupDevice } from "test-utils";
import { describe, vi, expect, test, beforeAll } from "vitest";

import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { QuickAccessButton } from "../main/quick-access-button.view.js";

describe("com.mgmtp.a12.widgets.quick-access-menu.view", () => {
	describe("desktop", () => {
		test("rendering-default-quick-access-button", () => {
			const { container } = render(
				<QuickAccessButton mainAction={<Button label="Active Element" />} menuTriggerIcon={<Icon>"more_vert"</Icon>} />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-primary-quick-access-button", () => {
			const { container } = render(
				<QuickAccessButton
					mainAction={<Button label="Active Element" primary />}
					menuTriggerIcon={<Icon>"more_vert"</Icon>}
					primary
				/>
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-primary-invert-quick-access-button", () => {
			const { container } = render(
				<QuickAccessButton mainAction={<Button label="Active Element" primary invert />} primary invert />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-secondary-quick-access-button", () => {
			const { container } = render(
				<QuickAccessButton mainAction={<Button label="Active Element" secondary />} secondary />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-secondary-invert-access-button", () => {
			const { container } = render(
				<QuickAccessButton mainAction={<Button label="Active Element" secondary invert />} secondary invert />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-destructive-access-button", () => {
			const { container } = render(
				<QuickAccessButton mainAction={<Button label="Active Element" destructive />} destructive />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-disabled-access-button", () => {
			const { container } = render(
				<QuickAccessButton mainAction={<Button label="Active Element" disabled />} disabled />
			);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("quick-access-button-with-actionItems-prop", async () => {
			const saveActionSpy = vi.fn();
			const { container } = render(
				<QuickAccessButton
					mainAction={<Button label="Active Element" />}
					menuTriggerIcon={<Icon>"more_vert"</Icon>}
					actionItems={[
						{
							text: "Save",
							graphic: <Icon>save</Icon>,
							meta: <Icon>check</Icon>,
							onClick: saveActionSpy
						},
						{
							text: "Save and close",
							graphic: <Icon>save</Icon>
						}
					]}
				/>
			);
			expect(container.firstChild).toMatchSnapshot();

			const buttonTrigger = getByDataRole(container, "quick-access-button-trigger-element");
			fireEvent.click(buttonTrigger);

			await waitFor(() => {
				expect(getByDataRole(container, "list")).toBeTruthy();
			});
			const actionItems = getAllByDataRole(container, "list-item-content");
			expect(actionItems.length).toEqual(2);
			fireEvent.click(actionItems[0]);
			expect(saveActionSpy).toBeCalled();

			fireEvent.click(buttonTrigger);
			saveActionSpy.mockClear();
			await waitFor(() => {
				expect(getAllByDataRole(container, "list-item-content").length).toEqual(2);
			});

			fireEvent.keyDown(getAllByDataRole(container, "list-item-content")[0], {
				key: "Enter",
				code: "Enter",
				charCode: 13
			});
			expect(saveActionSpy).toBeCalled();
		});

		test("should update the hint for quick access button after opening popup menu", async () => {
			const { container } = render(
				<InteractionHintConfigProvider enableInteractionHint>
					<QuickAccessButton mainAction={<Button label="Active Element" />} />
				</InteractionHintConfigProvider>
			);

			const triggerElement = getByDataRole(container, "quick-access-button-trigger-element");

			fireEvent.focus(triggerElement);

			const hint = getByDataRole(container, "interaction-hint").textContent;

			expect(hint).toEqual(getA11yResource("en").quickAccessButtonTitles?.triggerOpen);

			fireEvent.click(triggerElement);

			const popup = getByDataRole(container, "popup-menu");

			expect(popup).toBeTruthy();

			fireEvent.mouseOver(triggerElement);

			await waitFor(() => {
				const hint = getByDataRole(container, "interaction-hint").textContent;
				expect(hint).toEqual(getA11yResource("en").quickAccessButtonTitles?.triggerClose);
			});
		});
	});

	describe("mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("should have default headerTitle for action menu", () => {
			const { container } = render(
				<QuickAccessButton
					mainAction={<Button label="Active Element" />}
					menuTriggerIcon={<Icon>"more_vert"</Icon>}
					actionItems={[
						{
							text: "Save",
							graphic: <Icon>save</Icon>,
							meta: <Icon>check</Icon>
						},
						{
							text: "Save and close",
							graphic: <Icon>save</Icon>
						}
					]}
				/>
			);

			const buttonTrigger = getByDataRole(container, "quick-access-button-trigger-element");
			fireEvent.click(buttonTrigger);

			expect(container).toMatchSnapshot();
			const headingTitle = getByDataRole(container, DataRoles.Popup.HeaderTitle);
			expect(headingTitle.textContent).toEqual(getA11yResource("en").quickAccessButtonTitles?.popupMenuTitle);
		});
	});
});
