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

import { $getRoot, $getSelection, $isRangeSelection } from "lexical";

import type { SelectionOffsets } from "../../source-highlighting/block-offsets.js";
import {
	$captureSourceDocumentSelection,
	$restoreSourceDocumentSelection
} from "../../source-highlighting/block-offsets.js";

import type { ImageUploaderOptions, UploadedImage } from "./image-upload.api.js";
import { composeImage, filterAcceptedFiles, getFileBaseName } from "./image-upload.utils.js";

/**
 * Where the next image goes.
 *
 * Read once when the batch starts, then moved after each image.
 * Otherwise every image lands in the same place.
 */
interface InsertPoint {
	/** The spot, as character offsets. Null if there was no caret to read. */
	offsets: SelectionOffsets | null;

	/** Images written so far. The first goes on the caret's line, the rest on new lines. */
	written: number;
}

/**
 * Runs the source surface's image uploads.
 *
 * Nothing is written until the host's handler resolves. Source mode is plain text:
 * no node to hold a spinner, no `File` to keep for a retry.
 * The wait is announced instead. A screen reader never saw the spinner anyway.
 *
 * An upload stops when the surface unmounts. Nothing else stops one:
 * rich mode cancels by deleting the placeholder and there is no placeholder here.
 */
export class SourceImageUploader {
	private readonly options: ImageUploaderOptions;

	private readonly pendingUploads = new Set<AbortController>();

	constructor(options: ImageUploaderOptions) {
		this.options = options;
	}

	/** Writes one finished image as markdown, then sets the insert point after it. */
	private insertImage(point: InsertPoint, result: UploadedImage, file: File): void {
		const { editor, announce } = this.options;

		editor.update(() => {
			if (point.offsets !== null) {
				$restoreSourceDocumentSelection(point.offsets);
			}

			let selection = $getSelection();

			// No caret to write at: the surface was never focused, or the text at the saved offsets is gone.
			// The end of the document is the best guess left.
			if (!$isRangeSelection(selection)) {
				$getRoot().selectEnd();
				selection = $getSelection();
			}

			if (!$isRangeSelection(selection)) {
				return;
			}

			const markdown = composeImage(result.altText ?? getFileBaseName(file), result.src, result.title);

			// One image per line. The first uses the caret's line.
			selection.insertText(point.written === 0 ? markdown : `\n${markdown}`);
			point.written += 1;

			// `insertText` leaves the caret after the new text, which is where the next image goes.
			point.offsets = $captureSourceDocumentSelection();
		});

		announce("uploaded");
	}

	/** Calls the host's handler for one file and writes the result. */
	private upload(file: File, point: InsertPoint): void {
		const { handler, onError, announce, isAllowedUrl } = this.options;
		const abortController = new AbortController();

		this.pendingUploads.add(abortController);

		// Nothing is on screen while this runs, so the message is the only sign of it.
		announce("uploading");

		handler(file, { signal: abortController.signal })
			.then((result) => {
				this.pendingUploads.delete(abortController);

				if (abortController.signal.aborted) {
					return;
				}

				if (!isAllowedUrl(result.src)) {
					announce("urlRejected");

					return;
				}

				this.insertImage(point, result, file);
			})
			.catch((error: unknown) => {
				this.pendingUploads.delete(abortController);

				// The uploader aborted this itself. Nothing failed.
				if (abortController.signal.aborted) {
					return;
				}

				onError?.(error, file);
				announce("failed");
			});
	}

	/**
	 * Uploads the given files. Rejected ones are announced, never inserted.
	 *
	 * Reads the caret at once, so this must run inside an editor context.
	 * Every caller is a command listener, and Lexical runs those inside an update.
	 */
	public uploadFiles(files: File[]): void {
		const { announce, config } = this.options;
		const { acceptedFiles, rejectedFiles } = filterAcceptedFiles(files, config);

		for (const { reason } of rejectedFiles) {
			announce(reason === "size-too-large" ? "tooLarge" : "typeRejected");
		}

		if (acceptedFiles.length === 0) {
			return;
		}

		// The caret has usually moved by the time the first upload finishes,
		// and the images belong where the user dropped or pasted them.
		const point: InsertPoint = { offsets: $captureSourceDocumentSelection(), written: 0 };

		for (const file of acceptedFiles) {
			this.upload(file, point);
		}
	}

	/** Aborts every upload still running. */
	public abortPendingUploads(): void {
		for (const upload of this.pendingUploads) {
			upload.abort();
		}

		this.pendingUploads.clear();
	}
}
