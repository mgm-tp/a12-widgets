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
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { useMemo } from "react";

import { useLatest } from "../../../common/main/hooks.js";
import type { LinePrefixKind, SourceSelection } from "../modes/source-commands.js";
import {
	applyLinePrefix,
	indentLines,
	insertCodeBlock,
	insertHorizontalRule,
	insertTable,
	insertText,
	outdentLines,
	toggleInlineWrap
} from "../modes/source-commands.js";
import {
	$captureSourceDocumentSelection,
	$restoreSourceDocumentSelection
} from "../source-highlighting/block-offsets.js";
import type { SourceTokenizer } from "../source-highlighting/micromark-tokenizer.js";
import { $getSourceDocumentText, $setSourceDocument } from "../source-highlighting/source-document.js";
import type { CustomInlineFormatEntry } from "../utils/constants.js";
import { CUSTOM_INLINE_FORMATS } from "../utils/constants.js";

/** The delimiter pair of an inline format, as `toggleInlineWrap` takes them. */
function delimitersOf(format: CustomInlineFormatEntry["format"]): [open: string, close: string] {
	const entry = CUSTOM_INLINE_FORMATS.find((candidate) => candidate.format === format);

	return entry === undefined ? ["", ""] : [entry.open, entry.close];
}

/**
 * The imperative surface the toolbar drives while the editor is in `source`
 * mode. Mirrors the rich-mode command set that has a markdown representation.
 */
export interface MarkdownEditorSourceCommands {
	undo(): void;
	redo(): void;
	toggleBold(): void;
	toggleItalic(): void;
	toggleStrike(): void;
	toggleInlineCode(): void;
	toggleHighlight(): void;
	toggleUnderline(): void;
	toggleSubscript(): void;
	toggleSuperscript(): void;
	setBlock(kind: LinePrefixKind): void;
	indent(): void;
	outdent(): void;
	insertHorizontalRule(): void;
	insertCodeBlock(language: string): void;

	/**
	 * `rows` counts the header row, matching what the table size picker shows.
	 * Both default to a 3 x 3 table when left out.
	 */
	insertTable(rows?: number, columns?: number): void;

	/** Replaces the current selection with a pre-composed markdown fragment. */
	insertText(text: string): void;

	/** The currently selected text (used to pre-fill the link dialog). */
	getSelectedText(): string;
}

interface UseSourceCommandsOptions {
	/** The nested editor that renders the highlighted markdown source. */
	sourceEditor: LexicalEditor | null;

	/** The host-authoritative markdown value. */
	value: string;

	/** Called with the transformed markdown. */
	onChange: (markdown: string) => void;

	/** Tokenizer used to re-highlight the document after a command. */
	tokenize: SourceTokenizer;
}

/**
 * Builds a {@link MarkdownEditorSourceCommands} object bound to the source-mode editor.
 *
 * Every command reads that editor's live text and selection, runs a pure transform
 * from `source-commands`, then writes the result back as one update — document,
 * caret and re-highlighting together. Writing the document directly rather than
 * waiting for the controlled re-render is what keeps the caret: the toolbar buttons
 * call `preventDefault` on mousedown, so focus is still on the surface when the
 * update lands.
 *
 * None of them calls `onChange` themselves. The update is left untagged, so the
 * value bridge's update listener treats it as an edit like any other and reports it
 * under the configured `emitMode`. Emitting here as well would both ignore that
 * policy — a debounced editor would fire immediately on every toolbar click — and
 * report the same markdown twice.
 */
