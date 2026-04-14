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

import { render, getByDataRole, getAllByDataRole, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../../icon/main/icon.view.js";
import { Link } from "../../../link/main/link/link.view.js";
import { Button } from "../../../button/main/button.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { DropDown } from "../template/dropdown.tpl.view.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";

const items: DropDownItem[] = [
	{
		id: "1",
		label: "Armchair",
		title: "Armchair",
		className: "custom-class-item",
		style: {
			color: "red"
		},
		graphic: <Icon>edit</Icon>,
		selected: true
	},
	{
		id: "2",
		label: "Chair",
		title: "Chair",
		tabIndex: -1
	},
	{
		id: "3",
		label: "Hammock",
		title: "Hammock",
		disabled: true
	},
	{
		id: "4",
		label: "Rocking chair",
		title: "Rocking chair"
	}
];

describe("com.mgmtp.a12.widgets.dropdown", () => {
	test("basic-dropdown", () => {
		const { container } = render(<DropDown items={items} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("horizontal-dropdown", () => {
		const { container } = render(<DropDown horizontal items={items} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("light-background-dropdown", () => {
		const { container } = render(<DropDown lightBackground items={items} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("dropdown-with-hint", () => {
		const { container } = render(<DropDown hint="test dropdown hint" items={items} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("dropdown-with-custom-tabIndex", () => {
		const { container } = render(<DropDown tabIndex={-1} items={items} />);
		const dropdown = getByDataRole(container, DataRoles.Dropdown);
		expect(dropdown.tabIndex).toBe(-1);
	});

	test("dropdown-with-footer", () => {
		const { container } = render(<DropDown items={items} footer={<Link>Load More</Link>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("trigger-events", () => {
		const onKeyDownSpy = vi.fn();
		const onMouseDownSpy = vi.fn();
		const onSelectedItemChangeSpy = vi.fn();

		const { container } = render(
			<DropDown
				items={items}
				onKeyDown={onKeyDownSpy}
				onMouseDown={onMouseDownSpy}
				onSelectedItemChange={onSelectedItemChangeSpy}
			/>
		);

		fireEvent.keyDown(getByDataRole(container, DataRoles.Dropdown));
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);

		const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);

		fireEvent.mouseDown(dropdownItems[0]);
		expect(onMouseDownSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(dropdownItems[3]);
		expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);

		onSelectedItemChangeSpy.mockClear();

		fireEvent.keyDown(dropdownItems[0], { key: Key.Enter });
		expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
	});

	test("Should trigger event on custom elements inside `graphic` and `secondaryText` when clicking on them", async () => {
		const handleButtonClick = vi.fn();
		const { container } = render(
			<DropDown
				items={[
					{
						label: "Graphic Element",
						graphic: <Button icon={<Icon>mail</Icon>} onClick={handleButtonClick} />
					},
					{
						label: "Secondary Text",
						secondaryText: <Button icon={<Icon>info</Icon>} onClick={handleButtonClick} />
					}
				]}
			/>
		);
		const graphicElement = getByDataRole(container, DataRoles.Dropdown.Graphic);
		const graphicButton = getByDataRole(graphicElement, DataRoles.Button);
		const secondaryText = getByDataRole(container, DataRoles.Dropdown.SecondaryText);
		const secondaryTextButton = getByDataRole(secondaryText, DataRoles.Button);

		await userEvent.click(graphicButton);
		expect(handleButtonClick).toHaveBeenCalledTimes(1);

		await userEvent.click(secondaryTextButton);
		expect(handleButtonClick).toHaveBeenCalledTimes(2);
	});

	test("dropdown with `isEmptyValue` item", () => {
		const itemsWithEmptyValue: DropDownItem[] = [
			{
				id: "0",
				label: "None",
				title: "None",
				isEmptyValue: true
			},
			{
				id: "1",
				label: "Option 1",
				title: "Option 1"
			},
			{
				id: "2",
				label: "Option 2",
				title: "Option 2"
			}
		];

		const { getAllByDataRole } = render(<DropDown items={itemsWithEmptyValue} />);
		const dropdownItems = getAllByDataRole(DataRoles.Dropdown.Item);

		expect(dropdownItems[0]).toMatchSnapshot();
	});
});
