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

export interface ApplicationFrameTitles {
	sidebarCollapseButton?: string;
	sidebarExpandButton?: string;
}

export interface MenuTitles {
	/**
	 * If a child is selected and has an a11yTitle, its parent should have one
	 * to recognize which menu-item is chosen.
	 */
	selectedParent?: string;

	/**
	 * An a11yTitle for a menu-item or a child is selected.
	 */
	selected?: string;

	/**
	 * An a11yStatus for a menu-item is inactive or not.
	 */
	disabled?: string;

	/**
	 * An a11yTitle for an item which has children.
	 */
	parentItem?: string;

	/**
	 * An a11yTitle for the parent item when the subMenu is opened.
	 */
	closeSubMenu?: string;

	/**
	 * An a11yTitle for condensed menu item of Horizontal Flyout Menu.
	 */
	condensedItem?: string;

	/**
	 * An a11yTitle for front of main menu of Sliding Menu.
	 */
	mainMenuTitle?: string;

	/**
	 * An a11yTitle that stands in front of the list in sub-menu, NVDA will focus on it when sub-menu opens
	 * and read it, then the next TAB/Arrow-key will focus on the first visible one and work normally.
	 */
	subMenuTitle?: string;
}

export interface TooltipTitles {
	/**
	 * An a11yTitle for trigger element of tooltip.
	 */
	triggerElement?: string;

	/**
	 * An a11yTitle for trigger element of success tooltip.
	 */
	successTrigger?: string;

	/**
	 * An a11yTitle for trigger element of hint tooltip.
	 */
	hintTrigger?: string;

	/**
	 * An a11yTitle for trigger element of error tooltip.
	 */
	errorTrigger?: string;

	/**
	 * An a11yTitle for trigger element of warning tooltip.
	 */
	warningTrigger?: string;

	/**
	 * An a11yTitle for a content of tooltip.
	 */
	tooltip?: string;
}

export interface FilterTitles {
	/**
	 * An a11y for a name of Filter.
	 */
	filterName?: string;

	/**
	 * An a11y for an option of Filter.
	 */
	selectedOption?: string;

	/**
	 * An a11y of an action element of Filter.
	 */
	actionButton?: string;

	/**
	 * A hidden text of the action button element in the Filter.
	 */
	actionButtonHiddenText?: string;
}

export interface FilterBarTitles {
	/**
	 * An a11y of an action element of Filter Bar.
	 * @deprecated since 32.4.0 because the current title is fixed for both expanding and collapsing states.
	 * Use {@link expandButton} and {@link collapseButton} instead.
	 */
	actionButton?: string;

	/**
	 * An a11y of the action button which is used for expanding the Filter Bar.
	 */
	expandButton?: string;

	/**
	 * An a11y of the action button which is used for collapsing the Filter Bar.
	 */
	collapseButton?: string;

	/**
	 * An a11y of an aria-label for Filter Bar wrapper.
	 */
	ariaLabel?: string;
}

export interface PaginationTitles {
	/**
	 * An a11yTitle for a first page button.
	 */
	firstPage?: string;

	/**
	 * An a11yTitle for a previous page button.
	 */
	previousPage?: string;

	/**
	 * An a11yTitle for a next page button.
	 */
	nextPage?: string;

	/**
	 * An a11yTitle for a last page button.
	 */
	lastPage?: string;

	/**
	 * An a11yTitle for a select page.
	 */
	selectedPage?: string;
}

export interface PopUpMenuTitles {
	triggerOpenElement?: string;
	triggerCloseElement?: string;

	/**
	 * An a11yTitle for supporting Voiceover when open Popup Menu.
	 *
	 * @deprecated since 38.2.1 — The VoiceOver list-focus issue that this was introduced to work around no longer occurs.
	 */
	focusOnOpenHiddenText?: string;
	headingTitle?: string;
}

export interface AutocompleteTitles {
	clearTextButton?: string;
}

