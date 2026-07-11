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

import type { ContextType, MouseEvent, KeyboardEvent, InputEvent, FocusEvent, ReactNode } from "react";
import { isValidElement, cloneElement, Component } from "react";
import { Key } from "ts-key-enum";

import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { ActionContentbox } from "../../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { StringUtils, joinClassNames, bindMethods, addPrefix } from "../../../common/main/utils.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { DropDown } from "../../../dropdown/main/template/dropdown.tpl.view.js";
import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { ProgressIndicator } from "../../../progress-indicator/main/progress-indicator.view.js";
import { TextField } from "../../text-field/text-field.view.js";
import { SelectionSuffix } from "../../base/template/base.tpl.view.js";
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
import {
	StyledAutocompleteDropdownWrapper,
	StyledAutocompleteModal,
	StyledAutocompleteWrapper
} from "./autocomplete.styled.js";

const baseClassName = addPrefix("autocomplete");

interface MobileAutocompleteState {
	inputText: string;
	inputWidth: number;
	showModalOverlay: boolean;
	showFullList: boolean;
	preselectedItem?: DropDownItem;
	selectedItem?: DropDownItem;
	items: DropDownItem[];
	totalItems: number;
}

export class MobileAutocomplete extends Component<AutocompleteProps, MobileAutocompleteState> {
	static displayName = "MobileAutocomplete";

	static defaultProps = {
		enableClearButton: true
	};

	declare context: ContextType<typeof A11YLanguageContext>;

