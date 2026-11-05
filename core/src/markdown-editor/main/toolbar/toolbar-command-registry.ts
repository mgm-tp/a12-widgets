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

import type { MarkdownEditorToolbarContextValue } from "../markdown-editor.api.js";
import type { RichCommands } from "../modes/rich-commands.js";
import { createRichCommands } from "../modes/rich-commands.js";
import type { MarkdownEditorFeatureKey } from "../optional-features.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { useMarkdownEditorToolbarState } from "../shared/toolbar-context.js";

import type { MarkdownEditorToolbarState } from "./toolbar-state.js";
import type { MarkdownEditorSourceCommands } from "./use-source-commands.js";

/** Paragraph (0) plus the six heading levels. */
export type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** How big a table to insert. `rows` includes the header row. */
export interface TableSize {
	rows: number;
	columns: number;
}

/**
 * The table you get without picking one: what the size grid opens on, and what
 * `insertTable` builds when it is called by name with no size.
 */
export const DEFAULT_TABLE_SIZE: TableSize = { rows: 2, columns: 2 };

/**
 * What a {@link CommandSpec.handler} receives.
 *
 * A discriminated union, so `command` narrows to the implementation for the
 * active mode: check `isRichMode` and TypeScript knows which methods exist.
 * Commands whose two modes spell an operation the same way (`toggleBold`) need
 * no branch at all, and `context` is available either way for controls that open
 * a dialog instead of editing.
 */
type CommandHandlerContext =
	| {
			isRichMode: true;
			isSourceMode: false;
			richCommands: RichCommands;
			sourceCommands?: never;
			context: MarkdownEditorToolbarContextValue;
	  }
	| {
			isRichMode: false;
			isSourceMode: true;
			richCommands?: never;
			sourceCommands: MarkdownEditorSourceCommands;
			context: MarkdownEditorToolbarContextValue;
	  };

/**
 * What a toolbar command shows, when it is available, and what it does.
 *
 * `P` is the value the command needs — a heading level, a language, a panel
 * type. Commands that need nothing leave it `void`.
 *
 * The presentation fields are optional because not every command renders as a
 * standalone button: the ones a menu owns (`setHeading`, the table operations)
 * take their icon and label from the menu's own item list.
 */
interface CommandSpec<P = void> {
	/** Material Symbols ligature name. */
	icon?: string;

	/** Key of the localized title in {@link MarkdownEditorTitles}. */
	titleKey?: string;

	/**
	 * Exposes `aria-pressed`. Only for a command clicking again turns back off —
	 * not for one that inserts or opens a dialog.
	 */
	toggle?: boolean;

	/** The construct is under the caret: a highlight, and the pressed state with `toggle`. */
	isActive?: (state: MarkdownEditorToolbarState) => boolean;

	/**
	 * Marks a command with no markdown-source equivalent: its control is disabled
	 * in source mode, so the handler only ever runs with `isRichMode`.
	 */
	richOnly?: boolean;

	/**
	 * The `features` key this command needs. Turn it off and the button is gone
	 * and the command does nothing, because the editor cannot read back the
	 * markdown it would write.
	 */
	feature?: MarkdownEditorFeatureKey;

	/**
	 * Whether the command can run right now. `canSink` needs a list, `canUndo` needs history.
	 *
	 * Only add one for a command that really cannot run. The text formats work on any selection,
	 * so a gate for them would be false only before the editor is focused.
	 * That hides Bold and the rest from the arrow keys for anyone using a keyboard.
	 */
	canRun?: (state: MarkdownEditorToolbarState) => boolean;

	/** Runs the command against whichever mode is active. */
	handler: (handlerContext: CommandHandlerContext, payload: P) => void;
}

/**
 * Every built-in toolbar command, as data.
 *
 * Keeping the mode routing here rather than in each button is what stops the two
 * sides from drifting: the source-mode and rich-mode spellings of one command
 * sit on the same line, even when their method names differ
 * (`insertHorizontalRule` vs `setHorizontalRule`).
 */
