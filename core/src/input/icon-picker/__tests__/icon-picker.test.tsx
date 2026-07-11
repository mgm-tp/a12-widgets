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
import { useState } from "react";
import { Key } from "ts-key-enum";
import { render, fireEvent, getByDataRole, getAllByDataRole, queryByDataRole, waitFor } from "test-utils";
import { describe, test, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { isNotFullyOverlapped, noop } from "../../../common/main/utils.js";
import { HintTooltip } from "../../../tooltip/hint/main/hint.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { IconPickerProps } from "../main/icon-picker.api.js";
import { IconPicker } from "../main/icon-picker.view.js";

const properties = {
	id: "icon-picker",
	label: "Basic Icon Picker",
	placeholder: "Icon Picker Placeholder",
	suffixes: "testSuffixes",
	tooltips: <HintTooltip text="test tooltip" />,
	errorMessage: "Error message",
	warningMessage: "Warning message",
	ariaDescribedby: "warning-tooltip",
	helperText: "Helper text"
};

describe("com.mgmtp.a12.widgets.icon-picker", () => {
	test("render basic icon-picker", async () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render basic icon-picker with selected icon", async () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				selectedIcon={{
					label: "edit"
				}}
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render saving-space-mode icon-picker", async () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				saveSpaceMode
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render icon-picker with placeholder", () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				placeholder={properties.placeholder}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render icon-picker with tooltips", () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				placeholder={properties.placeholder}
				tooltips={properties.tooltips}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render icon-picker with addonAfter", () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				placeholder={properties.placeholder}
				addonAfter={properties.tooltips}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly icon-picker", async () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				readonly
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);

		await waitFor(() => {
			expect(container.firstElementChild?.children).toHaveLength(1);
		});
	});

	test("render disabled icon-picker", async () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				disabled
			/>
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);

		await waitFor(() => {
			expect(container.firstElementChild?.children).toHaveLength(1);
		});
	});

	test("render error icon-picker", () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				error
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render warning icon-picker", () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				warning
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render icon-picker with error message", () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				errorMessage={properties.errorMessage}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render icon-picker with warning message", () => {
		const { container } = render(
			<IconPicker
				onChange={noop}
				id={properties.id}
				label={properties.label}
				helperText={properties.helperText}
				ariaDescribedby={properties.ariaDescribedby}
				warningMessage={properties.warningMessage}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("focus input without opening the list", async () => {
		const { container } = render(<IconPicker onChange={noop} id={properties.id} openOnFocus={false} />);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		fireEvent.focus(input);

		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();

		fireEvent.keyDown(input, { key: Key.Enter });

		expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();
	});

	test("icon-picker events", async () => {
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();
		const onChangeSpy = vi.fn();
		const onIconClickSpy = vi.fn();

		const { container } = render(
			<IconPicker onIconClick={onIconClickSpy} onChange={onChangeSpy} onFocus={onFocusSpy} onBlur={onBlurSpy} />
		);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		fireEvent.focus(input);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(input);

		expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();

		fireEvent.keyDown(input, { key: Key.ArrowRight });
		fireEvent.keyDown(input, { key: Key.Enter });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);

		fireEvent.click(input);

		expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();

		const dropdownItems = getAllByDataRole(container, DataRoles.Dropdown.Item);

		fireEvent.click(dropdownItems[1]);

		await waitFor(() => {
			expect(queryByDataRole(container, DataRoles.AttachedPortal)).not.toBeInTheDocument();
			expect(onIconClickSpy).toHaveBeenCalledTimes(2);
			expect(onChangeSpy).toHaveBeenCalledTimes(2);
		});
	});

	test("should show the icon picker dropdown when touch to input on mobile viewport", async () => {
		const IconPickerExample = (): ReactNode => {
			const [selectedIcon, setSelectedIcon] = useState<IconPickerProps.Icon | undefined>();

			return (
				<IconPicker
					id="basic-icon-picker"
					label="Basic"
					placeholder="Type an icon or select one"
					hintTemplate="{count} of {total} icons shown"
					onChange={setSelectedIcon}
					selectedIcon={selectedIcon}
				/>
			);
		};

		const { container } = render(<IconPickerExample />);

		const input = getByDataRole(container, DataRoles.TextField.Input);
		expect(input).toBeTruthy();

		fireEvent.click(input);

		// Simulate mobile keyboard appearing by dispatching a resize event
		input.scrollIntoView({ block: "center", behavior: "auto" });
		window.dispatchEvent(new Event("resize"));

		await waitFor(() => {
			expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy();
		});
	});
});

describe("com.mgmtp.a12.widgets.icon-picker.dropdown", () => {
	test("Should keep dropdown above the input and prevent overlap when having limited bottom space for dropdown", async () => {
		await page.viewport(980, 726);

		const { container } = render(
			<div
				style={{
					height: "100vh",
					overflow: "hidden",
					boxSizing: "border-box",
					background: "yellow"
				}}
			>
				{/* Creates limited bottom space so the dropdown should be positioned above the input. */}
				<div style={{ height: "620px", background: "gray" }} />

				<div className="-u-width-full">
					<IconPicker
						id="basic-icon-picker"
						label="Basic"
						placeholder="Type an icon or select one"
						hintTemplate="{count} of {total} icons shown"
						onChange={noop}
					/>
				</div>
			</div>
		);

		const input = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		// Open the dropdown by clicking on the input.
		await userEvent.click(page.elementLocator(input));

		// Type into the already focused input to trigger filtering and dropdown repositioning.
		await userEvent.keyboard("v");

		await waitFor(() => {
			// Verify the input is not overlapped after the search result list changes.
			expect(isNotFullyOverlapped(input)).toBeTruthy();
		});
	});
});
