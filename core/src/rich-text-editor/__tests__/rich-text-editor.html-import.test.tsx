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

import { $generateNodesFromDOM } from "@lexical/html";
import { $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { ElementNode, LexicalEditor, LexicalNode } from "lexical";
import { $getRoot } from "lexical";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { render, waitFor } from "test-utils";
import { describe, expect, test } from "vitest";

import { $isInlineStyleTextNode } from "../main/nodes/inline-style-text-node.js";
import { $isListItemNode } from "../main/nodes/list-item-node.js";
import { DefaultRichTextEditor } from "../main/wrapper/default-rich-text-editor.view.js";

/**
 * Mounts an editor and returns its {@link LexicalEditor} instance.
 */
const renderEditor = async (namespace: string): Promise<LexicalEditor> => {
	let editor: LexicalEditor | undefined;

	const CaptureEditorPlugin = (): ReactNode => {
		const [instance] = useLexicalComposerContext();

		useEffect(() => {
			editor = instance;
		}, [instance]);

		return null;
	};

	render(
		<DefaultRichTextEditor id={`html-import-${namespace}`} initialConfig={{ namespace }}>
			<CaptureEditorPlugin />
		</DefaultRichTextEditor>
	);

	await waitFor(() => {
		expect(editor).toBeDefined();
	});

	return editor!;
};

/**
 * Runs the HTML string through the editor's registered DOM conversions and makes the
 * result the editor content, so the nodes can be inspected from a later `read()`.
 */
const importHtml = async (editor: LexicalEditor, html: string): Promise<void> => {
	await new Promise<void>((resolve) => {
		editor.update(
			() => {
				const dom = new DOMParser().parseFromString(html, "text/html");
				const root = $getRoot();
				root.clear();
				root.append(...$generateNodesFromDOM(editor, dom));
			},
			{ onUpdate: resolve }
		);
	});
};

/**
 * Reads the imported top-level nodes back out of the committed editor state.
 */
const readContent = (editor: LexicalEditor): LexicalNode[] => editor.read(() => $getRoot().getChildren());

describe("com.mgmtp.a12.widgets.rich-text-editor HTML import", () => {
	// The conversions live on the base Lexical nodes, which since 0.49 declare them
	// through the `$config()` protocol rather than a static `importDOM()`. These
	// tests assert the custom subclasses still pick them up.
	test("imports an unordered list into the custom list nodes", async () => {
		const editor = await renderEditor("HtmlImportUnordered");

		await importHtml(editor, "<ul><li>first</li><li>second</li></ul>");

		editor.read(() => {
			const content = readContent(editor);
			expect(content).toHaveLength(1);

			const list = content[0];
			expect($isListNode(list)).toBe(true);

			const items = (list as ElementNode).getChildren();
			expect(items).toHaveLength(2);
			expect(items.every($isListItemNode)).toBe(true);
			expect(items.map((item) => item.getTextContent())).toEqual(["first", "second"]);
		});
	});

	test("imports an ordered list and keeps its list type", async () => {
		const editor = await renderEditor("HtmlImportOrdered");

		await importHtml(editor, "<ol><li>one</li></ol>");

		editor.read(() => {
			const list = readContent(editor)[0];

			if (!$isListNode(list)) {
				throw new Error("expected the imported node to be a list");
			}

			expect(list.getListType()).toBe("number");
			expect($isListItemNode(list.getFirstChild())).toBe(true);
		});
	});

	test("imports a task list as a check list and keeps the checked state", async () => {
		const editor = await renderEditor("HtmlImportChecked");

		await importHtml(
			editor,
			'<ul class="contains-task-list">' +
				'<li class="task-list-item"><input type="checkbox" checked />done</li>' +
				'<li class="task-list-item"><input type="checkbox" />open</li>' +
				"</ul>"
		);

		editor.read(() => {
			const list = readContent(editor)[0];

			if (!$isListNode(list)) {
				throw new Error("expected the imported node to be a list");
			}

			expect(list.getListType()).toBe("check");

			const items = list.getChildren();
			expect(items).toHaveLength(2);
			expect(items.every($isListItemNode)).toBe(true);
			expect(items.map((item) => item.getTextContent())).toEqual(["done", "open"]);
			expect(items.map((item) => ($isListItemNode(item) ? item.getChecked() : undefined))).toEqual([true, false]);
		});
	});

	test("imports formatted inline text into the custom text node", async () => {
		const editor = await renderEditor("HtmlImportInline");

		await importHtml(editor, "<p>plain <b>bold</b> <i>italic</i></p>");

		editor.read(() => {
			const textNodes = (readContent(editor)[0] as ElementNode).getChildren();

			expect(textNodes.length).toBeGreaterThan(0);
			expect(textNodes.every($isInlineStyleTextNode)).toBe(true);

			const bold = textNodes.find((node) => node.getTextContent() === "bold");
			const italic = textNodes.find((node) => node.getTextContent() === "italic");

			expect($isInlineStyleTextNode(bold) && bold.hasFormat("bold")).toBe(true);
			expect($isInlineStyleTextNode(italic) && italic.hasFormat("italic")).toBe(true);
		});
	});
});
