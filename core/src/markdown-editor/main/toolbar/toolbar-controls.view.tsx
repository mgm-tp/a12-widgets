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

import type { FC } from "react";
import { useContext } from "react";

import type { MarkdownEditorTitles } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { MarkdownEditorProps } from "../markdown-editor.api.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { useMarkdownEditorToolbarState } from "../shared/toolbar-context.js";

import { ToolbarButton } from "./toolbar-button.view.js";
import type { ButtonCommandSpec, ToolbarButtonCommandType } from "./toolbar-command-registry.js";
import { TOOLBAR_COMMANDS, useToolbarCommand } from "./toolbar-command-registry.js";

type ControlProps = MarkdownEditorProps.ToolbarControlProps;

interface ToolbarCommandButtonProps extends ControlProps {
	command: ToolbarButtonCommandType;
}

function getTitle(markdownEditorTitles: MarkdownEditorTitles | undefined, key: string): string {
	// `titleKey` stays open: a host registering its own command names whatever key it likes,
	// including one it merged into `MarkdownEditorTitles` itself.
	const value = markdownEditorTitles?.[key as keyof MarkdownEditorTitles];

	return typeof value === "string" ? value : "";
}

/**
 * Renders one entry of {@link TOOLBAR_COMMANDS}.
 *
 * All the behaviour a control needs comes from its spec, so the named exports
 * below are one-line bindings rather than near-identical components:
 *
 * - **active** and **enabled** read the toolbar state, which the toolbar has
 *   already derived from whichever surface is showing — so a control lights up
 *   inside `**…**` in source mode exactly as it does in rich mode.
 * - **enabled** combines `richOnly` (no markdown-source equivalent) with
 *   `canRun` (whether the current selection can accept the command).
 * - the rich commands are built **at click time**, so they always see the
 *   current selection.
 */
const ToolbarCommandButton: FC<ToolbarCommandButtonProps> = ({ command, disabled }) => {
	const runCommand = useToolbarCommand();
	const { markdownEditorTitles } = useContext(A11YLanguageContext);
	const spec: ButtonCommandSpec = TOOLBAR_COMMANDS[command];

	const { isSourceMode, disabled: toolbarDisabled, features } = useMarkdownEditorSurfaces();
	const toolbarState = useMarkdownEditorToolbarState();

	const unavailableInSource = isSourceMode && !!spec.richOnly;
	const blockedByState = spec.canRun?.(toolbarState) === false;

	const handleClick = (): void => runCommand(command);

	// Hidden, not disabled: the editor cannot read this syntax back,
	// so the control has nothing to offer. A disabled button would read as "not right now" instead of "not here".
	if (spec.feature && !features[spec.feature]) {
		return null;
	}

	return (
		<ToolbarButton
			icon={spec.icon}
			title={getTitle(markdownEditorTitles, spec.titleKey)}
			toggle={spec.toggle}
			active={spec.isActive?.(toolbarState)}
			disabled={disabled || toolbarDisabled || unavailableInSource || blockedByState}
			onClick={handleClick}
			dataRole={DataRoles.MarkdownEditor.ToolbarItem}
		/>
	);
};

ToolbarCommandButton.displayName = "MarkdownToolbarCommandButton";

/**
 * Binds one {@link TOOLBAR_COMMANDS} entry to a named component.
 *
 * The `displayName` is explicit because the component is created here rather
 * than assigned straight to its export, so it would otherwise show up as the
 * factory's inner `Button` for every control.
 */
function createCommandButton(command: ToolbarButtonCommandType, displayName: string): FC<ControlProps> {
	const Button: FC<ControlProps> = (props) => <ToolbarCommandButton command={command} {...props} />;

	Button.displayName = displayName;

	return Button;
}

/** Undo (rich edit mode only). */
export const UndoButton = createCommandButton("undo", "MarkdownUndoButton");

/** Redo (rich edit mode only). */
export const RedoButton = createCommandButton("redo", "MarkdownRedoButton");

/** Toggles bold. */
export const BoldButton = createCommandButton("bold", "MarkdownBoldButton");

/** Toggles italic. */
export const ItalicButton = createCommandButton("italic", "MarkdownItalicButton");

/** Toggles strike-through. */
export const StrikeButton = createCommandButton("strike", "MarkdownStrikeButton");

/** Toggles underline (no markdown syntax; rich edit mode only). */
export const UnderlineButton = createCommandButton("underline", "MarkdownUnderlineButton");

/** Toggles `<mark>highlight</mark>`. */
export const HighlightButton = createCommandButton("highlight", "MarkdownHighlightButton");

/** Toggles inline code. */
export const CodeButton = createCommandButton("code", "MarkdownCodeButton");

/** Toggles `<sub>` (rich edit mode only). */
export const SubscriptButton = createCommandButton("subscript", "MarkdownSubscriptButton");

/** Toggles `<sup>` (rich edit mode only). */
export const SuperscriptButton = createCommandButton("superscript", "MarkdownSuperscriptButton");

/** Toggles a bullet list. */
export const BulletListButton = createCommandButton("bulletList", "MarkdownBulletListButton");

/** Toggles an ordered list. */
export const OrderedListButton = createCommandButton("orderedList", "MarkdownOrderedListButton");

/** Toggles a task list. */
export const TaskListButton = createCommandButton("taskList", "MarkdownTaskListButton");

/** Indents the current list item. */
export const IndentButton = createCommandButton("indent", "MarkdownIndentButton");

/** Outdents the current list item. */
export const OutdentButton = createCommandButton("outdent", "MarkdownOutdentButton");

/** Opens the link dialog. */
export const LinkButton = createCommandButton("link", "MarkdownLinkButton");

/** Opens the image dialog. */
export const ImageButton = createCommandButton("image", "MarkdownImageButton");

/** Toggles a block quote. */
export const BlockquoteButton = createCommandButton("blockquote", "MarkdownBlockquoteButton");

/** Inserts a horizontal rule. */
export const HorizontalRuleButton = createCommandButton("horizontalRule", "MarkdownHorizontalRuleButton");
