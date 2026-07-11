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

import type { DeepPartial } from "../../common/main/utils.js";

import type { BaseSpacing, Spacing, HorizontalSpacing, VerticalSpacing } from "../schema/spacing.api.js";
import type { BaseThemeComponentsType } from "../schema/components.api.js";
import type { FontSize } from "../schema/typography.api.js";
import type { BorderConfig } from "../schema/border.api.js";
import type { OpacityConfig } from "../schema/opacity.api.js";
import type { MotionConfig } from "../schema/motion.api.js";
import type { InputStyle } from "../schema/base-input-styles.api.js";

import type { BaseThemeColors, BaseThemeConfig, BaseThemeCore } from "./schema.js";
import {
	baseThemeColors,
	FontConfig,
	BaseInputStyles,
	BaseSpacingConfig,
	FontSizeConfig,
	FontWeightConfig,
	SpacingConfig,
	HorizontalSpacingConfig,
	VerticalSpacingConfig,
	ApplicationStyles,
	applicationStylesOverrides,
	DivisionLineStyles,
	divisionLineStylesOverrides,
	buildFocusStyles,
	buildHoverStyles,
	BorderTokens,
	MotionTokens,
	OpacityTokens,
	LineHeightConfig,
	BaseThemeComponentsConfigs
} from "./config/index.js";
import { mergeConfig } from "./utils/merge-config.js";

export interface SpacingOverrides {
	base?: number;
	baseSpacing?: Partial<BaseSpacing>;
	spacing?: Partial<Spacing>;
	horizontalSpacing?: Partial<HorizontalSpacing>;
	verticalSpacing?: Partial<VerticalSpacing>;
}

export interface TypographyOverrides {
	/** Override the main font family. */
	font?: string;

	/** Override individual font size tokens. */
	fontSize?: Partial<FontSize>;
}

export interface BaseThemeOptions {
	/** Base input style overrides (box-shadow patterns, line-height). Merged into the default input styles. */
	baseInputStyles?: Partial<InputStyle>;

	/**
	 * Semantic color token overrides merged into the default colors.
	 * Use `buildSemanticColors(customPalette)` to regenerate semantic tokens from a custom palette.
	 */
	colors?: DeepPartial<BaseThemeColors>;

	/**
	 * Component theme overrides merged into the generated component map.
	 * Keys are component names (e.g. `button`, `accordion`).
	 */
	components?: DeepPartial<BaseThemeComponentsType>;

	/** Typography token overrides (e.g. font families, font sizes). */
	typography?: TypographyOverrides;

	/** Spacing token overrides. */
	spacing?: SpacingOverrides;

	/** Border width and radius token overrides. Merged into the default border scale. */
	border?: DeepPartial<BorderConfig>;

	/** Motion duration and easing token overrides. Merged into the default motion scale. */
	motion?: DeepPartial<MotionConfig>;

	/** Opacity token overrides. Merged into the default opacity scale. */
	opacity?: DeepPartial<OpacityConfig>;
}

export const getBaseTheme = (options?: BaseThemeOptions): BaseThemeConfig => {
	const colors: BaseThemeColors = options?.colors ? mergeConfig(baseThemeColors, options.colors) : baseThemeColors;

	const fontFamily = options?.typography?.font;
	const font = fontFamily ? { ...FontConfig, MAIN_FONT: fontFamily } : FontConfig;
	const fontSizeDefaults = FontSizeConfig(font);
	const fontSizeOverride = options?.typography?.fontSize;
	const fontSize = fontSizeOverride ? merge(fontSizeDefaults, fontSizeOverride) : fontSizeDefaults;
	const typography = {
		font,
		fontSize,
		fontWeight: FontWeightConfig,
		lineHeight: LineHeightConfig
	};

	const baseSpacing = options?.spacing?.base ?? BaseSpacingConfig.BASE;
	const spacingDefaults = {
		baseSpacing: {
			BASE: baseSpacing,
			BASE_HORIZONTAL_WHITE_SPACING: baseSpacing,
			BASE_VERTICAL_WHITE_SPACING: baseSpacing
		},
		spacing: SpacingConfig(baseSpacing),
		horizontalSpacing: HorizontalSpacingConfig(baseSpacing),
		verticalSpacing: VerticalSpacingConfig(baseSpacing)
	};

	const { spacing: spacingOptions } = options ?? {};
	const spacing = spacingOptions ? mergeConfig(spacingDefaults, spacingOptions) : spacingDefaults;

	const focusStyles = buildFocusStyles({ colors });
	const hoverStyles = buildHoverStyles({ colors });
	const applicationStyles = merge(
		ApplicationStyles({ colors, typography, spacing }),
		applicationStylesOverrides({ colors, hoverStyles })
	);
	const baseInputStyles = options?.baseInputStyles
		? { ...BaseInputStyles, ...options.baseInputStyles }
		: BaseInputStyles;
	const divisionLineStyles = mergeConfig(DivisionLineStyles({ colors }), divisionLineStylesOverrides);
	const border = options?.border ? mergeConfig(BorderTokens, options.border) : BorderTokens;
	const motion = options?.motion ? mergeConfig(MotionTokens, options.motion) : MotionTokens;
	const opacity = options?.opacity ? mergeConfig(OpacityTokens, options.opacity) : OpacityTokens;

	const baseTheme: BaseThemeCore = {
		colors,
		typography,
		spacing,
		applicationStyles,
		focusStyles,
		hoverStyles,
		baseInputStyles,
		divisionLineStyles,
		border,
		motion,
		opacity
	};

	const components = options?.components
		? mergeConfig(BaseThemeComponentsConfigs(baseTheme), options.components)
		: BaseThemeComponentsConfigs(baseTheme);

	return {
		...baseTheme,
		components
	};
};
