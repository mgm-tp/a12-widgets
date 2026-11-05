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

/**
 * What the upload live region can say. The uploaders announce one of these keys;
 * the live region turns it into the user's language.
 */
export type ImageUploadAnnouncement = "uploading" | "uploaded" | "failed" | "tooLarge" | "typeRejected" | "urlRejected";

/** What the `onImageUpload` handler gives back. */
export interface UploadedImage {
	/** The URL to embed (must survive a reload — not a transient `blob:` URL). */
	src: string;

	/** Optional alt text; defaults to the file name when omitted. */
	altText?: string;

	/** Optional image title. */
	title?: string;
}

/** Context handed to the `onImageUpload` handler. */
export interface ImageUploadContext {
	/**
	 * Aborted when the in-flight upload is no longer needed — the placeholder was deleted or undone,
	 * or the editor unmounted. Honour it to cancel the request.
	 */
	signal: AbortSignal;
}

/**
 * Client-side gate applied before the `onImageUpload` handler is called for a dropped,
 * pasted or picked file.
 */
export interface ImageUploadConfig {
	/**
	 * MIME allowlist for the file picker and the drop/paste filter.
	 * @default "image/*"
	 */
	accept?: string;

	/** Reject files larger than this many bytes before calling the handler. */
	maxSizeBytes?: number;
}

export interface ImageUploaderOptions {
	/** The editor the image goes into — whichever surface the user can see. */
	editor: LexicalEditor;

	/** The host's upload handler. It decides where the file actually goes. */
	handler: (file: File, context: ImageUploadContext) => Promise<UploadedImage>;

	/** Told when an upload fails, so the host can log it. Nothing is written either way. */
	onError?: (error: unknown, file: File) => void;

	/** URL policy the resolved `src` must satisfy. */
	isAllowedUrl: (url: string) => boolean;

	/** Which file types and sizes to take. Everything passes when it is missing. */
	config?: ImageUploadConfig;

	/** Says something out loud, as a key — the plugin's live region turns it into the user's language. */
	announce: (message: ImageUploadAnnouncement) => void;
}

export interface ImageUploadExtensionConfig extends ImageUploadConfig {
	/**
	 * Uploads the file and resolves the URL to embed. The backend is entirely up to the host:
	 * it receives the {@link File} and resolves the {@link UploadedImage}.
	 */
	onImageUpload?: (file: File, context: ImageUploadContext) => Promise<UploadedImage>;

	/**
	 * Called when an {@link onImageUpload} attempt rejects (after the inline error
	 * placeholder is shown), for logging or host-level notifications.
	 */
	onImageUploadError?: (error: unknown, file: File) => void;

	/**
	 * Says whether an uploaded URL may go in the document. Give it the same rule
	 * the editor's own `isAllowedUrl` uses for images, or leave it out for the built-in one.
	 */
	isAllowedUrl?: (url: string) => boolean;
}
