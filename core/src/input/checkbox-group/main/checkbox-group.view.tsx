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
import { styled, css } from "styled-components";

import {
	joinClassNames,
	addPrefix,
	generateUid,
	noop,
	resolveRef,
	inputWithSuffixName
} from "../../../common/main/utils.js";
import { provider } from "../../../common/main/device-detector.js";
import { InputElements } from "../../base/template/base.tpl.view.js";
import { Checkbox } from "../../checkbox/main/checkbox.view.js";
import { StyledBaseInput } from "../../base-input-styled/base.styled.js";
import { StyledCheckbox } from "../../checkbox/main/checkbox.styled.js";
import { StyledBaseBoolean } from "../../base-input-styled/base-boolean.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { CheckboxGroupProps, CheckboxItemProps } from "./checkbox-group.api.js";

export const StyledCheckboxGroupField = styled(StyledBaseInput.StyledField).withConfig({
	displayName: "StyledCheckboxGroupField-sc-"
})<{ $touch?: boolean }>(({ theme, $touch }) => {
	const { controlBoolean, booleanGroupTouch } = theme.components.baseInput.field;

	return css`
		${StyledCheckbox.StyledField} {
			margin: ${$touch ? 0 : controlBoolean.margin};
			min-height: 0;
			padding: ${$touch ? booleanGroupTouch.childrenPadding : 0};
			${StyledCheckbox.StyledControl} {
				padding: 0;
			}
		}
	`;
});

export function CheckboxGroup({
	ariaDescribedby,
	breakTooltipsToNewLine,
	children,
	className,
	disabled,
	error,
	errorMessage,
	fitToParent = true,
	helperText,
	hideLabel,
	id,
	info,
	infoMessage,
	inline,
	label,
	labelGraphic,
	onValueChanged,
	readonly,
	style,
	tooltips,
	warning,
	warningMessage,
	wrapperRef
}: CheckboxGroupProps): ReactElement<CheckboxGroupProps> {
	let fieldGroupRef: HTMLDivElement | null = null;
	const isTouch = provider.hasTouch();
	const baseFieldClassName = addPrefix("field");
	const numberOfTooltips = Children.count(tooltips);
	const wrapperClassNames = joinClassNames(
		baseFieldClassName,
		{ [`${baseFieldClassName}--tooltips`]: numberOfTooltips && !breakTooltipsToNewLine },
		{ [`${baseFieldClassName}--block`]: fitToParent },
		{ [`${baseFieldClassName}--inline`]: inline },
		{ [`${baseFieldClassName}--touch`]: isTouch },
		className
	);

	const optionIdPrefix = id || generateUid();

	const handleWrapperRef = (ref: HTMLDivElement | null): void => {
		fieldGroupRef = ref;
		resolveRef(ref, wrapperRef);
	};

	const handleClickOnLabel = (): void => {
		if (fieldGroupRef) {
			const checkboxes = fieldGroupRef.querySelectorAll("input[type=checkbox]:not([disabled])");

			if (checkboxes.length > 0) {
				(checkboxes[0] as HTMLElement).focus();
			}
		}
	};

	return (
		<StyledCheckboxGroupField
			$block={fitToParent}
			$hasTooltips={!!(numberOfTooltips && !breakTooltipsToNewLine)}
			$touch={isTouch}
			className={wrapperClassNames}
			style={style}
			data-role={DataRoles.CheckboxGroup}
			id={id}
		>
			<InputElements.Label
				id={id}
				label={label}
				graphic={labelGraphic}
				hide={hideLabel}
				disabled={disabled}
				dataRole={DataRoles.CheckboxGroup.Label}
				onClick={handleClickOnLabel}
			/>
			{tooltips}
			{errorMessage && (
				<InputElements.Error id={id} errorMessage={errorMessage} dataRole={DataRoles.CheckboxGroup.ErrorMessage} />
			)}
			{warningMessage && (
				<InputElements.Warning
					id={id}
					warningMessage={warningMessage}
					dataRole={DataRoles.CheckboxGroup.WarningMessage}
				/>
			)}
			{infoMessage && (
				<InputElements.Info id={id} infoMessage={infoMessage} dataRole={DataRoles.CheckboxGroup.InfoMessage} />
			)}
			<StyledBaseBoolean.StyledFieldGroup
				className={`${baseFieldClassName}__group`}
				ref={handleWrapperRef}
				$inline={inline}
				$touch={provider.hasTouch()}
			>
				{Children.map(children, (child, index) => {
					return (
						isValidElement<CheckboxItemProps & { inline?: boolean }>(child) &&
						cloneElement(child, {
							id: `${inputWithSuffixName(optionIdPrefix)}${index}`,
							disabled: disabled,
							readonly: readonly,
							error: !!error || !!errorMessage,
							warning: !!warning || !!warningMessage,
							info: !!info || !!infoMessage,
							key: child.props.value,
							ariaDescribedby: joinClassNames(
								{ [`${id}-label`]: id && label },
								{ [`${id}-info`]: id && infoMessage },
								{ [`${id}-warning`]: id && warningMessage },
								{ [`${id}-error`]: id && errorMessage },
								{ [`${id}-helperText`]: id && helperText },
								ariaDescribedby
							),
							inline: inline,
							onChange: () => {
								if (onValueChanged) {
									onValueChanged(child.props.value);
								}
							},
							fitToParent: !inline,
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
						data-role={DataRoles.Checkbox.HelperText}
					>
						{helperText}
					</StyledBaseInput.StyledFieldHelperText>
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledCheckboxGroupField>
	);
}

CheckboxGroup.displayName = "CheckboxGroup";

export namespace CheckboxGroup {
	export function Item(props: CheckboxItemProps): ReactElement<CheckboxItemProps> {
		const { selected, onChange, ...rest } = props;

		return <Checkbox checked={selected || false} onChange={(value, event) => onChange?.(event)} {...rest} />;
	}

	Item.displayName = "CheckboxGroup.Item";
}
