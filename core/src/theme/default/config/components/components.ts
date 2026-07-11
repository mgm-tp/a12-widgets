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

import type { BaseThemeType } from "../../../schema/base-theme.js";

import type { AccordionConfigType } from "./accordion.config.js";
import { accordionConfig } from "./accordion.config.js";
import type { BadgeConfigType } from "./badge.config.js";
import { badgeConfig } from "./badge.config.js";
import type { CounterConfigType } from "./counter.config.js";
import { counterConfig } from "./counter.config.js";
import type { ButtonConfigType } from "./button.config.js";
import { getButtonStyles } from "./button.config.js";
import type { CollapsiblePanelConfigType } from "./collapsible-panel.config.js";
import { collapsiblePanelConfig } from "./collapsible-panel.config.js";
import type { DatePickerConfigType } from "./date-picker.config.js";
import { datePickerConfig } from "./date-picker.config.js";
import type { DateTimePickerConfigType } from "./date-time-picker.config.js";
import { dateTimePickerConfig } from "./date-time-picker.config.js";
import type { DiagramConfigType } from "./diagram.config.js";
import { diagramConfig } from "./diagram.config.js";
import type { FormConfigType } from "./legacy/form.config.js";
import { formConfig } from "./legacy/form.config.js";
import type { CommonInputConfigType } from "./input.config.js";
import { CommonInputConfig } from "./input.config.js";
import type { IconConfigType } from "./icon.config.js";
import { iconConfig } from "./icon.config.js";
import type { ApplicationFrameConfigType } from "./application-frame.config.js";
import { applicationFrameConfig } from "./application-frame.config.js";
import type { ApplicationHeaderConfigType } from "./application-header.config.js";
import { applicationHeaderConfig } from "./application-header.config.js";
import type { LayoutGridConfigType } from "./layout-grid.config.js";
import { layoutGridConfig } from "./layout-grid.config.js";
import type { SplitViewConfigType } from "./split-view.config.js";
import { splitViewConfig } from "./split-view.config.js";
import type { MenuConfigType } from "./menu.config.js";
import { menuConfig } from "./menu.config.js";
import type { ListConfigType } from "./list.config.js";
import { listConfig } from "./list.config.js";
import type { ButtonGroupConfigType } from "./button-group.config.js";
import { buttonGroupConfig } from "./button-group.config.js";
import type { ModalOverlayConfigType } from "./modal-overlay.config.js";
import { modalOverlayConfig } from "./modal-overlay.config.js";
import type { ContentboxConfigType } from "./contentbox.config.js";
import { contentBoxConfig } from "./contentbox.config.js";
import type { MasterDetailLayoutConfigType } from "./master-detail-layout.config.js";
import { masterDetailLayoutConfig } from "./master-detail-layout.config.js";
import type { LinkConfigType } from "./link.config.js";
import { linkConfig } from "./link.config.js";
import type { TabPanelConfigType } from "./tab-panel.config.js";
import { tabPanelConfig } from "./tab-panel.config.js";
import type { PopupMenuConfigType } from "./popup-menu.config.js";
import { popupMenuConfig } from "./popup-menu.config.js";
import type { CalloutConfigType } from "./callout.config.js";
import { calloutConfig } from "./callout.config.js";
import type { BulletListConfigType } from "./bullet-list.config.js";
import { bulletListConfig } from "./bullet-list.config.js";
import type { CardConfigType } from "./card.config.js";
import { cardConfig } from "./card.config.js";
import type { TypographyConfigType } from "./typography.config.js";
import { typographyConfig } from "./typography.config.js";
import type { BaseInputConfigType } from "./base-input.config.js";
import { baseInputConfig } from "./base-input.config.js";
import type { TextFieldConfigType } from "./text-field.config.js";
import { textFieldConfig } from "./text-field.config.js";
import type { BreadcrumbConfigType } from "./breadcrumb.config.js";
import { breadcrumbConfig } from "./breadcrumb.config.js";
import type { DropdownConfigType } from "./dropdown.config.js";
import { dropdownConfig } from "./dropdown.config.js";
import type { TagConfigType } from "./tag.config.js";
import { tagConfig } from "./tag.config.js";
import type { TooltipConfigType } from "./tooltip.config.js";
import { tooltipConfig } from "./tooltip.config.js";
import type { ValidationBarConfigType } from "./validation-bar.config.js";
import { validationBarConfig } from "./validation-bar.config.js";
import type { ToggleConfigType } from "./toggle.config.js";
import { toggleConfig } from "./toggle.config.js";
import type { QuickAccessButtonConfigType } from "./quick-access-button.config.js";
import { quickAccessButtonConfig } from "./quick-access-button.config.js";
import type { TextAreaConfigType } from "./text-area.config.js";
import { textAreaConfig } from "./text-area.config.js";
import type { CheckboxConfigType } from "./checkbox.config.js";
import { checkboxConfig } from "./checkbox.config.js";
import type { ChatConfigType } from "./chat.config.js";
import { chatConfig } from "./chat.config.js";
import type { SwitchConfigType } from "./switch.config.js";
import { switchConfig } from "./switch.config.js";
import type { AutocompleteConfigType } from "./autocomplete.config.js";
import { autocompleteConfig } from "./autocomplete.config.js";
import type { ToastConfigType } from "./toast.config.js";
import { toastConfig } from "./toast.config.js";
import type { ConnectedToastConfigType } from "./connected-toast.config.js";
import { connectedToastConfig } from "./connected-toast.config.js";
import type { ToastGroupConfigType } from "./toast-group.config.js";
import { toastGroupConfig } from "./toast-group.config.js";
import type { TextOutputConfigType } from "./text-output.config.js";
import { textOutputConfig } from "./text-output.config.js";
import type { IconPickerConfigType } from "./icon-picker.config.js";
import { iconPickerConfig } from "./icon-picker.config.js";
import type { RadioConfigType } from "./radio.config.js";
import { radioConfig } from "./radio.config.js";
import type { MessageConfigType } from "./message.config.js";
import { messageConfig } from "./message.config.js";
import type { FileUploadConfigType } from "./file-upload.config.js";
import { fileUploadConfig } from "./file-upload.config.js";
import type { MultiselectConfigType } from "./multiselect.config.js";
import { multiselectConfig } from "./multiselect.config.js";
import type { ModalNotificationConfigType } from "./modal-notification.config.js";
import { modalNotificationConfig } from "./modal-notification.config.js";
import type { SelectConfigType } from "./select.config.js";
import { selectConfig } from "./select.config.js";
import type { MessageBoxConfigType } from "./message-box.config.js";
import { messageBoxConfig } from "./message-box.config.js";
import type { YearMonthSelectorConfigType } from "./year-month-selector.config.js";
import { yearMonthSelectorConfig } from "./year-month-selector.config.js";
import type { ProgressIndicatorConfigType } from "./progress-indicator.config.js";
import { progressIndicatorConfig } from "./progress-indicator.config.js";
import type { CommentConfigType } from "./comment.config.js";
import { commentConfig } from "./comment.config.js";
import type { CommentListConfigType } from "./comment-list.config.js";
import { commentListConfig } from "./comment-list.config.js";
import type { GlobalMessageBoxConfigType } from "./global-message-box.config.js";
import { globalMessageBoxConfig } from "./global-message-box.config.js";
import type { FilterBarConfigType } from "./filter-bar.config.js";
import { filterBarConfig } from "./filter-bar.config.js";
import type { FilterConfigType } from "./filter.config.js";
import { filterConfig } from "./filter.config.js";
import type { TableConfigType } from "./table.config.js";
import { tableConfig } from "./table.config.js";
import type { TagInputConfigType } from "./tag-input.config.js";
import { tagInputConfig } from "./tag-input.config.js";
import type { ResizeAndDragContainerConfigType } from "./resize-and-drag-container.config.js";
import { resizeAndDragContainerConfig } from "./resize-and-drag-container.config.js";
import type { PaginationConfigType } from "./pagination.config.js";
import { paginationConfig } from "./pagination.config.js";
import type { HeaderTriggerConfigType } from "./header-trigger.config.js";
import { headerTriggerConfig } from "./header-trigger.config.js";
import type { LoginLayoutConfigType } from "./login-layout.config.js";
import { loginLayoutConfig } from "./login-layout.config.js";
import type { SliderConfigType } from "./slider.config.js";
import { sliderConfig } from "./slider.config.js";
import type { TimePickerConfigType } from "./time-picker.config.js";
import { timePickerConfig } from "./time-picker.config.js";
import type { EditorConfigType } from "./editor.config.js";
import { editorConfig } from "./editor.config.js";
import type { WizardConfigType } from "./wizard.config.js";
import { wizardConfig } from "./wizard.config.js";
import type { TreeConfigType } from "./tree.config.js";
import { treeConfig } from "./tree.config.js";
import type { ChartsConfigType } from "./charts.config.js";
import { chartsConfig } from "./charts.config.js";
import type { TreeTableConfigType } from "./tree-table.config.js";
import { treeTableConfig } from "./tree-table.config.js";
import type { FilterSelectorConfigType } from "./filter-selector.config.js";
import { filterSelectorConfig } from "./filter-selector.config.js";
import type { StatusConfigType } from "./status.config.js";
import { statusConfig } from "./status.config.js";
import type { ProgressBarConfigType } from "./progress-bar.config.js";
import { progressBarConfig } from "./progress-bar.config.js";
import type { RichTextEditorConfigType } from "./rich-text-editor.config.js";
import { richTextEditorConfig } from "./rich-text-editor.config.js";
import type { SupportingPanesLayoutConfigType } from "./supporting-panes-layout.config.js";
import { supportingPanesLayoutConfig } from "./supporting-panes-layout.config.js";
import type { InteractiveTileConfigType } from "./interactive-tile.config.js";
import { interactiveTileConfig } from "./interactive-tile.config.js";
import type { InteractionHintConfigType } from "./interaction-hint.config.js";
import { interactionHintConfig } from "./interaction-hint.config.js";
import type { CalendarConfigType } from "./calendar.config.js";
import { calendarConfig } from "./calendar.config.js";

