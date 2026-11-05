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

import { SELECT_ALL_COMMAND } from "lexical";
import { waitFor } from "test-utils";
import type { vi } from "vitest";
import { expect } from "vitest";
import { userEvent } from "vitest/browser";

import type { MarkdownEditorHandle } from "../../main/markdown-editor.api.js";

/**
 * Pastes `html` into the surface like a browser does,
 * with the plain text copy that a real clipboard always has as well.
 *
 * `userEvent` cannot paste HTML, so we build the event ourselves.
 * It needs a real `DataTransfer`: Lexical reads the MIME types from it to choose how to import.
 * With a fake object the test would check the wrong code path.
 */
export async function pasteHtmlIntoSurface(surface: HTMLElement, html: string, plainText = ""): Promise<void> {
	await userEvent.click(surface);

	const clipboardData = new DataTransfer();
	clipboardData.setData("text/html", html);
	clipboardData.setData("text/plain", plainText);

	surface.dispatchEvent(new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData }));
}

/**
 * The markdown from the last `onChange` call.
 *
 * Waits for the first call, because `onChange` is debounced by default.
 * Reading the spy right after a paste would read it too early.
 */
export async function lastEmittedMarkdown(onChange: ReturnType<typeof vi.fn>): Promise<string> {
	await waitFor(() => expect(onChange).toHaveBeenCalled());

	return String(onChange.mock.calls.at(-1)?.[0]);
}

/**
 * Pastes plain text and nothing else, the way a copy out of a file, a terminal or a code editor arrives.
 * No `text/html` on the clipboard at all, which is the whole point:
 * it is a different import path from {@link pasteHtmlIntoSurface}.
 */
export async function pasteTextIntoSurface(surface: HTMLElement, text: string): Promise<void> {
	await userEvent.click(surface);

	const clipboardData = new DataTransfer();

	clipboardData.setData("text/plain", text);

	surface.dispatchEvent(new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData }));
}

/**
 * Pastes a clipboard that was filled by an earlier copy, with every format still on it.
 *
 * Use this to test a round trip: copy out of one surface, paste back into another.
 * The other paste helpers build a clipboard with only the formats they name, so they cannot do this.
 */
export async function pasteClipboardIntoSurface(surface: HTMLElement, clipboardData: DataTransfer): Promise<void> {
	await userEvent.click(surface);

	surface.dispatchEvent(new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData }));
}

/**
 * Selects everything in the surface and copies it,
 * then hands back what the editor wrote onto the clipboard.
 *
 * Built by hand for the same reason as {@link pasteHtmlIntoSurface}.
 *
 * Selecting uses `SELECT_ALL_COMMAND`, not a Ctrl+A keystroke. A keystroke from the test runner
 * does not trigger the browser's select-all, so nothing gets selected. Lexical copies nothing
 * when nothing is selected and the test would read an empty clipboard.
 */
export async function copyFromSurface(
	surface: HTMLElement,
	handle: MarkdownEditorHandle | null
): Promise<DataTransfer> {
	await userEvent.click(surface);

	// The payload is typed as a KeyboardEvent. The handler never reads it, so any event will do.
	handle?.getActiveEditor()?.dispatchCommand(SELECT_ALL_COMMAND, new KeyboardEvent("keydown"));
	await waitFor(() => expect(surface.textContent).not.toBe(""));

	const clipboardData = new DataTransfer();

	surface.dispatchEvent(new ClipboardEvent("copy", { bubbles: true, cancelable: true, clipboardData }));

	// The copy handler writes during the event, so there is nothing to wait for after it.
	return clipboardData;
}

/** A `DataTransfer` with files in it, like a real drop or an image paste has. */
function createFileTransfer(files: File[]): DataTransfer {
	const dataTransfer = new DataTransfer();

	for (const file of files) {
		dataTransfer.items.add(file);
	}

	return dataTransfer;
}

/**
 * Pastes files into the surface with no text next to them, like pasting a screenshot.
 *
 * Built by hand for the same reason as {@link pasteHtmlIntoSurface}:
 * the editor reads the real `DataTransfer` to decide what to do.
 *
 * Does not click the surface first, unlike {@link pasteHtmlIntoSurface}.
 * A click moves the caret and a test about *where* the image goes needs the caret to stay put.
 */
export function pasteFilesIntoSurface(surface: HTMLElement, files: File[]): void {
	surface.dispatchEvent(
		new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: createFileTransfer(files) })
	);
}

/**
 * Drops files onto the surface, like dragging them from a file manager.
 *
 * `at` is the drop position in client coordinates. Without it the drop reports 0,0
 * which is outside the surface. That is fine when the test only checks that the upload ran.
 */
export function dropFilesOntoSurface(surface: HTMLElement, files: File[], at?: { x: number; y: number }): void {
	surface.dispatchEvent(
		new DragEvent("drop", {
			bubbles: true,
			cancelable: true,
			dataTransfer: createFileTransfer(files),
			clientX: at?.x,
			clientY: at?.y
		})
	);
}
