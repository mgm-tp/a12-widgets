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

import { useExtensionComponent } from "@lexical/react/useExtensionComponent";
import type { AnyLexicalExtensionArgument } from "lexical";
import type { ReactElement } from "react";

import { MdastInfoPanelExtension } from "../../main/extras/info-panel/index.js";
import type { MarkdownEditorMode } from "../../main/markdown-editor.api.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";
import type { MarkdownEditorOptionalFeatures } from "../../main/optional-features.js";

/*
 * Info panels are opt-in: a consumer adds the extension and puts the menu in its own toolbar.
 * Both parts live here, so every panel test sets them up like a consumer does.
 *
 * Module scope matters. `extensions` must keep the same reference.
 * A new array rebuilds the editor and the document is lost.
 */
export const INFO_PANEL_EXTENSIONS: AnyLexicalExtensionArgument[] = [MdastInfoPanelExtension];

/** The menu from the extension, read the same way a consumer reads it. */
function InfoPanelMenu(): ReactElement {
	const Menu = useExtensionComponent(MdastInfoPanelExtension);

	return <Menu />;
}

export const INFO_PANEL_TOOLBAR = (
	<MarkdownEditor.Toolbar>
		<MarkdownEditor.ToolbarGroup>
			<InfoPanelMenu />
		</MarkdownEditor.ToolbarGroup>
	</MarkdownEditor.Toolbar>
);

/**
 * Every mode on. The editor itself offers `edit` only, so a test that switches
 * modes has to ask for the others, the same as a host does.
 */
export const ALL_MODES: MarkdownEditorMode[] = ["edit", "source", "view"];

/**
 * All optional features on.
 * For tests that ask what markdown the editor *can* handle, not what it handles by default.
 */
export const ALL_OPTIONAL_FEATURES: MarkdownEditorOptionalFeatures = {
	strikethrough: true,
	taskList: true,
	table: true,
	autolink: true,
	highlight: true,
	underline: true,
	subscript: true,
	superscript: true
};

/**
 * Only the four that need HTML tags — `<mark>`, `<u>`, `<sub>`, `<sup>`.
 *
 * They are off by default, because markdown has no syntax for them.
 */
export const INLINE_FORMAT_FEATURES: MarkdownEditorOptionalFeatures = {
	highlight: true,
	underline: true,
	subscript: true,
	superscript: true
};
