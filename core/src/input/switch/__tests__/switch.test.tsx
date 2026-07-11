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
import { describe, vi, expect, test } from "vitest";

import { noop } from "../../../common/main/utils.js";
import { HintTooltip } from "../../../tooltip/hint/main/hint.view.js";
import { DataRoles } from "../../../common/index.js";

import { Switch } from "../main/switch.view.js";

const properties = {
	ariaDescribedby: "test-ariaDescribedby",
	errorMessage: "error",
	helperText: "helperText",
	hint: <HintTooltip text="this is a hint" key="hint" />,
	id: "test-id",
	label: "test label",
	checkedOption: "on",
	uncheckedOption: "off",
	warningMessage: "warning",
	infoMessage: "info"
};

describe("com.mgmtp.a12.widgets.switch", () => {
	test("render basic switch", () => {
		const { container } = render(
			<Switch
				onChange={noop}
				id={properties.id}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				label={properties.label}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();

		const switchInput = getByDataRole(container, "switch-input");
		fireEvent.mouseOver(switchInput);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render checked switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} checked />);
		expect(container.firstChild).toMatchSnapshot();

		const switchInput = getByDataRole(container, "switch-input");
		fireEvent.mouseOver(switchInput);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render options switch", () => {
		const { container } = render(
			<Switch
				onChange={noop}
				id={properties.id}
				checkedOption={properties.checkedOption}
				uncheckedOption={properties.uncheckedOption}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render hide-options switch", () => {
		const { container } = render(
			<Switch
				onChange={noop}
				id={properties.id}
				checkedOption={properties.checkedOption}
				uncheckedOption={properties.uncheckedOption}
				hideOptions
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render info switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} info />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render info checked switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} info checked />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render info-message switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} infoMessage={properties.infoMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render error switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} error />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render error checked switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} error checked />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render error-message switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} errorMessage={properties.errorMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render warning switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} warning />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render warning checked switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} warning checked />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render warning-message switch", () => {
		const { container } = render(
			<Switch onChange={noop} id={properties.id} warningMessage={properties.warningMessage} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly checked switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} readonly checked />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled checked switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} disabled checked />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render switch with addon after", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} addonAfter={properties.hint} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render switch with tooltips", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} tooltips={properties.hint} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render auto-width switch", () => {
		const { container } = render(<Switch onChange={noop} id={properties.id} fitToParent={false} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("switch events", () => {
		const onFocusSpy = vi.fn();
		const onChangeSpy = vi.fn();
		const onBlurSpy = vi.fn();

		const { container } = render(<Switch onChange={onChangeSpy} onFocus={onFocusSpy} onBlur={onBlurSpy} />);

		const switchInput = getByDataRole(container, "switch-input");

		fireEvent.focus(switchInput);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(switchInput);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(switchInput, { currentTarget: { checked: true } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
	});

	describe("switch with", () => {
		test("renders default icons when `uncheckedIcon` and `checkedIcon` are not provided", () => {
			const { getByDataRole, rerender } = render(<Switch onChange={noop} checked />);
			const thumbIcon = getByDataRole(DataRoles.Switch.ThumbIcon);
			expect(thumbIcon.textContent).toBe("check");

			rerender(<Switch onChange={noop} checked={false} />);
			expect(thumbIcon.textContent).toBe("remove");
		});

		test("renders custom icons when `checkedIcon` and `uncheckedIcon` are provided", () => {
			const { getByDataRole, rerender } = render(
				<Switch onChange={noop} checked={false} checkedIcon={<span>ON</span>} uncheckedIcon={<span>OFF</span>} />
			);
			const thumbIcon = getByDataRole(DataRoles.Switch.ThumbIcon);
			expect(thumbIcon.textContent).toBe("OFF");

			rerender(<Switch onChange={noop} checked checkedIcon={<span>ON</span>} uncheckedIcon={<span>OFF</span>} />);
			expect(thumbIcon.textContent).toBe("ON");
		});
	});

	describe("switch with label position", () => {
		test("switch with label position top", () => {
			const { getByDataRole, queryByDataRole } = render(
				<Switch labelPosition="top" onChange={noop} id={properties.id} label={properties.label} />
			);

			const label = getByDataRole(DataRoles.Switch.Label);
			const control = getByDataRole(DataRoles.Switch.Control);

			expect(label).toBeTruthy();
			expect(queryByDataRole(DataRoles.Switch.InlineWrapper)).toBeNull();
			expect(control.previousElementSibling).toBe(label);
		});

		test("switch with label position left", () => {
			const { getByDataRole } = render(
				<Switch labelPosition="left" onChange={noop} id={properties.id} label={properties.label} />
			);

			const label = getByDataRole(DataRoles.Switch.Label);
			const control = getByDataRole(DataRoles.Switch.Control);
			const inlineWrapper = getByDataRole(DataRoles.Switch.InlineWrapper);

			expect(label).toBeTruthy();
			expect(inlineWrapper).toBeTruthy();
			expect(control.previousElementSibling).toBe(label);
		});

		test("switch with label position right", () => {
			const { getByDataRole } = render(
				<Switch labelPosition="right" onChange={noop} id={properties.id} label={properties.label} />
			);

			const label = getByDataRole(DataRoles.Switch.Label);
			const control = getByDataRole(DataRoles.Switch.Control);
			const inlineWrapper = getByDataRole(DataRoles.Switch.InlineWrapper);

			expect(label).toBeTruthy();
			expect(inlineWrapper).toBeTruthy();
			expect(label.previousElementSibling).toBe(control);
		});

		test("switch with label position bottom", () => {
			const { getByDataRole, queryByDataRole } = render(
				<Switch labelPosition="bottom" onChange={noop} id={properties.id} label={properties.label} />
			);

			const label = getByDataRole(DataRoles.Switch.Label);
			const control = getByDataRole(DataRoles.Switch.Control);

			expect(label).toBeTruthy();
			expect(queryByDataRole(DataRoles.Switch.InlineWrapper)).toBeNull();
			expect(label.previousElementSibling).toBe(control);
		});
	});
});