	private previousSelectedItem: DropDownItem | undefined;
	private inputElement: HTMLInputElement | null = null;
	private inputWrapperElement: HTMLElement | null = null;
	private inputWrapperInModalElement: HTMLElement | null = null;
	private dropdownInstance: DropDown | null = null;
	private viewportResized = false;
	private shouldShowModal = true;
	private clearButtonMouseDown = false;

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
			showModalOverlay: false,
			showFullList: true,
			preselectedItem: initialItem,
			selectedItem: initialItem,
			inputWidth: 0,
			items: initialItems,
			totalItems: initialItems.length
		};

		this.props.closeAndResetOption?.(() => this.handleModalOverlayClose());

		bindMethods(this);
	}

	private getInputElement(ref: HTMLInputElement | null): void {
		this.inputElement = ref;
		this.props.inputRef?.(ref);
	}

	private getWrapperRef(ref: HTMLDivElement | null): void {
		this.props.wrapperRef?.(ref);
	}

	private getInputWrapperElement(ref: HTMLElement | null): void {
		this.inputWrapperElement = ref;
	}

	private getInputWrapperInModalElement(ref: HTMLElement | null): void {
		this.inputWrapperInModalElement = ref;
	}

	private getDropdownInstance(instance: DropDown): void {
		this.dropdownInstance = instance;
	}

	private handleInputWrapperClick(): void {
		this.shouldShowModal = true;

		this.props.onSearch?.("");

		this.setState({ showModalOverlay: true, showFullList: true, preselectedItem: this.state.selectedItem }, () => {
			this.inputElement?.focus();
		});
	}

	private handleWindowResize(): void {
		this.viewportResized = true;
		window.removeEventListener("resize", this.handleWindowResize);
	}

	private handleWrapperFocus(): void {
		if (this.shouldIgnoreFocusEvent) {
			this.shouldIgnoreFocusEvent = false;

			return;
		}

		const { openOnFocus = true } = this.props;

		if (!openOnFocus || !this.shouldShowModal) {
			return;
		}

		this.handleActivatorElementClick();
	}

	private handleActivatorElementClick(): void {
		if (!this.shouldShowModal && !this.props.mobileTriggerElement) {
			this.shouldShowModal = true;

			return;
		}

		this.props.onSearch?.("");

		this.setState(
			{
				showFullList: true,
				showModalOverlay: true,
				inputText: this.state.selectedItem ? this.state.selectedItem.label : "",
				preselectedItem: this.state.selectedItem
			},
			() => {
				if (this.inputElement) {
					this.inputElement.focus();

					/**
					 * Force browser to put caret at the end of the input
					 */
					this.inputElement.selectionStart = this.inputElement.selectionEnd = this.state.inputText
						? this.state.inputText.length
						: 0;
				}
			}
		);
	}

	private handleModalOverlayClose(): void {
		const hasLinks = !!this.props.links;
		const { selectedItem } = this.state;

		if (isEmptyString(this.state.inputText) && !isItemEmpty(selectedItem) && !this.state.preselectedItem) {
			this.triggerOnValueChange(toDropDownItem(""));
		} else if (!hasLinks && this.state.preselectedItem) {
			this.triggerOnValueChange(this.state.preselectedItem);
		}

		this.shouldShowModal = false;
		this.inputWrapperElement?.focus();
		this.setState((prevState) => ({
			showModalOverlay: false,
			inputText: this.previousSelectedItem?.label ?? "",
			selectedItem: this.previousSelectedItem || prevState.selectedItem
		}));
	}

	private handleDropDownItemClick(item: DropDownItem): void {
		this.triggerOnValueChange(item);
		this.shouldShowModal = false;
		this.inputWrapperElement?.focus();
		this.setState({
			inputText: item.label,
			selectedItem: item,
			preselectedItem: undefined,
			showModalOverlay: false
		});
	}

	private triggerOnValueChange(item: DropDownItem): void {
		const isItemSelected = item.value
			? item.value === this.previousSelectedItem?.value
			: item.label === this.previousSelectedItem?.label && item.id === this.previousSelectedItem?.id;

		if (this.props.onValueChange && this.props.items && !isItemSelected) {
			const isArrayOfString = Array.isArray(this.props.items) && typeof this.props.items[0] === "string";
			this.props.onValueChange(isArrayOfString ? item.label : item);
			this.previousSelectedItem = item.label ? item : undefined;
		}
	}

	private handleClearButtonClick(event: MouseEvent<HTMLButtonElement>): void {
		event.stopPropagation();
		this.props.onSearch?.("");

		this.previousSelectedItem = undefined;
		this.setState({
			inputText: "",
			selectedItem: undefined,
			preselectedItem: undefined,
			showModalOverlay: true
		});

		this.triggerOnValueChange(toDropDownItem(""));
		this.inputElement?.focus();
	}

	private handleClearButtonMouseDown(event: MouseEvent<HTMLButtonElement>): void {
		// Avoid triggering blur event before the clear button is clicked on IOS
		event.preventDefault();
		event.stopPropagation();

		// This variable is used to prevent executing a change in value when the input is blurred
		this.clearButtonMouseDown = true;
	}

	private handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if (event.target !== this.inputElement && event.target !== this.inputWrapperElement) {
			return;
		}

		if (event.key === Key.Enter || event.key === Key.ArrowDown || event.key === Key.ArrowUp) {
			this.shouldShowModal = true;
			this.handleActivatorElementClick();
		}
	}

	private handleInputModalKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if (event.key === Key.Enter) {
			if ((!this.state.preselectedItem || this.state.preselectedItem.label === "") && this.props.links) {
				this.dropdownInstance?.handleForwardedKeyboardEvent(event);

				return;
			}

			if (this.state.preselectedItem) {
				this.setState(
					{ showModalOverlay: false, showFullList: true },
					() => this.state.preselectedItem && this.triggerOnValueChange(this.state.preselectedItem)
				);
			} else if (this.state.preselectedItem === undefined && this.state.inputText.trim() !== "") {
				if (this.props.allowAddingNewItem) {
					const selectedItem = toDropDownItem(this.state.inputText.trim());
					this.setState(
						{
							selectedItem: selectedItem,
							showModalOverlay: false
						},
						() => this.triggerOnValueChange(selectedItem)
					);
				}
			}
		}

		if (event.key === Key.Escape && this.props.links) {
			this.handleModalOverlayClose();
		}

		if (this.state.showModalOverlay) {
			this.dropdownInstance?.handleForwardedKeyboardEvent(event);
		}
	}

	private handlePreselectedItemChange(preselectedItem: DropDownItem): void {
		this.setState({ preselectedItem });
	}

	private handleInputChange(event: InputEvent<HTMLInputElement>): void {
		const value = (event.target as HTMLInputElement).value;

		if (this.props.onSearch) {
			this.setState({
				inputText: value,
				selectedItem: undefined
			});
			this.props.onSearch(value);

			return;
		}

		const { caseSensitive } = this.props;
		const { items, preselectedItem } = this.state;

		const newMatchedItems = filterDropDownItems(items, value, caseSensitive);
		const newSelectedItem = getNewSelectedItem(newMatchedItems, value, preselectedItem, caseSensitive);

		this.setState((prevState) => {
			const itemToUpdate = newSelectedItem && prevState.inputText.length <= value.length ? newSelectedItem : undefined;

			return {
				showFullList: false,
				inputText: value,
				preselectedItem: itemToUpdate
			};
		});
	}

	private handleInputWrapperBlur(event: FocusEvent): void {
		if (!this.inputWrapperElement?.contains(event.relatedTarget) && !this.state.showModalOverlay) {
			this.shouldShowModal = true;
		}
	}

	private handleModalInputBlur(): void {
		if (this.clearButtonMouseDown) {
			this.clearButtonMouseDown = false;

			return;
		}

		const { allowAddingNewItem } = this.props;

		if (this.state.inputText.trim() && allowAddingNewItem) {
			const { preselectedItem, inputText } = this.state;
			const newSelectedItem = preselectedItem ? toDropDownItem(preselectedItem) : toDropDownItem(inputText.trim());
			this.triggerOnValueChange(newSelectedItem);
		}
	}

	private handleOnScroll(): void {
		if (this.viewportResized) {
			this.viewportResized = false;

			return;
		} else {
			this.inputElement?.blur();
		}
	}

	private handleModalOverlayOpen(): void {
		this.setState((prevState) => {
			return { preselectedItem: prevState.selectedItem };
		});
	}

	private handleChangeTab(): void {
		this.shouldIgnoreFocusEvent =
			this.inputWrapperElement === document.activeElement || this.inputElement === document.activeElement;
	}

	componentDidMount(): void {
		window.addEventListener("blur", this.handleChangeTab);

		if (this.props.initiallyExpanded && (this.props.items.length > 0 || this.props.hintTemplate !== "")) {
			this.setState({ showModalOverlay: true });
		}
	}

	componentDidUpdate(prevProps: AutocompleteProps, prevState: MobileAutocompleteState): void {
		if (this.inputWrapperInModalElement) {
			const width = this.inputWrapperInModalElement.getBoundingClientRect().width;

			if (this.state.inputWidth !== width) {
				this.setState({ inputWidth: width });
			}

			window.addEventListener("resize", this.handleWindowResize, false);
		}

		if (prevProps.value !== this.props.value) {
			const newValueItem = this.props.value ? toDropDownItem(this.props.value) : undefined;
			this.previousSelectedItem = newValueItem;
			this.setState({
				inputText: newValueItem?.label ?? "",
				selectedItem: newValueItem
			});
		}

		if (this.props.items !== prevProps.items && !this.props.loading) {
			const { onSearch, caseSensitive, items } = this.props;
			const { inputText, selectedItem } = this.state;
			const newItems = toDropDownItems(items);
			const newSelectedItem = getNewSelectedItem(newItems, inputText, selectedItem, caseSensitive);

			this.setState({
				items: newItems,
				totalItems: items.length,
				selectedItem: newSelectedItem,
				preselectedItem: newSelectedItem,
				showFullList: !!onSearch
			});
		}

		if (prevState.showModalOverlay && !this.state.showModalOverlay) {
			this.props.onDropdownClose?.();
		}
	}

	componentWillUnmount(): void {
		window.removeEventListener("blur", this.handleChangeTab);
	}

	render(): ReactNode {
		const { items, inputText, preselectedItem, totalItems, showFullList, showModalOverlay, inputWidth } = this.state;
		const { hintTemplate, readonly, disabled, mobileTriggerElement, dropdownFooter, links, enableClearButton } =
			this.props;
		const autocompleteTitles = this.context.autocompleteTitles;
		const unavailableInput = readonly || disabled;

		const matchedItems = showFullList ? items : filterDropDownItems(items, inputText, this.props.caseSensitive);
		const selectedMatchedItem = getSelectedItem(preselectedItem, matchedItems);

		const hint = hintTemplate
			? StringUtils.format(hintTemplate, { count: getDropDownItemsLength(matchedItems), total: totalItems })
			: undefined;
		const clearButtonID = this.props.id ? `${this.props.id}-clear-button` : undefined;
		const clearButton =
			enableClearButton && !disabled && !readonly && inputText ? (
				<Button
					id={clearButtonID}
					destructive
					icon={<Icon>close</Icon>}
					title={autocompleteTitles?.clearTextButton}
					onClick={this.handleClearButtonClick}
					onMouseDown={this.handleClearButtonMouseDown}
				/>
			) : undefined;

		const contentBoxHeaderElements = <ContentBoxElements.Title text={!this.props.hideLabel && this.props.label} />;
		const showDropDown = matchedItems.length > 0 || hint;
		const suffixes = [
			clearButton,
			this.props.suffixes,
			!this.props.readonly && <SelectionSuffix disabled={this.props.disabled} />
		];

		return (
			<StyledAutocompleteWrapper
				className={joinClassNames(baseClassName, this.props.className)}
				style={this.props.style}
				data-role={DataRoles.Autocomplete}
				ref={this.getWrapperRef}
				$disabled={this.props.disabled}
			>
				{mobileTriggerElement &&
				isValidElement<{ onClick: (event: MouseEvent<HTMLElement>) => void }>(mobileTriggerElement) ? (
					cloneElement(mobileTriggerElement, {
						onClick: (event: MouseEvent<HTMLElement>) => {
							this.handleActivatorElementClick();
							mobileTriggerElement.props.onClick?.(event);
						}
					})
				) : (
					<TextField
						key="trigger-input"
						id={this.props.id ? `${this.props.id}-autocomplete__input` : undefined}
						value={this.previousSelectedItem ? this.previousSelectedItem.label : ""}
						label={this.props.label}
						labelGraphic={this.props.labelGraphic}
						hideLabel={this.props.hideLabel}
						placeholder={this.props.inputPlaceHolder}
						suffixes={suffixes}
						prefixes={this.props.prefixes}
						disabled={this.props.disabled}
						readonly={this.props.readonly}
						showHiddenText
						tooltips={this.props.breakTooltipsToNewLine && this.props.tooltips}
						addonAfter={!this.props.breakTooltipsToNewLine && this.props.tooltips}
						errorMessage={this.props.errorMessage}
						warningMessage={this.props.warningMessage}
						infoMessage={this.props.infoMessage}
						error={this.props.error}
						warning={this.props.warning}
						info={this.props.info}
						inputRef={this.getInputElement}
						inputProps={{
							[`aria-hidden`]: true,
							tabIndex: !showModalOverlay ? -1 : this.props.inputProps?.tabIndex
						}}
						inputWrapperRef={this.getInputWrapperElement}
						customInputWrapperProps={{
							id: this.props.id ? `${this.props.id}-autocomplete__input-wrapper` : undefined,
							role: "combobox",
							tabIndex: 0,
							onFocus: this.handleWrapperFocus,
							onBlur: this.handleInputWrapperBlur,
							onKeyDown: this.handleInputKeyDown,
							[`aria-haspopup`]: unavailableInput ? undefined : "listbox",
							[`aria-expanded`]: unavailableInput ? undefined : !!showModalOverlay,
							[`aria-describedby`]: StringUtils.join(
								{ [`${this.props.id}-autocomplete__input`]: this.props.id },
								{ [`${this.props.id}-autocomplete__input-label`]: this.props.id && this.props.label },
								{ [`${this.props.id}-autocomplete__input-info`]: this.props.id && this.props.infoMessage },
								{ [`${this.props.id}-autocomplete__input-warning`]: this.props.id && this.props.warningMessage },
								{ [`${this.props.id}-autocomplete__input-error`]: this.props.id && this.props.errorMessage }
							),
							[`aria-placeholder`]: !inputText ? this.props.inputPlaceHolder : undefined,
							[`aria-flowto`]: clearButton && clearButtonID
						}}
						onChange={() => undefined}
						onWrapperClick={this.handleInputWrapperClick}
						ariaDescribedby={this.props.ariaDescribedby}
						helperText={this.props.helperText}
						onKeyDown={this.handleInputKeyDown}
					/>
				)}
				{!this.props.readonly && !this.props.disabled && showModalOverlay && (
					<StyledAutocompleteModal
						className={`${baseClassName}__modal`}
						fullscreen
						noGutter
						focusOnOpen={false}
						onOpen={this.handleModalOverlayOpen}
						onClose={this.handleModalOverlayClose}
						focusBack={false}
					>
						<ActionContentbox
							headingElements={contentBoxHeaderElements}
							className={this.props.itemsWrapperClassName}
							headingButtons={
								<A11YLanguageContext.Provider
									value={{
										...this.context,
										contentboxTitles: {
											...this.context.contentboxTitles,
											closeButtonTitle: this.context.baseInputTitles?.closeModalButton
										}
									}}
								>
									<ContentBoxElements.CloseButton onClick={this.handleModalOverlayClose} />
								</A11YLanguageContext.Provider>
							}
						>
							<TextField
								isPhone
								value={inputText}
								hideLabel={this.props.hideLabel}
								placeholder={this.props.inputPlaceHolder}
								suffixes={suffixes}
								tooltips={this.props.breakTooltipsToNewLine && this.props.tooltips}
								addonAfter={!this.props.breakTooltipsToNewLine && this.props.tooltips}
								errorMessage={this.props.errorMessage}
								warningMessage={this.props.warningMessage}
								infoMessage={this.props.infoMessage}
								error={this.props.error}
								warning={this.props.warning}
								info={this.props.info}
								onChange={() => undefined}
								onInput={this.handleInputChange}
								onKeyDown={this.handleInputModalKeyDown}
								onBlur={this.handleModalInputBlur}
								inputRef={this.getInputElement}
								inputWrapperRef={this.getInputWrapperInModalElement}
								className={addPrefix("field-wrapper--mobile")}
								autoFocus
								ariaDescribedby={this.props.ariaDescribedby}
								autoComplete="off"
								inputProps={{
									...this.props.inputProps,
									role: "combobox",
									[`aria-haspopup`]: "listbox",
									[`aria-expanded`]: !!showDropDown,
									[`aria-autocomplete`]: "list",
									[`aria-activedescendant`]: showDropDown ? selectedMatchedItem?.id : undefined
								}}
							/>
							<StyledAutocompleteDropdownWrapper
								isLoading={this.props.loading}
								className={joinClassNames(`${baseClassName}__dropdown`, {
									[`${baseClassName}__dropdown--loading`]: this.props.loading
								})}
							>
								<DropDown
									id={this.props.id ? `${this.props.id}-dropdown` : undefined}
									items={matchedItems}
									selectedItem={selectedMatchedItem}
									hint={hint}
									onSelectedItemChange={this.handleDropDownItemClick}
									onPreselectedItemChange={this.handlePreselectedItemChange}
									style={{ width: inputWidth }}
									onScroll={this.handleOnScroll}
									lightBackground={this.props.lightBackground}
									ref={this.getDropdownInstance}
									selectedItemPosition={this.props.selectedItemPosition}
									footer={dropdownFooter}
									links={links}
								/>
								{this.props.loading && (
									<ProgressIndicator
										singleOverlay
										outerOverlayVariant="bright"
										innerOverlayVariant="bright"
										size="medium"
										label={this.props.loadingLabel}
										type="horizontal"
									/>
								)}
							</StyledAutocompleteDropdownWrapper>
						</ActionContentbox>
					</StyledAutocompleteModal>
				)}
			</StyledAutocompleteWrapper>
		);
	}
}

MobileAutocomplete.contextType = A11YLanguageContext;
