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

import type { NodeKey } from "lexical";
import { $createNodeSelection, $getNearestNodeFromDOMNode, $getNodeByKey, $setSelection } from "lexical";
import type { FC } from "react";
import { useCallback, useContext, useEffect, useState } from "react";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { EditedImage } from "../dialogs/image-dialog.view.js";
import { $isImageNode } from "../nodes/image-node.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { focusEditor } from "../utils/helpers.js";

import { findContextMenuTarget } from "./context-menu.utils.js";
import type { ContextMenuOperation } from "./editor-context-menu.view.js";
import { EditorContextMenu, POINTER_OFFSET } from "./editor-context-menu.view.js";

/** Where the menu opened, and which image it is about. */
interface ImageContextMenuAnchor {
	/** Viewport coordinates, already moved off the pointer by {@link POINTER_OFFSET}. */
	position: { top: number; left: number };

	nodeKey: NodeKey;
}

interface ImageContextMenuProps {
	/** Rich edit mode, editor not disabled. Off everywhere else, so the browser menu comes back. */
	enabled: boolean;

	/** Opens the image dialog on an image that is already there, its fields filled in. */
	onEditImage: (image: EditedImage) => void;
}

/**
 * The key of the image `element` draws, or null when this menu has nothing to offer for it.
 *
 * An image still uploading is left alone: it has its own buttons, like Retry,
 * and no address to edit yet.
 */
function $readImageKey(element: HTMLElement): NodeKey | null {
	const node = $getNearestNodeFromDOMNode(element);

	return $isImageNode(node) && !node.hasTemporarySrc() ? node.getKey() : null;
}

/** Selects the image, which is what draws the border showing which picture the menu is about. */
function $selectImage(nodeKey: NodeKey): void {
	const selection = $createNodeSelection();

	selection.add(nodeKey);
	$setSelection(selection);
}

/**
 * Right-click an image to change it or take it out.
 *
 * "Edit properties" opens the same dialog the toolbar's image button opens, with the
 * address, alt text and title of this picture already in it. "Delete image" removes the node,
 * which is the same thing Backspace does once the image is selected.
 */
export const ImageContextMenu: FC<ImageContextMenuProps> = ({ enabled, onEditImage }) => {
	const { richEditor } = useMarkdownEditorSurfaces();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const [anchor, setAnchor] = useState<ImageContextMenuAnchor | null>(null);

	/** Closes the menu and leaves focus where it is: the user clicked away. */
	const onClickOutside = useCallback((): void => setAnchor(null), []);

	/** Closes the menu and puts the caret back in the text, so typing carries on. */
	const closeAndReturnCaret = useCallback((): void => {
		setAnchor(null);
		focusEditor(richEditor);
	}, [richEditor]);

	useEffect(() => {
		const root = richEditor.getRootElement();

		if (!enabled || !root) {
			return undefined;
		}

		const onContextMenu = (event: MouseEvent): void => {
			const target = findContextMenuTarget(event, root);

			if (target?.kind !== "image") {
				return;
			}

			// `update` runs too late to decide whether to keep the browser's menu,
			// so the node is looked up first and the selection follows.
			const nodeKey = richEditor.read(() => $readImageKey(target.element));

			if (!nodeKey) {
				return;
			}

			event.preventDefault();
			richEditor.update(() => $selectImage(nodeKey));

			setAnchor({
				position: { top: event.clientY + POINTER_OFFSET.top, left: event.clientX + POINTER_OFFSET.left },
				nodeKey
			});
		};

		root.addEventListener("contextmenu", onContextMenu);

		return (): void => root.removeEventListener("contextmenu", onContextMenu);
	}, [richEditor, enabled]);

	// Leaving edit mode with the menu still open.
	useEffect(() => {
		if (!enabled) {
			onClickOutside();
		}
	}, [enabled, onClickOutside]);

	if (!anchor) {
		return null;
	}

	const { nodeKey } = anchor;

	/** Reads what the picture says right now, so the dialog opens on the current values. */
	const editImage = (): void => {
		const image = richEditor.read(() => {
			const node = $getNodeByKey(nodeKey);

			return $isImageNode(node)
				? { nodeKey, src: node.getSrc(), altText: node.getAltText(), title: node.getTitle() }
				: null;
		});

		if (image) {
			onEditImage(image);
		}
	};

	const deleteImage = (): void =>
		richEditor.update(() => {
			const node = $getNodeByKey(nodeKey);

			if ($isImageNode(node)) {
				node.remove();
			}
		});

	const operations: ContextMenuOperation[] = [
		{ key: "editImage", label: titles?.editImage, icon: "edit", run: editImage },
		{ key: "deleteImage", label: titles?.deleteImage, icon: "delete", run: deleteImage }
	];

	return (
		<EditorContextMenu
			position={anchor.position}
			operations={operations}
			listDataRole={DataRoles.MarkdownEditor.ContextMenu.List}
			itemDataRole={DataRoles.MarkdownEditor.ContextMenu.ListItem}
			onClickOutside={onClickOutside}
			onRequestClose={closeAndReturnCaret}
		/>
	);
};

ImageContextMenu.displayName = "MarkdownImageContextMenu";
