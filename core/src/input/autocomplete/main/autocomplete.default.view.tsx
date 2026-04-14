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

import type { ContextType, MutableRefObject, KeyboardEvent, ChangeEvent, ReactNode } from "react";
import { createRef, Component } from "react";
import { Key } from "ts-key-enum";
import { type ResizePayload } from "react-resize-detector";

import {
	addPrefix,
	bindMethods,
	getAllFocusableElements,
	hasGotFocus,
	joinClassNames,
	StringUtils
} from "../../../common/main/utils.js";
import type { Orientation } from "../../../common/main/alignment.js";
import { getDesktopOperatingSystem, provider as DeviceDetector } from "../../../common/main/device-detector.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { DropDown } from "../../../dropdown/main/template/dropdown.tpl.view.js";
import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { ProgressIndicator } from "../../../progress-indicator/main/progress-indicator.view.js";
import { TextLineStateless } from "../../text-line/main/template/text-line.tpl.view.js";
import { SelectionSuffix } from "../../base/template/base.tpl.view.js";
import { WidgetsResizeDetector } from "../../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { isEmptyString } from "../../../common/main/utils/string-utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { AutocompleteProps } from "./autocomplete.api.js";
import {
	filterDropDownItems,
	getNewSelectedItem,
	getSelectedItem,
	isItemEmpty,
	toDropDownItem,
	toDropDownItems
} from "./autocomplete.internal.js";
import { getDropDownItemsLength } from "./autocomplete-utils.js";
import { StyledAutocompleteDropdownWrapper, StyledAutocompleteWrapper } from "./autocomplete.styled.js";

const ORIENTATIONS: Orientation[] = ["bottom-start", "top-start"];
const baseClassName = addPrefix("autocomplete");

interface DefaultAutocompleteState {
	inputText: string;
	searchText: string;
	inputWidth: number;
	showPortal: boolean;
	showFullList?: boolean;
	preselectedItem?: DropDownItem;
	selectedItem?: DropDownItem;
	items: DropDownItem[];
	totalItems: number;
	preselectedLinkIndex?: number;
	isSearched?: boolean;
	isPressedClearButton?: boolean;
}

export class DefaultAutocomplete extends Component<AutocompleteProps, DefaultAutocompleteState> {
	static displayName = "DefaultAutocomplete";

	static defaultProps = {
		enableClearButton: true
	};

	declare context: ContextType<typeof A11YLanguageContext>;

	private inputElement: HTMLInputElement | null = null;
	private inputLabelElement: HTMLElement | null = null;
	private helperTextElement: HTMLElement | null = null;
	private inputWrapperElement: HTMLElement | null = null;
	private clearButtonRef: HTMLElement | null = null;
	private dropDownInstance: DropDown | null = null;
	private previousSelectedItem: DropDownItem | undefined;
	private isDeletePressed = false;
	private outsideClick = false;
	private preventShowingDropdownAfterSelectItem = false;
	private updateElementPosition: (() => void) | undefined;
	private wrapperRef: MutableRefObject<HTMLDivElement | null> = createRef();
	private shouldIgnoreFocusEvent = false;

	constructor(props: AutocompleteProps) {
		super(props);

		const initialValue = props.initialValue || props.value;
		const initialItem = initialValue ? toDropDownItem(initialValue) : undefined;
		const initialText = initialItem?.label ?? "";
		const initialItems = (props.items as string[]).map(toDropDownItem);
		this.previousSelectedItem = initialItem;

		this.state = {
			inputText: initialText,
			searchText: initialText,
			showPortal:
				(this.props.initiallyExpanded && (this.props.items.length > 0 || this.props.hintTemplate !== "")) || false,
			inputWidth: 0,
			items: initialItems,
			totalItems: initialItems.length,
			preselectedItem: initialItem,
			selectedItem: initialItem,
			isSearched: !initialValue,
			isPressedClearButton: false
		};

		this.props.closeAndResetOption?.(() => this.closeAndResetOption());

		bindMethods(this);
	}

	private getInputRef(ref: HTMLInputElement | null): void {
		this.inputElement = ref;
		this.props.inputRef?.(ref);
	}

	private getWrapperRef(ref: HTMLDivElement | null): void {
		this.props.wrapperRef?.(ref);
		this.wrapperRef.current = ref;
	}

