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

export type CounterConfigType = {
	active: { backgroundColor: string; color: string };
	background: { constructive: string; default: string; destructive: string };
	borderRadius: string | number;
	color: string;
	focus: { backgroundColor: string; color: string };
	fontFamily: string;
	fontSize: string;
	fontWeight: number;
	hover: { backgroundColor: string; color: string };
	iconMargin: string;
	padding: string;
	secondary: { activeColor: string; focusColor: string; hoverColor: string };
	timing: string;
	variantColor: string;
};

export const counterConfig = (theme: BaseThemeCore): CounterConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		borderRadius: `${spacing.spacing.spacingXs}px`,
		color: colors.text.color,
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		fontWeight: typography.fontWeight.semiBoldFontWeight,
		padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs + 1}px`,
		iconMargin: `${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
		background: {
			default: colors.placeHolderBackgroundLight,
			constructive: colors.variant.constructiveColor,
			destructive: colors.variant.destructiveColor
		},
		variantColor: colors.text.invertedColor,
		timing: ".5s",
		secondary: {
			focusColor: colors.interaction.focus.color,
			hoverColor: colors.interaction.hover.color,
			activeColor: colors.interaction.active.color
		},
		focus: {
			backgroundColor: colors.interaction.focus.color,
			color: colors.interaction.focus.colorInverted
		},
		hover: {
			backgroundColor: colors.interaction.hover.color,
			color: colors.interaction.hover.colorInverted
		},
		active: {
			backgroundColor: colors.interaction.active.colorTouch,
			color: colors.interaction.active.colorTouchInverted
		}
	};
};
