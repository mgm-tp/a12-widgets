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

import { fireEvent, getAllByDataRole, getByDataRole, render } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";

import type { YearSelectorProps } from "../year-selector.api.js";
import { YearSelector } from "../year-selector.view.js";

describe("com.mgmtp.a12.widgets.input.year-selector", () => {
	const properties: Partial<YearSelectorProps> = {
		id: "year-selector",
		className: "year-selector-class",
		style: { background: "red" },
		label: "Test Year Selector",
		year: 1996,
		errorMessage: "Error message",
		warningMessage: "Warning message",
		infoMessage: "Info message",
		helperText: "Helper text",
		tooltips: "Test Tooltip"
	};

	test("rendering year selector", () => {
		const { container } = render(
			<YearSelector
				year={properties.year}
				label={properties.label}
				id={properties.id}
				className={properties.className}
				style={properties.style}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering disabled year selector", () => {
		const { container } = render(<YearSelector year={properties.year} disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering readonly year selector", () => {
		const { container } = render(<YearSelector year={properties.year} readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error state", () => {
		const { container } = render(<YearSelector year={properties.year} error />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with warning state", () => {
		const { container } = render(<YearSelector year={properties.year} warning />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info state", () => {
		const { container } = render(<YearSelector year={properties.year} info />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error and warning messages", () => {
		const { container } = render(
			<YearSelector
				year={properties.year}
				errorMessage={properties.errorMessage}
				warningMessage={properties.warningMessage}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info message", () => {
		const { container } = render(<YearSelector year={properties.year} infoMessage={properties.infoMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with helper text", () => {
		const { container } = render(<YearSelector year={properties.year} helperText={properties.helperText} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with inline tooltip", () => {
		const { container } = render(<YearSelector year={properties.year} tooltips={properties.tooltips} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with tooltip in new line", () => {
		const { container } = render(
			<YearSelector year={properties.year} tooltips={properties.tooltips} breakTooltipsToNewLine />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with hidden label", () => {
		const { container } = render(<YearSelector year={properties.year} label={properties.label} hideLabel />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering year selector with custom year selection range", () => {
		const { container } = render(<YearSelector year={1994} yearRange={{ start: 1994, end: 2014 }} />);

		const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
		expect(options[0].getAttribute("value")).toEqual("1994");
		expect(options[options.length - 1].getAttribute("value")).toEqual("2014");
	});

	test("rendering with allow optional value", () => {
		const { container } = render(<YearSelector optionalItem={{ label: "additional Item" }} year={properties.year} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating year selector change value", () => {
		const onYearChangeFn = vi.fn();
		const yearSelectRefFn = vi.fn();

		const { container } = render(
			<YearSelector year={1} yearSelectRef={yearSelectRefFn} onYearChange={onYearChangeFn} />
		);

		expect(yearSelectRefFn).toHaveBeenCalledTimes(1);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input);
		fireEvent.change(yearInput, { currentTarget: { value: "2" } });
		expect(onYearChangeFn).toHaveBeenCalledTimes(1);
	});
});
