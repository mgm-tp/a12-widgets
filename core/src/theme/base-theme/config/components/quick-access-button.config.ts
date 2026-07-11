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

export type QuickAccessButtonConfigType = {
	borderRadius: string | number;
	buttonIconFontSize: string;
	divider: {
		disabledBG: string;
		invertBG: string;
		invertOpacity: string;
		invertSecondaryBG: string;
		primaryBG: string;
		primaryDestructiveBG: string;
		primaryOpacity: string;
		secondaryActiveBG: string;
		secondaryBG: string;
		secondaryFocusBG: string;
		secondaryHoverBG: string;
		width: string;
	};
	minWidth: string;
	primary: { boxShadow: string };
	secondary: { border: string; boxShadow: string; disabled: { background: string } };
	touch: { minWidth: string; triggerMinWidth: string };
};

const defaultQuickAccessButtonConfig = (theme: BaseThemeCore): QuickAccessButtonConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		buttonIconFontSize: typography.fontSize.lgFontSize,
		minWidth: spacing.spacing.spacingLg * 1.25 + "px",
		borderRadius: theme.border.radius.sm,
		divider: {
			disabledBG: colors.divider.colorLight,
			invertBG: colors.divider.colorLight,
			invertOpacity: "50%",
			invertSecondaryBG: colors.divider.colorLight,
			primaryBG: colors.interaction.primaryInteractionColor,
			primaryOpacity: "20%",
			primaryDestructiveBG: colors.variant.destructiveColor,
			secondaryActiveBG: colors.interaction.active.colorTouch,
			secondaryBG: colors.divider.color,
			secondaryFocusBG: colors.interaction.focus.color,
			secondaryHoverBG: colors.interaction.hover.color,
			width: theme.border.width.medium
		},
		primary: {
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`
		},
		secondary: {
			border: `${theme.border.width.medium} solid ${colors.divider.color}`,
			boxShadow: "none",
			disabled: {
				background: "transparent"
			}
		},
		touch: {
			minWidth: 2.5 * theme.spacing.baseSpacing.BASE + "px",
			triggerMinWidth: 1.75 * theme.spacing.baseSpacing.BASE + "px"
		}
	};
};

export const quickAccessButtonOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		borderRadius: theme.border.radius.md,
		divider: {
			secondaryBG: colors.divider.colorLight,
			secondaryFocusBG: colors.interaction.focus.color
		},
		primary: {
			boxShadow: "none"
		},
		secondary: {
			border: `${theme.border.width.medium} solid transparent`,
			disabled: {
				background: colors.interaction.disabled.color
			}
		}
	};
};

export const quickAccessButtonConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultQuickAccessButtonConfig(theme), quickAccessButtonOverrides(theme));
