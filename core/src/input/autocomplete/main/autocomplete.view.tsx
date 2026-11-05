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
 * The autocomplete widget provides autocompletion for enumerated values. It combines a
 * {@link TextField} for input with a {@link DropDown} for selecting values, with inline
 * completion of the first matching option as the user types.
 *
 * A single implementation serves both pointer and touch devices. The options are presented either in
 * an {@link AttachedPortal} anchored to the input, or — on phones, where an attached dropdown would
 * sit behind the on-screen keyboard — in a fullscreen dialog (see {@link AutocompleteModal}). The
 * `mobileModal` prop pins the presentation.
 * @module
 */

import type { ReactElement, ReactNode } from "react";
import { useContext } from "react";

import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import { Button } from "../../../button/main/button.view.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import type { Orientation } from "../../../common/main/alignment.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { provider as DeviceDetector } from "../../../common/main/device-detector.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { WidgetsResizeDetector } from "../../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { SelectionSuffix } from "../../base/template/base.tpl.view.js";
import { useFieldDefaultsConfig } from "../../field-default-config/main/field-default-config.utils.js";
import { TextField } from "../../text-field/main/template/text-field.tpl.view.js";

import type { AutocompleteProps } from "./autocomplete.api.js";
import { AutocompleteDropdown } from "./autocomplete.dropdown.view.js";
import { AutocompleteModal } from "./autocomplete.modal.view.js";
import { StyledAutocompleteWrapper } from "./autocomplete.styled.js";
import { useAutocomplete } from "./use-autocomplete.js";

const ORIENTATIONS: Orientation[] = ["bottom-start", "top-start"];
const baseClassName = addPrefix("autocomplete");

