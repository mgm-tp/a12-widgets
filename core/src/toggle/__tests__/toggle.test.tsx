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

import { fireEvent, queryHelpers, render } from "test-utils";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

import { Key } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { Toggle } from "../main/toggle.view.js";

describe("com.mgmtp.a12.widgets.toggle", () => {
	beforeEach(() => {
		vi.spyOn(global.Math, "random").mockReturnValue(0.123456789);
	});

	afterEach(() => {
		vi.spyOn(global.Math, "random").mockRestore();
	});

	const toggleLabel = "Toggles";
	const toggleItems = [
		<Toggle.Item key={1} value="1">
			1
		</Toggle.Item>,
		<Toggle.Item key={2} value="2">
			2
		</Toggle.Item>,
		<Toggle.Item key={3} value="3" id="12345">
			3
		</Toggle.Item>,
		<Toggle.Item key={4} value="4" disabled>
			disabled
		</Toggle.Item>,
		<Toggle.Item key={5} value="5" readOnly>
			readonly
		</Toggle.Item>
	];

	/**
	 * Testing default toggle is rendered:
	 *  - Toggle should use 'div' tag.
	 *  - Toggle should have class 'toggle'.
	 *  - Toggle should not contain a Label.
	 *  - Toggle should contain a div with class 'toggle__wrapper'.
	 */
	test("rendering-default-toggle", () => {
		const { container } = render(<Toggle />);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Testing toggle with a label is rendered:
	 *  - Toggle should contain a Label.
	 */
	test("rendering-toggle-with-label", () => {
		const { container } = render(<Toggle label={toggleLabel} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Testing if toggle with children is rendered:
	 *  - Toggle widget should render all passed items.
	 *  - When not specified, toggle item should generate an id.
	 *  - Selected item should have class ${toggleItemBaseClass}--selected.
	 *  - Readonly item should have class ${toggleItemBaseClass}--readonly.
	 *  - Disabled item should have class ${toggleItemBaseClass}--disabled.
	 */
	test("rendering-toggle-with-children", () => {
		const { container } = render(
			<Toggle label={toggleLabel} value="1">
				{toggleItems}
			</Toggle>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Rendering disabled toggle:
	 *  - All children should be disabled.
	 */
	test("rendering-disabled-toggle", () => {
		const { container } = render(<Toggle disabled>{toggleItems}</Toggle>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Rendering readonly toggle:
	 * - All items should be readonly.
	 */
	test("rendering-readonly-toggle", () => {
		const { container } = render(<Toggle readOnly>{toggleItems}</Toggle>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Simulating events on toggle item:
	 *  - onClick event should be called when the item is clicked.
	 *  - onClick event should be called when pressing Space on the item.
	 */
	test("simulating-toggle-item-events", () => {
		const onClickSpy = vi.fn();
		const { container, queryByDataRole } = render(<Toggle.Item value="1" onClick={onClickSpy} />);
		const item = queryByDataRole(DataRoles.Toggle.Item);

		if (!item) {
			throw queryHelpers.getElementError("No found toggle item", container);
		}

		fireEvent.click(item);
		expect(onClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(item, { key: Key.Space });
		expect(onClickSpy).toHaveBeenCalledTimes(2);
	});

	describe("interaction hint", () => {
		test("toggle shows hint when componentConfigs.toggle=true", async () => {
			const title = "Toggle option";
			const { getByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ toggle: true }}>
					<Toggle>
						<Toggle.Item value="test" title={title}>
							Test
						</Toggle.Item>
					</Toggle>
				</InteractionHintConfigProvider>
			);
			const toggleItem = getByDataRole(DataRoles.Toggle.Item);
			fireEvent.focus(toggleItem);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);

			expect(hintContent?.textContent).toEqual(title);
		});

		test("toggle should not show hint when componentConfigs.toggle=false", async () => {
			const title = "Toggle option";
			const { getByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ toggle: false }}>
					<Toggle>
						<Toggle.Item value="test" title={title}>
							Test
						</Toggle.Item>
					</Toggle>
				</InteractionHintConfigProvider>
			);

			const toggleItem = getByDataRole(DataRoles.Toggle.Item);
			fireEvent.focus(toggleItem);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});
