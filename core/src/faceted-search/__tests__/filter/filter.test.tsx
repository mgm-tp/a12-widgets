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

import { render, getByDataRole, fireEvent } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { Filter } from "../../main/filter/filter.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

describe("com.mgmtp.a12.widgets.filter", () => {
	const properties = {
		id: "test-id",
		className: "test-classname",
		style: {
			color: "red"
		}
	};

	test("rendering-filter", () => {
		const { container, rerender } = render(<Filter name="Category" options={["Blue", "Green", "White"]} />);
		expect(container.firstChild).toMatchSnapshot();

		rerender(<Filter nonRemovable name="Category" options={["Blue", "Green", "White"]} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-with-valid-classes", () => {
		const { container } = render(<Filter name="Category" {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-without-options", () => {
		const { container } = render(<Filter name="Category" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-with-an-element-option", () => {
		const option = <span>option</span>;
		const { container } = render(<Filter name="Category" options={option} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-active", () => {
		const { container } = render(<Filter name="Category" active />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-filter", () => {
		const { container, getByDataRole } = render(<Filter name="Category" disabled />);
		const filterContent = getByDataRole(DataRoles.Filter.Content);

		expect(filterContent.hasAttribute("disabled")).toBe(true);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-custom-action", () => {
		const customAction = <div>This is custom action</div>;
		const { container } = render(<Filter name="Category" customAction={customAction} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-with-custom-separator", () => {
		const separator = "|";
		const { container } = render(<Filter name="Category" options={["1", "2", "3", "4"]} separator={separator} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-event", () => {
		const onClose = vi.fn();
		const filterRef = vi.fn();

		const { container } = render(<Filter name="" onClose={onClose} filterRef={filterRef} />);
		expect(filterRef).toHaveBeenCalledTimes(1);
		const eventTrigger = getByDataRole(container, "button");
		fireEvent.click(eventTrigger);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test("check aria-labelledby in action button gets id from hidden-text and filter-name-text", () => {
		const { container, getByDataRole } = render(
			<Filter id="test-filter" name="Category" options={["Blue", "Green", "White"]} />
		);

		const actionButton = getByDataRole(DataRoles.Button);
		const actionButtonHiddenText = container.querySelector("#test-filter-action-button-hidden-text");
		const filterNameText = container.querySelector("#test-filter-name-text");

		expect(actionButton).toBeInTheDocument();
		expect(actionButtonHiddenText).toBeInTheDocument();
		expect(filterNameText).toBeInTheDocument();

		expect(actionButton.getAttribute("aria-labelledby")).toBe(`${actionButtonHiddenText?.id} ${filterNameText?.id}`);
	});

	test("rendering-filter-with-prefix", () => {
		const { container, getByDataRole } = render(
			<Filter name="Category" prefix={<span>F</span>} options={["Blue", "Green"]} />
		);

		expect(container.firstChild).toMatchSnapshot();

		const prefix = getByDataRole(DataRoles.Filter.Prefix);
		expect(prefix).toBeInTheDocument();
		expect(prefix.textContent).toBe("F");
	});

	test("rendering-filter-compact-mode-without-options", () => {
		const { getByDataRole } = render(<Filter name="Category" compact />);

		const filterName = getByDataRole(DataRoles.Filter.Name);
		expect(filterName).toBeInTheDocument();
	});

	test("rendering-filter-compact-mode-with-options", () => {
		const { getByDataRole, queryByDataRole } = render(<Filter name="Category" compact options={["Blue", "Green"]} />);

		const filterName = queryByDataRole(DataRoles.Filter.Name);
		expect(filterName).not.toBeInTheDocument();

		const filterOptions = getByDataRole(DataRoles.Filter.Options);
		expect(filterOptions).toBeInTheDocument();
	});

	test("rendering-filter-compact-mode-with-prefix-and-options", () => {
		const { container, getByDataRole, queryByDataRole } = render(
			<Filter name="Category" compact prefix={<span>F</span>} options={["Blue", "Green"]} />
		);
		expect(container.firstChild).toMatchSnapshot();

		// Should show prefix
		const prefixElement = getByDataRole(DataRoles.Filter.Prefix);
		expect(prefixElement).toBeInTheDocument();
		expect(prefixElement.textContent).toBe("F");

		// Should hide filter name in compact mode with options
		const filterName = queryByDataRole(DataRoles.Filter.Name);
		expect(filterName).not.toBeInTheDocument();

		// Should show options
		const filterOptions = getByDataRole(DataRoles.Filter.Options);
		expect(filterOptions).toBeInTheDocument();
	});

	test("rendering-filter-compact-mode-with-prefix-without-options", () => {
		const { container, getByDataRole } = render(<Filter name="Category" compact prefix={<span>F</span>} />);
		expect(container.firstChild).toMatchSnapshot();

		// Should show prefix
		const prefixElement = getByDataRole(DataRoles.Filter.Prefix);
		expect(prefixElement).toBeInTheDocument();
		expect(prefixElement.textContent).toBe("F");

		// Should show filter name when no options
		const filterName = getByDataRole(DataRoles.Filter.Name);
		expect(filterName).toBeInTheDocument();
	});
});
