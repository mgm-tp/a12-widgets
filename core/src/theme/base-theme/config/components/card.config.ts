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

export type CardConfigType = {
	actionArea: { activeBorder: string; focusBorder: string; focusBoxShadow: string; hoverBorder: string };
	childMargin: string;
	content: {
		fontFamily: string;
		fontSize: string;
	};
	firstChildMargin: string;
	media: { backgroundColor: string; maxHeight: string; minHeight: string; padding: string };
};

export const cardConfig = (theme: BaseThemeCore): CardConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const outlineWidth = `${spacing.spacing.spacing3xs}px`;
	const outlineColor = colors.interaction.hover.color;

	return {
		childMargin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0`,
		firstChildMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
		media: {
			backgroundColor: colors.background.secondaryBackground,
			maxHeight: "300px",
			minHeight: `${spacing.spacing.spacingXl}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
		},
		actionArea: {
			activeBorder: `${outlineWidth} solid ${outlineColor}`,
			focusBorder: `${outlineWidth} solid ${colors.interaction.focus.color}`,
			focusBoxShadow: "none",
			hoverBorder: `${outlineWidth} solid ${outlineColor}`
		},
		content: {
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize
		}
	};
};
