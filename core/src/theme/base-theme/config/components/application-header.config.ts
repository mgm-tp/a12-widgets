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

import type { DeepPartial } from "../../../../common/main/utils.js";
import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type ApplicationHeaderConfigType = {
	backgroundColor: string;
	borderBottom: string;
	borderTop: string;
	fontFamily: string;
	fontSize: string;
	minHeight: string;
	padding: string;
	slot: { color: string; marginRight: string };
};

const defaultApplicationHeaderConfig = (theme: BaseThemeCore): ApplicationHeaderConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		backgroundColor: colors.primaryColor,
		borderBottom: `${theme.border.width.thin} solid ${rgba(colors.boxShadowBackground, theme.opacity.hint)}`,
		borderTop: `${theme.border.width.thin} solid transparent`,
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.mediumFontSize,
		minHeight: `${spacing.baseSpacing.BASE * 3}px`,
		padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
		slot: {
			color: colors.text.invertedColor,
			marginRight: `${spacing.spacing.spacingXs}px`
		}
	};
};

export const applicationHeaderOverrides = (theme: BaseThemeCore): DeepPartial<ApplicationHeaderConfigType> => {
	const colors = theme.colors;

	return {
		borderBottom: "none",
		borderTop: `${theme.border.width.thick} solid ${colors.interaction.primaryInteractionColor}`,
		slot: {
			color: colors.text.color
		}
	};
};

export const applicationHeaderConfig = (theme: BaseThemeCore): ApplicationHeaderConfigType =>
	mergeConfig(defaultApplicationHeaderConfig(theme), applicationHeaderOverrides(theme));
