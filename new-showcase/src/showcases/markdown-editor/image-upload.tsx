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

import type { ReactElement } from "react";
import { useState } from "react";

import type { UploadedImage } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import {
	ImageUploadButton,
	ImageUploadExtension,
	ImageUploadPlugin,
	MarkdownEditor
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

// Image upload comes in two halves:
//   - `ImageUploadExtension` in `extensions`: the node that shows a placeholder while the upload runs.
//   - `ImageUploadPlugin` in `plugins`: drop, paste and file picking, plus the upload handler.
// `ImageUploadButton` replaces the built-in image button, whose dialog only takes a URL.
const EXTENSIONS = [ImageUploadExtension];

const TOOLBAR = (
	<MarkdownEditor.Toolbar>
		<MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.BoldButton />
			<MarkdownEditor.ItalicButton />
		</MarkdownEditor.ToolbarGroup>
		<MarkdownEditor.ToolbarSeparator />
		<MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.LinkButton />
			<ImageUploadButton />
		</MarkdownEditor.ToolbarGroup>
		<MarkdownEditor.ModeMenu />
	</MarkdownEditor.Toolbar>
);

// Your backend goes here. It receives the file and answers with the URL to embed.
// This demo has no server, so it reads the file into a `data:` URL after a short delay.
function uploadImage(file: File): Promise<UploadedImage> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const reader = new FileReader();

			reader.onload = () => resolve({ src: String(reader.result), altText: file.name });
			reader.onerror = () => reject(reader.error ?? new Error("Could not read the file"));
			reader.readAsDataURL(file);
		}, 1000);
	});
}

// The built-in URL policy allows `http:`, `https:` and relative URLs only.
// A real backend returns one of those and does not need this override.
const isAllowedImageUrl = (url: string): boolean => url.startsWith("data:") || /^https?:/i.test(url);

const INITIAL_MARKDOWN = `# Image upload

Drag an image file onto the editor, paste one, or click the image button and
choose a file. A placeholder shows while the upload runs; if it fails, the
placeholder offers a retry and the Markdown is left untouched.
`;

export function MarkdownEditorImageUpload(): ReactElement {
	const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
			<MarkdownEditor
				id="markdown-editor-image-upload"
				label="Description"
				value={markdown}
				onChange={setMarkdown}
				extensions={EXTENSIONS}
				plugins={
					<ImageUploadPlugin
						onImageUpload={uploadImage}
						isAllowedUrl={isAllowedImageUrl}
						maxSizeBytes={5 * 1024 * 1024}
					/>
				}
				toolbar={TOOLBAR}
				allowedModes={["edit", "source", "view"]}
				minHeight={300}
			/>
			<details>
				<summary>Markdown value</summary>
				<pre style={{ whiteSpace: "pre-wrap", overflowX: "auto" }}>{markdown}</pre>
			</details>
		</div>
	);
}