	private getHelperTextRef(ref: HTMLElement | null): void {
		this.helperTextElement = ref;
	}

	private getInputLabelRef(ref: HTMLLabelElement | null): void {
		this.inputLabelElement = ref;
	}

	private getInputWrapperElement(ref: HTMLElement | null): void {
		this.inputWrapperElement = ref;
	}

	private getClearButtonRef(ref: HTMLElement | null): void {
		this.clearButtonRef = ref;
	}

	private getDropDownInstance(instance: DropDown | null): void {
		this.dropDownInstance = instance;
	}

	private getUpdateElementPositionHandler(handler: () => void): void {
		this.updateElementPosition = handler;
	}

	private hasLink(): boolean {
		return !!this.props.links;
	}

	private handlePortalVisibilityChange(isVisible: boolean): void {
		this.setState({
			showPortal: isVisible,
			isSearched: !(this.props.initialValue || this.props.value) // reset `isSearched` when close and open the dropdown again
		});

		if (!isVisible) {
			this.outsideClick ? this.setState({ isSearched: false, isPressedClearButton: false }) : this.processOnClosed();
		}

		this.outsideClick = false;
	}

	private processOnClosed(callback?: () => void): void {
		this.setState(
			{
				showPortal: false,
				preselectedLinkIndex: undefined,
				isSearched: false,
				isPressedClearButton: false
			},
			callback
		);
	}

	private triggerOnValueChange(item: DropDownItem): void {
		const isItemSelected = item.value
			? item.value === this.previousSelectedItem?.value
			: item.label === this.previousSelectedItem?.label && item.id === this.previousSelectedItem?.id;

		if (this.props.onValueChange && this.props.items && !isItemSelected) {
			const isArrayOfString =
				Array.isArray(this.props.items) && this.props.items.length > 0 && typeof this.props.items[0] === "string";
			this.props.onValueChange(isArrayOfString ? item.label : item);

			this.previousSelectedItem = item.label ? item : undefined;
		}
	}

	private handleInputFocus(): void {
		if (this.shouldIgnoreFocusEvent) {
			this.shouldIgnoreFocusEvent = false;

			return;
		}

		const { openOnFocus = true, readonly, disabled } = this.props;

		if (this.state.showPortal || readonly || disabled || this.preventShowingDropdownAfterSelectItem || !openOnFocus) {
			this.preventShowingDropdownAfterSelectItem = false;

			if (!openOnFocus) {
				this.setState({ showFullList: true });
			}

			return;
		}

		this.setState(
			(prevState) => ({
				showPortal: true,
				showFullList: true,
				inputText: this.previousSelectedItem?.label ?? prevState.inputText.trim(),
				preselectedItem: this.previousSelectedItem
			}),
			() => this.props.onSearch?.("")
		);
	}

	private handleInputBlur(): void {
		this.preventShowingDropdownAfterSelectItem = false;
	}

	private handleInputWrapperClick(): void {
		const { openOnFocus = true, onSearch } = this.props;

		if (!openOnFocus && !this.state.showPortal) {
			onSearch?.(this.state.inputText);
		}

		this.inputElement?.focus();
	}

	private handleInputClick(): void {
		this.showDropdown();
	}

	private handleDropdownIconClick(): void {
		if (!this.props.disabled && !this.props.readonly) {
			this.setState({ showPortal: !this.state.showPortal }, () => {
				if (!this.hasLink() && !this.state.showPortal) {
					this.saveSelectedItem();
				}
			});
		}
	}

	private handleSelectedItemChange(item: DropDownItem): void {
		this.preventShowingDropdownAfterSelectItem = true;
		this.setState(
			{
				showPortal: false,
				inputText: item.label,
				preselectedItem: item,
				selectedItem: item,
				isPressedClearButton: false
			},
			() => this.inputElement?.focus()
		);
		this.triggerOnValueChange(item);
		this.inputElement?.setSelectionRange(item?.label.length ?? 0, item?.label.length ?? 0);
	}

