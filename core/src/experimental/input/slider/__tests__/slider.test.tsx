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

import { Key } from "ts-key-enum";
import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect } from "vitest";

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
			fireEvent.keyDown(getByDataRole(container, `${baseDataRole}-box`), {
				key: setup.key,
				preventDefault: () => {}
			});

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
			fireEvent.keyDown(getByDataRole(container, `${baseDataRole}-box`), {
				key: setup.key,
				preventDefault: () => {}
			});

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
			fireEvent.keyDown(getByDataRole(container, `${baseDataRole}-box`), {
				key: setup.key,
				preventDefault: () => {}
			});

			expect(value).toBe(setup.value);
		});
	});
});
