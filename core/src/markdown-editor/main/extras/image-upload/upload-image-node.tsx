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

import { $getPeerDependency } from "@lexical/extension";
import type { EditorConfig, LexicalEditor, LexicalNode } from "lexical";
import { $applyNodeReplacement } from "lexical";
import type { ReactNode } from "react";

import type { ImageNodePayload, SerializedImageNode } from "../../nodes/image-node.js";
import { ImageNode } from "../../nodes/image-node.js";

import { ImageUploadPlaceholder } from "./image-upload-placeholder.view.js";
// Type-only, on purpose. The extension imports this node, so a value import here
// would close the circle. The name below is what looks the extension up at runtime.
import type { ImageUploadExtension } from "./image-upload.extension.js";

export type ImageUploadState = "uploading" | "error";

export interface UploadImageNodePayload extends ImageNodePayload {
	uploadState?: ImageUploadState;

	/** The file behind the upload, kept on the node so a failed one can be run again. */
	file?: File;
}

/**
 * The editor's image node, plus upload state. It behaves as a plain image
 * until something marks it as uploading and it is a plain image again once the upload finishes.
 */
export class UploadImageNode extends ImageNode {
	__uploadState?: ImageUploadState;
	__file?: File;

	static getType(): string {
		return "mde-upload-image";
	}

	static clone(node: UploadImageNode): UploadImageNode {
		return new UploadImageNode(node.__src, node.__altText, node.__title, node.__key);
	}

	/**
	 * Carries the upload across a clone. Lexical's own way of adding fields to a node,
	 * it runs on every clone and `super` takes care of the parent's own state,
	 * so a subclass of this one keeps working too.
	 */
	afterCloneFrom(prevNode: this): void {
		super.afterCloneFrom(prevNode);
		this.__uploadState = prevNode.__uploadState;
		this.__file = prevNode.__file;
	}

	static importJSON(serializedNode: SerializedImageNode): UploadImageNode {
		return $createUploadImageNode({ src: serializedNode.src, altText: serializedNode.altText }).updateFromJSON(
			serializedNode
		);
	}

	/** The file behind this image's upload, if it still has one. */
	getFile(): File | undefined {
		return this.getLatest().__file;
	}

	/**
	 * An unfinished upload is what makes the `src` a placeholder, so this is the whole answer
	 * to {@link ImageNode.hasTemporarySrc} — the editor excludes the picture from the markdown
	 * and from the URL policy while it is set.
	 */
	hasTemporarySrc(): boolean {
		return this.getLatest().__uploadState !== undefined;
	}

	/** Marks the image as uploading, which is what makes the `src` temporary. */
	startUpload(file?: File): void {
		const writable = this.getWritable();
		writable.__uploadState = "uploading";

		if (file !== undefined) {
			writable.__file = file;
		}
	}

	/** Marks the upload as failed, which is what puts the error and the Retry button up. */
	failUpload(): void {
		this.getWritable().__uploadState = "error";
	}

	/**
	 * Completes the upload. The real URL, plus any alt or title, replaces the placeholders,
	 * and the upload state is cleared, so this is an ordinary image again.
	 */
	finishUpload(image: { src: string; altText?: string; title?: string }): void {
		this.updateImage(image);

		const writable = this.getWritable();
		writable.__uploadState = undefined;
		writable.__file = undefined;
	}

	/**
	 * The same job as {@link ImageNode.sanitizeSrc}, but asking the host's rule first.
	 *
	 * A host that uploads to its own backend often serves the pictures from somewhere
	 * the built-in rule does not know — an `data:` URL from a demo, a private scheme,
	 * a CDN behind something other than `http:`. They say so once, through
	 * `isAllowedUrl` on the extension or on {@link ImageUploadPlugin}.
	 *
	 * Before this override only the uploader read that rule. The picture was accepted,
	 * stored, and then drawn as `about:blank`, because drawing still used the built-in
	 * list. Now both ends ask the same question.
	 *
	 * With no rule from the host, this falls back to `super` — the plain `http:`/`https:` list.
	 */
	sanitizeSrc(src: string): string {
		// While an upload runs the `src` is a local blob URL, which no protocol list accepts.
		// The real address is checked when the upload ends.
		if (this.hasTemporarySrc()) {
			return src;
		}

		const isAllowedUrl = $getPeerDependency<typeof ImageUploadExtension>(
			"@a12/MarkdownEditor/ImageUpload"
		)?.output.isAllowedUrl.peek();

		if (isAllowedUrl === undefined) {
			return super.sanitizeSrc(src);
		}

		return isAllowedUrl(src) ? src : "about:blank";
	}

	decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
		const image = super.decorate(editor, config);

		if (this.__uploadState === undefined) {
			return image;
		}

		return (
			<ImageUploadPlaceholder
				editor={editor}
				nodeKey={this.getKey()}
				src={this.__src}
				altText={this.__altText}
				title={this.__title}
				uploadState={this.__uploadState}
			/>
		);
	}
}

export function $createUploadImageNode({
	src,
	altText,
	title,
	key,
	uploadState,
	file
}: UploadImageNodePayload): UploadImageNode {
	const node = new UploadImageNode(src, altText, title, key);
	node.__uploadState = uploadState;
	node.__file = file;

	return $applyNodeReplacement(node);
}

export function $isUploadImageNode(node: LexicalNode | null | undefined): node is UploadImageNode {
	return node instanceof UploadImageNode;
}