export type DefaultComponentsType = {
	accordion: AccordionConfigType;
	applicationFrame: ApplicationFrameConfigType;
	applicationHeader: ApplicationHeaderConfigType;
	autocomplete: AutocompleteConfigType;
	badge: BadgeConfigType;
	baseInput: BaseInputConfigType;
	breadcrumb: BreadcrumbConfigType;
	bulletList: BulletListConfigType;
	button: ButtonConfigType;
	buttonGroup: ButtonGroupConfigType;
	callout: CalloutConfigType;
	card: CardConfigType;
	charts: ChartsConfigType;
	chat: ChatConfigType;
	checkbox: CheckboxConfigType;
	comment: CommentConfigType;
	commentList: CommentListConfigType;
	collapsiblePanel: CollapsiblePanelConfigType;
	commonInputStyles: CommonInputConfigType;
	connectedToast: ConnectedToastConfigType;
	contentBox: ContentboxConfigType;
	counter: CounterConfigType;
	datePicker: DatePickerConfigType;
	dateTimePicker: DateTimePickerConfigType;
	diagramConfig: DiagramConfigType;
	dropdown: DropdownConfigType;
	editor: EditorConfigType;
	richTextEditor: RichTextEditorConfigType;
	fileUpload: FileUploadConfigType;
	filter: FilterConfigType;
	filterBar: FilterBarConfigType;
	filterSelector: FilterSelectorConfigType;
	form: FormConfigType;
	globalMessageBox: GlobalMessageBoxConfigType;
	headerTrigger: HeaderTriggerConfigType;
	icon: IconConfigType;
	iconPicker: IconPickerConfigType;
	interactiveTile: InteractiveTileConfigType;
	layoutGrid: LayoutGridConfigType;
	loginLayout: LoginLayoutConfigType;
	link: LinkConfigType;
	list: ListConfigType;
	masterDetailLayout: MasterDetailLayoutConfigType;
	menu: MenuConfigType;
	message: MessageConfigType;
	messageBox: MessageBoxConfigType;
	modalNotification: ModalNotificationConfigType;
	modalOverlay: ModalOverlayConfigType;
	multiselect: MultiselectConfigType;
	pagination: PaginationConfigType;
	popupMenu: PopupMenuConfigType;
	progressBar: ProgressBarConfigType;
	progressIndicator: ProgressIndicatorConfigType;
	quickAccessButton: QuickAccessButtonConfigType;
	radio: RadioConfigType;
	resizeAndDragContainer: ResizeAndDragContainerConfigType;
	select: SelectConfigType;
	slider: SliderConfigType;
	splitView: SplitViewConfigType;
	status: StatusConfigType;
	supportingPanesLayout: SupportingPanesLayoutConfigType;
	switch: SwitchConfigType;
	tabPanel: TabPanelConfigType;
	table: TableConfigType;
	tag: TagConfigType;
	tagInput: TagInputConfigType;
	textArea: TextAreaConfigType;
	textField: TextFieldConfigType;
	textOutput: TextOutputConfigType;
	timePicker: TimePickerConfigType;
	toast: ToastConfigType;
	toastGroup: ToastGroupConfigType;
	toggle: ToggleConfigType;
	tooltip: TooltipConfigType;
	interactionHint: InteractionHintConfigType;
	tree: TreeConfigType;
	treeTable: TreeTableConfigType;
	typography: TypographyConfigType;
	validationBar: ValidationBarConfigType;
	wizard: WizardConfigType;
	yearMonthSelector: YearMonthSelectorConfigType;
	calendar: CalendarConfigType;
};

