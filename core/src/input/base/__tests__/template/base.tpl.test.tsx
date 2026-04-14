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

import { render, fireEvent, getByDataRole } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { Error, Warning, Info, Label, SelectionSuffix } from "../../template/base.tpl.view.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

describe("com.mgmtp.a12.widgets.input.base.label", () => {
	test("render basic label", () => {
		const { container } = render(
			<Label id="test-id" label="Test Label" htmlFor="test-1" className="test-class" style={{ color: "black" }} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled label", () => {
		const { container } = render(
			<Label
				disabled
				id="test-id"
				label="Test Label"
				htmlFor="test-2"
				className="test-class"
				style={{ color: "black" }}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render hidden label", () => {
		const { container } = render(
			<Label hide id="test-id" label="Test Label" htmlFor="test-3" className="test-class" style={{ color: "black" }} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("label events", () => {
		const onKeyDownSpy = vi.fn();
		const onClickSpy = vi.fn();
		const wrapperRefSpy = vi.fn();

		const { getByText } = render(
			<Label
				label="Test Label"
				htmlFor="test-4"
				onClick={onClickSpy}
				onKeyDown={onKeyDownSpy}
				wrapperRef={wrapperRefSpy}
			/>
		);

		const labelWrapper = getByText(/test label/i);
		fireEvent.keyDown(labelWrapper);
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(labelWrapper);
		expect(onClickSpy).toHaveBeenCalledTimes(1);

		expect(wrapperRefSpy).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.input.base.warning.error.and.info", () => {
	test("render basic error", () => {
		const { container } = render(
			<Error id="test-id" errorMessage="Test Error" className="test-class" style={{ color: "red" }} />
		);
		const errorMessage = getByDataRole(container, DataRoles.Error.Text);

		expect(container.firstChild).toMatchSnapshot();
		expect(errorMessage.textContent).toEqual("Test Error");
	});

	test("render basic warning", () => {
		const { container } = render(
			<Warning id="test-id" warningMessage="Test Warning" className="test-class" style={{ color: "orange" }} />
		);
		const warningMessage = getByDataRole(container, DataRoles.Warning.Text);

		expect(container.firstChild).toMatchSnapshot();
		expect(warningMessage.textContent).toEqual("Test Warning");
	});

	test("render basic info", () => {
		const { container } = render(<Info id="test-id" infoMessage="Test Info" className="test-class" />);
		const infoMessage = getByDataRole(container, DataRoles.Info.Text);

		expect(container.firstChild).toMatchSnapshot();
		expect(infoMessage.textContent).toEqual("Test Info");
	});

	test("simulate error wrapper ref", () => {
		const wrapperRefSpy = vi.fn();

		render(<Error id="test-id" errorMessage="Test Error" className="test-class" wrapperRef={wrapperRefSpy} />);

		expect(wrapperRefSpy).toHaveBeenCalledTimes(1);
	});

	test("simulate warning wrapper ref", () => {
		const wrapperRefSpy = vi.fn();

		render(<Warning id="test-id" warningMessage="Test Warning" className="test-class" wrapperRef={wrapperRefSpy} />);

		expect(wrapperRefSpy).toHaveBeenCalledTimes(1);
	});

	test("simulate info wrapper ref", () => {
		const wrapperRefSpy = vi.fn();

		render(<Info id="test-id" infoMessage="Test Info" className="test-class" wrapperRef={wrapperRefSpy} />);

		expect(wrapperRefSpy).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.input.base.selection.suffix", () => {
	test("render basic selection-suffix", () => {
		const { container } = render(<SelectionSuffix id="test-id" className="test-class" style={{ color: "red" }} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled selection-suffix", () => {
		const { container } = render(<SelectionSuffix id="test-id" className="test-class" disabled />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate onClick selection-suffix", () => {
		const onClickSpy = vi.fn();

		const { container } = render(<SelectionSuffix id="test-id" className="test-class" onClick={onClickSpy} />);
		const suffixWrapper = getByDataRole(container, DataRoles.SelectionSuffix);
		fireEvent.click(suffixWrapper);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});
});
