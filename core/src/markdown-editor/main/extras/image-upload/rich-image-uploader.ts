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

import { $getNodeByKey, $insertNodes } from "lexical";
import type { NodeKey } from "lexical";

import type { ImageUploaderOptions, UploadedImage } from "./image-upload.api.js";
import { filterAcceptedFiles, getFileBaseName } from "./image-upload.utils.js";
import { $createUploadImageNode, $isUploadImageNode, UploadImageNode } from "./upload-image-node.js";

/**
 * Runs the rich surface's image uploads.
 *
 * Puts a placeholder in the document, hands the file to the host's upload handler,
 * then writes back what comes out: the real URL, or an error the user can retry.
 * An upload is dropped when its placeholder goes away — deleted, undone, or the editor unmounted.
 */
export class RichImageUploader {
	private readonly options: ImageUploaderOptions;

	private readonly pendingUploadsMap = new Map<NodeKey, AbortController>();

	/** The temporary `blob:` URL each placeholder is showing, so it can be revoked later. */
	private readonly previewUrlsMap = new Map<NodeKey, string>();

	private readonly unregisterImageNodeMutations: () => void;

	constructor(options: ImageUploaderOptions) {
		this.options = options;

		this.unregisterImageNodeMutations = options.editor.registerMutationListener(UploadImageNode, (mutations) => {
			for (const [key, mutation] of mutations) {
				if (mutation === "destroyed") {
					this.pendingUploadsMap.get(key)?.abort();
					this.pendingUploadsMap.delete(key);
					this.revokePreview(key);
				}
			}
		});
	}

	/** Revokes the temporary `blob:` URL a placeholder was showing, so the browser can free the memory. */
	private revokePreview(nodeKey: NodeKey): void {
		const previewUrl = this.previewUrlsMap.get(nodeKey);

		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			this.previewUrlsMap.delete(nodeKey);
		}
	}

	/** Shows the file straight away, from a local `blob:` URL, then starts uploading it. */
	private insertPlaceholderBeforeUpload(file: File): void {
		const { editor } = this.options;
		const previewUrl = URL.createObjectURL(file);

		let nodeKey: NodeKey | undefined;

		// Lexical can run the `editor.update()` body later — paste and drop are already inside an update,
		// so this one waits. `nodeKey` is only set once that body runs, hence reading it in `onUpdate`.
		editor.update(
			() => {
				const placeholder = $createUploadImageNode({
					src: previewUrl,
					altText: getFileBaseName(file),
					uploadState: "uploading",
					file
				});

				$insertNodes([placeholder]);
				nodeKey = placeholder.getKey();
			},
			{
				onUpdate: () => {
					if (nodeKey === undefined) {
						URL.revokeObjectURL(previewUrl);
					} else {
						this.previewUrlsMap.set(nodeKey, previewUrl);
						this.upload(nodeKey, file);
					}
				}
			}
		);
	}

	/** Puts the uploaded URL on the placeholder. A URL the URL policy blocks counts as a failed upload. */
	private resolvePlaceholder(nodeKey: NodeKey, result: UploadedImage): void {
		const { editor, isAllowedUrl, announce } = this.options;

		this.pendingUploadsMap.delete(nodeKey);

		editor.update(() => {
			const node = $getNodeByKey(nodeKey);

			if (!$isUploadImageNode(node)) {
				return;
			}

			if (!isAllowedUrl(result.src)) {
				node.failUpload();
				announce("urlRejected");

				return;
			}

			this.revokePreview(nodeKey);
			node.finishUpload(result);
			announce("uploaded");
		});
	}

	/** Marks the placeholder failed, so the user gets an error and a Retry button. */
	private rejectPlaceholder(nodeKey: NodeKey, file: File, error: unknown, signal: AbortSignal): void {
		const { editor, onError, announce } = this.options;

		this.pendingUploadsMap.delete(nodeKey);

		// The uploader aborted this itself, so the placeholder is already gone. Nothing failed.
		if (signal.aborted) {
			return;
		}

		editor.update(() => {
			const node = $getNodeByKey(nodeKey);

			if ($isUploadImageNode(node)) {
				node.failUpload();
			}
		});

		onError?.(error, file);
		announce("failed");
	}

	/** Calls the host's handler for one placeholder, and keeps its abort handle. */
	private upload(nodeKey: NodeKey, file: File): void {
		const { handler, announce } = this.options;

		// The handler is given the signal, so the host can drop the request when the upload is aborted.
		const abortController = new AbortController();

		// Kept under the node's key: deleting the placeholder is what aborts this upload.
		this.pendingUploadsMap.set(nodeKey, abortController);

		// Screen readers only ever see the spinner, so say it out loud.
		announce("uploading");

		// Nothing awaits this: the two outcomes write back to the node on their own.
		handler(file, { signal: abortController.signal })
			.then((result) => this.resolvePlaceholder(nodeKey, result))
			// The signal comes along so `rejectPlaceholder` can tell a real failure from a deliberate abort.
			.catch((error: unknown) => this.rejectPlaceholder(nodeKey, file, error, abortController.signal));
	}

	/** Uploads the given files. Rejected ones are announced, never inserted. */
	public uploadFiles(files: File[]): void {
		const { announce, config } = this.options;
		const { acceptedFiles, rejectedFiles } = filterAcceptedFiles(files, config);

		for (const { reason } of rejectedFiles) {
			announce(reason === "size-too-large" ? "tooLarge" : "typeRejected");
		}

		for (const file of acceptedFiles) {
			this.insertPlaceholderBeforeUpload(file);
		}
	}

	/** Runs a failed upload again. The file is still on the placeholder, which is what makes this possible. */
	public retry(nodeKey: NodeKey): void {
		const { editor } = this.options;

		const file = editor.read(() => {
			const node = $getNodeByKey(nodeKey);

			return $isUploadImageNode(node) ? node.getFile() : undefined;
		});

		// No file means no placeholder to retry — it was deleted, or this upload came from a URL.
		if (!file) {
			return;
		}

		editor.update(() => {
			const node = $getNodeByKey(nodeKey);

			if ($isUploadImageNode(node)) {
				node.startUpload();
			}
		});

		this.upload(nodeKey, file);
	}

	/** Aborts every upload still running and stops listening for `ImageNode` mutations. */
	public abortPendingUploads(): void {
		for (const upload of this.pendingUploadsMap.values()) {
			upload.abort();
		}

		this.pendingUploadsMap.clear();

		for (const previewUrl of this.previewUrlsMap.values()) {
			URL.revokeObjectURL(previewUrl);
		}

		this.previewUrlsMap.clear();
		this.unregisterImageNodeMutations();
	}
}
