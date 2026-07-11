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

import type { MouseEvent, TouchEvent, ReactElement, ChangeEvent } from "react";
import { Children, useRef, useState, useCallback } from "react";

import { joinClassNames, generateUid, addPrefix, noop } from "../../../common/main/utils.js";
import type { Container } from "../../../common/main/base-props.js";
import { InputElements } from "../../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { BaseCheckboxProps, CheckboxProps, IndeterminateCheckboxProps } from "./checkbox.api.js";
import { StyledCheckbox } from "./checkbox.styled.js";

const baseClassName = addPrefix("field__check");

type WrapperProps = BaseCheckboxProps<HTMLElement> &
	Container & {
		inline?: boolean;

		fieldControlMouseOver?(event: MouseEvent<HTMLElement>): void;

		fieldControlMouseOut?(event: MouseEvent<HTMLElement>): void;

		fieldControlTouchStart?(event: TouchEvent<HTMLElement>): void;

		fieldControlTouchEnd?(event: TouchEvent<HTMLElement>): void;
	};

function getInputClassName(fromProps: BaseCheckboxProps<HTMLElement>): string | undefined {
	return joinClassNames(
		baseClassName,
		{ [`${baseClassName}--disabled`]: fromProps.disabled },
		{ [`${baseClassName}--readonly`]: fromProps.readonly },
		{ [`${baseClassName}--error`]: fromProps.error || fromProps.errorMessage },
		{ [`${baseClassName}--warning`]: fromProps.warning || fromProps.warningMessage }
	);
}