export const DefaultComponentsConfigs = (theme: BaseThemeType): DefaultComponentsType => {
	return {
		accordion: accordionConfig(theme),
		applicationFrame: applicationFrameConfig(theme),
		applicationHeader: applicationHeaderConfig(theme),
		autocomplete: autocompleteConfig(theme),
		badge: badgeConfig(theme),
		baseInput: baseInputConfig(theme),
		breadcrumb: breadcrumbConfig(theme),
		bulletList: bulletListConfig(theme),
		button: getButtonStyles(theme),
		buttonGroup: buttonGroupConfig(theme),
		callout: calloutConfig(theme),
		card: cardConfig(theme),
		charts: chartsConfig(theme),
		chat: chatConfig(theme),
		checkbox: checkboxConfig(theme),
		collapsiblePanel: collapsiblePanelConfig(theme),
		comment: commentConfig(theme),
		commentList: commentListConfig(theme),
		commonInputStyles: CommonInputConfig(theme),
		connectedToast: connectedToastConfig(theme),
		contentBox: contentBoxConfig(theme),
		counter: counterConfig(theme),
		datePicker: datePickerConfig(theme),
		dateTimePicker: dateTimePickerConfig(theme),
		diagramConfig: diagramConfig(theme),
		dropdown: dropdownConfig(theme),
		editor: editorConfig(theme),
		richTextEditor: richTextEditorConfig(theme),
		fileUpload: fileUploadConfig(theme),
		filter: filterConfig(theme),
		filterBar: filterBarConfig(theme),
		filterSelector: filterSelectorConfig(theme),
		form: formConfig(theme),
		globalMessageBox: globalMessageBoxConfig(theme),
		headerTrigger: headerTriggerConfig(theme),
		icon: iconConfig(theme),
		iconPicker: iconPickerConfig(theme),
		interactiveTile: interactiveTileConfig(theme),
		layoutGrid: layoutGridConfig(theme),
		link: linkConfig(theme),
		list: listConfig(theme),
		loginLayout: loginLayoutConfig(theme),
		masterDetailLayout: masterDetailLayoutConfig(theme),
		menu: menuConfig(theme),
		message: messageConfig(theme),
		messageBox: messageBoxConfig(theme),
		modalNotification: modalNotificationConfig(theme),
		modalOverlay: modalOverlayConfig(theme),
		multiselect: multiselectConfig(theme),
		pagination: paginationConfig(theme),
		popupMenu: popupMenuConfig(theme),
		progressBar: progressBarConfig(theme),
		progressIndicator: progressIndicatorConfig(theme),
		quickAccessButton: quickAccessButtonConfig(theme),
		radio: radioConfig(theme),
		resizeAndDragContainer: resizeAndDragContainerConfig(theme),
		select: selectConfig(theme),
		slider: sliderConfig(theme),
		splitView: splitViewConfig(),
		status: statusConfig(theme),
		supportingPanesLayout: supportingPanesLayoutConfig(theme),
		switch: switchConfig(theme),
		tabPanel: tabPanelConfig(theme),
		table: tableConfig(theme),
		tag: tagConfig(theme),
		tagInput: tagInputConfig(theme),
		textArea: textAreaConfig(theme),
		textField: textFieldConfig(theme),
		textOutput: textOutputConfig(theme),
		timePicker: timePickerConfig(theme),
		toast: toastConfig(theme),
		toastGroup: toastGroupConfig(theme),
		toggle: toggleConfig(theme),
		tooltip: tooltipConfig(theme),
		interactionHint: interactionHintConfig(theme),
		tree: treeConfig(theme),
		treeTable: treeTableConfig(theme),
		typography: typographyConfig(theme),
		validationBar: validationBarConfig(theme),
		yearMonthSelector: yearMonthSelectorConfig(theme),
		wizard: wizardConfig(theme),
		calendar: calendarConfig(theme)
	};
};
