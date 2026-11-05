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

import type { ReactNode } from "react";
import { getAllByDataRole, getByDataRole, queryByDataRole, render, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi } from "vitest";

import type { SliderMark } from "../../slider/main/slider.api.js";
import { Slider } from "../main/slider.view.js";

const baseDataRole = "field-slider";

const simpleMarks: SliderMark[] = [
	{ value: "1" },
	{ value: "2" },
	{ value: "3" },
	{ value: "4" },
	{ value: "5" },
	{ value: "6" }
];
const customLabelMarks: SliderMark[] = [
	{ label: "One", value: "1" },
	{ label: "Two", value: "2" },
	{ label: "Three", value: "3" },
	{ label: "Four", value: "4" },
	{ label: "Five", value: "5" },
	{ label: "Six", value: "6" }
];

const ArrowLeft = Key.ArrowLeft;
const ArrowUp = Key.ArrowUp;
const ArrowRight = Key.ArrowRight;
const ArrowDown = Key.ArrowDown;
const PageUp = Key.PageUp;
const PageDown = Key.PageDown;
const End = Key.End;
const Home = Key.Home;
const Escape = Key.Escape;

const boxRole = `${baseDataRole}-box`;
const backdropRole = `${baseDataRole}-backdrop`;
const tickRole = `${baseDataRole}-bar-tick`;

/**
 * The slider has no aria-valuenow; the thumb position is observable through the tick sides:
 * every tick up to (and including) the selected mark is rendered as a "left" tick.
 */
function expectThumbAtIndex(container: HTMLElement, index: number): void {
	const ticks = getAllByDataRole(container, tickRole);

	expect(ticks).toHaveLength(simpleMarks.length);
	ticks.forEach((tick, tickIndex) => {
		expect(tick.className).toContain(tickIndex <= index ? "BarTick--left" : "BarTick--right");
		expect(tick.className).not.toContain(tickIndex <= index ? "BarTick--right" : "BarTick--left");
	});
}

/**
 * Horizontal page coordinate inside the slider box that corresponds to the given mark index.
 * Rendered inside a padded wrapper, so the box never sits at page x = 0.
 */
function clientXForIndex(box: HTMLElement, index: number): number {
	const rect = box.getBoundingClientRect();

	return rect.left + (rect.width * index) / (simpleMarks.length - 1);
}

function pressKey(container: HTMLElement, key: string): void {
	fireEvent.keyDown(getByDataRole(container, boxRole), { key });
}

function startDrag(container: HTMLElement, index: number): HTMLElement {
	const box = getByDataRole(container, boxRole);
	fireEvent.mouseDown(box, { clientX: clientXForIndex(box, index) });

	return getByDataRole(container, backdropRole);
}

function moveDrag(container: HTMLElement, index: number): void {
	const box = getByDataRole(container, boxRole);
	fireEvent.mouseMove(getByDataRole(container, backdropRole), { clientX: clientXForIndex(box, index) });
}

function endDrag(container: HTMLElement): void {
	fireEvent.mouseUp(getByDataRole(container, backdropRole));
}

const Padded = ({ children }: { children: ReactNode }) => (
	<div style={{ padding: "20px 60px", width: "500px" }}>{children}</div>
);

