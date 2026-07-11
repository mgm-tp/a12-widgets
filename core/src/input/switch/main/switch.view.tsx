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

import type { ReactNode, FocusEvent, ChangeEvent, ReactElement } from "react";
import { useState, Children, isValidElement, cloneElement, createRef } from "react";

import { joinClassNames, noop, addPrefix } from "../../../common/main/utils.js";
import type { Styleable } from "../../../common/main/base-props.js";
import { InputElements } from "../../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { SwitchProps } from "./switch.api.js";
import {
	StyledSwitchInteractive,
	StyledSwitchTrack,
	StyledSwitchThumb,
	StyledSwitchControl,
	StyledSwitchInput,
	StyledSwitchOption,
	StyledSwitchThumbIcon,
	StyledSwitchLabel,
	StyledSwitchField,
	StyledSwitchInlineWrapper
} from "./switch.styled.js";

export function Switch({
	addonAfter: addonAfterProp,
	ariaDescribedby,
	checked,
	checkedIcon,
	checkedOption,
	className,
	disabled,
	error,
	errorMessage,
	fitToParent = true,
	helperText,
	hideLabel,
	hideOptions,
	id,
	infoMessage,
	inputProps,
	label,
	labelGraphic,
	labelPosition = "top",
	onBlur,
	onChange,
	onFocus,
	readonly,
	style,
	tooltips: tooltipsProp,
	uncheckedIcon,
	uncheckedOption,
	warning,
	warningMessage
}: SwitchProps): ReactElement<SwitchProps> {
	const baseFieldClassName = addPrefix("field");

	const wrapperClasses = joinClassNames(
		baseFieldClassName,
		{ [`${baseFieldClassName}--block`]: fitToParent },
		className
	);

	const switchClass = addPrefix("switch");
	const switchInteractive = switchClass + "__interactive";
	const switchInteractiveClasses = joinClassNames(
		switchInteractive,
		{ [switchInteractive + "--checked"]: checked },
		{ [switchInteractive + "--readonly"]: !disabled && readonly },
		{ [switchInteractive + "--disabled"]: disabled },
		{ [switchInteractive + "--warning"]: warning || warningMessage },
		{ [switchInteractive + "--error"]: error || errorMessage }
	);
	const [focused, setFocused] = useState(false);

	const renderOption = (option: ReactNode, dataRole: string): ReactNode => {
		return (
			!hideOptions &&
			option && (
				<StyledSwitchOption className={switchClass + "__option"} aria-hidden={true} data-role={dataRole}>
					{option}
				</StyledSwitchOption>
			)
		);
	};

	const addonAfter =
		addonAfterProp &&
		Children.map(addonAfterProp, (element, index: number) => (
			<StyledBaseInput.StyledFieldAddon
				$position="after"
				className={`${baseFieldClassName}-addon ${baseFieldClassName}-addon--after`}
				data-role={`${DataRoles.Switch.AddonAfter}-${index}`}
				key={`element-${index}`}
			>
				{element}
			</StyledBaseInput.StyledFieldAddon>
		));

	const tooltips =
		tooltipsProp &&
		Children.map(
			tooltipsProp,
			(element, index) =>
				isValidElement<Styleable>(element) &&
				cloneElement(element, {
					key: "element-" + index,
					className: joinClassNames(element.props.className, `${baseFieldClassName}__tooltip`)
				})
		);

	const switchRef = createRef<HTMLDivElement>();

	const onInputFocus = (e: FocusEvent<HTMLInputElement>): void => {
		onFocus?.(e);
		const switchDOM = switchRef.current;

		if (switchDOM) {
			switchDOM.classList.add(`${switchClass}--focus`);
			setFocused(true);
		}
	};

	const onInputBlur = (e: FocusEvent<HTMLInputElement>): void => {
		onBlur?.(e);
		const switchDOM = switchRef.current;

		if (switchDOM) {
			switchDOM.classList.remove(`${switchClass}--focus`);
			setFocused(false);
		}
	};

	const handleClickOnHelperText = (): void => {
		if (switchRef.current) {
			const checkboxes = switchRef.current.querySelectorAll("input[type=checkbox]:not([disabled])");

			if (checkboxes.length > 0) {
				(checkboxes[0] as HTMLElement).focus();
			}
		}
	};

	const labelElement = (
		<StyledSwitchLabel
			id={id}
			label={label}
			graphic={labelGraphic}
			hide={hideLabel}
			disabled={disabled}
			htmlFor={id}
			dataRole={DataRoles.Switch.Label}
			$labelPosition={labelPosition}
			$isInteractive={!disabled && !readonly}
		/>
	);

	const switchControl = (
		<StyledSwitchControl className={switchClass} ref={switchRef} data-role={DataRoles.Switch.Control}>
			{renderOption(uncheckedOption, DataRoles.Switch.UncheckedOption)}
			<StyledSwitchInteractive
				className={switchInteractiveClasses}
				$warning={!!(warning || warningMessage)}
				$error={!!(error || errorMessage)}
				$readonly={readonly}
				$disabled={disabled}
				$checked={checked}
				$focused={focused}
				data-role={DataRoles.Switch.Interactive}
			>
				<StyledSwitchTrack className={switchClass + "__track"} />
				<StyledSwitchThumb className={switchClass + "__thumb"}>
					<StyledSwitchThumbIcon data-role={DataRoles.Switch.ThumbIcon}>
						{checked ? (checkedIcon ?? <Icon>check</Icon>) : (uncheckedIcon ?? <Icon>remove</Icon>)}
					</StyledSwitchThumbIcon>
				</StyledSwitchThumb>
				<StyledSwitchInput
					{...inputProps}
					as={undefined}
					id={id}
					className={switchClass + "__input"}
					data-role={DataRoles.Switch.Input}
					type="checkbox"
					disabled={disabled || readonly}
					checked={checked}
					aria-checked={checked}
					onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.checked, event)}
					onFocus={onInputFocus}
					onBlur={onInputBlur}
					aria-describedby={joinClassNames(
						{ [`${id}-warning`]: id && warningMessage },
						{ [`${id}-error`]: id && errorMessage },
						{ [`${id}-helperText`]: id && helperText },
						ariaDescribedby
					)}
				/>
			</StyledSwitchInteractive>
			{renderOption(checkedOption, DataRoles.Switch.CheckedOption)}
			{addonAfter}
		</StyledSwitchControl>
	);

	return (
		<StyledSwitchField $block={fitToParent} className={wrapperClasses} data-role={DataRoles.Switch} style={style}>
			{labelPosition === "top" && labelElement}
			{tooltips}
			{errorMessage && (
				<InputElements.Error id={id} errorMessage={errorMessage} dataRole={DataRoles.Switch.ErrorMessage} />
			)}
			{warningMessage && (
				<InputElements.Warning id={id} warningMessage={warningMessage} dataRole={DataRoles.Switch.WarningMessage} />
			)}
			{infoMessage && <InputElements.Info id={id} infoMessage={infoMessage} dataRole={DataRoles.Switch.InfoMessage} />}
			{labelPosition === "left" || labelPosition === "right" ? (
				<StyledSwitchInlineWrapper data-role={DataRoles.Switch.InlineWrapper}>
					{labelPosition === "left" && labelElement}
					{switchControl}
					{labelPosition === "right" && labelElement}
				</StyledSwitchInlineWrapper>
			) : (
				switchControl
			)}
			{labelPosition === "bottom" && labelElement}
			{helperText && (
				<StyledBaseInput.StyledFieldHelperWrapper
					className={`${baseFieldClassName}__helper`}
					id={id && `${id}-helperText`}
				>
					<StyledBaseInput.StyledFieldHelperText
						className={`${baseFieldClassName}__helper-text`}
						onClick={handleClickOnHelperText}
						onKeyDown={noop}
						data-role={DataRoles.Switch.HelperText}
					>
						{helperText}
					</StyledBaseInput.StyledFieldHelperText>
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledSwitchField>
	);
}

Switch.displayName = "Switch";
