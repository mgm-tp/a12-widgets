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

import { usePeerExtensionDependency } from "@lexical/react/useExtensionComponent";
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue";
import type { LexicalEditor } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";

import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { Icon } from "../../../../icon/main/icon.view.js";
import { List } from "../../../../list/main/list.view.js";
import { PopUpMenu } from "../../../../pop-up-menu/main/pop-up-menu.view.js";
import type { MarkdownEditorProps } from "../../markdown-editor.api.js";
import { useMarkdownEditorSurfaces } from "../../shared/surfaces-context.js";
import { ToolbarButton } from "../../toolbar/toolbar-button.view.js";
import { useToolbarMenu } from "../../toolbar/use-toolbar-menu.js";

import { InfoPanelHostBridgeExtension } from "./host-bridge-extension.js";
import type { MdastInfoPanelExtension } from "./mdast-info-panel-extension.js";
import { REMOVE_INFO_PANEL_COMMAND, SET_INFO_PANEL_COMMAND, $getSelectedInfoPanel } from "./register-commands.js";
import { InfoPanelDataRoles, getInfoPanelTitles, INFO_PANEL_ICONS, type InfoPanelType } from "./utils.js";

// Source mode shows raw markdown, so a panel there is plain text:
// two fence lines around whatever is selected. It goes in like typed text, so one undo takes it out.
function $wrapSourceSelectionInPanel(panelType: InfoPanelType): void {
	const selection = $getSelection();

	if (!$isRangeSelection(selection)) {
		return;
	}

	const body = selection.getTextContent();
	const currentLine = selection.anchor.getNode().getTopLevelElement()?.getTextContent().trim() ?? "";

	// A fence is a block, so it needs a blank line on each side unless the caret
	// already sits on an empty one.
	const padding = currentLine === "" ? "" : "\n\n";

	selection.insertRawText(`${padding}:::${panelType}\n${body}\n:::${padding}`);
}

function useSelectedPanelType(richEditor: LexicalEditor, isSourceMode: boolean): InfoPanelType | null {
	const [panelType, setPanelType] = useState<InfoPanelType | null>(null);

	useEffect(() => {
		if (isSourceMode) {
			setPanelType(null);

			return;
		}

		return richEditor.registerUpdateListener(({ editorState }) => {
			setPanelType(
				editorState.read(() => {
					const panel = $getSelectedInfoPanel();

					return panel ? panel.getPanelType() : null;
				})
			);
		});
	}, [richEditor, isSourceMode]);

	return panelType;
}

export const InfoPanelMenu: FC<MarkdownEditorProps.ToolbarControlProps> = (props) => {
	const { markdownEditorTitles } = useContext(A11YLanguageContext);
	const { richEditor, disabled: toolbarDisabled, isSourceMode, sourceEditor } = useMarkdownEditorSurfaces();
	const panelExtension = usePeerExtensionDependency<typeof MdastInfoPanelExtension>("@a12/mdast/InfoPanel");
	const insertableTypes = useExtensionSignalValue(InfoPanelHostBridgeExtension, "insertableTypes");

	const { menuProps, pick } = useToolbarMenu();
	const panelType = useSelectedPanelType(richEditor, isSourceMode);

	const menuDataRole = panelExtension?.config.menu ?? InfoPanelDataRoles.menu;
	const titles = getInfoPanelTitles(markdownEditorTitles);

	const disabled = props.disabled || toolbarDisabled || (insertableTypes.size === 0 && panelType === null);

	const applyPanelType = (type: InfoPanelType): void =>
		pick(() => {
			if (isSourceMode) {
				// `discrete` writes the text now instead of on the next tick, so the focus
				// that follows the pick lands on the finished document and keeps the caret in place.
				sourceEditor?.update(() => $wrapSourceSelectionInPanel(type), { discrete: true });
			} else {
				richEditor.dispatchCommand(SET_INFO_PANEL_COMMAND, type);
			}
		});

	const removePanel = (): void => pick(() => richEditor.dispatchCommand(REMOVE_INFO_PANEL_COMMAND, undefined));

	return (
		<PopUpMenu
			{...menuProps}
			disabled={disabled}
			dataRole={menuDataRole}
			triggerElement={
				<ToolbarButton
					icon={panelType ? INFO_PANEL_ICONS[panelType] : "info"}
					title={titles.menu}
					active={panelType !== null}
					disabled={disabled}
				/>
			}
		>
			<List role="menu">
				{[...insertableTypes].map((type) => (
					<List.Item
						key={type}
						htmlAttributes={{ role: "menuitem" }}
						text={titles.types[type]}
						graphic={<Icon>{INFO_PANEL_ICONS[type]}</Icon>}
						selected={panelType === type}
						onClick={() => applyPanelType(type)}
					/>
				))}
				{panelType !== null && (
					<List.Item
						htmlAttributes={{ role: "menuitem" }}
						text={titles.remove}
						graphic={<Icon>delete</Icon>}
						onClick={removePanel}
					/>
				)}
			</List>
		</PopUpMenu>
	);
};

InfoPanelMenu.displayName = "MarkdownInfoPanelMenu";