describe("com.mgmtp.a12.widgets.input.slider", () => {
	/* rendering
	 * ----- ----- ----- ----- ----- */
	test("rendering", () => {
		const { container } = render(<Slider marks={simpleMarks} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-with-custom-label-marks", () => {
		const { container } = render(<Slider marks={customLabelMarks} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-error-message", () => {
		const errorMessage = "test";
		const { container } = render(<Slider marks={simpleMarks} error errorMessage={errorMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering--readonly", () => {
		const { container } = render(<Slider marks={simpleMarks} readonly />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering--disabled", () => {
		const { container } = render(<Slider marks={simpleMarks} disabled />);

		expect(container.firstChild).toMatchSnapshot();
	});

	/* keyboard interaction
	 * ----- ----- ----- ----- ----- */

	test("keyboard-interaction", () => {
		let value = "4";
		const onValueChanged = (val: string) => {
			value = val;
		};

		const { container } = render(<Slider marks={simpleMarks} value={value} onChange={onValueChanged} />);

		[
			{ key: ArrowRight, value: "5" },
			{ key: ArrowUp, value: "6" },
			{ key: ArrowLeft, value: "5" },
			{ key: ArrowDown, value: "4" },
			{ key: PageUp, value: "6" },
			{ key: PageDown, value: "1" },
			{ key: Home, value: "1" },
			{ key: End, value: "6" }
		].forEach((setup) => {
			fireEvent.keyDown(getByDataRole(container, `${baseDataRole}-box`), { key: setup.key });

			expect(value).toBe(setup.value);
		});
	});

	test("keyboard-interaction--readonly", () => {
		let value = "4";
		const onValueChanged = (val: string) => {
			value = val;
		};

		const { container } = render(<Slider marks={simpleMarks} value={value} onChange={onValueChanged} readonly />);

		[
			{ key: ArrowRight, value: "4" },
			{ key: ArrowUp, value: "4" },
			{ key: ArrowLeft, value: "4" },
			{ key: ArrowDown, value: "4" },
			{ key: PageUp, value: "4" },
			{ key: PageDown, value: "4" },
			{ key: Home, value: "4" },
			{ key: End, value: "4" }
		].forEach((setup) => {
			fireEvent.keyDown(getByDataRole(container, `${baseDataRole}-box`), { key: setup.key });

			expect(value).toBe(setup.value);
		});
	});

	test("keyboard-interaction--disabled", () => {
		let value = "4";
		const onValueChanged = (val: string) => {
			value = val;
		};

		const { container } = render(<Slider marks={simpleMarks} value={value} onChange={onValueChanged} disabled />);

		[
			{ key: ArrowRight, value: "4" },
			{ key: ArrowUp, value: "4" },
			{ key: ArrowLeft, value: "4" },
			{ key: ArrowDown, value: "4" },
			{ key: PageUp, value: "4" },
			{ key: PageDown, value: "4" },
			{ key: Home, value: "4" },
			{ key: End, value: "4" }
		].forEach((setup) => {
			fireEvent.keyDown(getByDataRole(container, `${baseDataRole}-box`), { key: setup.key });

			expect(value).toBe(setup.value);
		});
	});

	/* rendering -- concrete assertions
	 * ----- ----- ----- ----- ----- */

	test("renders label, error message and side labels", () => {
		const { container } = render(
			<Slider marks={simpleMarks} id="speed" label="Speed" errorMessage="Too fast" leftLabel="Slow" rightLabel="Fast" />
		);

		expect(container.firstElementChild).toHaveAttribute("data-role", baseDataRole);
		expect(container.firstElementChild).toHaveAttribute("id", "speed");
		expect(getByDataRole(container, `${baseDataRole}-label`)).toHaveTextContent("Speed");
		expect(getByDataRole(container, `${baseDataRole}-error-message`)).toMatchTextContent("Too fast");
		expect(container).toMatchTextContent("Slow");
		expect(container).toMatchTextContent("Fast");
	});

	test("does not render error message and side labels when not provided", () => {
		const { container } = render(<Slider marks={simpleMarks} />);

		expect(queryByDataRole(container, `${baseDataRole}-error-message`)).toBeNull();
		expect(queryByDataRole(container, backdropRole)).toBeNull();
		expect(getByDataRole(container, boxRole)).toHaveAttribute("tabindex", "-1");
	});

	test("renders one label and one tick per mark, preferring the mark label over its value", () => {
		const { container } = render(<Slider marks={customLabelMarks} />);

		const labels = getAllByDataRole(container, `${baseDataRole}-bar-label`);
		expect(labels.map((label) => label.textContent)).toEqual(["One", "Two", "Three", "Four", "Five", "Six"]);
		expect(getAllByDataRole(container, tickRole)).toHaveLength(customLabelMarks.length);
	});

	test("fitToParent defaults to true and can be switched off", () => {
		const { container, rerender } = render(<Slider marks={simpleMarks} className="custom" />);

		expect(container.firstElementChild?.className).toContain("field--block");
		expect(container.firstElementChild?.className).toContain("custom");

		rerender(<Slider marks={simpleMarks} className="custom" fitToParent={false} />);

		expect(container.firstElementChild?.className).not.toContain("field--block");
		expect(container.firstElementChild?.className).toContain("custom");
	});

	test("positions the thumb at the mark matching value, and at the first mark without a value", () => {
		const { container, rerender } = render(<Slider marks={simpleMarks} value="4" />);

		expectThumbAtIndex(container, 3);

		rerender(<Slider marks={simpleMarks} />);
		// value removed: thumb re-derives to the first mark
		expectThumbAtIndex(container, 0);
	});

	test("positions the thumb at the first mark for an unknown value", () => {
		const { container } = render(<Slider marks={simpleMarks} value="does-not-exist" />);

		expectThumbAtIndex(container, 0);
	});

	/* prop updates after mount
	 * ----- ----- ----- ----- ----- */

	test("moves the thumb when the value prop changes", () => {
		const { container, rerender } = render(<Slider marks={simpleMarks} value="2" />);

		expectThumbAtIndex(container, 1);

		rerender(<Slider marks={simpleMarks} value="6" />);
		expectThumbAtIndex(container, 5);

		rerender(<Slider marks={simpleMarks} value="1" />);
		expectThumbAtIndex(container, 0);
	});

	test("re-derives the thumb position when the marks change", () => {
		const { container, rerender } = render(<Slider marks={simpleMarks} value="4" />);

		expectThumbAtIndex(container, 3);

		const reversedMarks = [...simpleMarks].reverse();
		rerender(<Slider marks={reversedMarks} value="4" />);

		expectThumbAtIndex(container, 2);
	});

	test("keeps the internally moved thumb when re-rendered with unchanged props", () => {
		const onChange = vi.fn();
		const { container, rerender } = render(<Slider marks={simpleMarks} value="4" onChange={onChange} />);

		pressKey(container, ArrowRight);
		expectThumbAtIndex(container, 4);

		rerender(<Slider marks={simpleMarks} value="4" onChange={onChange} />);

		expectThumbAtIndex(container, 4);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	test("snaps the thumb back to the controlled value when the parent re-renders with a new value", () => {
		const onChange = vi.fn();
		const { container, rerender } = render(<Slider marks={simpleMarks} value="4" onChange={onChange} />);

		pressKey(container, End);
		expectThumbAtIndex(container, 5);
		expect(onChange).toHaveBeenCalledWith("6");

		rerender(<Slider marks={simpleMarks} value="2" onChange={onChange} />);

		expectThumbAtIndex(container, 1);
	});

	test("uses the latest onChange handler after a re-render", () => {
		const firstHandler = vi.fn();
		const secondHandler = vi.fn();
		const { container, rerender } = render(<Slider marks={simpleMarks} value="4" onChange={firstHandler} />);

		rerender(<Slider marks={simpleMarks} value="4" onChange={secondHandler} />);
		pressKey(container, ArrowRight);

		expect(firstHandler).not.toHaveBeenCalled();
		expect(secondHandler).toHaveBeenCalledTimes(1);
		expect(secondHandler).toHaveBeenCalledWith("5");
	});

	test("works without an onChange handler", () => {
		const { container } = render(<Slider marks={simpleMarks} value="4" />);

		pressKey(container, ArrowRight);
		pressKey(container, End);

		expectThumbAtIndex(container, 5);
	});

	/* keyboard interaction -- details
	 * ----- ----- ----- ----- ----- */

	test("calls onChange exactly once per key press with the new value", () => {
		const onChange = vi.fn();
		const { container } = render(<Slider marks={simpleMarks} value="3" onChange={onChange} />);

		pressKey(container, ArrowRight);
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith("4");
		expectThumbAtIndex(container, 3);

		pressKey(container, ArrowLeft);
		expect(onChange).toHaveBeenCalledTimes(2);
		expect(onChange).toHaveBeenLastCalledWith("3");
		expectThumbAtIndex(container, 2);

		pressKey(container, Home);
		expect(onChange).toHaveBeenCalledTimes(3);
		expect(onChange).toHaveBeenLastCalledWith("1");
		expectThumbAtIndex(container, 0);
	});

	test("clamps at the first and last mark without firing onChange", () => {
		const onChange = vi.fn();
		const { container } = render(<Slider marks={simpleMarks} value="1" onChange={onChange} />);

		pressKey(container, ArrowLeft);
		pressKey(container, ArrowDown);
		pressKey(container, PageDown);
		expect(onChange).not.toHaveBeenCalled();
		expectThumbAtIndex(container, 0);

		pressKey(container, End);
		expect(onChange).toHaveBeenCalledTimes(1);
		expectThumbAtIndex(container, 5);

		pressKey(container, ArrowRight);
		pressKey(container, ArrowUp);
		pressKey(container, PageUp);
		expect(onChange).toHaveBeenCalledTimes(1);
		expectThumbAtIndex(container, 5);
	});

	test("PageUp and PageDown clamp to the last and first mark", () => {
		const onChange = vi.fn();
		const { container } = render(<Slider marks={simpleMarks} value="2" onChange={onChange} />);

		pressKey(container, PageUp);
		expect(onChange).toHaveBeenLastCalledWith("6");
		expectThumbAtIndex(container, 5);

		pressKey(container, ArrowLeft);
		expect(onChange).toHaveBeenLastCalledWith("5");

		pressKey(container, PageDown);
		expect(onChange).toHaveBeenLastCalledWith("1");
		expectThumbAtIndex(container, 0);
		expect(onChange).toHaveBeenCalledTimes(3);
	});

	test("does not move onto a disabled mark", () => {
		const onChange = vi.fn();
		const marksWithDisabled: SliderMark[] = simpleMarks.map((mark) =>
			mark.value === "5" ? { ...mark, disabled: true } : mark
		);
		const { container } = render(<Slider marks={marksWithDisabled} value="4" onChange={onChange} />);

		pressKey(container, ArrowRight);

		expect(onChange).not.toHaveBeenCalled();
		expectThumbAtIndex(container, 3);

		pressKey(container, ArrowLeft);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("3");
		expectThumbAtIndex(container, 2);
	});

	test("ignores unrelated keys", () => {
		const onChange = vi.fn();
		const { container } = render(<Slider marks={simpleMarks} value="4" onChange={onChange} />);

		pressKey(container, "a");
		pressKey(container, Key.Enter);
		pressKey(container, Key.Tab);

		expect(onChange).not.toHaveBeenCalled();
		expectThumbAtIndex(container, 3);
	});

	test("disabled: thumb stays in place on key press", () => {
		const onChange = vi.fn();
		const { container } = render(<Slider marks={simpleMarks} value="4" onChange={onChange} disabled />);

		pressKey(container, ArrowRight);
		pressKey(container, End);

		expect(onChange).not.toHaveBeenCalled();
		expectThumbAtIndex(container, 3);
	});

	/* mouse interaction
	 * ----- ----- ----- ----- ----- */

	test("mouse down focuses the slider box and opens the drag backdrop", () => {
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" />
			</Padded>
		);
		const box = getByDataRole(container, boxRole);

		expect(box).not.toHaveFocus();
		expect(queryByDataRole(container, backdropRole)).toBeNull();

		startDrag(container, 3);

		expect(box).toHaveFocus();
		expect(getByDataRole(container, backdropRole)).toBeInTheDocument();
	});

	test("mouse down moves the thumb without firing onChange; mouse up fires it once", () => {
		const onChange = vi.fn();
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={onChange} />
			</Padded>
		);

		startDrag(container, 1);
		expectThumbAtIndex(container, 1);
		expect(onChange).not.toHaveBeenCalled();

		endDrag(container);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("2");
		expect(queryByDataRole(container, backdropRole)).toBeNull();
		expectThumbAtIndex(container, 1);
	});

	test("dragging follows the pointer and reports only the final value", () => {
		const onChange = vi.fn();
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="1" onChange={onChange} />
			</Padded>
		);

		startDrag(container, 0);
		moveDrag(container, 2);
		expectThumbAtIndex(container, 2);
		moveDrag(container, 4);
		expectThumbAtIndex(container, 4);
		moveDrag(container, 5);
		expectThumbAtIndex(container, 5);
		expect(onChange).not.toHaveBeenCalled();

		endDrag(container);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("6");
	});

	test("releasing the mouse on the original mark does not fire onChange", () => {
		const onChange = vi.fn();
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={onChange} />
			</Padded>
		);

		startDrag(container, 3);
		moveDrag(container, 5);
		moveDrag(container, 3);
		endDrag(container);

		expect(onChange).not.toHaveBeenCalled();
		expectThumbAtIndex(container, 3);
	});

	test("dragging skips disabled marks", () => {
		const onChange = vi.fn();
		const marksWithDisabled: SliderMark[] = simpleMarks.map((mark) =>
			mark.value === "3" ? { ...mark, disabled: true } : mark
		);
		const { container } = render(
			<Padded>
				<Slider marks={marksWithDisabled} value="1" onChange={onChange} />
			</Padded>
		);

		startDrag(container, 2);
		expectThumbAtIndex(container, 0);

		moveDrag(container, 3);
		expectThumbAtIndex(container, 3);

		endDrag(container);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("4");
	});

	test("keeps the slider box focused while dragging", () => {
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" />
			</Padded>
		);
		const box = getByDataRole(container, boxRole);

		startDrag(container, 3);
		expect(box).toHaveFocus();

		box.blur();
		expect(box).not.toHaveFocus();

		moveDrag(container, 4);

		expect(box).toHaveFocus();
	});

	test("Escape while dragging restores the previous position without firing onChange", () => {
		const onChange = vi.fn();
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={onChange} />
			</Padded>
		);

		startDrag(container, 5);
		expectThumbAtIndex(container, 5);

		pressKey(container, Escape);

		expectThumbAtIndex(container, 3);
		expect(queryByDataRole(container, backdropRole)).toBeNull();
		expect(onChange).not.toHaveBeenCalled();
	});

	test("uses the latest onChange handler when the mouse is released", () => {
		const firstHandler = vi.fn();
		const secondHandler = vi.fn();
		const { container, rerender } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={firstHandler} />
			</Padded>
		);

		startDrag(container, 5);
		rerender(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={secondHandler} />
			</Padded>
		);
		endDrag(container);

		expect(firstHandler).not.toHaveBeenCalled();
		expect(secondHandler).toHaveBeenCalledTimes(1);
		expect(secondHandler).toHaveBeenCalledWith("6");
	});

	test("a value change during a drag ends the drag and moves the thumb to the new value", () => {
		const onChange = vi.fn();
		const { container, rerender } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={onChange} />
			</Padded>
		);

		startDrag(container, 5);
		expect(getByDataRole(container, backdropRole)).toBeInTheDocument();

		rerender(
			<Padded>
				<Slider marks={simpleMarks} value="2" onChange={onChange} />
			</Padded>
		);

		expect(queryByDataRole(container, backdropRole)).toBeNull();
		expectThumbAtIndex(container, 1);
		expect(onChange).not.toHaveBeenCalled();
	});

	test("unmounting during a drag leaves no active listeners behind", () => {
		const onChange = vi.fn();
		const { container, unmount } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={onChange} />
			</Padded>
		);

		startDrag(container, 5);
		unmount();

		expect(() => {
			fireEvent.mouseMove(document.body, { clientX: 10 });
			fireEvent.mouseUp(document.body, { clientX: 10 });
			fireEvent.keyDown(document.body, { key: Escape });
		}).not.toThrow();
		expect(onChange).not.toHaveBeenCalled();
		expect(document.body.querySelector(`[data-role="${backdropRole}"]`)).toBeNull();
	});

	test("disabled: mouse down neither focuses nor starts a drag", () => {
		const onChange = vi.fn();
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={onChange} disabled />
			</Padded>
		);
		const box = getByDataRole(container, boxRole);

		fireEvent.mouseDown(box, { clientX: clientXForIndex(box, 5) });

		expect(box).not.toHaveFocus();
		expect(queryByDataRole(container, backdropRole)).toBeNull();
		expect(onChange).not.toHaveBeenCalled();
		expectThumbAtIndex(container, 3);
	});

	test("readonly: mouse down neither focuses nor starts a drag", () => {
		const onChange = vi.fn();
		const { container } = render(
			<Padded>
				<Slider marks={simpleMarks} value="4" onChange={onChange} readonly />
			</Padded>
		);
		const box = getByDataRole(container, boxRole);

		fireEvent.mouseDown(box, { clientX: clientXForIndex(box, 5) });

		expect(box).not.toHaveFocus();
		expect(queryByDataRole(container, backdropRole)).toBeNull();
		expect(onChange).not.toHaveBeenCalled();
		expectThumbAtIndex(container, 3);
	});
});
