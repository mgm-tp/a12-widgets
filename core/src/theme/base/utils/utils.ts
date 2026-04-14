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

import { css } from "styled-components";
import { kebabCase } from "lodash-es";

import { GeneralColorsConfig } from "../colors.config.js";

export const DIRECTION = ["horizontal", "vertical", "all", "top", "bottom", "right", "left"];

export const SPACING_MODIFIERS = [
	"0",
	"base",
	"3xs",
	"2xs",
	"xs",
	"sm",
	"md",
	"lg",
	"xl",
	"2xl",
	"3xl",
	"4xl",
	"5xl",
	"6xl"
];

export const MAPPED_COLORS = {
	secondaryColors: {
		blue: GeneralColorsConfig.blue,
		blueDark: GeneralColorsConfig.blueDark,
		blueLight: GeneralColorsConfig.blueLight,

		green: GeneralColorsConfig.green,
		greenDark: GeneralColorsConfig.greenDark,
		greenLight: GeneralColorsConfig.greenLight,

		grey: GeneralColorsConfig.grey,
		greyDark: GeneralColorsConfig.greyDark,
		greyLight: GeneralColorsConfig.greyLight,

		orange: GeneralColorsConfig.orange,
		orangeDark: GeneralColorsConfig.orangeDark,
		orangeLight: GeneralColorsConfig.orangeLight,

		purple: GeneralColorsConfig.purple,
		purpleDark: GeneralColorsConfig.purpleDark,
		purpleLight: GeneralColorsConfig.purpleLight,

		red: GeneralColorsConfig.red,
		redDark: GeneralColorsConfig.redDark,
		redLight: GeneralColorsConfig.redLight,

		yellow: GeneralColorsConfig.yellow,
		yellowDark: GeneralColorsConfig.yellowDark,
		yellowLight: GeneralColorsConfig.yellowLight,

		white: GeneralColorsConfig.white,
		transparent: "transparent",
		black: GeneralColorsConfig.black
	}
};

export const spacingValue = (direct: string, modifier: string) => css`
	${({ theme }) => {
		const { baseSpacing, horizontalSpacing, verticalSpacing } = theme.spacing;
		const isHorizontal = direct === "horizontal" || direct === "left" || direct === "right";
		const isVertical = direct === "vertical" || direct === "top" || direct === "bottom";
		const isNegative = modifier.slice(0, 1) === "-";
		const prefix = isNegative ? "-" : "";
		const suffix = isNegative ? modifier.slice(1) : modifier;

		if (suffix === "0" || suffix === "auto") {
			return suffix;
		}

		if (suffix === "base") {
			return isHorizontal
				? `${prefix}${baseSpacing.BASE_HORIZONTAL_WHITE_SPACING}px`
				: isVertical
					? `${prefix}${baseSpacing.BASE_VERTICAL_WHITE_SPACING}px`
					: undefined;
		}

		const horizSpacing = {
			"3xs": horizontalSpacing.horizWhiteSpacing3xs,
			"2xs": horizontalSpacing.horizWhiteSpacing2xs,
			xs: horizontalSpacing.horizWhiteSpacingxs,
			sm: horizontalSpacing.horizWhiteSpacingsm,
			md: horizontalSpacing.horizWhiteSpacingmd,
			lg: horizontalSpacing.horizWhiteSpacinglg,
			xl: horizontalSpacing.horizWhiteSpacingxl,
			"2xl": horizontalSpacing.horizWhiteSpacing2xl,
			"3xl": horizontalSpacing.horizWhiteSpacing3xl,
			"4xl": horizontalSpacing.horizWhiteSpacing4xl,
			"5xl": horizontalSpacing.horizWhiteSpacing5xl,
			"6xl": horizontalSpacing.horizWhiteSpacing6xl
		};
		const vertSpacing = {
			"3xs": verticalSpacing.vertWhiteSpacing3xs,
			"2xs": verticalSpacing.vertWhiteSpacing2xs,
			xs: verticalSpacing.vertWhiteSpacingxs,
			sm: verticalSpacing.vertWhiteSpacingsm,
			md: verticalSpacing.vertWhiteSpacingmd,
			lg: verticalSpacing.vertWhiteSpacinglg,
			xl: verticalSpacing.vertWhiteSpacingxl,
			"2xl": verticalSpacing.vertWhiteSpacing2xl,
			"3xl": verticalSpacing.vertWhiteSpacing3xl,
			"4xl": verticalSpacing.vertWhiteSpacing4xl,
			"5xl": verticalSpacing.vertWhiteSpacing5xl,
			"6xl": verticalSpacing.vertWhiteSpacing6xl
		};

		return isHorizontal
			? `${prefix}${horizSpacing[suffix as keyof typeof horizSpacing]}px`
			: isVertical
				? `${prefix}${vertSpacing[suffix as keyof typeof vertSpacing]}px`
				: undefined;
	}}
`;

export const camelCaseToKebabCase = (text: string): string => {
	return kebabCase(text);
};
