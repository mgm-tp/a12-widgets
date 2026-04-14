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

import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";

import type { MonthSelectorProps } from "../month-selector.api.js";
import { MonthSelector } from "../month-selector.view.js";

describe("com.mgmtp.a12.widgets.input.month-selector", () => {
	const properties: Partial<MonthSelectorProps> = {
		id: "month-selector",
		className: "month-selector-class",
		style: { background: "red" },
		label: "Test Month Selector",
		month: 2,
		errorMessage: "Error message",
		warningMessage: "Warning message",
		infoMessage: "Info message",
		helperText: "Helper text",
		tooltips: "Test Tooltip"
	};

	test("rendering month selector", () => {
		const { container } = render(
			<MonthSelector
				month={properties.month}
				label={properties.label}
				id={properties.id}
				className={properties.className}
				style={properties.style}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering disabled month selector", () => {
		const { container } = render(<MonthSelector month={properties.month} disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering readonly month selector", () => {
		const { container } = render(<MonthSelector month={properties.month} readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info state", () => {
		const { container } = render(<MonthSelector month={properties.month} info />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error state", () => {
		const { container } = render(<MonthSelector month={properties.month} error />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with warning state", () => {
		const { container } = render(<MonthSelector month={properties.month} warning />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info message", () => {
		const { container } = render(<MonthSelector month={properties.month} infoMessage={properties.infoMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error and warning messages", () => {
		const { container } = render(
			<MonthSelector
				month={properties.month}
				errorMessage={properties.errorMessage}
				warningMessage={properties.warningMessage}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with helper text", () => {
		const { container } = render(<MonthSelector month={properties.month} helperText={properties.helperText} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with custom month names", () => {
		const { container } = render(
			<MonthSelector
				month={properties.month}
				months={["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with inline tooltip", () => {
		const { container } = render(<MonthSelector tooltips={properties.tooltips} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with tooltip in new line", () => {
		const { container } = render(<MonthSelector tooltips={properties.tooltips} breakTooltipsToNewLine />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with hidden label", () => {
		const { container } = render(<MonthSelector month={properties.month} label={properties.label} hideLabel />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with allow optional value", () => {
		const { container } = render(
			<MonthSelector label={properties.label} optionalItem={{ label: "additional Item" }} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating month selector change value", () => {
		const onMonthChangeFn = vi.fn();
		const monthSelectRefFn = vi.fn();

		const { container } = render(
			<MonthSelector month={1} monthSelectRef={monthSelectRefFn} onMonthChange={onMonthChangeFn} />
		);

		expect(monthSelectRefFn).toHaveBeenCalledTimes(1);

		const monthInput = getByDataRole(container, DataRoles.Month.Selector.Input);
		fireEvent.change(monthInput, { currentTarget: { value: "2" } });
		expect(onMonthChangeFn).toHaveBeenCalledTimes(1);
	});
});
