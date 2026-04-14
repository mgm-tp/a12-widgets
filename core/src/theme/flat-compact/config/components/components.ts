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

import type { FlatCompactThemeType } from "../../../schema.js";

import { accordionFlatCompactConfig } from "./accordion.config.js";
import { applicationFrameFlatCompactConfig } from "./application-frame.config.js";
import { baseInputFlatCompactConfig } from "./base-input.config.js";
import { buttonFlatCompactConfig } from "./buttons.config.js";
import { contentBoxFlatCompactConfig } from "./contentbox.config.js";
import { tooltipFlatCompactConfig } from "./tooltip.config.js";
import { datePickerFlatCompactConfig } from "./date-picker.config.js";
import { iconFlatCompactConfig } from "./icon.config.js";
import { interactionHintFlatCompactConfig } from "./interaction-hint.config.js";
import { listFlatCompactConfig } from "./list.config.js";
import { masterDetailLayoutFlatCompactConfig } from "./master-detail-layout.config.js";
import { menuFlatCompactConfig } from "./menu.config.js";
import { popupMenuFlatCompactConfig } from "./popup-menu.config.js";
import { tableFlatCompactConfig } from "./table.config.js";
import { tagFlatCompactConfig } from "./tag.config.js";
import { tagInputFlatCompactConfig } from "./tag-input.config.js";
import { toggleFlatCompactConfig } from "./toggle.config.js";
import { typographyFlatCompactConfig } from "./typography.config.js";
import { modalOverlayFlatCompactConfig } from "./modal-overlay.config.js";
import { quickAccessButtonFlatCompactConfig } from "./quick-access-button.config.js";
import { supportingPanesLayoutFlatCompactConfig } from "./supporting-panes-layout.config.js";
import { CalendarFlatCompactConfig } from "./calendar.config.js";
import { tabPanelFlatCompactConfig } from "./tab-panel.config.js";

export const FlatCompactComponentsConfigs = (theme: FlatCompactThemeType) => {
	return {
		accordion: accordionFlatCompactConfig(theme),
		applicationFrame: applicationFrameFlatCompactConfig(theme),
		baseInput: baseInputFlatCompactConfig(theme),
		button: buttonFlatCompactConfig(theme),
		contentBox: contentBoxFlatCompactConfig(theme),
		datePicker: datePickerFlatCompactConfig(theme),
		icon: iconFlatCompactConfig(theme),
		interactionHint: interactionHintFlatCompactConfig(theme),
		list: listFlatCompactConfig(theme),
		masterDetailLayout: masterDetailLayoutFlatCompactConfig(theme),
		menu: menuFlatCompactConfig(theme),
		modalOverlay: modalOverlayFlatCompactConfig(theme),
		popupMenu: popupMenuFlatCompactConfig(theme),
		quickAccessButton: quickAccessButtonFlatCompactConfig(theme),
		supportingPanesLayout: supportingPanesLayoutFlatCompactConfig(theme),
		table: tableFlatCompactConfig(theme),
		tabPanel: tabPanelFlatCompactConfig(theme),
		tag: tagFlatCompactConfig(theme),
		tagInput: tagInputFlatCompactConfig(theme),
		tooltip: tooltipFlatCompactConfig(theme),
		toggle: toggleFlatCompactConfig(theme),
		typography: typographyFlatCompactConfig(theme),
		calendar: CalendarFlatCompactConfig(theme)
	};
};
