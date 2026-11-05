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

import { $convertToMarkdownString } from "@lexical/mdast";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { queryByDataRole, render, waitFor } from "test-utils";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import type { MarkdownEditorProps } from "../../main/markdown-editor.api.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";
import {
	ALL_MODES,
	ALL_OPTIONAL_FEATURES,
	getDialogActions,
	getSurfaceByMode,
	getToolbarItem,
	queryDialogField,
	switchMode
} from "../utils/index.js";

type EditorRoles = typeof DataRoles.MarkdownEditor;

/** The props the harness drives; the editor also takes an optional `nodes?` array. */
interface CommonEditorProps {
	value: string;
	onChange: (markdown: string) => void;
	initialMode?: "edit" | "source" | "view";
	emitMode?: "change" | "debounced" | "blur";
	placeholder?: string;
	plugins?: ReactNode;
}

/**
 * Serializes the rich document on demand.
 *
 * `roundTrip` used to read the markdown out of the value the editor reported when it
 * switched to source mode. That tied the suite to a side effect: the editor only
 * reports when the user edits something, and nothing here edits anything. This asks
 * the editor directly instead.
 */
const MarkdownReader: FC<{ onReady: (serialize: () => string) => void }> = ({ onReady }) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		onReady(() => editor.read(() => $convertToMarkdownString()));
	}, [editor, onReady]);

	return null;
};

MarkdownReader.displayName = "MarkdownReader";

export interface EditorUnderTest {
	id: string;
	label: string;
	Component: FC<CommonEditorProps>;
	roles: EditorRoles;
}

const MarkdownEditorWithAllFeatures: FC<CommonEditorProps> = (props) => (
	<MarkdownEditor {...(props as MarkdownEditorProps)} allowedModes={ALL_MODES} features={ALL_OPTIONAL_FEATURES} />
);

MarkdownEditorWithAllFeatures.displayName = "MarkdownEditorWithAllFeatures";

/**
 * The editors this suite drives.
 *
 * A list of one since the transformer-based editor was retired — kept as a list
 * so the a11y suite can keep iterating it, and so a second engine can be slotted
 * back in for comparison without touching call sites.
 */
export const EDITORS: EditorUnderTest[] = [
	{
		id: "mdast",
		label: "MarkdownEditor (Lexical + mdast)",
		Component: MarkdownEditorWithAllFeatures,
		roles: DataRoles.MarkdownEditor
	}
];

interface ControlledEditorUnderTestProps {
	Component: FC<CommonEditorProps>;
	initialValue: string;
	initialMode?: "edit" | "source" | "view";
	onEmit: (markdown: string) => void;
	plugins?: ReactNode;
}

/** A controlled wrapper: keeps `value` in state so mode-switch serialization round-trips through the textarea. */
const ControlledEditorUnderTest: FC<ControlledEditorUnderTestProps> = ({
	Component,
	initialValue,
	initialMode = "edit",
	onEmit,
	plugins
}) => {
	const [value, setValue] = useState(initialValue);

	return (
		<Component
			value={value}
			initialMode={initialMode}
			plugins={plugins}
			onChange={(next) => {
				setValue(next);
				onEmit(next);
			}}
		/>
	);
};

/**
 * Resolves the actual `input` for a dialog field.
 *
 * The `data-role` sits on the field wrapper, not the control, so a locator-based
 * action (`fill`) has to descend to the `input` itself; only key dispatch
 * (`type`) works against the wrapper via the focused element.
 */
function dialogInputOf(field: Element): HTMLInputElement {
	return (field.querySelector("input") ?? field) as HTMLInputElement;
}

function isDisabled(el: Element): boolean {
	return el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
}

/** The text a source-mode element holds, counting every `<br>` as the newline it stands for. */
function readSourceText(element: HTMLElement): string {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
	let text = "";

	for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
		if (node.nodeType === Node.TEXT_NODE) {
			text += node.textContent ?? "";
		} else if (
			(node as Element).tagName === "BR" &&
			!(node as Element).hasAttribute("data-lexical-managed-linebreak")
		) {
			// Lexical renders a trailing `<br>` of its own after a block that ends in a line
			// break, so the empty last line can hold a caret. It stands for no character.
			text += "\n";
		}
	}

	return text;
}

/** Reads the serialized markdown by switching to source mode and reading the textarea. */
async function readViaSource(container: HTMLElement, roles: EditorRoles): Promise<string> {
	await switchMode(container, "source");

	const source = await waitFor(() => {
		const element = queryByDataRole(container, roles.Surface.Source);

		if (!element) {
			throw new Error("source surface not present yet");
		}

		return element;
	});

	// Source mode is a highlighted editing surface: the markdown is spread across one
	// element per token, and line breaks are `<br>` elements — which `textContent`
	// drops. `innerText` keeps them but answers from the layout, so it also reports
	// the line a block boundary or a trailing `<br>` produces on screen. The markdown
	// is read from the nodes themselves instead. A block holds no separator of its own, so
	// the blocks are joined by the newline that stands between them.
	const blocks = source.querySelectorAll<HTMLElement>(".mde-source-block");

	return blocks.length > 0 ? [...blocks].map(readSourceText).join("\n") : readSourceText(source as HTMLElement);
}

