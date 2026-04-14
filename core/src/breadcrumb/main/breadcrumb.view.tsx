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
import { Children, useContext, isValidElement, cloneElement } from "react";

import { Icon } from "../../icon/main/icon.view.js";
import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/index.js";

import {
	StyledBreadcrumb,
	StyledBreadcrumbContent,
	StyledBreadcrumbSeparator,
	StyledBreadcrumbItem,
	StyledBreadCrumbWrapper
} from "./breadcrumb.styled.js";
import type { BreadcrumbProps } from "./breadcrumb.api.js";

const baseClassName = addPrefix("breadcrumb");

export function Breadcrumb(props: BreadcrumbProps): ReactElement<BreadcrumbProps> {
	const { id, style, className, children, separator } = props;
	const separatorClassName = `${baseClassName}__separator`;
	const classNames = joinClassNames(baseClassName, className);
	const childrenLength = Children.count(children);

	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const ariaLabel = languageContext.breadcrumbTitles?.ariaLabel;

	return (
		<StyledBreadCrumbWrapper
			className={`${baseClassName}-wrapper`}
			role="navigation"
			aria-label={ariaLabel}
			data-role={DataRoles.Breadcrumb}
		>
			<StyledBreadcrumb id={id} className={classNames} style={style} data-role={DataRoles.Breadcrumb.List}>
				{Children.map(children, (item, index) => {
					return (
						isValidElement<BreadcrumbProps.ItemProps>(item) &&
						cloneElement(item, {
							children: (
								<>
									{item.props.currentPage && languageContext.breadcrumbTitles?.currentPageTitle && (
										<HiddenText>{languageContext.breadcrumbTitles?.currentPageTitle}</HiddenText>
									)}
									<StyledBreadcrumbContent
										className={`${baseClassName}__content`}
										aria-current={item.props.currentPage && "page"}
										data-role={DataRoles.Breadcrumb.Content}
									>
										{item.props.children}
									</StyledBreadcrumbContent>
									{index < childrenLength - 1 && (
										<StyledBreadcrumbSeparator
											className={separatorClassName}
											data-role={DataRoles.Breadcrumb.Separator}
										>
											{separator || <Icon className={`${separatorClassName}-icon`}>chevron_right</Icon>}
										</StyledBreadcrumbSeparator>
									)}
								</>
							)
						})
					);
				})}
			</StyledBreadcrumb>
		</StyledBreadCrumbWrapper>
	);
}

Breadcrumb.displayName = "Breadcrumb";

export namespace Breadcrumb {
	export function Item(
		props: BreadcrumbProps.ItemProps,
		key?: number | string
	): ReactElement<BreadcrumbProps.ItemProps> {
		const { id, style, className, children } = props;
		const classNames = joinClassNames(`${baseClassName}__item`, className);

		return (
			<StyledBreadcrumbItem
				key={key}
				id={id}
				className={classNames}
				style={style}
				data-role={DataRoles.Breadcrumb.Item}
			>
				{children}
			</StyledBreadcrumbItem>
		);
	}

	Item.displayName = "Breadcrumb.Item";
}
