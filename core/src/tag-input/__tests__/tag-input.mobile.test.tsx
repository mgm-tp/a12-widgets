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
 * The fullscreen modal the TagInput opens on touch devices.
 *
 * The modal is a transaction: edits made inside it are provisional until the save button commits
 * them, and are reported in one go through `mobileModalProps.onSave` rather than through
 * `onAddedTag`/`onRemoveTag` as they happen. Nothing covered any of that, which makes it the part
 * most at risk of being dropped — so it is pinned here as the contract the widget has to keep.
 */

import { fireEvent, getAllByDataRole, getByDataRole, queryByDataRole, render, setupDevice, waitFor } from "test-utils";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { Icon } from "../../icon/main/icon.view.js";
import type { TagInputProps } from "../main/tag-input.api.js";
import { TagInput } from "../main/tag-input.view.js";

const initialTags = ["Widgets", "A12", "mgm"];
const suggestionTags = ["Android phone", "iOS phone", "Windows desktop"];

/** The tags the widget holds, ignoring the hidden ones the a11y layer adds. */
function tagLabels(scope: HTMLElement): string[] {
	return getAllByDataRole(scope, DataRoles.Tag)
		.filter((tag) => !tag.getAttribute("id")?.includes("a11y"))
		.map((tag) => getByDataRole(tag, DataRoles.Tag.Content).textContent ?? "");
}

function modalOf(container: HTMLElement): HTMLElement {
	return getByDataRole(container, DataRoles.Modal.Overlay);
}

/** The modal's own copy of the field, which is where typing happens while it is open. */
function modalInput(container: HTMLElement): HTMLElement {
	return getByDataRole(modalOf(container), DataRoles.Textarea.Input);
}

function footerButtons(container: HTMLElement): { cancel: HTMLElement; save: HTMLElement } {
	const footer = getByDataRole(modalOf(container), DataRoles.Contentbox.Footer);
	const [cancel, save] = getAllByDataRole(footer, DataRoles.Button);

	return { cancel, save };
}

async function openModal(container: HTMLElement): Promise<void> {
	await userEvent.click(getByDataRole(container, DataRoles.Textarea.Input));
	await waitFor(() => {
		expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeTruthy();
	});
}

/** Removes the named tag through its remove button, inside whichever scope is given. */
async function removeTag(scope: HTMLElement, label: string): Promise<void> {
	const tag = getAllByDataRole(scope, DataRoles.Tag).find(
		(candidate) => queryByDataRole(candidate, DataRoles.Tag.Content)?.textContent === label
	)!;
	await userEvent.click(getByDataRole(tag, DataRoles.Button));
}

const modalProps: TagInputProps["mobileModalProps"] = { buttonsProps: {} };

