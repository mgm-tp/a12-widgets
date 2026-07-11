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

import { rgba } from "polished";

import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type ModalOverlayConfigType = {
	background: string;
	container: { background: string; maxWidth: string };
	contentBoxContentPadding: string;
	contentBox?: {
		fontSize: string;
	};
	gutterHorizontalMargin: string;
	gutterMargin: string;
	mobileContentboxHeaderMinHeight: string;
	width: string;
};

const defaultModalOverlayConfig = (theme: BaseThemeCore): ModalOverlayConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const gutterHorizontalMargin = `${spacing.horizontalSpacing.horizWhiteSpacingmd}px`;

	return {
		background: rgba(colors.boxShadowBackground, theme.opacity.low),
		container: {
			background: colors.background.primaryBackground,
			maxWidth: "756px"
		},
		contentBoxContentPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingmd}px`,
		contentBox: {
			fontSize: typography.fontSize.tinyFontSize
		},
		gutterMargin: `${spacing.verticalSpacing.vertWhiteSpacingmd}px ${gutterHorizontalMargin}`,
		gutterHorizontalMargin: gutterHorizontalMargin,
		mobileContentboxHeaderMinHeight: `${2 * spacing.spacing.spacingMd}px`,
		width: `calc(100% - ${spacing.spacing.spacingMd * 2}px)`
	};
};

export const modalOverlayOverrides = (theme: BaseThemeCore) => {
	const spacing = theme.spacing;

	return {
		contentBoxContentPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingmd}px`
	};
};

export const modalOverlayConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultModalOverlayConfig(theme), modalOverlayOverrides(theme));
