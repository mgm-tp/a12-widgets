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

import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { eventFiles, mergeRegister } from "@lexical/utils";
import type { LexicalEditor } from "lexical";
import {
	$getChildCaretAtIndex,
	$getCollapsedCaretRange,
	$getNearestNodeFromDOMNode,
	$getTextPointCaret,
	$isElementNode,
	$isTextNode,
	$setSelectionFromCaretRange,
	COMMAND_PRIORITY_CRITICAL,
	DROP_COMMAND,
	PASTE_COMMAND
} from "lexical";

/**
 * The text position under a screen point, from the browser.
 *
 * Two APIs for one job: `caretPositionFromPoint` is the standard one,
 * `caretRangeFromPoint` is what WebKit and older Chrome have instead.
 */
function getDomPointAt(x: number, y: number, document: Document): { node: Node; offset: number } | null {
	if (typeof document.caretPositionFromPoint === "function") {
		const position = document.caretPositionFromPoint(x, y);

		return position && { node: position.offsetNode, offset: position.offset };
	}

	const range = document.caretRangeFromPoint(x, y);

	return range && { node: range.startContainer, offset: range.startOffset };
}

/**
 * Puts the caret where the file was dropped,
 * so the image lands under the pointer instead of wherever the caret already was.
 */
function $selectDropPoint(editor: LexicalEditor, event: DragEvent): void {
	const rootElement = editor.getRootElement();
	const domPoint = rootElement && getDomPointAt(event.clientX, event.clientY, rootElement.ownerDocument);

	// Dropped outside this surface, or the browser could not name a position.
	// The caret stays where it is, which is still somewhere in this document.
	if (!rootElement || domPoint === null || !rootElement.contains(domPoint.node)) {
		return;
	}

	const node = $getNearestNodeFromDOMNode(domPoint.node);

	if (node === null) {
		return;
	}

	if ($isTextNode(node)) {
		const caret = $getTextPointCaret(node, "next", domPoint.offset);

		if (caret !== null) {
			$setSelectionFromCaretRange($getCollapsedCaretRange(caret));
		}

		return;
	}

	// Between two nodes, not inside text. An element offset counts its children.
	// For any other node the spot is right after it.
	const parent = $isElementNode(node) ? node : node.getParent();

	if (parent !== null) {
		const index = $isElementNode(node) ? domPoint.offset : node.getIndexWithinParent() + 1;

		$setSelectionFromCaretRange($getCollapsedCaretRange($getChildCaretAtIndex(parent, index, "next")));
	}
}

/**
 * Makes files dropped or pasted into the source surface reach the image upload plugin.
 *
 * `RichTextExtension` dispatches `DRAG_DROP_PASTE` for files by itself, so rich mode needs none of this.
 * `PlainTextExtension` has no such branch: its paste handler returns `true`
 * for any range selection and its drop handler ends at `$handlePlainTextDrop`,
 * which ignores a drag that did not start in a Lexical editor. Either way the files are lost.
 *
 * So these two dispatch the same command rich text would have. They register above plain text,
 * which uses `COMMAND_PRIORITY_EDITOR` and return `false` for every event
 * without files so plain text still handles it.
 */
export function registerSourceFileTransfer(editor: LexicalEditor): () => void {
	return mergeRegister(
		editor.registerCommand<DragEvent>(
			DROP_COMMAND,
			(event) => {
				const [, files] = eventFiles(event);

				if (files.length === 0) {
					return false;
				}

				$selectDropPoint(editor, event);
				editor.dispatchCommand(DRAG_DROP_PASTE, files);
				event.preventDefault();

				return true;
			},
			COMMAND_PRIORITY_CRITICAL
		),
		editor.registerCommand(
			PASTE_COMMAND,
			(event) => {
				const [, files, hasTextContent] = eventFiles(event);

				// An image copied from a web page also carries its markup.
				// Paste that text instead of uploading the picture a second time.
				if (files.length === 0 || hasTextContent) {
					return false;
				}

				editor.dispatchCommand(DRAG_DROP_PASTE, files);
				event.preventDefault();

				return true;
			},
			COMMAND_PRIORITY_CRITICAL
		)
	);
}
