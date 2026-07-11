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

import type { FocusEvent as ReactFocusEvent } from "react";
import { useState } from "react";
import { fireEvent, getAllByDataRole, getByDataRole, queryByDataRole, render } from "test-utils";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";

import type { YearSelectorProps } from "../year-selector.api.js";
import { YearSelector } from "../year-selector.view.js";
import {
	clampRangeToYear,
	detectVariant,
	isRelativeYearRange,
	normalizeAutocompleteValue,
	parseYearDigits,
	resolveYearRange
} from "../year-selector.utils.js";

function ControlledYearSelectorAutocomplete() {
	const [year, setYear] = useState<number | undefined>();
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const handleYearChange = (nextYear: number | undefined): void => {
		setYear(nextYear);
	};

	const handleBlur = (event: ReactFocusEvent<HTMLInputElement>): void => {
		const value = (event.currentTarget as HTMLInputElement).value;

		if (value === "") {
			setError(false);
			setErrorMessage(undefined);
		} else if (!/^\d{4}$/.test(value)) {
			setError(true);
			setErrorMessage("Invalid year");
		} else {
			setError(false);
			setErrorMessage(undefined);
		}
	};

	return (
		<YearSelector
			variant="autocomplete"
			yearRange={{ start: 2020, end: 2030 }}
			placeholder="Year"
			year={year}
			error={error}
			errorMessage={errorMessage}
			onYearChange={handleYearChange}
			onBlur={handleBlur}
		/>
	);
}

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
				variant="select"
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
		const { container } = render(<YearSelector variant="select" year={properties.year} disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering readonly year selector", () => {
		const { container } = render(<YearSelector variant="select" year={properties.year} readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error state", () => {
		const { container } = render(<YearSelector variant="select" year={properties.year} error />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with warning state", () => {
		const { container } = render(<YearSelector variant="select" year={properties.year} warning />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info state", () => {
		const { container } = render(<YearSelector variant="select" year={properties.year} info />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with error and warning messages", () => {
		const { container } = render(
			<YearSelector
				variant="select"
				year={properties.year}
				errorMessage={properties.errorMessage}
				warningMessage={properties.warningMessage}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with info message", () => {
		const { container } = render(
			<YearSelector variant="select" year={properties.year} infoMessage={properties.infoMessage} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with helper text", () => {
		const { container } = render(
			<YearSelector variant="select" year={properties.year} helperText={properties.helperText} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with inline tooltip", () => {
		const { container } = render(
			<YearSelector variant="select" year={properties.year} tooltips={properties.tooltips} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with tooltip in new line", () => {
		const { container } = render(
			<YearSelector variant="select" year={properties.year} tooltips={properties.tooltips} breakTooltipsToNewLine />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with hidden label", () => {
		const { container } = render(
			<YearSelector variant="select" year={properties.year} label={properties.label} hideLabel />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering with allow optional value", () => {
		const { container } = render(
			<YearSelector variant="select" optionalItem={{ label: "additional Item" }} year={properties.year} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating year selector change value", () => {
		const onYearChangeFn = vi.fn();
		const yearSelectRefFn = vi.fn();

		const { container } = render(
			<YearSelector variant="select" year={1} yearSelectRef={yearSelectRefFn} onYearChange={onYearChangeFn} />
		);

		expect(yearSelectRefFn).toHaveBeenCalledTimes(1);

		const yearInput = getByDataRole(container, DataRoles.Year.Selector.Input);
		fireEvent.change(yearInput, { currentTarget: { value: "2" } });
		expect(onYearChangeFn).toHaveBeenCalledTimes(1);
	});

	describe("year range resolution", () => {
		test("default range is reference year ±6/+7 when no yearRange given", () => {
			const { container } = render(<YearSelector year={2020} variant="select" />);
			const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
			expect(options[0].getAttribute("value")).toEqual("2014"); // 2020 - 6
			expect(options[options.length - 1].getAttribute("value")).toEqual("2027"); // 2020 + 7
		});

		test("resolves absolute yearRange with both bounds", () => {
			const { container } = render(
				<YearSelector year={2000} variant="select" yearRange={{ start: 1990, end: 2010 }} />
			);
			const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
			expect(options[0].getAttribute("value")).toEqual("1990");
			expect(options[options.length - 1].getAttribute("value")).toEqual("2010");
		});

		test("resolves absolute yearRange with only start — fills end as start + 13", () => {
			const { container } = render(<YearSelector year={2010} variant="select" yearRange={{ start: 2010 }} />);
			const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
			expect(options[0].getAttribute("value")).toEqual("2010");
			expect(options[options.length - 1].getAttribute("value")).toEqual("2023"); // 2010 + 13
		});

		test("resolves absolute yearRange with only end — fills start as end - 13", () => {
			const { container } = render(<YearSelector year={2020} variant="select" yearRange={{ end: 2020 }} />);
			const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
			expect(options[0].getAttribute("value")).toEqual("2007"); // 2020 - 13
			expect(options[options.length - 1].getAttribute("value")).toEqual("2020");
		});

		test("resolves RelativeYearRange with both offsets", () => {
			const { container } = render(
				<YearSelector year={2020} variant="select" yearRange={{ startOffset: -3, endOffset: 3 }} />
			);
			const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
			expect(options[0].getAttribute("value")).toEqual("2017"); // 2020 - 3
			expect(options[options.length - 1].getAttribute("value")).toEqual("2023"); // 2020 + 3
		});

		test("resolves RelativeYearRange with only startOffset — uses default endOffset +7", () => {
			const { container } = render(<YearSelector year={2020} variant="select" yearRange={{ startOffset: -10 }} />);
			const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
			expect(options[0].getAttribute("value")).toEqual("2010"); // 2020 - 10
			expect(options[options.length - 1].getAttribute("value")).toEqual("2027"); // 2020 + 7
		});

		test("expands range to include year when year falls outside resolved absolute range", () => {
			const { container } = render(
				<YearSelector year={2035} variant="select" yearRange={{ start: 2000, end: 2030 }} />
			);
			const options = getAllByDataRole(container, DataRoles.Year.Selector.Option);
			const values = options.map((o) => o.getAttribute("value"));
			expect(values).toContain("2035");
			expect(values[0]).toEqual("2000");
			expect(values[values.length - 1]).toEqual("2035");
		});
	});

	describe("placeholder support", () => {
		test("select variant — placeholder renders as first option when no year is selected", () => {
			const { container } = render(<YearSelector variant="select" placeholder="Select a year" />);
			const yearSelect = getByDataRole(container, DataRoles.Year.Selector.Input) as HTMLSelectElement;
			expect(yearSelect.options[0].label).toEqual("Select a year");
			expect(yearSelect.options[0].value).toEqual("");
			expect(yearSelect.options[0].disabled).toBe(true);
		});

		test("select variant — placeholder is not shown when a year is selected", () => {
			const { container } = render(<YearSelector variant="select" year={2020} placeholder="Select a year" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveValue("2020");
		});

		test("select variant — onYearChange called with undefined when placeholder option is chosen", () => {
			const onYearChangeFn = vi.fn();
			const { container } = render(
				<YearSelector variant="select" placeholder="Select a year" onYearChange={onYearChangeFn} />
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			fireEvent.change(input, { currentTarget: { value: "" } });
			expect(onYearChangeFn).toHaveBeenCalledWith(undefined);
		});

		test("select variant — year is unset (undefined) with no placeholder — defaults to current year", () => {
			const { container } = render(<YearSelector variant="select" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveValue(`${new Date().getUTCFullYear()}`);
		});
	});

	describe("textbox variant", () => {
		test("renders a text input when no yearRange is given and variant is not set", () => {
			const { container } = render(<YearSelector year={2020} />);
			expect(getByDataRole(container, DataRoles.Year.Selector.Input).tagName).toBe("INPUT");
		});

		test("renders a text input when variant='textbox'", () => {
			const { container } = render(<YearSelector year={2020} variant="textbox" />);
			expect(getByDataRole(container, DataRoles.Year.Selector.Input)).not.toBeNull();
		});

		test("textbox value reflects the year prop", () => {
			const { container } = render(<YearSelector year={2024} variant="textbox" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveValue("2024");
		});

		test("textbox shows empty when year is undefined", () => {
			const { container } = render(<YearSelector variant="textbox" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveValue("");
		});

		test("textbox placeholder is shown when no year is selected", () => {
			const { container } = render(<YearSelector variant="textbox" placeholder="Year" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveAttribute("placeholder", "Year");
		});

		test("textbox — input has numeric inputMode for mobile keyboard", () => {
			const { container } = render(<YearSelector variant="textbox" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveAttribute("inputmode", "numeric");
		});

		test("textbox — input has maxLength of 4 to prevent overlong entry", () => {
			const { container } = render(<YearSelector variant="textbox" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveAttribute("maxlength", "4");
		});
	});

	describe("autocomplete variant", () => {
		test("renders an autocomplete input when yearRange is provided and variant is not set", () => {
			const { container } = render(<YearSelector year={2020} yearRange={{ start: 2015, end: 2025 }} />);
			expect(getByDataRole(container, DataRoles.Year.Selector.Input).tagName).toBe("INPUT");
		});

		test("renders an autocomplete input when variant='autocomplete'", () => {
			const { container } = render(
				<YearSelector year={2020} variant="autocomplete" yearRange={{ start: 2015, end: 2025 }} />
			);
			expect(getByDataRole(container, DataRoles.Year.Selector.Input)).not.toBeNull();
		});

		test("autocomplete value reflects the year prop as a string", () => {
			const { container } = render(
				<YearSelector year={2020} variant="autocomplete" yearRange={{ start: 2015, end: 2025 }} />
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveValue("2020");
		});

		test("autocomplete shows empty when year is undefined", () => {
			const { container } = render(<YearSelector variant="autocomplete" yearRange={{ start: 2015, end: 2025 }} />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveValue("");
		});

		test("autocomplete placeholder is set on the input", () => {
			const { container } = render(
				<YearSelector variant="autocomplete" yearRange={{ start: 2015, end: 2025 }} placeholder="Year" />
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			expect(input).toHaveAttribute("placeholder", "Year");
		});

		test("autocompleteHintTemplate is shown in the dropdown", async () => {
			const { container } = render(
				<YearSelector
					variant="autocomplete"
					yearRange={{ start: 2020, end: 2025 }}
					autocompleteHintTemplate="{count} of {total} years shown"
				/>
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			await userEvent.click(input);
			const hint = getByDataRole(container, DataRoles.Dropdown.Hint);
			expect(hint).toHaveTextContent("6 of 6 years shown");
		});
	});

	describe("onYearChange behaviour", () => {
		describe("textbox variant", () => {
			test("fires onYearChange with a number when exactly 4 digits are entered", async () => {
				const onYearChangeFn = vi.fn();
				const { container } = render(<YearSelector variant="textbox" onYearChange={onYearChangeFn} />);
				const input = getByDataRole(container, DataRoles.Year.Selector.Input);
				await userEvent.type(input, "2024");
				expect(onYearChangeFn).toHaveBeenCalledTimes(1);
				expect(onYearChangeFn).toHaveBeenCalledWith(2024);
			});

			test("does NOT fire onYearChange for partial values (fewer than 4 digits)", async () => {
				const onYearChangeFn = vi.fn();
				const { container } = render(<YearSelector variant="textbox" onYearChange={onYearChangeFn} />);
				const input = getByDataRole(container, DataRoles.Year.Selector.Input);
				await userEvent.type(input, "202");
				expect(onYearChangeFn).not.toHaveBeenCalled();
			});

			test("fires onYearChange with undefined when the textbox is cleared", async () => {
				const onYearChangeFn = vi.fn();
				const { container } = render(<YearSelector variant="textbox" year={2024} onYearChange={onYearChangeFn} />);
				const input = getByDataRole(container, DataRoles.Year.Selector.Input);
				await userEvent.clear(input);
				expect(onYearChangeFn).toHaveBeenCalledTimes(1);
				expect(onYearChangeFn).toHaveBeenCalledWith(undefined);
			});
		});

		describe("autocomplete variant", () => {
			test("does NOT fire onYearChange for partial values (fewer than 4 digits)", async () => {
				const onYearChangeFn = vi.fn();
				const { container } = render(
					<YearSelector variant="autocomplete" yearRange={{ start: 2020, end: 2025 }} onYearChange={onYearChangeFn} />
				);
				const input = getByDataRole(container, DataRoles.Year.Selector.Input);
				await userEvent.type(input, "202");
				expect(onYearChangeFn).not.toHaveBeenCalled();
			});

			test("fires onYearChange with a number when a year is typed and confirmed", async () => {
				const onYearChangeFn = vi.fn();
				const { container } = render(
					<YearSelector variant="autocomplete" yearRange={{ start: 2020, end: 2025 }} onYearChange={onYearChangeFn} />
				);
				const input = getByDataRole(container, DataRoles.Year.Selector.Input);
				await userEvent.type(input, "2023{Enter}");
				expect(onYearChangeFn).toHaveBeenCalledWith(2023);
			});
		});
	});

	describe("textbox variant — input validation", () => {
		test("strips non-digit characters immediately on input", async () => {
			const { container } = render(<YearSelector variant="textbox" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			await userEvent.type(input, "20ab");
			expect(input).toHaveValue("20");
		});

		test("strips letters-only input to empty string", async () => {
			const { container } = render(<YearSelector variant="textbox" />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			await userEvent.type(input, "abc");
			expect(input).toHaveValue("");
		});

		test("textbox — onBlur callback is invoked when the input loses focus", () => {
			const onBlurFn = vi.fn();
			const { container } = render(<YearSelector variant="textbox" onBlur={onBlurFn} />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			fireEvent.blur(input);
			expect(onBlurFn).toHaveBeenCalledTimes(1);
		});

		test("textbox — onBlur event carries the current (partial) input value, not the last committed year", async () => {
			let capturedValue: string | undefined;
			const onBlurFn = vi.fn((ev: ReactFocusEvent<HTMLInputElement>) => {
				capturedValue = (ev.currentTarget as HTMLInputElement)?.value;
			});
			const { container } = render(<YearSelector variant="textbox" year={2024} onBlur={onBlurFn} />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			await userEvent.clear(input);
			await userEvent.type(input, "202");
			fireEvent.blur(input);
			expect(onBlurFn).toHaveBeenCalledTimes(1);
			expect(capturedValue).toBe("202");
		});
	});

	describe("autocomplete variant — input validation", () => {
		test("autocomplete — onBlur callback is invoked when the input loses focus", () => {
			const onBlurFn = vi.fn();
			const { container } = render(
				<YearSelector variant="autocomplete" yearRange={{ start: 2020, end: 2030 }} onBlur={onBlurFn} />
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			fireEvent.blur(input);
			expect(onBlurFn).toHaveBeenCalledTimes(1);
		});

		test("autocomplete — onBlur event captures the input value at time of blur", async () => {
			let capturedValue: string | undefined;
			const onBlurFn = vi.fn((ev: ReactFocusEvent<HTMLInputElement>) => {
				capturedValue = (ev.currentTarget as HTMLInputElement)?.value;
			});
			const { container } = render(
				<YearSelector variant="autocomplete" yearRange={{ start: 2020, end: 2030 }} onBlur={onBlurFn} />
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			await userEvent.type(input, "1");
			fireEvent.blur(input);
			expect(onBlurFn).toHaveBeenCalledTimes(1);
			expect(capturedValue).toBe("1");
		});

		test("autocomplete — non-digit characters do NOT trigger onYearChange", async () => {
			const onYearChangeFn = vi.fn();
			const { container } = render(
				<YearSelector variant="autocomplete" yearRange={{ start: 2020, end: 2030 }} onYearChange={onYearChangeFn} />
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			await userEvent.type(input, "abc");
			expect(onYearChangeFn).not.toHaveBeenCalled();
		});

		test("autocomplete — mixed digit/non-digit input with fewer than 4 digits does NOT trigger onYearChange", async () => {
			const onYearChangeFn = vi.fn();
			const { container } = render(
				<YearSelector variant="autocomplete" yearRange={{ start: 2020, end: 2030 }} onYearChange={onYearChangeFn} />
			);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);
			await userEvent.type(input, "20ab");
			expect(onYearChangeFn).not.toHaveBeenCalled();
		});
	});

	describe("autocomplete variant — end-to-end user interaction flow", () => {
		test("placeholder shown → open dropdown → select year → clear input → invalid input → blur shows error → clear → blur removes error and restores placeholder", async () => {
			const { container } = render(<ControlledYearSelectorAutocomplete />);
			const input = getByDataRole(container, DataRoles.Year.Selector.Input);

			expect(input).toHaveAttribute("placeholder", "Year");
			expect(input).toHaveValue("");

			await userEvent.click(input);
			const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);
			expect(dropdownItems.length).toBeGreaterThan(0);

			await userEvent.click(dropdownItems[0]);
			expect(input).toHaveValue("2020");

			await userEvent.clear(input);
			fireEvent.blur(input);
			expect(input).toHaveValue("");

			await userEvent.type(input, "abc");
			fireEvent.blur(input);

			expect(getByDataRole(container, DataRoles.TextField.ErrorMessage)).toHaveTextContent("Invalid year");

			await userEvent.clear(input);
			fireEvent.blur(input);

			expect(queryByDataRole(container, DataRoles.TextField.ErrorMessage)).toBeNull();
			expect(input).toHaveValue("");
			expect(input).toHaveAttribute("placeholder", "Year");
		});
	});
});

describe("com.mgmtp.a12.widgets.input.year-selector.parseYearDigits", () => {
	test("returns the string for a valid 4-digit year", () => {
		expect(parseYearDigits("2024")).toEqual("2024");
	});

	test("returns null for partial entries (fewer than 4 digits)", () => {
		expect(parseYearDigits("2")).toBeNull();
		expect(parseYearDigits("20")).toBeNull();
		expect(parseYearDigits("202")).toBeNull();
	});

	test("returns null for entries longer than 4 digits", () => {
		expect(parseYearDigits("20245")).toBeNull();
	});

	test("returns undefined for an empty string (cleared / non-string inputs are coerced to '' by callers)", () => {
		expect(parseYearDigits("")).toBeUndefined();
	});
});

describe("com.mgmtp.a12.widgets.input.year-selector.normalizeAutocompleteValue", () => {
	test("returns the string unchanged when the value is a plain string (user typed)", () => {
		expect(normalizeAutocompleteValue("2024")).toBe("2024");
		expect(normalizeAutocompleteValue("")).toBe("");
	});

	test("extracts the value field when the value is a DropDownItem (user clicked dropdown item)", () => {
		expect(normalizeAutocompleteValue({ label: "2024", value: "2024" })).toBe("2024");
	});

	test("returns empty string when DropDownItem has no value field", () => {
		expect(normalizeAutocompleteValue({ label: "2024" })).toBe("");
	});

	test("returns empty string for null, undefined, or other non-string types", () => {
		expect(normalizeAutocompleteValue(null)).toBe("");
		expect(normalizeAutocompleteValue(undefined)).toBe("");
		expect(normalizeAutocompleteValue(42)).toBe("");
	});
});

describe("com.mgmtp.a12.widgets.input.year-selector.isRelativeYearRange", () => {
	test("returns true when startOffset is present", () => {
		expect(isRelativeYearRange({ startOffset: -3 })).toBe(true);
	});

	test("returns true when endOffset is present", () => {
		expect(isRelativeYearRange({ endOffset: 5 })).toBe(true);
	});

	test("returns true when both offsets are present", () => {
		expect(isRelativeYearRange({ startOffset: -3, endOffset: 3 })).toBe(true);
	});

	test("returns false for an absolute range with both bounds", () => {
		expect(isRelativeYearRange({ start: 2000, end: 2030 })).toBe(false);
	});

	test("returns false for an absolute range with only start", () => {
		expect(isRelativeYearRange({ start: 2020 })).toBe(false);
	});

	test("returns false for an empty absolute range object", () => {
		expect(isRelativeYearRange({})).toBe(false);
	});
});

describe("com.mgmtp.a12.widgets.input.year-selector.resolveYearRange", () => {
	test("returns default ±6/+7 range when yearRange is undefined", () => {
		expect(resolveYearRange(undefined, 2020)).toEqual({ start: 2014, end: 2027 });
	});

	test("returns absolute range when both start and end are provided", () => {
		expect(resolveYearRange({ start: 1990, end: 2010 }, 2000)).toEqual({ start: 1990, end: 2010 });
	});

	test("fills end as start + 13 when only start is provided", () => {
		expect(resolveYearRange({ start: 2010 }, 2010)).toEqual({ start: 2010, end: 2023 });
	});

	test("fills start as end - 13 when only end is provided", () => {
		expect(resolveYearRange({ end: 2020 }, 2020)).toEqual({ start: 2007, end: 2020 });
	});

	test("returns default range when both start and end are undefined (empty absolute range)", () => {
		expect(resolveYearRange({}, 2020)).toEqual({ start: 2014, end: 2027 });
	});

	test("resolves relative range with both offsets", () => {
		expect(resolveYearRange({ startOffset: -3, endOffset: 3 }, 2020)).toEqual({ start: 2017, end: 2023 });
	});

	test("resolves relative range with only startOffset — uses default endOffset +7", () => {
		expect(resolveYearRange({ startOffset: -10 }, 2020)).toEqual({ start: 2010, end: 2027 });
	});

	test("resolves relative range with only endOffset — uses default startOffset -6", () => {
		expect(resolveYearRange({ endOffset: 5 }, 2020)).toEqual({ start: 2014, end: 2025 });
	});
});

describe("com.mgmtp.a12.widgets.input.year-selector.clampRangeToYear", () => {
	test("returns the range unchanged when year is undefined", () => {
		const range = { start: 2010, end: 2020 };
		expect(clampRangeToYear(range, undefined)).toEqual(range);
	});

	test("returns the range unchanged when year is within the range", () => {
		expect(clampRangeToYear({ start: 2010, end: 2020 }, 2015)).toEqual({ start: 2010, end: 2020 });
	});

	test("expands end to year when year is above the range", () => {
		expect(clampRangeToYear({ start: 2010, end: 2020 }, 2035)).toEqual({ start: 2010, end: 2035 });
	});

	test("expands start to year when year is below the range", () => {
		expect(clampRangeToYear({ start: 2010, end: 2020 }, 1999)).toEqual({ start: 1999, end: 2020 });
	});
});

describe("com.mgmtp.a12.widgets.input.year-selector.detectVariant", () => {
	test("returns the explicit variant when provided", () => {
		expect(detectVariant("select", undefined)).toBe("select");
		expect(detectVariant("textbox", { start: 2020, end: 2030 })).toBe("textbox");
		expect(detectVariant("autocomplete", undefined)).toBe("autocomplete");
	});

	test("returns 'autocomplete' when variant is undefined and yearRange is provided", () => {
		expect(detectVariant(undefined, { start: 2020, end: 2030 })).toBe("autocomplete");
	});

	test("returns 'textbox' when variant is undefined and yearRange is not provided", () => {
		expect(detectVariant(undefined, undefined)).toBe("textbox");
	});
});
