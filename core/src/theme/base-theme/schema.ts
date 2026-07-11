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

import type { BaseThemeComponents } from "../schema/components.api.js";
import type { BaseThemeColorsType } from "../schema/base-colors.api.js";
import type { ApplicationStyle, DivisionLineStyle } from "../schema/application-styles.api.js";
import type { FocusStyle } from "../schema/focus.api.js";
import type { InputStyle } from "../schema/base-input-styles.api.js";
import type { BaseThemeSpacingType } from "../schema/spacing.api.js";
import type { BaseThemeTypographyType } from "../schema/typography.api.js";
import type { BorderConfig } from "../schema/border.api.js";
import type { MotionConfig } from "../schema/motion.api.js";
import type { OpacityConfig } from "../schema/opacity.api.js";

export interface BaseThemeBaseConfig extends BaseThemeComponents {
	colors: BaseThemeColors;
	typography: BaseThemeTypographyType;
	spacing: BaseThemeSpacingType;
	applicationStyles: ApplicationStyle;
	divisionLineStyles: DivisionLineStyle;
	focusStyles: FocusStyle;
	baseInputStyles: InputStyle;
	border: BorderConfig;
	motion: MotionConfig;
	opacity: OpacityConfig;
}

/** Extended colors type — adds the base-theme-specific tokens */
export interface BaseThemeColors extends BaseThemeColorsType {
	text: BaseThemeColorsType["text"] & { titleColor: string; placeholderColor: string };
	background: BaseThemeColorsType["background"] & {
		navigationBackground: string;
		navigationAccent: string;
		overlayLight: string;
	};
	divider: BaseThemeColorsType["divider"] & {
		colorMuted: string;
	};
	interaction: BaseThemeColorsType["interaction"] & {
		color: string;
		colorDark: string;
		colorBG: string;
		colorBGLight: string;
		hover: { colorLight: string };

		/** Semi-transparent dark overlay for inverted interactive states */
		touchOverlay: string;

		/** Darker overlay for activated inverted states */
		touchOverlayDark: string;
	};
	shadow: {
		overlayFaint: string;
		overlaySoft: string;
		overlayMid: string;
		overlayDark: string;
		overlayDeep: string;
	};
}

/** Hover styles shape */
export interface BaseThemeHoverStyles {
	hoverStyle: string;
	hoverStyleInset: string;
	invertHoverStyle: string;
}

export interface BaseThemeConfig extends BaseThemeBaseConfig {
	colors: BaseThemeColors;
	hoverStyles: BaseThemeHoverStyles;
}

/** Base theme without `components` — used during incremental assembly inside `getBaseTheme`. */
export type BaseThemeCore = Omit<BaseThemeConfig, "components">;
