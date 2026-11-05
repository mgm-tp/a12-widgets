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

import type { LexicalEditor } from "lexical";
import { $createParagraphNode, $createRangeSelection, $getRoot, $setSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { findByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { $createInlineStyleTextNode, $isInlineStyleTextNode } from "../main/nodes/inline-style-text-node.js";
import { DefaultRichTextEditor } from "../main/wrapper/default-rich-text-editor.view.js";

/**
 * Reads the bold flag of every text node in the document.
 *
 * The plugin mirrors the format onto {@link InlineStyleTextNode} separately
 * from the selection-level toggle, so this reads the node state rather than
 * the selection's, which is where the two can drift apart.
 */
const readBoldFlags = (editor: LexicalEditor): boolean[] =>
	editor.getEditorState().read(() =>
		$getRoot()
			.getAllTextNodes()
			.filter((node) => $isInlineStyleTextNode(node))
			.map((node) => node.hasFormat("bold"))
	);

const readTexts = (editor: LexicalEditor): string[] =>
	editor.getEditorState().read(() =>
		$getRoot()
			.getAllTextNodes()
			.map((node) => node.getTextContent())
	);

describe("com.mgmtp.a12.widgets.rich-text-editor.text-format-plugin mixed selection", () => {
	test("applying bold across a partially-bold selection leaves a uniform result", async () => {
		let editor: LexicalEditor | undefined;

		const { container } = render(
			<DefaultRichTextEditor
				id="mixed-format-editor"
				initialConfig={{ namespace: "MixedFormat" }}
				onChange={(_editorState, instance): void => {
					editor = instance;
				}}
			/>
		);

		const input = await findByDataRole(container, DataRoles.RichTextEditor.Input);

		// `onChange` only fires once the document actually changes, so seed one
		// edit to get hold of the editor instance.
		await userEvent.click(input);
		await userEvent.keyboard("x");

		await waitFor(() => {
			expect(editor).toBeDefined();
		});

		const instance = editor!;

		// "hello" is bold, " world" is not — a selection spanning both is mixed.
		instance.update(() => {
			const paragraph = $createParagraphNode();
			const boldNode = $createInlineStyleTextNode("hello");

			boldNode.toggleFormat("bold");

			const plainNode = $createInlineStyleTextNode(" world");

			paragraph.append(boldNode, plainNode);
			$getRoot().clear().append(paragraph);

			const selection = $createRangeSelection();

			selection.anchor.set(boldNode.getKey(), 0, "text");
			selection.focus.set(plainNode.getKey(), plainNode.getTextContentSize(), "text");
			$setSelection(selection);
		});

		await waitFor(() => {
			expect(readTexts(instance).join("")).toBe("hello world");
		});

		expect(readBoldFlags(instance)).toEqual([true, false]);

		instance.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");

		await waitFor(() => {
			const flags = readBoldFlags(instance);

			// A mixed selection must not stay mixed, and the direction is
			// "apply to all" rather than "clear from all". Node count is not
			// asserted because uniformly-formatted neighbours get merged.
			expect(flags.length).toBeGreaterThan(0);
			expect(flags.every(Boolean)).toBe(true);
			expect(readTexts(instance).join("")).toBe("hello world");
		});
	});

	test("bold toggles on and back off over a real caret selection", async () => {
		let editor: LexicalEditor | undefined;

		const { container } = render(
			<DefaultRichTextEditor
				id="toggle-round-trip-editor"
				initialConfig={{ namespace: "ToggleRoundTrip" }}
				onChange={(_editorState, instance): void => {
					editor = instance;
				}}
			/>
		);

		const input = await findByDataRole(container, DataRoles.RichTextEditor.Input);

		await userEvent.click(input);
		await userEvent.keyboard("hello world");

		await waitFor(() => {
			expect(editor).toBeDefined();
		});

		const instance = editor!;

		// A caret-driven selection carries the format state that a synthetic
		// `$createRangeSelection()` does not, which is what makes the toggle-off
		// direction observable at all.
		await userEvent.keyboard("{Home}");
		await userEvent.keyboard("{Shift>}{End}{/Shift}");

		const expectAllBold = async (bold: boolean): Promise<void> => {
			await waitFor(() => {
				const flags = readBoldFlags(instance);

				expect(flags.length).toBeGreaterThan(0);
				expect(flags.every((flag) => flag === bold)).toBe(true);
			});
		};

		await expectAllBold(false);

		instance.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
		await expectAllBold(true);

		instance.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
		await expectAllBold(false);

		instance.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
		await expectAllBold(true);
	});
});
