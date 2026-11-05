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

import type { Signal } from "@lexical/extension";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import { useSignalValue } from "@lexical/react/useExtensionSignalValue";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import type { ReactElement } from "react";
import { useContext, useEffect, useState } from "react";

import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../../common/main/data-roles.js";
import { HiddenText } from "../../../../common/main/hidden-text/index.js";
import { useLatest } from "../../../../common/main/hooks.js";
import { noop } from "../../../../common/main/utils.js";
import { useMarkdownEditorSurfaces } from "../../shared/surfaces-context.js";
import { isAllowedImageSrc } from "../../utils/helpers.js";

import type {
	ImageUploadAnnouncement,
	ImageUploadConfig,
	ImageUploadContext,
	ImageUploadExtensionConfig,
	UploadedImage
} from "./image-upload.api.js";
import { INSERT_IMAGE_UPLOAD_COMMAND, RETRY_IMAGE_UPLOAD_COMMAND } from "./image-upload.commands.js";
import { ImageUploadExtension } from "./image-upload.extension.js";
import { getImageUploadTitles } from "./image-upload.utils.js";
import { registerSourceFileTransfer } from "./register-source-file-transfer.js";
import { RichImageUploader } from "./rich-image-uploader.js";
import { SourceImageUploader } from "./source-image-uploader.js";

/**
 * Writes a prop value into its signal, but only when the host passed one.
 * A prop left out must not wipe what `configExtension` set.
 */
function assignSignalValue<T>(signal: Signal<T>, value: T): void {
	if (value !== undefined) {
		signal.value = value;
	}
}

/**
 * Runs image upload: drag & drop, paste and the file the dialog picks.
 *
 * Mount it through the `plugins` prop, alongside {@link ImageUploadExtension} in `extensions`.
 * The extension swaps in the image node that can carry an upload; this holds the config and does the uploading.
 * Values given here may change on any render and the change reaches the next file
 * without rebuilding the editor or disturbing an upload already running:
 *
 * ```tsx
 * const EDITOR_EXTENSIONS = [ImageUploadExtension];
 *
 * <MarkdownEditor
 *   value={markdown}
 *   onChange={setMarkdown}
 *   extensions={EDITOR_EXTENSIONS}
 *   plugins={<ImageUploadPlugin onImageUpload={uploadToMyBackend} maxSizeBytes={limit} />}
 * />
 * ```
 *
 * `configExtension(ImageUploadExtension, { … })` still works for values that never change.
 * A prop given here wins; a prop left out keeps whatever the config set.
 *
 * One instance for the whole editor. It drives whichever surface the user can see:
 * {@link RichImageUploader} resolves a placeholder node in rich mode,
 * {@link SourceImageUploader} writes a line of markdown in source mode.
 * It is a React component, not part of the extension, because the editor has two Lexical
 * editors inside it: the rich one and, in source mode, a second one. An extension only sees
 * the editor it was built with. This component reads both from `useMarkdownEditorSurfaces()`.
 */
export function ImageUploadPlugin({
	onImageUpload,
	onImageUploadError,
	isAllowedUrl,
	accept,
	maxSizeBytes
}: ImageUploadExtensionConfig = {}): ReactElement {
	const { richEditor, sourceEditor, isSourceMode } = useMarkdownEditorSurfaces();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);

	// Throws when the host mounted this without `ImageUploadExtension`.
	const { output } = useExtensionDependency(ImageUploadExtension);
	const [liveMessage, setLiveMessage] = useState("");

	// Props override the extension config, landing in the signals the uploader reads,
	// so the host can change any of them mid-session. Written during render, not in an effect,
	// because `hasHandler` below reads one of these signals and would miss the first render.
	assignSignalValue(output.onImageUpload, onImageUpload);
	assignSignalValue(output.onImageUploadError, onImageUploadError);
	assignSignalValue(output.isAllowedUrl, isAllowedUrl);
	assignSignalValue(output.accept, accept);
	assignSignalValue(output.maxSizeBytes, maxSizeBytes);

	const hasUploadHandler = useSignalValue(output.onImageUpload) !== undefined;

	// Files land on the surface the user can see. `sourceEditor` is null outside source mode,
	// and for one render after switching into it, so there is nothing to drive until it arrives.
	const editor = isSourceMode ? sourceEditor : richEditor;

	const messages: Record<ImageUploadAnnouncement, string> = getImageUploadTitles(titles);

	// Latest-ref because the strings are rebuilt every render and the uploader must not be recreated over that
	// recreating aborts live uploads. The config needs no such care: it is read from signals when it is used.
	const latestMessages = useLatest(messages);

	useEffect(() => {
		// No editor yet, or no handler: nothing to upload with.
		if (!editor || !hasUploadHandler) {
			return;
		}

		// Every value is read when it is used, never captured here, so a change the host makes later applies
		// to the next file without this effect running again.
		const uploaderOptions = {
			editor,
			handler: (file: File, context: ImageUploadContext): Promise<UploadedImage> => {
				// The handler the host has now, not the one it had when the uploader was built.
				const handler = output.onImageUpload.peek();

				if (!handler) {
					return Promise.reject(new Error("No image upload handler is configured."));
				}

				return handler(file, context);
			},
			onError: (error: unknown, file: File): void => output.onImageUploadError.peek()?.(error, file),
			isAllowedUrl: (url: string): boolean => output.isAllowedUrl.peek()?.(url) ?? isAllowedImageSrc(url),
			get config(): ImageUploadConfig {
				return { accept: output.accept.peek(), maxSizeBytes: output.maxSizeBytes.peek() };
			},
			announce: (message: ImageUploadAnnouncement): void => setLiveMessage(latestMessages.current[message])
		};

		const uploader = isSourceMode ? new SourceImageUploader(uploaderOptions) : new RichImageUploader(uploaderOptions);

		const unregister = mergeRegister(
			// Rich text raises this itself. Source mode has nothing that would, so it is registered there.
			isSourceMode ? registerSourceFileTransfer(editor) : noop,
			editor.registerCommand(
				DRAG_DROP_PASTE,
				(files) => {
					uploader.uploadFiles(files);

					return true;
				},
				COMMAND_PRIORITY_EDITOR
			),
			editor.registerCommand(
				INSERT_IMAGE_UPLOAD_COMMAND,
				(files) => {
					uploader.uploadFiles(files);

					return true;
				},
				COMMAND_PRIORITY_EDITOR
			),
			// Only rich mode has a placeholder node, which is what a retry needs to find its file again.
			// Left unhandled in source mode, so nothing else that listens for it is shadowed.
			uploader instanceof RichImageUploader
				? editor.registerCommand(
						RETRY_IMAGE_UPLOAD_COMMAND,
						(nodeKey) => {
							uploader.retry(nodeKey);

							return true;
						},
						COMMAND_PRIORITY_EDITOR
					)
				: noop
		);

		return (): void => {
			unregister();
			uploader.abortPendingUploads();
		};
	}, [editor, isSourceMode, output, hasUploadHandler, latestMessages]);

	return (
		<HiddenText role="status" htmlAttributes={{ "aria-atomic": "true", "data-role": DataRoles.A11yLiveRegion }}>
			{liveMessage}
		</HiddenText>
	);
}

ImageUploadPlugin.displayName = "MarkdownImageUploadPlugin";
