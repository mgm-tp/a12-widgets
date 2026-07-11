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

/**
 * Base Theme — Unified Component Configs
 *
 * Single barrel that produces the complete, merged component config.
 * Each component config file handles its own default + overrides merging internally.
 */

import type { BaseThemeCore } from "../../schema.js";
import type { BaseThemeComponentsType } from "../../../schema/components.api.js";

import { accordionConfig } from "./accordion.config.js";
import { applicationFrameConfig } from "./application-frame.config.js";
import { applicationHeaderConfig } from "./application-header.config.js";
import { autocompleteConfig } from "./autocomplete.config.js";
import { badgeConfig } from "./badge.config.js";
import { baseInputConfig } from "./base-input.config.js";
import { breadcrumbConfig } from "./breadcrumb.config.js";
import { bulletListConfig } from "./bullet-list.config.js";
import { buttonGroupConfig } from "./button-group.config.js";
import { getButtonStyles } from "./button.config.js";
import { calendarConfig } from "./calendar.config.js";
import { calloutConfig } from "./callout.config.js";
import { cardConfig } from "./card.config.js";
import { chartsConfig } from "./charts.config.js";
import { chatConfig } from "./chat.config.js";
import { checkboxConfig } from "./checkbox.config.js";
import { collapsiblePanelConfig } from "./collapsible-panel.config.js";
import { commentListConfig } from "./comment-list.config.js";
import { commentConfig } from "./comment.config.js";
import { connectedToastConfig } from "./connected-toast.config.js";
import { contentBoxConfig } from "./contentbox.config.js";
import { counterConfig } from "./counter.config.js";
import { datePickerConfig } from "./date-picker.config.js";
import { dateTimePickerConfig } from "./date-time-picker.config.js";
import { diagramConfig } from "./diagram.config.js";
import { dropdownConfig } from "./dropdown.config.js";
import { editorConfig } from "./editor.config.js";
import { fileUploadConfig } from "./file-upload.config.js";
import { filterBarConfig } from "./filter-bar.config.js";
import { filterSelectorConfig } from "./filter-selector.config.js";
import { filterConfig } from "./filter.config.js";
import { globalMessageBoxConfig } from "./global-message-box.config.js";
import { headerTriggerConfig } from "./header-trigger.config.js";
import { iconPickerConfig } from "./icon-picker.config.js";
import { iconConfig } from "./icon.config.js";
import { CommonInputConfig } from "./input.config.js";
import { interactionHintConfig } from "./interaction-hint.config.js";
import { interactiveTileConfig } from "./interactive-tile.config.js";
import { layoutGridConfig } from "./layout-grid.config.js";
import { formConfig } from "./legacy/form.config.js";
import { linkConfig } from "./link.config.js";
import { listConfig } from "./list.config.js";
import { loginLayoutConfig } from "./login-layout.config.js";
import { masterDetailLayoutConfig } from "./master-detail-layout.config.js";
import { menuConfig } from "./menu.config.js";
import { messageBoxConfig } from "./message-box.config.js";
import { messageConfig } from "./message.config.js";
import { modalNotificationConfig } from "./modal-notification.config.js";
import { modalOverlayConfig } from "./modal-overlay.config.js";
import { multiselectConfig } from "./multiselect.config.js";
import { paginationConfig } from "./pagination.config.js";
import { popupMenuConfig } from "./popup-menu.config.js";
import { progressBarConfig } from "./progress-bar.config.js";
import { progressIndicatorConfig } from "./progress-indicator.config.js";
import { quickAccessButtonConfig } from "./quick-access-button.config.js";
import { radioConfig } from "./radio.config.js";
import { resizeAndDragContainerConfig } from "./resize-and-drag-container.config.js";
import { richTextEditorConfig } from "./rich-text-editor.config.js";
import { selectConfig } from "./select.config.js";
import { sliderConfig } from "./slider.config.js";
import { splitViewConfig } from "./split-view.config.js";
import { statusConfig } from "./status.config.js";
import { supportingPanesLayoutConfig } from "./supporting-panes-layout.config.js";
import { switchConfig } from "./switch.config.js";
import { tabPanelConfig } from "./tab-panel.config.js";
import { tableConfig } from "./table.config.js";
import { tagInputConfig } from "./tag-input.config.js";
import { tagConfig } from "./tag.config.js";
import { textAreaConfig } from "./text-area.config.js";
import { textFieldConfig } from "./text-field.config.js";
import { textOutputConfig } from "./text-output.config.js";
import { timePickerConfig } from "./time-picker.config.js";
import { toastGroupConfig } from "./toast-group.config.js";
import { toastConfig } from "./toast.config.js";
import { toggleConfig } from "./toggle.config.js";
import { tooltipConfig } from "./tooltip.config.js";
import { treeTableConfig } from "./tree-table.config.js";
import { treeConfig } from "./tree.config.js";
import { typographyConfig } from "./typography.config.js";
import { validationBarConfig } from "./validation-bar.config.js";
import { wizardConfig } from "./wizard.config.js";
import { yearMonthSelectorConfig } from "./year-month-selector.config.js";

