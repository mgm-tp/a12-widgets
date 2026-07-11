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

import type { MouseEvent, TouchEvent, FocusEvent, ReactNode, ReactElement } from "react";
import { useRef, useState, useCallback, useMemo, Children, isValidElement, cloneElement } from "react";
import { styled } from "styled-components";

import type { Identifiable, Styleable } from "../../../../common/main/base-props.js";
import { HiddenText } from "../../../../common/main/hidden-text/hidden-text.view.js";
import { addPrefix, getAllFocusableElements, joinClassNames } from "../../../../common/main/utils.js";
import { InputElements } from "../../../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../../../base-input-styled/base.styled.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { TextAffixProps, TextFieldProps } from "./text-field.tpl.api.js";

const baseTextClassName = addPrefix("field__text");
const baseFieldClassName = addPrefix("field");

const StyledFieldTextUnseenSpan = styled.span.withConfig({ displayName: "StyledFieldTextUnseenSpan-sc-" })`
	border: 0;
	clip: rect(0 0 0 0);
	clip-path: inset(100%);
	height: 0;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 0;
`;

export function TextField(
	props: TextFieldProps & {
		/**
		 *  @deprecated since 37.0.0
		 */
		isPhone?: boolean;
	}
): ReactElement {
	const inputWrapperRef = useRef<HTMLDivElement | null>(null);
	const {
		ariaDescribedby,
		role,
		inputRef,
		onBlur,
		onInput,
		onWrapperKeyDown,
		hideLabel,
		readonly,
		spellCheck,
		fitToParent = true,
		disabled,
		onChange,
		tooltips,
		error,
		style,
		labelRef,
		errorMessage,
		onDoubleClick,
		textAlignment,
		onClick,
		labelGraphic,
		label,
		onWrapperMouseDown,
		suffixes,
		onKeyDown,
		infoMessage,
		warning,
		isPhone,
		autoComplete,
		onWrapperKeyPress,
		addonBefore,
		info,
		autoFocus,
		prefixes,
		value = "",
		helperText,
		className,
		id,
		onKeyUp,
		placeholder,
		helperTextRef,
		warningMessage,
		addonAfter,
		showHiddenText = false,
		onWrapperClick,
		inputProps,
		onFocus,
		customInputProps,
		customInputWrapperProps,
		inputWrapperRef: inputWrapperRefProps
	} = props;
	const [isFocused, setFocused] = useState(autoFocus);
	const [isNoEffect, setNoEffect] = useState(false);
	const inputType = inputProps?.type || "text";
	const unavailable = readonly || disabled;

	const fieldClasses = joinClassNames(baseTextClassName, {
		[`${baseTextClassName}--align-right`]: textAlignment && textAlignment === "right"
	});

	const addNoEffectClass = useCallback(
		(event: MouseEvent | TouchEvent) => {
			const element = event.currentTarget;

			if (inputWrapperRef.current && getAllFocusableElements(element as HTMLElement).length > 0) {
				inputWrapperRef.current?.classList.add(`${baseFieldClassName}__input--no-effect`);
				setNoEffect(true);
			}
		},
		[inputWrapperRef]
	);

	const onWrapperFocus = useCallback(
		(event: FocusEvent<HTMLDivElement>) => {
			if (inputWrapperRef.current && event.target === inputWrapperRef.current && !disabled && !readonly) {
				if (!readonly || value) {
					setFocused(true);
				}

				setNoEffect(false);
				customInputWrapperProps?.onFocus?.(event);
			}
		},
		[disabled, customInputWrapperProps, readonly, value]
	);

	const onWrapperBlur = useCallback(
		(event: FocusEvent<HTMLDivElement>): void => {
			customInputWrapperProps?.onBlur?.(event);
			setFocused(false);
		},
		[customInputWrapperProps]
	);

	const realInput = useMemo((): ReactNode => {
		const { onBlur: inputElementOnBlur, onFocus: inputElementOnFocus, ref, as, ...inputPropsRest } = inputProps ?? {};

		const getRealInputRef = (ref: HTMLInputElement | null): void => {
			if (ref) {
				inputRef?.(ref);
			}
		};

		const onInputFocus = (event: FocusEvent<HTMLInputElement>): void => {
			onFocus?.(event);
			inputElementOnFocus?.(event);

			if (inputWrapperRef.current) {
				if (!readonly || value) {
					setFocused(true);
				}

				setNoEffect(false);
			}
		};

		const onInputBlur = (event: FocusEvent<HTMLInputElement>): void => {
			const input = event.target as HTMLInputElement;

			/**
			 * Firefox sets the scroll position to the end, while others reset it to the beginning.
			 * To ensure consistency, we manually set the input's horizontal scroll back to the beginning when the input loses focus.
			 **/
			input.scrollLeft = 0;

			onBlur?.(event);
			inputElementOnBlur?.(event);
			setFocused(false);
		};

		return (
			<StyledBaseInput.StyledFieldTextInput
				$alignRight={textAlignment === "right"}
				data-role={DataRoles.TextField.Input}
				className={fieldClasses}
				placeholder={placeholder}
				autoFocus={autoFocus}
				onChange={onChange}
				disabled={disabled}
				readOnly={readonly}
				value={value}
				id={id}
				tabIndex={inputProps?.tabIndex ?? (readonly && !value ? -1 : undefined)}
				ref={getRealInputRef}
				type={inputType}
				onClick={unavailable ? undefined : onClick}
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				onFocus={onInputFocus}
				onBlur={onInputBlur}
				onDoubleClick={unavailable ? undefined : onDoubleClick}
				autoComplete={autoComplete}
				spellCheck={spellCheck}
				onInput={onInput}
				aria-describedby={joinClassNames(
					{ [`${id}-warning`]: id && warningMessage },
					{ [`${id}-error`]: id && errorMessage },
					{ [`${id}-info`]: id && infoMessage },
					ariaDescribedby,
					{
						[`${id}-label`]:
							id &&
							(label || placeholder) &&
							(warningMessage ||
								errorMessage ||
								infoMessage ||
								(ariaDescribedby && (tooltips || addonAfter || addonBefore)))
					}
				)}
				virtualkeyboardpolicy={customInputProps?.virtualKeyboardPolicy}
				{...inputPropsRest}
			/>
		);
	}, [
		ariaDescribedby,
		autoComplete,
		autoFocus,
		addonBefore,
		addonAfter,
		customInputProps?.virtualKeyboardPolicy,
		disabled,
		errorMessage,
		fieldClasses,
		id,
		infoMessage,
		inputProps,
		inputRef,
		inputType,
		label,
		onBlur,
		onChange,
		onClick,
		onDoubleClick,
		onFocus,
		onInput,
		onKeyDown,
		onKeyUp,
		placeholder,
		readonly,
		spellCheck,
		textAlignment,
		tooltips,
		unavailable,
		value,
		warningMessage
	]);
	const removeNoEffectClass = useCallback(() => {
		inputWrapperRef.current?.classList.remove(`${baseFieldClassName}__input--no-effect`);
		setNoEffect(false);
	}, [inputWrapperRef]);

	const prefixesElement = useMemo((): ReactNode => {
		const prefixesArray = Children.toArray(prefixes);

		return (
			prefixesArray &&
			prefixesArray.length > 0 &&
			prefixesArray.map((prefix, index) => (
				<StyledBaseInput.StyledFieldPrefixWrapper
					data-role={`${DataRoles.TextField.Prefix}-${index}`}
					className={joinClassNames(`${baseFieldClassName}__prefix`, {
						[`${baseFieldClassName}__prefix--last`]: prefixesArray.length === index + 1
					})}
					$last={prefixesArray.length === index + 1}
					key={`text-field-prefix-${index}`}
					onMouseEnter={addNoEffectClass}
					onMouseLeave={removeNoEffectClass}
					onTouchStart={addNoEffectClass}
					onTouchEnd={removeNoEffectClass}
				>
					{prefix}
				</StyledBaseInput.StyledFieldPrefixWrapper>
			))
		);
	}, [addNoEffectClass, prefixes, removeNoEffectClass]);

	const suffixesElement = useMemo((): ReactNode => {
		const suffixesArray = Children.toArray(suffixes).filter(Boolean);

		return (
			suffixesArray.length > 0 &&
			suffixesArray.map((suffix, index) => (
				<StyledBaseInput.StyledFieldSuffixWrapper
					className={joinClassNames(
						`${baseFieldClassName}__suffix`,
						{ [`${baseFieldClassName}__suffix--first`]: index === 0 },
						{ [addPrefix("-u-background-transparent")]: isValidElement(suffix) && suffix.type === TextAffix }
					)}
					$first={index === 0}
					key={`text-field-suffix-${index}`}
					data-role={`${DataRoles.TextField.Suffix}-${index}`}
					onMouseEnter={addNoEffectClass}
					onMouseLeave={removeNoEffectClass}
					onTouchStart={addNoEffectClass}
					onTouchEnd={removeNoEffectClass}
				>
					{suffix}
				</StyledBaseInput.StyledFieldSuffixWrapper>
			))
		);
	}, [addNoEffectClass, suffixes, removeNoEffectClass]);

	const renderAddonBefore = useCallback(
		(belongsToMain = true): ReactNode => {
			const addons = Children.toArray(addonBefore).filter(Boolean);

			return (
				addons.length > 0 &&
				addons.map((addon, index) => (
					<StyledBaseInput.StyledFieldAddon
						$position="before"
						className={`${baseFieldClassName}-addon ${baseFieldClassName}-addon--before`}
						key={`text-field--addon-before-${index}`}
						data-role={belongsToMain ? `text-field--addon-before-${index}` : undefined}
					>
						{belongsToMain || !isValidElement<Identifiable>(addon) ? addon : cloneElement(addon, { id: undefined })}
					</StyledBaseInput.StyledFieldAddon>
				))
			);
		},
		[addonBefore]
	);

	const renderAddonAfter = useCallback(
		(belongsToMain = true): ReactNode => {
			const addons = Children.toArray(addonAfter).filter(Boolean);

			return (
				addons.length > 0 &&
				addons.map((addon, index) => (
					<StyledBaseInput.StyledFieldAddon
						$position="after"
						className={`${baseFieldClassName}-addon ${baseFieldClassName}-addon--after`}
						key={`text-field--addon-after-${index}`}
						data-role={belongsToMain ? `text-field--addon-after-${index}` : undefined}
					>
						{belongsToMain || !isValidElement<Identifiable>(addon) ? addon : cloneElement(addon, { id: undefined })}
					</StyledBaseInput.StyledFieldAddon>
				))
			);
		},
		[addonAfter]
	);

	const labelElement = useMemo((): ReactNode => {
		if (!label && !placeholder) {
			return undefined;
		}

		const labelEl = (
			<>
				{label}
				{placeholder && <HiddenText showHiddenText={showHiddenText}>{`${label ? ", " : ""}${placeholder}`}</HiddenText>}
			</>
		);

		return (
			<InputElements.Label
				id={id}
				graphic={labelGraphic}
				htmlFor={id}
				dataRole={DataRoles.TextField.Label}
				label={labelEl}
				hide={hideLabel || !label}
				disabled={disabled}
				wrapperRef={labelRef}
			/>
		);
	}, [disabled, hideLabel, id, label, labelGraphic, labelRef, placeholder, showHiddenText]);

	const tooltipElement = useMemo(
		() =>
			tooltips &&
			Children.map(
				tooltips,
				(element, index) =>
					isValidElement<Styleable>(element) &&
					cloneElement(element, {
						key: "element-" + index,
						className: joinClassNames(element.props.className, `${baseFieldClassName}__tooltip`)
					})
			),
		[tooltips]
	);

	const handleFieldInputRef = useCallback(
		(ref: HTMLDivElement | null): void => {
			inputWrapperRef.current = ref;
			inputWrapperRefProps?.(ref);
		},
		[inputWrapperRefProps]
	);

	return (
		<StyledBaseInput.StyledFieldWrapper
			$block={fitToParent}
			$phone={isPhone}
			$disabled={disabled}
			data-role={DataRoles.TextField}
			className={joinClassNames(
				`${baseFieldClassName}-wrapper`,
				{ [`${baseFieldClassName}-wrapper--block`]: fitToParent },
				className
			)}
			key="text-field"
			style={style}
		>
			<StyledBaseInput.StyledFieldMain className={`${baseFieldClassName}__main`}>
				{renderAddonBefore()}
				<StyledBaseInput.StyledField
					$block={fitToParent}
					className={baseFieldClassName}
					data-role={DataRoles.TextField.Control}
					role={role}
				>
					{labelElement}
					{tooltipElement}
					{errorMessage && (
						<InputElements.Error
							className={`${baseFieldClassName}__message`}
							id={id}
							dataRole={DataRoles.TextField.ErrorMessage}
							errorMessage={errorMessage}
						/>
					)}
					{warningMessage && (
						<InputElements.Warning
							className={`${baseFieldClassName}__message`}
							id={id}
							dataRole={DataRoles.TextField.WarningMessage}
							warningMessage={warningMessage}
						/>
					)}
					{infoMessage && (
						<InputElements.Info
							className={`${baseFieldClassName}__message`}
							id={id}
							dataRole={DataRoles.TextField.InfoMessage}
							infoMessage={infoMessage}
						/>
					)}
					<StyledBaseInput.StyledFieldInput
						$disabled={disabled}
						$readonly={readonly}
						$warning={warning || !!warningMessage}
						$error={error || !!errorMessage}
						$info={info || !!infoMessage}
						$noEffect={isNoEffect}
						$hasFocus={isFocused}
						className={joinClassNames(
							`${baseFieldClassName}__input`,
							{ [`${baseFieldClassName}__input--readonly`]: readonly },
							{ [`${baseFieldClassName}__input--disabled`]: disabled },
							{ [`${baseFieldClassName}__input--warning`]: warning || warningMessage },
							{ [`${baseFieldClassName}__input--error`]: error || errorMessage },
							{ [`${baseFieldClassName}__input--focus`]: autoFocus }
						)}
						ref={handleFieldInputRef}
						data-role={DataRoles.TextField.Input.Wrapper}
						data-isfocused={isFocused}
						onClick={unavailable ? undefined : onWrapperClick}
						onMouseDown={unavailable ? undefined : onWrapperMouseDown}
						onKeyDown={unavailable ? undefined : onWrapperKeyDown}
						onKeyPress={unavailable ? undefined : onWrapperKeyPress}
						data-readonly={readonly} // for style only
						data-disabled={disabled} // for style only
						{...customInputWrapperProps}
						onFocus={onWrapperFocus}
						onBlur={onWrapperBlur}
					>
						{prefixesElement}
						{/* These 2 "span" before & after the real-input to prevent auto focus even just click on the nearest element */}
						<StyledFieldTextUnseenSpan className={addPrefix("supported-unseen-span")} />
						{realInput}
						<StyledFieldTextUnseenSpan className={addPrefix("supported-unseen-span")} />
						{suffixesElement}
					</StyledBaseInput.StyledFieldInput>
				</StyledBaseInput.StyledField>
				{renderAddonAfter()}
			</StyledBaseInput.StyledFieldMain>
			{helperText && (
				<StyledBaseInput.StyledFieldHelperWrapper className={`${baseFieldClassName}__helper`} ref={helperTextRef}>
					{renderAddonBefore(false)}
					<StyledBaseInput.StyledFieldHelperText
						className={`${baseFieldClassName}__helper-text`}
						htmlFor={id}
						data-role={DataRoles.TextField.HelperText}
					>
						{helperText}
					</StyledBaseInput.StyledFieldHelperText>
					{renderAddonAfter(false)}
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledBaseInput.StyledFieldWrapper>
	);
}

TextField.displayName = "TextField";

export function TextAffix(props: TextAffixProps): ReactElement<TextAffixProps> {
	return (
		<StyledBaseInput.StyledFieldAffixText
			$truncated={props.truncate}
			id={props.id}
			title={props.children}
			data-role={DataRoles.TextField.TextAffix}
			key="text-field-text-affix"
			className={joinClassNames(
				`${baseFieldClassName}__affix-text`,
				{ [`${baseFieldClassName}__affix-text--truncated`]: props.truncate },
				props.className
			)}
		>
			<span>{props.children}</span>
		</StyledBaseInput.StyledFieldAffixText>
	);
}

TextAffix.displayName = "TextAffix";
