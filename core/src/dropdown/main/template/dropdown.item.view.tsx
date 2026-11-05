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

import type { CSSProperties, MouseEvent, ReactNode, ReactElement, RefCallback } from "react";
import { memo, useContext, useCallback } from "react";

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { getDesktopOperatingSystem } from "../../../common/main/device-detector.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
// The selection checkbox of a multi-select list is a readout, not a control of its own:
// activating the option it sits in is what toggles the selection, so the checkbox has nothing to handle.
import { joinClassNames, noop as ignoreCheckboxChange } from "../../../common/main/utils.js";
import { Checkbox } from "../../../input/checkbox/main/checkbox.view.js";

import {
	baseClassName,
	disabledItemClassName,
	itemClassName,
	preSelectClassName,
	preSelectFocusClassName
} from "./dropdown.class-names.js";
import { DropdownContext } from "./dropdown.context.js";
import type { DropDownItem as DropdownItemProps } from "./dropdown.tpl.api.js";
import {
	StyledDropdownSecondaryText,
	StyledDropdownGraphic,
	StyledDropdownItem,
	StyledDropdownText,
	StyledDropdownTextWrapper
} from "./dropdown.tpl.styled.js";

export interface DropdownItemInternalProps extends Styleable, Identifiable {
	item: DropdownItemProps;

	/** Position of the option in the flattened item list. */
	flatIndex: number;

	/** Resolved selection state; kept out of `item` so a re-render does not invalidate the memo. */
	selected?: boolean;

	/** Absolute positioning applied while the list is windowed. */
	virtualStyle?: CSSProperties;

	/** Total number of options, exposed as `aria-setsize` when only a window of them is rendered. */
	setSize?: number;

	/** 1-based position of the option, exposed as `aria-posinset` while windowed. */
	posInSet?: number;
	useFocusStyle?: boolean;
	sectionId?: string;
	preselected?: boolean;
	hideA11yLabel?: boolean;
	labelRenderer?(item: DropdownItemProps): ReactNode;

	registerElement(flatIndex: number, element: HTMLElement | null): void;

	/** Hands the option to the virtualizer for measurement while the list is windowed. */
	measureElement?: RefCallback<HTMLElement>;

	onItemClick(flatIndex: number, item: DropdownItemProps, event: MouseEvent<HTMLElement>): void;

	onMouseDown?(item: DropdownItemProps, event: MouseEvent<HTMLElement>): void;
}

