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

import type { BaseThemeType } from "../../../schema/base-theme.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";

export type SelectConfigType = {
	arrowIcon: { color: string; content: string; disabledColor: string; fontSize: string };
	borderRadius: string | number;
	color: string;
	dropdown: { margin: string };
	fontFamily: string;
	fontSize: string;
	fontWeight: number;
	height: string;
	option: { active: { backgroundColor: string; color: string }; hover: { backgroundColor: string; color: string } };
	title: { borderRadius: string | number; rightAlignPadding?: string };
	input?: {
		focus?: {
			customBorder?: CustomBorder;
		};
	};
	empty: { color: string; fontStyle: string };
};

export const selectConfig = (theme: BaseThemeType): SelectConfigType => {
	const { applicationStyles, spacing, colors, typography } = theme;
	const { input: applicationInputStyles } = applicationStyles;

	return {
		borderRadius: applicationInputStyles.borderRadius,
		color: applicationInputStyles.fontColor,
		fontFamily: applicationInputStyles.fontFamily,
		fontSize: applicationInputStyles.fontSize,
		fontWeight: applicationInputStyles.fontWeight,
		height: applicationInputStyles.height,
		arrowIcon: {
			color: colors.graphicSecondaryColorDark,
			content: '"\\e313"',
			disabledColor: colors.interaction.disabled.colorDark,
			fontSize: typography.fontSize.hugeFontSize
		},
		title: {
			borderRadius: applicationInputStyles.borderRadius,
			rightAlignPadding: `0 ${applicationStyles.input.height} 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px`
		},
		option: {
			active: {
				backgroundColor: colors.interaction.active.colorTouch,
				color: colors.text.invertedColor
			},
			hover: {
				backgroundColor: colors.interaction.hover.color,
				color: colors.text.invertedColor
			}
		},
		dropdown: {
			margin: `${spacing.horizontalSpacing.horizWhiteSpacing3xs}px 0 0`
		},
		empty: {
			color: colors.text.secondaryColorDark,
			fontStyle: "italic"
		}
	};
};
