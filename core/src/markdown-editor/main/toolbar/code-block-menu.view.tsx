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

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { List } from "../../../list/main/list.view.js";
import { PopUpMenu } from "../../../pop-up-menu/main/pop-up-menu.view.js";
import type { MarkdownEditorProps } from "../markdown-editor.api.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { useMarkdownEditorToolbarState } from "../shared/toolbar-context.js";

import { ToolbarButton } from "./toolbar-button.view.js";
import { useToolbarCommand } from "./toolbar-command-registry.js";
import { useToolbarMenu } from "./use-toolbar-menu.js";

/** Supported code-block languages. An empty value means "plain text". */
const LANGUAGES: Array<{ value: string; label: string }> = [
	{ value: "", label: "Plain text" },
	{ value: "javascript", label: "JavaScript" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "java", label: "Java" },
	{ value: "json", label: "JSON" },
	{ value: "xml", label: "XML" },
	{ value: "html", label: "HTML" },
	{ value: "css", label: "CSS" },
	{ value: "sql", label: "SQL" },
	{ value: "bash", label: "Bash" },
	{ value: "python", label: "Python" },
	{ value: "yaml", label: "YAML" }
];

/**
 * Inserts a code block or, when already inside one, switches its language
 * through the `setCodeBlockLanguage` command.
 */
export const CodeBlockMenu: FC<MarkdownEditorProps.ToolbarControlProps> = ({ disabled: disabledProp }) => {
	const runCommand = useToolbarCommand();
	const { disabled: toolbarDisabled } = useMarkdownEditorSurfaces();
	const toolbarState = useMarkdownEditorToolbarState();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const { menuProps, pick } = useToolbarMenu();

	const disabled = disabledProp || toolbarDisabled;

	const applyLanguage = (language: string): void => pick(() => runCommand("setCodeBlockLanguage", language));

	return (
		<PopUpMenu
			{...menuProps}
			disabled={disabled}
			dataRole={DataRoles.MarkdownEditor.ToolbarItem}
			triggerElement={
				<ToolbarButton
					icon="code_blocks"
					title={titles?.codeBlockMenu}
					active={toolbarState.isCodeBlock}
					disabled={disabled}
				/>
			}
		>
			<List role="menu" dataRole={DataRoles.MarkdownEditor.ToolbarList}>
				{LANGUAGES.map((language) => (
					<List.Item
						key={language.value || "plaintext"}
						htmlAttributes={{ role: "menuitem" }}
						dataRole={DataRoles.MarkdownEditor.ToolbarListItem}
						text={language.label}
						selected={toolbarState.isCodeBlock && toolbarState.codeBlockLanguage === language.value}
						onClick={() => applyLanguage(language.value)}
					/>
				))}
			</List>
		</PopUpMenu>
	);
};

CodeBlockMenu.displayName = "MarkdownCodeBlockMenu";