export interface FileUploadTitles {
	openFilePicker?: string;
	cancelUpload?: string;
	loading?: string;
	uploadButton?: string;
	menuActionsOpen?: string;
	menuActionsClose?: string;
	menuActionConnector?: string;
}

export interface PickerTitles {
	timePickerTrigger?: string;
	dateTimePickerTrigger?: string;
	datePickerTrigger?: string;
	previousMonth?: string;
	nextMonth?: string;
	monthSelectorLabel?: string;
	yearSelectorLabel?: string;
	headerCloseButtonLabel?: string;
}

export interface TreeTitles {
	expandButton?: string;
	collapseButton?: string;
	insertTopButton?: string;
	insertBottomButton?: string;
	insertAsChildButton?: string;
	belongTo?: string;
	selectableTitle?: string;
	selectedTitle?: string;
	selectableItem?: string;
	selectedItem?: string;
	disabledItem?: string;
	highlightedItem?: string;
	successHighlightedItem?: string;
}

export interface FilterSelectorTitles {
	/**
	 * An a11y of an aria-label for Filter Selector wrapper.
	 * @deprecated {@link filterListTitle} since 32.1.0 because the hint is not right for the current behavior anymore.
	 */
	ariaLabel?: string;
	openFilterOptionsMobile?: string;
	closeFilterOptionsMobile?: string;
	closeFilterMobile?: string;
	clearButtonTitle?: string;
	filterListTitle?: string;
	secondaryContainerAriaLabel?: string;
}

export interface WizardTitles {
	previousButton?: string;
	nextButton?: string;
	leftOutButton?: string;
	variantIcon: {
		success?: string;
		warning?: string;
		error?: string;
	};
	currentStep?: string;
}

export interface ValidationBarTitles {
	/**
	 * An a11yTitle for the text which represents the overview description of error issues.
	 */
	errorOverviewText?: string;

	/**
	 * An a11yTitle for the text which represents the overview description of warning issues.
	 */
	warningOverviewText?: string;

	/**
	 * An a11yTitle for the text which represents the overview info description.
	 */
	infoOverviewText?: string;

	/**
	 * An a11yTitle for an info item in the preview list of validation information.
	 */
	infoElement?: string;

	/**
	 * An a11yTitle for an error item in the preview list of validation issues.
	 */
	errorElement?: string;

	/**
	 * An a11yTitle for a warning item in the preview list of validation issues.
	 */
	warningElement?: string;

	/**
	 * An a11yTitle for a {@link PaginationTitles.nextPage}
	 */
	nextIssue?: string;

	/**
	 * An a11yTitle for a {@link PaginationTitles.previousPage}
	 */
	previousIssue?: string;

	/**
	 * Aria label for section tag
	 */
	sectionAriaLabel?: string;

	quickAccessButtonTriggerOpen?: string;

	quickAccessButtonTriggerClose?: string;
}

/**
 * @deprecated since 32.6.0, use {@link QuickAccessButtonTitles} instead.
 */
export interface QuickAccessMenuTitles {
	quickMenuTriggerOpen?: string;
	quickMenuTriggerClose?: string;
}

export interface QuickAccessButtonTitles {
	triggerOpen?: string;
	triggerClose?: string;

	// A visual heading text for popup menu to support visual tracking.
	popupMenuTitle?: string;
}

export interface TagTitles {
	ariaLabel?: string;
	deleteTagButton?: string;
}

export interface TagInputTitles {
	ariaLabel?: string;
	hiddenLabel?: string;
	saveButtonTitle?: string;
	closeButtonTitle?: string;

	/**
	 * An a11yTitle for Connected Toast when having duplicate tags
	 */
	duplicatedTagMessage?: string;
}

export interface TableTitles {
	/**
	 * aria-label for non-interactive Table
	 */
	tableLabel?: string;

	/**
	 * aria-label for virtualized Table's body.
	 */
	virtualizedBodyLabel?: string;

