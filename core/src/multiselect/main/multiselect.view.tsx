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

import type { ContextType, FocusEvent, MouseEvent, ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { Component } from "react";
import { Key } from "ts-key-enum";
import { cloneDeep } from "lodash-es";

import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import {
	addPrefix,
	bindMethods,
	hasGotFocus,
	isTypeableCharacter,
	resolveRef,
	StringUtils
} from "../../common/main/utils.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";
import type { DropDown } from "../../dropdown/main/template/dropdown.tpl.view.js";

import type { MultiselectProps } from "./multiselect.api.js";
import { MultiselectTemplate } from "./multiselect.tpl.view.js";
import {
	getFlattenItems,
	defaultGroupingHandler,
	defaultFilteringHandler,
	getSelectedItems,
	isSelectedItemsChanged,
	defaultJoiningHandler
} from "./multiselect.internal.js";
import { StyledMultiselectModal } from "./multiselect.styled.js";

const baseClassName = addPrefix("multiselect");

interface MultiselectState {
	searchText: string;
	showDropdown?: boolean;
	showSelectedItemsOnInput?: boolean;
	selectedItems: MultiselectProps.Item[];
	preselectedItem?: MultiselectProps.Item;
	viewItems: MultiselectProps.Items;
}

export class Multiselect extends Component<MultiselectProps, MultiselectState> {
	static displayName = "Multiselect";

	static defaultProps = {
		enableSelectAllOption: true,
		joiningHandler: defaultJoiningHandler
	};

	declare context: ContextType<typeof A11YLanguageContext>;

	private inputWrapperRef: HTMLElement | null = null;
	private inputRef: HTMLInputElement | null = null;
	private labelRef: HTMLElement | null = null;
	private helperTextRef: HTMLElement | null = null;
	private dropdownRef: HTMLElement | null = null;
	private clearButtonRef: HTMLElement | null = null;
	private prevViewItems: MultiselectProps.Items | null = null;
	private isInputWrapperMouseDown = false;
	private isTypeableCharacter = false;
	private shouldTriggerOnChange = true;
	private dropdownHasClosedBefore = true;
	private shouldShowDropDownWhenInputFocused = true;
	private dropdownInstance: DropDown | null = null;
	private updateElementPosition: (() => void) | undefined;
	private shouldIgnoreFocusEvent = false;

	constructor(props: MultiselectProps) {
		super(props);
		const clonedItems = cloneDeep(props.items);
		const flattenItems = getFlattenItems(clonedItems);
		const selectedItems = flattenItems.filter((item) => item.selected);

		const { groupingHandler = defaultGroupingHandler, sortingHandler } = this.props;
		const viewSortedItems = sortingHandler
			? sortingHandler(groupingHandler(flattenItems, selectedItems))
			: groupingHandler(flattenItems, selectedItems);

		this.state = {
			selectedItems: selectedItems,
			viewItems: viewSortedItems,
			showSelectedItemsOnInput: selectedItems.length > 0,
			searchText: ""
		};
		bindMethods(this);
	}

	private getInputRef(ref: HTMLInputElement | null): void {
		this.inputRef = ref;
		resolveRef(ref, this.props.inputRef);
	}

	private getHelperTextRef(ref: HTMLElement | null): void {
		this.helperTextRef = ref;
	}

	private getLabelRef(ref: HTMLElement | null): void {
		this.labelRef = ref;
	}

	private getInputWrapperRef(ref: HTMLElement | null): void {
		if ((this.props.mobile && this.state.showDropdown) || !ref) {
			return;
		}

		this.inputWrapperRef = ref;
	}

	private getClearButtonRef(ref: HTMLElement | null): void {
		this.clearButtonRef = ref;
	}

	private getDropdownRef(ref: HTMLElement | null): void {
		this.dropdownRef = ref;
	}

	private getDropdownInstance(instance: DropDown | null): void {
		this.dropdownInstance = instance;
	}

	private handleInputFocus(): void {
		const { openOnFocus = true, mobile } = this.props;

		if (this.isDisabled() || this.shouldIgnoreFocusEvent) {
			this.shouldIgnoreFocusEvent = false;

			return;
		}

		if (!openOnFocus) {
			this.setState({ showSelectedItemsOnInput: false });
			mobile ? this.inputWrapperRef?.focus() : this.inputRef?.focus();

			return;
		}

		if (this.prevViewItems) {
			const flattenPrevViewItems = getFlattenItems(this.prevViewItems);

			this.setState((state) => {
				const { groupingHandler = defaultGroupingHandler, sortingHandler } = this.props;
				const flattenPropsItems = getFlattenItems(this.props.items);

				// Updates previous view items with the latest properties from props.items while using `selectedItems` as the source of truth for selection state.
				// This ensures that when switching between filtered and unfiltered views, the selection state is always accurate.
				const updatedPrevViewItems = flattenPrevViewItems
					.map((prevItem) => {
						const propsItem = flattenPropsItems.find((item) => prevItem.id === item.id);
						const isSelected = state.selectedItems.some((selectedItem) => selectedItem.id === prevItem.id);

						return propsItem ? { ...propsItem, selected: isSelected } : null;
					})
					.filter((item) => item !== null);

				const viewItems = Array.isArray(this.prevViewItems)
					? updatedPrevViewItems
					: this.prevViewItems
						? this.mergeItemsState(this.prevViewItems, flattenPropsItems)
						: state.viewItems;

				this.prevViewItems = null;

				// selected items will be re-ordered after blur input, otherwise, keep current position of items while working on multiselect
				return {
					viewItems: this.dropdownHasClosedBefore
						? sortingHandler
							? sortingHandler(groupingHandler(viewItems, this.state.selectedItems))
							: groupingHandler(viewItems, this.state.selectedItems)
						: viewItems
				};
			});
		}

		if (this.shouldShowDropDownWhenInputFocused) {
			// Only reset shouldTriggerOnChange when opening dropdown for the first time
			// Don't reset if dropdown is already open to prevent double onChange calls
			if (!this.state.showDropdown) {
				this.shouldTriggerOnChange = true;
			}

			this.setState({ showSelectedItemsOnInput: false, showDropdown: true }, () => {
				this.inputRef?.focus();
			});
		}

		this.shouldShowDropDownWhenInputFocused = true;
	}

	private updateGroupingAndSorting(done?: () => void): void {
		this.setState((state) => {
			const { groupingHandler = defaultGroupingHandler, sortingHandler } = this.props;

			const viewItems = state.searchText === "" ? this.props.items : state.viewItems;
			const items = state.showDropdown ? viewItems : groupingHandler(viewItems, state.selectedItems);
			const viewSortedItems = sortingHandler ? sortingHandler(items) : items;

			return { viewItems: viewSortedItems };
		}, done);
	}

	private handleInputBlur(event: FocusEvent<Element, Element>): void {
		if (this.isInputWrapperMouseDown) {
			this.isInputWrapperMouseDown = false;

			return;
		}

		if (this.props.mobile) {
			if (!this.inputWrapperRef?.contains(event.target) && !this.state.showDropdown) {
				this.shouldShowDropDownWhenInputFocused = true;
			}

			return;
		}

		setTimeout(() => {
			if (hasGotFocus(this.dropdownRef)) {
				return;
			}
		});
	}

	private handleItemClick(item: MultiselectProps.Item, event: MouseEvent): void {
		event.preventDefault();
		this.props.onItemClick?.(item, event);
	}

	private handleSelectedItemChange(selectedItem: MultiselectProps.Item): void {
		this.setState({ preselectedItem: selectedItem });
		this.handleCheckCheckbox(selectedItem);
	}

	private handlePreselectedItemChange(preselectedItem: MultiselectProps.Item): void {
		this.setState({ preselectedItem });
	}

	private changeItemCheckedState(item?: MultiselectProps.Item): void {
		if (!item) {
			this.handleSelectAllCheck(getFlattenItems(this.state.viewItems).some((i) => !i.selected));

			return;
		}

		const value = !item.selected;
		this.setState(
			(state) => {
				const newItem = { ...item, selected: value };
				const selectedItems = this.getNewSelectedItems(state.selectedItems, newItem);

				return {
					selectedItems: selectedItems,
					viewItems: this.updateItemIfExists(state.viewItems, newItem),
					searchText: "",
					showSelectedItemsOnInput: true
				};
			},
			() => {
				if (this.shouldTriggerOnChange) {
					this.props.onChange?.(this.state.selectedItems);
					this.shouldTriggerOnChange = false;
				}
			}
		);
	}

	private updateItemIfExists(items: MultiselectProps.Items, newItem: MultiselectProps.Item): MultiselectProps.Items {
		if (Array.isArray(items)) {
			return items.map((mappingItem) =>
				mappingItem.id === newItem.id ? newItem : mappingItem
			) as MultiselectProps.Item[];
		}

		const { selectedItems, unselectedItems } = items as MultiselectProps.ItemGroup;

		return {
			selectedItems: this.updateItemIfExists(selectedItems, newItem),
			unselectedItems: this.updateItemIfExists(unselectedItems, newItem)
		} as MultiselectProps.ItemGroup;
	}

	private getNewSelectedItems(
		selectedItems: MultiselectProps.Item[],
		updateItem: MultiselectProps.Item
	): MultiselectProps.Item[] {
		const index = selectedItems.findIndex((item) => item.id === updateItem.id);

		if (index >= 0) {
			if (!updateItem.selected) {
				return [...selectedItems.slice(0, index), ...selectedItems.slice(index + 1)];
			}
		} else if (updateItem.selected) {
			return [...selectedItems, updateItem];
		}

		return selectedItems;
	}

	private changeItemsState(
		items: MultiselectProps.Items,
		callback: (item: MultiselectProps.Item) => boolean | undefined
	): MultiselectProps.Items {
		if (Array.isArray(items)) {
			return items.map((item) => ({ ...item, selected: callback(item) })) as MultiselectProps.Item[];
		}

		const { selectedItems, unselectedItems } = items as MultiselectProps.ItemGroup;

		return {
			selectedItems: this.changeItemsState(selectedItems, callback),
			unselectedItems: this.changeItemsState(unselectedItems, callback)
		} as MultiselectProps.ItemGroup;
	}

	private handleSelectAllCheck(checked: boolean): void {
		this.setState((state) => {
			const flattenViewItems = getFlattenItems(state.viewItems);
			const updatedViewItems = this.changeItemsState(state.viewItems, () => checked);
			const hiddenSelectedItems = state.selectedItems.filter(
				(item) => flattenViewItems.findIndex((item1) => item1.id === item.id) === -1
			);

			const selectedItems = checked
				? [...getFlattenItems(updatedViewItems), ...hiddenSelectedItems]
				: hiddenSelectedItems;

			if (this.shouldTriggerOnChange) {
				this.props.onChange?.(selectedItems);
				this.shouldTriggerOnChange = false;
			}

			return {
				selectedItems,
				viewItems: updatedViewItems,
				showSelectedItemsOnInput: true,
				searchText: ""
			};
		});
	}

	private handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
		let searchText = event.target.value;

		if (this.isTypeableCharacter) {
			searchText = searchText.substring(searchText.length - 1);
			this.isTypeableCharacter = false;
		}

		const filteringHandler = this.props.filteringHandler || defaultFilteringHandler;

		if (searchText !== "" && !this.prevViewItems) {
			this.prevViewItems = cloneDeep(this.state.viewItems);
		}

		// Combine items from props.items and state.selectedItems to make sure this filter func will work correctly
		// in both cases using SPACE and CLICK to select items.
		// NOTE: only state.selectedItems are accepted as "selected". The others will be unselected.
		const itemsToFilter = getFlattenItems(this.props.items).map((item) => {
			const selectedIndex = this.state.selectedItems.findIndex((i) => i.id === item.id);

			return selectedIndex >= 0 ? this.state.selectedItems[selectedIndex] : { ...item, selected: false };
		});
		let viewItems = filteringHandler(searchText, itemsToFilter);

		if (searchText === "" && this.prevViewItems) {
			viewItems = this.prevViewItems;
			this.prevViewItems = null;
		}

		this.setState({ searchText, viewItems, showDropdown: true, showSelectedItemsOnInput: false });
	}

	private handleClearButtonClick(): void {
		this.shouldShowDropDownWhenInputFocused = true;
		this.prevViewItems = null;

		// Trick for NVDA
		// setTimeout to make sure the input value will be updated after the other actions done.
		setTimeout(() => {
			this.setState(
				{
					selectedItems: [],
					viewItems: this.changeItemsState(this.props.items, () => false),
					searchText: ""
				},
				() => {
					const selectedItemsChanged = getSelectedItems(this.props.items).length !== 0;

					if (selectedItemsChanged) {
						this.props.onChange?.(this.state.selectedItems);
					}

					this.dropdownInstance?.resetPreselectedPosition();
				}
			);
		});
	}

	private handleDropdownIconClick(event: MouseEvent<HTMLElement>): void {
		const { mobile } = this.props;
		const { showDropdown } = this.state;

		if (this.isDisabled() || (mobile && showDropdown)) {
			event.stopPropagation();

			return;
		}

		if (this.state.showDropdown) {
			event.stopPropagation();
			this.closeDropdownAndSaveSelectedValue();
		} else {
			this.setState({ showDropdown: true });
		}
	}

	private getUpdateElementPositionHandler(handler: () => void): void {
		this.updateElementPosition = handler;
	}

	private handlePortalVisibilityChange(visible: boolean): void {
		if (!visible) {
			this.setState({ showDropdown: visible });
		}
	}

	private handleClickOutside(): void {
		this.updateSelectedItems();
		this.dropdownInstance?.resetPreselectedPosition();
	}

	private handleModalOverlayClose(): void {
		this.updateSelectedItems();
		this.dropdownInstance?.resetPreselectedPosition();
		this.shouldShowDropDownWhenInputFocused = false;
		this.inputWrapperRef?.focus();
		this.setState({ showDropdown: false, searchText: "", showSelectedItemsOnInput: false });
	}

	private handleInputWrapperClick(): void {
		if (this.isDisabled()) {
			return;
		}

		this.dropdownInstance?.resetPreselectedPosition();

		// Only reset shouldTriggerOnChange when opening dropdown for the first time
		// Don't reset if dropdown is already open to prevent double onChange calls
		if (!this.state.showDropdown) {
			this.shouldTriggerOnChange = true;
		}

		// - On mobile without screen readers, this event is called when pressing the input,
		//   set this variable to "false" to avoid re-opening the modal after closing.
		// - On mobile with screen readers, only focus event is called, so it will work as normal.
		if (this.props.mobile) {
			this.shouldShowDropDownWhenInputFocused = false;
		}

		this.setState({ showDropdown: true, showSelectedItemsOnInput: false }, () => {
			this.inputRef?.focus();
		});
	}

	private isDisabled(): boolean {
		return !!this.props.readonly || !!this.props.disabled;
	}

	private updateSelectedItems(): void {
		const oldSelectedItems = getSelectedItems(this.props.items);
		const newSelectedItems = this.state.selectedItems;

		if (this.shouldTriggerOnChange && isSelectedItemsChanged(oldSelectedItems, newSelectedItems)) {
			this.props.onChange?.(this.state.selectedItems);
			this.shouldTriggerOnChange = false;
		}
	}

	private handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (this.isDisabled()) {
			return;
		}

		switch (event.key) {
			case Key.ArrowDown:
			case Key.ArrowUp:
				this.handleArrowKeys(event);
				break;
			case Key.Tab:
				this.handleTabKey();
				break;
			case Key.Escape:
				if (this.state.showDropdown) {
					event.stopPropagation();
				}

				if (this.props.mobile) {
					this.handleModalOverlayClose();
				} else {
					this.closeDropdownAndSaveSelectedValue();
				}

				break;
			case Key.Enter:
				this.handleEnterKey();
				break;
			default:
				if (
					hasGotFocus(this.inputRef) &&
					(isTypeableCharacter(event) || event.key === Key.Backspace || event.key === Key.Delete)
				) {
					if (isTypeableCharacter(event) && !this.state.showDropdown) {
						this.isTypeableCharacter = true;
					}

					this.setState({
						showDropdown: true
					});
					this.dropdownInstance?.resetPreselectedPosition();
				}
		}
	}

	private closeDropdownAndSaveSelectedValue(): void {
		this.updateSelectedItems();
		this.dropdownInstance?.resetPreselectedPosition();
		this.shouldShowDropDownWhenInputFocused = false;

		if (hasGotFocus(this.inputWrapperRef) || this.state.showDropdown) {
			this.props.mobile ? this.inputWrapperRef?.focus() : this.inputRef?.focus();
		}

		this.setState({
			showDropdown: false,
			searchText: ""
		});
	}

	private handleArrowKeys(event: KeyboardEvent<HTMLElement>): void {
		if (hasGotFocus(this.clearButtonRef)) {
			event.preventDefault();

			return;
		}

		if (hasGotFocus(this.inputRef)) {
			if (!this.state.showDropdown) {
				this.setState({
					showDropdown: true,
					showSelectedItemsOnInput: false
				});
			} else {
				event.preventDefault();

				if (!this.state.preselectedItem && getFlattenItems(this.state.viewItems).length > 0) {
					if (this.props.enableSelectAllOption) {
						this.dropdownInstance?.setPreselectedPosition({ row: 0, index: 0 });
					} else {
						const firstActiveItemIndex = getFlattenItems(this.state.viewItems).findIndex((item) => !item.disabled);

						if (firstActiveItemIndex >= 0) {
							this.dropdownInstance?.setPreselectedPosition({ row: firstActiveItemIndex, index: 0 });
						}
					}
				}
			}
		}
	}

	private handleTabKey(): void {
		// This behavior needs to be handled after the tab key changes the active element (focusin event).
		addEventListener(
			"focusin",
			() => {
				if (!hasGotFocus(this.inputWrapperRef) && !this.props.mobile) {
					this.updateSelectedItems();
					this.setState({ showDropdown: false, showSelectedItemsOnInput: true });
				}
			},
			{
				once: true
			}
		);
	}

	private handleEnterKey(): void {
		if (hasGotFocus(this.dropdownRef) && !this.props.mobile) {
			this.closeDropdownAndSaveSelectedValue();

			return;
		}

		if (hasGotFocus(this.props.mobile ? this.inputWrapperRef : this.inputRef) && !this.state.showDropdown) {
			this.setState(
				{
					showDropdown: true,
					showSelectedItemsOnInput: false
				},
				() => {
					this.inputRef?.focus();
				}
			);
		}
	}

	private handleDropdownTabKey(event: KeyboardEvent<HTMLElement>): void {
		if (event.key === Key.Tab) {
			event.preventDefault();

			if (!event.shiftKey && this.clearButtonRef) {
				this.clearButtonRef?.focus();
			} else {
				this.setState({ showSelectedItemsOnInput: false }, () => this.inputRef?.focus());
			}

			this.dropdownInstance?.resetPreselectedPosition();
		}
	}

	private handleCheckCheckbox(selectedItem: MultiselectProps.Item): void {
		const { viewItems, showDropdown } = this.state;

		if (!showDropdown) {
			return;
		}

		const flattenItems = getFlattenItems(viewItems);

		if (selectedItem?.label === this.props.selectAllText) {
			const checkedAll = flattenItems.every((item) => !!item.selected);
			this.handleSelectAllCheck(!checkedAll);
		} else {
			const item = flattenItems.find((i) => i.label === selectedItem.label && i.id === selectedItem.id);
			this.changeItemCheckedState(item);
		}

		this.shouldTriggerOnChange = true;
	}

	private renderPortal(content: ReactNode): ReactNode {
		return (
			this.inputWrapperRef &&
			this.state.showDropdown && (
				<AttachedPortal
					referenceElement={this.inputWrapperRef}
					fixedOrientation
					orientationList={["bottom-start", "top-start"]}
					selfSizing={!DeviceDetector.hasTouch()}
					closeOnClickReferenceElement={false}
					closeOnOutsideClick={{ exception: [this.labelRef, this.helperTextRef] }}
					onVisibilityChange={this.handlePortalVisibilityChange}
					onClickOutside={this.handleClickOutside}
					updateElementPosition={this.getUpdateElementPositionHandler}
					hideOnReferenceElementPositionChange={!DeviceDetector.isTablet()}
					focusOnOpen={false}
				>
					{content}
				</AttachedPortal>
			)
		);
	}

	private mergeItemsState(
		currentItems: MultiselectProps.Items,
		newFlattenItems: MultiselectProps.Item[]
	): MultiselectProps.Items {
		if (Array.isArray(currentItems)) {
			return currentItems.map((item) => {
				const updatedItem = newFlattenItems.find((newItem) => newItem.id === item.id);

				return updatedItem || item;
			});
		}

		const { selectedItems, unselectedItems } = currentItems as MultiselectProps.ItemGroup;

		return {
			selectedItems: getFlattenItems(this.mergeItemsState(selectedItems, newFlattenItems)),
			unselectedItems: getFlattenItems(this.mergeItemsState(unselectedItems, newFlattenItems))
		};
	}

	private resetState(): void {
		this.setState((state) => {
			const { groupingHandler = defaultGroupingHandler, sortingHandler, items } = this.props;

			const flattenedItems = getFlattenItems(cloneDeep(items));
			const initiallySelectedItems = flattenedItems.filter((item) => item.selected);

			// Apply grouping + sorting (used when dropdown is closed)
			const groupedItems = groupingHandler(flattenedItems, initiallySelectedItems);
			const sortedItems = sortingHandler ? sortingHandler(groupedItems) : groupedItems;

			// Merge latest item states into current structure (used when dropdown is open)
			const mergedViewItems = this.mergeItemsState(state.viewItems, flattenedItems);

			let mergedSelectedItems: MultiselectProps.Item[];

			if (this.state.showDropdown) {
				mergedSelectedItems = state.selectedItems
					.map((oldItem) => flattenedItems.find((item) => item.id === oldItem.id) || oldItem)
					.filter((item) => item.selected);

				const newSelections = flattenedItems.filter(
					(item) => item.selected && !mergedSelectedItems.find((selectedItem) => selectedItem.id === item.id)
				);

				// Preserve previous selection order to prevent re-ordering items on `inputValue` while selecting
				mergedSelectedItems = [...mergedSelectedItems, ...newSelections];
			} else {
				mergedSelectedItems = initiallySelectedItems;
			}

			return {
				...(state || {}),
				searchText: "",
				showSelectedItemsOnInput: initiallySelectedItems.length > 0,
				selectedItems: mergedSelectedItems,
				viewItems: this.state.showDropdown ? mergedViewItems : sortedItems
			};
		});
	}

	private handleChangeTab(): void {
		this.shouldIgnoreFocusEvent =
			this.inputRef === document.activeElement || this.inputWrapperRef === document.activeElement;
	}

	componentDidMount(): void {
		window.addEventListener("blur", this.handleChangeTab);
	}

	componentWillUnmount(): void {
		window.removeEventListener("blur", this.handleChangeTab);
	}

	componentDidUpdate(prevProps: Readonly<MultiselectProps>, prevState: Readonly<MultiselectState>): void {
		this.updateElementPosition?.();

		const itemsChanged = getFlattenItems(prevProps.items) !== getFlattenItems(this.props.items);
		const dropdownStateChanged = prevState.showDropdown !== this.state.showDropdown;

		if (itemsChanged || (!this.state.showDropdown && dropdownStateChanged)) {
			this.resetState();
		}

		// make sure the selected items are also re-ordered on mobile
		if (this.props.mobile && !this.state.showDropdown && prevState.showDropdown) {
			this.updateGroupingAndSorting();
		}

		// this check prevents re-ordering items when focusing on input while working on multiselect
		this.dropdownHasClosedBefore = !prevState.showDropdown;
	}

	render(): ReactNode {
		const {
			hintTemplate,
			joiningHandler = defaultJoiningHandler,
			mobile,
			mobileHeadingTitle,
			items,
			id,
			enableSelectAllOption = true,
			...rest
		} = this.props;
		const { showDropdown, searchText, showSelectedItemsOnInput, selectedItems, viewItems } = this.state;

		const flattenViewItems = getFlattenItems(viewItems);
		const flattenItems = getFlattenItems(items);

		const hint =
			hintTemplate &&
			StringUtils.format(hintTemplate, {
				count: flattenViewItems.length,
				total: flattenItems.length
			});
		const shouldShowSelectedItemsOnInput = showSelectedItemsOnInput || !showDropdown;

		const showClearButton =
			!this.isDisabled() &&
			(this.state.selectedItems.length > 0 || getSelectedItems(items).length > 0 || this.state.searchText.length > 0);

		const content = (props?: { id?: string; key?: string; showDropdown?: boolean }) => (
			<MultiselectTemplate
				{...rest}
				id={props?.id ?? id}
				key={props?.key}
				mobile={mobile}
				showDropdown={props?.showDropdown ?? showDropdown}
				showClearButton={showClearButton}
				enableSelectAllOption={enableSelectAllOption}
				inputValue={
					shouldShowSelectedItemsOnInput ? joiningHandler(selectedItems, viewItems, !showDropdown) : searchText
				}
				hint={hint}
				items={viewItems}
				selectedCount={selectedItems.length}
				dropdownContainer={!mobile ? this.renderPortal : undefined}
				dropdownRef={this.getDropdownRef}
				inputRef={this.getInputRef}
				helperTextRef={this.getHelperTextRef}
				labelRef={this.getLabelRef}
				clearButtonRef={this.getClearButtonRef}
				inputWrapperRef={this.getInputWrapperRef}
				dropdownInstance={this.getDropdownInstance}
				onSelectAllCheck={this.handleSelectAllCheck}
				onItemClick={this.handleItemClick}
				onClearButtonClick={this.handleClearButtonClick}
				onDropdownIconClick={this.handleDropdownIconClick}
				onInputWrapperClick={this.handleInputWrapperClick}
				onKeyDown={this.handleKeyDown}
				onDropdownKeyDown={this.handleDropdownTabKey}
				onFocus={this.handleInputFocus}
				onBlur={this.handleInputBlur}
				onChange={this.handleInputChange}
				onPreselectedItemChange={this.handlePreselectedItemChange}
				onSelectedItemChange={this.handleSelectedItemChange}
			/>
		);

		return (
			<>
				{mobile ? content({ key: "trigger-input-mobile", showDropdown: false }) : content()}
				{mobile && showDropdown && (
					<StyledMultiselectModal
						className={`${baseClassName}__modal`}
						focusOnOpen={false}
						fullscreen
						noGutter
						focusBack={false}
					>
						<ActionContentbox
							className={`${baseClassName}__contentbox`}
							headingElements={<ContentBoxElements.Title ariaLevel={1} text={mobileHeadingTitle} />}
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
							{content({ id: id ? `${id}-popup` : undefined })}
						</ActionContentbox>
					</StyledMultiselectModal>
				)}
			</>
		);
	}
}

Multiselect.contextType = A11YLanguageContext;
