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

import type { Meta } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { MarkdownEditor, MarkdownEditorProps } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

/*
 * The controls panel and the starting args for the markdown editor stories in this folder.
 *
 * Apart from `helpers.tsx`, which holds the components: a file that exports both
 * loses fast refresh.
 */

/** Every mode, so the mode menu has something to offer. See {@link markdownEditorArgs}. */
export const ALL_MODES: MarkdownEditorProps["allowedModes"] = ["edit", "source", "view"];

/**
 * The controls panel for a markdown editor story.
 *
 * Shared by the three story files so a prop is described once. A file that needs a
 * control of its own spreads this and adds to it.
 */
export const markdownEditorArgTypes: Meta<typeof MarkdownEditor>["argTypes"] = {
	value: {
		control: "text",
		description: "The markdown content. The host is authoritative and renders this value."
	},
	placeholder: {
		control: "text",
		description: "Placeholder text displayed when the editor is empty"
	},
	initialMode: {
		control: "inline-radio",
		options: ["edit", "source", "view"],
		description: "The initial mode when the component is mode-uncontrolled"
	},
	allowedModes: {
		control: "check",
		options: ["edit", "source", "view"],
		description: 'The modes the mode menu offers. One mode alone hides the menu. Defaults to ["edit"]'
	},
	emitMode: {
		control: "inline-radio",
		options: ["change", "debounced", "blur"],
		description: "When onChange fires: on every change, debounced, or on blur"
	},
	emitDebounceMs: {
		control: "number",
		description: 'How long the debounce waits after the last change. Only used by emitMode: "debounced"'
	},
	minHeight: {
		control: "text",
		description: "Minimum and initial height of the editing surface (any CSS unit)"
	},
	maxHeight: {
		control: "text",
		description: "Maximum height before the surface scrolls (any CSS unit)"
	},
	showToolbar: {
		control: "boolean",
		description: "Shows the formatting toolbar in edit mode"
	},
	disabled: {
		control: "boolean",
		description: "Whether the editor is disabled"
	},
	readonly: {
		control: "boolean",
		description: "Whether the editor is read-only (forces view mode, hides the toolbar)"
	},
	onChange: {
		control: false,
		description: "Called with the serialized markdown whenever the content changes"
	},
	// A story picks these itself. A control that rebuilds the editor on every keystroke,
	// or hands it a broken toolbar, would only look like the editor is at fault.
	extensions: { control: false },
	plugins: { control: false },
	toolbar: { control: false },
	editorRef: { control: false }
};

/**
 * For a story that keeps the markdown itself. It starts from its own text and holds it
 * from there, so the `value` control has nothing to write to — better hidden than dead.
 */
export const sandboxArgTypes: Meta<typeof MarkdownEditor>["argTypes"] = {
	...markdownEditorArgTypes,
	value: { control: false, description: "Set by the story, which keeps the markdown itself" }
};

/**
 * The args every markdown editor story starts from.
 *
 * `allowedModes` is the one that has to be here: the editor offers edit only by default,
 * and one mode alone hides the mode menu. The stories are about the modes, so they ask
 * for all three.
 */
export const markdownEditorArgs = {
	allowedModes: ALL_MODES,
	onChange: fn()
};

/*
 * Storybook's lint rules want a default export from every file under `stories/`.
 * The controls panel is the one a story reaches for first, so it is the default
 * as well as a named export.
 */
export default markdownEditorArgTypes;
