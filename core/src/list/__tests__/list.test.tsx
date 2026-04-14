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

import { render, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { List } from "../main/list.view.js";

const { Item, SubHeader } = List;

describe("com.mgmtp.a12.widgets.list", () => {
	test("test render basic list", () => {
		const { container } = render(
			<List>
				<Item text="test" />
				<Item text="test" secondaryText="secondary test" />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("test render border and divider list", () => {
		const { container } = render(
			<List border divider>
				<Item text="test" />
				<Item text="test" />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render flipped list", () => {
		const { container } = render(
			<List flipped>
				<Item text="test" secondaryText="secondary test" />
				<Item text="test" secondaryText="secondary test" />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("test render subHeader list", () => {
		const { container } = render(
			<List>
				<SubHeader />
				<Item text="test" />
				<Item text="test" />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render subHeader-fill list", () => {
		const { container } = render(
			<List>
				<SubHeader fill />
				<Item text="test" />
				<Item text="test" />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render divider list item", () => {
		const { container } = render(
			<List>
				<Item text="test" divider />
				<Item text="test" />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render selected list item", () => {
		const { container } = render(
			<List>
				<Item text="test" selected />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test list item with custom attribute by htmlAttributes", () => {
		const { getAllByDataRole } = render(
			<List>
				<Item text="Item 1" htmlAttributes={{ role: "link" }} />
				<Item text="Item 2" />
			</List>
		);

		const itemElements = getAllByDataRole(DataRoles.List.Item.Content);

		// Check the first item with a custom role.
		expect(itemElements[0]?.getAttribute("role")).toBe("link");

		// Check the second item with the default role (button).
		expect(itemElements[1]?.getAttribute("role")).toBe("button");
	});

	test("test render graphic and meta list item", () => {
		const { container } = render(
			<List>
				<Item text="test" graphic="T" meta="T" />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render graphic-icon and meta-icon", () => {
		const { container } = render(
			<List>
				<List.SubHeader graphic={<Icon>folder</Icon>} meta={<Icon>edit</Icon>}>
					Folders
				</List.SubHeader>
				<Item text="test" graphic={<Icon>Wifi</Icon>} meta={<Icon>Wifi</Icon>} />
				<Item text="test" graphic={<Icon variant="info">Wifi</Icon>} meta={<Icon variant="info">Wifi</Icon>} />
				<Item
					text="test (disabled)"
					graphic={<Icon variant="info">Wifi</Icon>}
					meta={<Icon variant="info">Wifi</Icon>}
					disabled
				/>
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test render sub header and item", () => {
		const onClickSpy = vi.fn();
		const { container, getByDataRole } = render(
			<List>
				<List.SubHeader fill graphic={<Icon>folder</Icon>} meta={<Icon>edit</Icon>} onClick={onClickSpy}>
					Folders
				</List.SubHeader>
				<Item text="test" meta={<Icon>Wifi</Icon>} />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
		const subHeader = getByDataRole(DataRoles.List.SubHeader);
		fireEvent.click(subHeader);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});

	test("trigger-event", () => {
		const onKeyDownSpy = vi.fn();
		const onClickSpy = vi.fn();
		const onMouseOverSpy = vi.fn();
		const onMouseDownSpy = vi.fn();
		const onMouseEnterSpy = vi.fn();
		const onMouseLeaveSpy = vi.fn();
		const onItemKeyDownSpy = vi.fn();

		const { getAllByDataRole, getByDataRole } = render(
			<List onKeyDown={onKeyDownSpy}>
				<Item text="test" meta={<Icon>Wifi</Icon>} onClick={onClickSpy} />
				<Item text="test" meta={<Icon>Wifi</Icon>} onMouseOver={onMouseOverSpy} />
				<Item text="test" meta={<Icon>Wifi</Icon>} onMouseDown={onMouseDownSpy} />
				<Item text="test" meta={<Icon>Wifi</Icon>} onMouseEnter={onMouseEnterSpy} />
				<Item text="test" meta={<Icon>Wifi</Icon>} onMouseLeave={onMouseLeaveSpy} />
				<Item text="test" meta={<Icon>Wifi</Icon>} onKeyDown={onItemKeyDownSpy} />
			</List>
		);
		fireEvent.keyDown(getByDataRole(DataRoles.List));
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);

		const items = getAllByDataRole(DataRoles.List.Item.Content);

		fireEvent.click(items[0]);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
		fireEvent.mouseOver(items[1]);
		expect(onMouseOverSpy).toHaveBeenCalledTimes(1);
		fireEvent.mouseDown(items[2]);
		expect(onMouseDownSpy).toHaveBeenCalledTimes(1);
		fireEvent.mouseEnter(items[3]);
		expect(onMouseEnterSpy).toHaveBeenCalledTimes(1);
		fireEvent.mouseLeave(items[4]);
		expect(onMouseLeaveSpy).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(items[5]);
		expect(onItemKeyDownSpy).toHaveBeenCalledTimes(1);
	});

	test("rendering list item with progress bar", () => {
		const { container } = render(
			<List>
				<Item
					text="Photos"
					processedPercentage={50}
					secondaryText="Aug 5, 2007"
					graphic={<Icon>folder</Icon>}
					meta="900 MB"
				/>
				<Item text="Photos" secondaryText="Sept 30, 2014" graphic={<Icon>folder</Icon>} meta="900 MB" disabled />
			</List>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test click and keyboard event on the sub-header", () => {
		const onClickSpy = vi.fn();
		const onKeyDownSpy = vi.fn();
		const onKeyUpSpy = vi.fn();
		const { getAllByDataRole } = render(
			<List>
				<List.SubHeader
					fill
					graphic={<Icon>folder</Icon>}
					meta={<Icon>edit</Icon>}
					onClick={onClickSpy}
					onKeyDown={onKeyDownSpy}
					onKeyUp={onKeyUpSpy}
				>
					Folders
				</List.SubHeader>
				<Item text="Wifi" meta={<Icon>Wifi</Icon>} />
			</List>
		);
		const items = getAllByDataRole(DataRoles.List.SubHeader.Content);

		fireEvent.click(items[0]);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(items[0], { key: "Enter", code: "Enter", charCode: 13 });
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
		fireEvent.keyUp(items[0], { key: "Enter", code: "Enter", charCode: 13 });
		expect(onKeyUpSpy).toHaveBeenCalledTimes(1);
	});

	describe("A11y: list item with onClick and interactive meta", () => {
		test("normal state: role and tabIndex on text element, not on content", async () => {
			const onClickSpy = vi.fn();
			const { getByDataRole, getByText } = render(
				<List>
					<Item text="Item with interactive meta" onClick={onClickSpy} meta={<button>Action</button>} />
				</List>
			);

			const itemContent = getByDataRole(DataRoles.List.Item.Content);
			const itemText = getByDataRole(DataRoles.List.Item.Text);
			const metaButton = getByText("Action");

			// Text element should have button role and tabIndex
			expect(itemText.getAttribute("role")).toBe("button");
			expect(itemText.getAttribute("tabIndex")).toBe("0");

			// Content element should NOT have button role or tabIndex
			expect(itemContent.getAttribute("role")).not.toBe("button");
			expect(itemContent.getAttribute("tabIndex")).toBeNull();

			// Clicking on list content should trigger item action
			await userEvent.click(itemContent);
			expect(onClickSpy).toHaveBeenCalledTimes(1);

			// Verify meta button is interactive
			await userEvent.click(metaButton);
			expect(onClickSpy).toHaveBeenCalledTimes(2);
		});

		test("disabled state: aria-disabled and role on text element, not on content", async () => {
			const onClickSpy = vi.fn();
			const { getByDataRole, getByText } = render(
				<List>
					<Item
						disabled
						text="Item with interactive meta (disabled)"
						onClick={onClickSpy}
						meta={<button>Action</button>}
					/>
				</List>
			);

			const itemContent = getByDataRole(DataRoles.List.Item.Content);
			const itemText = getByDataRole(DataRoles.List.Item.Text);
			const metaButton = getByText("Action");

			// Text element should have aria-disabled and role="button"
			expect(itemText.getAttribute("aria-disabled")).toBe("true");
			expect(itemText.getAttribute("role")).toBe("button");

			// Content element should NOT have aria-disabled or role="button"
			expect(itemContent.getAttribute("aria-disabled")).toBeNull();
			expect(itemContent.getAttribute("role")).not.toBe("button");

			// Text element should NOT have tabIndex (disabled items are not focusable)
			expect(itemText.getAttribute("tabIndex")).toBeNull();

			// Item onClick should not trigger when disabled
			await userEvent.click(itemContent);
			expect(onClickSpy).not.toHaveBeenCalled();

			// Meta button should not be interactive
			await userEvent.click(metaButton);
			expect(onClickSpy).not.toHaveBeenCalled();
		});

		test("read-only state: no role, no aria-disabled, no tabIndex on both content and text", async () => {
			const onMetaClickSpy = vi.fn();
			const { getByDataRole, getByText } = render(
				<List>
					<Item
						readonly
						text="Item with interactive meta (read-only)"
						meta={<button onClick={onMetaClickSpy}>Action</button>}
					/>
				</List>
			);

			const itemContent = getByDataRole(DataRoles.List.Item.Content);
			const itemText = getByDataRole(DataRoles.List.Item.Text);
			const metaButton = getByText("Action");

			// Content element should NOT have role, aria-disabled, or tabIndex
			expect(itemContent.getAttribute("role")).toBeNull();
			expect(itemContent.getAttribute("aria-disabled")).toBeNull();
			expect(itemContent.getAttribute("tabIndex")).toBeNull();

			// Text element should NOT have role, aria-disabled, or tabIndex
			expect(itemText.getAttribute("role")).toBeNull();
			expect(itemText.getAttribute("aria-disabled")).toBeNull();
			expect(itemText.getAttribute("tabIndex")).toBeNull();

			// Meta button should still be interactive
			await userEvent.click(metaButton);
			expect(onMetaClickSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe("interaction hint", () => {
		test("list item shows hint when componentConfigs.list=true", async () => {
			const { getByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ list: true }}>
					<List>
						<Item text="Test item" title="Item title" />
					</List>
				</InteractionHintConfigProvider>
			);
			await userEvent.tab();

			const hintContent = getByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent.textContent).toEqual("Item title");
		});

		test("list item should not show hint when componentConfigs.list=false", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ list: false }}>
					<List>
						<Item text="Test item" title="Item title" />
					</List>
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});
