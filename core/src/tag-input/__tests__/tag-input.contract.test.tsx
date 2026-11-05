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
 * The TagInput's prop surface and tag-focus model on a pointer device.
 *
 * The existing suite exercises tag creation and removal well, but never passes `addonBefore`,
 * `infoMessage`, `duplicatedTagMessage`, `autoFocus`, `hideLabel`, `labelGraphic` or `placeholder`
 * at all, and never reads what `onAddedTag`/`onRemoveTag` are handed. It also only walks the tag
 * focus ring one step in each direction.
 */

import { getAllByDataRole, getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { Icon } from "../../icon/main/icon.view.js";
import { TagInput } from "../main/tag-input.view.js";

const initialTags = ["Widgets", "A12", "mgm"];
const popularTags = ["Android phone", "iOS phone", "Windows desktop"];

function tags(container: HTMLElement): HTMLElement[] {
	return getAllByDataRole(container, DataRoles.Tag).filter((tag) => !tag.getAttribute("id")?.includes("a11y"));
}

function tagLabels(container: HTMLElement): string[] {
	return tags(container).map((tag) => getByDataRole(tag, DataRoles.Tag.Content).textContent ?? "");
}

/** Labels of the tags currently carrying the focus highlight. */
function focusedTags(container: HTMLElement): string[] {
	return tags(container)
		.filter((tag) => tag.getAttribute("class")?.includes("tag--focus"))
		.map((tag) => getByDataRole(tag, DataRoles.Tag.Content).textContent ?? "");
}

function input(container: HTMLElement): HTMLElement {
	return getByDataRole(container, DataRoles.Textarea.Input);
}

/**
 * Sends real key presses to the widget, starting from the field.
 *
 * The field is only focused when the focus is not already inside the widget: walking the tags takes
 * the focus off the field and onto the tag group, and putting it back between keys would undo that.
 */
async function press(container: HTMLElement, ...keys: string[]): Promise<void> {
	if (!getByDataRole(container, DataRoles.TagInput).contains(document.activeElement)) {
		input(container).focus();
	}

	for (const key of keys) {
		await userEvent.keyboard(key);
	}
}

/** Types into the field the way a user would, one character at a time. */
async function typeInto(container: HTMLElement, text: string): Promise<void> {
	await userEvent.type(input(container), text);
}

describe("com.mgmtp.a12.widgets.tag-input.contract", () => {
	describe("what it reports", () => {
		test("names the tag it added", async () => {
			const onAddedTag = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} onAddedTag={onAddedTag} keys={[","]} />);

			await typeInto(container, "reported,");

			expect(onAddedTag).toHaveBeenCalledTimes(1);
			// The prop takes an array, though a delimiter only ever produces one tag at a time.
			expect(onAddedTag.mock.calls[0][0]).toEqual(["reported"]);
		});

		test("names the tag it removed", async () => {
			const onRemoveTag = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} onRemoveTag={onRemoveTag} />);

			await userEvent.click(getByDataRole(tags(container)[1], DataRoles.Button));

			expect(onRemoveTag).toHaveBeenCalledTimes(1);
			expect(onRemoveTag.mock.calls[0][0]).toBe("A12");
		});

		test("says nothing when a duplicate is refused", async () => {
			const onAddedTag = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} onAddedTag={onAddedTag} keys={[","]} />);

			await typeInto(container, "A12,");

			expect(onAddedTag).not.toHaveBeenCalled();
			expect(tagLabels(container)).toEqual(initialTags);
		});
	});

	describe("the duplicate warning", () => {
		test("shows the caller's message instead of the built-in one", async () => {
			const { container } = render(
				<TagInput initialTags={initialTags} duplicatedTagMessage="Already on the list" keys={[","]} />
			);

			await typeInto(container, "A12");
			await press(container, "{Enter}");

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Toast)).toBeTruthy();
			});
			expect(getByDataRole(container, DataRoles.Toast).textContent).toContain("Already on the list");
		});

		test("falls back to the localized message", async () => {
			const { container } = render(<TagInput initialTags={initialTags} keys={[","]} />);

			await typeInto(container, "A12");
			await press(container, "{Enter}");

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Toast)).toBeTruthy();
			});
			expect(getByDataRole(container, DataRoles.Toast).textContent).toContain("You've already used this tag");
		});
	});

	describe("walking the tags with the keyboard", () => {
		test("steps left through the whole ring, one tag at a time", async () => {
			const { container } = render(<TagInput initialTags={initialTags} />);

			input(container).focus();

			await press(container, "{ArrowLeft}");
			expect(focusedTags(container)).toEqual(["mgm"]);

			// Stepping left again from a focused tag was never covered.
			await press(container, "{ArrowLeft}");
			expect(focusedTags(container)).toEqual(["A12"]);

			await press(container, "{ArrowLeft}");
			expect(focusedTags(container)).toEqual(["Widgets"]);

			// Past the first tag the highlight is dropped rather than held: the handler clears the tag it
			// was on whether or not there is a previous one to move to, and the field does not take the
			// focus back either. Pinned as it stands — arrow keys leaving nothing highlighted is a rough
			// edge, not an intended state.
			await press(container, "{ArrowLeft}");
			expect(focusedTags(container)).toEqual([]);
		});

		test("steps back right and hands the focus to the field at the end", async () => {
			const { container } = render(<TagInput initialTags={initialTags} />);

			input(container).focus();
			await press(container, "{ArrowLeft}");
			await press(container, "{ArrowLeft}");
			expect(focusedTags(container)).toEqual(["A12"]);

			await press(container, "{ArrowRight}");
			expect(focusedTags(container)).toEqual(["mgm"]);

			await press(container, "{ArrowRight}");
			expect(focusedTags(container)).toEqual([]);
		});

		test("removes the tag the ring stopped on with Delete", async () => {
			const onRemoveTag = vi.fn();
			const { container } = render(<TagInput initialTags={initialTags} onRemoveTag={onRemoveTag} />);

			input(container).focus();
			await press(container, "{ArrowLeft}");
			await press(container, "{ArrowLeft}");
			await press(container, "{Delete}");

			expect(onRemoveTag.mock.calls[0][0]).toBe("A12");
			expect(tagLabels(container)).toEqual(["Widgets", "mgm"]);
		});
	});

	describe("when it must not respond", () => {
		test.each(["disabled", "readonly"] as const)("ignores the keyboard while %s", async (state) => {
			const onAddedTag = vi.fn();
			const onRemoveTag = vi.fn();
			const { container } = render(
				<TagInput
					initialTags={initialTags}
					popularTags={popularTags}
					onAddedTag={onAddedTag}
					onRemoveTag={onRemoveTag}
					{...{ [state]: true }}
				/>
			);

			input(container).focus();
			await press(container, "{ArrowLeft}");
			await press(container, "{Backspace}");

			expect(focusedTags(container)).toEqual([]);
			expect(onRemoveTag).not.toHaveBeenCalled();
			expect(onAddedTag).not.toHaveBeenCalled();
			expect(tagLabels(container)).toEqual(initialTags);
		});

		test.each(["disabled", "readonly"] as const)("offers no remove button on its tags while %s", async (state) => {
			const { container } = render(<TagInput initialTags={initialTags} {...{ [state]: true }} />);

			expect(queryByDataRole(tags(container)[0], DataRoles.Button)).toBeFalsy();
		});
	});

	describe("the surrounding field", () => {
		test("renders the addons on either side of the control", async () => {
			const { container } = render(
				<TagInput initialTags={initialTags} addonBefore={<span>before</span>} addonAfter={<span>after</span>} />
			);

			expect(getByDataRole(container, "tag-input--addon-before-0").textContent).toBe("before");
			expect(getByDataRole(container, "tag-input--addon-after-0").textContent).toBe("after");
		});

		test("renders every addon it is given", async () => {
			const { container } = render(
				<TagInput initialTags={initialTags} addonBefore={[<span key="a">one</span>, <span key="b">two</span>]} />
			);

			expect(getByDataRole(container, "tag-input--addon-before-0").textContent).toBe("one");
			expect(getByDataRole(container, "tag-input--addon-before-1").textContent).toBe("two");
		});

		test("shows the error, warning and info messages", async () => {
			const { container } = render(
				<TagInput
					id="keywords"
					initialTags={initialTags}
					errorMessage="Something is wrong"
					warningMessage="Careful"
					infoMessage="Three tags so far"
				/>
			);

			expect(getByDataRole(container, DataRoles.TagInput.ErrorMessage).textContent).toContain("Something is wrong");
			expect(getByDataRole(container, DataRoles.TagInput.WarningMessage).textContent).toContain("Careful");
			expect(getByDataRole(container, DataRoles.TagInput.InfoMessage).textContent).toContain("Three tags so far");
		});

		test("keeps a hidden label available to assistive technology", async () => {
			const { container } = render(<TagInput id="keywords" label="Keywords" hideLabel initialTags={initialTags} />);

			const label = getByDataRole(container, DataRoles.TagInput.Label);
			expect(label.textContent).toContain("Keywords");
			expect(label.className).toContain("-u-unseenButRead");
		});

		test("puts a graphic in front of the label", async () => {
			const { container } = render(
				<TagInput id="keywords" label="Keywords" labelGraphic={<Icon>info</Icon>} initialTags={initialTags} />
			);

			expect(getByDataRole(container, DataRoles.Label.Graphic)).toBeInTheDocument();
		});

		test("shows the placeholder only while there are no tags", async () => {
			const { container } = render(<TagInput placeholder="Add a tag" keys={[","]} />);

			expect(input(container)).toHaveAttribute("placeholder", "Add a tag");

			await typeInto(container, "first,");

			expect(input(container)).toHaveAttribute("placeholder", "");
		});

		test("takes the focus on mount when asked to", async () => {
			const { container } = render(<TagInput autoFocus initialTags={initialTags} />);

			expect(input(container)).toHaveFocus();
		});

		test("leaves the focus alone by default", async () => {
			const { container } = render(<TagInput initialTags={initialTags} />);

			expect(input(container)).not.toHaveFocus();
		});
	});

	describe("the suggestion list", () => {
		test("does not create a tag when the pointer goes down on the list itself", async () => {
			const onAddedTag = vi.fn();
			const { container } = render(
				<TagInput
					initialTags={initialTags}
					popularTags={popularTags}
					suggestionTags={popularTags}
					suggestionLabel="Matching tags"
					onAddedTag={onAddedTag}
				/>
			);

			input(container).focus();
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Dropdown)).toBeTruthy();
			});

			// Typing swaps the popular tags for the matching suggestions; the popular list only shows
			// while the field is empty.
			await typeInto(container, "phone");

			// The list swallows the pointer press so that the field does not blur and commit the text —
			// the guard that lets a press on a disabled option do nothing at all. Pressing the hint hits
			// the list without hitting an option.
			await userEvent.click(getByDataRole(container, DataRoles.Dropdown.Hint));

			expect(onAddedTag).not.toHaveBeenCalled();
			expect(tagLabels(container)).toEqual(initialTags);
		});

		test("names the list after the popular or suggestion label", async () => {
			const { container } = render(
				<TagInput
					initialTags={initialTags}
					popularTags={popularTags}
					popularLabel="Popular tags"
					suggestionTags={popularTags}
					suggestionLabel="Matching tags"
				/>
			);

			input(container).focus();
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.Dropdown)).toBeTruthy();
			});
			expect(getByDataRole(container, DataRoles.Dropdown.Hint).textContent).toBe("Popular tags");

			await typeInto(container, "phone");
			expect(getByDataRole(container, DataRoles.Dropdown.Hint).textContent).toBe("Matching tags");
		});
	});
});