	private handlePreselectedItemChange(preselectedItem: DropDownItem): void {
		if (this.hasLink()) {
			// When there is a selected item, keep the text cursor at the end while navigating the list
			if (this.state.inputText && this.state.searchText.length === this.state.inputText.length) {
				const range = this.state.inputText.length;
				this.inputElement?.setSelectionRange(range, range);
			}

			this.setState({ preselectedItem });
		} else {
			this.setState({
				preselectedItem,
				inputText: preselectedItem?.label || ""
			});
		}
	}

	private handlePreselectedLinkChange(preselectedLinkIndex: number | undefined): void {
		this.setState({ preselectedLinkIndex });
	}

	private handleWrapperKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (this.state.showPortal && event.key === Key.Escape) {
			event.stopPropagation();

			this.handleDropDownClose();
		}

		if (hasGotFocus(this.clearButtonRef) && event.key !== Key.Enter && event.key !== Key.Tab) {
			event.preventDefault();

			return;
		}

		if (event.key === Key.Tab && this.inputWrapperElement) {
			// If next focusable elements is outside inputWrapperElement, close the dropdown
			const allFocusableElements = Array.from(getAllFocusableElements(this.inputWrapperElement));
			let nextFocusableElement;
			allFocusableElements.forEach((node, index) => {
				if (node === event.target) {
					nextFocusableElement = allFocusableElements[event.shiftKey ? index - 1 : index + 1];

					return;
				}
			});

			if (!nextFocusableElement && allFocusableElements.some((node) => node === event.target)) {
				this.handleDropDownClose();
				setTimeout(this.processOnClosed);
			}
		}
	}

	private saveSelectedItem(): void {
		const { selectedItem } = this.state;
		let newItem: DropDownItem | undefined;

		const { allowAddingNewItem } = this.props;
		const { preselectedItem, inputText } = this.state;

		if (isEmptyString(inputText) && !isItemEmpty(selectedItem) && !preselectedItem) {
			newItem = toDropDownItem("");
		} else {
			const trimmedInputText = inputText.trim();

			if (allowAddingNewItem && trimmedInputText) {
				newItem = toDropDownItem(preselectedItem || trimmedInputText);
			} else if (preselectedItem) {
				newItem = toDropDownItem(preselectedItem);
			}
		}

		if (newItem) {
			this.triggerOnValueChange(newItem);
		}
	}

	private handleDeleteKey(event: KeyboardEvent<HTMLElement>): void {
		// Clear the selection of the dropdown
		this.setState({ preselectedItem: undefined });

		if (this.inputElement) {
			let textAfterDelete = this.inputElement.value;

			if (this.inputElement.selectionStart && this.inputElement.selectionEnd) {
				const selectedLength = this.inputElement.selectionEnd - this.inputElement.selectionStart;

				if (selectedLength > 0) {
					event.preventDefault();
				}

				// There are some texts selected.
				// In this case we clear the selection and put the cursor at the start of the selection
				textAfterDelete =
					this.inputElement.value.substring(0, this.inputElement.selectionStart) +
					this.inputElement.value.substring(this.inputElement.selectionEnd);
			}

			this.setState((prevState) => ({
				inputText: textAfterDelete,
				showPortal: true,
				items: prevState.items
			}));
		}
	}

	private showDropdown(): void {
		// when the dropdown is collapsed we first open it and do not change the selection
		if (!this.state.showPortal) {
			this.setState({ showPortal: true, showFullList: true });
			this.props.onSearch?.("");
		}
	}

	private handleArrowKey(event: KeyboardEvent<HTMLElement>): void {
		if (!this.state.showPortal) {
			this.showDropdown();

			return;
		}

		if (!this.props.loading) {
			this.dropDownInstance?.handleForwardedKeyboardEvent(event);
		}
	}

	private handleEnterKey(event: KeyboardEvent<HTMLElement>): void {
		const trimmedInputText = this.state.inputText.trim();

		if (this.props.loading) {
			return;
		}

		// Execute functionalities when pressing ENTER on a link
		if (
			this.hasLink() &&
			(!this.state.preselectedItem || this.state.preselectedItem.label === "") &&
			this.state.showPortal
		) {
			this.dropDownInstance?.handleForwardedKeyboardEvent(event);

			return;
		}

		// Keep the dropdown always open when pressing ENTER on the empty input
		if (
			(!this.state.showPortal || !trimmedInputText) &&
			!(this.state.showPortal && this.state.preselectedItem?.label)
		) {
			this.showDropdown();

			return;
		}

		let selectionText = "";

		if (this.state.preselectedItem !== undefined || trimmedInputText === "") {
			selectionText = this.state.preselectedItem?.label || "";
			this.setState({
				showPortal: false,
				inputText: selectionText,
				selectedItem: this.state.preselectedItem
			});
		} else if (this.props.allowAddingNewItem && trimmedInputText !== "") {
			selectionText = trimmedInputText;
			const selectedItem = toDropDownItem(trimmedInputText);
			this.setState({
				selectedItem,
				preselectedItem: selectedItem,
				showPortal: false,
				inputText: selectionText
			});
		}

		if (selectionText) {
			this.inputElement?.setSelectionRange(selectionText.length, selectionText.length);
		}

		this.saveSelectedItem();
	}

	private handleInputKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (this.props.readonly || this.props.disabled) {
			return;
		}

		this.isDeletePressed = false;

		switch (event.key) {
			case Key.Backspace:
			case Key.Delete:
				this.isDeletePressed = true;
				this.handleDeleteKey(event);
				break;
			case Key.ArrowUp:
			case Key.ArrowDown:
				event.preventDefault();
				this.handleArrowKey(event);
				break;
			case Key.Enter:
				this.handleEnterKey(event);
				break;
			default:
				return;
		}
	}

	private handleDropDownClose(): void {
		const { allowAddingNewItem } = this.props;
		const { selectedItem, preselectedItem } = this.state;

		let newInputText = "";
		let newSelectedItem: DropDownItem | undefined;
		let newPreSelectedItem: DropDownItem | undefined;

		if (!isEmptyString(this.state.inputText)) {
			if (allowAddingNewItem) {
				newInputText = this.state.inputText;
				newSelectedItem = preselectedItem;
				newPreSelectedItem = preselectedItem;
			} else if (this.hasLink()) {
				newInputText = selectedItem?.label ?? "";
				newSelectedItem = selectedItem;
				newPreSelectedItem = selectedItem;
			} else {
				newInputText = preselectedItem?.label ?? selectedItem?.label ?? "";
				newSelectedItem = preselectedItem ?? selectedItem;
				newPreSelectedItem = preselectedItem ?? selectedItem;
			}
		}

		this.setState({
			showPortal: false,
			showFullList: true,
			inputText: newInputText,
			searchText: newInputText,
			selectedItem: newSelectedItem,
			preselectedItem: newPreSelectedItem
		});

		if (!this.hasLink() || isEmptyString(newInputText)) {
			this.saveSelectedItem();
		}
	}

	private handleClickOutside(): void {
		this.outsideClick = true;

		this.handleDropDownClose();
	}

	private closeAndResetOption(): void {
		this.preventShowingDropdownAfterSelectItem = true;
		this.setState(
			(prevState) => ({
				showPortal: false,
				inputText: prevState.selectedItem?.label ?? "",
				searchText: prevState.selectedItem?.label ?? "",
				preselectedItem: prevState.selectedItem,
				showFullList: true
			}),
			() => this.inputElement?.focus()
		);
	}

	private handleClearButtonClick(): void {
		// Trick for NVDA
		// setTimeout to make sure the input value will be updated after the other actions done.
		setTimeout(() => {
			this.setState(
				(prevState) => ({
					inputText: "",
					searchText: "",
					preselectedItem: undefined,
					selectedItem: undefined,
					showFullList: true,
					showPortal: !this.props.openOnFocus ? true : prevState.showPortal,
					isPressedClearButton: true
				}),
				() => this.props.onSearch?.("")
			);
			this.triggerOnValueChange(toDropDownItem(""));
		});
	}

	/**
	 * Trick for NVDA
	 * When NVDA on, using arrow keys to navigate in browse mode and the clear button is focused,
	 * this will help the dropdown close.
	 */
	private handleHelperElementFocus(): void {
		this.setState({ showPortal: false });
	}

	private handleInputChange({ target: { value } }: ChangeEvent<HTMLInputElement>): void {
		this.setState({ searchText: value, isSearched: true, isPressedClearButton: false });

		if (this.props.onSearch) {
			this.setState({ inputText: value, showPortal: true });
			this.props.onSearch(value);

			return;
		}

		const newMatchedItems = filterDropDownItems(this.state.items, value, this.props.caseSensitive);
		this.updateSelectionRange(newMatchedItems, value);
	}

	private updateSelectionRange(newMatchedItems: DropDownItem[], searchText: string): void {
		const { preselectedItem } = this.state;
		const { onSearch, caseSensitive } = this.props;
		const newSelectedItem = getNewSelectedItem(newMatchedItems, searchText, preselectedItem, caseSensitive);

		this.setState(
			(prevState) => ({
				showFullList: searchText === "" || !!onSearch,
				inputText: searchText,
				preselectedItem:
					newSelectedItem !== undefined && prevState.inputText.length <= searchText.length
						? newSelectedItem
						: undefined,
				showPortal: onSearch ? prevState.showPortal : true
			}),
			() => {
				if (
					!this.isDeletePressed &&
					this.inputElement &&
					newSelectedItem !== undefined &&
					this.state.inputText.length <= searchText.length &&
					searchText.toLowerCase() !== newSelectedItem.label.toLowerCase()
				) {
					this.inputElement.setSelectionRange(searchText.length, newSelectedItem.label.length);
				}
			}
		);
	}

	private updateInputWidth(params: ResizePayload): void {
		if (this.inputWrapperElement) {
			const width = params.width || 0;

			if (this.state.inputWidth !== width) {
				this.setState({ inputWidth: width });
			}
		}
	}

	private getInputValueToDisplay(): string {
		const { links, loading, caseSensitive, onSearch } = this.props;
		const { inputText, selectedItem, showPortal, preselectedItem, showFullList, searchText, items } = this.state;

		const matchedItems = onSearch || showFullList ? items : filterDropDownItems(items, searchText, caseSensitive);
		const selectedMatchedItem = getSelectedItem(preselectedItem, matchedItems);

		let inputValue: string;

		if (links) {
			if (inputText === selectedItem?.label) {
				inputValue = inputText;
			} else if (selectedMatchedItem?.label.toLowerCase().startsWith(inputText.toLowerCase()) && inputText.length) {
				inputValue = inputText + (selectedMatchedItem?.label.substring(inputText.length) ?? "");
			} else {
				inputValue = inputText;
			}
		} else {
			inputValue = inputText + (selectedMatchedItem?.label.substring(inputText.length) ?? "");
		}

		if (loading) {
			inputValue = inputText || selectedMatchedItem?.label || "";
		}

		if (!showPortal) {
			inputValue = this.previousSelectedItem?.label ?? "";
		}

		return inputValue;
	}

	private handleChangeTab(): void {
		this.shouldIgnoreFocusEvent =
			this.inputElement === document.activeElement || this.inputWrapperElement === document.activeElement;
	}

	componentDidMount(): void {
		window.addEventListener("blur", this.handleChangeTab);
	}

	componentDidUpdate(prevProps: AutocompleteProps, prevState: DefaultAutocompleteState): void {
		this.updateElementPosition?.();

		if (prevProps.value !== this.props.value) {
			const newValueItem = this.props.value ? toDropDownItem(this.props.value) : undefined;
			const newInputText = newValueItem?.label ?? "";
			this.previousSelectedItem = newValueItem;
			this.setState({
				inputText: newInputText,
				preselectedItem: newValueItem,
				selectedItem: newValueItem,
				searchText: newInputText
			});
		}

		if (this.props.items !== prevProps.items && !this.props.loading) {
			this.setState(
				{
					items: toDropDownItems(this.props.items),
					totalItems: this.props.items.length
				},
				() => {
					if (!this.isDeletePressed && this.state.inputText && this.state.showPortal) {
						this.updateSelectionRange(this.state.items, this.state.inputText);
					}
				}
			);
		}

		// With link options: Set selection range when navigating to the matched item while searching
		if (
			this.hasLink() &&
			this.state.inputText &&
			this.state.preselectedItem &&
			this.inputElement &&
			this.state.preselectedItem !== prevState.preselectedItem &&
			this.state.inputText !== this.state.preselectedItem.label &&
			this.state.preselectedItem.label.toLowerCase().startsWith(this.state.inputText.toLowerCase())
		) {
			this.inputElement.setSelectionRange(this.state.inputText.length, this.state.preselectedItem.label.length);
		}

		if (prevState.showPortal && !this.state.showPortal) {
			this.props.onDropdownClose?.();
		}
	}

	componentWillUnmount(): void {
		window.removeEventListener("blur", this.handleChangeTab);
	}

	render(): ReactNode {
		const {
			id,
			warningMessage,
			errorMessage,
			infoMessage,
			ariaLabelledby,
			readonly,
			disabled,
			caseSensitive,
			hintTemplate,
			onSearch,
			loading,
			loadingLabel,
			label,
			labelGraphic,
			hideLabel,
			inputPlaceHolder,
			suffixes,
			prefixes,
			breakTooltipsToNewLine,
			tooltips,
			error,
			warning,
			info,
			ariaDescribedby,
			helperText,
			inputProps,
			itemsWrapperClassName,
			lightBackground,
			selectedItemPosition,
			dropdownFooter,
			links,
			enableClearButton
		} = this.props;

		const {
			preselectedItem,
			totalItems,
			inputWidth,
			showPortal,
			items,
			showFullList,
			searchText,
			preselectedLinkIndex,
			isSearched,
			isPressedClearButton
		} = this.state;

		const a11yTitles = this.context.autocompleteTitles;
		const unavailableInput = readonly || disabled;

		const matchedItems = onSearch || showFullList ? items : filterDropDownItems(items, searchText, caseSensitive);
		const selectedMatchedItem = getSelectedItem(preselectedItem, matchedItems);

		const preselectedLinkId =
			preselectedLinkIndex !== undefined && id ? `${id}-dropdown--link-${preselectedLinkIndex}` : undefined;

		const hint = hintTemplate
			? StringUtils.format(hintTemplate, {
					count: getDropDownItemsLength(matchedItems),
					total: totalItems
				})
			: undefined;

		const shouldShowDropDown = showPortal && !!(matchedItems.length > 0 || hint || links);
		const inputValue = this.getInputValueToDisplay();

		/**
		 * Ensure VoiceOver reads each dropdown item only once:
		 * `isSearched` indicates if there is input in the field, enabling `aria-label` to assist reading dropdown items once on Safari.
		 * `isPressedClearButton` checks if the clear button was pressed to reset the input value, ensuring the value is read once on Chrome Mac.
		 */
		const hasInitialValue = !!(this.props.initialValue || this.props.value);
		const hasSecondaryText = matchedItems.some((item) => item.children?.some((subItem) => subItem.secondaryText));
		const isMac = getDesktopOperatingSystem() === "Mac";
		const ariaHidden =
			!links &&
			((!this.state.inputText && showPortal) || isSearched || (hasSecondaryText && !isSearched) || isPressedClearButton)
				? true
				: undefined;
		const ariaLabel = ariaHidden ? inputValue : undefined;

		// Disabled `ariaOwns` when the input has no initial value and no typing has occurred yet, avoiding read twice on Safari when open autocomplete with initial value.
		const ariaOwns =
			shouldShowDropDown && (hasSecondaryText ? true : !isSearched && !hasInitialValue) && id
				? `${id}-dropdown`
				: undefined;

		const clearButton = enableClearButton && !!inputValue && !readonly && (
			<Button
				destructive
				disabled={disabled}
				title={a11yTitles?.clearTextButton}
				icon={<Icon>close</Icon>}
				onClick={this.handleClearButtonClick}
				buttonRef={this.getClearButtonRef}
			/>
		);

		return (
			<WidgetsResizeDetector handleHeight={false} onResize={this.updateInputWidth} targetRef={this.wrapperRef}>
				<StyledAutocompleteWrapper
					className={joinClassNames(baseClassName, this.props.className)}
					style={this.props.style}
					onKeyDown={this.handleWrapperKeyDown}
					data-role={DataRoles.Autocomplete}
					ref={this.getWrapperRef}
					$disabled={disabled}
				>
					<TextLineStateless
						id={id}
						value={inputValue}
						label={label}
						labelGraphic={labelGraphic}
						hideLabel={hideLabel}
						labelRef={this.getInputLabelRef}
						placeholder={inputPlaceHolder}
						disabled={disabled}
						showHiddenText
						readonly={readonly}
						suffixes={[
							clearButton,
							suffixes,
							!readonly && <SelectionSuffix disabled={disabled} onClick={this.handleDropdownIconClick} />
						]}
						prefixes={prefixes}
						tooltips={breakTooltipsToNewLine && tooltips}
						addonAfter={!breakTooltipsToNewLine && tooltips}
						errorMessage={errorMessage}
						warningMessage={warningMessage}
						infoMessage={infoMessage}
						error={error}
						warning={warning}
						info={info}
						onChange={() => undefined}
						onInput={this.handleInputChange}
						onKeyDown={this.handleInputKeyDown}
						inputRef={this.getInputRef}
						inputWrapperRef={this.getInputWrapperElement}
						autoComplete="off"
						onFocus={this.handleInputFocus}
						onBlur={this.handleInputBlur}
						spellCheck={false}
						onWrapperClick={this.handleInputWrapperClick}
						onClick={this.handleInputClick}
						ariaDescribedby={ariaDescribedby}
						helperText={helperText}
						helperTextRef={this.getHelperTextRef}
						inputProps={{
							...inputProps,
							role: unavailableInput ? undefined : "combobox",
							[`aria-label`]: ariaLabel,
							[`aria-haspopup`]: unavailableInput ? undefined : "listbox",
							[`aria-expanded`]: unavailableInput ? undefined : !!shouldShowDropDown,
							[`aria-autocomplete`]: unavailableInput ? undefined : "list",
							[`aria-activedescendant`]: shouldShowDropDown
								? (selectedMatchedItem?.id ?? preselectedLinkId)
								: undefined,
							[`aria-owns`]: ariaOwns
						}}
					/>
					{!!clearButton && <HiddenText tabIndex={-1} onFocus={this.handleHelperElementFocus} />}
					{!disabled && !readonly && this.inputWrapperElement && showPortal && (
						<AttachedPortal
							closeOnClickReferenceElement={false}
							referenceElement={this.inputWrapperElement}
							hideOnReferenceElementPositionChange={DeviceDetector.isDesktop()}
							onVisibilityChange={this.handlePortalVisibilityChange}
							updateElementPosition={this.getUpdateElementPositionHandler}
							orientationList={ORIENTATIONS}
							fixedOrientation
							selfSizing={!DeviceDetector.hasTouch()}
							closeOnOutsideClick={
								this.inputLabelElement ? { exception: [this.inputLabelElement, this.helperTextElement] } : true
							}
							onClickOutside={this.handleClickOutside}
							focusOnOpen={false}
						>
							<StyledAutocompleteDropdownWrapper
								isLoading={loading}
								onScrollCapture={() => undefined}
								className={joinClassNames(
									`${baseClassName}__dropdown`,
									{ [`${baseClassName}__dropdown--loading`]: loading },
									itemsWrapperClassName
								)}
							>
								<DropDown
									ref={this.getDropDownInstance}
									onSelectedItemChange={this.handleSelectedItemChange}
									onPreselectedItemChange={this.handlePreselectedItemChange}
									onPreselectedLinkChange={this.handlePreselectedLinkChange}
									lightBackground={lightBackground}
									id={id ? `${id}-dropdown` : undefined}
									selectedItem={selectedMatchedItem}
									items={matchedItems}
									hint={hint}
									style={{ width: inputWidth }}
									ariaLabelledby={joinClassNames(
										{ [`${id}-info`]: id && infoMessage },
										{ [`${id}-warning`]: id && warningMessage },
										{ [`${id}-error`]: id && errorMessage },
										ariaDescribedby ?? ariaLabelledby,
										{
											[`${id}-label`]: id
										}
									)}
									hideA11yLabel={isMac && ariaHidden}
									selectedItemPosition={selectedItemPosition}
									links={links}
									footer={dropdownFooter}
								/>
								{loading && (
									<ProgressIndicator
										singleOverlay
										outerOverlayVariant="bright"
										innerOverlayVariant="bright"
										size="medium"
										label={loadingLabel}
										type="horizontal"
									/>
								)}
							</StyledAutocompleteDropdownWrapper>
						</AttachedPortal>
					)}
				</StyledAutocompleteWrapper>
			</WidgetsResizeDetector>
		);
	}
}

DefaultAutocomplete.contextType = A11YLanguageContext;
