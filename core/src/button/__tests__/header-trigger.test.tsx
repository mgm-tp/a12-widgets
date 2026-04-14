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

import { render, getByDataRole, waitFor, queryByDataRole } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { navigateWithTab } from "../../common/test/user-event-utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { HeaderTrigger } from "../main/header-trigger/header-trigger.view.js";
import type { HeaderTriggerProps } from "../main/header-trigger/header-trigger.api.js";

describe("com.mgmtp.a12.widgets.header-trigger", () => {
	test("rendering header trigger", () => {
		const { container } = render(<HeaderTrigger meta="keyboard_arrow_down" graphic="info" text="test text" />);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering disabled header trigger", () => {
		const { container } = render(<HeaderTrigger disabled meta="keyboard_arrow_down" graphic="info" text="test text" />);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering horizontal multilingual header trigger", () => {
		const { container } = render(
			<HeaderTrigger graphic="public" text="test text" multilingual meta="arrow_drop_down" textTitle="TT" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering light horizontal multilingual header trigger", () => {
		const { container } = render(
			<HeaderTrigger graphic="public" text="test text" multilingual meta="arrow_drop_down" textTitle="TT" light />
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering vertical multilingual header trigger", () => {
		const { container } = render(
			<HeaderTrigger graphic="public" text="test text" vertical multilingual meta="arrow_drop_down" textTitle="TT" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering a header trigger with only graphic icon", () => {
		const { container } = render(<HeaderTrigger graphic="public" />);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering a header trigger with only meta icon", () => {
		const { container } = render(<HeaderTrigger meta="arrow_drop_down" />);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("header-trigger events", async () => {
		const onClickSpy = vi.fn();
		const onKeyUpSpy = vi.fn();
		const { container } = render(
			<HeaderTrigger
				meta="keyboard_arrow_down"
				graphic="info"
				text="test text"
				onClick={onClickSpy}
				onKeyUp={onKeyUpSpy}
			/>
		);

		const button = container.firstChild as Element;
		await userEvent.click(button);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
		await userEvent.keyboard("a");

		expect(onKeyUpSpy).toHaveBeenCalledTimes(1);
	});

	test("should have the title attribute", async () => {
		const { container } = render(<HeaderTrigger meta="keyboard_arrow_down" graphic="info" />);

		const triggerElement = getByDataRole(container, "header-trigger");
		expect(triggerElement.getAttribute("title")).toEqual(getA11yResource("en").headerTriggerTitles?.buttonTriggerOpen);
		expect(triggerElement.getAttribute("aria-label")).toEqual(
			getA11yResource("en").headerTriggerTitles?.buttonTriggerOpen
		);
	});

	describe("interaction hint", () => {
		const dataRole = "header-trigger";
		const title = "Open menu";
		const HeaderTriggerWithHint = (props: HeaderTriggerProps) => (
			<InteractionHintConfigProvider enableInteractionHint>
				<HeaderTrigger {...props} />
			</InteractionHintConfigProvider>
		);

		test("should display the hint on hover and hide hint on hover leave", async () => {
			const { container } = render(<HeaderTriggerWithHint meta="keyboard_arrow_down" graphic="info" />);

			const triggerElement = getByDataRole(container, dataRole);

			expect(triggerElement.getAttribute("aria-label")).toEqual(title);

			await userEvent.hover(triggerElement);

			await waitFor(() => {
				const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual(title);
			});

			await userEvent.unhover(triggerElement);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
			});
		});

		test("should display the hint on focus and hide it on focus out", async () => {
			const { container } = render(
				<HeaderTriggerWithHint meta="keyboard_arrow_down" graphic="info" text="test text" />
			);
			const triggerElement = getByDataRole(container, dataRole);

			await userEvent.tab();

			await waitFor(() => {
				const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual(title);
			});

			await userEvent.tab();

			await userEvent.unhover(triggerElement);
			expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
		});

		test("should hide the hint on pressing the Escape key", async () => {
			const { container } = render(
				<HeaderTriggerWithHint meta="keyboard_arrow_down" graphic="info" text="test text" />
			);
			const triggerElement = getByDataRole(container, dataRole);

			await navigateWithTab(userEvent, () => document.activeElement === triggerElement);

			await waitFor(() => {
				const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual(title);
			});
			await userEvent.keyboard(`{${Key.Escape}}`);
			expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
		});
	});
});
