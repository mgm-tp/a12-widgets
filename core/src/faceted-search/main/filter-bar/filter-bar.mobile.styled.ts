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

import { styled, css } from "styled-components";

import { StyledCounter } from "../../../counter/main/counter.view.js";
import { StyledButton } from "../../../button/main/button.styled.js";

import { StyledFilterContent, StyledFilterWrapper } from "../filter/filter.styled.js";

import { StyledFilterBarWrapper, StyledFilterBarContent, StyledFilterBarAction } from "./filter-bar.styled.js";

export const StyledMobileFilterBarWrapper = styled(StyledFilterBarWrapper).withConfig({
	displayName: "StyledMobileFilterBarWrapper-sc-"
})<{ disabled?: boolean }>(({ theme, disabled }) => {
	const { counter } = theme.components.filterBar.mobile;

	return css`
		align-items: center;

		${StyledFilterWrapper} {
			flex-basis: 50%;
			flex-grow: 1;
			overflow: hidden;
		}

		${StyledFilterContent} {
			flex-grow: 1;
		}

		${StyledCounter} {
			margin: ${counter.margin};

			${disabled &&
			css`
				background: ${counter.disabled.background};
				color: ${counter.disabled.color};
			`}
		}
	`;
});

export const StyledMobileFilterBarContent = styled(StyledFilterBarContent).withConfig({
	displayName: "StyledMobileFilterBarContent-sc-"
})`
	flex-wrap: nowrap;
	overflow: hidden;

	${StyledFilterContent} {
		outline-offset: -1px;
	}
`;

export const StyledMobileFilterBarAction = styled(StyledFilterBarAction).withConfig({
	displayName: "StyledMobileFilterBarAction-sc-"
})`
	flex-grow: 1;
	justify-content: flex-end;
	min-height: 0;
	padding: 0;
	width: auto;

	${StyledButton} {
		&:focus {
			outline-offset: -1px;
		}
	}
`;