export function Autocomplete(props: AutocompleteProps): ReactElement<AutocompleteProps> {
	const {
		id,
		warningMessage,
		errorMessage,
		infoMessage,
		readonly,
		disabled,
		loading,
		loadingLabel,
		label,
		labelGraphic,
		hideLabel,
		inputPlaceHolder,
		suffixes,
		prefixes,
		tooltips,
		error,
		warning,
		info,
		ariaDescribedby,
		helperText,
		itemsWrapperClassName,
		lightBackground,
		selectedItemPosition,
		dropdownFooter,
		links,
		virtualize,
		enableClearButton = true
	} = props;

	// The validation messages and the tooltips follow the position resolved from the field's own
	// properties and the surrounding `FieldDefaultConfigProvider`; the autocomplete's fallback for the
	// tooltips is the inline one, beside the control.
	const { messagePosition, breakTooltipsToNewLine } = useFieldDefaultsConfig(props, false);

	const autocomplete = useAutocomplete(props);
	const {
		inputValue,
		matchedItems,
		selectedMatchedItem,
		hint,
		shouldShowPopup,
		showPortal,
		inputWidth,
		liveMessage,
		inputAriaProps,
		inputWrapperAriaProps,
		dropdownAriaLabelledby,
		isModalMode,
		committedValue,
		triggerAriaProps,
		setTriggerRef,
		handleTriggerClick,
		handleTriggerFocus,
		handleTriggerKeyDown,
		inputWrapperElement,
		inputLabelElement,
		helperTextElement,
		setInputRef,
		setWrapperRef,
		setInputLabelRef,
		setHelperTextRef,
		setInputWrapperRef,
		setClearButtonRef,
		navigation,
		setUpdateElementPositionHandler,
		wrapperRef,
		handleInputChange,
		handleInputKeyDown,
		handleWrapperKeyDown,
		handleInputFocus,
		handleInputBlur,
		handleInputClick,
		handleInputWrapperClick,
		handleDropdownIconClick,
		handleClearButtonClick,
		handleClearButtonMouseDown,
		handleHelperElementFocus,
		handleSelectedItemChange,
		handlePreselectedItemChange,
		handlePreselectedLinkChange,
		handlePortalVisibilityChange,
		handleClickOutside,
		handleListScroll,
		updateInputWidth
	} = autocomplete;

	const a11yTitles = useContext(A11YLanguageContext).autocompleteTitles;

	// In the dialog presentation the field in the page is a read-only trigger showing the committed
	// selection; the editable combobox lives inside the dialog. Everything else about the field —
	// label, validation messages, tooltips, helper text — is identical in both presentations.
	const fieldValue = isModalMode ? committedValue : inputValue;

	// Each field's clear button follows the value that field shows: the trigger clears the committed
	// selection, while the dialog's own field clears the draft search text the user typed into it.
	const renderClearButton = (value: string): ReactNode =>
		enableClearButton &&
		!!value &&
		!readonly && (
			<Button
				destructive
				disabled={disabled}
				title={a11yTitles?.clearTextButton}
				icon={<Icon>close</Icon>}
				onClick={handleClearButtonClick}
				onMouseDown={handleClearButtonMouseDown}
				buttonRef={setClearButtonRef}
			/>
		);

	const clearButton = renderClearButton(fieldValue);

	return (
		<WidgetsResizeDetector handleHeight={false} onResize={updateInputWidth} targetRef={wrapperRef}>
			<StyledAutocompleteWrapper
				className={joinClassNames(baseClassName, props.className)}
				style={props.style}
				onKeyDown={isModalMode ? undefined : handleWrapperKeyDown}
				data-role={DataRoles.Autocomplete}
				ref={setWrapperRef}
				$disabled={disabled}
			>
				<TextField
					id={id}
					value={fieldValue}
					label={label}
					labelGraphic={labelGraphic}
					hideLabel={hideLabel}
					labelRef={setInputLabelRef}
					placeholder={inputPlaceHolder}
					disabled={disabled}
					showHiddenText
					readonly={readonly}
					suffixes={[
						clearButton,
						suffixes,
						!readonly && (
							<SelectionSuffix
								disabled={disabled}
								onClick={isModalMode ? handleTriggerClick : handleDropdownIconClick}
							/>
						)
					]}
					prefixes={prefixes}
					tooltips={breakTooltipsToNewLine && tooltips}
					addonAfter={!breakTooltipsToNewLine && tooltips}
					breakTooltipsToNewLine={breakTooltipsToNewLine}
					messagePosition={messagePosition}
					errorMessage={errorMessage}
					warningMessage={warningMessage}
					infoMessage={infoMessage}
					error={error}
					warning={warning}
					info={info}
					onChange={() => undefined}
					onInput={isModalMode ? undefined : handleInputChange}
					onKeyDown={isModalMode ? handleTriggerKeyDown : handleInputKeyDown}
					inputRef={isModalMode ? setTriggerRef : setInputRef}
					inputWrapperRef={setInputWrapperRef}
					autoComplete="off"
					onFocus={isModalMode ? handleTriggerFocus : handleInputFocus}
					onBlur={isModalMode ? undefined : handleInputBlur}
					spellCheck={false}
					onWrapperClick={isModalMode ? handleTriggerClick : handleInputWrapperClick}
					onClick={isModalMode ? handleTriggerClick : handleInputClick}
					ariaDescribedby={ariaDescribedby}
					helperText={helperText}
					helperTextRef={setHelperTextRef}
					inputProps={isModalMode ? triggerAriaProps : inputAriaProps}
					customInputWrapperProps={inputWrapperAriaProps}
				/>
				{/* The dialog renders its own live region, because the overlay hides the page behind it
				    from assistive technology. */}
				{!isModalMode && !disabled && !readonly && (
					<HiddenText role="status" aria-live="polite" aria-atomic="true" data-role={DataRoles.Autocomplete.LiveRegion}>
						{liveMessage}
					</HiddenText>
				)}
				{/* Closes the list when NVDA's browse-mode cursor focuses past the field — which, now that
				    the list is owned by the field, is where the cursor ends up on leaving the options. */}
				{!isModalMode && !!clearButton && <HiddenText tabIndex={-1} onFocus={handleHelperElementFocus} />}
				{isModalMode
					? !disabled &&
						!readonly &&
						showPortal && (
							<AutocompleteModal
								props={props}
								autocomplete={autocomplete}
								clearButton={renderClearButton(inputValue)}
							/>
						)
					: !disabled &&
						!readonly &&
						inputWrapperElement &&
						showPortal && (
							<AttachedPortal
								closeOnClickReferenceElement={false}
								referenceElement={inputWrapperElement}
								hideOnReferenceElementPositionChange={DeviceDetector.isDesktop()}
								onVisibilityChange={handlePortalVisibilityChange}
								updateElementPosition={setUpdateElementPositionHandler}
								orientationList={ORIENTATIONS}
								fixedOrientation
								selfSizing={!DeviceDetector.hasTouch()}
								closeOnOutsideClick={inputLabelElement ? { exception: [inputLabelElement, helperTextElement] } : true}
								onClickOutside={handleClickOutside}
								focusOnOpen={false}
							>
								{/* The portal stays mounted for as long as the list counts as open, because it owns
									every path that closes it again — the outside click and the visibility change. Only
									its content is withheld while there is nothing to show, so that an empty popup does
									not hang under the field. */}
								{shouldShowPopup && (
									<AutocompleteDropdown
										attached
										id={id}
										items={matchedItems}
										selectedItem={selectedMatchedItem}
										hint={hint}
										ariaLabelledby={dropdownAriaLabelledby}
										selectedItemPosition={selectedItemPosition}
										lightBackground={lightBackground}
										links={links}
										footer={dropdownFooter}
										loading={loading}
										loadingLabel={loadingLabel}
										itemsWrapperClassName={itemsWrapperClassName}
										virtualize={virtualize}
										width={inputWidth}
										navigation={navigation}
										onSelectedItemChange={handleSelectedItemChange}
										onPreselectedItemChange={handlePreselectedItemChange}
										onPreselectedLinkChange={handlePreselectedLinkChange}
										onScroll={handleListScroll}
									/>
								)}
							</AttachedPortal>
						)}
			</StyledAutocompleteWrapper>
		</WidgetsResizeDetector>
	);
}

Autocomplete.displayName = "Autocomplete";
