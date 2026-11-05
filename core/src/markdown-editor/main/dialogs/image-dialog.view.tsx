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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { NodeKey } from "lexical";
import { $getNodeByKey, $insertNodes } from "lexical";
import type { FC, KeyboardEvent, ReactElement, RefObject } from "react";
import { useContext, useRef, useState } from "react";
import { Key } from "ts-key-enum";

import { Button } from "../../../button/main/button.view.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { TextField } from "../../../input/text-field/main/template/text-field.tpl.view.js";
import { ModalOverlay } from "../../../modal-overlay/main/modal-overlay.view.js";
import { composeImage } from "../modes/source-commands.js";
import { $createImageNode, $isImageNode } from "../nodes/image-node.js";
import { isAllowedImageSrc } from "../utils/helpers.js";

import {
	StyledDialog,
	StyledDialogBody,
	StyledDialogError,
	StyledDialogFooter,
	StyledDialogHeading
} from "./dialogs.styled.js";

/** An image already in the document, and what it says now. */
export interface EditedImage {
	nodeKey: NodeKey;
	src: string;
	altText: string;
	title?: string;
}

interface ImageDialogProps {
	isSourceMode: boolean;

	onInsertMdToSource: (markdown: string) => void;

	/**
	 * The image to change, with the fields it starts with. Left out to insert a new one.
	 *
	 * Only rich edit mode can hand one over: it comes from the right-click menu on an image,
	 * and that menu is off in source and view mode.
	 */
	editing?: EditedImage;

	onClose: () => void;
}

/**
 * Puts an image in the document from a URL, or changes one that is already there.
 * Works in whichever mode the user is in.
 *
 * The typed address goes through {@link isAllowedImageSrc} first,
 * so `javascript:` and the other blocked schemes show an error instead of ending up in the text.
 */
export const ImageDialog: FC<ImageDialogProps> = ({ isSourceMode, onInsertMdToSource, editing, onClose }) => {
	const [richEditor] = useLexicalComposerContext();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);

	const srcRef = useRef(editing?.src ?? "");
	const altRef = useRef(editing?.altText ?? "");
	const titleRef = useRef(editing?.title ?? "");

	const [error, setError] = useState<string | undefined>(undefined);

	const closeDialog = (): void => {
		onClose();

		if (!isSourceMode) {
			richEditor.focus();
		}
	};

	const handleSubmit = (): void => {
		const trimmedSrc = srcRef.current.trim();

		// Empty and refused look the same to the user: the dialog stays open and says so.
		if (!trimmedSrc || !isAllowedImageSrc(trimmedSrc)) {
			setError(titles?.imageInvalid ?? "Invalid or disallowed image URL.");

			return;
		}

		const altText = altRef.current.trim();
		const title = titleRef.current.trim();

		if (editing) {
			richEditor.update(() => {
				const node = $getNodeByKey(editing.nodeKey);

				if ($isImageNode(node)) {
					// `title` is "" when the field was emptied, not `undefined`.
					// `updateImage` skips what it is not given, and an emptied field is something to write.
					node.updateImage({ src: trimmedSrc, altText, title });
				}
			});

			closeDialog();

			return;
		}

		if (isSourceMode) {
			onInsertMdToSource(composeImage(altText, trimmedSrc, title));
			closeDialog();

			return;
		}

		richEditor.focus();
		richEditor.update(() => {
			$insertNodes([
				$createImageNode({
					src: trimmedSrc,
					altText,
					title: title || undefined
				})
			]);
		});

		closeDialog();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === Key.Enter) {
			event.preventDefault();
			handleSubmit();
		}
	};

	/** The three text fields differ only in label, role and the ref they fill. */
	const renderField = (
		dataRole: string,
		label: string | undefined,
		valueRef: RefObject<string>,
		autoFocus = false
	): ReactElement => (
		<div data-role={dataRole}>
			<TextField
				label={label}
				// Uncontrolled, so the ref doubles as the starting value: filled in while editing, empty otherwise.
				inputProps={{ value: undefined, defaultValue: valueRef.current }}
				autoFocus={autoFocus}
				onChange={(event) => (valueRef.current = event.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);

	const dialogTitle = editing ? titles?.imageEditDialogTitle : titles?.imageDialogTitle;

	return (
		<ModalOverlay onClose={closeDialog} closeOnEsc closeOnOutsideClick focusOnOpen maxWidth={512}>
			<StyledDialog
				role="dialog"
				aria-modal="true"
				aria-label={dialogTitle}
				data-role={DataRoles.MarkdownEditor.Dialog.Wrapper}
			>
				<StyledDialogHeading data-role={DataRoles.MarkdownEditor.Dialog.Title}>{dialogTitle}</StyledDialogHeading>
				<StyledDialogBody>
					{renderField(DataRoles.MarkdownEditor.Dialog.Field, titles?.imageSrcLabel, srcRef, true)}
					{renderField(DataRoles.MarkdownEditor.Dialog.Field, titles?.imageAltLabel, altRef)}
					{renderField(DataRoles.MarkdownEditor.Dialog.Field, titles?.imageTitleLabel, titleRef)}
					{error && <StyledDialogError data-role={DataRoles.MarkdownEditor.Dialog.Error}>{error}</StyledDialogError>}
				</StyledDialogBody>
				<StyledDialogFooter data-role={DataRoles.MarkdownEditor.Dialog.Footer}>
					<Button
						secondary
						label={titles?.cancel}
						onClick={closeDialog}
						dataRole={DataRoles.MarkdownEditor.Dialog.Action}
					/>
					<Button
						primary
						label={editing ? titles?.imageUpdate : titles?.imageSubmit}
						onClick={handleSubmit}
						dataRole={DataRoles.MarkdownEditor.Dialog.Action}
					/>
				</StyledDialogFooter>
			</StyledDialog>
		</ModalOverlay>
	);
};

ImageDialog.displayName = "MarkdownImageDialog";
