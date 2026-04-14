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

import { noop } from "../../../common/main/utils.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { Checkbox } from "../main/checkbox.view.js";

describe("com.mgmtp.a12.widgets.checkbox", () => {
	test("render basic checkbox with label", () => {
		const { container } = render(<Checkbox id="testId" checked={false} onChange={noop} label="Test checkbox" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render basic checked checkbox", () => {
		const { container } = render(<Checkbox id="testId" checked={true} onChange={noop} />);
		const checkbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkbox).toHaveAttribute("checked");
		expect(checkbox).toMatchSnapshot();
	});

	test("render warning checkbox", () => {
		const { container } = render(<Checkbox warning id="testId" checked={false} onChange={noop} />);
		const warningCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(warningCheckbox).toMatchSnapshot();
	});

	test("render error checkbox", () => {
		const { container } = render(<Checkbox error id="testId" checked={false} onChange={noop} />);
		const errorCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(errorCheckbox).toMatchSnapshot();
	});

	test("render info checkbox", () => {
		const { container } = render(<Checkbox info id="testId" checked={false} onChange={noop} />);
		const infoCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(infoCheckbox).toMatchSnapshot();
	});

	test("render readonly checkbox", () => {
		const { container } = render(<Checkbox readonly id="testId" checked={false} onChange={noop} />);
		const readOnlyCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(readOnlyCheckbox).toHaveAttribute("disabled");
		expect(readOnlyCheckbox).toMatchSnapshot();
	});

	test("render disabled checkbox", () => {
		const { container } = render(<Checkbox disabled id="testId" checked={false} onChange={noop} />);
		const disabledCheckbox = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(disabledCheckbox).toHaveAttribute("disabled");
		expect(disabledCheckbox).toMatchSnapshot();
	});

	test("render readonly & checked checkbox", () => {
		const { container } = render(<Checkbox readonly id="testId" checked={true} onChange={noop} />);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(checkboxInput).toHaveAttribute("checked");
		expect(checkboxInput).toMatchSnapshot();
	});

	test("render disabled & checked checkbox", () => {
		const { container } = render(<Checkbox disabled id="testId" checked={true} onChange={noop} />);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(checkboxInput).toHaveAttribute("checked");
		expect(checkboxInput).toMatchSnapshot();
	});

	test("checkbox with hideLabel", () => {
		const { container } = render(
			<Checkbox hideLabel label="Test checkbox" id="testId" checked={false} onChange={noop} />
		);
		const label = getByDataRole(container, DataRoles.Checkbox.Label);

		expect(label).toHaveClass("-u-unseenButRead");
	});

	test("checkbox with helper-text", () => {
		const { container } = render(<Checkbox id="testId" checked={false} onChange={noop} helperText="helper-text" />);
		const helperText = getByDataRole(container, DataRoles.Checkbox.HelperText);

		expect(helperText).toBeTruthy();
	});

	test("checkbox with label graphic", () => {
		const { container } = render(
			<Checkbox
				id="checkbox-with-labelGraphic"
				checked={false}
				onChange={noop}
				label="Checkbox with label graphic"
				labelGraphic={<Icon>info</Icon>}
			/>
		);
		const labelGraphic = getByDataRole(container, DataRoles.Label.Graphic);

		expect(labelGraphic).toBeTruthy();
	});

	test("checkbox with warning message", () => {
		const { container } = render(<Checkbox warningMessage="warning" id="testId" checked={false} onChange={noop} />);
		const warningMessage = getByDataRole(container, DataRoles.Checkbox.WarningMessage);

		expect(warningMessage).toBeTruthy();
	});

	test("checkbox with error message", () => {
		const { container } = render(<Checkbox errorMessage="error" id="testId" checked={false} onChange={noop} />);
		const errorMessage = getByDataRole(container, DataRoles.Checkbox.ErrorMessage);

		expect(errorMessage).toBeTruthy();
	});

	test("checkbox with info message", () => {
		const { container } = render(<Checkbox infoMessage="info" id="testId" checked={false} onChange={noop} />);
		const infoMessage = getByDataRole(container, DataRoles.Checkbox.InfoMessage);

		expect(infoMessage).toBeTruthy();
	});

	test("checkbox events", () => {
		const onBlurSpy = vi.fn();
		const onChangeSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onClickSpy = vi.fn();

		const { container } = render(
			<Checkbox
				id="testId"
				inputProps={{ onClick: onClickSpy }}
				checked={false}
				onChange={onChangeSpy}
				onBlur={onBlurSpy}
				onFocus={onFocusSpy}
				label="Test checkbox"
			/>
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		fireEvent.focus(checkboxInput);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(checkboxInput);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(checkboxInput, { currentTarget: { checked: true } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.indeterminate.checkbox", () => {
	test("render basic indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate id="testId" checked={false} onChange={noop} label="Test checkbox" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render mixed indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate id="testId" checked="mixed" onChange={noop} label="Test checkbox" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checked indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate id="testId" checked={true} onChange={noop} label="Test checkbox" />
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("aria-checked", "true");
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate disabled id="testId" checked="mixed" onChange={noop} label="Test checkbox" />
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readOnly indeterminate checkbox", () => {
		const { container } = render(
			<Checkbox.Indeterminate readonly id="testId" checked="mixed" onChange={noop} label="Test checkbox" />
		);
		const checkboxInput = getByDataRole(container, DataRoles.Checkbox.Input);

		expect(checkboxInput).toHaveAttribute("disabled");
		expect(container.firstChild).toMatchSnapshot();
	});

	test("indeterminate checkbox events", () => {
		const onBlurSpy = vi.fn();
		const onChangeSpy = vi.fn();
		const onFocusSpy = vi.fn();

		const { container } = render(
			<Checkbox.Indeterminate
				id="testId"
				checked="mixed"
				onChange={onChangeSpy}
				onBlur={onBlurSpy}
				onFocus={onFocusSpy}
				label="Test checkbox"
			/>
		);
		const checkboxButton = getByDataRole(container, DataRoles.Checkbox.Input);

		fireEvent.focus(checkboxButton);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(checkboxButton);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(checkboxButton, { currentTarget: { checked: true } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
	});
});
