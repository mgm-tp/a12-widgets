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

import { joinClassNames, StringUtils, addPrefix } from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { PaginationProps } from "./pagination.api.js";
import {
	StyledPaginationWrapper,
	StyledSimplePaginationAction,
	StyledSimplePaginationLabel
} from "./pagination.styled.js";

const baseClassName = addPrefix("simple-pagination");

export function SimplePagination(props: PaginationProps): ReactElement<PaginationProps> {
	const classNames = joinClassNames(baseClassName, props.className);
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const disabledNextBtn = props.disabled || props.currentPage === props.pageCount;
	const disabledPreviousBtn = props.disabled || props.currentPage === 1;

	return (
		<StyledPaginationWrapper
			className={classNames}
			role="navigation"
			data-role={DataRoles.SimplePagination}
			style={props.style}
			id={props.id}
			$alignment={props.alignment}
			$disabled={props.disabled}
			$simple
		>
			<StyledSimplePaginationAction
				className={`${baseClassName}__action`}
				data-role={DataRoles.SimplePagination.Action}
				$disabled={disabledPreviousBtn}
				buttonAttributes={{ "aria-disabled": disabledPreviousBtn }}
				icon={<Icon className={`${baseClassName}__icon`}>arrow_left</Icon>}
				onClick={() => {
					!disabledPreviousBtn && props.onPageChanged(props.currentPage - 1);
				}}
				tabIndex={disabledPreviousBtn ? -1 : 0}
				title={languageContext.paginationTitles?.previousPage}
				{...props.previousButtonProps}
			/>
			<StyledSimplePaginationLabel className={`${baseClassName}__label`} data-role={DataRoles.SimplePagination.Label}>
				{StringUtils.format(props.pageLabelTemplate, {
					page: props.currentPage,
					total: props.pageCount
				})}
			</StyledSimplePaginationLabel>
			<StyledSimplePaginationAction
				className={`${baseClassName}__action`}
				data-role={DataRoles.SimplePagination.Action}
				$disabled={disabledNextBtn}
				icon={<Icon className={`${baseClassName}__icon`}>arrow_right</Icon>}
				onClick={() => {
					!disabledNextBtn && props.onPageChanged(props.currentPage + 1);
				}}
				buttonAttributes={{ "aria-disabled": disabledNextBtn }}
				title={languageContext.paginationTitles?.nextPage}
				tabIndex={disabledNextBtn ? -1 : 0}
				{...props.nextButtonProps}
			/>
		</StyledPaginationWrapper>
	);
}

SimplePagination.displayName = "SimplePagination";