describe("com.mgmtp.a12.widgets.tag-input.mobile", () => {
	beforeAll(() => {
		setupDevice();
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	describe("opening", () => {
		test("opens a fullscreen modal holding its own copy of the field", async () => {
			const { container } = render(<TagInput initialTags={initialTags} label="Keywords" />);

			expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();

			await openModal(container);

			const modal = modalOf(container);
			expect(getByDataRole(modal, DataRoles.Textarea.Input)).toBeInTheDocument();
			expect(tagLabels(modal)).toEqual(initialTags);
		});

		test("shows the suggestion list inside the modal rather than in a popup", async () => {
			const { container } = render(<TagInput initialTags={initialTags} suggestionTags={suggestionTags} />);

			await openModal(container);
			await userEvent.type(modalInput(container), "phone");

			expect(getByDataRole(modalOf(container), DataRoles.Dropdown)).toBeInTheDocument();
			expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();
		});

		test("does not open on focus when told not to", async () => {
			const { container } = render(<TagInput initialTags={initialTags} openOnFocus={false} />);

			getByDataRole(container, DataRoles.Textarea.Input).focus();

			expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
		});
	});

	describe("cancelling", () => {
		test("discards a tag added inside the modal", async () => {
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={modalProps} />);

			await openModal(container);
			await userEvent.type(modalInput(container), "provisional,");
			expect(tagLabels(modalOf(container))).toContain("provisional");

			await userEvent.click(footerButtons(container).cancel);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toEqual(initialTags);
		});

		test("puts back a tag removed inside the modal", async () => {
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={modalProps} />);

			await openModal(container);
			await removeTag(modalOf(container), "A12");
			expect(tagLabels(modalOf(container))).toEqual(["Widgets", "mgm"]);

			await userEvent.click(footerButtons(container).cancel);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toEqual(initialTags);
		});

		test("reports nothing through onSave when the edits are cancelled", async () => {
			const onSave = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onSave }} />);

			await openModal(container);
			await userEvent.type(modalInput(container), "provisional,");
			await userEvent.click(footerButtons(container).cancel);

			expect(onSave).not.toHaveBeenCalled();
		});

		test("discards the text left in the field as well", async () => {
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={modalProps} />);

			await openModal(container);
			await userEvent.type(modalInput(container), "half typed");
			await userEvent.click(footerButtons(container).cancel);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(getByDataRole(container, DataRoles.Textarea.Input)).toHaveValue("");
			expect(tagLabels(container)).toEqual(initialTags);
		});
	});

	describe("saving", () => {
		test("keeps the tags added inside the modal and reports them once", async () => {
			const onSave = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onSave }} />);

			await openModal(container);
			await userEvent.type(modalInput(container), "kept,");
			await userEvent.click(footerButtons(container).save);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toEqual([...initialTags, "kept"]);
			expect(onSave).toHaveBeenCalledTimes(1);
			expect(onSave.mock.calls[0]).toEqual([["kept"], []]);
		});

		test("reports the tags removed inside the modal", async () => {
			const onSave = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onSave }} />);

			await openModal(container);
			await removeTag(modalOf(container), "A12");
			await userEvent.click(footerButtons(container).save);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toEqual(["Widgets", "mgm"]);
			expect(onSave.mock.calls[0]).toEqual([[], ["A12"]]);
		});

		test("reports nothing for a tag that was added and removed again", async () => {
			const onSave = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onSave }} />);

			await openModal(container);
			await userEvent.type(modalInput(container), "fleeting,");
			await removeTag(modalOf(container), "fleeting");

			await userEvent.click(footerButtons(container).save);

			expect(onSave.mock.calls[0]).toEqual([[], []]);
			expect(tagLabels(container)).toEqual(initialTags);
		});

		test("turns the text still in the field into a tag on save", async () => {
			const onSave = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onSave }} />);

			await openModal(container);
			// No delimiter typed — the pending text is committed by the save button itself.
			await userEvent.type(modalInput(container), "pending");
			await userEvent.click(footerButtons(container).save);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toContain("pending");
			expect(onSave.mock.calls[0][0]).toContain("pending");
		});

		test("refuses to save a duplicate and keeps the modal open", async () => {
			const onSave = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onSave }} />);

			await openModal(container);
			await userEvent.type(modalInput(container), "A12");
			await userEvent.click(footerButtons(container).save);

			expect(getByDataRole(container, DataRoles.Toast)).toBeInTheDocument();
			expect(onSave).not.toHaveBeenCalled();
			expect(modalOf(container)).toBeInTheDocument();
			expect(tagLabels(modalOf(container))).toEqual(initialTags);
		});
	});

	describe("how the edits are reported", () => {
		test("stays quiet on onAddedTag and onRemoveTag while the modal is open", async () => {
			const onAddedTag = vi.fn();
			const onRemoveTag = vi.fn();
			const onSave = vi.fn();
			const { container } = render(
				<TagInput
					initialTags={initialTags}
					onAddedTag={onAddedTag}
					onRemoveTag={onRemoveTag}
					mobileModalProps={{ ...modalProps, onSave }}
				/>
			);

			await openModal(container);
			await userEvent.type(modalInput(container), "added,");
			await removeTag(modalOf(container), "A12");

			// On touch the modal reports its edits in one go through onSave instead.
			expect(onAddedTag).not.toHaveBeenCalled();
			expect(onRemoveTag).not.toHaveBeenCalled();

			await userEvent.click(footerButtons(container).save);
			expect(onSave.mock.calls[0]).toEqual([["added"], ["A12"]]);
		});
	});

	describe("the buttons", () => {
		test("labels the footer buttons as the caller asks", async () => {
			const { container } = render(
				<TagInput
					initialTags={initialTags}
					mobileModalProps={{
						buttonsProps: {
							saveLabel: "Apply",
							cancelLabel: "Discard",
							saveIcon: <Icon>check</Icon>,
							cancelIcon: <Icon>undo</Icon>
						}
					}}
				/>
			);

			await openModal(container);

			const { cancel, save } = footerButtons(container);
			expect(cancel.textContent).toContain("Discard");
			expect(save.textContent).toContain("Apply");
			expect(cancel.getAttribute("title")).toBe("Discard");
			expect(save.getAttribute("title")).toBe("Apply");
		});

		test("reports onModalClose and discards the edits when the overlay is dismissed", async () => {
			const onModalClose = vi.fn();
			const onSave = vi.fn();
			const { container } = render(
				<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onModalClose, onSave }} />
			);

			await openModal(container);
			await userEvent.type(modalInput(container), "provisional,");

			// Dismissing the overlay is the one route that reports `onModalClose` — and a real press cannot
			// take it: the content box fills the fullscreen overlay, so the press never lands on the
			// overlay itself, which is what `ModalOverlay` requires. Hence the synthetic event. That makes
			// `onModalClose` unreachable in practice; this pins the wiring, not a route a user has.
			fireEvent.click(modalOf(container));

			expect(onModalClose).toHaveBeenCalledTimes(1);
			expect(onSave).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toEqual(initialTags);
		});

		test("commits the edits silently on Escape — inconsistent with every other way out", async () => {
			// Escape does not go through `closeModal()`: the textarea's key handler simply clears the
			// flag the modal is rendered from. So the provisional edits survive, and neither
			// `onModalClose` nor `onSave` is called — the caller is never told the tags changed.
			//
			// That makes four exits with three different meanings:
			//   cancel / heading close -> discards, reports nothing
			//   save                   -> commits, reports onSave
			//   overlay dismissal      -> discards, reports onModalClose
			//   Escape                 -> commits, reports nothing   <- this test
			//
			// Pinned as it stands rather than as it ought to be, so that fixing it is a deliberate,
			// visible decision instead of an accident.
			const onModalClose = vi.fn();
			const onSave = vi.fn();
			const { container } = render(
				<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onModalClose, onSave }} />
			);

			await openModal(container);
			await userEvent.type(modalInput(container), "provisional,");
			await userEvent.keyboard("{Escape}");

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toEqual([...initialTags, "provisional"]);
			expect(onModalClose).not.toHaveBeenCalled();
			expect(onSave).not.toHaveBeenCalled();
		});

		test("does not report onModalClose when the modal's own buttons are used", async () => {
			const onModalClose = vi.fn();
			const { container } = render(
				<TagInput initialTags={initialTags} mobileModalProps={{ ...modalProps, onModalClose }} />
			);

			await openModal(container);
			await userEvent.click(footerButtons(container).cancel);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			// `onModalClose` is wired to the overlay's own dismissal, not to the cancel button.
			expect(onModalClose).not.toHaveBeenCalled();
		});

		test("closes without committing when the heading close button is used", async () => {
			const onSave = vi.fn();
			const { container } = render(
				<TagInput initialTags={initialTags} label="Keywords" mobileModalProps={{ ...modalProps, onSave }} />
			);

			await openModal(container);
			await userEvent.type(modalInput(container), "provisional,");

			// The close button in the heading sits outside the footer.
			const modal = modalOf(container);
			const headingClose = getAllByDataRole(modal, DataRoles.Button).find(
				(button) => !getByDataRole(modal, DataRoles.Contentbox.Footer).contains(button)
			)!;
			await userEvent.click(headingClose);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Modal.Overlay)).toBeFalsy();
			});
			expect(tagLabels(container)).toEqual(initialTags);
			expect(onSave).not.toHaveBeenCalled();
		});
	});
});
