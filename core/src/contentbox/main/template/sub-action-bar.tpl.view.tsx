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
import { styled, css } from "styled-components";

import { joinClassNames, addPrefix } from "../../../common/main/utils.js";
import { StyledFilterWrapper } from "../../../faceted-search/main/filter/filter.styled.js";
import {
	StyledFilterBarWrapper,
	StyledFilterBarContent
} from "../../../faceted-search/main/filter-bar/filter-bar.styled.js";
import { StyledMobileFilterBarWrapper } from "../../../faceted-search/main/filter-bar/filter-bar.mobile.styled.js";
import { StyledCounter } from "../../../counter/main/counter.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { SubActionBarTplProps } from "./sub-action-bar.tpl.api.js";

const baseClassName = addPrefix("contentbox__subheadingTransitionActionBar");

export const StyledSubActionBarTpl = styled.div`
	overflow: hidden;
`;

export const StyledSubActionBarItem = styled.div.withConfig({ displayName: "StyledSubActionBarItem-sc-" })<{
	$hidden?: boolean;
}>(({ theme, $hidden }) => {
	const { transitionActionBarItem, subHeading } = theme.components.contentBox;
	const { content } = theme.components.filterBar;

	return css`
		&:not(:empty) {
			background-color: ${transitionActionBarItem.background};
			padding: ${transitionActionBarItem.padding};
			position: relative;
			&:before,
			&:after {
				content: "";
				display: block;
				position: absolute;
				left: 0;
				right: 0;
			}
			&:before {
				border-top: ${transitionActionBarItem.borderTop};
				top: 0;
			}
			&:after {
				bottom: 0;
				border-bottom: ${transitionActionBarItem.borderBottom};
			}
		}
		&& > ${StyledMobileFilterBarWrapper}${StyledMobileFilterBarWrapper} {
			padding: ${subHeading.filterBar.mobile.padding};
			${StyledFilterBarContent} {
				padding-bottom: 0;
			}
			${StyledFilterWrapper},
			${StyledCounter} {
				margin-top: 0;
			}
		}

		& > ${StyledFilterBarWrapper} {
			&:not(${StyledMobileFilterBarWrapper}) {
				padding: 0;
				margin: -${content.spacingBottom} 0;
			}
		}

		${$hidden
			? css`
					margin-top: -100px;
					visibility: hidden;
					transition:
						margin-top 0.3s ease-in 0s,
						visibility 0.3s;
				`
			: css`
					transition: margin-top 0.3s ease-out;
				`}
	`;
});

export function SubActionBarTpl(props: SubActionBarTplProps): ReactElement<SubActionBarTplProps> {
	const { children, className, hidden, ...rest } = props;

	return (
		<StyledSubActionBarTpl
			className={joinClassNames(className, baseClassName)}
			{...rest}
			data-role={DataRoles.Contentbox.Subheading.TransitionActionBar}
		>
			<StyledSubActionBarItem
				$hidden={hidden}
				className={joinClassNames(
					`${baseClassName}-item`,
					{ [`${baseClassName}-item--show`]: !hidden },
					{ [`${baseClassName}-item--hide`]: hidden }
				)}
			>
				{children}
			</StyledSubActionBarItem>
		</StyledSubActionBarTpl>
	);
}

SubActionBarTpl.displayName = "SubActionBarTpl";
