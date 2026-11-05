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
import { Icon } from "../../../icon/main/icon.view.js";
import { List } from "../../../list/main/list.view.js";
import { PopUpMenu } from "../../../pop-up-menu/main/pop-up-menu.view.js";
import type { MarkdownEditorProps } from "../markdown-editor.api.js";
import { useMarkdownEditorSurfaces } from "../shared/surfaces-context.js";
import { useMarkdownEditorToolbarState } from "../shared/toolbar-context.js";

import { ToolbarButton } from "./toolbar-button.view.js";
import type { HeadingLevel } from "./toolbar-command-registry.js";
import { useToolbarCommand } from "./toolbar-command-registry.js";
import { useToolbarMenu } from "./use-toolbar-menu.js";

/**
 * Block-type picker: paragraph and headings H1–H6, with the active block marked
 * as selected. Applies `setParagraph()` / `toggleHeading({ level })`; in source
 * mode it applies the corresponding markdown line prefix.
 */
export const HeadingMenu: FC<MarkdownEditorProps.ToolbarControlProps> = ({ disabled: disabledProp }) => {
	const runCommand = useToolbarCommand();
	const { disabled: toolbarDisabled } = useMarkdownEditorSurfaces();
	const toolbarState = useMarkdownEditorToolbarState();
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const { menuProps, pick } = useToolbarMenu();

	const disabled = disabledProp || toolbarDisabled;

	const items: Array<{ level: HeadingLevel; label?: string; icon: string }> = [
		{ level: 0, label: titles?.paragraph, icon: "subject" },
		{ level: 1, label: titles?.heading1, icon: "format_h1" },
		{ level: 2, label: titles?.heading2, icon: "format_h2" },
		{ level: 3, label: titles?.heading3, icon: "format_h3" },
		{ level: 4, label: titles?.heading4, icon: "format_h4" },
		{ level: 5, label: titles?.heading5, icon: "format_h5" },
		{ level: 6, label: titles?.heading6, icon: "format_h6" }
	];

	const applyLevel = (level: HeadingLevel): void => pick(() => runCommand("setHeading", level));

	return (
		<PopUpMenu
			{...menuProps}
			disabled={disabled}
			dataRole={DataRoles.MarkdownEditor.ToolbarItem}
			triggerElement={
				<ToolbarButton
					icon="title"
					title={titles?.headingMenu}
					active={toolbarState.headingLevel > 0}
					disabled={disabled}
				/>
			}
		>
			<List role="menu" dataRole={DataRoles.MarkdownEditor.ToolbarList}>
				{items.map((item) => (
					<List.Item
						key={item.level}
						htmlAttributes={{ role: "menuitem" }}
						dataRole={DataRoles.MarkdownEditor.ToolbarListItem}
						text={item.label}
						graphic={<Icon>{item.icon}</Icon>}
						selected={toolbarState.headingLevel === item.level}
						onClick={() => applyLevel(item.level)}
					/>
				))}
			</List>
		</PopUpMenu>
	);
};

HeadingMenu.displayName = "MarkdownHeadingMenu";
