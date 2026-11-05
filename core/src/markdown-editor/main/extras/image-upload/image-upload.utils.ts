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

import type { MarkdownEditorTitles } from "../../../../common/main/a11y-localization/a11y-key-definition.api.js";

import type { ImageUploadAnnouncement, ImageUploadConfig } from "./image-upload.api.js";

/**
 * The strings this extension shows, each one filled in.
 *
 * Every {@link ImageUploadAnnouncement} is a key here, so the live-region messages
 * are this object as it stands — one name per announcement, nothing to map.
 */
export interface ImageUploadTitles extends Record<ImageUploadAnnouncement, string> {
	/** Label of the file-picker button in the image dialog. */
	chooseFile: string;

	/** Label of the Retry action on a failed placeholder. */
	retry: string;
}

/**
 * What a host may supply for image upload, under `markdownEditorTitles.imageUpload`.
 * Anything left out falls back to English.
 */
export type ImageUploadResourceTitles = Partial<ImageUploadTitles>;

/*
 * Its own object, not keys on `MarkdownEditorTitles` itself, because the extension ships
 * separately from the editor — the same reason the info panel has `infoPanel`. An
 * extension outside the library writes the same block but names the package,
 * `"@com.mgmtp.a12.widgets/widgets-core"`, in place of the path.
 */
declare module "../../../../common/main/a11y-localization/a11y-key-definition.api.js" {
	interface MarkdownEditorTitles {
		imageUpload?: ImageUploadResourceTitles;
	}
}

/**
 * Reads the extension's own strings out of `markdownEditorTitles.imageUpload`
 * and falls back to English for anything the host did not supply.
 */
export function getImageUploadTitles(titles: MarkdownEditorTitles | undefined): ImageUploadTitles {
	const supplied = titles?.imageUpload;

	function getTitle(key: keyof ImageUploadTitles, fallback: string): string {
		return supplied?.[key] ?? fallback;
	}

	return {
		chooseFile: getTitle("chooseFile", "Choose file…"),
		uploading: getTitle("uploading", "Uploading image…"),
		uploaded: getTitle("uploaded", "Image uploaded."),
		failed: getTitle("failed", "Image upload failed."),
		retry: getTitle("retry", "Retry"),
		tooLarge: getTitle("tooLarge", "The image is too large."),
		typeRejected: getTitle("typeRejected", "That file type is not allowed."),
		urlRejected: getTitle("urlRejected", "That image URL is not allowed.")
	};
}

/** What `accept` falls back to: every image type the browser knows. */
export const ANY_IMAGE_TYPE = "image/*";

/** Why a file never reached the upload handler. */
export type RejectReason = "wrong-type" | "size-too-large";

export interface FilteredFiles {
	acceptedFiles: File[];
	rejectedFiles: Array<{ file: File; reason: RejectReason }>;
}

/**
 * Whether a file's MIME type is one the editor was told to take.
 *
 * @param file - the dropped, pasted or picked file
 * @param accept - comma-separated MIME list, wildcards allowed: `image/*`, `image/png,image/webp`
 * @returns `true` when the type matches an entry, or when the list is empty
 */
function isAcceptedType(file: File, accept: string): boolean {
	const patterns = accept
		.split(",")
		.map((pattern) => pattern.trim())
		.filter(Boolean);

	// `accept: ""` or `accept: ",,"` names no type at all.
	// Take everything rather than reject everything, which would break uploads with no message.
	if (patterns.length === 0) {
		return true;
	}

	return patterns.some((pattern) =>
		pattern.endsWith("/*") ? file.type.startsWith(pattern.slice(0, -1)) : file.type === pattern
	);
}

/** Splits a batch into files to upload and files to reject, each with its reason. */
export function filterAcceptedFiles(files: File[], config?: ImageUploadConfig): FilteredFiles {
	const accept = config?.accept ?? ANY_IMAGE_TYPE;
	const maxSizeBytes = config?.maxSizeBytes;
	const result: FilteredFiles = { acceptedFiles: [], rejectedFiles: [] };

	for (const file of files) {
		if (!isAcceptedType(file, accept)) {
			result.rejectedFiles.push({ file, reason: "wrong-type" });
		} else if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
			result.rejectedFiles.push({ file, reason: "size-too-large" });
		} else {
			result.acceptedFiles.push(file);
		}
	}

	return result;
}

/**
 * Builds an image: `![logo](logo.png)`, or `![logo](logo.png "A12")` with a title.
 *
 * Written out here, not taken from the editor, so this folder stays a blueprint
 * a consumer can copy: an outside plugin writes its own markdown the same way.
 */
export function composeImage(alt: string, url: string, title?: string): string {
	const suffix = title ? ` "${title}"` : "";

	return `![${alt}](${url}${suffix})`;
}

/** Alt-text fallback: the file name without its extension. */
export function getFileBaseName(file: File): string {
	// `photo.png` → `photo`. Only the last extension goes, and never a dot in a folder name.
	return file.name.replace(/\.[^./\\]+$/, "");
}
