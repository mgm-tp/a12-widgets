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

import type { CompactThemeType } from "../../../schema.js";

import { applicationFrameCompactConfig } from "./application_frame.config.js";
import { badgeCompactConfig } from "./badge.config.js";
import { baseInputCompactConfig } from "./base-input.config.js";
import { bulletListCompactConfig } from "./bullet-list.config.js";
import { buttonCompactConfig } from "./buttons.config.js";
import { calloutCompactConfig } from "./callout.config.js";
import { connectedToastCompactConfig } from "./connected-toast.config.js";
import { contentBoxCompactConfig } from "./contentbox.config.js";
import { datePickerCompactConfig } from "./date-picker.config.js";
import { dateTimePickerCompactConfig } from "./date-time-picker.config.js";
import { dropdownCompactConfig } from "./dropdown.config.js";
import { editorCompactConfig } from "./editor.config.js";
import { filterCompactConfig } from "./filter.config.js";
import { filterBarCompactConfig } from "./filter-bar.config.js";
import { globalMessageBoxCompactConfig } from "./global-message-box.config.js";
import { headerTriggerCompactConfig } from "./header-trigger.config.js";
import { listCompactConfig } from "./list.config.js";
import { menuCompactConfig } from "./menu.config.js";
import { paginationCompactConfig } from "./pagination.config.js";
import { popupMenuCompactConfig } from "./popup-menu.config.js";
import { quickAccessButtonCompactConfig } from "./quick-access-button.config.js";
import { radioCompactConfig } from "./radio.config.js";
import { statusCompactConfig } from "./status.config.js";
import { switchCompactConfig } from "./switch.config.js";
import { tagCompactConfig } from "./tag.config.js";
import { textAreaCompactConfig } from "./text-area.config.js";
import { timePickerCompactConfig } from "./time-picker.config.js";
import { toastCompactConfig } from "./toast.config.js";
import { toastGroupCompactConfig } from "./toast-group.config.js";
import { treeCompactConfig } from "./tree.config.js";
import { typographyCompactConfig } from "./typography.config.js";
import { tableCompactConfig } from "./table.config.js";
import { treeTableCompactConfig } from "./tree-table.config.js";
import { wizardCompactConfig } from "./wizard.config.js";
import { richTextEditorCompactConfig } from "./rich-text-editor.config.js";
import { supportingPanesLayoutCompactConfig } from "./supporting-panes-layout.config.js";
import { calendarCompactConfig } from "./calendar.config.js";

export const CompactComponentsConfigs = (theme: CompactThemeType) => {
	return {
		applicationFrame: applicationFrameCompactConfig(theme),
		badge: badgeCompactConfig(theme),
		baseInput: baseInputCompactConfig(theme),
		bulletList: bulletListCompactConfig(theme),
		button: buttonCompactConfig(theme),
		callout: calloutCompactConfig(theme),
		connectedToast: connectedToastCompactConfig(theme),
		contentBox: contentBoxCompactConfig(theme),
		datePicker: datePickerCompactConfig(theme),
		dateTimePicker: dateTimePickerCompactConfig(theme),
		dropdown: dropdownCompactConfig(theme),
		editor: editorCompactConfig(theme),
		filter: filterCompactConfig(theme),
		filterBar: filterBarCompactConfig(theme),
		globalMessageBox: globalMessageBoxCompactConfig(theme),
		headerTrigger: headerTriggerCompactConfig(theme),
		list: listCompactConfig(theme),
		menu: menuCompactConfig(theme),
		pagination: paginationCompactConfig(theme),
		popupMenu: popupMenuCompactConfig(theme),
		quickAccessButton: quickAccessButtonCompactConfig(theme),
		radio: radioCompactConfig(theme),
		richTextEditor: richTextEditorCompactConfig(theme),
		status: statusCompactConfig(theme),
		supportingPanesLayout: supportingPanesLayoutCompactConfig(theme),
		switch: switchCompactConfig(theme),
		table: tableCompactConfig(theme),
		tag: tagCompactConfig(theme),
		textArea: textAreaCompactConfig(theme),
		timePicker: timePickerCompactConfig(theme),
		toast: toastCompactConfig(theme),
		toastGroup: toastGroupCompactConfig(theme),
		tree: treeCompactConfig(theme),
		treeTable: treeTableCompactConfig(theme),
		typography: typographyCompactConfig(theme),
		wizard: wizardCompactConfig(theme),
		calendar: calendarCompactConfig(theme)
	};
};