function DropDownItemComponent(props: DropdownItemInternalProps): ReactElement<DropdownItemInternalProps> {
	const dropdownContextValue = useContext(DropdownContext);

	const itemClassNames = joinClassNames(
		itemClassName,
		{ [disabledItemClassName]: props.item.disabled },
		{ [preSelectClassName]: props.selected && !props.useFocusStyle },
		{ [preSelectFocusClassName]: props.selected && props.useFocusStyle },
		props.className,
		props.item.className
	);
	const { flatIndex, registerElement, measureElement } = props;

	// A multi-select list puts a checkbox in front of every option, which then carries the selection
	// state for assistive technology — so the option's own text is left out of the announcement, the
	// way it is whenever the caller supplies the name through the graphic.
	const showCheckbox = dropdownContextValue.multiple;
	const checkboxId = props.item.id ? `${props.item.id}-checkbox` : undefined;

	// Consumers receive the item with its resolved `selected` flag, as they did when the flag was
	// spread into `item` for rendering.
	const itemWithSelection = { ...props.item, selected: props.selected };

	// `aria-selected` is what a multi-select list states its selection through. `aria-checked` is
	// mirrored alongside it — a supported property of `role="option"` — because the callers that used
	// to render the checkboxes themselves set it, and their tests and styles read it. Deprecated: it
	// goes away with the next major, `aria-selected` is the state to read.
	const ariaChecked =
		props.item.ariaChecked ??
		(showCheckbox ? (props.item.indeterminate ? "mixed" : props.selected ? "true" : "false") : undefined);
	const isMultiselectItem = props.item.dataType === "multiselect-item";
	const useCheckboxRole = isMultiselectItem && getDesktopOperatingSystem() === "Mac";
	const extendedSelection = dropdownContextValue.extended && showCheckbox;
	const useTextWrapper = extendedSelection && !!props.item.secondaryText;

	const secondaryTextElement = props.item.secondaryText && (
		<StyledDropdownSecondaryText
			className={`${baseClassName}__secondary-text`}
			data-role={DataRoles.Dropdown.SecondaryText}
			$extended={dropdownContextValue.extended}
			$preselected={
				(props.selected && !props.useFocusStyle && props.preselected) || (props.preselected && !props.useFocusStyle)
			}
			$disabled={props.item.disabled}
			$touch={dropdownContextValue.touch}
		>
			{props.item.secondaryText}
		</StyledDropdownSecondaryText>
	);

	// The checkbox already carries the name, so a hidden label would have it announced twice.
	const labelElement = props.item.hideLabel ? (
		showCheckbox ? undefined : (
			<HiddenText>{props.item.label}</HiddenText>
		)
	) : (
		<StyledDropdownText
			aria-hidden={props.hideA11yLabel || showCheckbox ? true : undefined}
			className={joinClassNames(`${baseClassName}__text`)}
			data-role={DataRoles.Dropdown.Text}
			$extended={dropdownContextValue.extended}
			$horizontal={dropdownContextValue.horizontal}
		>
			{props.labelRenderer ? props.labelRenderer(itemWithSelection) : props.item.label}
		</StyledDropdownText>
	);

	const setElementRef = useCallback(
		(element: HTMLElement | null): void => {
			registerElement(flatIndex, element);
			measureElement?.(element);
		},
		[flatIndex, registerElement, measureElement]
	);

	return (
		<StyledDropdownItem
			ref={setElementRef}
			tabIndex={props.item.disabled || props.item.children ? -1 : props.item.tabIndex}
			className={itemClassNames}
			id={props.item.id}
			style={props.virtualStyle ? { ...props.item.style, ...props.virtualStyle } : props.item.style}
			onClick={
				props.item.disabled ? undefined : (event): void => props.onItemClick(props.flatIndex, itemWithSelection, event)
			}
			onMouseDown={props.item.disabled ? undefined : (event): void => props.onMouseDown?.(itemWithSelection, event)}
			role={useCheckboxRole ? "checkbox" : "option"}
			title={props.item.title}
			aria-selected={useCheckboxRole ? undefined : props.selected}
			aria-describedby={props.sectionId}
			aria-setsize={props.setSize}
			aria-posinset={props.posInSet}
			aria-disabled={props.item.disabled}
			aria-checked={ariaChecked}
			data-role={DataRoles.Dropdown.Item}
			data-type={props.item.dataType}
			// Reflects the active option. It used to render the selection state and then be overwritten
			// imperatively during keyboard navigation; now it states the same thing declaratively.
			data-preselect={!!props.preselected}
			$extended={dropdownContextValue.extended}
			$extendedSelection={extendedSelection}
			$touch={dropdownContextValue.touch}
			$horizontal={dropdownContextValue.horizontal}
			$isEmptyValue={props.item.isEmptyValue}
			$preselected={
				(props.selected && !props.useFocusStyle && props.preselected) || (props.preselected && !props.useFocusStyle)
			}
			$focusPreselected={
				(props.selected && props.useFocusStyle && props.preselected) || (props.preselected && props.useFocusStyle)
			}
			$disabled={props.item.disabled}
			$divider={props.item.divider}
			$hasLabelRenderer={!!props.labelRenderer}
		>
			{(showCheckbox || props.item.graphic) && (
				<StyledDropdownGraphic
					className={`${baseClassName}__graphic`}
					data-role={DataRoles.Dropdown.Graphic}
					$preselected={
						(props.selected && !props.useFocusStyle && props.preselected) || (props.preselected && !props.useFocusStyle)
					}
					$horizontal={dropdownContextValue.horizontal}
				>
					{showCheckbox &&
						// An option that stands for a partly made selection needs the tri-state checkbox to be
						// able to show that; a plain one gets the plain checkbox, whose input the consuming
						// project's tests reach for.
						(props.item.indeterminate === undefined ? (
							<Checkbox
								hideLabel
								id={checkboxId}
								label={props.item.label}
								tabIndex={-1}
								checked={!!props.selected}
								disabled={props.item.disabled}
								onChange={ignoreCheckboxChange}
							/>
						) : (
							<Checkbox.Indeterminate
								hideLabel
								id={checkboxId}
								label={props.item.label}
								tabIndex={-1}
								checked={props.item.indeterminate ? "mixed" : !!props.selected}
								disabled={props.item.disabled}
								onChange={ignoreCheckboxChange}
							/>
						))}
					{props.item.graphic}
				</StyledDropdownGraphic>
			)}
			{useTextWrapper ? (
				<StyledDropdownTextWrapper>
					{labelElement}
					{secondaryTextElement}
				</StyledDropdownTextWrapper>
			) : (
				<>
					{labelElement}
					{secondaryTextElement}
				</>
			)}
		</StyledDropdownItem>
	);
}

DropDownItemComponent.displayName = "DropdownItem";

/**
 * Memoized so that activating another option re-renders the two options whose state changed instead
 * of the whole list. This is what keeps arrow-key navigation cheap on long lists.
 */
export const DropDownItem = memo(DropDownItemComponent);
