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

import { $convertSelectionToMarkdownString, $generateNodesFromMarkdownString } from "@lexical/mdast";
import type { LexicalEditor, LexicalNode, RangeSelection } from "lexical";
import {
	$caretFromPoint,
	$getCollapsedCaretRange,
	$getRoot,
	$getSelection,
	$insertNodes,
	$insertNodeToNearestRootAtCaret,
	$isDecoratorNode,
	$isElementNode,
	$isParagraphNode,
	$isRangeSelection,
	$isRootOrShadowRoot,
	$setSelectionFromCaretRange,
	REDO_COMMAND,
	UNDO_COMMAND
} from "lexical";
import type { Ref, RefObject } from "react";
import { useImperativeHandle, useRef } from "react";

import { useLatest } from "../../../common/main/hooks.js";
import type { MarkdownEditorHandle, MarkdownEditorMode } from "../markdown-editor.api.js";
import type { MarkdownEditorSourceCommands } from "../toolbar/use-source-commands.js";
import { blurEditor, focusEditor } from "../utils/helpers.js";

/**
 * The editor's current state. Passed in again on every render.
 *
 * There are two editors. Only one is on screen at a time.
 * If a handle method remembered the editor it was built with,
 * it would write to the wrong one after the first mode switch.
 * So the methods read this instead, each time they run.
 */
export interface MarkdownEditorHandleOptions {
	/**
	 * Which editor the user is looking at. Already resolved, so nothing here re-checks the props:
	 * a readonly field is `"view"`, whatever mode the host asked for.
	 */
	mode: MarkdownEditorMode;

	/** The editor holding the document as rich nodes. Always exists, even in `source` mode. */
	richEditor: LexicalEditor;

	/** The editor holding the markdown as highlighted text. Only exists in `source` mode. */
	sourceEditor: LexicalEditor | null;

	/**
	 * Edits the markdown as text: bold, headings, insert at the caret.
	 * Still works when `sourceEditor` is null — then it edits the host's value instead.
	 */
	sourceCommands: MarkdownEditorSourceCommands;

	/** Sends an edit that is still waiting in the debounce. */
	flush: () => void;

	/** Whether the document may be changed at all. False in `view` mode and while disabled. */
	editable: boolean;
}

/**
 * Fills the host's {@link MarkdownEditorProps.editorRef} with a {@link MarkdownEditorHandle}.
 *
 * The handle is built once. The host's ref points at the same object for as long as the editor lives,
 * so a re-render never hands the host a new one.
 */
export function useMarkdownEditorHandle(
	editorRef: Ref<MarkdownEditorHandle> | undefined,
	options: MarkdownEditorHandleOptions
): void {
	const latest = useLatest(options);
	const handle = useRef<MarkdownEditorHandle>(null);

	// Built here rather than inside `useImperativeHandle`:
	// React re-runs that callback whenever the ref itself changes,
	// and a host writing `editorRef={(h) => …}` inline gives it a new ref on every render.
	// Building once here means even that host keeps the same handle.
	handle.current ??= createHandle(latest);

	useImperativeHandle(editorRef, () => handle.current!, []);
}

