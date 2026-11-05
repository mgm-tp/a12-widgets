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
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue";
import type { ChangeEvent, ReactElement } from "react";
import { useContext, useRef, useState } from "react";

import { Button } from "../../../../button/main/button.view.js";
import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../../common/main/data-roles.js";
import { useUnmount } from "../../../../common/main/hooks.js";
import { ModalOverlay } from "../../../../modal-overlay/main/modal-overlay.view.js";
import { useMarkdownEditorSurfaces } from "../../shared/surfaces-context.js";

import { INSERT_IMAGE_UPLOAD_COMMAND } from "./image-upload.commands.js";
import { ImageUploadExtension } from "./image-upload.extension.js";
import {
	StyledUploadArea,
	StyledUploadDialog,
	StyledUploadDialogError,
	StyledUploadDialogFooter,
	StyledUploadDialogHeading,
	StyledUploadHint
} from "./image-upload.styled.js";
import { composeImage, getImageUploadTitles } from "./image-upload.utils.js";

export function ImageUploadDialog({ onClose }: { onClose: () => void }): ReactElement {
	const [richEditor] = useLexicalComposerContext();
	const { isSourceMode, sourceCommands } = useMarkdownEditorSurfaces();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const uploadTitles = getImageUploadTitles(titles);

	// Signals, not the plain config: the host can change either through `ImageUploadPlugin`'s props
	// while the editor runs and the dialog has to show the current values.
	// Reading them throws without `ImageUploadExtension`, which is right — this dialog only uploads.
	const accept = useExtensionSignalValue(ImageUploadExtension, "accept");
	const onImageUpload = useExtensionSignalValue(ImageUploadExtension, "onImageUpload");

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const [error, setError] = useState<string | undefined>(undefined);
	const [isUploading, setIsUploading] = useState(false);

	// Closing the dialog mid-upload drops the request.
	useUnmount(() => abortControllerRef.current?.abort());

	const closeDialog = (): void => {
		onClose();

		if (!isSourceMode) {
			richEditor.focus();
		}
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		event.target.value = "";

		if (!file) {
			return;
		}

		if (!isSourceMode) {
			richEditor.dispatchCommand(INSERT_IMAGE_UPLOAD_COMMAND, [file]);
			closeDialog();

			return;
		}

		// Source mode uploads right here, so without a handler there is nothing to do.
		if (!onImageUpload) {
			return;
		}

		setIsUploading(true);
		setError(undefined);
		const controller = new AbortController();
		abortControllerRef.current = controller;

		try {
			const result = await onImageUpload(file, { signal: controller.signal });

			sourceCommands.insertText(composeImage(result.altText ?? "", result.src, result.title));
			closeDialog();
		} catch {
			if (!controller.signal.aborted) {
				setError(uploadTitles.failed);
			}
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<ModalOverlay onClose={closeDialog} closeOnEsc closeOnOutsideClick focusOnOpen maxWidth={512}>
			<StyledUploadDialog
				role="dialog"
				aria-modal="true"
				aria-label={titles?.imageDialogTitle}
				data-role={DataRoles.MarkdownEditor.Dialog.Wrapper}
			>
				<StyledUploadDialogHeading data-role={DataRoles.MarkdownEditor.Dialog.Title}>
					{titles?.imageDialogTitle}
				</StyledUploadDialogHeading>
				<StyledUploadArea>
					<Button
						secondary
						label={uploadTitles.chooseFile}
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploading}
						dataRole={DataRoles.MarkdownEditor.Dialog.Action}
					/>
					<input
						ref={fileInputRef}
						type="file"
						accept={accept}
						aria-label={uploadTitles.chooseFile}
						onChange={handleFileChange}
						data-role={DataRoles.MarkdownEditor.Dialog.Field}
					/>
					{isUploading && <StyledUploadHint>{uploadTitles.uploading}</StyledUploadHint>}
				</StyledUploadArea>
				{error && (
					<StyledUploadDialogError data-role={DataRoles.MarkdownEditor.Dialog.Error}>{error}</StyledUploadDialogError>
				)}
				<StyledUploadDialogFooter data-role={DataRoles.MarkdownEditor.Dialog.Footer}>
					<Button
						secondary
						label={titles?.cancel}
						onClick={closeDialog}
						dataRole={DataRoles.MarkdownEditor.Dialog.Action}
					/>
				</StyledUploadDialogFooter>
			</StyledUploadDialog>
		</ModalOverlay>
	);
}

ImageUploadDialog.displayName = "MarkdownImageUploadDialog";
