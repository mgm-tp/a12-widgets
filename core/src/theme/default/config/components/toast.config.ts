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

import type { BaseThemeType } from "../../../schema/base-theme.js";

export type ToastConfigType = {
	actions: { closeButton: { fontSize: string }; padding: string; width: string };
	body: { background: string; border: string; boxShadow: string; maxWidth: string; minWidth: string };
	collapse: { padding: string };
	color: { error: string; info: string; success: string; warning: string };
	content: { padding: string };
	footer: { minHeight: string; padding: string };
	graphic: { boxShadow: string; minHeight: string; padding: string; width: string };
	message: { color: string; fontFamily: string; fontSize: string; lineHeight: number };
	title: {
		color: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		lineHeight: number;
		padding: string;
	};
	variantIcon: {
		color: {
			info: string;
			error: string;
			success: string;
			warning: string;
		};
		fontSize: string;
	};
};

export const toastConfig = (theme: BaseThemeType): ToastConfigType => {
	const {
		colors,
		spacing: { spacing, horizontalSpacing, verticalSpacing },
		typography: { fontSize, fontWeight }
	} = theme;

	return {
		actions: {
			closeButton: {
				fontSize: fontSize.hugeFontSize
			},
			padding: `${verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
			width: `${2 * spacing.spacingMd}px`
		},
		body: {
			background: colors.background.primaryBackground,
			border: "1px solid transparent",
			boxShadow: `2px 2px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
			minWidth: "98px",
			maxWidth: "432px"
		},
		collapse: {
			padding: `${verticalSpacing.vertWhiteSpacingxs}px 0 0`
		},
		color: {
			error: colors.variant.errorColor,
			info: colors.variant.infoColor,
			success: colors.variant.successColor,
			warning: colors.variant.warningColor
		},
		content: {
			padding: `0 ${horizontalSpacing.horizWhiteSpacingsm}px ${verticalSpacing.vertWhiteSpacingsm}px`
		},
		footer: {
			minHeight: `${2 * spacing.spacingMd}px`,
			padding: `0 ${horizontalSpacing.horizWhiteSpacingsm}px ${verticalSpacing.vertWhiteSpacingsm}px`
		},
		graphic: {
			boxShadow: `2px 2px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
			minHeight: `${2 * spacing.spacingMd}px`,
			padding: `${verticalSpacing.vertWhiteSpacingsm}px 0 0 0`,
			width: `${2 * spacing.spacingMd}px`
		},
		message: {
			color: theme.colors.text.color,
			fontFamily: theme.typography.font.MAIN_FONT,
			fontSize: theme.typography.fontSize.tinyFontSize,
			lineHeight: 1.45
		},
		title: {
			color: theme.colors.text.color,
			fontFamily: theme.typography.font.MAIN_FONT,
			fontSize: theme.typography.fontSize.tinyFontSize,
			fontWeight: fontWeight.boldFontWeight,
			lineHeight: 1.45,
			padding: `${verticalSpacing.vertWhiteSpacingsm}px 0 ${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingsm}px`
		},
		variantIcon: {
			color: {
				info: colors.variant.text.info,
				error: colors.variant.text.error,
				success: colors.variant.text.success,
				warning: colors.variant.text.warning
			},
			fontSize: fontSize.hugeFontSize
		}
	};
};
