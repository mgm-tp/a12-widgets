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

import type { EditorState, LexicalEditor } from "lexical";
import { findByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { RichTextEditor } from "../main/rich-text-editor.view.js";
import { DefaultRichTextEditor } from "../main/wrapper/default-rich-text-editor.view.js";

describe("com.mgmtp.a12.widgets.rich-text-editor onChange", () => {
	test("RichTextEditor reports editor state changes through onChange", async () => {
		const onChange = vi.fn<(editorState: EditorState, editor: LexicalEditor) => void>();

		const { container } = render(
			<RichTextEditor id="on-change-editor" initialConfig={{ namespace: "OnChange" }} onChange={onChange} />
		);

		const input = await findByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(input);
		await userEvent.keyboard("hello");

		await waitFor(() => {
			expect(onChange).toHaveBeenCalled();
		});

		const [editorState, editor] = onChange.mock.calls.at(-1)!;

		expect(editor).toBeDefined();
		expect(editorState.read(() => editor.getRootElement()?.textContent)).toContain("hello");
	});

	test("DefaultRichTextEditor reports onChange exactly once per change", async () => {
		const onChange = vi.fn<(editorState: EditorState, editor: LexicalEditor) => void>();

		const { container } = render(
			<DefaultRichTextEditor
				id="on-change-default-editor"
				initialConfig={{ namespace: "OnChangeDefault" }}
				onChange={onChange}
			/>
		);

		const input = await findByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(input);

		// Mount and first focus emit their own notifications; warm up so the
		// measurement below sees only steady-state typing.
		await userEvent.keyboard("a");

		await waitFor(() => {
			expect(onChange).toHaveBeenCalled();
		});

		// Guards against the wrapper and the base component both registering an
		// OnChangePlugin, which would double every notification.
		for (const key of ["b", "c"]) {
			onChange.mockClear();
			await userEvent.keyboard(key);

			await waitFor(() => {
				expect(onChange).toHaveBeenCalled();
			});

			expect(onChange.mock.calls.length).toBe(1);
		}
	});
});