export const TOOLBAR_COMMANDS = {
	undo: {
		icon: "undo",
		titleKey: "undo",
		canRun: (state) => state.canUndo,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.undo() : sourceCommands.undo()
	},

	redo: {
		icon: "redo",
		titleKey: "redo",
		canRun: (state) => state.canRedo,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.redo() : sourceCommands.redo()
	},

	bold: {
		icon: "format_bold",
		titleKey: "bold",
		toggle: true,
		isActive: (state) => state.isBold,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleBold() : sourceCommands.toggleBold()
	},

	italic: {
		icon: "format_italic",
		titleKey: "italic",
		toggle: true,
		isActive: (state) => state.isItalic,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleItalic() : sourceCommands.toggleItalic()
	},

	strike: {
		feature: "strikethrough",
		icon: "format_strikethrough",
		titleKey: "strikethrough",
		toggle: true,
		isActive: (state) => state.isStrike,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleStrike() : sourceCommands.toggleStrike()
	},

	underline: {
		feature: "underline",
		icon: "format_underlined",
		titleKey: "underline",
		toggle: true,
		isActive: (state) => state.isUnderline,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleUnderline() : sourceCommands.toggleUnderline()
	},

	highlight: {
		feature: "highlight",
		icon: "format_ink_highlighter",
		titleKey: "highlight",
		toggle: true,
		isActive: (state) => state.isHighlight,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleHighlight() : sourceCommands.toggleHighlight()
	},

	code: {
		icon: "code",
		titleKey: "code",
		toggle: true,
		isActive: (state) => state.isCode,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleCode() : sourceCommands.toggleInlineCode()
	},

	subscript: {
		feature: "subscript",
		icon: "subscript",
		titleKey: "subscript",
		toggle: true,
		isActive: (state) => state.isSubscript,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleSubscript() : sourceCommands.toggleSubscript()
	},

	superscript: {
		feature: "superscript",
		icon: "superscript",
		titleKey: "superscript",
		toggle: true,
		isActive: (state) => state.isSuperscript,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleSuperscript() : sourceCommands.toggleSuperscript()
	},

	bulletList: {
		icon: "format_list_bulleted",
		titleKey: "bulletList",
		toggle: true,
		isActive: (state) => state.isBulletList,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleBulletList() : sourceCommands.setBlock("bulletList")
	},

	orderedList: {
		icon: "format_list_numbered",
		titleKey: "orderedList",
		toggle: true,
		isActive: (state) => state.isOrderedList,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleOrderedList() : sourceCommands.setBlock("orderedList")
	},

	taskList: {
		feature: "taskList",
		icon: "checklist",
		titleKey: "taskList",
		toggle: true,
		isActive: (state) => state.isTaskList,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleTaskList() : sourceCommands.setBlock("taskList")
	},

	indent: {
		icon: "format_indent_increase",
		titleKey: "indent",
		canRun: (state) => state.canSink,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.sinkListItem() : sourceCommands.indent()
	},

	outdent: {
		icon: "format_indent_decrease",
		titleKey: "outdent",
		canRun: (state) => state.canLift,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.liftListItem() : sourceCommands.outdent()
	},

	link: {
		icon: "link",
		titleKey: "link",
		isActive: (state) => state.isLink,
		handler: ({ context }) => context.openLinkDialog()
	},

	image: {
		icon: "image",
		titleKey: "image",
		isActive: (state) => state.isImage,
		handler: ({ context }) => context.openImageDialog()
	},

	blockquote: {
		icon: "format_quote",
		titleKey: "blockquote",
		toggle: true,
		isActive: (state) => state.isBlockquote,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.toggleBlockquote() : sourceCommands.setBlock("blockquote")
	},

	horizontalRule: {
		icon: "horizontal_rule",
		titleKey: "horizontalRule",
		isActive: (state) => state.isThematicBreak,
		handler: ({ isRichMode, richCommands, sourceCommands }) =>
			isRichMode ? richCommands.setHorizontalRule() : sourceCommands.insertHorizontalRule()
	},

	/*
	 * Commands a menu owns. They carry no presentation: the menu supplies the
	 * icons and labels for its own items.
	 */

	setHeading: {
		isActive: (state) => state.headingLevel > 0,
		handler: ({ isRichMode, richCommands, sourceCommands }, level: HeadingLevel) => {
			if (!isRichMode) {
				sourceCommands.setBlock(level === 0 ? "paragraph" : (`heading${level}` as const));

				return;
			}

			if (level === 0) {
				richCommands.setParagraph();
			} else {
				richCommands.toggleHeading(level);
			}
		}
	},

	setCodeBlockLanguage: {
		isActive: (state) => state.isCodeBlock,
		handler: ({ isRichMode, richCommands, sourceCommands, context }, language: string) => {
			if (!isRichMode) {
				// Source mode is plain text and has no notion of "the current code block", so always insert.
				sourceCommands.insertCodeBlock(language);

				return;
			}

			if (context.toolbarState.isCodeBlock) {
				richCommands.setCodeBlockLanguage(language);
			} else {
				richCommands.toggleCodeBlock(language);
			}
		}
	},

	insertTable: {
		feature: "table",
		// `rows` counts the header row, the same as the size picker does. Pick 3 rows and
		// 4 columns and you get a header row, two body rows, and four columns.
		handler: ({ isRichMode, richCommands, sourceCommands }, size: TableSize = DEFAULT_TABLE_SIZE) =>
			isRichMode
				? richCommands.insertTable(size.rows, size.columns)
				: sourceCommands.insertTable(size.rows, size.columns)
	},

	addRowBefore: {
		feature: "table",
		richOnly: true,
		handler: ({ isRichMode, richCommands }) => {
			if (isRichMode) {
				richCommands.addRowBefore();
			}
		}
	},

	addRowAfter: {
		feature: "table",
		richOnly: true,
		handler: ({ isRichMode, richCommands }) => {
			if (isRichMode) {
				richCommands.addRowAfter();
			}
		}
	},

	addColumnBefore: {
		feature: "table",
		richOnly: true,
		handler: ({ isRichMode, richCommands }) => {
			if (isRichMode) {
				richCommands.addColumnBefore();
			}
		}
	},

	addColumnAfter: {
		feature: "table",
		richOnly: true,
		handler: ({ isRichMode, richCommands }) => {
			if (isRichMode) {
				richCommands.addColumnAfter();
			}
		}
	},

	deleteRow: {
		feature: "table",
		richOnly: true,
		handler: ({ isRichMode, richCommands }) => {
			if (isRichMode) {
				richCommands.deleteRow();
			}
		}
	},

	deleteColumn: {
		feature: "table",
		richOnly: true,
		handler: ({ isRichMode, richCommands }) => {
			if (isRichMode) {
				richCommands.deleteColumn();
			}
		}
	},

	deleteTable: {
		feature: "table",
		richOnly: true,
		handler: ({ isRichMode, richCommands }) => {
			if (isRichMode) {
				richCommands.deleteTable();
			}
		}
	}
} as const satisfies Record<string, CommandSpec<never>>;

