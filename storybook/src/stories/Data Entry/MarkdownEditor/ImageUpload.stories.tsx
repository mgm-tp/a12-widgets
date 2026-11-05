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

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";

import { Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ImageUploadButton,
	ImageUploadExtension,
	ImageUploadPlugin,
	MarkdownEditor
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import type { MarkdownEditorProps, UploadedImage } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { MarkdownValuePanel } from "./helpers.js";
import { markdownEditorArgs, sandboxArgTypes } from "./story-args.js";

/*
 * Image upload is not part of the editor. The editor can only write an image whose URL
 * it already has, through the toolbar's image dialog.
 *
 * Uploading a file needs a backend, and the library has none. So the host brings two
 * pieces: `ImageUploadExtension` in `extensions`, which owns the placeholder node, the
 * spinner and the inline error; and `ImageUploadPlugin`, which carries the config —
 * above all the `onImageUpload` handler that takes a `File` and answers with a URL.
 *
 * Both arrays and elements below sit at module scope where they can. A new array on
 * every render rebuilds the editor and throws the document away.
 */

const IMAGE_UPLOAD_MARKDOWN = `# Image upload

Add an image three ways:

- **drag and drop** an image file onto the editor,
- **paste** one from the clipboard, or
- click the **image** button in the toolbar and choose **"Choose file…"**.

While the upload runs you get a placeholder with a spinner. If it fails, the
placeholder turns into an inline error with a **Retry** button, and the markdown
stays as it was — a failed upload never writes a broken image into the value.
`;

const BUILT_IN_TOOLBAR_MARKDOWN = `# No file picker in the dialog

The toolbar below is the built-in one. Its image button opens
\`MarkdownEditor.ImageButton\`'s dialog, which takes a URL and nothing else.

Drag an image file onto the editor, or paste one, and it still uploads: those
belong to \`ImageUploadExtension\`, not to any button. For a dialog that offers a
file too, put \`ImageUploadButton\` in a custom toolbar, as the story above does.
`;

/*
 * This demo has no server, so it reads the file into a `data:` URL instead. Both the
 * editor and the plugin have to be told those are acceptable — the built-in policy
 * allows `http:`, `https:` and relative URLs only, and would refuse this one.
 */
const isAllowedUploadedImageUrl = (url: string): boolean => url.startsWith("data:") || /^https?:/i.test(url);

const UPLOAD_EXTENSIONS = [ImageUploadExtension];

const UPLOAD_TOOLBAR = (
	<MarkdownEditor.Toolbar>
		<MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.BoldButton />
			<MarkdownEditor.ItalicButton />
		</MarkdownEditor.ToolbarGroup>

		<MarkdownEditor.ToolbarSeparator />

		<MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.LinkButton />
			{/* In place of `MarkdownEditor.ImageButton`, whose dialog is URL-only. */}
			<ImageUploadButton />
		</MarkdownEditor.ToolbarGroup>

		{/* A custom toolbar gets no mode menu for free — source mode is how you see the uploaded URL. */}
		<MarkdownEditor.ModeMenu />
	</MarkdownEditor.Toolbar>
);

/** How long the fake upload pretends to take, so the spinner can be seen. */
const FAKE_UPLOAD_DELAY_MS = 1200;

/** The biggest file the plugin accepts before it refuses with an inline error. */
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const SANDBOX_LAYOUT_STYLE = { display: "flex", flexDirection: "column", gap: 12 } as const;

/**
 * The story args, plus what the sandbox itself decides.
 *
 * The sandbox keeps the markdown, so `value` is not one of them — it starts from
 * `initialValue` and holds it from there. Everything else comes from the controls panel.
 */
interface ImageUploadSandboxProps extends Omit<MarkdownEditorProps, "value"> {
	id: string;
	initialValue: string;

	/** Left out to keep the built-in toolbar, whose image dialog takes a URL only. */
	toolbar?: ReactNode;
}

/**
 * A host with a fake backend.
 *
 * The "fail the next upload" box is the point of the sandbox: `fail` is read straight
 * out of this render, with no ref anywhere. The handler is a plugin prop, so a new one
 * arrives on the next render and the following upload uses it — the editor is not
 * rebuilt, and an upload already in flight is not disturbed.
 */
function ImageUploadSandbox({ id, initialValue, onChange, toolbar, ...args }: ImageUploadSandboxProps): ReactElement {
	const [failNextUpload, setFailNextUpload] = useState(false);
	const [markdown, setMarkdown] = useState(initialValue);

	const onImageUpload = (file: File): Promise<UploadedImage> =>
		new Promise<UploadedImage>((resolve, reject) => {
			setTimeout(() => {
				if (failNextUpload) {
					reject(new Error("Simulated upload failure"));

					return;
				}

				const reader = new FileReader();
				reader.onload = () => resolve({ src: String(reader.result), altText: file.name });
				reader.onerror = () => reject(reader.error ?? new Error("read failed"));
				reader.readAsDataURL(file);
			}, FAKE_UPLOAD_DELAY_MS);
		});

	return (
		<div style={SANDBOX_LAYOUT_STYLE}>
			{/*
			 * The library's `Checkbox`, not a bare `<input>`: the global styles strip
			 * `appearance` from every input, so a raw checkbox draws nothing.
			 */}
			<Checkbox
				id={`${id}-fail-next-upload`}
				fitToParent={false}
				checked={failNextUpload}
				onChange={setFailNextUpload}
				label="Fail the next upload"
			/>
			<MarkdownEditor
				label="Description"
				{...args}
				id={id}
				value={markdown}
				onChange={(next) => {
					setMarkdown(next);
					onChange(next);
				}}
				extensions={UPLOAD_EXTENSIONS}
				plugins={
					<ImageUploadPlugin
						onImageUpload={onImageUpload}
						isAllowedUrl={isAllowedUploadedImageUrl}
						maxSizeBytes={MAX_UPLOAD_SIZE_BYTES}
					/>
				}
				toolbar={toolbar}
			/>
			<MarkdownValuePanel markdown={markdown} />
		</div>
	);
}

const meta: Meta<typeof MarkdownEditor> = {
	title: "Data Entry/MarkdownEditor/Extensions/Image Upload",
	component: MarkdownEditor,
	parameters: {
		layout: "padded",
		docs: {
			source: { type: "code" },
			description: {
				component:
					"Uploading an image needs a backend, so the editor does not do it — the host does. `ImageUploadExtension` goes in `extensions` and owns the placeholder, the spinner and the inline error; `ImageUploadPlugin` carries the config, above all `onImageUpload`, which receives the `File` (and an abort `signal`) and answers with the URL to embed. These stories fake the backend by reading the file into a `data:` URL after a short wait."
			}
		}
	},
	argTypes: sandboxArgTypes,
	args: {
		...markdownEditorArgs,
		minHeight: 320
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DragPasteAndPick: Story = {
	render: (args) => (
		<ImageUploadSandbox
			{...args}
			id="image-upload-markdown-editor"
			initialValue={IMAGE_UPLOAD_MARKDOWN}
			toolbar={UPLOAD_TOOLBAR}
		/>
	),
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Module scope: a new array on every render rebuilds the editor.
const EXTENSIONS = [ImageUploadExtension];

async function uploadImage(file: File, { signal }: ImageUploadContext): Promise<UploadedImage> {
	const response = await fetch("/api/images", { method: "POST", body: file, signal });
	const { url } = await response.json();

	return { src: url, altText: file.name };
}

<MarkdownEditor
	value={markdown}
	onChange={setMarkdown}
	extensions={EXTENSIONS}
	plugins={<ImageUploadPlugin onImageUpload={uploadImage} maxSizeBytes={5 * 1024 * 1024} />}
	toolbar={
		<MarkdownEditor.Toolbar>
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.BoldButton />
				<MarkdownEditor.ItalicButton />
			</MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.ToolbarSeparator />
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.LinkButton />
				{/* Its dialog offers a file as well as a URL. */}
				<ImageUploadButton />
			</MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.ModeMenu />
		</MarkdownEditor.Toolbar>
	}
/>`
			},
			description: {
				story:
					'All three ways in, and the failure path with them. Drop an image file on the surface, paste one from the clipboard, or use the toolbar\'s image button and pick **"Choose file…"**. Watch the markdown underneath: while the upload runs the value holds no image, and the preview you see on screen is a local `blob:` URL that is never written out. Only the URL the handler resolved with reaches the host.\n\nTick **Fail the next upload** and try again: the placeholder becomes an inline error with **Retry**, and the value stays clean. The checkbox reaches the next upload without a ref and without rebuilding the editor, because the handler is an ordinary plugin prop.'
			}
		}
	}
};

export const BuiltInToolbar: Story = {
	render: (args) => (
		<ImageUploadSandbox
			{...args}
			id="image-upload-built-in-toolbar-markdown-editor"
			initialValue={BUILT_IN_TOOLBAR_MARKDOWN}
		/>
	),
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `const EXTENSIONS = [ImageUploadExtension];

// The built-in toolbar stays. Drop and paste still upload; the image button's dialog takes a URL only.
<MarkdownEditor
	value={markdown}
	onChange={setMarkdown}
	extensions={EXTENSIONS}
	plugins={<ImageUploadPlugin onImageUpload={uploadImage} />}
/>`
			},
			description: {
				story:
					"The same wiring with the built-in toolbar left alone. Its image button opens the URL-only dialog, so there is no file picker here — but dragging and pasting a file still upload, because those belong to the extension rather than to any button. Swap in `ImageUploadButton`, as the story above does, when the dialog should offer a file as well."
			}
		}
	}
};
