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

export type TagInputConfigType = {
	disabled: { background: string; boxShadow: string; color: string };
	errorBoxShadow: string;
	fieldMinWidth: number;
	infoBoxShadow: string;
	readonlyBG: string;
	tag: {
		activeBorderColor: string;
		disabled: { background: string; color: string };
		hoverBorderColor: string;
		margin: string;
		readonlyBG: string;
	};
	tagGroup: { background: string; boxShadow: string; minHeight: string; padding: string; width: string };
	textArea: {
		height: number;
		lineHeight: string;
		padding: string;
		border: string;
	};
	warningBoxShadow: string;
	input?: { focus?: { customBorder?: CustomBorder } };
};

export const tagInputConfig = (theme: BaseThemeType): TagInputConfigType => {
	const { typography, colors, spacing, applicationStyles } = theme;

	return {
		disabled: {
			background: colors.interaction.disabled.color,
			boxShadow: `${applicationStyles.input.defaultBorder} ${colors.interaction.disabled.colorDark}`,
			color: colors.interaction.disabled.colorDark
		},
		errorBoxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.errorColor}`,
		fieldMinWidth: spacing.spacing.spacingMd,
		infoBoxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.infoColor}`,
		readonlyBG: colors.background.interactiveBackground,
		tag: {
			activeBorderColor: colors.interaction.active.colorTouch,
			disabled: {
				background: colors.interaction.disabled.colorLight,
				color: colors.interaction.disabled.colorDark
			},
			hoverBorderColor: colors.interaction.hover.color,
			margin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
			readonlyBG: colors.background.tertiaryBackground
		},
		tagGroup: {
			background: applicationStyles.input.background,
			boxShadow: applicationStyles.input.boxShadow,
			minHeight: spacing.spacing.spacingLg + spacing.spacing.spacingXs + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${
				spacing.horizontalSpacing.horizWhiteSpacingsm - 4
			}px`,
			width: "100%"
		},
		textArea: {
			height: spacing.spacing.spacingMd,
			lineHeight: typography.fontSize.mediumFontSize,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			border: `1px dashed ${colors.secondaryColor}`
		},
		warningBoxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.warningColorDark}`
	};
};