	/**
	 * aria-label for interactive Table
	 */
	interactiveTableLabel?: string;

	/**
	 * An a11yTitle for sortable arrow down of Table
	 */
	descendingIcon?: string;

	/**
	 * An a11yTitle for sortable arrow up of Table
	 */
	ascendingIcon?: string;

	/**
	 * An a11yTitle for sortable header cell of Table
	 */
	sortableTitle?: string;

	/**
	 * An a11yTitle for action header cell of Table
	 */
	actionTitle?: string;

	/**
	 * Title for secondary cell
	 */
	secondaryCellTitles?: string;

	/**
	 * Title for row which has highlightVariant = success
	 */
	successRowTitles?: string;

	/**
	 * Title for selected row
	 */
	selectedRowTitles?: string;

	/**
	 * aria-label for Table's footer
	 */
	footerLabel?: string;
}

export interface HeaderTriggerTitles {
	headerTriggerText?: string;

	/**
	 * @deprecated since 37.2.0, use {@link buttonTriggerOpen} instead.
	 */
	buttonTrigger?: string;
	buttonTriggerOpen?: string;
	buttonTriggerClose?: string;
}

export interface BreadcrumbTitles {
	/**
	 * An a11y of an aria-label for Breadcrumb wrapper.
	 */
	ariaLabel?: string;
	currentPageTitle?: string;
}

export interface MessageBoxTitles {
	infoElement?: string;
	successElement?: string;
	warningElement?: string;
	errorElement?: string;
}

export interface GlobalMessageBoxTitles {
	infoElement?: string;
	successElement?: string;
	warningElement?: string;
	errorElement?: string;
}

export interface CollapsiblePanelTitles {
	openPanel?: string;
	closePanel?: string;
}

export interface ToastTitles {
	closeToast?: string;
}

export interface ConnectedToastTitles {
	/**
	 * An a11yTitle for Connected Toast
	 */
	connectedToast?: string;
}

export interface LinkTitles {
	externalLinkTitle?: string;
	mailtoLinkTitle?: string;
}

export interface CounterTitles {
	counterUnit?: string;
}

/** @deprecated since version 38.2.0. Use {@link IconPickerTitles} instead. */
export type IconPicker = IconPickerTitles;
export interface IconPickerTitles {
	viewListMaterialIconsTitle?: string;
	clearTextButton?: string;
}

export interface ChatTitles {
	chatMessage?: string;
	chatMessageSaid?: string;
	chatMessageYouSaid?: string;
}

export interface BaseInputTitles {
	clearTextButton?: string;
	closeModalButton?: string;
	errorIconTitle?: string;
	infoIconTitle?: string;
	warningIconTitle?: string;
}

export interface ProgressIndicatorTitles {
	loadingLabel?: string;
}

export interface ContentboxTitles {
	backButtonTitle?: string;
	closeButtonTitle?: string;
	footerTitle?: string;

	// A visual heading text for popup menu to support visual tracking.
	combinationMenuTitle?: string;
	combinationMenuTriggerOpen?: string;
	combinationMenuTriggerClose?: string;
}

export interface ModalNotificationTitles {
	infoTitle?: string;
	successTitle?: string;
	warningTitle?: string;
	errorTitle?: string;
}

export interface ListTitles {
	selected?: string;
}

export interface BadgeTitles {
	/**
	 * An a11yTitle for the normal badge.
	 */
	info?: string;
	warning?: string;
	error?: string;
	success?: string;

	/**
	 * An a11yTitle for the tiny badge.
	 */
	tinyInfo?: string;
	tinyWarning?: string;
	tinyError?: string;
	tinySuccess?: string;
}

export interface TypographyTitles {
	/**
	 * An a11yTitle for the typography title.
	 */
	expand?: string;
	collapse?: string;
}

export interface AccordionTitles {
	open?: string;
	close?: string;
}

