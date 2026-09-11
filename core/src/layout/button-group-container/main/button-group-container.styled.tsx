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

import { css, styled } from "styled-components";

import { List } from "../../../list/main/list.view.js";
import { StyledButtonGroup } from "../../../button-group/main/button-group.view.js";
import { StyledButton } from "../../../button/main/button.styled.js";

export const StyledButtonGroupContainer = styled.div.withConfig({ displayName: "StyledButtonGroupContainer-sc-" })`
	display: flex;
	flex-grow: 1;
	max-width: 100%;
	gap: ${(props) => props.theme.components.buttonGroup.gap};
`;

export const StyledButtonGroupResponsiveContainer = styled(StyledButtonGroupContainer)<{
	$fitVisibleContentWidth?: boolean;
}>(({ $fitVisibleContentWidth }) => {
	return css`
		flex-shrink: 1;
		flex-wrap: nowrap;
		min-width: 0;
		max-width: ${$fitVisibleContentWidth && "max-content"};

		& ${StyledButtonGroup} {
			flex-shrink: 0;
		}
		& ${StyledButton} {
			white-space: nowrap;
		}
	`;
});

export const StyledButtonGroupContainerList = styled(List)(
	({ theme }) => `
		text-transform: ${theme.components.button.textTransform};
	`
);
