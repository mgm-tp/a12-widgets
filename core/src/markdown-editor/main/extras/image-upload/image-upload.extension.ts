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

import { namedSignals } from "@lexical/extension";
import type { MdastExportHandler } from "@lexical/mdast";
import { MdastImportExtension } from "@lexical/mdast";
import { configExtension, defineExtension, safeCast } from "lexical";
import type { Image } from "mdast";

import { ImageNode } from "../../nodes/image-node.js";

import type { ImageUploadExtensionConfig } from "./image-upload.api.js";
import { ANY_IMAGE_TYPE } from "./image-upload.utils.js";
import { $createUploadImageNode, $isUploadImageNode, UploadImageNode } from "./upload-image-node.js";

interface ImageUploadSignalConfig {
	onImageUpload: undefined | ImageUploadExtensionConfig["onImageUpload"];
	onImageUploadError: undefined | ImageUploadExtensionConfig["onImageUploadError"];
	isAllowedUrl: undefined | ImageUploadExtensionConfig["isAllowedUrl"];
	accept: undefined | ImageUploadExtensionConfig["accept"];
	maxSizeBytes: undefined | ImageUploadExtensionConfig["maxSizeBytes"];
}

/**
 * {@link UploadImageNode} → mdast `image`.
 *
 * Export rules go by node type, and the replaced node has a type of its own,
 * so the editor's own image rule never sees it.
 */
const $exportUploadImage: MdastExportHandler = (node) => {
	if (!$isUploadImageNode(node)) {
		return null;
	}

	// A temporary `src` is a placeholder — the object URL of an upload still running.
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
 * One half of image upload: the node class, the node swap and the markdown rule.
 * The editor picks its node classes when it is built, so a plugin is too late for these.
 *
 * {@link ImageUploadPlugin} is the other half. Image upload needs both:
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
 * Keep `extensions` a module constant or a `useMemo`. A new array builds a new editor.
 *
 * The config below is one signal per key, and both halves write to it: `configExtension` when
 * the editor is built, the plugin's props at any time later. Put a value that changes on the plugin.
 */
export const ImageUploadExtension = defineExtension({
	name: "@a12/MarkdownEditor/ImageUpload",
	// Every key, even the ones with no default: `namedSignals` walks this object once,
	// so a key missing here would get no signal and could never be set later.
	// The host's real values arrive through `configExtension` or {@link ImageUploadPlugin}'s props.
	config: safeCast<ImageUploadSignalConfig>({
		onImageUpload: undefined,
		onImageUploadError: undefined,
		isAllowedUrl: undefined,
		accept: ANY_IMAGE_TYPE,
		maxSizeBytes: undefined
	}),
	// Turns the config into one signal per key, which is what makes it changeable while the editor lives.
	// Read `output` rather than `config` and a new value reaches a running upload without rebuilding the editor.
	build: (_editor, config) => namedSignals(config),
	nodes: [
		UploadImageNode,
		{
			replace: ImageNode,
			with: (node: ImageNode) =>
				$createUploadImageNode({
					src: node.getSrc(),
					altText: node.getAltText(),
					title: node.getTitle()
				}),
			withKlass: UploadImageNode
		}
	],
	// Without this the pictures would stay in the editor and never reach the markdown.
	dependencies: [
		configExtension(MdastImportExtension, {
			exportRules: [{ type: UploadImageNode.getType(), $export: $exportUploadImage }]
		})
	]
});
