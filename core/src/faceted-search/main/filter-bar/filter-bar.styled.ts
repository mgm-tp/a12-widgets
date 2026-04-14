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

import { Button } from "../../../button/main/button.view.js";
import { active as activeFn, hover } from "../../../theme/base/mixins/_interaction.js";

export const StyledFilterBarWrapper = styled.div.withConfig({ displayName: "StyledFilterBarWrapper-sc-" })(
	({ theme }) => {
		const { filterBar } = theme.components;

		return css`
			background-color: ${filterBar.background};
			display: flex;
			overflow-x: hidden;
			overflow-y: auto;
			padding: ${filterBar.padding};
		`;
	}
);

export const StyledFilterBarContent = styled.div.withConfig({ displayName: "StyledFilterBarContent-sc-" })<{
	mobile?: boolean;
	collapsed?: boolean;
}>(({ theme, mobile }) => {
	const { content } = theme.components.filterBar;

	return css`
		align-items: center;
		display: flex;
		flex-grow: 1;
		flex-wrap: wrap;
		max-height: ${content.maxHeight};
		min-width: 0;
		padding: ${content.padding};
		&:empty {
			display: none;
		}

		${!mobile &&
		css`
			padding-bottom: 0;
			&:after {
				content: "";
				height: ${content.spacingBottom};
				width: 100%;
			}
		`}
	`;
});

export const StyledFilterBarAction = styled.div.withConfig({ displayName: "StyledFilterBarAction-sc-" })(
	({ theme }) => {
		const { action } = theme.components.filterBar;

		return css`
			display: flex;
			flex: none;
			justify-content: center;
			min-height: ${action.minHeight};
			padding: ${action.padding};
			position: sticky;
			top: 0;
			width: ${action.width};
		`;
	}
);

export const StyledFilterBarActionButton = styled(Button).withConfig({
	displayName: "StyledFilterBarActionButton-sc-"
})<{
	collapsed?: boolean;
}>(({ collapsed, disabled }) => {
	return css`
		align-self: flex-end;

		${collapsed &&
		css`
			align-self: center;
		`}
		${!disabled &&
		css`
			${activeFn(css`
				color: unset;
			`)}

			${hover(css`
				color: unset;
			`)}
			
			&:focus {
				color: unset;
			}
		`}
	`;
});