type ToolbarCommandType = keyof typeof TOOLBAR_COMMANDS;

/** A command spec that is complete enough to render as a toolbar button. */
export type ButtonCommandSpec = CommandSpec & Required<Pick<CommandSpec, "icon" | "titleKey">>;

/**
 * The commands that carry their own presentation, and so can be rendered as a
 * standalone toolbar button. Menu-owned commands are excluded at compile time.
 */
export type ToolbarButtonCommandType = {
	[K in ToolbarCommandType]: (typeof TOOLBAR_COMMANDS)[K] extends { icon: string } ? K : never;
}[ToolbarCommandType];

/** The value a given command's handler expects, if any. */
type ToolbarCommandPayload<T extends ToolbarCommandType> = Parameters<(typeof TOOLBAR_COMMANDS)[T]["handler"]>[1];

/** The commands that need no payload, so they can be dispatched by name alone. */
export type ToolbarCommandWithoutPayload = {
	[K in ToolbarCommandType]: ToolbarCommandPayload<K> extends undefined ? K : never;
}[ToolbarCommandType];

/** The commands that need a value — a heading level, a language, a panel type. */
type ToolbarCommandWithPayload = Exclude<ToolbarCommandType, ToolbarCommandWithoutPayload>;

/**
 * Runs a toolbar command in whichever mode the editor is currently in.
 *
 * Overloaded rather than conditional, so the payload is required exactly for the
 * commands that take one and rejected for the rest.
 */
interface ToolbarCommandExecutor {
	(type: ToolbarCommandWithoutPayload): void;
	<T extends ToolbarCommandWithPayload>(type: T, payload: ToolbarCommandPayload<T>): void;
}

/**
 * Returns the dispatcher every toolbar control uses — buttons and menus alike —
 * so the source/rich choice is made in exactly one place, and the rich commands
 * are always built at dispatch time against the current selection.
 */
export function useToolbarCommand(): ToolbarCommandExecutor {
	const surfaces = useMarkdownEditorSurfaces();
	const toolbarState = useMarkdownEditorToolbarState();
	const context: MarkdownEditorToolbarContextValue = { ...surfaces, toolbarState };

	return (type: ToolbarCommandType, payload?: unknown): void => {
		const spec = TOOLBAR_COMMANDS[type] as CommandSpec<unknown>;
		const { sourceCommands, richEditor, features } = surfaces;

		// The built-in controls for a disabled feature are not rendered, but a custom
		// toolbar can still reach the command by name. Writing syntax the editor cannot
		// read back would lose the content on the next import, so this does nothing.
		if (spec.feature && !features[spec.feature]) {
			return;
		}

		spec.handler(
			sourceCommands
				? { isRichMode: false, isSourceMode: true, sourceCommands, context }
				: {
						isRichMode: true,
						isSourceMode: false,
						richCommands: createRichCommands(richEditor, toolbarState),
						context
					},
			payload
		);
	};
}
