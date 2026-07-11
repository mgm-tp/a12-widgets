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

import type { BaseThemeCore } from "../../schema.js";

export type MessageBoxConfigType = {
	action: { marginLeft: string };
	background: { error: string; info: string; success: string; warning: string };
	border: { error: string; info: string; success: string; warning: string };
	borderWidth?: string;
	borderRadius: string | number;
	fontFamily: string;
	fontSize: string;
	color: { error: string; info: string; success: string; warning: string };
	icon: { fontSize: string; marginRight: string };
	label: { lineHeight: string; maxWidth: string };
	mainContainer: { padding: string };
	response: { actionMarginLeft: string; topBorder: string };
	subContainer: { padding: string };
	title?: { verticalAlignment: string };
};

export const messageBoxConfig = (theme: BaseThemeCore): MessageBoxConfigType => {
	const {
		spacing: { verticalSpacing, horizontalSpacing },
		colors,
		typography: { fontSize, font }
	} = theme;

	const iconMarginRight = `${horizontalSpacing.horizWhiteSpacingsm}px`;

	return {
		border: {
			error: `${theme.border.width.medium} solid ${colors.variant.errorColor}`,
			info: `${theme.border.width.medium} solid ${colors.variant.infoColor}`,
			success: `${theme.border.width.medium} solid ${colors.variant.successColor}`,
			warning: `${theme.border.width.medium} solid ${colors.variant.warningColor}`
		},
		background: {
			error: colors.background.primaryBackground,
			info: colors.background.primaryBackground,
			success: colors.background.primaryBackground,
			warning: colors.background.primaryBackground
		},
		borderRadius: theme.border.radius.md,
		fontFamily: font.MAIN_FONT,
		fontSize: fontSize.tinyFontSize,
		color: {
			error: colors.text.color,
			info: colors.text.color,
			success: colors.text.color,
			warning: colors.text.color
		},
		mainContainer: {
			padding: `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingsm}px`
		},
		subContainer: {
			padding: `0 ${horizontalSpacing.horizWhiteSpacingsm}px ${verticalSpacing.vertWhiteSpacingxs}px calc(${horizontalSpacing.horizWhiteSpacingsm}px + ${iconMarginRight} + 24px)`
		},
		icon: {
			marginRight: iconMarginRight,
			fontSize: fontSize.hugeFontSize
		},
		label: {
			lineHeight: "16px",
			maxWidth: "400px"
		},
		action: {
			marginLeft: `${horizontalSpacing.horizWhiteSpacingsm}px`
		},
		response: {
			topBorder: `${theme.border.width.medium} solid ${colors.divider.color}`,
			actionMarginLeft: `${horizontalSpacing.horizWhiteSpacingxl}px`
		},
		title: {
			verticalAlignment: "center"
		}
	};
};
