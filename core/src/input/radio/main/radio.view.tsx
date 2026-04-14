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

import type { ReactElement } from "react";
import { Children, isValidElement, cloneElement } from "react";

import {
	generateUid,
	joinClassNames,
	addPrefix,
	noop,
	StringUtils,
	resolveRef,
	inputWithSuffixName
} from "../../../common/main/utils.js";
import { provider } from "../../../common/main/device-detector.js";
import { InputElements } from "../../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { StyledBaseBoolean } from "../../base-input-styled/base-boolean.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { RadioItemProps, RadioProps } from "./radio.api.js";
import { StyledRadio } from "./radio.styled.js";

const baseClassName = addPrefix("field__radio");
const baseFieldClassName = addPrefix("field");

export function Radio({
	ariaDescribedby,
	breakTooltipsToNewLine,
	children,
	className,
	disabled,
	error,
	errorMessage,
	fitToParent = true,
	groupDOMProps,
	helperText,
	hideLabel,
	id,
	info,
	infoMessage,
	inline,
	label,
	labelGraphic,
	name,
	onValueChanged,
	readonly,
	style,
	tooltips,
	value,
	warning,
	warningMessage,
	wrapperRef
}: RadioProps): ReactElement<RadioProps> {
	let fieldGroupRef: HTMLElement | null = null;
	const isTouch = provider.hasTouch();
	const numberOfTooltips = Children.count(tooltips);
	const wrapperClassNames = joinClassNames(
		baseFieldClassName,
		{ [`${baseFieldClassName}--tooltips`]: numberOfTooltips && !breakTooltipsToNewLine },
		{ [`${baseFieldClassName}--block`]: fitToParent },
		{ [`${baseFieldClassName}--inline`]: inline },
		{ [`${baseFieldClassName}--touch`]: isTouch },
		className
	);

	const handleWrapperRef = (ref: HTMLDivElement | null): void => {
		fieldGroupRef = ref;
		resolveRef(ref, wrapperRef);
	};

	const handleClickOnLabel = (): void => {
		if (fieldGroupRef) {
			const radios = fieldGroupRef.querySelectorAll("input[type=radio]:not([disabled])");

			if (radios.length > 0) {
				(radios[0] as HTMLElement).focus();
			}
		}
	};

	return (
		<StyledRadio.StyledField
			className={wrapperClassNames}
			style={style}
			data-role={DataRoles.Radio.Group}
			$block={fitToParent}
			$hasTooltips={!!numberOfTooltips && !breakTooltipsToNewLine}
			$touch={isTouch}
		>
			<InputElements.Label
				id={id}
				label={label}
				graphic={labelGraphic}
				hide={hideLabel}
				disabled={disabled}
				dataRole={DataRoles.Radio.Group.Label}
				onClick={handleClickOnLabel}
			/>
			{tooltips}
			{errorMessage && (
				<InputElements.Error id={id} errorMessage={errorMessage} dataRole={DataRoles.Radio.Group.ErrorMessage} />
			)}
			{warningMessage && (
				<InputElements.Warning
					id={id}
					warningMessage={warningMessage}
					dataRole={DataRoles.Radio.Group.WarningMessage}
				/>
			)}
			{infoMessage && (
				<InputElements.Info id={id} infoMessage={infoMessage} dataRole={DataRoles.Radio.Group.InfoMessage} />
			)}
			<StyledBaseBoolean.StyledFieldGroup
				{...groupDOMProps}
				className={joinClassNames(`${baseFieldClassName}__group`, groupDOMProps?.className)}
				role="radiogroup"
				aria-labelledby={id && `${id}-label`}
				ref={handleWrapperRef}
				$inline={inline}
				$touch={isTouch}
			>
				{Children.map(children, (child, index) => {
					return (
						isValidElement<RadioItemProps & { inline?: boolean }>(child) &&
						cloneElement(child, {
							id: id ? `${inputWithSuffixName(id)}${index + 1}` : undefined,
							disabled,
							readonly,
							key: child.props.value,
							selected: child.props.value === value,
							name: name || id,
							error: !!error || !!errorMessage,
							warning: !!warning || !!warningMessage,
							info: !!info || !!infoMessage,
							ariaDescribedby: StringUtils.join(
								{ [`${id}-label`]: id && label },
								{ [`${id}-info`]: id && infoMessage },
								{ [`${id}-warning`]: id && warningMessage },
								{ [`${id}-error`]: id && errorMessage },
								{ [`${id}-helperText`]: id && helperText },
								ariaDescribedby
							),
							inline,
							onChange: () => onValueChanged?.(child.props.value),
							...child.props
						})
					);
				})}
			</StyledBaseBoolean.StyledFieldGroup>
			{helperText && (
				<StyledBaseInput.StyledFieldHelperWrapper
					className={`${baseFieldClassName}__helper`}
					id={id && `${id}-helperText`}
				>
					<StyledBaseInput.StyledFieldHelperText
						className={`${baseFieldClassName}__helper-text`}
						onClick={handleClickOnLabel}
						onKeyDown={noop}
						data-role={DataRoles.Radio.Group.HelperText}
					>
						{helperText}
					</StyledBaseInput.StyledFieldHelperText>
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledRadio.StyledField>
	);
}

Radio.displayName = "Radio";

export namespace Radio {
	export function Item(props: RadioItemProps & { inline?: boolean }): ReactElement<RadioItemProps> {
		const inputClass = joinClassNames(
			baseClassName,
			{ [`${baseClassName}--disabled`]: props.disabled },
			{ [`${baseClassName}--readonly`]: props.readonly },
			{ [`${baseClassName}--error`]: props.error },
			{ [`${baseClassName}--warning`]: props.warning },
			{ [`${baseClassName}--checked`]: props.selected }
		);
		const labelClass = joinClassNames(
			`${baseFieldClassName}__label`,
			{ [`${baseFieldClassName}__label--disabled`]: props.disabled },
			{ [`${baseFieldClassName}__label--readonly`]: props.readonly }
		);
		const spanClass = joinClassNames(
			`${baseFieldClassName}__control`,
			`${baseFieldClassName}__control--boolean`,
			props.className
		);

		const inputId = props.id ? props.id : generateUid();
		const { as, ...inputPropsRest } = props.inputProps ?? {};

		return (
			<StyledBaseBoolean.StyledFieldControl
				className={spanClass}
				style={props.style}
				data-role={DataRoles.Radio.Item}
				$inline={props.inline}
				$isNonInteractive={props.disabled || props.readonly}
			>
				<StyledRadio.StyledBox data-role={DataRoles.Radio.ControlInner}>
					<StyledRadio.StyledInput
						{...inputPropsRest}
						tabIndex={props.tabIndex}
						type="radio"
						id={inputId}
						className={inputClass}
						value={props.value}
						checked={props.selected}
						disabled={props.disabled || props.readonly}
						onChange={props.onChange}
						ref={props.inputRef}
						name={props.name}
						onFocus={props.onFocus}
						onBlur={props.onBlur}
						data-role={DataRoles.Radio.Input}
						aria-describedby={props.ariaDescribedby}
						aria-checked={props.selected}
						$checked={props.selected}
						$disabled={props.disabled}
						$readonly={props.readonly}
						$info={props.info}
						$warning={props.warning}
						$error={props.error}
					/>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label htmlFor={inputId} aria-hidden={true}>
						<span />
					</label>
				</StyledRadio.StyledBox>
				<InputElements.Label
					id={`${inputId}-label`}
					className={labelClass}
					htmlFor={inputId}
					dataRole={DataRoles.Radio.Label}
					label={props.label}
					disabled={props.disabled}
				/>
			</StyledBaseBoolean.StyledFieldControl>
		);
	}

	Item.displayName = "RadioItem";
}
