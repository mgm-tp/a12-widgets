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

import type { KeyboardEvent, ReactElement, FocusEvent, MouseEvent } from "react";
import { useRef, useCallback, useEffect, useState, useMemo } from "react";
import { Key } from "ts-key-enum";
import { useResizeDetector, type OnResizeCallback } from "react-resize-detector";

import { inputWithSuffixName, joinClassNames, noop, Key as CustomKey } from "../../../common/main/utils.js";
import { provider, provider as DeviceDetector } from "../../../common/main/device-detector.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import type { DropDownItem } from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { DropDown } from "../../../dropdown/main/template/dropdown.tpl.view.js";
import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import { ActionContentbox } from "../../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { SelectionSuffix } from "../../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { CustomSelectProps, SelectItem } from "./select.api.js";
import { StyledCustomSelect, StyledSelectTemplate } from "./select.styled.js";
import { baseFieldClassName, selectBaseFieldClassName, SelectTemplate } from "./template/select.tpl.view.js";

const { StyledSelectDropdownWrapper, StyledSelectModal, StyledSelectMobileTextLine } = StyledCustomSelect;
const { StyledSelectInput } = StyledSelectTemplate;

export function CustomSelect({
	focusBack = true,
	modalProps = {
		fullscreen: true,
		noGutter: true
	},
	showPrefixes = true,
	...props
}: CustomSelectProps): ReactElement<CustomSelectProps> {
	const {
		selectRef,
		selectWrapperInModalRef,
		onModalClose: onModalCloseProp,
		onModalOpen: onModalOpenProp,
		onValueChanged,
		onFocus,
		onBlur,
		onVisibilityChange,
		onSelect,
		openOnFocus,
		keysToOpen,
		keysToClose,
		value,
		items,
		disabled,
		readonly,
		id,
		horizontalMode,
		hideLabel,
		label,
		placeholder,
		labelGraphic,
		ariaDescribedby,
		breakTooltipsToNewLine,
		tooltips,
		errorMessage,
		warningMessage,
		infoMessage,
		error,
		warning,
		info,
		inputProps,
		dataRole,
		selectWrapperId
	} = props;

	const dropdownInstanceRef = useRef<DropDown | null>(null);
	const selectWrapperRef = useRef<HTMLElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const labelRef = useRef<HTMLElement | null>(null);
	const helperTextRef = useRef<HTMLElement | null>(null);
	const inputWrapperMobileRef = useRef<HTMLElement | null>(null);
	const isMobileRef = useRef(DeviceDetector.isPhone());
	const canOpenOnFocusRef = useRef(true);
	const canCloseModalRef = useRef(true);
	const shouldUpdateValueRef = useRef(true);

	const selectedItem = useMemo((): SelectItem | undefined => {
		const findSelectedItem = (
			searchData: string | undefined,
			DATA: SelectItem[],
			accum: SelectItem[] = []
		): SelectItem[] | undefined => {
			DATA.forEach((item) => {
				if (item.children) {
					findSelectedItem(searchData, item.children, accum);
				} else if (item.value === searchData) {
					accum.push(item);
				}
			});

			return accum;
		};

		return findSelectedItem(value, items)?.[0];
	}, [value, items]);

	const [showDropDown, setShowDropDown] = useState(false);
	const [preSelectedItem, setPreSelectedItem] = useState<SelectItem | undefined>(() =>
		value !== undefined ? selectedItem : undefined
	);
	const [inputWidth, setInputWidth] = useState<number | undefined>(0);

	const handleInputRef = useCallback(
		(ref: HTMLInputElement | null): void => {
			inputRef.current = ref;

			if (!isMobileRef.current) {
				selectRef?.(ref);
			}
		},
		[selectRef]
	);

	const handleInputInsideModalRef = useCallback((ref: HTMLInputElement | null): void => {
		inputRef.current = ref;
	}, []);

	const handleInputWrapperMobileRef = useCallback(
		(ref: HTMLElement | null): void => {
			inputWrapperMobileRef.current = ref;
			selectWrapperInModalRef?.(ref);
		},
		[selectWrapperInModalRef]
	);

	const handleSelectWrapperRef = useCallback(
		(ref: HTMLElement | null): void => {
			selectWrapperRef.current = ref;

			if (isMobileRef.current) {
				selectRef?.(ref);
			}
		},
		[selectRef]
	);

	const handleLabelRef = useCallback((ref: HTMLElement | null): void => {
		labelRef.current = ref;
	}, []);

	const handleHelperTextRef = useCallback((ref: HTMLElement | null): void => {
		helperTextRef.current = ref;
	}, []);

	const getDropdownInstance = useCallback((instance: DropDown): void => {
		dropdownInstanceRef.current = instance;
	}, []);

	const getActiveSelectItems = useCallback((): SelectItem[] => {
		return items.filter((item) => item.value !== undefined && !item.disabled);
	}, [items]);

	const updateSelectedItem = useCallback(
		(item?: SelectItem): void => {
			const selectedItem = item || preSelectedItem;

			if (selectedItem?.value !== undefined && value !== selectedItem.value && shouldUpdateValueRef.current) {
				onValueChanged?.(selectedItem.value);
			}
		},
		[preSelectedItem, value, onValueChanged]
	);

	const resetInputSelectionRange = useCallback((): void => {
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.selectionStart = 0;
				inputRef.current.selectionEnd = 0;
			}
		});
	}, []);

	const onModalCloseHandler = useCallback((): void => {
		if (focusBack) {
			selectWrapperRef.current?.focus();
		}

		onModalCloseProp?.();
		updateSelectedItem();
	}, [focusBack, onModalCloseProp, updateSelectedItem]);

	const onModalOpenHandler = useCallback((): void => {
		inputWrapperMobileRef.current?.focus();
		onModalOpenProp?.();
	}, [onModalOpenProp]);

	const hideDropdown = useCallback((): void => {
		if (disabled || readonly || !showDropDown || !canCloseModalRef.current) {
			return;
		}

		canCloseModalRef.current = true;
		setShowDropDown(false);
		setPreSelectedItem((prevPreSelectedItem) => (shouldUpdateValueRef.current ? prevPreSelectedItem : selectedItem));
	}, [disabled, readonly, showDropDown, selectedItem]);

	const showDropdown = useCallback((): void => {
		if (disabled || readonly || showDropDown) {
			return;
		}

		canOpenOnFocusRef.current = false;
		setShowDropDown(true);
		setPreSelectedItem(selectedItem || getActiveSelectItems()?.[0]);

		// Focus input after state update for desktop
		if (!isMobileRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			});
		}
	}, [disabled, readonly, showDropDown, selectedItem, getActiveSelectItems]);

	const toggleDropdown = useCallback(
		(shouldShow: boolean): void => {
			if (shouldShow) {
				showDropdown();
			} else {
				hideDropdown();
				updateSelectedItem();
			}
		},
		[showDropdown, hideDropdown, updateSelectedItem]
	);

	const handleCloseButtonClick = useCallback((): void => {
		canCloseModalRef.current = true;
		hideDropdown();
		shouldUpdateValueRef.current = false;
		onModalCloseHandler();
	}, [hideDropdown, onModalCloseHandler]);

	const handlePreSelectItemChange = useCallback((preSelectedItem: SelectItem): void => {
		setPreSelectedItem(preSelectedItem);
	}, []);

	const handleSelectedItemChange = useCallback(
		(item: SelectItem | undefined): void => {
			shouldUpdateValueRef.current = true;
			updateSelectedItem(item);
			canOpenOnFocusRef.current = false;

			if (focusBack) {
				if (!isMobileRef.current) {
					inputRef.current?.focus();
				} else {
					selectWrapperRef.current?.focus();
				}

				resetInputSelectionRange();
			} else {
				inputRef.current?.blur();
			}

			setShowDropDown(false);
			setPreSelectedItem(item);

			if (isMobileRef.current) {
				onModalCloseProp?.();
			}

			setTimeout(() => {
				onSelect?.(item?.value || "");
			});
		},
		[updateSelectedItem, focusBack, resetInputSelectionRange, onModalCloseProp, onSelect]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const key = event.key;
			const openKeys = keysToOpen ?? [CustomKey.Space, Key.ArrowUp, Key.ArrowDown, Key.Enter];

			if (openKeys.includes(key)) {
				event.preventDefault();
				showDropdown();
			}

			if (showDropDown) {
				const mobileCloseKeys = keysToClose ?? [Key.Escape];
				const desktopCloseKeys = keysToClose ?? [Key.Tab, Key.Escape];

				// Prevent close modal overlay when pressing Escape if keysToClose does not contain Escape
				if (key === Key.Escape && keysToClose && !keysToClose.includes(key)) {
					event.stopPropagation();
					canCloseModalRef.current = false;

					return;
				}

				if (
					(isMobileRef.current && mobileCloseKeys.includes(key)) ||
					(!isMobileRef.current && desktopCloseKeys.includes(key))
				) {
					if (key === Key.Escape) {
						event.stopPropagation();
					}

					canCloseModalRef.current = true;
					shouldUpdateValueRef.current = !isMobileRef.current;
					hideDropdown();
					onModalCloseHandler();
				}

				dropdownInstanceRef.current?.handleForwardedKeyboardEvent(event);
			}

			// Set here to avoid couldn't open dropdown when focusing on input after pressing ENTER
			canOpenOnFocusRef.current = true;
		},
		[keysToOpen, keysToClose, showDropDown, showDropdown, hideDropdown, onModalCloseHandler]
	);

	const handlePressKey = useCallback(
		(event: KeyboardEvent<HTMLElement>): void => {
			const selectedItem = getActiveSelectItems()?.find((item) =>
				item.label.toLowerCase().startsWith(event.key.toLowerCase())
			);

			if (selectedItem?.value !== undefined) {
				if (showDropDown) {
					setPreSelectedItem(selectedItem);
				} else if (selectedItem.value !== value) {
					onValueChanged?.(selectedItem.value);
				}
			}
		},
		[getActiveSelectItems, showDropDown, value, onValueChanged]
	);

	const handleInputFocus = useCallback(
		(event: FocusEvent<HTMLElement>): void => {
			if (openOnFocus && canOpenOnFocusRef.current) {
				setTimeout(() => toggleDropdown(true));
			}

			resetInputSelectionRange();
			canOpenOnFocusRef.current = true;
			onFocus?.(event);
		},
		[openOnFocus, onFocus, toggleDropdown, resetInputSelectionRange]
	);

	const handleWrapperFocus = useCallback(
		(event: FocusEvent<HTMLElement>): void => {
			if (openOnFocus && canOpenOnFocusRef.current) {
				toggleDropdown(true);
				canCloseModalRef.current = false;
			}

			if (!showDropDown) {
				resetInputSelectionRange();
			}

			canOpenOnFocusRef.current = true;
			onFocus?.(event);
		},
		[openOnFocus, onFocus, showDropDown, toggleDropdown, resetInputSelectionRange]
	);

	const handleSelectWrapperClick = useCallback((): void => {
		if (provider.isDesktop()) {
			// Ensure that the dropdown is still open if select wrapper changed its position
			setTimeout(() => toggleDropdown(!showDropDown));
		} else {
			toggleDropdown(!showDropDown);
		}
	}, [showDropDown, toggleDropdown]);

	const handleInputBlur = useCallback(
		(event: FocusEvent<HTMLElement>): void => {
			onBlur?.(event);
		},
		[onBlur]
	);

	const handleOnVisibilityChange = useCallback(
		(visible: boolean): void => {
			setShowDropDown(visible);
			onVisibilityChange?.(visible);
		},
		[onVisibilityChange]
	);

	const handleClickOutside = useCallback((): void => {
		canOpenOnFocusRef.current = true;
		updateSelectedItem();
	}, [updateSelectedItem]);

	const renderDropdown = useCallback((): ReactElement => {
		const realId = (dropdownItem: DropDownItem, itemIndex: number): string =>
			dropdownItem.id ||
			(dropdownItem.value || `${dropdownItem.label}${itemIndex ? `-${itemIndex}` : ""}`).split(" ").join("-");

		const dropdownItems: DropDownItem[] = items.map((item, index) => {
			return !item.children
				? {
						...item,
						label: item.label,
						id: realId(item, index),
						selected: item.value === (preSelectedItem ? preSelectedItem.value : value),
						...(DeviceDetector.isPhone() && { tabIndex: 0 })
					}
				: {
						...item,
						label: item.label,
						id: realId(item, index),
						children: item.children.map((subItem, subIndex) => ({
							...subItem,
							id: realId(subItem, subIndex),
							selected: subItem.value === (preSelectedItem ? preSelectedItem.value : value),
							...(DeviceDetector.isPhone() && { tabIndex: 0 })
						}))
					};
		});

		return (
			<StyledSelectDropdownWrapper
				onScrollCapture={noop}
				className={`${selectBaseFieldClassName}--dropdown`}
				id={id ? `${id}--dropdown` : undefined}
			>
				<DropDown
					keysToSelectItem={[Key.Enter, " "]}
					ref={getDropdownInstance}
					onSelectedItemChange={handleSelectedItemChange}
					onPreselectedItemChange={handlePreSelectItemChange}
					horizontal={horizontalMode}
					items={dropdownItems}
					style={{ width: inputWidth }}
					ariaLabelledby={id && `${id}-label`}
				/>
			</StyledSelectDropdownWrapper>
		);
	}, [
		items,
		value,
		preSelectedItem,
		inputWidth,
		id,
		horizontalMode,
		getDropdownInstance,
		handleSelectedItemChange,
		handlePreSelectItemChange
	]);

	const renderModal = (): ReactElement => {
		return (
			<StyledSelectModal
				className={`${selectBaseFieldClassName}-modal`}
				fullscreen={modalProps?.fullscreen}
				focusBack={false}
				noGutter={modalProps?.noGutter}
				focusOnOpen={false}
				onClose={onModalCloseHandler}
				onOpen={onModalOpenHandler}
			>
				<ActionContentbox
					headingElements={<ContentBoxElements.Title text={!hideLabel && label} ariaLevel={1} />}
					listenToNavigationContext
					headingButtons={<ContentBoxElements.CloseButton onClick={handleCloseButtonClick} />}
				>
					<StyledSelectMobileTextLine
						value={preSelectedItem?.label ?? selectedItem?.label}
						onChange={() => undefined}
						className={`${selectBaseFieldClassName}--mobile`}
						suffixes={[!readonly && <SelectionSuffix disabled={disabled} />]}
						prefixes={showPrefixes && preSelectedItem?.graphic}
						ariaDescribedby={ariaDescribedby}
						placeholder={placeholder}
						hideLabel={hideLabel}
						tooltips={breakTooltipsToNewLine && tooltips}
						addonAfter={!breakTooltipsToNewLine && tooltips}
						errorMessage={errorMessage}
						warningMessage={warningMessage}
						infoMessage={infoMessage}
						error={error}
						warning={warning}
						info={info}
						inputWrapperRef={handleInputWrapperMobileRef}
						inputRef={handleInputInsideModalRef}
						onWrapperKeyDown={handleKeyDown}
						onWrapperKeyPress={handlePressKey}
						customInputWrapperProps={{ tabIndex: -1 }}
						$isEmptyValue={preSelectedItem?.isEmptyValue}
					/>
					{renderDropdown()}
				</ActionContentbox>
			</StyledSelectModal>
		);
	};

	const handleResizeChange: OnResizeCallback = useCallback(({ width }) => {
		if (width != null) {
			setInputWidth(width);
		}
	}, []);

	useResizeDetector({
		targetRef: !isMobileRef.current ? selectWrapperRef : inputWrapperMobileRef,
		onResize: handleResizeChange
	});

	useEffect(() => {
		setPreSelectedItem(selectedItem);
	}, [value, items, selectedItem]);

	const selectFieldBaseClass = `${selectBaseFieldClassName}Title`;
	const selectFieldClasses = joinClassNames(
		selectFieldBaseClass,
		{ [`${selectFieldBaseClass}--error`]: error || errorMessage },
		{ [`${selectFieldBaseClass}--warning`]: warning || warningMessage }
	);
	const unavailableInput = readonly || disabled;
	const realLabel =
		label || placeholder ? (
			<>
				{label}
				{placeholder && <HiddenText showHiddenText={false}>{`${label ? ", " : ""}${placeholder}`}</HiddenText>}
			</>
		) : undefined;
	const role = unavailableInput ? undefined : "combobox";
	const haspopup = unavailableInput ? undefined : "listbox";
	const expanded = unavailableInput ? undefined : showDropDown;
	const resolvedSelectWrapperId = selectWrapperId ?? `${id}-select-wrapper`;

	return (
		<SelectTemplate
			{...props}
			label={realLabel}
			labelGraphic={labelGraphic}
			hideLabel={hideLabel || !label}
			selectWrapperRef={handleSelectWrapperRef}
			labelRef={handleLabelRef}
			helperTextRef={handleHelperTextRef}
			onSelectWrapperClick={handleSelectWrapperClick}
			selectWrapperDOMProps={
				isMobileRef.current
					? {
							id: resolvedSelectWrapperId,
							role: role,
							[`aria-haspopup`]: haspopup,
							[`aria-expanded`]: expanded,
							[`aria-describedby`]: joinClassNames(
								id,
								{ [`${id}-label`]: id && label },
								{ [`${id}-info`]: id && infoMessage },
								{ [`${id}-warning`]: id && warningMessage },
								{ [`${id}-error`]: id && errorMessage },
								ariaDescribedby
							),
							tabIndex: 0,
							onKeyDown: handleKeyDown,
							onFocus: handleWrapperFocus
						}
					: undefined
			}
		>
			{preSelectedItem && preSelectedItem.graphic && showPrefixes && (
				<StyledBaseInput.StyledFieldPrefixWrapper
					key="select-prefix"
					data-role={DataRoles.Select.Prefix}
					className={`${baseFieldClassName}__prefix ${baseFieldClassName}__prefix--last`}
					$last
				>
					{preSelectedItem.graphic}
				</StyledBaseInput.StyledFieldPrefixWrapper>
			)}
			<StyledSelectInput
				{...inputProps}
				as="input"
				data-role={inputWithSuffixName(dataRole || DataRoles.Select)}
				className={selectFieldClasses}
				disabled={disabled}
				readOnly={readonly}
				$disabled={disabled}
				$readonly={readonly}
				$isEmptyValue={preSelectedItem?.isEmptyValue}
				onChange={noop}
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				value={preSelectedItem?.label || ""}
				id={id}
				aria-describedby={joinClassNames(
					{ [`${id}-info`]: id && infoMessage },
					{ [`${id}-warning`]: id && warningMessage },
					{ [`${id}-error`]: id && errorMessage },
					ariaDescribedby
				)}
				placeholder={placeholder}
				onKeyDown={handleKeyDown}
				onKeyPress={handlePressKey}
				ref={handleInputRef}
				onMouseDown={(event: MouseEvent<HTMLElement>): void => event.preventDefault()}
				aria-activedescendant={showDropDown ? preSelectedItem?.id : undefined}
				role={role}
				tabIndex={isMobileRef.current ? -1 : inputProps?.tabIndex}
				aria-hidden={isMobileRef.current ? true : inputProps?.["aria-hidden"]}
				aria-haspopup={haspopup}
				aria-expanded={expanded}
				aria-autocomplete={unavailableInput ? undefined : "list"}
			/>
			{showDropDown &&
				(!isMobileRef.current && selectWrapperRef.current ? (
					<AttachedPortal
						closeOnClickReferenceElement={false}
						focusOnReferenceElementAfterEsc={!openOnFocus}
						closeOnOutsideClick={{ exception: [labelRef.current, helperTextRef.current] }}
						referenceElement={selectWrapperRef.current}
						hideOnReferenceElementPositionChange={!DeviceDetector.isTablet()}
						fixedOrientation
						orientationList={["bottom-start", "top-start"]}
						onVisibilityChange={handleOnVisibilityChange}
						onClickOutside={handleClickOutside}
						focusOnOpen={false}
						selfSizing={!DeviceDetector.hasTouch()}
					>
						{renderDropdown()}
					</AttachedPortal>
				) : (
					renderModal()
				))}
		</SelectTemplate>
	);
}

CustomSelect.displayName = "CustomSelect";
