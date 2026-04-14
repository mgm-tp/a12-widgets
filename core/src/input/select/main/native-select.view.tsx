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

import type { FocusEvent, ReactElement } from "react";
import { useRef, useMemo } from "react";

import { addPrefix, inputWithSuffixName, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledNativeSelect, StyledSelectTemplate } from "./select.styled.js";
import { SelectTemplate, selectBaseFieldClassName } from "./template/select.tpl.view.js";
import type { NativeSelectProps, SelectItem, SelectProps } from "./select.api.js";

const { StyledSelectOption } = StyledNativeSelect;
const { StyledSelectInput } = StyledSelectTemplate;

export function NativeSelect(props: NativeSelectProps): ReactElement<SelectProps> {
	const selectWrapperRef = useRef<HTMLElement | null>(null);

	const isEmptyValue = useMemo((): boolean => {
		const findSelectedItem = (items: SelectItem[]): SelectItem | undefined => {
			for (const item of items) {
				if (item.value === props.value) {
					return item;
				}

				if (item.children) {
					const selectedItem = findSelectedItem(item.children);

					if (selectedItem) {
						return selectedItem;
					}
				}
			}

			return undefined;
		};

		const selectedItem = findSelectedItem(props.items);

		return selectedItem?.isEmptyValue === true;
	}, [props.value, props.items]);

	const baseClassName = addPrefix("field__select");
	const selectFieldBaseClass = `${baseClassName}Title`;
	const selectFieldClasses = joinClassNames(
		selectFieldBaseClass,
		{ [`${selectFieldBaseClass}--error`]: props.error || props.errorMessage },
		{ [`${selectFieldBaseClass}--warning`]: props.warning || props.warningMessage }
	);

	const id = props.id;

	const onFocus = (event: FocusEvent<HTMLElement>): void => {
		selectWrapperRef.current?.classList.add(`${selectBaseFieldClassName}-wrapper--focus`);
		props.onFocus?.(event);
	};

	const onBlur = (event: FocusEvent<HTMLElement>): void => {
		selectWrapperRef.current?.classList.remove(`${selectBaseFieldClassName}-wrapper--focus`);
		props.onBlur?.(event);
	};

	const renderItem = (item: SelectItem, key?: number) => {
		return (
			<StyledSelectOption
				key={key}
				className={joinClassNames(`${baseClassName}Option`)}
				value={item.value}
				disabled={item.disabled}
				$isEmptyValue={item.isEmptyValue}
				data-role={props.dataRole ? `${props.dataRole}-option` : DataRoles.Select.Option}
			>
				{item.label}
			</StyledSelectOption>
		);
	};

	const { as, ...restOfInputProps } = props.inputProps ?? {};

	return (
		<SelectTemplate
			{...props}
			selectWrapperRef={(ref) => {
				selectWrapperRef.current = ref;
			}}
		>
			<StyledSelectInput
				{...restOfInputProps}
				data-role={inputWithSuffixName(props.dataRole || DataRoles.Select)}
				ref={props.selectRef}
				className={selectFieldClasses}
				disabled={props.disabled || props.readonly} // prevent events
				$readonly={props.readonly}
				$disabled={props.disabled}
				$isEmptyValue={isEmptyValue}
				value={props.value || ""}
				id={id}
				aria-describedby={joinClassNames(
					{ [`${id}-info`]: id && props.infoMessage },
					{ [`${id}-warning`]: id && props.warningMessage },
					{ [`${id}-error`]: id && props.errorMessage },
					props.ariaDescribedby
				)}
				onChange={(event) => props.onValueChanged?.(event.currentTarget.value)}
				onFocus={onFocus}
				onBlur={onBlur}
			>
				{props.placeholder && <option disabled label={props.placeholder} value="" />}
				{props.items.map((item, index) =>
					item.children ? (
						<optgroup key={index} label={item.label}>
							{item.children.map((subItem, index) => renderItem(subItem, index))}
						</optgroup>
					) : (
						renderItem(item, index)
					)
				)}
			</StyledSelectInput>
		</SelectTemplate>
	);
}

NativeSelect.displayName = "NativeSelect";
