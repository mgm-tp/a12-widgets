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

import { fireEvent, getAllByDataRole, getByDataRole, isAfter, render } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
import type { YearMonthSelectorProps } from "../year-month-selector.api.js";
import { YearMonthSelector } from "../year-month-selector.view.js";

describe("com.mgmtp.a12.widgets.input.year-month-selector", () => {
	const properties: Partial<YearMonthSelectorProps> = {
		id: "year-month-selector",
		className: "year-month-selector-class",
		style: { background: "red" },
		label: "Test Year Month Selector",
		month: 9,
		year: 2018,
		errorMessage: "Error message",
		warningMessage: "Warning message",
		infoMessage: "Info message",
		helperText: "Helper text",
		tooltips: <span id="test-tooltip">Test tooltip</span>
	};

	test("rendering year month selector", () => {
		const { container } = render(<YearMonthSelector year={2023} month={1} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with base properties", () => {
		const { container } = render(
			<YearMonthSelector
				year={properties.year}
				month={properties.month}
				label={properties.label}
				id={properties.id}
				className={properties.className}
				style={properties.style}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering disabled year month selector", () => {
		const { container } = render(<YearMonthSelector year={properties.year} month={properties.month} disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering readonly year month selector", () => {
		const { container } = render(<YearMonthSelector year={properties.year} month={properties.month} readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info state", () => {
		const { container } = render(<YearMonthSelector year={properties.year} month={properties.month} info />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error state", () => {
		const { container } = render(<YearMonthSelector year={properties.year} month={properties.month} error />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with warning state", () => {
		const { container } = render(<YearMonthSelector year={properties.year} month={properties.month} warning />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info message", () => {
		const { container } = render(
			<YearMonthSelector year={properties.year} month={properties.month} infoMessage={properties.infoMessage} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error and warning messages", () => {
		const { container } = render(
			<YearMonthSelector
				year={properties.year}
				month={properties.month}
				errorMessage={properties.errorMessage}
				warningMessage={properties.warningMessage}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with one invalid selector", () => {
		const { container } = render(
			<YearMonthSelector
				year={properties.year}
				month={properties.month}
				error
				warning
				warningMessage={properties.warningMessage}
				errorMessage={properties.errorMessage}
				invalidComponent="month"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering year month selector with custom year selection range", () => {
		const { container } = render(
			<YearMonthSelector
				year={1994}
				month={properties.month}
				yearRange={{ start: 1994, end: 2014 }}
				yearSelectorVariant="select"
			/>
		);

		const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
		expect(options[0].getAttribute("value")).toEqual("1994");
		expect(options[options.length - 1].getAttribute("value")).toEqual("2014");
	});

	test("rendering with hidden labels", () => {
		const { container } = render(
			<YearMonthSelector
				year={properties.year}
				month={properties.month}
				hiddenLabels={{ monthLabel: "Hidden month label", yearLabel: "Hidden year label" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with helper text", () => {
		const { container } = render(
			<YearMonthSelector year={properties.year} month={properties.month} helperText={properties.helperText} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with custom month names", () => {
		const { container } = render(
			<YearMonthSelector
				year={properties.year}
				month={properties.month}
				months={["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with tooltip", () => {
		const { container } = render(
			<YearMonthSelector
				year={properties.year}
				month={properties.month}
				tooltips={properties.tooltips}
				breakTooltipsToNewLine
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with allow optional value in month selector", () => {
		const { container } = render(
			<YearMonthSelector
				year={properties.year}
				optionalMonthItem={{ label: "additional Item" }}
				optionalYearItem={{ label: "additional Item" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating year month selector events", () => {
		const onValueChangeFn = vi.fn();
		const monthSelectRefFn = vi.fn();
		const yearSelectRefFn = vi.fn();

		const { container } = render(
			<YearMonthSelector
				month={1}
				year={2008}
				yearSelectorVariant="select"
				monthSelectRef={monthSelectRefFn}
				yearSelectRef={yearSelectRefFn}
				onValueChange={onValueChangeFn}
			/>
		);

		expect(monthSelectRefFn).toHaveBeenCalledTimes(1);
		expect(yearSelectRefFn).toHaveBeenCalledTimes(1);

		const monthInput = getByDataRole(container, DataRoles.Month.Selector.Input);
		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input);
		fireEvent.change(monthInput, { currentTarget: { value: "2" } });
		fireEvent.change(yearInput, { currentTarget: { value: "1994" } });
		expect(onValueChangeFn).toHaveBeenCalledTimes(2);
	});

	test("YearMonthSelector defaults to textbox variant when no yearRange is given", () => {
		const { container } = render(<YearMonthSelector year={2020} month={5} />);
		expect(getByDataRole(container, DataRoles.Month.Selector.Input).tagName).toEqual("SELECT");
		expect(getByDataRole(container, DataRoles.Year.Selector.Input).tagName).toEqual("INPUT");
	});

	test("YearMonthSelector defaults to autocomplete variant when yearRange is given", () => {
		const { container } = render(<YearMonthSelector year={2020} month={5} yearRange={{ start: 2015, end: 2025 }} />);
		expect(getByDataRole(container, DataRoles.Month.Selector.Input).tagName).toEqual("SELECT");
		expect(getByDataRole(container, DataRoles.Year.Selector.Input).tagName).toEqual("INPUT");
	});

	test("YearMonthSelector uses select variant when yearSelectorVariant='select'", () => {
		const { container } = render(<YearMonthSelector year={2020} month={5} yearSelectorVariant="select" />);
		expect(getByDataRole(container, DataRoles.Month.Selector.Input).tagName).toEqual("SELECT");
		expect(getByDataRole(container, DataRoles.Year.Selector.Input).tagName).toEqual("SELECT");
	});

	test("YearMonthSelector uses autocomplete for year when yearSelectorVariant='autocomplete'", () => {
		const { container } = render(<YearMonthSelector year={2020} month={5} yearSelectorVariant="autocomplete" />);
		expect(getByDataRole(container, DataRoles.Month.Selector.Input).tagName).toEqual("SELECT");
		expect(getByDataRole(container, DataRoles.Year.Selector.Input).tagName).toEqual("INPUT");
	});

	test("YearMonthSelector passes yearPlaceholder to YearSelector", () => {
		const { container } = render(
			<YearMonthSelector year={undefined} month={5} yearSelectorVariant="select" yearPlaceholder="Year" />
		);
		const yearSelect = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLSelectElement;
		// NativeSelect renders placeholder as <option disabled label="…"> — use .label, not .text
		expect(yearSelect.options[0].label).toEqual("Year");
	});

	test("YearMonthSelector fires onYearSelectorBlur when year input loses focus", () => {
		const onBlurFn = vi.fn();
		const { container } = render(<YearMonthSelector year={2020} month={5} onYearSelectorBlur={onBlurFn} />);
		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input);
		fireEvent.blur(yearInput);
		expect(onBlurFn).toHaveBeenCalledTimes(1);
	});

	describe("message position", () => {
		const messageRoles = [
			DataRoles.Year.Month.Selector.ErrorMessage,
			DataRoles.Year.Month.Selector.WarningMessage,
			DataRoles.Year.Month.Selector.InfoMessage
		];

		const renderWithMessages = (messagePosition: MessagePosition) =>
			render(
				<YearMonthSelector
					year={properties.year}
					month={properties.month}
					label={properties.label}
					helperText="Test Helper Text"
					errorMessage="Test error message"
					warningMessage="Test warning message"
					infoMessage="Test info message"
					messagePosition={messagePosition}
				/>
			);

		test("renders the messages above the control for above", () => {
			const { getByDataRole } = renderWithMessages("above");
			const control = getByDataRole(DataRoles.Year.Month.Selector.Control);
			const label = getByDataRole(DataRoles.Year.Month.Selector.Label);
			const helperText = getByDataRole(DataRoles.Year.Month.Selector.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(control.contains(message)).toBe(false);
				// label → message → control → helper text
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(message, control)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});

		test("renders the messages below the control for below", () => {
			const { getByDataRole } = renderWithMessages("below");
			const control = getByDataRole(DataRoles.Year.Month.Selector.Control);
			const label = getByDataRole(DataRoles.Year.Month.Selector.Label);
			const helperText = getByDataRole(DataRoles.Year.Month.Selector.HelperText);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(control.contains(message)).toBe(false);
				// label → control → message → helper text
				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(control, message)).toBe(true);
				expect(isAfter(message, helperText)).toBe(true);
			}
		});
	});

	describe("tooltip position", () => {
		const renderWithTooltips = (breakTooltipsToNewLine: TooltipLineBreak, helperText?: string) =>
			render(
				<YearMonthSelector
					year={properties.year}
					month={properties.month}
					label={properties.label}
					helperText={helperText}
					tooltips={<div>Test tooltip</div>}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
				/>
			);

		/**
		 * Inline tooltips are not rendered by the year-month-selector itself: they are delegated into the
		 * inner year selector, which hands them to its text-field and so lands them in that field's
		 * tooltip addon, inside the control row.
		 */
		test("renders the tooltips inside the year selector for false", () => {
			const { getByDataRole, getByText } = renderWithTooltips(false);
			const control = getByDataRole(DataRoles.Year.Month.Selector.Control);
			const yearSelector = getByDataRole(DataRoles.Year.Selector);
			const tooltipAddon = getByDataRole(DataRoles.TextField.TooltipAddon);
			const tooltip = getByText("Test tooltip");

			expect(control.contains(tooltip)).toBe(true);
			expect(yearSelector.contains(tooltip)).toBe(true);
			expect(tooltipAddon.contains(tooltip)).toBe(true);
		});

		test("renders the tooltips above the control for above", () => {
			const { getByDataRole, getByText, queryByDataRole } = renderWithTooltips("above");
			const control = getByDataRole(DataRoles.Year.Month.Selector.Control);
			const tooltip = getByText("Test tooltip");

			expect(queryByDataRole(DataRoles.TextField.TooltipAddon)).toBeNull();
			expect(control.contains(tooltip)).toBe(false);
			expect(isAfter(tooltip, control)).toBe(true);
		});

		test("renders the tooltips below the control for below", () => {
			const { getByDataRole, getByText, queryByDataRole } = renderWithTooltips("below", "Test Helper Text");
			const control = getByDataRole(DataRoles.Year.Month.Selector.Control);
			const helperText = getByDataRole(DataRoles.Year.Month.Selector.HelperText);
			const tooltip = getByText("Test tooltip");

			expect(queryByDataRole(DataRoles.TextField.TooltipAddon)).toBeNull();
			expect(control.contains(tooltip)).toBe(false);
			expect(isAfter(control, tooltip)).toBe(true);
			expect(isAfter(tooltip, helperText)).toBe(true);
		});
	});

	/**
	 * The year-month-selector sets no `aria-invalid` itself: both selectors inherit it from the error
	 * state it forwards to them.
	 */
	describe("aria-invalid", () => {
		test("marks both selectors as invalid for error", () => {
			const { getByDataRole } = render(<YearMonthSelector year={properties.year} month={properties.month} error />);

			expect(getByDataRole(DataRoles.Month.Selector.Input)).toHaveAttribute("aria-invalid", "true");
			expect(getByDataRole(DataRoles.Year.Selector.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("marks both selectors as invalid for errorMessage", () => {
			const { getByDataRole } = render(
				<YearMonthSelector year={properties.year} month={properties.month} errorMessage="Test error message" />
			);

			expect(getByDataRole(DataRoles.Month.Selector.Input)).toHaveAttribute("aria-invalid", "true");
			expect(getByDataRole(DataRoles.Year.Selector.Input)).toHaveAttribute("aria-invalid", "true");
		});

		test("does not mark the selectors as invalid for a warning or an info", () => {
			const { getByDataRole } = render(
				<YearMonthSelector
					year={properties.year}
					month={properties.month}
					warning
					info
					warningMessage="Test warning message"
					infoMessage="Test info message"
				/>
			);

			expect(getByDataRole(DataRoles.Month.Selector.Input)).not.toHaveAttribute("aria-invalid");
			expect(getByDataRole(DataRoles.Year.Selector.Input)).not.toHaveAttribute("aria-invalid");
		});
	});
});