export interface PluginEditorTitles {
	/**
	 * An a11yTitle for basic toolbar buttons
	 */
	boldButton?: string;
	italicButton?: string;
	underlineButton?: string;

	/**
	 * An a11yTitle for text-indent toolbar buttons
	 */
	bulletListButton?: string;
	decreaseIndentButton?: string;
	increaseIndentButton?: string;
	numberedListButtonGroup?: string;

	/**
	 * An a11yTitle for text-align toolbar buttons
	 */
	alignButtonGroup?: string;
	alignLeftButton?: string;
	alignRightButton?: string;
	alignCenterButton?: string;
	alignJustifyButton?: string;
}

export interface TreeTableTitles {
	/**
	 * Hidden text in front of Tree Table
	 */
	treeTableLabel?: string;
}

export interface ToggleButtonTitles {
	selected?: string;
	overlayTitle?: string;
}

export interface TabPanelTitles {
	tabListAriaLabel?: string;
	condensedTabTitle?: string;
}

export interface ButtonGroupTitles {
	triggerPopupOpen?: string;
	triggerPopupClose?: string;
}

export interface VariantTitles {
	open?: string;
	info?: string;
	error?: string;
	warning?: string;
	done?: string;
	inProgress?: string;
}

export interface AccordionVariantTitles {
	open?: string;
	info?: string;
	error?: string;
	warning?: string;
	done?: string;
	inProgress?: string;
}

/**
 * Typing for all accessibility related text
 */
export interface A11yDefinition {
	accordionVariantTitles?: AccordionVariantTitles;
	applicationFrameTitles?: ApplicationFrameTitles;
	tooltipTitles?: TooltipTitles;
	menuTitles?: MenuTitles;
	filterBarTitles?: FilterBarTitles;
	filterSelectorTitles?: FilterSelectorTitles;
	filterTitles?: FilterTitles;
	paginationTitles?: PaginationTitles;
	popUpMenuTitles?: PopUpMenuTitles;
	autocompleteTitles?: AutocompleteTitles;
	breadcrumbTitles?: BreadcrumbTitles;
	fileUploadTitles?: FileUploadTitles;
	pickerTitles?: PickerTitles;
	treeTitles?: TreeTitles;
	wizardTitles?: WizardTitles;
	validationBarTitles?: ValidationBarTitles;
	quickAccessMenuTitles?: QuickAccessMenuTitles;
	quickAccessButtonTitles?: QuickAccessButtonTitles;
	buttonGroupTitles?: ButtonGroupTitles;
	tagTitles?: TagTitles;
	tagInputTitles?: TagInputTitles;
	tableTitles?: TableTitles;
	headerTriggerTitles?: HeaderTriggerTitles;
	messageBoxTitles?: MessageBoxTitles;
	globalMessageBoxTitles?: GlobalMessageBoxTitles;
	collapsiblePanelTitles?: CollapsiblePanelTitles;
	toastTitles?: ToastTitles;
	connectedToastTitles?: ConnectedToastTitles;
	linkTitles?: LinkTitles;
	counterTitles?: CounterTitles;
	iconPicker?: IconPickerTitles;
	chatTitles?: ChatTitles;
	baseInputTitles?: BaseInputTitles;
	progressIndicatorTitles?: ProgressIndicatorTitles;
	contentboxTitles?: ContentboxTitles;
	modalNotificationTitles?: ModalNotificationTitles;
	listTitles?: ListTitles;
	badgeTitles?: BadgeTitles;
	typographyTitles?: TypographyTitles;
	accordionTitles?: AccordionTitles;
	pluginEditorTitles?: PluginEditorTitles;
	treeTableTitles?: TreeTableTitles;
	toggleButtonTitles?: ToggleButtonTitles;
	tabPanelTitles?: TabPanelTitles;
	variantTitles?: VariantTitles;
}

export interface A11yResourceTypeDefinition {
	[language: string]: A11yDefinition;
}
