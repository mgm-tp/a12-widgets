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

/**
 * The deprecated `DefaultAutocomplete` / `MobileAutocomplete` shims must keep selecting the
 * presentation their class predecessors hardcoded, so projects that still import them do not
 * silently change behavior.
 */

import { getAllByDataRole, getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import { DefaultAutocomplete, MobileAutocomplete } from "../main/autocomplete.compat.view.js";

import { cityItems } from "./data.js";

const baseProps = {
	id: "ac",
	label: "City",
	items: cityItems,
	hintTemplate: "{count} of {total} options shown",
	onValueChange: noop
} as const;

/**
 * The dialog is queried by the overlay's own role rather than one of the Autocomplete's: every part of
 * it is a composed widget that already carries a role, and overriding those would take the standard
 * role away from consumers.
 */
const queryDialog = (): HTMLElement | null => queryByDataRole(document.body, DataRoles.Modal.Overlay);

/** The field in the page, which is the text input that is not inside the dialog. */
const getTrigger = (container: HTMLElement): HTMLElement => {
	const dialog = queryDialog();

	return getAllByDataRole(container, DataRoles.TextField.Input).find((field) => !dialog?.contains(field))!;
};

describe("Deprecated Autocomplete shims", () => {
	test("DefaultAutocomplete always attaches the dropdown to the field", async () => {
		const { container } = render(<DefaultAutocomplete {...baseProps} />);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy());
		expect(queryDialog()).toBeNull();
	});

	test("MobileAutocomplete always opens the fullscreen dialog", async () => {
		const { container } = render(<MobileAutocomplete {...baseProps} />);
		const trigger = getTrigger(container);

		expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

		await userEvent.click(trigger);

		await waitFor(() => expect(queryDialog()).not.toBeNull());
		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeNull();
	});

	test("an explicit mobileModal still wins over the shim's default", async () => {
		const { container } = render(<MobileAutocomplete {...baseProps} mobileModal={false} />);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => expect(getByDataRole(container, DataRoles.AttachedPortal)).toBeTruthy());
		expect(queryDialog()).toBeNull();
	});

	test("the shims forward props and selection to the underlying Autocomplete", async () => {
		const onValueChange = vi.fn();
		const { container } = render(
			<DefaultAutocomplete {...baseProps} initialValue={cityItems[1]} onValueChange={onValueChange} />
		);
		const input = getByDataRole(container, DataRoles.TextField.Input) as HTMLInputElement;

		expect(input.value).toBe(cityItems[1]);

		await userEvent.click(input);
		await waitFor(() => expect(document.querySelectorAll('[role="option"]').length).toBeGreaterThan(1));
		await userEvent.click(document.querySelectorAll('[role="option"]')[0] as HTMLElement);

		await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
	});
});
