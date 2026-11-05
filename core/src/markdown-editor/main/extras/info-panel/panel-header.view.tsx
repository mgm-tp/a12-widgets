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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { LexicalSubscription } from "@lexical/react/useLexicalSubscription";
import { useLexicalSubscription } from "@lexical/react/useLexicalSubscription";
import { $getNodeByKey, type LexicalEditor, type NodeKey } from "lexical";
import type { ReactElement } from "react";
import { useCallback, useContext } from "react";

import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";

import { $isInfoPanelNode } from "./info-panel-node.js";
import { StyledInfoPanelHeader, StyledInfoPanelIcon } from "./info-panel.styled.js";
import { getInfoPanelThemeClasses } from "./theme.js";
import { getInfoPanelTitles, INFO_PANEL_ICONS, type InfoPanelType, isInfoPanelType } from "./utils.js";

// The header holds no state, so it reads its type off the panel above it.
function $readPanelType(headerKey: NodeKey): InfoPanelType {
	const panel = $getNodeByKey(headerKey)?.getParent();

	return $isInfoPanelNode(panel) ? panel.getPanelType() : "info";
}

// Repaints the header the moment the panel changes type, and leaves it alone while you type inside the panel.
function usePanelType(headerKey: NodeKey): InfoPanelType {
	const subscription = useCallback(
		(editor: LexicalEditor): LexicalSubscription<string> => ({
			// The first read happens while the header renders. `editor.read` would commit whatever
			// update is pending first — the focus that follows a toolbar pick, say — and that fires
			// update listeners, so other components would set state in the middle of this render.
			// The committed state is what put the header on screen, so it holds the panel already.
			initialValueFn: (): InfoPanelType => editor.getEditorState().read(() => $readPanelType(headerKey)),
			subscribe: (onChange): (() => void) =>
				editor.registerUpdateListener(({ editorState }) => onChange(editorState.read(() => $readPanelType(headerKey))))
		}),
		[headerKey]
	);

	const panelType = useLexicalSubscription(subscription);

	return isInfoPanelType(panelType) ? panelType : "info";
}

export function InfoPanelHeader({ nodeKey }: { nodeKey: NodeKey }): ReactElement {
	const panelType = usePanelType(nodeKey);
	const [, { getTheme }] = useLexicalComposerContext();
	const { markdownEditorTitles } = useContext(A11YLanguageContext);

	const theme = getTheme();
	const classes = getInfoPanelThemeClasses(theme);
	const infoPanelTitles = getInfoPanelTitles(markdownEditorTitles);
	const label = infoPanelTitles.types[panelType];

	return (
		<StyledInfoPanelHeader $panelType={panelType} className={classes.header}>
			<StyledInfoPanelIcon className={classes.icon} aria-hidden="true">
				{INFO_PANEL_ICONS[panelType]}
			</StyledInfoPanelIcon>
			<span className={classes.label}>{label}</span>
		</StyledInfoPanelHeader>
	);
}

InfoPanelHeader.displayName = "MarkdownInfoPanelHeader";
