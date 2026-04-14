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

import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { InputElements } from "../base/template/base.tpl.view.js";
import { StyledBaseInput } from "../base-input-styled/base.styled.js";

import { MonthSelector } from "./month-selector.view.js";
import type { YearMonthSelectorProps } from "./year-month-selector.api.js";
import { StyledYearMonthSelector, StyledYearMonthSelectorInner } from "./year-month-selector.styled.js";
import { YearSelector } from "./year-selector.view.js";

const baseClassName = addPrefix("year-month-selector");
const baseFieldClassName = addPrefix("field");

export function YearMonthSelector(props: YearMonthSelectorProps): ReactElement<YearMonthSelectorProps> {
	const numberOfTooltips = Children.count(props.tooltips);
	const className = joinClassNames(
		baseClassName,
		{
			[`${baseFieldClassName}--tooltips ${baseFieldClassName}--tooltips-${numberOfTooltips}`]:
				numberOfTooltips && !props.breakTooltipsToNewLine
		},
		props.className
	);

	const ariaDescribedby = joinClassNames(
		{ [`${props.id}-warning`]: props.id && props.warningMessage },
		{ [`${props.id}-error`]: props.id && props.errorMessage },
		props.ariaDescribedby
	);

	return (
		<StyledYearMonthSelector
			data-role={DataRoles.Year.Month.Selector}
			className={className}
			id={props.id}
			style={props.style}
			$numberOfTooltips={!props.breakTooltipsToNewLine && numberOfTooltips ? numberOfTooltips : undefined}
		>
			<InputElements.Label
				dataRole={DataRoles.Year.Month.Selector.Label}
				id={props.id}
				label={props.label}
				graphic={props.labelGraphic}
				disabled={props.disabled}
				htmlFor={props.id && `${props.id}-month`}
			/>
			{props.breakTooltipsToNewLine && props.tooltips}
			{props.errorMessage && (
				<InputElements.Error
					dataRole={DataRoles.Year.Month.Selector.ErrorMessage}
					id={props.id}
					errorMessage={props.errorMessage}
				/>
			)}
			{props.warningMessage && (
				<InputElements.Warning
					dataRole={DataRoles.Year.Month.Selector.WarningMessage}
					id={props.id}
					warningMessage={props.warningMessage}
				/>
			)}
			{props.infoMessage && (
				<InputElements.Info
					dataRole={DataRoles.Year.Month.Selector.InfoMessage}
					id={props.id}
					infoMessage={props.infoMessage}
				/>
			)}
			<StyledYearMonthSelectorInner
				className={`${baseClassName}__inner`}
				data-role={DataRoles.Year.Month.Selector.Control}
			>
				<MonthSelector
					id={props.id && `${props.id}-month`}
					month={props.month}
					months={props.months}
					onMonthChange={(month) => props.onValueChange?.(month, props.year)}
					disabled={props.disabled}
					readonly={props.readonly}
					error={props.invalidComponent !== "year" && (props.error || !!props.errorMessage)}
					warning={props.invalidComponent !== "year" && (props.warning || !!props.warningMessage)}
					info={props.invalidComponent !== "year" && (props.info || !!props.infoMessage)}
					label={props.hiddenLabels && props.hiddenLabels.monthLabel}
					hideLabel
					monthSelectRef={props.monthSelectRef}
					ariaDescribedby={ariaDescribedby}
					inputProps={props.inputPropsOfMonthSelector}
					optionalItem={props.optionalMonthItem}
				/>
				<YearSelector
					id={props.id && `${props.id}-year`}
					year={props.year}
					onYearChange={(year) => props.onValueChange?.(props.month, year)}
					yearRange={props.yearRange}
					disabled={props.disabled}
					readonly={props.readonly}
					error={props.invalidComponent !== "month" && (props.error || !!props.errorMessage)}
					warning={props.invalidComponent !== "month" && (props.warning || !!props.warningMessage)}
					info={props.invalidComponent !== "month" && (props.info || !!props.infoMessage)}
					tooltips={!props.breakTooltipsToNewLine ? props.tooltips : undefined}
					label={props.hiddenLabels && props.hiddenLabels.yearLabel}
					hideLabel
					yearSelectRef={props.yearSelectRef}
					ariaDescribedby={ariaDescribedby}
					inputProps={props.inputPropsOfYearSelector}
					optionalItem={props.optionalYearItem}
				/>
			</StyledYearMonthSelectorInner>
			{props.helperText && (
				<StyledBaseInput.StyledFieldHelperWrapper className={`${baseFieldClassName}__helper`}>
					<StyledBaseInput.StyledFieldHelperText
						className={`${baseFieldClassName}__helper-text`}
						htmlFor={props.id && `${props.id}-month`}
						data-role={DataRoles.Year.Month.Selector.HelperText}
					>
						{props.helperText}
					</StyledBaseInput.StyledFieldHelperText>
				</StyledBaseInput.StyledFieldHelperWrapper>
			)}
		</StyledYearMonthSelector>
	);
}

YearMonthSelector.displayName = "YearMonthSelector";
