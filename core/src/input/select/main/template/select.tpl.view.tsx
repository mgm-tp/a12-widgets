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
import { Children } from "react";

import { addPrefix, joinClassNames } from "../../../../common/main/utils.js";
import { InputElements } from "../../../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../../../base-input-styled/base.styled.js";

import { StyledSelectTemplate } from "../select.styled.js";

import type { SelectTemplateProps } from "./select.tpl.api.js";

const { StyledSelectArrow, StyledFieldSelectControl, StyledFieldSelectWrapper } = StyledSelectTemplate;

export const selectBaseFieldClassName = addPrefix("field__select");
export const baseFieldClassName = addPrefix("field");

export function SelectTemplate({
	breakTooltipsToNewLine,
	children,
	className,
	dataRole,
	disabled,
	error,
	errorMessage,
	fitToParent = true,
	helperText,
	helperTextRef,
	hideLabel,
	id,
	info,
	infoMessage,
	label,
	labelGraphic,
	labelRef,
	onSelectWrapperClick,
	onSelectWrapperKeyDown,
	readonly,
	selectWrapperDOMProps,
	selectWrapperRef,
	style,
	tooltips,
	warning,
	warningMessage
}: SelectTemplateProps): ReactElement<SelectTemplateProps> {
	const baseClassNames = joinClassNames(
		selectBaseFieldClassName,
		{ [`${selectBaseFieldClassName}--disabled`]: disabled },
		{ [`${selectBaseFieldClassName}--readonly`]: readonly }
	);

	const numberOfTooltips = Children.count(tooltips);
	const wrapperClassNames = joinClassNames(
		baseFieldClassName,
		{
			[`${baseFieldClassName}--tooltips ${baseFieldClassName}--tooltips-${numberOfTooltips}`]:
				numberOfTooltips && !breakTooltipsToNewLine
		},
		{ [`${baseFieldClassName}--block`]: fitToParent },
		className
	);

	const dataRolePrefix = dataRole || "select";

	return (
		<StyledBaseInput.StyledField
			className={wrapperClassNames}
			style={style}
			data-role={dataRolePrefix}
			$block={fitToParent}
			$disabled={disabled}
			$hasTooltips={!!(numberOfTooltips && !breakTooltipsToNewLine)}
			$numberOfTooltips={numberOfTooltips}
		>
			<InputElements.Label
				dataRole={`${dataRolePrefix}-label`}
				id={id}
				label={label}
				graphic={labelGraphic}
				hide={hideLabel}
				disabled={disabled}
				htmlFor={id}
				wrapperRef={labelRef}
			/>
			{breakTooltipsToNewLine && tooltips}
			{errorMessage && (
				<InputElements.Error dataRole={`${dataRolePrefix}-error-message`} id={id} errorMessage={errorMessage} />
			)}
			{warningMessage && (
				<InputElements.Warning dataRole={`${dataRolePrefix}-warning-message`} id={id} warningMessage={warningMessage} />
			)}
			{infoMessage && (
				<InputElements.Info dataRole={`${dataRolePrefix}-info-message`} id={id} infoMessage={infoMessage} />
			)}
			<StyledFieldSelectControl
				className={baseClassNames}
				data-role={`${dataRolePrefix}-control`}
				data-disabled={disabled}
				$readonly={readonly}
				$disabled={disabled}
			>
				<StyledFieldSelectWrapper
					ref={selectWrapperRef}
					className={joinClassNames(
						`${selectBaseFieldClassName}-wrapper`,
						{ [`${selectBaseFieldClassName}-wrapper--error`]: error || errorMessage },
						{ [`${selectBaseFieldClassName}-wrapper--warning`]: warning || warningMessage }
					)}
					$error={!!(error || errorMessage)}
					$warning={!!(warning || warningMessage)}
					$info={!!(info || infoMessage)}
					$readonly={readonly}
					$disabled={disabled}
					data-disabled={disabled}
					data-readonly={readonly}
					data-role={`${dataRolePrefix}-wrapper`}
					onClick={disabled || readonly ? undefined : onSelectWrapperClick}
					onKeyDown={disabled || readonly ? undefined : onSelectWrapperKeyDown}
					{...selectWrapperDOMProps}
				>
					{children}
					<StyledSelectArrow
						className={`${selectBaseFieldClassName}-arrow`}
						$disabled={disabled}
						$readonly={readonly}
						aria-hidden="true"
					/>
				</StyledFieldSelectWrapper>
				{!breakTooltipsToNewLine && tooltips}
			</StyledFieldSelectControl>
			{helperText && (
				<StyledBaseInput.StyledFieldHelperWrapper
					className={`${baseFieldClassName}__helper`}
					ref={helperTextRef}
					data-role={`${dataRolePrefix}-helper-text`}
				>
					<StyledBaseInput.StyledFieldHelperText className={`${baseFieldClassName}__helper-text`} htmlFor={id}>
						{helperText}
					</StyledBaseInput.StyledFieldHelperText>
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledBaseInput.StyledField>
	);
}

SelectTemplate.displayName = "SelectTemplate";
