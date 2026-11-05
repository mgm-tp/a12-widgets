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

// Info panels — `:::warning`, `:::info`, `:::note`, `:::success`, `:::error`
// A worked example of a block node that brings its own toolbar control.
//
//   MdastInfoPanelExtension       goes in `extensions`: the nodes, the markdown rule,
//                                 the commands. `useExtensionComponent` hands back
//                                 the menu for the host's own toolbar.
//   InfoPanelHostBridgeExtension  carries host data to the extension, read from `InfoPanelHostContext`
//                                 — which panel types this user may add.
export { MdastInfoPanelExtension } from "./mdast-info-panel-extension.js";
export { InfoPanelHostBridgeExtension, InfoPanelHostContext, type InfoPanelHost } from "./host-bridge-extension.js";
export { REMOVE_INFO_PANEL_COMMAND, SET_INFO_PANEL_COMMAND } from "./register-commands.js";
export { $createInfoPanelNode, $isInfoPanelNode, InfoPanelNode } from "./info-panel-node.js";
export { $isInfoPanelContentNode, InfoPanelContentNode } from "./info-panel-content-node.js";
export { $isInfoPanelHeaderNode, InfoPanelHeaderNode } from "./info-panel-header-node.js";
export {
	InfoPanelDataRoles,
	INFO_PANEL_TYPES,
	type InfoPanelResourceTitles,
	type InfoPanelType,
	isInfoPanelType
} from "./utils.js";
export { getInfoPanelPalette, type InfoPanelColors, type InfoPanelPalette, type InfoPanelTheme } from "./theme.js";
