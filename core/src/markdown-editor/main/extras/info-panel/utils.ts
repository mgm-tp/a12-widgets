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

import type { MarkdownEditorTitles } from "../../../../common/main/a11y-localization/a11y-key-definition.api.js";

import { $createInfoPanelContentNode, type InfoPanelContentNode } from "./info-panel-content-node.js";
import { $createInfoPanelHeaderNode } from "./info-panel-header-node.js";
import type { InfoPanelNode } from "./info-panel-node.js";

export type InfoPanelType = "info" | "note" | "success" | "warning" | "error";

export const INFO_PANEL_ICONS: Record<InfoPanelType, string> = {
	info: "info",
	note: "note",
	success: "check_circle",
	warning: "warning",
	error: "error"
};

export const INFO_PANEL_TYPES: ReadonlySet<InfoPanelType> = new Set(["info", "note", "success", "warning", "error"]);

export function isInfoPanelType(type: unknown): type is InfoPanelType {
	return INFO_PANEL_TYPES.has(type as InfoPanelType);
}

/**
 * What a host may supply for the info panel, under `markdownEditorTitles.infoPanel`.
 * Anything left out falls back to English.
 */
export interface InfoPanelResourceTitles extends Partial<Record<InfoPanelType, string>> {
	/** Accessible name of the menu on a panel. */
	menu?: string;

	/** Label of the Remove action in that menu. */
	remove?: string;
}

/*
 * The panel is an extension, so its strings sit in their own object instead of as keys
 * on `MarkdownEditorTitles`. An extension outside the library writes the same block but
 * names the package, `"@com.mgmtp.a12.widgets/widgets-core"`, in place of the path.
 */
declare module "../../../../common/main/a11y-localization/a11y-key-definition.api.js" {
	interface MarkdownEditorTitles {
		infoPanel?: InfoPanelResourceTitles;
	}
}

interface InfoPanelTitles {
	menu: string;
	remove: string;
	types: Record<InfoPanelType, string>;
}

export function getInfoPanelTitles(titles: MarkdownEditorTitles | undefined): InfoPanelTitles {
	const supplied = titles?.infoPanel;

	function getTitle(key: keyof InfoPanelResourceTitles, fallback: string): string {
		return supplied?.[key] ?? fallback;
	}

	return {
		menu: getTitle("menu", "Info panel"),
		remove: getTitle("remove", "Remove panel"),
		types: {
			info: getTitle("info", "Info"),
			note: getTitle("note", "Note"),
			success: getTitle("success", "Success"),
			warning: getTitle("warning", "Warning"),
			error: getTitle("error", "Error")
		}
	};
}

export const InfoPanelDataRoles = {
	panel: "markdown-editor-info-panel",
	menu: "markdown-editor-panel-menu"
} as const;

/*
 * The element that holds what a panel says — its paragraphs, lists, tables, even further panels.
 * Builds the panel's insides on the first call.
 *
 * Callers append straight to what comes back. No header to make by hand
 * and no need to know that this element sits between the panel and its paragraphs.
 */
export function $getOrCreateInfoPanelContent(panel: InfoPanelNode): InfoPanelContentNode {
	const existingContent = panel.getContent();

	if (existingContent !== null) {
		return existingContent;
	}

	const content = $createInfoPanelContentNode();

	panel.append($createInfoPanelHeaderNode(), content);

	return content;
}
