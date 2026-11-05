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

export const StyledDialog = styled.div.withConfig({ displayName: "StyledMarkdownDialog-sc-" })(({ theme }) => {
	const { colors, applicationStyles, spacing } = theme;

	return css`
		background-color: ${colors.background.primaryBackground};
		border-radius: ${applicationStyles.input.borderRadius};
		box-shadow: 0 8px 24px 0 ${colors.boxShadowBackground};
		display: flex;
		flex-direction: column;
		gap: ${spacing.verticalSpacing.vertWhiteSpacingsm}px;
		min-width: 20rem;
		max-width: 32rem;
		padding: ${spacing.verticalSpacing.vertWhiteSpacingmd}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px;
	`;
});

export const StyledDialogHeading = styled.h2.withConfig({ displayName: "StyledMarkdownDialogHeading-sc-" })(
	({ theme }) => css`
		color: ${theme.colors.text.headlineColor};
		font-size: ${theme.typography.fontSize.lgFontSize};
		font-weight: ${theme.typography.fontWeight.boldFontWeight};
		margin: 0;
	`
);

export const StyledDialogBody = styled.div.withConfig({ displayName: "StyledMarkdownDialogBody-sc-" })(
	({ theme }) => css`
		display: flex;
		flex-direction: column;
		gap: ${theme.spacing.verticalSpacing.vertWhiteSpacingsm}px;
	`
);

export const StyledDialogError = styled.p.withConfig({ displayName: "StyledMarkdownDialogError-sc-" })(
	({ theme }) => css`
		color: ${theme.colors.variant.errorColor};
		font-size: ${theme.typography.fontSize.smallFontSize};
		margin: 0;
	`
);

export const StyledDialogFooter = styled.div.withConfig({ displayName: "StyledMarkdownDialogFooter-sc-" })(
	({ theme }) => css`
		align-items: center;
		display: flex;
		gap: ${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		justify-content: flex-end;
		margin-top: ${theme.spacing.verticalSpacing.vertWhiteSpacingsm}px;
	`
);
