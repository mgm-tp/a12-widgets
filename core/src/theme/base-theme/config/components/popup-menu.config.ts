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

const defaultPopupMenuConfig = (theme: BaseThemeCore): PopupMenuConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		button: {
			color: colors.text.color,
			disabled: {
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			font: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			icon: {
				color: colors.text.color,
				fontSize: typography.fontSize.mediumFontSize,
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
			borderBottom: `${theme.border.width.thin} solid ${colors.divider.color}`,
			height: spacing.spacing.spacingXl + "px",
			hover: {
				background: colors.background.interactiveBackground,
				boxShadow: "none"
			},
			paddingLeft: spacing.horizontalSpacing.horizWhiteSpacing2xl + "px"
		},
		menu: {
			background: colors.background.primaryBackground,
			borderLeft: `${theme.border.width.thin} solid ${colors.divider.color}`,
			borderTop: `${theme.border.width.thin} solid ${colors.divider.color}`,
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
			maxHeight: `${spacing.spacing.spacing2Xl * 3}px`,
			maxWidth: "100%",
			minWidth: `${5 * spacing.spacing.spacingLg}px`,
			borderRadius: "8px 8px 0 0",
			boxShadowModal: `0 2px 8px 2px ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
			width: "320px"
		},
		header: {
			minHeight: `${2 * spacing.spacing.spacingLg}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			fontWeight: typography.fontWeight.boldFontWeight
		}
	};
};

export const popupMenuOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		menu: {
			borderLeft: "none",
			borderTop: "none"
		},
		item: {
			active: {
				background: "none",
				boxShadow: `inset 0 0 0 2px ${colors.interaction.color}`
			},
			hover: {
				background: "none",
				boxShadow: `inset 0 0 0 2px ${colors.interaction.color}`
			}
		}
	};
};

export const popupMenuConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultPopupMenuConfig(theme), popupMenuOverrides(theme));
