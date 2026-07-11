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

import { fireEvent, getAllByDataRole, getByDataRole, render, getByText, queryByDataRole, getByRole } from "test-utils";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { useRef, useState } from "react";
import { enUS } from "date-fns/locale";

import { DataRoles } from "../../common/main/data-roles.js";
import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";
import { Toast } from "../../toast/main/toast/toast.view.js";
import { ToastGroup } from "../../toast/main/toast-group.view.js";
import { BufferedInput, HTMLInputAdapter } from "../../input/buffered/index.js";
import { TextField } from "../../input/text-field/index.js";
import { Button } from "../../button/index.js";
import { Icon } from "../../icon/index.js";
import { AttachedPortal } from "../../attached-portal/index.js";

import {
	DatePickerScreen,
	DateTimePickerFooter,
	DateTimePickerHeader,
	TimePickerScreen
} from "../main/date-time-picker.tpl.view.js";
import { DateTimePicker } from "../main/date-time-picker.view.js";

const BufferedStringInput = BufferedInput(HTMLInputAdapter(TextField));

const baseClassName = "DayPicker";
const timePickerBaseDataRole = DataRoles.TimePicker;

const fakeTimer = new Date(Date.UTC(2022, 2, 2, 14, 40).valueOf());

describe("com.mgmtp.a12.widgets.date-time-picker.date-picker-screen", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fakeTimer);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("render date picker screen — select year selector", () => {
		const { container } = render(<DatePickerScreen yearSelectorVariant="select" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date picker screen — textbox year selector (default)", () => {
		const { container } = render(<DatePickerScreen />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date picker screen — autocomplete year selector", () => {
		const { container } = render(<DatePickerScreen yearRange={{ start: 2000, end: 2030 }} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date picker screen with custom elements", () => {
		const { container } = render(
			<DatePickerScreen
				headerElement={<div id="header">header</div>}
				timeEditElement={<div id="time-edit">time edit</div>}
				footerElement={<div id="footer">footer</div>}
			/>
		);

		expect(getByText(container, "header")).toHaveAttribute("id", "header");
		expect(getByText(container, "time edit")).toHaveAttribute("id", "time-edit");
		expect(getByText(container, "footer")).toHaveAttribute("id", "footer");
	});

	test("test date picker classNames — select year selector", () => {
		const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
		const classNames = {
			container: "",
			wrapper: "",
			interactionDisabled: "",
			navBar: "",
			navButtonPrev: "",
			navButtonNext: "",
			navButtonInteractionDisabled: "",
			months: "",
			month: "",
			caption: "",
			weekdays: "",
			weekdaysRow: "",
			weekday: "",
			weekNumber: "",
			body: "",
			week: "",
			day: "",
			footer: "",
			todayButton: "",
			today: "",
			selected: "",
			disabled: "",
			outside: ""
		};
		const highlightedDay = (day: Date): boolean => {
			return day.getDate() === 20;
		};

		const today = new Date();
		const bookedDays = (day: Date): boolean => {
			return day.getDate() === 23;
		};

		const bookedStyle = { border: "2px solid currentColor" };

		const { container } = render(
			<DatePickerScreen
				date={today}
				yearRange={{ start: 2000, end: 2030 }}
				yearSelectorVariant="select"
				disabled={today}
				modifiers={{ highlightedDay, booked: bookedDays }}
				modifiersStyles={{ booked: bookedStyle }}
				modifiersClassNames={{ booked: "booked-classname" }}
				classNames={classNames}
				months={months}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate date picker screen events", () => {
		const onDayClickFn = vi.fn();
		const onDayChangeFn = vi.fn();
		const onMonthChangeFn = vi.fn();
		const wrapperRefFn = vi.fn();

		const { container } = render(
			<DatePickerScreen
				onDayChange={onDayChangeFn}
				onDayClick={onDayClickFn}
				wrapperRef={wrapperRefFn}
				onMonthChange={onMonthChangeFn}
			/>
		);

		expect(wrapperRefFn).toHaveBeenCalledTimes(1);

		const today = container.querySelector(`.${baseClassName}-Day--today`);

		if (today && today.firstElementChild) {
			fireEvent.click(today.firstElementChild);
			expect(onDayClickFn).toHaveBeenCalledTimes(1);
			expect(onDayChangeFn).toHaveBeenCalledTimes(1);
		}

		fireEvent.click(getByDataRole(container, DataRoles.DatePicker.NavBar.Next));
		expect(onMonthChangeFn).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.date-time-picker.time-picker-screen", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fakeTimer);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("render time picker screen", () => {
		const { container } = render(<TimePickerScreen />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render time picker screen with custom elements", () => {
		const { container } = render(
			<TimePickerScreen headerElement={<div id="header">header</div>} footerElement={<div id="footer">footer</div>} />
		);

		expect(getByText(container, "header")).toHaveAttribute("id", "header");
		expect(getByText(container, "footer")).toHaveAttribute("id", "footer");
	});

	test("test time picker 24h mode", () => {
		const { container } = render(
			<TimePickerScreen time={new Date()} dateDisplay="date display" mode="24h" initialScreen="minute" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate time picker screen events", () => {
		const onScreenChangeFn = vi.fn();
		const onTimeChangeFn = vi.fn();
		const wrapperRefFn = vi.fn();

		const { container } = render(
			<TimePickerScreen wrapperRef={wrapperRefFn} onScreenChange={onScreenChangeFn} onTimeChange={onTimeChangeFn} />
		);

		expect(wrapperRefFn).toHaveBeenCalledTimes(1);

		const hour = getAllByDataRole(container, `${timePickerBaseDataRole}-time`)[0];
		const minute = getAllByDataRole(container, `${timePickerBaseDataRole}-time`)[1];

		// Verify the time picker elements exist
		expect(hour).toBeInTheDocument();
		expect(minute).toBeInTheDocument();

		// Verify clock numbers are rendered
		const clockNums = getAllByDataRole(container, `${timePickerBaseDataRole}-clock-num`);
		expect(clockNums.length).toBeGreaterThan(0);

		// Choose a value from the clock
		fireEvent.click(clockNums[0]);
		expect(onTimeChangeFn).toHaveBeenCalled();

		// Choose another value from the clock
		if (clockNums.length > 1) {
			fireEvent.click(clockNums[1]);
			expect(onTimeChangeFn).toHaveBeenCalled();
		}
	});
});

describe("com.mgmtp.a12.widgets.date-time-picker.template-elements", () => {
	test("render header", () => {
		const { container } = render(
			<DateTimePickerHeader id="test-id" className="test-class" actionButtons={<button />}>
				Test Title
			</DateTimePickerHeader>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render footer", () => {
		const { container } = render(
			<DateTimePickerFooter id="test-id" className="test-class">
				Test Footer
			</DateTimePickerFooter>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("test footer action", () => {
		const { container } = render(
			<DateTimePickerFooter.Action id="test-id" className="test-class">
				Test Action
			</DateTimePickerFooter.Action>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});

describe("com.mgmtp.a12.widgets.date-time-picker", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fakeTimer);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("render date time picker — select year selector", () => {
		const { container } = render(<DateTimePicker initialScreen="hour" yearSelectorVariant="select" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date time picker — textbox year selector (default)", () => {
		const { container } = render(<DateTimePicker initialScreen="hour" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render date time picker — autocomplete year selector", () => {
		const { container } = render(<DateTimePicker initialScreen="hour" yearRange={{ start: 2000, end: 2030 }} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test passed props", () => {
		const { container } = render(
			<DateTimePicker
				id="test-id"
				className="test-class"
				style={{ color: "red" }}
				customTimeEditElement={<div id="custom-time-edit">time edit</div>}
				backLabel="RETURN"
				clearLabel="REMOVE"
				okLabel="SUBMIT"
				value={new Date()}
				initialScreen="hour"
			/>
		);

		expect(container.firstChild).toHaveAttribute("id", "test-id");
		expect(container.firstChild).toHaveClass("test-class");
		expect(container.firstChild).toHaveStyle({ color: "rgb(255, 0, 0)" });
		expect(getByText(container, "SUBMIT", { exact: true })).toBeInTheDocument();

		// The clear button should be visible when there's a value
		expect(getByText(container, "REMOVE", { exact: true })).toBeInTheDocument();

		// The back button should be visible when on time screen (initialScreen="hour")
		expect(getByText(container, "RETURN", { exact: true })).toBeInTheDocument();
	});

	test("simulate accept value", () => {
		const onAcceptFn = vi.fn();
		const { container } = render(<DateTimePicker onAccept={onAcceptFn} value={new Date()} />);

		// first action element is empty, used only for layout purpose
		const action = getAllByDataRole(container, DataRoles.DateTimePicker.Footer.Action)[1];
		fireEvent.click(getByDataRole(action, DataRoles.Button));
		expect(onAcceptFn).toHaveBeenCalledTimes(1);
	});

	test("should be refocused after clicking the clear value button", () => {
		const { container } = render(<DateTimePicker value={new Date()} />);
		const dateTimePickerElement = getByDataRole(container, DataRoles.DateTimePicker);
		const clearBtn = getByRole(dateTimePickerElement, "button", { name: "clear" });
		fireEvent.click(clearBtn);
		expect(dateTimePickerElement).toHaveFocus();
	});

	test("Date Time Picker with `desktopPickerAttributes` property", () => {
		const ariaLabel = "Custom desktop date time picker";
		const { getByDataRole } = render(
			<DateTimePicker
				desktopPickerAttributes={{
					"aria-label": ariaLabel
				}}
			/>
		);

		const dateTimePicker = getByDataRole(DataRoles.DateTimePicker);
		expect(dateTimePicker).toBeTruthy();
		expect(dateTimePicker.getAttribute("aria-label")).toBe(ariaLabel);
	});
});

describe("Date time picker when a toast is showing", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fakeTimer);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const DateTimePickerWithToast = () => {
		const [showPicker, setShowPicker] = useState(false);
		const inputRef = useRef<HTMLInputElement | null>(null);
		const referenceElement = useRef<HTMLButtonElement | null>(null);

		const onAcceptFn = vi.fn((_?: Date) => {
			setShowPicker(false);
			// Focus the input after accepting a date (same as SimpleDateTimePicker)
			inputRef.current?.focus();
		});

		return (
			<>
				<BufferedStringInput
					id="test-date-time-picker-input"
					inputRef={inputRef as any}
					alwaysSubmit
					prefixes={
						<Button
							id="test-trigger-button"
							icon={<Icon>event</Icon>}
							onClick={() => setShowPicker(true)}
							buttonRef={(ref: HTMLButtonElement | null) => {
								referenceElement.current = ref;
							}}
							block
							title="Select a date and time"
						/>
					}
					value=""
					initialValue=""
					onValueSubmit={() => {}}
					label="Simple Date Time Picker"
					labelGraphic={<Icon>info</Icon>}
					placeholder="MM/DD/YYYY h:mm A"
					helperText="You haven't chosen a date and time yet."
					submitOnEnter
				/>

				{referenceElement.current && showPicker && (
					<AttachedPortal
						selfSizing
						referenceElement={referenceElement.current}
						closeOnOutsideClick
						adjustPositionToScreen
						orientationList={["bottom-start", "bottom-end", "top-start", "top-end", "right", "left"]}
						fixedOrientation
						onVisibilityChange={(isVisible) => {
							if (!isVisible) {
								setShowPicker(false);
								// Focus the input when the picker closes (same as SimpleDateTimePicker)
								setTimeout(() => {
									inputRef.current?.focus();
								}, 0);
							}
						}}
					>
						<DateTimePicker id="test-date-time-picker" value={new Date()} onAccept={onAcceptFn} />
					</AttachedPortal>
				)}

				<ToastGroup>
					<Toast
						type="permanent"
						message="This toast demonstrates the focus issue. When the date picker closes, focus incorrectly jumps here instead of returning to the input field."
					/>
				</ToastGroup>
			</>
		);
	};

	test("should maintain focus on input after closing date picker with toast present via onAccept", () => {
		const { container } = render(<DateTimePickerWithToast />);

		// Verify the toast is rendered
		const toastElement = getByDataRole(container, DataRoles.Toast);
		expect(toastElement).toBeInTheDocument();

		// Click the trigger button to show the picker
		const triggerButton = getByRole(container, "button", { name: "Select a date and time" });
		fireEvent.click(triggerButton);

		// Verify the DateTimePicker is rendered
		const dateTimePicker = getByDataRole(container, DataRoles.DateTimePicker);
		expect(dateTimePicker).toBeInTheDocument();

		// Find and click the OK button in the date picker
		const okButton = getAllByDataRole(container, DataRoles.DateTimePicker.Footer.Action)[1];
		fireEvent.click(getByDataRole(okButton, DataRoles.Button));

		const dateTimeInput = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		expect(queryByDataRole(container, DataRoles.DateTimePicker)).not.toBeInTheDocument();
		expect(dateTimeInput).toHaveFocus();
		expect(toastElement).not.toHaveFocus();
	});

	test("should maintain focus on input after closing date picker with toast present via onVisibilityChange", () => {
		const { container } = render(<DateTimePickerWithToast />);

		// Verify the toast is rendered
		const toastElement = getByDataRole(container, DataRoles.Toast);
		expect(toastElement).toBeInTheDocument();

		// Click the trigger button to show the picker
		const triggerButton = getByRole(container, "button", { name: "Select a date and time" });
		fireEvent.click(triggerButton);

		// Verify the DateTimePicker is rendered

		const attachedPortal = getByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeInTheDocument();

		const dateTimePicker = getByDataRole(attachedPortal, DataRoles.DateTimePicker);

		expect(dateTimePicker).toBeInTheDocument();

		fireEvent.keyDown(attachedPortal!, { key: "Escape" });

		vi.runAllTimers();

		const dateTimeInput = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		expect(queryByDataRole(container, DataRoles.DateTimePicker)).not.toBeInTheDocument();
		expect(dateTimeInput).toHaveFocus();
		expect(toastElement).not.toHaveFocus();
	});
});

describe("Mobile Devices", () => {
	test("Date Time Picker with `mobilePickerAttributes` property", async () => {
		const ariaLabel = "Custom mobile date time picker";
		const { getByDataRole } = render(
			<DateTimePicker
				mobileMode
				mobilePickerAttributes={{
					"aria-label": ariaLabel
				}}
			/>
		);

		const dateTimePicker = getByDataRole(DataRoles.DateTimePicker);
		expect(dateTimePicker.getAttribute("aria-label")).toBe(ariaLabel);
	});
});

describe("com.mgmtp.a12.widgets.date-time-picker.context-time-mode", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(fakeTimer);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("DateTimePicker uses 24h mode from DateTimeContext", () => {
		const { container } = render(
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<DateTimePicker initialScreen="hour" />
			</DateTimeContext.Provider>
		);
		// In 24h mode, there should be no AM/PM selectors
		const amElements = container.querySelectorAll(`[data-role="${DataRoles.TimePicker.Am}"]`);
		expect(amElements).toHaveLength(0);
	});

	test("timeMode prop overrides DateTimeContext on DateTimePicker", () => {
		const { container } = render(
			<DateTimeContext.Provider value={{ locale: enUS, timeMode: "24h" }}>
				<DateTimePicker initialScreen="hour" timeMode="12h" />
			</DateTimeContext.Provider>
		);
		// With 12h mode prop override, AM/PM selectors should be present
		const amElements = container.querySelectorAll(`[data-role="${DataRoles.TimePicker.Am}"]`);
		expect(amElements).toHaveLength(1);
	});
});
