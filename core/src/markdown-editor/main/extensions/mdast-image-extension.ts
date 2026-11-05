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

import { configExtension } from "@lexical/extension";
import type { MdastExportHandler, MdastImportHandler } from "@lexical/mdast";
import { MdastImportExtension } from "@lexical/mdast";
import type { LexicalEditor } from "lexical";
import {
	$createNodeSelection,
	$getNearestNodeFromDOMNode,
	$setSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	defineExtension
} from "lexical";
import type { Image, ImageReference } from "mdast";

import { $createImageNode, $isImageNode, ImageNode } from "../nodes/image-node.js";

/**
 * mdast `image` → {@link ImageNode}.
 *
 * CommonMark's `![alt](src "title")`. `@lexical/mdast` 0.48 tokenizes images
 * (micromark handles the syntax) but registers no rule mapping them onto a Lexical node,
 * so unlike headings/lists/tables this one is ours to supply.
 */
const $importImage: MdastImportHandler<Image> = (node) =>
	$createImageNode({
		src: node.url,
		altText: node.alt ?? "",
		title: node.title ?? undefined
	});

/**
 * mdast `imageReference` → {@link ImageNode}.
 *
 * The reference form keeps the address elsewhere: `![alt][id]` at the point of use,
 * `[id]: url` somewhere else in the document. We resolve `id` against those
 * definitions and create an ordinary image, so the markdown becomes `![alt](url)`.
 *
 * Without a matching `[id]: url` we return the literal `![alt][id]` characters as text.
 * `null` would erase them: the importer reads `null` as "this handler created no node"
 * and skips it. No second handler runs — each mdast type has one handler.
 */
const $importImageReference: MdastImportHandler<ImageReference> = (node, ctx) => {
	const definition = ctx.getDefinition(node.identifier);

	if (!definition) {
		return ctx.createText(`![${node.alt ?? ""}][${node.identifier}]`);
	}

	return $createImageNode({
		src: definition.url,
		altText: node.alt ?? "",
		title: definition.title ?? undefined
	});
};

/**
 * {@link ImageNode} → mdast `image`.
 *
 * Export rules are keyed by node type, so a subclass of {@link ImageNode} registers
 * under its own type and reuses this — otherwise its images never reach the markdown.
 * `extras/image-upload` does exactly that.
 */
export const $exportImage: MdastExportHandler = (node) => {
	if (!$isImageNode(node)) {
		return null;
	}

	// A temporary `src` is a placeholder — an object URL during an upload, say.
	// Skip it so a `blob:` URL never reaches the emitted markdown or the source view.
	if (node.hasTemporarySrc()) {
		return null;
	}

	const title = node.getTitle();

	return {
		type: "image",
		url: node.getSrc(),
		alt: node.getAltText(),
		...(title ? { title } : {})
	} satisfies Image;
};

/**
 * Click an image and it gets selected. Then the usual keys work:
 * Backspace or Delete removes it, the arrow keys move past it.
 *
 * Registered at {@link COMMAND_PRIORITY_LOW}, so a consumer can take the click first
 * with their own `CLICK_COMMAND` handler at a higher priority.
 */
function registerImageSelection(editor: LexicalEditor): () => void {
	return editor.registerCommand<MouseEvent>(
		CLICK_COMMAND,
		(event) => {
			if (!editor.isEditable()) {
				return false;
			}

			// We look at the DOM, not at the selection. An image has no cursor,
			// so a click on it sets no selection. The nearest Lexical node also works for a subclass of ImageNode.
			const node = event.target instanceof HTMLElement ? $getNearestNodeFromDOMNode(event.target) : null;

			// An image that is still uploading has its own buttons, like Retry.
			// Leave those clicks alone.
			if (!$isImageNode(node) || node.hasTemporarySrc()) {
				return false;
			}

			const nodeSelection = $createNodeSelection();

			nodeSelection.add(node.getKey());
			$setSelection(nodeSelection);

			return true;
		},
		COMMAND_PRIORITY_LOW
	);
}

/**
 * Image support for the mdast editor: `![alt](src "title")` ⇄ {@link ImageNode}.
 *
 * Micromark already parses both image forms, so all this adds is the mapping onto Lexical:
 * two import rules (`image` and `imageReference`) and one export rule,
 * keyed by the node type `mde-image`. It also selects the image on a click,
 * which is what lets Backspace or Delete remove it.
 */
export const MdastImageExtension = defineExtension({
	name: "@a12/mdast/Image",
	nodes: [ImageNode],
	register: registerImageSelection,
	dependencies: [
		configExtension(MdastImportExtension, {
			importRules: [
				{ type: "image", $import: $importImage },
				{ type: "imageReference", $import: $importImageReference }
			],
			exportRules: [{ type: "mde-image", $export: $exportImage }]
		})
	]
});
