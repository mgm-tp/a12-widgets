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
 * The Autocomplete's fullscreen dialog presentation, used on phones where a dropdown attached to the
 * field would sit behind the on-screen keyboard.
 *
 * Follows the WAI-ARIA APG "combobox with a dialog popup" pattern: the field in the page is a
 * read-only combobox that opens the dialog, and the dialog contains the single editable combobox with
 * its listbox. That leaves exactly one combobox reachable at any time — the previous implementation
 * had two, and hid one of them from assistive technology to compensate.
 * @module
 */

import type { ReactElement, ReactNode } from "react";
import { useContext } from "react";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { addPrefix } from "../../../common/main/utils.js";
import { ActionContentbox } from "../../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { useFieldDefaultsConfig } from "../../field-default-config/main/field-default-config.utils.js";
import { TextField } from "../../text-field/main/template/text-field.tpl.view.js";

import type { AutocompleteProps } from "./autocomplete.api.js";
import { AutocompleteDropdown } from "./autocomplete.dropdown.view.js";
import { StyledAutocompleteModal, StyledAutocompleteModalContent } from "./autocomplete.styled.js";
import type { UseAutocomplete } from "./use-autocomplete.js";

const baseClassName = addPrefix("autocomplete");

export interface AutocompleteModalProps {
	props: AutocompleteProps;
	autocomplete: UseAutocomplete;
	clearButton: ReactNode;
}

export function AutocompleteModal({ props, autocomplete, clearButton }: AutocompleteModalProps): ReactElement {
	const a11yContext = useContext(A11YLanguageContext);
	// Resolved from the same properties and provider as the field in the page behind the dialog, so both
	// place their messages and tooltips alike.
	const { messagePosition, breakTooltipsToNewLine } = useFieldDefaultsConfig(props, false);
	const {
		inputValue,
		matchedItems,
		selectedMatchedItem,
		hint,
		liveMessage,
		shouldShowPopup,
		inputAriaProps,
		dropdownAriaLabelledby,
		dialogId,
		setInputRef,
		navigation,
		handleInputChange,
		handleInputKeyDown,
		handleDialogClose,
		handleDialogSelectedItemChange,
		handlePreselectedItemChange,
		handlePreselectedLinkChange,
		handleListScroll
	} = autocomplete;

	return (
		<StyledAutocompleteModal
			className={`${baseClassName}__modal`}
			fullscreen
			noGutter
			// The dialog's own field is focused by the hook once it is mounted — without scrolling the page
			// behind the dialog, which `autoFocus` would do — and focus is returned to the trigger by the
			// hook on every close path. So the overlay must not manage either.
			focusOnOpen={false}
			focusBack={false}
			onClose={handleDialogClose}
			containerAttributes={{ id: dialogId, "aria-labelledby": props.id ? `${props.id}-label` : undefined }}
		>
			<ActionContentbox
				headingElements={<ContentBoxElements.Title text={!props.hideLabel && props.label} />}
				// In the dialog `itemsWrapperClassName` styles the body that holds the options, which is
				// where the previous mobile implementation put it; the attached presentation puts it on the
				// option list itself. The two are unified in the next major version.
				className={props.itemsWrapperClassName}
				headingButtons={
					<A11YLanguageContext.Provider
						value={{
							...a11yContext,
							contentboxTitles: {
								...a11yContext.contentboxTitles,
								closeButtonTitle: a11yContext.baseInputTitles?.closeModalButton
							}
						}}
					>
						<ContentBoxElements.CloseButton onClick={handleDialogClose} />
					</A11YLanguageContext.Provider>
				}
			>
				<StyledAutocompleteModalContent>
					<TextField
						isPhone
						value={inputValue}
						hideLabel
						label={props.label}
						placeholder={props.inputPlaceHolder}
						suffixes={[clearButton, props.suffixes]}
						prefixes={props.prefixes}
						tooltips={breakTooltipsToNewLine && props.tooltips}
						addonAfter={!breakTooltipsToNewLine && props.tooltips}
						breakTooltipsToNewLine={breakTooltipsToNewLine}
						messagePosition={messagePosition}
						errorMessage={props.errorMessage}
						warningMessage={props.warningMessage}
						infoMessage={props.infoMessage}
						error={props.error}
						warning={props.warning}
						info={props.info}
						onChange={() => undefined}
						onInput={handleInputChange}
						onKeyDown={handleInputKeyDown}
						inputRef={setInputRef}
						className={addPrefix("field-wrapper--mobile")}
						ariaDescribedby={props.ariaDescribedby}
						autoComplete="off"
						spellCheck={false}
						inputProps={inputAriaProps}
					/>
					{/* Inside the dialog, because the overlay hides the rest of the page from assistive
					    technology while it is open. */}
					<HiddenText role="status" aria-live="polite" aria-atomic="true" data-role={DataRoles.Autocomplete.LiveRegion}>
						{liveMessage}
					</HiddenText>
					{shouldShowPopup && (
						<AutocompleteDropdown
							id={props.id}
							items={matchedItems}
							selectedItem={selectedMatchedItem}
							hint={hint}
							ariaLabelledby={dropdownAriaLabelledby}
							selectedItemPosition={props.selectedItemPosition}
							lightBackground={props.lightBackground}
							links={props.links}
							footer={props.dropdownFooter}
							loading={props.loading}
							loadingLabel={props.loadingLabel}
							virtualize={props.virtualize}
							navigation={navigation}
							onSelectedItemChange={handleDialogSelectedItemChange}
							onPreselectedItemChange={handlePreselectedItemChange}
							onPreselectedLinkChange={handlePreselectedLinkChange}
							onScroll={handleListScroll}
						/>
					)}
				</StyledAutocompleteModalContent>
			</ActionContentbox>
		</StyledAutocompleteModal>
	);
}

AutocompleteModal.displayName = "AutocompleteModal";
