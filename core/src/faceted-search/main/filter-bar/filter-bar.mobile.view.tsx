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

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/index.js";

import type { FilterBarMobileProps } from "./filter-bar.api.js";
import {
	StyledMobileFilterBarWrapper,
	StyledMobileFilterBarContent,
	StyledMobileFilterBarAction
} from "./filter-bar.mobile.styled.js";
import { FilterContext } from "./filter-context.js";

const baseClassName = addPrefix("filter-bar");

export function FilterBarMobile(props: FilterBarMobileProps): ReactElement<FilterBarMobileProps> {
	const { children, actions, className, disabled, ...rest } = props;
	const classNames = joinClassNames(
		baseClassName,
		`${baseClassName}--mobile`,
		{ [`${baseClassName}--disabled`]: disabled },
		className
	);

	return (
		<StyledMobileFilterBarWrapper disabled={disabled} className={classNames} {...rest} data-role={DataRoles.Filterbar}>
			<StyledMobileFilterBarContent
				$mobile
				className={`${baseClassName}__content`}
				data-role={DataRoles.Filterbar.Content}
			>
				<FilterContext value={{ disabled: props.disabled }}>{props.children}</FilterContext>
			</StyledMobileFilterBarContent>
			<StyledMobileFilterBarAction className={`${baseClassName}__action`} data-role={DataRoles.Filterbar.Action}>
				{actions}
			</StyledMobileFilterBarAction>
		</StyledMobileFilterBarWrapper>
	);
}

FilterBarMobile.displayName = "FilterBarMobile";
