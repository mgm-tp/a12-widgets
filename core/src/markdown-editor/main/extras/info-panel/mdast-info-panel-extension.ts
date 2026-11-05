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

import { configExtension, safeCast } from "@lexical/extension";
import type { MdastExportHandler, MdastImportHandler } from "@lexical/mdast";
import { MdastImportExtension } from "@lexical/mdast";
import type { ReactExtension } from "@lexical/react/ReactExtension";
import { mergeRegister } from "@lexical/utils";
import { $createParagraphNode, declarePeerDependency, defineExtension } from "lexical";
import type { ContainerDirective } from "mdast-util-directive";
import { createElement } from "react";

import {
	directiveImportType,
	MdastUnknownDirectiveExtension
} from "../../extensions/mdast-unknown-directive-extension.js";

import { InfoPanelHostBridgeExtension } from "./host-bridge-extension.js";
import { InfoPanelContentNode } from "./info-panel-content-node.js";
import { InfoPanelHeaderNode } from "./info-panel-header-node.js";
import { $createInfoPanelNode, $isInfoPanelNode, InfoPanelNode } from "./info-panel-node.js";
import { InfoPanelBlockStyles } from "./info-panel.styled.js";
import { InfoPanelMenu } from "./panel-menu.view.js";
import { registerInfoPanelCommands } from "./register-commands.js";
import { registerInfoPanelSelection } from "./register-selection.js";
import { INFO_PANEL_THEME } from "./theme.js";
import { $getOrCreateInfoPanelContent, InfoPanelDataRoles, INFO_PANEL_TYPES, isInfoPanelType } from "./utils.js";

const $importInfoPanel: MdastImportHandler<ContainerDirective> = (node, mdastImportContext) => {
	if (!isInfoPanelType(node.name)) {
		return null;
	}

	const panel = $createInfoPanelNode(node.name);
	const blocks = mdastImportContext.importChildren(node);

	// `:::warning` with nothing written in it yet.
	// Give it a blank line, so there is somewhere to click and start typing.
	$getOrCreateInfoPanelContent(panel).append(...(blocks.length > 0 ? blocks : [$createParagraphNode()]));

	return panel;
};

const $exportInfoPanel: MdastExportHandler = (node, mdastExportContext) =>
	$isInfoPanelNode(node)
		? {
				type: "containerDirective",
				name: node.getPanelType(),
				children: mdastExportContext.exportChildren(node.getContentChildren()) as ContainerDirective["children"]
			}
		: null;

export const MdastInfoPanelExtension = defineExtension({
	name: "@a12/mdast/InfoPanel",
	nodes: [InfoPanelNode, InfoPanelHeaderNode, InfoPanelContentNode],
	register: (editor) => mergeRegister(registerInfoPanelCommands(editor), registerInfoPanelSelection(editor)),
	config: safeCast<typeof InfoPanelDataRoles>(InfoPanelDataRoles),
	theme: INFO_PANEL_THEME,
	// The extension's single output.
	// A consumer reaches it with `useExtensionComponent(MdastInfoPanelExtension)`
	// and puts it in their own toolbar.
	build: () => ({ Component: InfoPanelMenu }),
	peerDependencies: [
		declarePeerDependency<typeof ReactExtension>("@lexical/react/React", {
			decorators: [createElement(InfoPanelBlockStyles)]
		})
	],
	dependencies: [
		// Application data, carried in from `InfoPanelHostContext`:
		// which panel types this user can add.
		InfoPanelHostBridgeExtension,

		// Registers the `:::` grammar itself, and does the name lookup the claims below feed.
		MdastUnknownDirectiveExtension,

		configExtension(MdastImportExtension, {
			// By default an unknown `:::name` becomes a read-only placeholder.
			// Claiming the five names here routes them to this panel instead.
			importRules: [...INFO_PANEL_TYPES].map((name) => ({
				type: directiveImportType("containerDirective", name),
				$import: $importInfoPanel
			})),

			// The way back out. Without it, panels would read fine
			// and then turn into plain paragraphs the next time the editor wrote markdown.
			exportRules: [{ type: "mde-info-panel", $export: $exportInfoPanel }]
		})
	]
});
