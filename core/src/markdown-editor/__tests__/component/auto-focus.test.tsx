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

import { render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import {
	ControlledEditor,
	getSurfaceByMode,
	isHoldingCaret,
	switchMode,
	type ControlledEditorProps,
	waitForSurfaceReady
} from "../utils/index.js";

/** Long enough that a caret at the start and a caret at the end are plainly different. */
const SAMPLE_MARKDOWN = "# Title\n\nA paragraph.\n";

/** Renders the editor as a labelled form field, which is how a host would use it. */
function renderEditor(props: ControlledEditorProps): ReturnType<typeof render> {
	return render(<ControlledEditor label="Notes" initialValue={SAMPLE_MARKDOWN} {...props} />);
}

/**
 * Nothing inside the widget holds the focus.
 *
 * The browser parks the focus on `<body>` when no element has asked for it,
 * so that counts as "nothing", the same as a `null` active element.
 */
function expectNothingFocused(container: HTMLElement): void {
	const active = document.activeElement;

	expect(active === null || active === document.body || !container.contains(active)).toBe(true);
}

describe("MarkdownEditor autoFocus", () => {
	test("edit mode: the caret lands in the rich surface", async () => {
		const { container } = renderEditor({ autoFocus: true, initialMode: "edit" });

		// The caret arrives a beat after mount: the host's markdown has to be parsed into the document first,
		// because an empty document has nowhere to put a caret.
		await waitFor(() => expect(isHoldingCaret(getSurfaceByMode(container, "edit"))).toBe(true));
	});

	test("source mode: the caret lands in the source surface", async () => {
		const { container } = renderEditor({ autoFocus: true, initialMode: "source" });

		// Source mode runs a second Lexical editor of its own, reached through a nested composer.
		// This proves the focus follows the surface, not just the outer editor.
		await waitFor(() => expect(isHoldingCaret(getSurfaceByMode(container, "source"))).toBe(true));
	});

	test("the caret sits at the end of the text, so typing carries on from there", async () => {
		const { container } = renderEditor({ autoFocus: true, initialMode: "source" });
		const surface = getSurfaceByMode(container, "source");

		// Step 1: wait for the focus to land, so the keystroke below is not dropped.
		await waitFor(() => expect(isHoldingCaret(surface)).toBe(true));

		// Step 2: type one character. Asking the DOM where the caret is would mean reading Lexical's internals;
		// typing asks the same question through the behaviour a user would see.
		await userEvent.keyboard("X");

		// Step 3: the character has to come out behind the text, the way it does in a `<textarea autofocus>`.
		// Both assertions are needed — "ends with X" alone would also pass for a one-character document.
		await waitFor(() => expect(surface.textContent?.endsWith("X")).toBe(true));
		expect(surface.textContent?.startsWith("X")).toBe(false);
	});

	test("without the prop nothing is focused", async () => {
		const { container } = renderEditor({ initialMode: "edit" });

		// Waiting for the surface first matters: asserting straight away would pass
		// even if the editor grabbed the focus a moment later.
		await waitForSurfaceReady(container, "edit");
		expectNothingFocused(container);
	});

	/*
	 * The three states with nothing to type in. `view` has no editable surface at all
	 * and `readonly` resolves to it; `disabled` keeps the surface but takes editing away.
	 * All three pass `autoFocus`, so each one asserts that the prop is deliberately ignored
	 * rather than simply absent.
	 */
	test("view mode is left alone", async () => {
		const { container } = renderEditor({ autoFocus: true, initialMode: "view" });

		await waitForSurfaceReady(container, "view");
		expectNothingFocused(container);
	});

	test("readonly is left alone", async () => {
		const { container } = renderEditor({ autoFocus: true, initialMode: "edit", readonly: true });

		await waitForSurfaceReady(container, "view");
		expectNothingFocused(container);
	});

	test("disabled is left alone", async () => {
		const { container } = renderEditor({ autoFocus: true, initialMode: "edit", disabled: true });

		await waitForSurfaceReady(container, "edit");
		expectNothingFocused(container);
	});

	test("a later mode switch does not take the focus back", async () => {
		const { container } = renderEditor({ autoFocus: true, initialMode: "edit" });

		// Step 1: the initial auto-focus happens, and is spent.
		await waitFor(() => expect(isHoldingCaret(getSurfaceByMode(container, "edit"))).toBe(true));

		// Step 2: press the Source button. The focus is now on that button.
		await switchMode(container, "source");

		// Step 3: the source surface mounts fresh. Auto-focus is a first-render decision,
		// so it must leave the focus on the button the user just pressed
		// instead of stealing it into the new surface.
		await waitForSurfaceReady(container, "source");
		expect(isHoldingCaret(getSurfaceByMode(container, "source"))).toBe(false);
	});
});
