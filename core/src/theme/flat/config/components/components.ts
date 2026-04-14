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

import type { FlatThemeType } from "../../../schema.js";

import { menuFlatConfig } from "./menu.config.js";
import { accordionFlatConfig } from "./accordion.config.js";
import { baseInputFlatConfig } from "./base-input.config.js";
import { applicationHeaderFlatConfig } from "./application-header.config.js";
import { applicationFrameFlatConfig } from "./application-frame.config.js";
import { buttonFlatConfig } from "./buttons.config.js";
import { collapsiblePanelFlatConfig } from "./collapsible-panel.config.js";
import { contentBoxFlatConfig } from "./contentbox.config.js";
import { dropdownFlatConfig } from "./dropdown.config.js";
import { iconFlatConfig } from "./icon.config.js";
import { interactionHintFlatConfig } from "./interaction-hint.config.js";
import { layoutGridFlatConfig } from "./layout-grid.config.js";
import { linkFlatConfig } from "./link.config.js";
import { masterDetailLayoutFlatConfig } from "./master-detail-layout.config.js";
import { popupMenuFlatConfig } from "./popup-menu.config.js";
import { tabPanelFlatConfig } from "./tab-panel.config.js";
import { typographyFlatConfig } from "./typography.config.js";
import { modalOverlayFlatConfig } from "./modal-overlay.config.js";
import { tooltipFlatConfig } from "./tooltip.config.js";
import { datePickerFlatConfig } from "./date-picker.config.js";
import { editorFlatConfig } from "./editor.config.js";
import { fileUploadFlatConfig } from "./file-upload.config.js";
import { filterFlatConfig } from "./filter.config.js";
import { formFlatConfig } from "./legacy/form.config.js";
import { headerTriggerFlatConfig } from "./header-trigger.config.js";
import { listFlatConfig } from "./list.config.js";
import { paginationFlatConfig } from "./pagination.config.js";
import { quickAccessButtonFlatConfig } from "./quick-access-button.config.js";
import { tableFlatConfig } from "./table.config.js";
import { tagInputFlatConfig } from "./tag-input.config.js";
import { timePickerFlatConfig } from "./time-picker.config.js";
import { toggleFlatConfig } from "./toggle.config.js";
import { treeTableFlatConfig } from "./tree-table.config.js";
import { wizardFlatConfig } from "./wizard.config.js";
import { selectFlatConfig } from "./select.config.js";
import { checkboxFlatConfig } from "./checkbox.config.js";
import { radioFlatConfig } from "./radio.config.js";
import { validationBarFlatConfig } from "./validation-bar.config.js";
import { richTextEditorFlatConfig } from "./rich-text-editor.config.js";
import { dateTimePickerFlatConfig } from "./date-time-picker.config.js";
import { supportingPanesLayoutFlatConfig } from "./supporting-panes-layout.config.js";
import { interactiveTileFlatConfig } from "./interactive-tile.config.js";
import { calendarFlatConfig } from "./calendar.config.js";

export const FlatComponentsConfigs = (theme: FlatThemeType) => {
	return {
		accordion: accordionFlatConfig(theme),
		applicationFrame: applicationFrameFlatConfig(theme),
		applicationHeader: applicationHeaderFlatConfig(theme),
		baseInput: baseInputFlatConfig(theme),
		button: buttonFlatConfig(theme),
		checkbox: checkboxFlatConfig(theme),
		collapsiblePanel: collapsiblePanelFlatConfig(theme),
		contentBox: contentBoxFlatConfig(theme),
		datePicker: datePickerFlatConfig(theme),
		dateTimePicker: dateTimePickerFlatConfig(theme),
		dropdown: dropdownFlatConfig(theme),
		editor: editorFlatConfig(theme),
		fileUpload: fileUploadFlatConfig(theme),
		filter: filterFlatConfig(),
		form: formFlatConfig(theme),
		headerTrigger: headerTriggerFlatConfig(theme),
		icon: iconFlatConfig(theme),
		interactionHint: interactionHintFlatConfig(theme),
		interactiveTile: interactiveTileFlatConfig(theme),
		layoutGrid: layoutGridFlatConfig(theme),
		link: linkFlatConfig(theme),
		list: listFlatConfig(theme),
		masterDetailLayout: masterDetailLayoutFlatConfig(theme),
		menu: menuFlatConfig(theme),
		modalOverlay: modalOverlayFlatConfig(theme),
		pagination: paginationFlatConfig(theme),
		popupMenu: popupMenuFlatConfig(theme),
		quickAccessButton: quickAccessButtonFlatConfig(theme),
		radio: radioFlatConfig(theme),
		richTextEditor: richTextEditorFlatConfig(theme),
		select: selectFlatConfig(theme),
		supportingPanesLayout: supportingPanesLayoutFlatConfig(theme),
		tabPanel: tabPanelFlatConfig(theme),
		table: tableFlatConfig(theme),
		tagInput: tagInputFlatConfig(theme),
		timePicker: timePickerFlatConfig(theme),
		toggle: toggleFlatConfig(theme),
		tooltip: tooltipFlatConfig(theme),
		treeTable: treeTableFlatConfig(theme),
		typography: typographyFlatConfig(theme),
		validationBar: validationBarFlatConfig(theme),
		wizard: wizardFlatConfig(theme),
		calendar: calendarFlatConfig()
	};
};
