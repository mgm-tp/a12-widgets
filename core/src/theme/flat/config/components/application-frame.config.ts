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

import type { FlatThemeType } from "../../../schema.js";
import { commonButtonConfigs } from "../../../default/config/components/button.config.js";

import { GeneralFlatColorsConfig } from "../base/colors.config.js";

export const applicationFrameFlatConfig = (theme: FlatThemeType) => {
	const { focusStyles } = theme;
	const buttonConfigs = commonButtonConfigs(theme);

	return {
		backgroundColor: theme.colors.background.secondaryBackground,
		header: {
			boxShadow: "none"
		},
		sidebar: {
			background: GeneralFlatColorsConfig.blueLight,
			containerBackground: GeneralFlatColorsConfig.blueLight,
			boxShadow: "none"
		},
		mainContainer: {
			padding: `${theme.spacing.verticalSpacing.vertWhiteSpacing2xs}px ${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
		},
		trigger: {
			color: theme.colors.interaction.primaryInteractionColor,
			interaction: {
				active: {
					borderColor: buttonConfigs.buttonActiveColor,
					color: buttonConfigs.buttonActiveColor
				},
				focus: {
					borderColor: buttonConfigs.buttonFocusColor,
					color: buttonConfigs.buttonFocusColor,
					outline: focusStyles.focusedBoundaryDark
				},
				hover: {
					borderColor: buttonConfigs.buttonHoverColor,
					color: buttonConfigs.buttonHoverColor
				}
			}
		}
	};
};
