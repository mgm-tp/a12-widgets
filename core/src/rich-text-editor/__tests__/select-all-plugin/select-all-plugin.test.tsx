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

import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "test-utils";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { userEvent } from "vitest/browser";

import { DefaultRichTextEditor } from "../../main/wrapper/default-rich-text-editor.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

describe("com.mgmtp.a12.widgets.rich-text-editor.select-all-plugin", () => {
	const prepopulatedRichText = () => {
		const root = $getRoot();
		const paragraph = $createParagraphNode();
		paragraph.append($createTextNode("This is test content for the rich text editor."));
		root.append(paragraph);
	};

	beforeEach(() => {
		// Clear any existing selections
		window.getSelection()?.removeAllRanges();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Keyboard Shortcut (Ctrl+A / Cmd+A)", () => {
		test("Should select only editor content when Ctrl+A is pressed in readonly mode", async () => {
			const { findByDataRole } = render(
				<DefaultRichTextEditor
					readonly
					initialConfig={{ editorState: prepopulatedRichText, namespace: "SelectAll Readonly" }}
				/>
			);

			const contentEditable = await findByDataRole(DataRoles.RichTextEditor.Input);
			await userEvent.click(contentEditable);

			// Simulate Ctrl+A
			await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");

			await waitFor(() => {
				const selection = window.getSelection();
				expect(selection).toBeTruthy();
				expect(selection?.rangeCount).toBeGreaterThan(0);

				if (selection && selection.rangeCount > 0) {
					const range = selection.getRangeAt(0);
					const editorElement = contentEditable.closest(`[data-role="${DataRoles.RichTextEditor.Input.Wrapper}"]`);

					// Verify selection is within the editor
					expect(editorElement?.contains(range.startContainer)).toBe(true);
					expect(editorElement?.contains(range.endContainer)).toBe(true);
				}
			});
		});

		test("Should select only editor content when Cmd+A is pressed on Mac in readonly mode", async () => {
			const { findByDataRole } = render(
				<DefaultRichTextEditor
					readonly
					initialConfig={{ editorState: prepopulatedRichText, namespace: "SelectAll Mac Readonly" }}
				/>
			);

			const contentEditable = await findByDataRole(DataRoles.RichTextEditor.Input);
			await userEvent.click(contentEditable);

			// Simulate Cmd+A (Meta+A on Mac)
			await userEvent.keyboard("{Meta>}a{/Meta}");

			await waitFor(() => {
				const selection = window.getSelection();
				expect(selection).toBeTruthy();
				expect(selection?.rangeCount).toBeGreaterThan(0);

				if (selection && selection.rangeCount > 0) {
					const range = selection.getRangeAt(0);
					const editorElement = contentEditable.closest(`[data-role="${DataRoles.RichTextEditor.Input.Wrapper}"]`);

					// Verify selection is within the editor
					expect(editorElement?.contains(range.startContainer)).toBe(true);
					expect(editorElement?.contains(range.endContainer)).toBe(true);
				}
			});
		});
	});
});
