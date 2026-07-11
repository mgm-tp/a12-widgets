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

import type { ReactNode, ReactElement } from "react";
import { useContext, useCallback, Children, Fragment, useRef } from "react";

import { Icon } from "../../../icon/main/icon.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { joinClassNames, addPrefix } from "../../../common/main/utils.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { useInteractionHint } from "../../../interaction-hint/main/use-interaction-hint.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { FilterContext } from "../filter-bar/filter-context.js";

import {
	StyledFilterOptions,
	StyledFilterWrapper,
	StyledFilterContent,
	StyledFilterContentInner,
	StyledFilterName,
	StyledFilterNameText,
	StyledFilterAction,
	StyledFilterActionButton,
	StyledFilterPrefix,
	StyledFilterNameArrow
} from "./filter.styled.js";
import type { FilterProps } from "./filter.api.js";

const baseClassName = addPrefix("filter");

export function Filter(props: FilterProps): ReactElement<FilterProps> {
	const { active, disabled: disabledProp, onFocus, onClick } = props;
	const { disabled: disabledContext } = useContext(FilterContext);
	const disabled = disabledContext ?? disabledProp;

	const classNames = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--active`]: active },
		{ [`${baseClassName}--disabled`]: disabled },
		props.className
	);

	const filterTitles = useContext<A11yDefinition>(A11YLanguageContext).filterTitles;

	const filterContentRef = useRef<HTMLButtonElement | null>(null);

	const ids = props.id
		? {
				filterNameText: `${props.id}-name-text`,
				actionButtonHiddenText: `${props.id}-action-button-hidden-text`
			}
		: undefined;

	const actionButtonLinkedTexts = ids && `${ids.actionButtonHiddenText} ${ids.filterNameText}`;

	const isCompact = props.compact;

	const { title: resolvedTitle, hintRenderer } = useInteractionHint({
		title: isCompact ? String(props.name) : undefined,
		componentKey: "filter",
		referenceElementRef: filterContentRef,
		focusable: !disabled
	});

	const renderOptions = useCallback((): ReactNode => {
		if (!props.options) {
			return null;
		}

		const options = Children.toArray(props.options);

		return (
			<>
				{filterTitles?.selectedOption && <HiddenText>{filterTitles.selectedOption}</HiddenText>}
				<StyledFilterOptions
					className={`${baseClassName}__options`}
					data-role={DataRoles.Filter.Options}
					$active={active}
					$disabled={disabled}
					$compact={isCompact}
				>
					{options.map((option, index) => (
						<Fragment key={index}>
							{option}
							{index < options.length - 1 && (props.separator ?? ", ")}
						</Fragment>
					))}
				</StyledFilterOptions>
				{isCompact && !!hintRenderer && <HiddenText>{props.name}</HiddenText>}
			</>
		);
	}, [
		props.options,
		props.name,
		props.separator,
		filterTitles?.selectedOption,
		active,
		disabled,
		isCompact,
		hintRenderer
	]);

	return (
		<StyledFilterWrapper
			id={props.id}
			className={classNames}
			ref={props.filterRef}
			style={props.style}
			data-role={DataRoles.Filter}
			$active={active}
			$disabled={disabled}
		>
			<StyledFilterContent
				ref={filterContentRef}
				className={`${baseClassName}__content`}
				title={resolvedTitle}
				onClick={disabled ? undefined : onClick}
				onFocus={disabled ? undefined : onFocus}
				aria-expanded={props.ariaExpanded}
				data-role={DataRoles.Filter.Content}
				disabled={disabled}
				$active={active}
				$disabled={disabled}
				$hasPrefix={!!props.prefix}
			>
				{props.prefix && <StyledFilterPrefix data-role={DataRoles.Filter.Prefix}>{props.prefix}</StyledFilterPrefix>}
				<StyledFilterContentInner className={`${baseClassName}__content-inner`} $compact={isCompact}>
					{((isCompact && !props.options) || !isCompact) && (
						<StyledFilterName
							className={`${baseClassName}__name`}
							data-role={DataRoles.Filter.Name}
							$disabled={disabled}
							$compact={isCompact}
						>
							{filterTitles?.filterName && <HiddenText>{filterTitles.filterName}</HiddenText>}
							<StyledFilterNameText
								id={ids?.filterNameText}
								className={`${baseClassName}__name-text`}
								data-role={DataRoles.Filter.Name.Text}
							>
								{props.name}
							</StyledFilterNameText>
							{!isCompact && <StyledFilterNameArrow $disabled={disabled} className={`${baseClassName}__name-arrow`} />}
						</StyledFilterName>
					)}
					{renderOptions()}
					{isCompact && <Icon className={`${baseClassName}__name-arrow`}>keyboard_arrow_down</Icon>}
				</StyledFilterContentInner>
			</StyledFilterContent>
			{!props.nonRemovable && (
				<StyledFilterAction className={`${baseClassName}__action`} data-role={DataRoles.Filter.Action}>
					{props.customAction || (
						<StyledFilterActionButton
							className={`${baseClassName}__action-button`}
							title={filterTitles?.actionButton}
							icon={<Icon>close</Icon>}
							onClick={disabled ? undefined : props.onClose}
							disabled={disabled}
							buttonAttributes={{ "aria-labelledby": actionButtonLinkedTexts }}
						>
							{ids && filterTitles?.actionButtonHiddenText && (
								<HiddenText id={ids.actionButtonHiddenText}>{filterTitles.actionButtonHiddenText}</HiddenText>
							)}
						</StyledFilterActionButton>
					)}
				</StyledFilterAction>
			)}
			{hintRenderer?.()}
		</StyledFilterWrapper>
	);
}

Filter.displayName = "Filter";
