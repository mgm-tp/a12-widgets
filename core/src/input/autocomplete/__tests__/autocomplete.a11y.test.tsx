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
 * Locks the WAI-ARIA APG "combobox with listbox popup" contract for the Autocomplete so the
 * per-browser/per-screen-reader hacks that the rewrite removed cannot silently creep back in.
 */

import { getAllByDataRole, getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { noop } from "../../../common/main/utils.js";
import { Autocomplete } from "../main/autocomplete.view.js";

import { cityItems } from "./data.js";

const baseProps = {
	id: "ac",
	label: "City",
	items: cityItems,
	hintTemplate: "{count} of {total} options shown",
	onValueChange: noop
} as const;

describe("Autocomplete accessibility (APG combobox contract)", () => {
	test("input is an APG combobox with the expected static attributes", () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		expect(input).toHaveAttribute("role", "combobox");
		expect(input).toHaveAttribute("aria-haspopup", "listbox");
		expect(input).toHaveAttribute("aria-autocomplete", "both");
		expect(input).toHaveAttribute("aria-expanded", "false");
		// Must NOT carry the OS-specific aria-hidden/aria-label hacks, nor own the list: an `<input>` is a
		// leaf in the accessibility tree and can own nothing. The field wrapper owns it — see below.
		expect(input).not.toHaveAttribute("aria-owns");
		expect(input).not.toHaveAttribute("aria-hidden");
		expect(input).not.toHaveAttribute("aria-label");
	});

	test("aria-expanded and aria-controls track the popup state", async () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		await userEvent.click(input);

		await waitFor(() => {
			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", "ac-dropdown");
		});
	});

	test("renders a polite live region for result announcements", () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const liveRegion = getByDataRole(container, DataRoles.Autocomplete.LiveRegion);

		expect(liveRegion).toHaveAttribute("aria-live", "polite");
		expect(liveRegion).toHaveAttribute("aria-atomic", "true");
	});

	test("the live region announces the result count once the list opens", async () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		const liveRegion = getByDataRole(container, DataRoles.Autocomplete.LiveRegion);

		// Nothing is announced while the list is closed, so opening it is what makes the count new.
		expect(liveRegion).toBeEmptyDOMElement();

		await userEvent.click(input);

		await waitFor(() => {
			expect(liveRegion).toHaveTextContent(`${cityItems.length} of ${cityItems.length} options shown`);
		});
	});

	test("the live region re-announces the count as typing narrows the list", async () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		const liveRegion = getByDataRole(container, DataRoles.Autocomplete.LiveRegion);

		await userEvent.click(input);
		await userEvent.type(input, "Lond");

		await waitFor(() => {
			expect(liveRegion).toHaveTextContent(`1 of ${cityItems.length} options shown`);
		});
	});

	test("the live region empties when the list closes, so a re-open announces afresh", async () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);
		const liveRegion = getByDataRole(container, DataRoles.Autocomplete.LiveRegion);

		await userEvent.click(input);
		await waitFor(() => {
			expect(liveRegion).not.toBeEmptyDOMElement();
		});

		await userEvent.keyboard("{Escape}");

		await waitFor(() => {
			expect(liveRegion).toBeEmptyDOMElement();
		});
	});

	// An empty `hintTemplate` is how the hint is turned off; the prop itself is required.
	test("without a hint there is nothing for the live region to announce", async () => {
		const { container } = render(<Autocomplete {...baseProps} hintTemplate="" />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		await userEvent.click(input);
		await waitFor(() => {
			expect(getAllByDataRole(container, DataRoles.Dropdown.Item).length).toBeGreaterThan(0);
		});

		expect(getByDataRole(container, DataRoles.Autocomplete.LiveRegion)).toBeEmptyDOMElement();
	});

	test("aria-activedescendant points at the highlighted option while navigating", async () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const input = getByDataRole(container, DataRoles.TextField.Input);

		await userEvent.click(input);
		await userEvent.keyboard("{ArrowDown}");

		await waitFor(() => {
			const activeId = input.getAttribute("aria-activedescendant");
			expect(activeId).toBeTruthy();
			expect(document.getElementById(activeId as string)).toHaveAttribute("role", "option");
		});
	});

	// `ariaLabelledby` is deprecated in favor of `ariaDescribedby`, but callers that have not migrated
	// must keep working — the prop was never removed.
	test("deprecated ariaLabelledby still labels the listbox when ariaDescribedby is absent", async () => {
		const { container } = render(<Autocomplete {...baseProps} ariaLabelledby="legacy-label" />);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => {
			const listbox = getByDataRole(document.body, DataRoles.Dropdown.Content);
			expect(listbox.getAttribute("aria-labelledby")).toContain("legacy-label");
		});
	});

	test("ariaDescribedby wins over the deprecated ariaLabelledby", async () => {
		const { container } = render(
			<Autocomplete {...baseProps} ariaDescribedby="described-by" ariaLabelledby="legacy-label" />
		);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => {
			const labelledBy = getByDataRole(document.body, DataRoles.Dropdown.Content).getAttribute("aria-labelledby");
			expect(labelledBy).toContain("described-by");
			expect(labelledBy).not.toContain("legacy-label");
		});
	});

	// The attached list is portalled to the end of the document, where nothing but `aria-owns` puts it
	// back beside the field. Without it a screen reader moving through the field by swipe (TalkBack,
	// VoiceOver) or in browse mode (NVDA) leaves for the rest of the page, and the options are only
	// reachable at the very end of the document.
	test("the open attached list is owned by the field, so it follows the input and its clear button", async () => {
		const { container } = render(<Autocomplete {...baseProps} initialValue="London" />);
		const wrapper = getByDataRole(container, DataRoles.TextField.Input.Wrapper);

		expect(wrapper).not.toHaveAttribute("aria-owns");

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => {
			expect(wrapper).toHaveAttribute("aria-owns", "ac-dropdown");
		});

		// What is owned is the list the combobox controls, and what stands between the two in the reading
		// order is the clear button — the order the options are expected to be reached in.
		const owned = document.getElementById("ac-dropdown");
		expect(owned).toContainElement(getByDataRole(document.body, DataRoles.Dropdown.Content));
		expect(wrapper).toContainElement(getByDataRole(container, DataRoles.Button));
	});

	test("the field stops owning the list once it closes", async () => {
		const { container } = render(<Autocomplete {...baseProps} />);
		const wrapper = getByDataRole(container, DataRoles.TextField.Input.Wrapper);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));
		await waitFor(() => expect(wrapper).toHaveAttribute("aria-owns", "ac-dropdown"));

		await userEvent.keyboard(`{${Key.Escape}}`);

		await waitFor(() => expect(wrapper).not.toHaveAttribute("aria-owns"));
	});

	// The dialog's list already follows its field in the DOM, and the trigger in the page has no list of
	// its own to own.
	test("the dialog presentation owns nothing", async () => {
		const { container } = render(<Autocomplete {...baseProps} mobileModal />);

		await userEvent.click(getByDataRole(container, DataRoles.TextField.Input));

		await waitFor(() => {
			expect(getByDataRole(document.body, DataRoles.Dropdown.Content)).toBeInTheDocument();
		});

		// Neither the trigger in the page nor the dialog's own field, which is portalled into the same
		// container while it is open.
		for (const wrapper of getAllByDataRole(container, DataRoles.TextField.Input.Wrapper)) {
			expect(wrapper).not.toHaveAttribute("aria-owns");
		}
	});

	test("readonly and disabled comboboxes expose no combobox role", () => {
		const { container: ro } = render(<Autocomplete {...baseProps} readonly />);
		expect(queryByDataRole(ro, DataRoles.TextField.Input)).not.toHaveAttribute("role", "combobox");

		const { container: disabled } = render(<Autocomplete {...baseProps} disabled />);
		expect(queryByDataRole(disabled, DataRoles.TextField.Input)).not.toHaveAttribute("role", "combobox");
	});
});
