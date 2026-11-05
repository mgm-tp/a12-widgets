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
 * A headless source-mode editor, plus a tokenizer that records what it was asked to parse.
 *
 * Used by `performance/scalability.test.tsx`, which needs a real source-mode pipeline it can
 * type into and a way to see how much work one keystroke gave the tokenizer.
 *
 * Not re-exported from `utils/index.js` on purpose: building the tokenizer boots a Lexical
 * editor at import time, and the barrel is imported by every component test.
 */

import { buildEditorFromExtensions, getExtensionDependencyFromEditor } from "@lexical/extension";
import { MdastImportExtension } from "@lexical/mdast";
import { PlainTextExtension } from "@lexical/plain-text";
import type { LexicalEditor } from "lexical";
import { $getRoot, $getSelection, $isRangeSelection, defineExtension } from "lexical";

import { markdownEditorExtension } from "../../main/extensions.js";
import { MarkdownHighlightingExtension } from "../../main/extensions/markdown-highlighting-extension.js";
import { micromarkCustomInlineSyntaxes } from "../../main/extensions/micromark-extension-custom-syntaxes.js";
import { $isMarkdownSourceBlockNode } from "../../main/nodes/markdown-source-block-node.js";
import type { SourceTokenizer } from "../../main/source-highlighting/micromark-tokenizer.js";
import { createSourceTokenizer } from "../../main/source-highlighting/micromark-tokenizer.js";
import { registerSourceHighlighting } from "../../main/source-highlighting/register-source-highlighting.js";
import { $setSourceDocument } from "../../main/source-highlighting/source-document.js";

/** A tokenizer with the same dialect the editor configures. */
export const tokenize: SourceTokenizer = (() => {
	const editor = buildEditorFromExtensions(markdownEditorExtension);
	const { output } = getExtensionDependencyFromEditor(editor, MdastImportExtension);

	return createSourceTokenizer([...output.registry.micromarkExtensions, micromarkCustomInlineSyntaxes()]);
})();

/** A tokenizer that records what it was asked to parse. */
export interface TokenizerCounter {
	readonly tokenize: SourceTokenizer;

	/** How many times the tokenizer ran. */
	calls: number;

	/** How many characters it was handed in total — the number that must not track document size. */
	chars: number;
	reset: () => void;
}

export function createTokenizerCounter(): TokenizerCounter {
	const recorded: TokenizerCounter = {
		tokenize: (text) => {
			recorded.calls++;
			recorded.chars += text.length;

			return tokenize(text);
		},
		calls: 0,
		chars: 0,
		reset: () => {
			recorded.calls = 0;
			recorded.chars = 0;
		}
	};

	return recorded;
}

/** The real source-mode pipeline: typing into this runs the highlighting and the repair. */
export function createLiveEditor(tokenizer: SourceTokenizer = tokenize): LexicalEditor {
	return buildEditorFromExtensions(
		defineExtension({
			name: "@a12/test/LiveSourceDocument",
			dependencies: [PlainTextExtension, MarkdownHighlightingExtension],
			register: (editor) => registerSourceHighlighting(editor, tokenizer)
		})
	);
}

export function setDocument(editor: LexicalEditor, markdown: string, tokenizer: SourceTokenizer = tokenize): void {
	editor.update(
		() => {
			$setSourceDocument(markdown, tokenizer);
		},
		{ discrete: true }
	);
}

/** One key per block, in document order. */
export function blockKeys(editor: LexicalEditor): string[] {
	return editor.read(() =>
		$getRoot()
			.getChildren()
			.map((block) => block.getKey())
	);
}

/** How many blocks hold a different node than they did before. */
export function replacedBlocks(before: readonly string[], after: readonly string[]): number {
	return after.filter((key, index) => key !== before[index]).length;
}

/** Puts the caret at the end of block `index`. */
export function placeCaretAtBlockEnd(editor: LexicalEditor, index: number): void {
	editor.update(
		() => {
			const block = $getRoot().getChildren()[index];

			if (block && $isMarkdownSourceBlockNode(block)) {
				block.selectEnd();
			}
		},
		{ discrete: true }
	);
}

/** Types `text` at the caret, as a user would — one update, so one repair pass. */
export function typeText(editor: LexicalEditor, text: string): void {
	editor.update(
		() => {
			const selection = $getSelection();

			if ($isRangeSelection(selection)) {
				selection.insertText(text);
			}
		},
		{ discrete: true }
	);
}
