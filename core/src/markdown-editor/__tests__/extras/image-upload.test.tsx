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

import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { $createParagraphNode, $getRoot, configExtension } from "lexical";
import type { LexicalEditor } from "lexical";
import type { FC } from "react";
import { useState } from "react";
import { getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { ImageUploadConfig, ImageUploadContext, UploadedImage } from "../../main/extras/image-upload/index.js";
import { ImageUploadButton, ImageUploadExtension, ImageUploadPlugin } from "../../main/extras/image-upload/index.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";
import {
	ALL_MODES,
	dropFilesOntoSurface,
	EDITOR_ROLES,
	getToolbarItem,
	pasteFilesIntoSurface
} from "../utils/index.js";

interface EditorWithUploadProps {
	onChange?: (md: string) => void;
	onImageUpload?: (file: File, ctx: ImageUploadContext) => Promise<UploadedImage>;
	onImageUploadError?: (error: unknown, file: File) => void;
	imageUploadConfig?: ImageUploadConfig;
	isAllowedUrl?: (url: string, target: "link" | "image") => boolean;
	initialMode?: "edit" | "source";
	onEditorReady?: (editor: LexicalEditor) => void;
}

const EditorWithUpload: FC<EditorWithUploadProps> = ({
	onChange,
	onEditorReady,
	onImageUpload,
	onImageUploadError,
	imageUploadConfig,
	isAllowedUrl,
	...rest
}) => {
	const [value, setValue] = useState("");

	// What a host holds: the whole of upload, configured once on the extension. Held in state
	// so the array keeps its identity — a new one would rebuild the editor and lose the content.
	const [extensions] = useState(() =>
		onImageUpload
			? [
					configExtension(ImageUploadExtension, {
						onImageUpload,
						onImageUploadError,
						isAllowedUrl: isAllowedUrl && ((url: string) => isAllowedUrl(url, "image")),
						...imageUploadConfig
					})
				]
			: undefined
	);
	const upload = onImageUpload !== undefined;

	return (
		<MarkdownEditor
			value={value}
			allowedModes={ALL_MODES}
			onChange={(next) => {
				setValue(next);
				onChange?.(next);
			}}
			// Upload is the host's to assemble, so the wrapper does what a real host does: configure
			// the extension, mount its component, and put the upload button in a toolbar it composes
			// itself. Without a handler it stays on the built-in toolbar, whose image button is URL-only.
			toolbar={
				upload ? (
					<MarkdownEditor.Toolbar>
						<MarkdownEditor.ToolbarGroup>
							<ImageUploadButton />
						</MarkdownEditor.ToolbarGroup>
					</MarkdownEditor.Toolbar>
				) : undefined
			}
			// `EditorRefPlugin` also renders inside the composer, so it can hand the rich editor back to the test.
			plugins={
				<>
					{upload && <ImageUploadPlugin />}
					{onEditorReady && <EditorRefPlugin editorRef={onEditorReady} />}
				</>
			}
			extensions={extensions}
			{...rest}
		/>
	);
};

function createPngFile(name = "pic.png", size = 4): File {
	return new File([new Uint8Array(size)], name, { type: "image/png" });
}

/** Sets `files` on a file input and fires the native `change` React listens to. */
function selectFile(input: HTMLInputElement, file: File): void {
	const transfer = new DataTransfer();
	transfer.items.add(file);
	input.files = transfer.files;
	input.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("MarkdownEditor image upload", () => {
	test("dropping/pasting a file inserts an uploading placeholder, then swaps in the resolved URL", async () => {
		const onChange = vi.fn();
		let resolveUpload: (image: UploadedImage) => void = () => {};

		const onImageUpload = vi.fn(
			() =>
				new Promise<UploadedImage>((resolve) => {
					resolveUpload = resolve;
				})
		);
		let editor!: LexicalEditor;
		const { container } = render(
			<EditorWithUpload onChange={onChange} onImageUpload={onImageUpload} onEditorReady={(e) => (editor = e)} />
		);

		await waitFor(() => expect(editor).toBeTruthy());
		await userEvent.click(getByDataRole(container, EDITOR_ROLES.Surface.Edit));

		// `@lexical/rich-text` dispatches DRAG_DROP_PASTE for both file drops and pastes.
		editor.dispatchCommand(DRAG_DROP_PASTE, [createPngFile()]);

		await waitFor(() => expect(queryByDataRole(container, DataRoles.ProgressIndicator.CircleSpinner)).toBeTruthy());
		expect(onImageUpload).toHaveBeenCalledOnce();
		// No transient object URL may leak into the emitted markdown while uploading.
		expect(onChange.mock.calls.every(([md]) => !String(md).includes("blob:"))).toBe(true);

		resolveUpload({ src: "https://cdn.example.com/pic.png" });

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("![pic](https://cdn.example.com/pic.png)"));
		expect(onChange.mock.calls.every(([md]) => !String(md).includes("blob:"))).toBe(true);
		expect(queryByDataRole(container, DataRoles.ProgressIndicator.CircleSpinner)).toBeNull();
	});

	test("a failed upload shows an inline error and retry re-runs the upload", async () => {
		const onChange = vi.fn();
		const onImageUploadError = vi.fn();
		let attempts = 0;
		let rejectFirst: (reason: unknown) => void = () => {};

		const onImageUpload = vi.fn(
			() =>
				new Promise<UploadedImage>((resolve, reject) => {
					attempts += 1;

					if (attempts === 1) {
						rejectFirst = reject;
					} else {
						resolve({ src: "https://cdn.example.com/ok.png" });
					}
				})
		);
		let editor!: LexicalEditor;
		const { container } = render(
			<EditorWithUpload
				onChange={onChange}
				onImageUpload={onImageUpload}
				onImageUploadError={onImageUploadError}
				onEditorReady={(e) => (editor = e)}
			/>
		);

		await waitFor(() => expect(editor).toBeTruthy());
		await userEvent.click(getByDataRole(container, EDITOR_ROLES.Surface.Edit));
		editor.dispatchCommand(DRAG_DROP_PASTE, [createPngFile()]);

		await waitFor(() => expect(queryByDataRole(container, DataRoles.ProgressIndicator.CircleSpinner)).toBeTruthy());
		rejectFirst(new Error("boom"));

		await waitFor(() => expect(queryByDataRole(container, DataRoles.Error.Message)).toBeTruthy());
		expect(onImageUploadError).toHaveBeenCalledOnce();

		// Raw click: the decorator re-renders around the absolutely-positioned
		// affordance, so Playwright's actionability wait is unreliable here.
		getByDataRole(container, DataRoles.Error.Message).querySelector("button")!.click();

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("![pic](https://cdn.example.com/ok.png)"));
		expect(attempts).toBe(2);
	});

	test("files failing the config gate are rejected before the handler runs", async () => {
		const onImageUpload = vi.fn(() => Promise.resolve<UploadedImage>({ src: "https://cdn.example.com/x.png" }));
		let editor!: LexicalEditor;
		const { container } = render(
			<EditorWithUpload
				onImageUpload={onImageUpload}
				imageUploadConfig={{ maxSizeBytes: 2 }}
				onEditorReady={(e) => (editor = e)}
			/>
		);

		await waitFor(() => expect(editor).toBeTruthy());
		await userEvent.click(getByDataRole(container, EDITOR_ROLES.Surface.Edit));

		// Oversize image, then a non-image file.
		editor.dispatchCommand(DRAG_DROP_PASTE, [createPngFile("big.png", 100)]);
		editor.dispatchCommand(DRAG_DROP_PASTE, [new File(["hi"], "note.txt", { type: "text/plain" })]);

		await waitFor(() => expect(getByDataRole(container, DataRoles.A11yLiveRegion).textContent).toBeTruthy());
		expect(onImageUpload).not.toHaveBeenCalled();
		expect(queryByDataRole(container, DataRoles.ProgressIndicator.CircleSpinner)).toBeNull();
	});

	test("removing the placeholder mid-upload aborts the request", async () => {
		let capturedSignal: AbortSignal | undefined;
		const onImageUpload = vi.fn(
			(_file: File, ctx: ImageUploadContext) =>
				new Promise<UploadedImage>(() => {
					capturedSignal = ctx.signal;
				})
		);
		let editor!: LexicalEditor;
		const { container } = render(
			<EditorWithUpload onImageUpload={onImageUpload} onEditorReady={(e) => (editor = e)} />
		);

		await waitFor(() => expect(editor).toBeTruthy());
		await userEvent.click(getByDataRole(container, EDITOR_ROLES.Surface.Edit));
		editor.dispatchCommand(DRAG_DROP_PASTE, [createPngFile()]);

		await waitFor(() => expect(capturedSignal).toBeTruthy());
		expect(capturedSignal?.aborted).toBe(false);

		// Delete the placeholder (as undo/delete would).
		editor.update(() => {
			const root = $getRoot();
			root.clear();
			root.append($createParagraphNode());
		});

		await waitFor(() => expect(capturedSignal?.aborted).toBe(true));
		expect(queryByDataRole(container, DataRoles.Error.Message)).toBeNull();
	});

	test("the dialog exposes a file picker only when onImageUpload is set", async () => {
		// Both dialogs share the editor's dialog roles, so the file input is what tells them apart:
		// the plain one takes a URL, the upload one takes a file.
		const withoutUpload = render(<EditorWithUpload />);
		await userEvent.click(getToolbarItem(withoutUpload.container, "image"));
		await waitFor(() => expect(queryByDataRole(withoutUpload.container, EDITOR_ROLES.Dialog.Wrapper)).toBeTruthy());
		expect(withoutUpload.container.querySelector('input[type="file"]')).toBeNull();

		const onImageUpload = vi.fn(() => Promise.resolve<UploadedImage>({ src: "https://cdn.example.com/x.png" }));
		const withUpload = render(<EditorWithUpload onImageUpload={onImageUpload} />);
		await userEvent.click(getToolbarItem(withUpload.container, "image"));
		await waitFor(() => expect(queryByDataRole(withUpload.container, EDITOR_ROLES.Dialog.Wrapper)).toBeTruthy());
		expect(withUpload.container.querySelector('input[type="file"]')).toBeTruthy();
	});

	test("source mode: the picker uploads then inserts the composed markdown fragment", async () => {
		const onChange = vi.fn();
		const onImageUpload = vi.fn(() =>
			Promise.resolve<UploadedImage>({ src: "https://cdn.example.com/s.png", title: "Shot" })
		);
		const { container } = render(
			<EditorWithUpload onChange={onChange} onImageUpload={onImageUpload} initialMode="source" />
		);

		await userEvent.click(getToolbarItem(container, "image"));
		await waitFor(() => expect(container.querySelector('input[type="file"]')).toBeTruthy());

		const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
		selectFile(input, createPngFile("s.png"));

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain('![](https://cdn.example.com/s.png "Shot")'));
		expect(onImageUpload).toHaveBeenCalledOnce();
	});
	test("source mode: pasting a file uploads it, then writes the markdown at the caret", async () => {
		const onChange = vi.fn();
		let resolveUpload: (image: UploadedImage) => void = () => {};

		const onImageUpload = vi.fn(
			() =>
				new Promise<UploadedImage>((resolve) => {
					resolveUpload = resolve;
				})
		);
		const { container } = render(
			<EditorWithUpload onChange={onChange} onImageUpload={onImageUpload} initialMode="source" />
		);

		// 1. A screenshot paste carries files and no text at all.
		const surface = getByDataRole(container, EDITOR_ROLES.Surface.Source);

		await userEvent.click(surface);
		pasteFilesIntoSurface(surface, [createPngFile("shot.png")]);

		await waitFor(() => expect(onImageUpload).toHaveBeenCalledOnce());

		// 2. Source mode has no placeholder node, so nothing is written until the upload lands.
		expect(onChange.mock.calls.every(([md]) => !String(md).includes("!["))).toBe(true);

		resolveUpload({ src: "https://cdn.example.com/shot.png" });

		// 3. The alt text falls back to the file name without its extension.
		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("![shot](https://cdn.example.com/shot.png)"));
	});

	test("source mode: dropping a file uploads it and writes the markdown", async () => {
		const onChange = vi.fn();
		const onImageUpload = vi.fn(() => Promise.resolve<UploadedImage>({ src: "https://cdn.example.com/d.png" }));
		const { container } = render(
			<EditorWithUpload onChange={onChange} onImageUpload={onImageUpload} initialMode="source" />
		);

		dropFilesOntoSurface(getByDataRole(container, EDITOR_ROLES.Surface.Source), [createPngFile("d.png")]);

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("![d](https://cdn.example.com/d.png)"));
		expect(onImageUpload).toHaveBeenCalledOnce();
	});

	test("source mode: a file the config refuses never reaches the upload handler", async () => {
		const onImageUpload = vi.fn(() => Promise.resolve<UploadedImage>({ src: "https://cdn.example.com/x.png" }));
		const { container } = render(
			<EditorWithUpload
				onImageUpload={onImageUpload}
				imageUploadConfig={{ accept: "image/webp" }}
				initialMode="source"
			/>
		);

		pasteFilesIntoSurface(getByDataRole(container, EDITOR_ROLES.Surface.Source), [createPngFile("nope.png")]);

		// The live region is what tells the user, so it has to say something.
		await waitFor(() => expect(getByDataRole(container, DataRoles.A11yLiveRegion).textContent).toBeTruthy());
		expect(onImageUpload).not.toHaveBeenCalled();
	});

	test("source mode: a URL the policy refuses is not written into the markdown", async () => {
		const onChange = vi.fn();
		const onImageUpload = vi.fn(() => Promise.resolve<UploadedImage>({ src: "https://evil.example.com/x.png" }));
		const { container } = render(
			<EditorWithUpload
				onChange={onChange}
				onImageUpload={onImageUpload}
				isAllowedUrl={(url) => url.startsWith("https://cdn.example.com/")}
				initialMode="source"
			/>
		);

		pasteFilesIntoSurface(getByDataRole(container, EDITOR_ROLES.Surface.Source), [createPngFile("x.png")]);

		await waitFor(() => expect(onImageUpload).toHaveBeenCalledOnce());
		await waitFor(() => expect(getByDataRole(container, DataRoles.A11yLiveRegion).textContent).toBeTruthy());
		expect(onChange.mock.calls.every(([md]) => !String(md).includes("evil.example.com"))).toBe(true);
	});
	test("source mode: the image lands at the caret, not at the end of the document", async () => {
		const onChange = vi.fn();
		const onImageUpload = vi.fn(() => Promise.resolve<UploadedImage>({ src: "https://cdn.example.com/m.png" }));
		const { container } = render(
			<EditorWithUpload onChange={onChange} onImageUpload={onImageUpload} initialMode="source" />
		);

		// 1. Two lines of text, with the caret parked at the end of the first one.
		const surface = getByDataRole(container, EDITOR_ROLES.Surface.Source);
		await userEvent.click(surface);
		await userEvent.keyboard("before{Enter}after");
		await userEvent.keyboard("{ArrowUp}{End}");

		// 2. Paste while the caret is up there, and wait for the write.
		pasteFilesIntoSurface(surface, [createPngFile("m.png")]);

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("cdn.example.com/m.png"));

		// 3. The image belongs on the first line. Appending would have put it after "after".
		const markdown = String(onChange.mock.calls.at(-1)?.[0]);
		expect(markdown.indexOf("![m]")).toBeLessThan(markdown.indexOf("after"));
	});

	test("source mode: a dropped image lands under the pointer, not at the caret", async () => {
		const onChange = vi.fn();
		const onImageUpload = vi.fn(() => Promise.resolve<UploadedImage>({ src: "https://cdn.example.com/p.png" }));
		const { container } = render(
			<EditorWithUpload onChange={onChange} onImageUpload={onImageUpload} initialMode="source" />
		);

		// 1. Two lines, with the caret left at the very end — on the second one.
		const surface = getByDataRole(container, EDITOR_ROLES.Surface.Source);
		await userEvent.click(surface);
		await userEvent.keyboard("before{Enter}after");

		// 2. Aim at the end of the *first* line, which is not where the caret is.
		const firstLine = surface.firstElementChild!.getBoundingClientRect();

		dropFilesOntoSurface(surface, [createPngFile("p.png")], {
			x: firstLine.right - 1,
			y: firstLine.top + firstLine.height / 2
		});

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("cdn.example.com/p.png"));

		// 3. The pointer won: the image sits on line one, ahead of "after".
		const markdown = String(onChange.mock.calls.at(-1)?.[0]);
		expect(markdown.indexOf("![p]")).toBeLessThan(markdown.indexOf("after"));
	});
});