function Wrapper(props: WrapperProps): ReactElement<WrapperProps> {
	let fieldRef: HTMLElement | null = null;

	const id = props.id;
	const isInteractive = !props.disabled && !props.readonly;
	const baseFieldClassName = addPrefix("field");
	const labelClass = joinClassNames(
		`${baseFieldClassName}__label`,
		{ [addPrefix("-u-unseenButRead")]: props.hideLabel },
		{ [`${baseFieldClassName}__label--disabled`]: props.disabled },
		{ [`${baseFieldClassName}__label--readonly`]: props.readonly }
	);
	const controlClassNames = joinClassNames(`${baseFieldClassName}__control`, `${baseFieldClassName}__control--boolean`);

	const numberOfTooltips = Children.count(props.tooltips);
	const wrapperClassNames = joinClassNames(
		baseFieldClassName,
		{ [`${baseFieldClassName}--tooltips`]: numberOfTooltips && !props.breakTooltipsToNewLine },
		{ [`${baseFieldClassName}--block`]: props.fitToParent },
		props.className
	);

	const handleClickOnHelperText = (): void => {
		if (fieldRef) {
			const checkboxes = fieldRef.querySelectorAll("input[type=checkbox]:not([disabled])");

			if (checkboxes.length > 0) {
				(checkboxes[0] as HTMLElement).focus();
			}
		}
	};

	return (
		<StyledCheckbox.StyledField
			className={wrapperClassNames}
			style={props.style}
			data-role={DataRoles.Checkbox}
			$block={props.fitToParent}
			$hasTooltips={!!(numberOfTooltips && !props.breakTooltipsToNewLine)}
		>
			{props.breakTooltipsToNewLine && props.tooltips}
			{props.errorMessage && (
				<InputElements.Error
					id={props.id}
					dataRole={DataRoles.Checkbox.ErrorMessage}
					errorMessage={props.errorMessage}
				/>
			)}
			{props.warningMessage && (
				<InputElements.Warning
					id={props.id}
					dataRole={DataRoles.Checkbox.WarningMessage}
					warningMessage={props.warningMessage}
				/>
			)}
			{props.infoMessage && (
				<InputElements.Info id={props.id} dataRole={DataRoles.Checkbox.InfoMessage} infoMessage={props.infoMessage} />
			)}
			<StyledCheckbox.StyledControl
				id={`${id}-controls`}
				className={controlClassNames}
				data-role={DataRoles.Checkbox.Control}
				ref={(ref) => {
					fieldRef = ref;
				}}
				title={props.title}
				onMouseOver={props.fieldControlMouseOver}
				onMouseOut={props.fieldControlMouseOut}
				onTouchStart={props.fieldControlTouchStart}
				onTouchEnd={props.fieldControlTouchEnd}
				$hasTooltips={!!(numberOfTooltips && !props.breakTooltipsToNewLine)}
				$inline={props.inline}
				$isNonInteractive={!isInteractive}
			>
				<StyledCheckbox.StyledBox isInteractive={isInteractive} data-role={DataRoles.Checkbox.Control.Inner}>
					{props.children}
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label
						htmlFor={id}
						onClick={props.inputProps?.onClick}
						aria-hidden={true}
						data-role={DataRoles.Checkbox.Control.Inner.HiddenLabel}
					>
						<span />
					</label>
				</StyledCheckbox.StyledBox>
				<InputElements.Label
					disabled={props.disabled}
					className={labelClass}
					hide={props.hideLabel}
					htmlFor={id}
					dataRole={DataRoles.Checkbox.Label}
					label={props.label}
					graphic={props.labelGraphic}
				/>
				{!props.breakTooltipsToNewLine && props.tooltips}
			</StyledCheckbox.StyledControl>
			{props.helperText && (
				<StyledBaseInput.StyledFieldHelperWrapper
					className={`${baseFieldClassName}__helper`}
					id={id && `${id}-helperText`}
				>
					<StyledBaseInput.StyledFieldHelperText
						className={`${baseFieldClassName}__helper-text`}
						onClick={handleClickOnHelperText}
						onKeyDown={noop}
						data-role={DataRoles.Checkbox.HelperText}
					>
						{props.helperText}
					</StyledBaseInput.StyledFieldHelperText>
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledCheckbox.StyledField>
	);
}

Wrapper.displayName = "CheckboxWrapper";

export function Checkbox({ fitToParent = true, ...props }: CheckboxProps): ReactElement<CheckboxProps> {
	const id = props.id || generateUid();
	const { as, ...inputPropsRest } = props.inputProps ?? {};

	return (
		<Wrapper {...props} fitToParent={fitToParent} id={id}>
			<StyledCheckbox.StyledCheckboxInput
				{...inputPropsRest}
				id={id}
				tabIndex={props.tabIndex}
				disabled={props.readonly || props.disabled}
				type="checkbox"
				checked={props.checked}
				className={joinClassNames(getInputClassName(props), { [`${baseClassName}--checked`]: props.checked })}
				onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange(event.currentTarget.checked, event)}
				ref={props.inputRef}
				onFocus={props.onFocus}
				onBlur={props.onBlur}
				data-role={DataRoles.Checkbox.Input}
				aria-checked={props.checked}
				aria-controls={props.ariaControls}
				aria-describedby={joinClassNames(
					{ [`${id}-info`]: props.infoMessage },
					{ [`${id}-warning`]: props.warningMessage },
					{ [`${id}-error`]: props.errorMessage },
					{ [`${id}-helperText`]: props.helperText },
					props.ariaDescribedby
				)}
				$checked={props.checked}
				$disabled={props.disabled}
				$readonly={props.readonly}
				$error={!!(props.error || props.errorMessage)}
				$warning={!!(props.warning || props.warningMessage)}
				$info={!!(props.info || props.infoMessage)}
			/>
		</Wrapper>
	);
}

Checkbox.displayName = "Checkbox";

export namespace Checkbox {
	export function Indeterminate(props: IndeterminateCheckboxProps): ReactElement<IndeterminateCheckboxProps> {
		const { checked, tabIndex, readonly, disabled, buttonRef, onFocus, onBlur, ariaControls, inputProps, onChange } =
			props;
		const checkRef = useRef<HTMLSpanElement | null>(null);
		const [hasEffect, setHasEffect] = useState(false);

		const type = inputProps?.type;
		const id = props.id || generateUid();

		const addEffectClass = useCallback(() => {
			setHasEffect(true);
			checkRef.current?.classList.add(`${baseClassName}--effect`);
		}, []);

		const removeEffectClass = useCallback(() => {
			setHasEffect(false);
			checkRef.current?.classList.remove(`${baseClassName}--effect`);
		}, []);

		const onClick = useCallback(
			(event: MouseEvent) => onChange(checked === "mixed" || !checked, event),
			[checked, onChange]
		);

		return (
			<Wrapper
				{...props}
				id={id}
				fieldControlMouseOver={addEffectClass}
				fieldControlMouseOut={removeEffectClass}
				fieldControlTouchStart={addEffectClass}
				fieldControlTouchEnd={removeEffectClass}
			>
				<StyledCheckbox.StyledIndeterminateInput
					as="span"
					ref={checkRef}
					className={joinClassNames(
						getInputClassName(props),
						{ [`${baseClassName}--indeterminate`]: checked === "mixed" },
						{ [`${baseClassName}--checked`]: checked === true }
					)}
					data-role={DataRoles.Checkbox.Input.Indeterminate}
					$checked={checked === true}
					$hovered={hasEffect}
					$mixed={checked === "mixed"}
					$disabled={props.disabled}
					$readonly={props.readonly}
					$error={!!(props.error || props.errorMessage)}
					$warning={!!(props.warning || props.warningMessage)}
					$info={!!(props.info || props.infoMessage)}
				>
					<button
						{...inputProps}
						type={type === "submit" || type === "reset" || type === "button" ? type : undefined}
						id={id}
						disabled={readonly || disabled}
						ref={buttonRef}
						onFocus={onFocus}
						onBlur={onBlur}
						tabIndex={tabIndex}
						data-role={DataRoles.Checkbox.Input}
						role="checkbox"
						aria-checked={checked}
						aria-controls={ariaControls}
						onClick={onClick}
					/>
				</StyledCheckbox.StyledIndeterminateInput>
			</Wrapper>
		);
	}
}
