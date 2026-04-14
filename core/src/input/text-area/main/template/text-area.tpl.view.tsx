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

import type { MouseEvent, TouchEvent, ReactNode, FocusEvent, ReactElement } from "react";
import { useRef, useState, useCallback, useMemo, Children, isValidElement, cloneElement } from "react";
import { useResizeDetector } from "react-resize-detector";
import { type ResizePayload } from "react-resize-detector";

import { joinClassNames, addPrefix, getAllFocusableElements } from "../../../../common/main/utils.js";
import { InputElements } from "../../../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../../../base-input-styled/base.styled.js";
import { HiddenText } from "../../../../common/main/hidden-text/hidden-text.view.js";
import type { Identifiable, Styleable } from "../../../../common/main/base-props.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { TextAreaStatelessProps } from "./text-area.tpl.api.js";
import { StyledTextAreaAddon, StyledTextAreaInput, StyledTextAreaInputWrapper } from "./text-area.tpl.styled.js";

const baseInputClassName = addPrefix("field__input");
const baseFieldClassName = addPrefix("field");

export function TextAreaStateless(props: TextAreaStatelessProps): ReactElement<TextAreaStatelessProps> {
	const inputElement = useRef<HTMLTextAreaElement | null>(null);
	const inputWrapperElement = useRef<HTMLDivElement | null>(null);
	const [isFocused, setFocused] = useState(props.autoFocus);
	const [isNoEffect, setNoEffect] = useState(false);
	const addonBeforeRefs = useRef<Record<string, HTMLElement | null>>({});
	const addonAfterRefs = useRef<Record<string, HTMLElement | null>>({});
	const {
		ariaDescribedby,
		ariaExpanded,
		error,
		errorMessage,
		id,
		info,
		infoMessage,
		inputRef,
		label,
		placeholder,
		ariaActivedescendant,
		ariaAutocomplete,
		ariaBusy,
		ariaHaspopup,
		ariaOwns,
		autoExpand,
		autoFocus,
		disabled,
		inputProps,
		onChange,
		onClick,
		onInput,
		onKeyDown,
		onFocus,
		onBlur,
		readonly,
		hideLabel,
		helperText,
		labelGraphic,
		fitToParent = true,
		style,
		wrapperStyle,
		className,
		textAlignment,
		value = "",
		warning,
		warningMessage,
		inputWrapperRef,
		onHeightChanged,
		role,
		wrapperRole,
		inputWrapperProps,
		showHiddenText = false,
		addonAfter,
		addonBefore,
		prefixes,
		suffixes,
		tooltips
	} = props;
	const fieldClasses = joinClassNames(
		baseInputClassName,
		`${baseInputClassName}--textarea`,
		{ [`${baseInputClassName}--disabled`]: disabled },
		{ [`${baseInputClassName}--readonly`]: readonly },
		{ [`${baseInputClassName}--error`]: error || errorMessage },
		{ [`${baseInputClassName}--warning`]: warning || warningMessage }
	);

	const setAddonHeight = useCallback((addonRefs: Record<string, HTMLElement | null>, height: number): void => {
		Object.keys(addonRefs).forEach((key) => {
			const addonRef = addonRefs[key];

			if (addonRef) {
				addonRef.style.height = height + "px";
			}
		});
	}, []);
	const handleInput = useCallback<(payload?: ResizePayload) => void>(
		(payload) => {
			requestAnimationFrame(() => {
				let addonHeight = payload?.height;

				if (autoExpand && inputElement.current) {
					const parentElement = inputElement.current.parentElement || document.body;
					const parentHeight = parentElement.style.height;
					const computedStyle = window.getComputedStyle(inputElement.current);
					parentElement.style.height = computedStyle.height;
					const minHeight = parseInt(computedStyle.minHeight || "0", 10);
					const maxHeight = parseFloat(computedStyle.maxHeight || "0") || 99999999;
					// force height of inputElement to get the height of an element's content (using scrollHeight)
					// but set to 1px to fix the bug related to tag widget inside Affixes from TextAreaStateless removed only after double click on iOS device
					inputElement.current.style.height = "1px";

					// To fix flickering while typing on Firefox, round vertical padding and lineHeight to make values of
					// calculation between React and Style be consistent
					inputElement.current.style.paddingTop = Math.round(parseFloat(computedStyle.paddingTop)) + "px";
					inputElement.current.style.paddingBottom = Math.round(parseFloat(computedStyle.paddingBottom)) + "px";
					inputElement.current.style.lineHeight = Math.ceil(parseFloat(computedStyle.lineHeight)) + "px";

					const scrollHeight = inputElement.current.scrollHeight;
					const newFitHeight = Math.max(minHeight, scrollHeight);
					const newHeight = Math.min(maxHeight, newFitHeight);

					inputElement.current.style.height = newHeight + "px";
					inputElement.current.style.overflowY = newHeight !== scrollHeight ? "auto" : "hidden";
					parentElement.style.height = parentHeight;
					onHeightChanged?.(inputElement.current, newHeight);

					addonHeight = newHeight;

					// Reset after calculation to avoid misalignment when zooming.
					inputElement.current.style.paddingTop = "";
					inputElement.current.style.paddingBottom = "";
					inputElement.current.style.lineHeight = "";
				}

				if (addonHeight) {
					setAddonHeight(addonBeforeRefs.current, addonHeight);
					setAddonHeight(addonAfterRefs.current, addonHeight);
				}
			});
		},
		[addonAfterRefs, autoExpand, onHeightChanged, setAddonHeight]
	);

	const handleInputWrapperRef = (ref: HTMLDivElement | null): void => {
		inputWrapperElement.current = ref;
		inputWrapperRef?.(ref);
	};

	const addNoEffectClass = useCallback(
		(event: MouseEvent | TouchEvent) => {
			const element = event.currentTarget;

			if (inputWrapperElement.current && getAllFocusableElements(element as HTMLElement).length > 0) {
				inputWrapperElement.current.classList.add(`${baseFieldClassName}__input--no-effect`);
				setNoEffect(true);
			}
		},
		[inputWrapperElement]
	);

	const removeNoEffectClass = useCallback(() => {
		inputWrapperElement.current?.classList.remove(`${baseFieldClassName}__input--no-effect`);
		setNoEffect(false);
	}, [inputWrapperElement]);

	const prefixesElement = useMemo((): ReactNode => {
		const prefixesArray = Children.toArray(prefixes).filter(Boolean);

		return (
			prefixesArray.length > 0 &&
			prefixesArray.map((prefix, index) => (
				<StyledBaseInput.StyledFieldPrefixWrapper
					className={joinClassNames(`${baseFieldClassName}__prefix`, {
						[`${baseFieldClassName}__prefix--last`]: index === prefixesArray.length - 1
					})}
					key={`textarea-prefix-${index}`}
					data-role={`textarea-prefix-${index}`}
					onMouseEnter={addNoEffectClass}
					onMouseLeave={removeNoEffectClass}
					onTouchStart={addNoEffectClass}
					onTouchEnd={removeNoEffectClass}
					$last={prefixesArray.length === index + 1}
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
					className={joinClassNames(`${baseFieldClassName}__suffix`, {
						[`${baseFieldClassName}__suffix--first`]: index === 0
					})}
					key={`textarea-suffix-${index}`}
					data-role={`textarea-suffix-${index}`}
					onMouseEnter={addNoEffectClass}
					onMouseLeave={removeNoEffectClass}
					onTouchStart={addNoEffectClass}
					onTouchEnd={removeNoEffectClass}
					$first={index === 0}
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
					<StyledTextAreaAddon
						className={`${baseFieldClassName}-addon ${baseFieldClassName}-addon--textarea ${baseFieldClassName}-addon--before`}
						key={`textarea--addon-before-${index}`}
						data-role={belongsToMain ? `textarea--addon-before-${index}` : undefined}
						ref={(ref): void => {
							if (belongsToMain) {
								addonBeforeRefs.current[index] = ref;
							}
						}}
						$position="before"
					>
						{belongsToMain || !isValidElement<Identifiable>(addon) ? addon : cloneElement(addon, { id: undefined })}
					</StyledTextAreaAddon>
				))
			);
		},
		[addonBeforeRefs, addonBefore]
	);

	const renderAddonAfter = useCallback(
		(belongsToMain = true): ReactNode => {
			const addons = Children.toArray(addonAfter).filter(Boolean);

			return (
				addons.length > 0 &&
				addons.map((addon, index) => (
					<StyledTextAreaAddon
						className={`${baseFieldClassName}-addon ${baseFieldClassName}-addon--textarea ${baseFieldClassName}-addon--after`}
						key={`textarea--addon-after-${index}`}
						data-role={belongsToMain ? `textarea--addon-after-${index}` : undefined}
						ref={(ref): void => {
							if (belongsToMain) {
								addonAfterRefs.current[index] = ref;
							}
						}}
						$position="after"
					>
						{belongsToMain || !isValidElement<Identifiable>(addon) ? addon : cloneElement(addon, { id: undefined })}
					</StyledTextAreaAddon>
				))
			);
		},
		[addonAfterRefs, addonAfter]
	);

	const renderLabel = useMemo((): ReactNode => {
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
				label={labelEl}
				graphic={labelGraphic}
				hide={hideLabel || !label}
				disabled={disabled}
				dataRole={DataRoles.Textarea.Label}
				htmlFor={id}
			/>
		);
	}, [disabled, hideLabel, id, label, labelGraphic, placeholder, showHiddenText]);

	const textAreaElement = useMemo((): ReactNode => {
		const { onBlur: inputElementOnBlur, onFocus: inputElementOnFocus, ref, as, ...inputPropsRest } = inputProps ?? {};

		const onInputFocus = (event: FocusEvent<HTMLTextAreaElement>): void => {
			onFocus?.(event);
			inputElementOnFocus?.(event);

			if (!readonly || value) {
				inputWrapperElement.current?.classList.add(`${baseInputClassName}--focus`);
				setFocused(true);
			}
		};

		const onInputBlur = (event: FocusEvent<HTMLTextAreaElement>): void => {
			onBlur?.(event);
			inputElementOnBlur?.(event);
			inputWrapperElement.current?.classList.remove(`${baseInputClassName}--focus`);
			setFocused(false);
		};

		const handleInputRef = (ref: HTMLTextAreaElement): void => {
			inputElement.current = ref;
			inputRef?.(ref);
			handleInput();
		};

		return (
			<StyledTextAreaInput
				as="textarea"
				autoExpand={autoExpand}
				data-role={DataRoles.Textarea.Input}
				className={joinClassNames(
					`${baseFieldClassName}__text`,
					{ [`${baseFieldClassName}__text--autoExpand`]: autoExpand },
					{ [`${baseFieldClassName}__text--align-right`]: textAlignment && textAlignment === "right" }
				)}
				placeholder={placeholder}
				onChange={onChange}
				onKeyDown={onKeyDown}
				disabled={disabled}
				readOnly={readonly}
				autoFocus={autoFocus}
				onFocus={onInputFocus}
				onBlur={onInputBlur}
				onInput={onInput}
				value={value}
				id={id}
				ref={handleInputRef}
				style={style}
				aria-describedby={joinClassNames(
					{ [`${id}-info`]: id && infoMessage },
					{ [`${id}-warning`]: id && warningMessage },
					{ [`${id}-error`]: id && errorMessage },
					ariaDescribedby,
					{
						[`${id}-label`]:
							id &&
							(label || placeholder) &&
							(warningMessage || errorMessage || infoMessage || ariaDescribedby) &&
							!suffixes &&
							!prefixes
					}
				)}
				aria-autocomplete={ariaAutocomplete}
				aria-haspopup={ariaHaspopup}
				aria-activedescendant={ariaActivedescendant}
				aria-busy={ariaBusy}
				autoComplete="off"
				aria-owns={ariaOwns}
				tabIndex={inputProps?.tabIndex ?? (readonly && !value ? -1 : undefined)}
				onClick={!disabled && !readonly ? onClick : undefined}
				$alignRight={textAlignment === "right"}
				{...inputPropsRest}
			/>
		);
	}, [
		inputProps,
		autoExpand,
		textAlignment,
		placeholder,
		onChange,
		onKeyDown,
		disabled,
		readonly,
		autoFocus,
		onInput,
		value,
		id,
		style,
		infoMessage,
		warningMessage,
		errorMessage,
		ariaDescribedby,
		label,
		suffixes,
		prefixes,
		ariaAutocomplete,
		ariaHaspopup,
		ariaActivedescendant,
		ariaBusy,
		ariaOwns,
		onClick,
		onFocus,
		onBlur,
		inputRef,
		handleInput
	]);

	const tooltipsElement = useMemo(
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

	useResizeDetector({
		handleWidth: false,
		targetRef: inputWrapperElement,
		onResize: handleInput,
		refreshMode: "debounce",
		refreshRate: 0
	});

	return (
		<StyledBaseInput.StyledFieldWrapper
			className={joinClassNames(
				`${baseFieldClassName}-wrapper`,
				{ [`${baseFieldClassName}-wrapper--block`]: fitToParent },
				className
			)}
			style={wrapperStyle}
			key="group"
			data-role={DataRoles.Textarea}
			role={wrapperRole}
			$block={fitToParent}
			$disabled={disabled}
		>
			<StyledBaseInput.StyledFieldMain className={`${baseFieldClassName}__main`}>
				{renderAddonBefore()}
				<StyledBaseInput.StyledField
					className={baseFieldClassName}
					style={style}
					data-role={DataRoles.Textarea.Control}
					$block={fitToParent}
				>
					{renderLabel}
					{tooltipsElement}
					{errorMessage && (
						<InputElements.Error
							className={`${baseFieldClassName}__message`}
							id={id}
							errorMessage={errorMessage}
							dataRole={DataRoles.Textarea.ErrorMessage}
						/>
					)}
					{warningMessage && (
						<InputElements.Warning
							className={`${baseFieldClassName}__message`}
							id={id}
							warningMessage={warningMessage}
							dataRole={DataRoles.Textarea.WarningMessage}
						/>
					)}
					{infoMessage && (
						<InputElements.Info
							className={`${baseFieldClassName}__message`}
							id={id}
							infoMessage={infoMessage}
							dataRole={DataRoles.Textarea.InfoMessage}
						/>
					)}
					<StyledTextAreaInputWrapper
						className={fieldClasses}
						ref={handleInputWrapperRef}
						role={role}
						aria-expanded={ariaExpanded}
						data-readonly={readonly}
						data-disabled={disabled}
						data-isfocused={isFocused}
						$disabled={disabled}
						$readonly={readonly}
						$warning={warning || !!warningMessage}
						$error={error || !!errorMessage}
						$info={info || !!infoMessage}
						$noEffect={isNoEffect}
						$hasFocus={isFocused}
						{...inputWrapperProps}
					>
						{prefixesElement}
						{textAreaElement}
						{suffixesElement}
					</StyledTextAreaInputWrapper>
				</StyledBaseInput.StyledField>
				{renderAddonAfter()}
			</StyledBaseInput.StyledFieldMain>
			{helperText && (
				<StyledBaseInput.StyledFieldHelperWrapper className={`${baseFieldClassName}__helper`}>
					{renderAddonBefore(false)}
					<StyledBaseInput.StyledFieldHelperText
						className={`${baseFieldClassName}__helper-text`}
						htmlFor={id}
						data-role={DataRoles.Textarea.HelperText}
					>
						{helperText}
					</StyledBaseInput.StyledFieldHelperText>
					{renderAddonAfter(false)}
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledBaseInput.StyledFieldWrapper>
	);
}

TextAreaStateless.displayName = "TextAreaStateless";
