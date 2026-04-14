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

export type PopupMenuConfigType = {
	button: {
		color: string;
		disabled: { background: string; color: string };
		font: string;
		fontSize: string;
		fontWeight: number;
		icon: { color: string; fontSize: string; height: string };
		padding: string;
		textAlign: string;
	};
	item: {
		active: { background: string; boxShadow: string };
		borderBottom: string;
		height: string;
		hover: { background: string; boxShadow: string };
		paddingLeft: string;
	};
	menu: {
		background: string;
		borderLeft: string;
		borderTop: string;
		boxShadow: string;
		maxWidth?: string;
		maxHeight: string;
		minWidth: string;
		borderRadius: string;
		boxShadowModal: string;
		width: string;
	};
	header: {
		minHeight: string;
		padding: string;
		fontWeight: number;
	};
};

export const popupMenuConfig = (theme: BaseThemeType): PopupMenuConfigType => {
	const { colors, typography, spacing } = theme;

	return {
		button: {
			color: colors.text.color,
			disabled: {
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			font: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.mediumFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			icon: {
				color: colors.text.color,
				fontSize: typography.fontSize.bigFontSize,
				height: spacing.spacing.spacingMd + "px"
			},
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
			textAlign: "left"
		},
		item: {
			active: {
				background: colors.background.interactiveBackground,
				boxShadow: "none"
			},
			borderBottom: `1px solid ${colors.divider.color}`,
			height: spacing.spacing.spacingXl + "px",
			hover: {
				background: colors.background.interactiveBackground,
				boxShadow: "none"
			},
			paddingLeft: spacing.horizontalSpacing.horizWhiteSpacing2xl + "px"
		},
		menu: {
			background: colors.background.primaryBackground,
			borderLeft: `1px solid ${colors.divider.color}`,
			borderTop: `1px solid ${colors.divider.color}`,
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
			maxHeight: `${spacing.spacing.spacing2Xl * 3}px`,
			maxWidth: "100%",
			minWidth: `${spacing.spacing.spacing2Xl * 2}px`,
			borderRadius: "8px 8px 0 0",
			boxShadowModal: `0 2px 8px 2px ${rgba(colors.boxShadowBackground, 0.4)}`,
			width: "320px"
		},
		header: {
			minHeight: "48px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			fontWeight: typography.fontWeight.boldFontWeight
		}
	};
};