/** Round-trips a markdown document: parse in edit mode, then serialize back via source mode. */
export async function roundTrip(editor: EditorUnderTest, markdown: string): Promise<string> {
	let serialize: (() => string) | null = null;
	const { unmount } = render(
		<ControlledEditorUnderTest
			Component={editor.Component}
			initialValue={markdown}
			onEmit={() => undefined}
			plugins={<MarkdownReader onReady={(fn) => (serialize = fn)} />}
		/>
	);

	try {
		await waitFor(() => {
			if (!serialize) {
				throw new Error("editor not ready yet");
			}
		});

		return serialize!();
	} finally {
		unmount();
	}
}

/** Types `seedText` into an empty editor, selects it, clicks a toolbar button, and returns the serialized markdown. */
export async function toolbarAction(editor: EditorUnderTest, seedText: string, button: string): Promise<string> {
	const { container, unmount } = render(
		<ControlledEditorUnderTest Component={editor.Component} initialValue="" onEmit={() => undefined} />
	);

	try {
		const content = getSurfaceByMode(container, "edit");
		await userEvent.click(content);
		await userEvent.type(content, seedText);
		await userEvent.keyboard("{Shift>}{Home}{/Shift}");
		await userEvent.click(getToolbarItem(container, button));

		return await readViaSource(container, editor.roles);
	} finally {
		unmount();
	}
}

/** Types a markdown shortcut sequence into an empty editor and returns the serialized markdown. */
export async function shortcut(editor: EditorUnderTest, keystrokes: string): Promise<string> {
	const { container, unmount } = render(
		<ControlledEditorUnderTest Component={editor.Component} initialValue="" onEmit={() => undefined} />
	);

	try {
		const content = getSurfaceByMode(container, "edit");
		await userEvent.click(content);
		await userEvent.type(content, keystrokes);

		return await readViaSource(container, editor.roles);
	} finally {
		unmount();
	}
}

/** Selects seed text, opens the link dialog, submits `url`, and returns the serialized markdown. */
export async function linkDialog(editor: EditorUnderTest, seedText: string, url: string): Promise<string> {
	const { container, unmount } = render(
		<ControlledEditorUnderTest Component={editor.Component} initialValue="" onEmit={() => undefined} />
	);

	try {
		const content = getSurfaceByMode(container, "edit");
		await userEvent.click(content);
		await userEvent.type(content, seedText);
		await userEvent.keyboard("{Shift>}{Home}{/Shift}");
		await userEvent.click(getToolbarItem(container, "link"));

		const urlField = (await waitFor(() => {
			const el = queryDialogField(container, "linkUrlLabel");

			if (!el) {
				throw new Error("link dialog not open yet");
			}

			return el;
		})) as HTMLInputElement;

		// `fill` rather than `type`: typing key-by-key is slow and flaky under a
		// loaded worker pool, and one whole value is all this test needs.
		await userEvent.fill(dialogInputOf(urlField), url);

		// A disallowed URL disables Submit (the rejection). Only click when enabled.
		// The actions share one role, so the last one in the footer is the submit.
		const actions = getDialogActions(container);
		const submit = actions.at(-1)!;

		if (!isDisabled(submit)) {
			await userEvent.click(submit);
		}

		// If the dialog is still open (rejected), cancel it before reading.
		const cancel = getDialogActions(container).at(-2);

		if (cancel) {
			await userEvent.click(cancel);
		}

		return await readViaSource(container, editor.roles);
	} finally {
		unmount();
	}
}

/** Opens the image dialog, submits `src`/`alt`, and returns the serialized markdown. */
export async function imageDialog(editor: EditorUnderTest, src: string, alt: string): Promise<string> {
	const { container, unmount } = render(
		<ControlledEditorUnderTest Component={editor.Component} initialValue="" onEmit={() => undefined} />
	);

	try {
		const content = getSurfaceByMode(container, "edit");
		await userEvent.click(content);
		await userEvent.click(getToolbarItem(container, "image"));

		const srcField = (await waitFor(() => {
			const el = queryDialogField(container, "imageSrcLabel");

			if (!el) {
				throw new Error("image dialog not open yet");
			}

			return el;
		})) as HTMLInputElement;

		await userEvent.fill(dialogInputOf(srcField), src);

		const altField = queryDialogField(container, "imageAltLabel") as HTMLInputElement | null;

		if (altField) {
			await userEvent.fill(dialogInputOf(altField), alt);
		}

		await userEvent.click(getDialogActions(container).at(-1)!);

		return await readViaSource(container, editor.roles);
	} finally {
		unmount();
	}
}

/**
 * Emits a single machine-readable conformance record for the report aggregator
 * to scrape.
 *
 * `outputs` is keyed by {@link EditorUnderTest.id}, so adding an engine to
 * {@link EDITORS} adds it to every recorded row without touching the call sites.
 * `match` stays true only while *every* entry agrees — meaningful again if a
 * second engine is ever slotted back in for comparison.
 */
export function recordParityRow(
	row: { category: string; name: string; input: string; note?: string },
	outputs: EditorOutputs
): void {
	const values = EDITORS.map((editor) => outputs[editor.id]);
	const match = values.every((value) => value === values[0]);
	// eslint-disable-next-line no-console
	console.log(`PARITY|${JSON.stringify({ ...row, ...outputs, match })}`);
}

/** The markdown each editor produced for one case, keyed by {@link EditorUnderTest.id}. */
export type EditorOutputs = Record<string, string>;
