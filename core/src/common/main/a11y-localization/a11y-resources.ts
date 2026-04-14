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

import type { A11yResourceTypeDefinition } from "./a11y-key-definition.api.js";

export const A11yResourceDefinitions: A11yResourceTypeDefinition = {
	de: {
		accordionVariantTitles: {
			open: "Offen",
			info: "Information",
			error: "Fehler",
			warning: "Warnung",
			done: "Fertig",
			inProgress: "In Bearbeitung"
		},
		applicationFrameTitles: {
			sidebarCollapseButton: "Seitenbereich minimieren",
			sidebarExpandButton: "Seitenbereich vollständig anzeigen"
		},
		menuTitles: {
			selected: "Aktuelle Seite: ",
			disabled: "Inaktiv: ",
			parentItem: " Untermenü öffnen ",
			closeSubMenu: " Untermenü schließen ",
			condensedItem: " Weitere Menüpunkte",
			selectedParent: "Gewählte Ebene: ",
			mainMenuTitle: "Hauptnavigation",
			subMenuTitle: "Untermenü"
		},
		tooltipTitles: {
			tooltip: " Tooltipp schließen mit ESC",
			hintTrigger: "Info",
			successTrigger: "Erfolg",
			errorTrigger: "Fehler",
			warningTrigger: "Warnung",
			triggerElement: "Tooltipp"
		},
		filterTitles: {
			filterName: "Filter Name ",
			selectedOption: "Gewählte Option ",
			actionButton: "Löschen",
			actionButtonHiddenText: "Filter löschen: "
		},
		filterBarTitles: {
			ariaLabel: "Aktive Filter",
			actionButton: "Weniger / Mehr",
			collapseButton: "Weniger Filter anzeigen",
			expandButton: "Mehr Filter anzeigen"
		},
		paginationTitles: {
			firstPage: "Erste Seite",
			previousPage: "Vorherige Seite",
			nextPage: "Nächste Seite",
			lastPage: "Letzte Seite",
			selectedPage: "Seite"
		},
		popUpMenuTitles: {
			triggerOpenElement: "Menü öffnen",
			triggerCloseElement: "Menü schließen",
			headingTitle: "Menü"
		},
		autocompleteTitles: {
			clearTextButton: "Eingabe löschen"
		},
		breadcrumbTitles: {
			ariaLabel: "Pfadangaben",
			currentPageTitle: "Sie befinden sich hier: "
		},
		fileUploadTitles: {
			openFilePicker: "Durchsuchen",
			cancelUpload: "Upload abbrechen",
			loading: "Wird geladen",
			uploadButton: "Dokument hochladen",
			menuActionsOpen: "Dateioptionen öffnen",
			menuActionsClose: "Dateioptionen schließen",
			menuActionConnector: "für "
		},
		pickerTitles: {
			timePickerTrigger: "Wählen Sie eine Uhrzeit",
			dateTimePickerTrigger: "Wählen Sie ein Datum und eine Uhrzeit",
			datePickerTrigger: "Wählen Sie ein Datum",
			previousMonth: "Vorheriger Monat",
			nextMonth: "Nächster Monat",
			monthSelectorLabel: "Monat",
			yearSelectorLabel: "Jahr",
			headerCloseButtonLabel: "Schließen"
		},
		treeTitles: {
			expandButton: "Unterpunkte aufklappen",
			collapseButton: "Unterpunkte zuklappen",
			insertTopButton: "Oben einfügen",
			insertBottomButton: "Darunter einfügen",
			insertAsChildButton: "Als Kindelement einfügen",
			belongTo: "gehört zu",
			selectableTitle: "Auswählen",
			selectedTitle: "Gewählt",
			selectableItem: "Auswählen, ",
			selectedItem: "Gewählt, ",
			disabledItem: "Deaktiviert, ",
			highlightedItem: "Hervorgehoben, ",
			successHighlightedItem: "Erfolg, "
		},
		filterSelectorTitles: {
			ariaLabel: "Filter container",
			openFilterOptionsMobile: "Filteroptionen öffnen",
			closeFilterOptionsMobile: "Filteroptionen schließen",
			closeFilterMobile: "Filter schließen",
			clearButtonTitle: "Eingabe löschen",
			filterListTitle: "Liste: Tab-Taste zum Navigieren, Pfeilrunter gedrückt halten + Enter zum Auswählen",
			secondaryContainerAriaLabel: "Filter Optionen"
		},
		wizardTitles: {
			previousButton: "Zurück",
			nextButton: "Weiter",
			leftOutButton: "Weitere Schritte...",
			variantIcon: {
				success: `Erledigt: `,
				warning: `Warnung: `,
				error: `Fehler: `
			},
			currentStep: "Aktueller Schritt: "
		},
		validationBarTitles: {
			errorOverviewText: "Fehler, Doppeltippen für Übersicht",
			warningOverviewText: "Warnungen, Doppeltippen für Übersicht",
			infoOverviewText: "Information, Doppeltippen für Übersicht",
			errorElement: "Fehler: ",
			warningElement: "Warnung: ",
			infoElement: "Information: ",
			previousIssue: "Vorheriges Problem",
			nextIssue: "Nächstes Problem",
			sectionAriaLabel: "Status der Validierung",
			quickAccessButtonTriggerOpen: "Validierungsmenü öffnen",
			quickAccessButtonTriggerClose: "Validierungsmenü schließen"
		},
		tagTitles: {
			ariaLabel: "Stichworte",
			deleteTagButton: "Stichwort löschen"
		},
		tagInputTitles: {
			ariaLabel: "Stichworte",
			hiddenLabel: "Schlagwort Auswahlliste - Hinzufügen durch Schreiben oder Auswählen aus der Liste",
			duplicatedTagMessage: "Stichwort wurde bereits verwendet",
			saveButtonTitle: "Speichern",
			closeButtonTitle: "Schließen"
		},
		quickAccessMenuTitles: {
			quickMenuTriggerOpen: "Validierungsmenü öffnen",
			quickMenuTriggerClose: "Validierungsmenü schließen"
		},
		quickAccessButtonTitles: {
			triggerOpen: "Weitere Optionen öffnen",
			triggerClose: "Weitere Optionen schließen",
			popupMenuTitle: "Weitere Optionen"
		},
		buttonGroupTitles: {
			triggerPopupOpen: "Weitere Optionen öffnen",
			triggerPopupClose: "Weitere Optionen schließen"
		},
		tableTitles: {
			descendingIcon: "absteigend sortiert",
			ascendingIcon: "aufsteigend sortiert",
			sortableTitle: " sortierbar",
			actionTitle: "Aktion",
			selectedRowTitles: "Gewählte Zeile, ",
			successRowTitles: "Erfolg, ",
			secondaryCellTitles: "Löschen (wiederherstellbar)",
			tableLabel: "Tabelle",
			virtualizedBodyLabel: "Tabelleninhalt",
			interactiveTableLabel: "Zeilenfunktionen können mit der Eingabetaste in einer Zelle aktiviert werden.",
			footerLabel: "Tabellenfuß"
		},
		headerTriggerTitles: {
			headerTriggerText: "Gewählt ",
			buttonTriggerOpen: "Menü öffnen",
			buttonTriggerClose: "Menü schließen"
		},
		messageBoxTitles: {
			infoElement: "Information",
			successElement: "Erfolg",
			warningElement: "Warnung",
			errorElement: "Fehler"
		},
		globalMessageBoxTitles: {
			infoElement: "Information: ",
			successElement: "Erfolg: ",
			warningElement: "Warnung: ",
			errorElement: "Fehler: "
		},
		toastTitles: {
			closeToast: "Schließen"
		},
		connectedToastTitles: {
			connectedToast: ", Hinweis schließen mit ESC"
		},
		linkTitles: {
			externalLinkTitle: "Verlassen der Seite",
			mailtoLinkTitle: "E-mail"
		},
		counterTitles: {
			counterUnit: "Einträge"
		},
		iconPicker: {
			viewListMaterialIconsTitle:
				"Suche in der kompletten Material Icons Bibliothek nach einem passenden Icon." +
				" Die Material Icons Website ermöglicht einer erleichterte Suche, aber bitte benutze keine neuen Icons," +
				" die noch nicht im Icon Picker verfügbar sind.",
			clearTextButton: "Eingabe löschen"
		},
		chatTitles: {
			chatMessage: "Ich: ",
			chatMessageSaid: "sagte:",
			chatMessageYouSaid: "Sie sagten:"
		},
		baseInputTitles: {
			clearTextButton: "Eingabe löschen",
			closeModalButton: "Speichern und schließen",
			errorIconTitle: "Fehler",
			infoIconTitle: "Information",
			warningIconTitle: "Warnung"
		},
		progressIndicatorTitles: {
			loadingLabel: "Ladeprozess"
		},
		contentboxTitles: {
			backButtonTitle: "Zurück",
			closeButtonTitle: "Schließen",
			footerTitle: "Aktionsbereich",
			combinationMenuTitle: "Aktionen",
			combinationMenuTriggerOpen: "Aktionsmenü öffnen",
			combinationMenuTriggerClose: "Aktionsmenü schließen"
		},
		modalNotificationTitles: {
			infoTitle: "Information: ",
			successTitle: "Erfolg: ",
			warningTitle: "Warnung: ",
			errorTitle: "Fehler: "
		},
		listTitles: {
			selected: ", Gewählt"
		},
		badgeTitles: {
			info: "Infomeldungen",
			warning: "Warnmeldungen",
			error: "Fehlermeldungen",
			success: "Erfolgsmeldungen",
			tinyInfo: "Infomeldungen verfügbar",
			tinyWarning: "Warnmeldungen verfügbar",
			tinyError: "Fehlermeldungen verfügbar",
			tinySuccess: "Erfolgsmeldungen verfügbar"
		},
		pluginEditorTitles: {
			boldButton: "Fett",
			italicButton: "Kursiv",
			underlineButton: "Unterstrichen",
			bulletListButton: "Aufzählung",
			decreaseIndentButton: "Einzug verkleinern",
			increaseIndentButton: "Einzug vergrößern",
			numberedListButtonGroup: "Nummerierte Liste",
			alignButtonGroup: "Textausrichtung",
			alignLeftButton: "Linksbündig",
			alignRightButton: "Rechtsbündig",
			alignCenterButton: "Zentriert",
			alignJustifyButton: "Blocksatz"
		},
		treeTableTitles: {
			treeTableLabel: "Zeilenfunktionen können mit der Eingabetaste in einer Zelle aktiviert werden."
		},
		toggleButtonTitles: {
			selected: "gewählt",
			overlayTitle: "aufklappen für Optionen"
		},
		tabPanelTitles: {
			tabListAriaLabel: "Hauptnavigation",
			condensedTabTitle: "Weitere Registerkarten"
		},
		variantTitles: {
			open: "Offen",
			info: "Information",
			error: "Fehler",
			warning: "Warnung",
			done: "Fertig",
			inProgress: "In Bearbeitung"
		}
	},
	en: {
		accordionVariantTitles: {
			open: "Open",
			info: "Info",
			error: "Error",
			warning: "Warning",
			done: "Done",
			inProgress: "In progress"
		},
		applicationFrameTitles: {
			sidebarCollapseButton: "Collapse sidebar",
			sidebarExpandButton: "Expand sidebar"
		},
		menuTitles: {
			selected: "Current page: ",
			disabled: "Inactive: ",
			parentItem: " Open submenu ",
			closeSubMenu: " Close submenu ",
			condensedItem: " Further menuitems",
			selectedParent: "Chosen level: ",
			mainMenuTitle: "Main navigation",
			subMenuTitle: "Submenu"
		},
		tooltipTitles: {
			tooltip: " Press ESC to close tooltip",
			hintTrigger: "Hint",
			successTrigger: "Success",
			errorTrigger: "Error",
			warningTrigger: "Warning",
			triggerElement: "Tooltip"
		},
		filterTitles: {
			filterName: "Filter name ",
			selectedOption: "Selected option ",
			actionButton: "Delete",
			actionButtonHiddenText: "Delete filter: "
		},
		filterBarTitles: {
			ariaLabel: "Filter bar",
			actionButton: "Show less / more",
			collapseButton: "Show less filters",
			expandButton: "Show more filters"
		},
		paginationTitles: {
			firstPage: "First page",
			previousPage: "Previous page",
			nextPage: "Next page",
			lastPage: "Last page",
			selectedPage: "Page"
		},
		popUpMenuTitles: {
			triggerOpenElement: "Open menu",
			triggerCloseElement: "Close menu",
			headingTitle: "Menu"
		},
		autocompleteTitles: {
			clearTextButton: "Clear text"
		},
		breadcrumbTitles: {
			ariaLabel: "Breadcrumb",
			currentPageTitle: "You are here: "
		},
		fileUploadTitles: {
			// don't see the using place
			openFilePicker: "Browse",
			cancelUpload: "Cancel upload",
			loading: "It's loading",
			uploadButton: "Upload file",
			menuActionsOpen: "Open file options",
			menuActionsClose: "Close file options",
			menuActionConnector: "for "
		},
		pickerTitles: {
			timePickerTrigger: "Select a time",
			dateTimePickerTrigger: "Select a date and time",
			datePickerTrigger: "Select a date",
			previousMonth: "Previous Month",
			nextMonth: "Next Month",
			monthSelectorLabel: "Month",
			yearSelectorLabel: "Year",
			headerCloseButtonLabel: "Close"
		},
		treeTitles: {
			expandButton: "Expand subitems",
			collapseButton: "Collapse subitems",
			insertTopButton: "Insert top",
			insertBottomButton: "Insert below",
			insertAsChildButton: "Insert as child",
			belongTo: "belongs to",
			selectableTitle: "Selectable",
			selectedTitle: "Selected",
			selectableItem: "Selectable, ",
			selectedItem: "Selected, ",
			disabledItem: "Disabled, ",
			highlightedItem: "Highlighted, ",
			successHighlightedItem: "Success, "
		},
		filterSelectorTitles: {
			ariaLabel: "Filter container",
			openFilterOptionsMobile: "Open filter options",
			closeFilterOptionsMobile: "Close filter options",
			closeFilterMobile: "Close filter selector",
			clearButtonTitle: "Clear text",
			filterListTitle: "List: Tab key to go to option, press and hold arrow down key then enter to check / uncheck",
			secondaryContainerAriaLabel: "Filter option container"
		},
		wizardTitles: {
			previousButton: "Previous",
			nextButton: "Next",
			leftOutButton: "Further steps...",
			variantIcon: {
				success: `Completed: `,
				warning: `Warning: `,
				error: `Error: `
			},
			currentStep: "Current step: "
		},
		validationBarTitles: {
			errorOverviewText: "Errors, double tap to show list",
			warningOverviewText: "Warnings, double tap to show list",
			infoOverviewText: "Infos, double tap to show list",
			errorElement: "Error: ",
			warningElement: "Warning: ",
			infoElement: "Info: ",
			previousIssue: "Previous issue",
			nextIssue: "Next issue",
			sectionAriaLabel: "Status of validation",
			quickAccessButtonTriggerOpen: "Open validation menu",
			quickAccessButtonTriggerClose: "Close validation menu"
		},
		tagTitles: {
			ariaLabel: "Tags",
			deleteTagButton: "Remove tag"
		},
		tagInputTitles: {
			ariaLabel: "Tags",
			hiddenLabel: "Tags combobox - Add by typing or selecting out of list",
			duplicatedTagMessage: "You've already used this tag",
			saveButtonTitle: "Save",
			closeButtonTitle: "Close"
		},
		quickAccessMenuTitles: {
			quickMenuTriggerOpen: "Open validation menu",
			quickMenuTriggerClose: "Close validation menu"
		},
		quickAccessButtonTitles: {
			triggerOpen: "Open further options",
			triggerClose: "Close further options",
			popupMenuTitle: "Further options"
		},
		buttonGroupTitles: {
			triggerPopupOpen: "Open further options",
			triggerPopupClose: "Close further options"
		},
		tableTitles: {
			descendingIcon: "sorted descending",
			ascendingIcon: "sorted ascending",
			sortableTitle: " sortable",
			actionTitle: "Action",
			selectedRowTitles: "Selected row, ",
			successRowTitles: "Success, ",
			secondaryCellTitles: "Withdrawn",
			tableLabel: "Table",
			virtualizedBodyLabel: "Table body",
			interactiveTableLabel: "You can trigger the row action with Enter on a cell.",
			footerLabel: "Footer"
		},
		headerTriggerTitles: {
			headerTriggerText: "Selected ",
			buttonTriggerOpen: "Open menu",
			buttonTriggerClose: "Close menu"
		},
		messageBoxTitles: {
			infoElement: "Information",
			successElement: "Success",
			warningElement: "Warning",
			errorElement: "Error"
		},
		globalMessageBoxTitles: {
			infoElement: "Information: ",
			successElement: "Success: ",
			warningElement: "Warning: ",
			errorElement: "Error: "
		},
		toastTitles: {
			closeToast: "Close"
		},
		connectedToastTitles: {
			connectedToast: ", ESC to close message"
		},
		linkTitles: {
			externalLinkTitle: "Leave Page",
			mailtoLinkTitle: "E-mail"
		},
		counterTitles: {
			counterUnit: "Entries"
		},
		iconPicker: {
			viewListMaterialIconsTitle:
				"Explore the Material Icons website to find an icon you like." +
				" The website can be used for easier searching but if there is an icon which is new and not found in our picker," +
				" please don't use it.",
			clearTextButton: "Clear text"
		},
		chatTitles: {
			chatMessage: "Me: ",
			chatMessageSaid: "said:",
			chatMessageYouSaid: "You said:"
		},
		baseInputTitles: {
			clearTextButton: "Clear text",
			closeModalButton: "Save and close",
			errorIconTitle: "Error",
			infoIconTitle: "Information",
			warningIconTitle: "Warning"
		},
		progressIndicatorTitles: {
			loadingLabel: "Loading"
		},
		contentboxTitles: {
			backButtonTitle: "Back",
			closeButtonTitle: "Close",
			footerTitle: "Action Section",
			combinationMenuTitle: "Actions",
			combinationMenuTriggerOpen: "Open actions menu",
			combinationMenuTriggerClose: "Close actions menu"
		},
		modalNotificationTitles: {
			infoTitle: "Information: ",
			successTitle: "Success: ",
			warningTitle: "Warning: ",
			errorTitle: "Error: "
		},
		listTitles: {
			selected: ", Checked"
		},
		badgeTitles: {
			info: "Info notifications",
			warning: "Warning notifications",
			error: "Error notifications",
			success: "Success notifications",
			tinyInfo: "Info notifications available",
			tinyWarning: "Warning notifications available",
			tinyError: "Error notifications available",
			tinySuccess: "Success notifications available"
		},
		pluginEditorTitles: {
			boldButton: "Bold",
			italicButton: "Italic",
			underlineButton: "Underline",
			bulletListButton: "Bullet list",
			decreaseIndentButton: "Decrease indent",
			increaseIndentButton: "Increase indent",
			numberedListButtonGroup: "Numbered list",
			alignButtonGroup: "Text alignment",
			alignLeftButton: "Left",
			alignRightButton: "Right",
			alignCenterButton: "Centered",
			alignJustifyButton: "Justified"
		},
		treeTableTitles: {
			treeTableLabel: "You can trigger the row action with Enter on a cell."
		},
		toggleButtonTitles: {
			selected: "selected",
			overlayTitle: "expand to see options"
		},
		tabPanelTitles: {
			tabListAriaLabel: "main navigation",
			condensedTabTitle: "Further tab items"
		},
		variantTitles: {
			open: "Open",
			info: "Info",
			error: "Error",
			warning: "Warning",
			done: "Done",
			inProgress: "In progress"
		}
	}
};
