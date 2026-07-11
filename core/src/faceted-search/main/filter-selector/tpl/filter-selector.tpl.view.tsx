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
import { useContext } from "react";

import { TextField } from "../../../../input/text-field/main/template/text-field.tpl.view.js";
import { Button } from "../../../../button/main/button.view.js";
import { Icon } from "../../../../icon/main/icon.view.js";
import { ContentBoxElements } from "../../../../contentbox/main/template/contentbox.tpl.view.js";
import { joinClassNames, addPrefix } from "../../../../common/main/utils.js";
import type { A11yDefinition } from "../../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { StyledContentBoxContext } from "../../../../contentbox/main/template/contentbox.context.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import {
	StyledFilterSelectorWrapper,
	StyledFilterSelectorBody,
	StyledFilterSelectorContent,
	StyledFilterSelectorFooter,
	StyledFilterSelectorContainer,
	StyledFilterSelectorActionBar,
	StyledFilterSelectorActionElement,
	StyledFilterSelectorSectionTitle,
	StyledFilterSelectorList,
	StyledFilterSelectorItem
} from "../filter.selector.styled.js";

import type { FilterSelectorTemplateProps } from "./filter-selector.tpl.api.js";

const baseClassName = addPrefix("filter-selector");

export function FilterSelectorTemplate(props: FilterSelectorTemplateProps): ReactElement<FilterSelectorTemplateProps> {
	const filterSelectorTitles = useContext<A11yDefinition>(A11YLanguageContext).filterSelectorTitles;

	return (
		<StyledFilterSelectorWrapper
			ref={props.wrapperRef}
			onClick={props.onClick}
			onKeyDown={props.onKeyDown}
			onMouseLeave={props.onMouseLeave}
			style={{ ...props.style }}
			className={joinClassNames(baseClassName, props.className)}
			id={props.id}
			role="dialog"
			aria-label={filterSelectorTitles?.ariaLabel}
			data-role={DataRoles.FilterSelector}
		>
			<StyledFilterSelectorBody className={`${baseClassName}__body`}>
				{props.primaryContent && (
					<StyledFilterSelectorContent
						contentType="primary"
						className={`${baseClassName}__content ${baseClassName}__content--primary`}
						role="region"
						aria-labelledby={props.primaryHeaderAriaLabelledby}
						data-role={DataRoles.FilterSelector.Content.Primary}
					>
						{props.primaryContent}
					</StyledFilterSelectorContent>
				)}
				{props.secondaryContent && (
					<StyledFilterSelectorContent
						contentType="secondary"
						ref={props.secondaryRef}
						className={`${baseClassName}__content ${baseClassName}__content--secondary`}
						role="region"
						aria-label={filterSelectorTitles?.secondaryContainerAriaLabel}
						data-role={DataRoles.FilterSelector.Content.Secondary}
					>
						{props.secondaryContent}
					</StyledFilterSelectorContent>
				)}
			</StyledFilterSelectorBody>
			{props.footerContent && (
				<StyledFilterSelectorFooter
					className={`${baseClassName}__footer`}
					ref={props.footerRef}
					data-role={DataRoles.FilterSelector.Footer}
				>
					<StyledContentBoxContext.Provider value={{ embedded: false }}>
						<ContentBoxElements.Footer>{props.footerContent}</ContentBoxElements.Footer>
					</StyledContentBoxContext.Provider>
				</StyledFilterSelectorFooter>
			)}
		</StyledFilterSelectorWrapper>
	);
}

FilterSelectorTemplate.displayName = "FilterSelectorTemplate";

export namespace FilterSelectorTemplate {
	export function List(
		props: FilterSelectorTemplateProps.ListProps
	): ReactElement<FilterSelectorTemplateProps.ListProps> {
		const { className, ...rest } = props;
		const classNames = joinClassNames(`${baseClassName}__list`, className);

		return (
			<StyledFilterSelectorList
				className={classNames}
				tabIndex={-1}
				{...rest}
				dataRole={DataRoles.FilterSelector.List}
			/>
		);
	}

	export function Item(
		props: FilterSelectorTemplateProps.ItemProps
	): ReactElement<FilterSelectorTemplateProps.ItemProps> {
		return (
			<StyledFilterSelectorItem
				divider
				text={props.children}
				{...props}
				dataRole={DataRoles.FilterSelector.List.Item}
			/>
		);
	}

	export function Section(
		props: FilterSelectorTemplateProps.SectionProps
	): ReactElement<FilterSelectorTemplateProps.SectionProps> {
		const HtmlTag = props.useDivTag ? "div" : "li";

		return (
			<StyledFilterSelectorSectionTitle
				as={HtmlTag}
				className={joinClassNames(addPrefix("form__sectionTitle"), addPrefix("h_zeroMargin"), props.className)}
				id={props.id}
				style={props.style}
				data-role={DataRoles.FilterSelector.Section}
			>
				{props.children}
			</StyledFilterSelectorSectionTitle>
		);
	}

	export function Content(
		props: FilterSelectorTemplateProps.ContentProps
	): ReactElement<FilterSelectorTemplateProps.ContentProps> {
		const { children, className, ...rest } = props;

		return (
			<StyledFilterSelectorContainer className={joinClassNames(`${baseClassName}__container`, className)} {...rest}>
				{children}
			</StyledFilterSelectorContainer>
		);
	}

	export function ActionBar(
		props: FilterSelectorTemplateProps.ActionBarProps
	): ReactElement<FilterSelectorTemplateProps.ActionBarProps> {
		const { className, ...rest } = props;

		return (
			<StyledFilterSelectorActionBar
				className={joinClassNames(`${baseClassName}__action-bar`, className)}
				{...rest}
				data-role={DataRoles.FilterSelector.ActionBar}
			/>
		);
	}

	export function SearchInput(
		props: FilterSelectorTemplateProps.SearchInputProps
	): ReactElement<FilterSelectorTemplateProps.SearchInputProps> {
		const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
		const { className, value, searchButton, clearButton, onClearButtonClick, ...rest } = props;
		const tabIndex = props.disabled || !props.value ? -1 : undefined;
		const clearButtonElement =
			value &&
			(clearButton || (
				<Button
					destructive
					tabIndex={tabIndex}
					disabled={props.disabled}
					icon={<Icon>clear</Icon>}
					onClick={onClearButtonClick}
					title={languageContext.filterSelectorTitles?.clearButtonTitle}
				/>
			));
		const searchIcon = searchButton || <Icon>search</Icon>;

		return (
			<TextField
				className={joinClassNames(`${baseClassName}__search`, className)}
				suffixes={[clearButtonElement, searchIcon]}
				value={value}
				{...rest}
			/>
		);
	}

	export function ActionElement(
		props: FilterSelectorTemplateProps.ActionElementProps
	): ReactElement<FilterSelectorTemplateProps.ActionElementProps> {
		const { className, ...rest } = props;

		return (
			<StyledFilterSelectorActionElement
				className={joinClassNames(`${baseClassName}__action-element`, className)}
				{...rest}
				data-role={DataRoles.FilterSelector.ActionElement}
			/>
		);
	}
}
