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

import type { MouseEvent, ReactElement } from "react";
import { Fragment, useContext } from "react";

import { addPrefix, joinClassNames, StringUtils } from "../../common/main/utils.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Counter } from "../../counter/main/counter.view.js";
import { Checkbox } from "../../input/checkbox/main/checkbox.view.js";
import type { DropDownItem } from "../../dropdown/main/template/dropdown.tpl.api.js";
import { Icon } from "../../icon/main/icon.view.js";
import { Button } from "../../button/main/button.view.js";
import { SelectionSuffix } from "../../input/base/template/base.tpl.view.js";
import { provider } from "../../common/main/device-detector.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { MultiselectTplProps } from "./multiselect.tpl.api.js";
import type { MultiselectProps } from "./multiselect.api.js";
import { getFlattenItems } from "./multiselect.internal.js";
import { StyledMultiselectDropdown, StyledMultiselectInput, StyledMultiselectWrapper } from "./multiselect.styled.js";

const baseClassName = addPrefix("multiselect");

interface ExtendedDropdownItem extends DropDownItem {
	original: MultiselectProps.Item;
}

export function MultiselectTemplate(props: MultiselectTplProps): ReactElement<MultiselectTplProps> {
	const { baseInputTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const {
		dropdownContainer,
		selectAllText,
		showDropdown,
		items = [],
		className,
		onItemCheck,
		onItemClick,
		wrapperRef,
		selectedCount,
		label,
		hideLabel,
		placeholder,
		onFocus,
		onBlur,
		onSelectAllCheck,
		onClearButtonClick,
		onDropdownIconClick,
		inputValue,
		showClearButton,
		dropdownRef,
		onChange,
		inputRef,
		inputWrapperRef,
		hint,
		mobile,
		onInputWrapperMouseDown,
		onInputWrapperClick,
		onDropdownKeyDown,
		infoMessage,
		warningMessage,
		errorMessage,
		tooltips,
		ariaDescribedby,
		breakTooltipsToNewLine,
		helperText,
		readonly,
		disabled,
		clearButtonRef,
		inputProps,
		onPreselectedItemChange,
		onSelectedItemChange,
		dropdownInstance,
		helperTextRef,
		labelRef,
		labelGraphic,
		enableSelectAllOption,
		...rest
	} = props;

	let localDropdownRef: HTMLDivElement | null = null;
	const flattenItems = getFlattenItems(items);
	const lastSelectedItemIndex = Array.isArray(items) ? -1 : items.selectedItems.length - 1;
	let localInputWrapperRef: HTMLDivElement | null = null;
	const unavailableInput = props.readonly || props.disabled;
	const isMobile = provider.get() !== "desktop";

	const dropdownItems: ExtendedDropdownItem[] = flattenItems.map((item, index) => ({
		...item,
		tabIndex: 0,
		label: item.label || "",
		graphic: (
			<Fragment key={item.id + "-graphic"}>
				<Checkbox
					hideLabel
					label={item.label}
					id={item.id + "-checkbox"}
					tabIndex={-1}
					checked={!!item.selected}
					disabled={item.disabled}
					onChange={(value, event) => onItemCheck?.(value, item, event)}
				/>
				{item.graphic}
			</Fragment>
		),
		className: joinClassNames({ [addPrefix("dropdown__item--with-divider")]: index === lastSelectedItemIndex }),
		original: item,
		ariaChecked: item.selected ? "true" : "false",
		divider: index === lastSelectedItemIndex
	}));

	const allChecked = flattenItems.every((item) => !!item.selected);
	const allUnchecked = flattenItems.every((item) => !item.selected);

	const hasItems = dropdownItems.length > 0;

	const selectAllItem = {
		label: selectAllText || "",
		tabIndex: 0,
		graphic: (
			<Checkbox.Indeterminate
				id={`${props.id}-indeterminate-checkbox`}
				tabIndex={-1}
				checked={!(allChecked || allUnchecked) ? "mixed" : allChecked}
				onChange={(value, event) => onSelectAllCheck?.(value, event as any)}
				label={selectAllText}
				hideLabel
			/>
		),
		ariaChecked: (!(allChecked || allUnchecked) ? "mixed" : allChecked ? "true" : "false") as
			| "true"
			| "false"
			| "mixed",
		dataType: `${baseClassName}-item`
	};

	const dropdownList = hasItems
		? [
				...(enableSelectAllOption ? [selectAllItem] : []),
				...dropdownItems.map((item) => ({
					...item,
					selected: false,
					dataType: `${baseClassName}-item`
				}))
			]
		: [];

	const RenderDropdown = (
		<StyledMultiselectDropdown
			useFocusStyle
			hideA11yLabel
			id={`${props.id}-dropdown-content`}
			keysToSelectItem={[" "]}
			ref={dropdownInstance}
			onPreselectedItemChange={onPreselectedItemChange}
			onSelectedItemChange={onSelectedItemChange}
			onKeyDown={onDropdownKeyDown}
			className={`${baseClassName}__dropdown`}
			hint={hint}
			wrapperRef={(ref) => {
				localDropdownRef = ref;
				dropdownRef?.(ref);
			}}
			items={dropdownList}
			onClick={(clickedItem: ExtendedDropdownItem, event) => onItemClick?.(clickedItem.original, event)}
		/>
	);

	// Avoid focusing on input wrapper before the clear button is clicked on IOS.
	const handleClearButtonMouseDown = (event: MouseEvent<HTMLButtonElement>): void => {
		if (provider.get() !== "desktop") {
			event.stopPropagation();
			event.preventDefault();
		}
	};

	const clearButtonID = props.id ? `${props.id}-multiselect-clear-button` : undefined;
	const clearButton = showClearButton ? (
		<Button
			destructive
			icon={<Icon>clear</Icon>}
			title={baseInputTitles?.clearTextButton}
			onClick={onClearButtonClick}
			onMouseDown={handleClearButtonMouseDown}
			buttonRef={clearButtonRef}
			id={clearButtonID}
		/>
	) : undefined;
	const ariaFlowTo = clearButton && isMobile ? clearButtonID : undefined;

	const handleWrapperRef = (element: HTMLDivElement | null): void => {
		if (localDropdownRef) {
			localDropdownRef.style.width = `${localInputWrapperRef?.getBoundingClientRect().width}px`;
		}

		wrapperRef?.(element);
	};

	return (
		<StyledMultiselectWrapper
			data-role={DataRoles.Multiselect}
			className={joinClassNames(
				className,
				baseClassName,
				{ [`${baseClassName}--readonly`]: props.readonly && (!selectedCount || selectedCount === 0) },
				{ [`${baseClassName}--disabled`]: props.disabled }
			)}
			ref={handleWrapperRef}
			$disabled={disabled}
			$readonly={readonly}
			{...rest}
		>
			<StyledMultiselectInput
				isPhone={mobile && showDropdown}
				className={joinClassNames(`${baseClassName}__input`, {
					[addPrefix("field-wrapper--mobile")]: mobile && showDropdown
				})}
				prefixes={
					<Counter
						className={`${baseClassName}__counter`}
						value={selectedCount || 0}
						id={props.id ? `${props.id}-counter` : undefined}
					/>
				}
				suffixes={[clearButton, !readonly && <SelectionSuffix disabled={disabled} onClick={onDropdownIconClick} />]}
				label={label}
				labelGraphic={labelGraphic}
				hideLabel={hideLabel}
				placeholder={placeholder}
				inputWrapperRef={(ref) => {
					localInputWrapperRef = ref;
					inputWrapperRef?.(ref);
				}}
				inputRef={inputRef}
				onFocus={onFocus}
				onBlur={onBlur}
				onChange={onChange}
				value={inputValue}
				onWrapperMouseDown={onInputWrapperMouseDown}
				onWrapperClick={onInputWrapperClick}
				tooltips={breakTooltipsToNewLine && tooltips}
				addonAfter={!breakTooltipsToNewLine && tooltips}
				errorMessage={errorMessage}
				warningMessage={warningMessage}
				infoMessage={infoMessage}
				ariaDescribedby={StringUtils.join(ariaDescribedby, { [`${props.id}-counter`]: props.id })}
				id={props.id ? `${props.id}-multiselect__input` : undefined}
				helperText={((mobile && !showDropdown) || !mobile) && helperText}
				helperTextRef={helperTextRef}
				labelRef={labelRef}
				readonly={readonly}
				disabled={disabled}
				inputProps={{
					...inputProps,
					role: unavailableInput ? undefined : "combobox",
					[`aria-haspopup`]: unavailableInput ? undefined : "listbox",
					[`aria-expanded`]: unavailableInput ? undefined : !!showDropdown,
					[`aria-autocomplete`]: unavailableInput ? undefined : "list",
					[`aria-hidden`]: mobile ? undefined : inputProps?.["aria-hidden"],
					[`aria-flowto`]: ariaFlowTo,
					tabIndex: mobile && !showDropdown ? -1 : inputProps?.tabIndex
				}}
				customInputWrapperProps={
					mobile
						? {
								id: props.id ? `${props.id}-multiselect__input-wrapper` : undefined,
								role: "combobox",
								tabIndex: showDropdown ? undefined : 0,
								onFocus: props.onFocus,
								onKeyDown: props.onKeyDown,
								[`aria-haspopup`]: unavailableInput ? undefined : "listbox",
								[`aria-expanded`]: unavailableInput ? undefined : !!showDropdown,
								[`aria-describedby`]: StringUtils.join(
									{ [`${props.id}-multiselect__input`]: props.id },
									{ [`${props.id}-multiselect__input-label`]: props.id && props.label },
									{ [`${props.id}-multiselect__input-info`]: props.id && props.infoMessage },
									{ [`${props.id}-multiselect__input-warning`]: props.id && props.warningMessage },
									{ [`${props.id}-multiselect__input-error`]: props.id && props.errorMessage }
								),
								[`aria-placeholder`]: !inputValue ? placeholder : undefined,
								[`aria-flowto`]: ariaFlowTo
							}
						: undefined
				}
			/>
			{showDropdown &&
				!readonly &&
				!disabled &&
				(dropdownContainer ? dropdownContainer(RenderDropdown) : RenderDropdown)}
		</StyledMultiselectWrapper>
	);
}

MultiselectTemplate.displayName = "MultiselectTemplate";