export const BaseThemeComponentsConfigs = (theme: BaseThemeCore): BaseThemeComponentsType => {
	const t = theme;

	return {
		accordion: accordionConfig(t),
		applicationFrame: applicationFrameConfig(t),
		applicationHeader: applicationHeaderConfig(t),
		baseInput: baseInputConfig(t),
		button: getButtonStyles(t),
		calendar: calendarConfig(t),
		checkbox: checkboxConfig(t),
		collapsiblePanel: collapsiblePanelConfig(t),
		contentBox: contentBoxConfig(t),
		datePicker: datePickerConfig(t),
		dateTimePicker: dateTimePickerConfig(t),
		dropdown: dropdownConfig(t),
		editor: editorConfig(t),
		fileUpload: fileUploadConfig(t),
		filter: filterConfig(t),
		form: formConfig(t),
		headerTrigger: headerTriggerConfig(t),
		icon: iconConfig(t),
		interactionHint: interactionHintConfig(t),
		interactiveTile: interactiveTileConfig(t),
		layoutGrid: layoutGridConfig(t),
		link: linkConfig(t),
		list: listConfig(t),
		masterDetailLayout: masterDetailLayoutConfig(t),
		menu: menuConfig(t),
		modalOverlay: modalOverlayConfig(t),
		pagination: paginationConfig(t),
		popupMenu: popupMenuConfig(t),
		quickAccessButton: quickAccessButtonConfig(t),
		radio: radioConfig(t),
		richTextEditor: richTextEditorConfig(t),
		select: selectConfig(t),
		supportingPanesLayout: supportingPanesLayoutConfig(t),
		tabPanel: tabPanelConfig(t),
		table: tableConfig(t),
		tagInput: tagInputConfig(t),
		timePicker: timePickerConfig(t),
		toggle: toggleConfig(t),
		tooltip: tooltipConfig(t),
		treeTable: treeTableConfig(t),
		typography: typographyConfig(t),
		validationBar: validationBarConfig(t),
		wizard: wizardConfig(t),

		// Components with default config only
		autocomplete: autocompleteConfig(t),
		badge: badgeConfig(t),
		breadcrumb: breadcrumbConfig(t),
		bulletList: bulletListConfig(t),
		buttonGroup: buttonGroupConfig(t),
		callout: calloutConfig(t),
		card: cardConfig(t),
		charts: chartsConfig(t),
		chat: chatConfig(t),
		comment: commentConfig(t),
		commentList: commentListConfig(t),
		commonInputStyles: CommonInputConfig(t),
		connectedToast: connectedToastConfig(t),
		counter: counterConfig(t),
		diagramConfig: diagramConfig(t),
		filterBar: filterBarConfig(t),
		filterSelector: filterSelectorConfig(t),
		globalMessageBox: globalMessageBoxConfig(t),
		iconPicker: iconPickerConfig(t),
		loginLayout: loginLayoutConfig(t),
		message: messageConfig(t),
		messageBox: messageBoxConfig(t),
		modalNotification: modalNotificationConfig(t),
		multiselect: multiselectConfig(t),
		progressBar: progressBarConfig(t),
		progressIndicator: progressIndicatorConfig(t),
		resizeAndDragContainer: resizeAndDragContainerConfig(t),
		slider: sliderConfig(t),
		splitView: splitViewConfig(),
		status: statusConfig(t),
		switch: switchConfig(t),
		tag: tagConfig(t),
		textArea: textAreaConfig(t),
		textField: textFieldConfig(t),
		textOutput: textOutputConfig(t),
		toast: toastConfig(t),
		toastGroup: toastGroupConfig(t),
		tree: treeConfig(t),
		yearMonthSelector: yearMonthSelectorConfig(t)
	};
};
