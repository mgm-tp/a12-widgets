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

import type { DefaultThemeType } from "../schema.js";
import type { BaseThemeColorsType } from "../schema/base-colors.api.js";
import type { BaseThemeTypographyType } from "../schema/typography.api.js";
import type { BaseThemeSpacingType } from "../schema/spacing.api.js";
import { LineHeightConfig } from "../base-theme/config/application/line-height.config.js";

import { DefaultColorsConfig } from "./config/base/colors.config.js";
import { FontConfig } from "./config/base/fonts.config.js";
import { DefaultComponentsConfigs } from "./config/components/components.js";
import { FontSizeConfig } from "./config/application/font_size.config.js";
import { FontWeightConfig } from "./config/application/font_weight.config.js";
import { BaseSpacingConfig } from "./config/base/spacing.config.js";
import { HorizontalSpacingConfig, SpacingConfig, VerticalSpacingConfig } from "./config/application/spacing.config.js";
import { ApplicationStyles } from "./config/application/application_styles.config.js";
import { BaseInputStyles } from "./config/base/input.config.js";
import { FocusStyles } from "./config/application/focus.config.js";
import { DivisionLineStyles } from "./config/application/division-line.config.js";

/** @deprecated since v39.0.0. The default theme will be removed in a future release with no replacement; its visual style is not carried forward. Adopt `getBaseTheme` from `@com.mgmtp.a12.widgets/widgets-core` to stay supported (it uses the flat-compact visual style). */
export const getDefaultTheme = (): DefaultThemeType => {
	const colors: BaseThemeColorsType = DefaultColorsConfig;
	const baseFont = FontConfig;
	const typography: BaseThemeTypographyType = {
		font: baseFont,
		fontSize: FontSizeConfig(baseFont),
		fontWeight: FontWeightConfig,
		lineHeight: LineHeightConfig
	};

	const spacing: BaseThemeSpacingType = {
		baseSpacing: BaseSpacingConfig,
		spacing: SpacingConfig(BaseSpacingConfig.BASE),
		horizontalSpacing: HorizontalSpacingConfig(BaseSpacingConfig.BASE_HORIZONTAL_WHITE_SPACING),
		verticalSpacing: VerticalSpacingConfig(BaseSpacingConfig.BASE_VERTICAL_WHITE_SPACING)
	};

	const applicationStyles = ApplicationStyles({ colors, typography, spacing });
	const focusStyles = FocusStyles({ colors });
	const baseInputStyles = BaseInputStyles;
	const divisionLineStyles = DivisionLineStyles({ colors });
	const baseTheme = {
		colors,
		typography,
		spacing,
		applicationStyles,
		focusStyles,
		baseInputStyles,
		divisionLineStyles
	};

	return {
		...baseTheme,
		components: DefaultComponentsConfigs(baseTheme)
	};
};

/** @deprecated since v39.0.0. The default theme will be removed in a future release with no replacement; its visual style is not carried forward. Adopt `getBaseTheme` from `@com.mgmtp.a12.widgets/widgets-core` to stay supported (it uses the flat-compact visual style). */
export const defaultTheme = getDefaultTheme();
