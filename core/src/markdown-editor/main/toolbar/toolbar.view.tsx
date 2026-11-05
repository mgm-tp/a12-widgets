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
import { useContext, useRef } from "react";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { MarkdownEditorProps } from "../markdown-editor.api.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { ToolbarStateContext } from "../shared/toolbar-context.js";

import { StyledMarkdownToolbar, StyledMarkdownToolbarGroup, StyledMarkdownToolbarSeparator } from "./toolbar.styled.js";
import { useRichToolbarState } from "./use-rich-toolbar-state.js";
import { useSourceToolbarState } from "./use-source-toolbar-state.js";
import { useToolbarNavigation } from "./use-toolbar-navigation.js";

/**
 * The formatting-toolbar container: renders the ARIA `toolbar` role and provides
 * roving-tabindex keyboard navigation (the whole toolbar is a single Tab stop;
 * Arrow keys and Home/End move between the enabled controls). It computes the
 * {@link useRichToolbarState} snapshot exactly once and provides it to the controls
 * rendered as children, so selection-driven re-renders stay confined to the
 * toolbar subtree.
 *
 * Custom controls participate in the keyboard navigation as long as they render
 * a native `<button>` inside this container.
 */
export const Toolbar: FC<MarkdownEditorProps.ToolbarProps> = ({ id, className, style, children }) => {
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const { richEditor, isSourceMode, sourceEditor } = useMarkdownEditorSurfaces();
	const richState = useRichToolbarState(richEditor);
	const sourceState = useSourceToolbarState(sourceEditor ?? null);

	// In source mode the visible document lives in the nested editor, so the rich
	// editor's selection says nothing about what the caret is inside.
	const state = isSourceMode ? sourceState : richState;
	const toolbarRef = useRef<HTMLDivElement>(null);
	const { onKeyDown, onFocus } = useToolbarNavigation(toolbarRef);

	return (
		// oxlint-disable-next-line jsx-a11y/interactive-supports-focus -- toolbar controls are focusable via roving tabindex
		<StyledMarkdownToolbar
			ref={toolbarRef}
			id={id}
			className={className}
			style={style}
			role="toolbar"
			aria-label={titles?.toolbarLabel}
			data-role={DataRoles.MarkdownEditor.Toolbar}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
		>
			<ToolbarStateContext.Provider value={state}>{children}</ToolbarStateContext.Provider>
		</StyledMarkdownToolbar>
	);
};

Toolbar.displayName = "MarkdownToolbar";

/**
 * A visual group of toolbar controls.
 */
export const ToolbarGroup: FC<MarkdownEditorProps.ToolbarGroupProps> = ({ className, style, children }) => (
	<StyledMarkdownToolbarGroup className={className} style={style}>
		{children}
	</StyledMarkdownToolbarGroup>
);

ToolbarGroup.displayName = "MarkdownToolbarGroup";

/**
 * A vertical divider between toolbar groups.
 */
export const ToolbarSeparator: FC<MarkdownEditorProps.ToolbarSeparatorProps> = ({ className, style }) => (
	<StyledMarkdownToolbarSeparator className={className} style={style} aria-hidden="true" role="separator" />
);

ToolbarSeparator.displayName = "MarkdownToolbarSeparator";