export function useSourceCommands({
	sourceEditor,
	value,
	onChange,
	tokenize
}: UseSourceCommandsOptions): MarkdownEditorSourceCommands {
	// The refs keep the controls object identity stable across keystroke-driven
	// re-renders while every command still reads the current value/onChange/editor.
	const latestValue = useLatest(value);
	const latestOnChange = useLatest(onChange);
	const latestEditor = useLatest(sourceEditor);

	return useMemo<MarkdownEditorSourceCommands>(() => {
		const atEndOf = (markdown: string): SourceSelection => ({
			value: markdown,
			selectionStart: markdown.length,
			selectionEnd: markdown.length
		});

		const readSelection = (): SourceSelection => {
			const editor = latestEditor.current;

			if (!editor) {
				// Nothing mounted yet: act at the end of the document.
				return atEndOf(latestValue.current);
			}

			return editor.read(() => {
				const markdown = $getSourceDocumentText();
				const offsets = $captureSourceDocumentSelection();

				if (offsets === null) {
					// The selection survives a blur in a textarea but not in Lexical, so a
					// command dispatched from a dialog appends instead of guessing.
					return atEndOf(markdown);
				}

				// The pure transforms expect a forward range.
				return {
					value: markdown,
					selectionStart: Math.min(offsets.anchor, offsets.focus),
					selectionEnd: Math.max(offsets.anchor, offsets.focus)
				};
			});
		};

		const apply = (transform: (selection: SourceSelection) => SourceSelection): void => {
			const next = transform(readSelection());
			const editor = latestEditor.current;

			if (!editor) {
				// No surface mounted means no value bridge either, so report it here.
				latestOnChange.current(next.value);

				return;
			}

			// One update: the changed blocks are replaced, the caret is placed, and
			// the highlighting transforms run — so this is a single undo step.
			editor.update(
				() => {
					$setSourceDocument(next.value, tokenize);
					$restoreSourceDocumentSelection({ anchor: next.selectionStart, focus: next.selectionEnd });
				},
				{ discrete: true }
			);

			editor.focus();
		};

		// History lives in the nested editor, so these dispatch rather than transform.
		// The resulting document change reaches the host the same way `apply`'s does.
		const dispatchHistory = (command: typeof UNDO_COMMAND): void => {
			const editor = latestEditor.current;

			if (editor) {
				editor.dispatchCommand(command, undefined);
				editor.focus();
			}
		};

		return {
			undo: () => dispatchHistory(UNDO_COMMAND),
			redo: () => dispatchHistory(REDO_COMMAND),
			toggleBold: () => apply((selection) => toggleInlineWrap(selection, "**")),
			toggleItalic: () => apply((selection) => toggleInlineWrap(selection, "*")),
			toggleStrike: () => apply((selection) => toggleInlineWrap(selection, "~~")),
			toggleInlineCode: () => apply((selection) => toggleInlineWrap(selection, "`")),
			// The formats with no markdown syntax use the delimiters
			// `defineInlineFormatsExtension` reads back, so a run typed here converts on
			// the way to rich mode.
			toggleHighlight: () => apply((selection) => toggleInlineWrap(selection, ...delimitersOf("highlight"))),
			toggleUnderline: () => apply((selection) => toggleInlineWrap(selection, ...delimitersOf("underline"))),
			toggleSubscript: () => apply((selection) => toggleInlineWrap(selection, ...delimitersOf("subscript"))),
			toggleSuperscript: () => apply((selection) => toggleInlineWrap(selection, ...delimitersOf("superscript"))),
			setBlock: (kind) => apply((selection) => applyLinePrefix(selection, kind)),
			indent: () => apply((selection) => indentLines(selection)),
			outdent: () => apply((selection) => outdentLines(selection)),
			insertHorizontalRule: () => apply((selection) => insertHorizontalRule(selection)),
			insertCodeBlock: (language) => apply((selection) => insertCodeBlock(selection, { language })),
			// The picker counts the header row; the source helper takes body rows.
			// Left out, both fall through to the helper's own 3 x 3 default.
			insertTable: (rows, columns) =>
				apply((selection) =>
					insertTable(selection, { columns, rows: rows === undefined ? undefined : Math.max(1, rows - 1) })
				),
			insertText: (text) => apply((selection) => insertText(selection, text)),
			getSelectedText: () => {
				const { value: current, selectionStart, selectionEnd } = readSelection();

				return current.slice(selectionStart, selectionEnd);
			}
		};
	}, [latestEditor, latestValue, latestOnChange, tokenize]);
}
