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

import { linearGradient } from "polished";
import type { Styles } from "polished/lib/types/style.js";

import type { BaseThemeCore } from "../../schema.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type LinkConfigType = {
	active: { backgroundImage: Styles; color: string; textDecoration?: string };
	backgroundSize: string;
	color: string;
	focus: {
		backgroundImage: Styles;
		color: string;
		outline: string;
		customBorder?: CustomBorder;
		textDecoration?: string;
	};
	fontFamily: string;
	fontSize: string;
	fontWeight: number;
	hover: {
		backgroundImage: Styles;
		color: string;
		textDecoration?: string;
	};
	icon: { fontSize: string; margin: string; verticalAlign: string };
	transitionTiming: string;
	visitedColor: string;
};

const defaultLinkConfig = (theme: BaseThemeCore): LinkConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;

	return {
		backgroundSize: `calc(100% - ${theme.border.width.thin}) calc(0.1 * ${typography.font.BASE_FONT_SIZE}rem)`,
		color: colors.interaction.secondaryInteractionColor,
		visitedColor: colors.interaction.secondaryInteractionColor,
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		fontWeight: typography.fontWeight.boldFontWeight,
		icon: {
			fontSize: typography.fontSize.tinyFontSize,
			verticalAlign: `-${spacing.verticalSpacing.vertWhiteSpacing3xs}px`,
			margin: "0"
		},
		transitionTiming: theme.motion.duration.slow,
		active: {
			backgroundImage: linearGradient({
				colorStops: [colors.interaction.active.colorTouch, colors.interaction.active.colorTouch]
			}),
			color: colors.interaction.active.colorTouch,
			textDecoration: "none"
		},
		hover: {
			backgroundImage: linearGradient({
				colorStops: [colors.interaction.hover.color, colors.interaction.hover.color]
			}),
			color: colors.interaction.hover.color,
			textDecoration: "none"
		},
		focus: {
			backgroundImage: linearGradient({
				colorStops: [colors.interaction.focus.color, colors.interaction.focus.color]
			}),
			color: colors.interaction.focus.color,
			outline: focusStyles.focusedBoundaryDark,
			textDecoration: "none"
		}
	};
};

export const linkOverrides = (theme: BaseThemeCore) => {
	return {
		hover: {
			color: theme.colors.interaction.color
		}
	};
};

export const linkConfig = (theme: BaseThemeCore) => mergeConfig(defaultLinkConfig(theme), linkOverrides(theme));
