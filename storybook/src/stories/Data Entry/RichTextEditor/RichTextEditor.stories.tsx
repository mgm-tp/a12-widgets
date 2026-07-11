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
import { fn } from "storybook/test";

import {
	DefaultRichTextEditor,
	BoldButton,
	ItalicButton,
	UnderlineButton,
	BulletListButton,
	NumberListButton,
	Separator,
	AlignButtonGroup
} from "@com.mgmtp.a12.widgets/widgets-core";

// Import the required CSS theme for the rich text editor
import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";

const BASIC_TOOLBAR = [BoldButton, ItalicButton, UnderlineButton, Separator, BulletListButton, NumberListButton];

const FULL_TOOLBAR = [
	BoldButton,
	ItalicButton,
	UnderlineButton,
	Separator,
	BulletListButton,
	NumberListButton,
	Separator,
	AlignButtonGroup
];

const meta: Meta<typeof DefaultRichTextEditor> = {
	title: "Data Entry/RichTextEditor",
	component: DefaultRichTextEditor,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder text displayed when the editor is empty"
		},
		autoExpand: {
			control: "boolean",
			description: "When true, the editor's height expands automatically with content"
		},
		minHeight: {
			control: "text",
			description: "Minimum and initial height of the editor (any CSS unit)"
		},
		maxHeight: {
			control: "text",
			description: "Maximum height (only used when autoExpand is true)"
		},
		singleLine: {
			control: "boolean",
			description: "Renders the editor in single-line mode"
		},
		disabled: {
			control: "boolean",
			description: "Whether the editor is disabled"
		},
		readonly: {
			control: "boolean",
			description: "Whether the editor is read-only"
		},
		spellCheck: {
			control: "boolean",
			description: "Whether the browser spell checker is enabled"
		}
	},
	args: {
		onChange: fn()
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "default-rich-text-editor",
		label: "Rich Text Editor",
		placeholder: "Type something...",
		initialConfig: { namespace: "DefaultEditor" }
	}
};

export const WithToolbar: Story = {
	args: {
		id: "toolbar-rich-text-editor",
		label: "Rich Text Editor with Toolbar",
		placeholder: "Type and format your text...",
		initialConfig: { namespace: "ToolbarEditor" },
		staticToolbarButtons: BASIC_TOOLBAR,
		helperText: "Use the toolbar to apply bold, italic, underline, and list formatting."
	}
};

export const WithFullToolbar: Story = {
	args: {
		id: "full-toolbar-rich-text-editor",
		label: "Rich Text Editor with Full Toolbar",
		placeholder: "Type and format your text...",
		initialConfig: { namespace: "FullToolbarEditor" },
		staticToolbarButtons: FULL_TOOLBAR
	}
};

export const AutoExpand: Story = {
	args: {
		id: "auto-expand-rich-text-editor",
		label: "Auto-Expanding Rich Text Editor",
		placeholder: "Keep typing to see the editor grow...",
		initialConfig: { namespace: "AutoExpandEditor" },
		autoExpand: true,
		minHeight: 80,
		maxHeight: 300,
		staticToolbarButtons: BASIC_TOOLBAR
	}
};

export const SingleLine: Story = {
	args: {
		id: "single-line-rich-text-editor",
		label: "Single-Line Rich Text Editor",
		placeholder: "Enter a short formatted note...",
		initialConfig: { namespace: "SingleLineEditor" },
		singleLine: true
	}
};

export const Disabled: Story = {
	args: {
		id: "disabled-rich-text-editor",
		label: "Disabled Rich Text Editor",
		placeholder: "This editor is disabled.",
		initialConfig: { namespace: "DisabledEditor" },
		staticToolbarButtons: BASIC_TOOLBAR,
		disabled: true
	}
};

export const Readonly: Story = {
	args: {
		id: "readonly-rich-text-editor",
		label: "Readonly Rich Text Editor",
		placeholder: "This editor is read-only.",
		initialConfig: { namespace: "ReadonlyEditor" },
		staticToolbarButtons: BASIC_TOOLBAR,
		readonly: true
	}
};

const INITIAL_EDITOR_STATE = JSON.stringify({
	root: {
		children: [
			{
				children: [
					{ detail: 0, format: 1, mode: "normal", style: "", text: "Bold text", type: "text", version: 1 },
					{ detail: 0, format: 0, mode: "normal", style: "", text: " and ", type: "text", version: 1 },
					{ detail: 0, format: 2, mode: "normal", style: "", text: "italic text", type: "text", version: 1 },
					{ detail: 0, format: 0, mode: "normal", style: "", text: " are supported.", type: "text", version: 1 }
				],
				direction: "ltr",
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1
			},
			{
				children: [
					{
						detail: 0,
						format: 0,
						mode: "normal",
						style: "",
						text: "This is a second paragraph in read-only mode.",
						type: "text",
						version: 1
					}
				],
				direction: "ltr",
				format: "",
				indent: 0,
				type: "paragraph",
				version: 1
			}
		],
		direction: "ltr",
		format: "",
		indent: 0,
		type: "root",
		version: 1
	}
});

export const ReadonlyWithContent: Story = {
	args: {
		id: "readonly-with-content-rich-text-editor",
		label: "Readonly Rich Text Editor with Content",
		initialConfig: { namespace: "ReadonlyWithContentEditor", editorState: INITIAL_EDITOR_STATE },
		staticToolbarButtons: BASIC_TOOLBAR,
		readonly: true
	}
};

export const WithHelperAndError: Story = {
	args: {
		id: "validation-rich-text-editor",
		label: "Rich Text Editor with Validation",
		placeholder: "Required field — please enter some content.",
		initialConfig: { namespace: "ValidationEditor" },
		errorMessage: "This field is required.",
		helperText: "Provide a description of at least 20 characters."
	}
};
