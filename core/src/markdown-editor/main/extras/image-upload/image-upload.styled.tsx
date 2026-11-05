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

import { css, keyframes, styled } from "styled-components";

export const StyledUploadDialog = styled.div.withConfig({ displayName: "StyledMarkdownUploadDialog-sc-" })(
	({ theme }) => {
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
	}
);

export const StyledUploadDialogHeading = styled.h2.withConfig({
	displayName: "StyledMarkdownUploadDialogHeading-sc-"
})(
	({ theme }) => css`
		color: ${theme.colors.text.headlineColor};
		font-size: ${theme.typography.fontSize.lgFontSize};
		font-weight: ${theme.typography.fontWeight.boldFontWeight};
		margin: 0;
	`
);

/** Where the file goes in: a button over a hidden native input, with a hint under it. */
export const StyledUploadArea = styled.div.withConfig({ displayName: "StyledMarkdownUploadArea-sc-" })(
	({ theme }) => css`
		align-items: center;
		border: 1px dashed color-mix(in srgb, ${theme.colors.text.secondaryColorDark} 45%, transparent);
		border-radius: ${theme.applicationStyles.input.borderRadius};
		display: flex;
		flex-direction: column;
		gap: ${theme.spacing.verticalSpacing.vertWhiteSpacing2xs}px;
		padding: ${theme.spacing.verticalSpacing.vertWhiteSpacingmd}px
			${theme.spacing.horizontalSpacing.horizWhiteSpacingmd}px;

		> input[type="file"] {
			display: none;
		}
	`
);

export const StyledUploadHint = styled.span.withConfig({ displayName: "StyledMarkdownUploadHint-sc-" })(
	({ theme }) => css`
		color: ${theme.colors.text.secondaryColorDark};
		font-size: ${theme.typography.fontSize.smallFontSize};
		text-align: center;
	`
);

export const StyledUploadDialogError = styled.p.withConfig({ displayName: "StyledMarkdownUploadDialogError-sc-" })(
	({ theme }) => css`
		color: ${theme.colors.variant.errorColor};
		font-size: ${theme.typography.fontSize.smallFontSize};
		margin: 0;
	`
);

export const StyledUploadDialogFooter = styled.div.withConfig({ displayName: "StyledMarkdownUploadDialogFooter-sc-" })(
	({ theme }) => css`
		align-items: center;
		display: flex;
		gap: ${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		justify-content: flex-end;
	`
);

const spin = keyframes`
	to {
		transform: rotate(360deg);
	}
`;

/**
 * Wrapper around an image that is uploading or has failed. Positions the spinner
 * overlay / error affordance on top of the (object-URL) preview.
 */
export const StyledImageUpload = styled.span.withConfig({ displayName: "StyledImageUpload-sc-" })`
	display: inline-block;
	max-width: 100%;
	position: relative;

	> img {
		display: block;
		max-width: 100%;
	}
`;

export const StyledImageUploadOverlay = styled.span.withConfig({ displayName: "StyledImageUploadOverlay-sc-" })(
	({ theme }) => css`
		align-items: center;
		background-color: color-mix(in srgb, ${theme.colors.background.primaryBackground} 55%, transparent);
		display: flex;
		inset: 0;
		justify-content: center;
		position: absolute;
	`
);

export const StyledImageUploadSpinner = styled.span.withConfig({ displayName: "StyledImageUploadSpinner-sc-" })(
	({ theme }) => css`
		animation: ${spin} 0.8s linear infinite;
		block-size: ${theme.spacing.spacing.spacingLg}px;
		border: 2px solid color-mix(in srgb, ${theme.colors.interaction.primaryInteractionColor} 25%, transparent);
		border-radius: 50%;
		border-top-color: ${theme.colors.interaction.primaryInteractionColor};
		inline-size: ${theme.spacing.spacing.spacingLg}px;
	`
);

/**
 * The inline error affordance shown when an upload fails: a tinted bar beneath a
 * dimmed preview, with the failure message and a retry action.
 */
export const StyledImageUploadError = styled.span.withConfig({ displayName: "StyledImageUploadError-sc-" })(
	({ theme }) => css`
		align-items: center;
		background-color: color-mix(
			in srgb,
			${theme.colors.variant.errorColor} 12%,
			${theme.colors.background.primaryBackground}
		);
		border: 1px solid ${theme.colors.variant.errorColor};
		border-radius: ${theme.applicationStyles.input.borderRadius};
		color: ${theme.colors.variant.errorColor};
		display: flex;
		font-size: ${theme.typography.fontSize.smallFontSize};
		gap: ${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		inset-block-end: 0;
		inset-inline: 0;
		justify-content: space-between;
		padding: ${theme.spacing.verticalSpacing.vertWhiteSpacing3xs}px
			${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		position: absolute;
	`
);
