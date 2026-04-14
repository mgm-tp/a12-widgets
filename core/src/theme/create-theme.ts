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

import merge from "deepmerge";

import type { DeepPartial as UtilsDeepPartial } from "../common/main/utils.js";

import type { DefaultThemeType, FlatCompactThemeType, FlatThemeType } from "./schema.js";
import { FontConfig } from "./default/config/base/fonts.config.js";
import { FontSizeConfig } from "./default/config/application/font_size.config.js";
import { FontWeightConfig } from "./default/config/application/font_weight.config.js";
import {
	HorizontalSpacingConfig,
	SpacingConfig,
	VerticalSpacingConfig
} from "./default/config/application/spacing.config.js";
import { ApplicationStyles } from "./default/config/application/application_styles.config.js";
import { FocusStyles } from "./default/config/application/focus.config.js";
import { BaseInputStyles } from "./default/config/base/input.config.js";
import { DivisionLineStyles } from "./default/config/application/division-line.config.js";
import { DefaultComponentsConfigs } from "./default/config/components/components.js";
import type { BaseThemeType } from "./schema/base-theme.js";
import type { BaseThemeColorsType } from "./schema/base-colors.api.js";
import type { BaseThemeTypographyType } from "./schema/typography.api.js";
import type { ApplicationStyle, DivisionLineStyle } from "./schema/application-styles.api.js";
import type { BaseThemeSpacingType } from "./schema/spacing.api.js";
import type { FocusStyle } from "./schema/focus.api.js";
import type { BaseThemeComponentsType } from "./schema/components.api.js";
import { getDefaultTheme } from "./default/default-theme.js";
import { getCompactTheme } from "./compact/compact-theme.js";
import { getFlatTheme } from "./flat/flat-theme.js";
import { getFlatCompactTheme } from "./flat-compact/flat-compact-theme.js";
import { CompactComponentsConfigs } from "./compact/config/components/components.js";
import { FlatComponentsConfigs } from "./flat/config/components/components.js";
import { FlatCompactComponentsConfigs } from "./flat-compact/config/components/components.js";
import { ApplicationFlatStyles } from "./flat/config/application/application_styles.config.js";
import { FocusFlatStyles } from "./flat/config/application/focus.config.js";
import { FlatDivisionLineStyles } from "./flat/config/application/division-line.config.js";

/** @deprecated since version 38.2.0. Use `DeepPartial` from top level import */
export type DeepPartial<T> = UtilsDeepPartial<T>;

export type ThemeType = "default" | "compact" | "flat" | "flat-compact";

export const createTheme = (
	params?: UtilsDeepPartial<DefaultThemeType & { baseTheme: ThemeType }>
): DefaultThemeType => {
	let getTheme;

	switch (params?.baseTheme) {
		case "compact":
			getTheme = getCompactTheme();
			break;
		case "flat":
			getTheme = getFlatTheme();
			break;
		case "flat-compact":
			getTheme = getFlatCompactTheme();
			break;
		default:
			getTheme = getDefaultTheme();
	}

	const baseColors = getTheme.colors;

	const baseFont = FontConfig;
	const defaultTypography = {
		font: baseFont,
		fontSize: FontSizeConfig(baseFont),
		fontWeight: FontWeightConfig
	};

	const themeSpacing = {
		baseSpacing: getTheme.spacing.baseSpacing,
		spacing: SpacingConfig(getTheme.spacing.baseSpacing.BASE),
		horizontalSpacing: HorizontalSpacingConfig(getTheme.spacing.baseSpacing.BASE_HORIZONTAL_WHITE_SPACING),
		verticalSpacing: VerticalSpacingConfig(getTheme.spacing.baseSpacing.BASE_VERTICAL_WHITE_SPACING)
	};

	const colors = params?.colors
		? merge<BaseThemeColorsType, UtilsDeepPartial<BaseThemeColorsType>>(baseColors, params.colors)
		: baseColors;
	const typography = params?.typography
		? merge<BaseThemeTypographyType, UtilsDeepPartial<BaseThemeTypographyType>>(defaultTypography, params.typography)
		: defaultTypography;
	const spacing = params?.spacing
		? merge<BaseThemeSpacingType, UtilsDeepPartial<BaseThemeSpacingType>>(themeSpacing, params.spacing)
		: themeSpacing;

	let baseApplicationStyles;
	let baseFocusStyles;
	let baseDivisionLineStyles;

	switch (params?.baseTheme) {
		case "flat":
		case "flat-compact":
			baseApplicationStyles = merge(
				ApplicationStyles({ colors, typography, spacing }),
				ApplicationFlatStyles({ ...(getTheme as FlatThemeType) })
			);
			baseFocusStyles = FocusFlatStyles({ colors });
			baseDivisionLineStyles = merge<DivisionLineStyle>(DivisionLineStyles({ colors }), FlatDivisionLineStyles());
			break;
		default:
			baseApplicationStyles = ApplicationStyles({ colors, typography, spacing });
			baseFocusStyles = FocusStyles({ colors });
			baseDivisionLineStyles = DivisionLineStyles({ colors });
	}

	const applicationStyles = params?.applicationStyles
		? merge<ApplicationStyle, UtilsDeepPartial<ApplicationStyle>>(baseApplicationStyles, params.applicationStyles)
		: baseApplicationStyles;
	const focusStyles = params?.focusStyles
		? merge<FocusStyle, UtilsDeepPartial<FocusStyle>>(baseFocusStyles, params.focusStyles)
		: baseFocusStyles;
	const baseInputStyles = params?.baseInputStyles ? merge(BaseInputStyles, params.baseInputStyles) : BaseInputStyles;
	const divisionLineStyles = params?.divisionLineStyles
		? merge<DivisionLineStyle, UtilsDeepPartial<DivisionLineStyle>>(baseDivisionLineStyles, params?.divisionLineStyles)
		: baseDivisionLineStyles;
	const baseTheme: BaseThemeType = {
		colors,
		typography,
		spacing,
		applicationStyles,
		focusStyles,
		baseInputStyles,
		divisionLineStyles
	};

	let baseComponents;

	switch (params?.baseTheme) {
		case "compact":
			baseComponents = merge(
				DefaultComponentsConfigs(baseTheme),
				CompactComponentsConfigs({ ...getTheme, ...baseTheme })
			);
			break;
		case "flat":
			baseComponents = merge(
				DefaultComponentsConfigs(baseTheme),
				FlatComponentsConfigs({ ...getTheme, ...baseTheme } as FlatThemeType)
			);
			break;
		case "flat-compact":
			baseComponents = merge(
				merge(
					DefaultComponentsConfigs(baseTheme),
					FlatComponentsConfigs({ ...getTheme, ...baseTheme } as FlatThemeType)
				),
				merge(
					CompactComponentsConfigs({ ...getTheme, ...baseTheme }),
					FlatCompactComponentsConfigs({ ...getTheme, ...baseTheme } as FlatCompactThemeType)
				)
			);
			break;
		default:
			baseComponents = DefaultComponentsConfigs(baseTheme);
	}

	const components = params?.components
		? merge<BaseThemeComponentsType, UtilsDeepPartial<BaseThemeComponentsType>>(baseComponents, params.components)
		: baseComponents;

	return {
		...baseTheme,
		components
	};
};