/** The handle itself. Every method reads {@link MarkdownEditorHandleOptions} through `latest`. */
function createHandle(latest: RefObject<MarkdownEditorHandleOptions>): MarkdownEditorHandle {
	/** The editor the user is looking at, or null while the source surface is still mounting. */
	const getActiveEditor = (): LexicalEditor | null => {
		const { mode, richEditor, sourceEditor } = latest.current;

		return mode === "source" ? sourceEditor : richEditor;
	};

	return {
		get mode(): MarkdownEditorMode {
			return latest.current.mode;
		},

		flush: () => latest.current.flush(),

		focus: () => {
			const target = getActiveEditor();

			// A read-only surface has no caret to give, so there is nothing to focus.
			if (latest.current.editable && target) {
				focusEditor(target);
			}
		},

		blur: () => {
			const target = getActiveEditor();

			if (target) {
				blurEditor(target);
			}
		},

		getSelectedMarkdown: () => {
			const { mode, richEditor, sourceCommands } = latest.current;

			if (mode === "source") {
				return sourceCommands.getSelectedText();
			}

			// `$convertSelectionToMarkdownString` answers "" for an empty or collapsed selection.
			return richEditor.read(() => $convertSelectionToMarkdownString());
		},

		insertMarkdown: (markdown: string) => {
			const { mode, richEditor, sourceCommands, editable } = latest.current;

			if (!editable) {
				return;
			}

			if (mode === "source") {
				sourceCommands.insertText(markdown);

				return;
			}

			// Untagged, so the value bridge reports it under the host's `emitMode`,
			// the same as something the user typed.
			richEditor.update(() => {
				// Nothing is selected, so the editor was never focused. Put the caret at the end.
				if (!$isRangeSelection($getSelection())) {
					$getRoot().selectEnd();
				}

				$insertMarkdownNodes($generateNodesFromMarkdownString(markdown));
			});
		},

		undo: () => dispatchHistory(latest.current, UNDO_COMMAND),
		redo: () => dispatchHistory(latest.current, REDO_COMMAND),

		getActiveEditor
	};
}

/** A node that takes a line of its own: a paragraph, a heading, a list, a horizontal rule. */
function $isBlockNode(node: LexicalNode): boolean {
	return ($isElementNode(node) || $isDecoratorNode(node)) && !node.isInline();
}

/** Whether the caret sits in a block that already has something in it. */
function $isCaretInFilledBlock(selection: RangeSelection): boolean {
	const anchorNode = selection.anchor.getNode();
	const block = $isRootOrShadowRoot(anchorNode) ? null : anchorNode.getTopLevelElement();

	return block !== null && (!$isElementNode(block) || !block.isEmpty());
}

/**
 * Puts the nodes the markdown parsed to into the document at the selection.
 *
 * `$insertNodes` has paste semantics: when the caret sits in a block that has text,
 * the first inserted block gives up its own identity and its children join that block.
 * That is right for a paragraph, so `insertMarkdown("tail")` continues the sentence.
 * It is wrong for anything else: `insertMarkdown("## Heading")` at the end of a paragraph
 * would come out as the word "Heading" tacked onto the paragraph, and the markdown would
 * say so too.
 *
 * So a leading block that is not a paragraph goes in through the caret API instead,
 * which splits the block the caret is in and puts each new block in between the halves.
 * Everything else, inline text and paragraphs included, keeps the paste behavior.
 */
function $insertMarkdownNodes(nodes: LexicalNode[]): void {
	const selection = $getSelection();
	const first = nodes[0];

	if (
		!first ||
		!$isRangeSelection(selection) ||
		!$isBlockNode(first) ||
		$isParagraphNode(first) ||
		!$isCaretInFilledBlock(selection)
	) {
		$insertNodes(nodes);

		return;
	}

	// The insert replaces the selection, the same as `$insertNodes` would.
	if (!selection.isCollapsed()) {
		selection.removeText();
	}

	let caret = $caretFromPoint(selection.focus, "next");

	for (const node of nodes) {
		caret = $insertNodeToNearestRootAtCaret(node, caret);
	}

	// The caret ends up after what came in, like it does after typing.
	const last = nodes[nodes.length - 1]!;

	if ($isElementNode(last)) {
		last.selectEnd();
	} else {
		$setSelectionFromCaretRange($getCollapsedCaretRange(caret));
	}
}

/**
 * Undo and redo. Each surface keeps its own history, so this goes to the one on screen:
 * undoing in `source` mode does not walk back edits made in `edit` mode.
 */
function dispatchHistory(options: MarkdownEditorHandleOptions, command: typeof UNDO_COMMAND): void {
	const { mode, richEditor, sourceCommands, editable } = options;

	if (!editable) {
		return;
	}

	if (mode === "source") {
		if (command === UNDO_COMMAND) {
			sourceCommands.undo();
		} else {
			sourceCommands.redo();
		}

		return;
	}

	richEditor.dispatchCommand(command, undefined);
}
