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

import { StringUtils, Range, joinClassNames, addPrefix } from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";
import { Select } from "../../input/select/main/select.view.js";
import type { SelectItem } from "../../input/select/main/select.api.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { PaginationProps } from "./pagination.api.js";
import { StyledPaginationWrapper } from "./pagination.styled.js";

export function DefaultPagination(props: PaginationProps): ReactElement<PaginationProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const classNames = joinClassNames(addPrefix("pagination"), props.className);
	const items: SelectItem[] = Array.from(new Range(1, props.pageCount + 1)).map((item) => ({
		label: StringUtils.format(props.pageLabelTemplate, {
			page: item,
			total: props.pageCount
		}),
		value: `${item}`
	}));
	const disabledPreviousBtn = props.disabled || props.currentPage === 1;
	const disabledNextBtn = props.disabled || props.currentPage === props.pageCount;

	return (
		<StyledPaginationWrapper
			className={classNames}
			role="navigation"
			data-role={DataRoles.Pagination}
			style={props.style}
			id={props.id}
			$alignment={props.alignment}
			$disabled={props.disabled}
		>
			<Button
				buttonAttributes={{ "aria-disabled": disabledPreviousBtn }}
				tabIndex={disabledPreviousBtn ? -1 : 0}
				icon={<Icon>first_page</Icon>}
				onClick={() => {
					!disabledPreviousBtn && props.onPageChanged(1);
				}}
				title={languageContext.paginationTitles && languageContext.paginationTitles.firstPage}
				data-role={DataRoles.Pagination.Action}
			/>
			<Button
				buttonAttributes={{ "aria-disabled": disabledPreviousBtn }}
				tabIndex={disabledPreviousBtn ? -1 : 0}
				icon={<Icon>navigate_before</Icon>}
				onClick={() => {
					!disabledPreviousBtn && props.onPageChanged(props.currentPage - 1);
				}}
				title={languageContext.paginationTitles && languageContext.paginationTitles.previousPage}
				{...props.previousButtonProps}
				data-role={DataRoles.Pagination.Action}
			/>
			<Select
				value={`${props.currentPage}`}
				disabled={props.disabled}
				onValueChanged={(value) => {
					props.onPageChanged(Number(value));
				}}
				label={languageContext.paginationTitles && languageContext.paginationTitles.selectedPage}
				hideLabel
				id={props.id && `${props.id}-select`}
				items={items}
			/>
			<Button
				buttonAttributes={{ "aria-disabled": disabledNextBtn }}
				tabIndex={disabledNextBtn ? -1 : 0}
				icon={<Icon>navigate_next</Icon>}
				onClick={() => {
					!disabledNextBtn && props.onPageChanged(props.currentPage + 1);
				}}
				title={languageContext.paginationTitles && languageContext.paginationTitles.nextPage}
				{...props.nextButtonProps}
				data-role={DataRoles.Pagination.Action}
			/>
			<Button
				buttonAttributes={{ "aria-disabled": disabledNextBtn }}
				tabIndex={disabledNextBtn ? -1 : 0}
				icon={<Icon>last_page</Icon>}
				onClick={() => {
					!disabledNextBtn && props.onPageChanged(props.pageCount);
				}}
				title={languageContext.paginationTitles && languageContext.paginationTitles.lastPage}
				data-role={DataRoles.Pagination.Action}
			/>
		</StyledPaginationWrapper>
	);
}

DefaultPagination.displayName = "DefaultPagination";
