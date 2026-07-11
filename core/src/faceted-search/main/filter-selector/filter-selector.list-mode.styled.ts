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

import { DataRoles } from "../../../common/main/data-roles.js";
import { Typography } from "../../../typography/main/typography.view.js";

export const StyledFilterSelectorListModeWrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
`;

export const StyledFilterSelectorListMode = styled.div`
	flex: 1;
	overflow-y: auto;
`;

export const StyledFilterSelectorListSection = styled(Typography.Section)<{
	$showHeaderActions?: boolean;
	$collapsed?: boolean;
}>(({ $showHeaderActions }) => {
	return css`
		${$showHeaderActions &&
		css`
			[data-role="${DataRoles.Typography.Headline.HeaderActions}"] {
				opacity: 1;
			}
		`}

		[data-role="${DataRoles.Typography.Body}"] {
			padding: 0 12px;
		}

		[data-role="${DataRoles.Typography.Body}"],
		[data-role="${DataRoles.Typography.Headline}"] {
			margin-top: 0;
			margin-bottom: 0;
			padding-top: 0;
			padding-bottom: 0;
		}
	`;
});

export const StyledFilterSelectorListGroupHeadline = styled(Typography.Headline)(({ theme }) => {
	const {
		components: { filterSelector },
		spacing: { verticalSpacing },
		typography
	} = theme;

	return css`
		color: ${filterSelector.filterSelectorList.sectionHeadlineColor};
		padding: 0;
		margin: ${verticalSpacing.vertWhiteSpacingsm}px 0 0;
		font-size: ${typography.fontSize.smallFontSize};
	`;
});

export const StyledFilterSelectorListDivider = styled.div<{ $collapsed?: boolean }>(({ theme, $collapsed }) => {
	const { divider } = theme.colors;
	const { spacing } = theme.spacing;
	const { filterSelectorList } = theme.components.filterSelector;

	return css`
		border-bottom: 1px solid ${divider.color};
		margin: ${$collapsed
			? `0 ${spacing.spacingSm}px`
			: `${filterSelectorList.dividerTopMarginExpanded} ${spacing.spacingSm}px ${spacing.spacingSm}px`};
	`;
});

export const StyledFilterSelectorListGroupDivider = styled.div<{ $collapsed?: boolean }>(({ theme, $collapsed }) => {
	const { divider } = theme.colors;

	return css`
		border-bottom: 1px solid ${divider.colorDark};

		${!$collapsed &&
		css`
			margin: ${theme.spacing.spacing.spacingMd}px 0 ${theme.spacing.spacing.spacingMd}px;
		`}
	`;
});

export const StyledFilterSelectorListWrapper = styled.div``;
