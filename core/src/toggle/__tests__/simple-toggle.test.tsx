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

import { render, getByDataRole, getAllByDataRole, waitFor, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

// import { navigateWithTab } from "../../common/test/user-event-utils.js";
import { Key as KeyUtils } from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { Toggle } from "../main/toggle.view.js";

describe("com.mgmtp.a12.widgets.simple.toggle", () => {
	const baseDataRole = "toggle";

	test("rendering-default-simple-toggle", async () => {
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" title="Hidden" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
		const toggleWrapper = getByDataRole(container, `${baseDataRole}-wrapper`);
		const selectedItemOverlay = getByDataRole(container, `${baseDataRole}-selected-item-overlay`);

		expect(selectedItemOverlay).toBeVisible();

		await userEvent.hover(toggleWrapper);
		expect(container.firstChild).toMatchSnapshot();

		await userEvent.unhover(toggleWrapper);

		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-simple-toggle", async () => {
		const { container } = render(
			<Toggle showOnlySelectedOption disabled value="hidden">
				<Toggle.Item value="hidden" title="Hidden" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
		const toggleWrapper = getByDataRole(container, `${baseDataRole}-wrapper`);
		const selectedItemOverlay = getAllByDataRole(container, `${baseDataRole}-selected-item-overlay`);

		expect(selectedItemOverlay.length).toEqual(1);

		await userEvent.hover(toggleWrapper);
		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
		await userEvent.unhover(toggleWrapper);

		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
	});

	test("rendering-disabled-item-simple-toggle", async () => {
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" disabled title="Hidden" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
		const toggleWrapper = getByDataRole(container, `${baseDataRole}-wrapper`);
		const selectedItemOverlay = getAllByDataRole(container, `${baseDataRole}-selected-item-overlay`);

		expect(selectedItemOverlay.length).toEqual(1);

		await userEvent.hover(toggleWrapper);
		await userEvent.unhover(toggleWrapper);
		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-readonly-simple-toggle", async () => {
		const { container } = render(
			<Toggle showOnlySelectedOption readOnly value="hidden">
				<Toggle.Item value="hidden" title="Hidden" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
		const toggleWrapper = getByDataRole(container, `${baseDataRole}-wrapper`);
		const selectedItemOverlay = getAllByDataRole(container, `${baseDataRole}-selected-item-overlay`);

		expect(selectedItemOverlay.length).toEqual(1);

		await userEvent.hover(toggleWrapper);
		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
		await userEvent.unhover(toggleWrapper);

		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
	});

	test("rendering-readonly-item-simple-toggle", async () => {
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" readOnly title="Hidden" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
		const toggleWrapper = getByDataRole(container, `${baseDataRole}-wrapper`);
		const selectedItemOverlay = getAllByDataRole(container, `${baseDataRole}-selected-item-overlay`);

		expect(selectedItemOverlay.length).toEqual(1);

		await userEvent.hover(toggleWrapper);
		await userEvent.unhover(toggleWrapper);
		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-simple-toggle-with-toggle-item-variant-status1", () => {
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" title="Hidden" variant="status1" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-simple-toggle-with-toggle-item-variant-status2", () => {
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" title="Hidden" variant="status2" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-simple-toggle-with-toggle-item-variant-status3", () => {
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" title="Hidden" variant="status3" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-simple-toggle-mouse-events", async () => {
		const onClickSpy = vi.fn();

		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" title="Hidden" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" onClick={onClickSpy} id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);
		const toggleWrapper = getByDataRole(container, `${baseDataRole}-wrapper`);
		const items = getAllByDataRole(container, `${baseDataRole}-item`);

		//overlay should be hidden on mouseEnter & visible on mouseOut
		await userEvent.hover(toggleWrapper);

		await userEvent.unhover(toggleWrapper);
		await waitFor(() => {
			expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
		});

		await userEvent.hover(toggleWrapper);
		await userEvent.click(items[1]);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});

	test("simulating-simple-toggle-keyboard-events", () => {
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" title="Hidden" id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
				<Toggle.Item value="visible" title="Visible" id="toggle-item-test-2">
					<Icon size="big">check</Icon>
				</Toggle.Item>
			</Toggle>
		);
		const toggleWrapper = getByDataRole(container, `${baseDataRole}-wrapper`);
		const selectedItemOverlay = getByDataRole(container, `${baseDataRole}-selected-item-overlay`);
		const items = getAllByDataRole(container, `${baseDataRole}-item`);

		//keyboard events
		fireEvent.focus(selectedItemOverlay);
		fireEvent.keyDown(toggleWrapper, { key: KeyUtils.Space });
		expect(items[0]).toHaveFocus();

		fireEvent.keyDown(toggleWrapper, { key: Key.ArrowRight });
		expect(items[1]).toHaveFocus();

		fireEvent.keyDown(toggleWrapper, { key: Key.ArrowLeft });
		expect(items[0]).toHaveFocus();

		fireEvent.keyDown(toggleWrapper, { key: Key.Escape });
		expect(getByDataRole(container, `${baseDataRole}-selected-item-overlay`)).toHaveStyle({ display: "flex" });
	});

	test("should have title for toggle item", async () => {
		const title = "Hidden";
		const { container } = render(
			<Toggle showOnlySelectedOption value="hidden">
				<Toggle.Item value="hidden" title={title} id="toggle-item-test-1">
					<Icon size="big">close</Icon>
				</Toggle.Item>
			</Toggle>
		);

		const triggerElement = getByDataRole(container, DataRoles.Toggle.Item);
		expect(triggerElement.getAttribute("title")).toEqual(title);
	});
});
