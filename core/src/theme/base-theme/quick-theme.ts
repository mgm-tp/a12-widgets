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

import { darken, lighten } from "polished";

import { getBaseTheme } from "./base-theme.js";
import type { BaseThemeOptions } from "./base-theme.js";
import type { BaseThemeConfig } from "./schema.js";
import { createFontSizeConfig } from "./config/application/font-size.config.js";

/**
 * Intent-named, flat palette that maps to the most common semantic color tokens.
 *
 * Only `primary`, `surface`, `pageBackground`, `border`, `textPrimary`, and the
 * four state colors are required — every other slot is derived from `primary`
 * via HSL transforms when omitted.
 */
export interface QuickThemePalette {
	/** Brand primary color — used for interactive elements (links, buttons, selection). */
	primary: string;

	/** Hover variant of `primary`. Auto-derived (darken 8%) if omitted. */
	primaryHover?: string;

	/** Active/pressed variant of `primary`. Auto-derived (darken 14%) if omitted. */
	primaryActive?: string;

	/** Light surface tint for hover/selected backgrounds. Auto-derived (lighten 35%) if omitted. */
	primaryLight?: string;

	/** Subtle tint of `primary`. Auto-derived (lighten 45%) if omitted. */
	primaryTint?: string;

	/** Card / panel surface background. */
	surface: string;

	/** Outer page background. */
	pageBackground: string;

	/** Background for grouped containers. Falls back to `surface` if omitted. */
	groupBackground?: string;

	/** Sidebar / top-bar background. Falls back to `surface` if omitted. */
	navigationBackground?: string;

	/** Accent color for navigation highlights. Falls back to `primary` if omitted. */
	navigationAccent?: string;

	/** Primary border / divider color. */
	border: string;

	/** Subtler border for low-emphasis dividers. Falls back to `border` if omitted. */
	borderSubtle?: string;

	/** Primary body-text color. */
	textPrimary: string;

	/** Secondary / muted text color. Falls back to `textPrimary` if omitted. */
	textSecondary?: string;

	/** Title / headline text color. Falls back to `textPrimary` if omitted. */
	textTitle?: string;

	/** Success state color. */
	success: string;

	/** Warning state color. */
	warning: string;

	/** Error state color. */
	error: string;

	/** Info state color. */
	info: string;
}

export interface QuickThemeOptions {
	/** Base spacing unit in pixels. Drives spacing.baseSpacing.BASE and all derived spacing scales. */
	spacing?: number;

	/** Base font size (rem). Wired to `typography.font.BASE_FONT_SIZE`. */
	fontSize?: number;

	/** Main font family. Wired to `typography.font`. */
	fontFamily?: string;

	/** Flat, intent-named palette mapped to semantic color tokens. */
	palette?: QuickThemePalette;
}

const paletteToColors = (p: QuickThemePalette): NonNullable<BaseThemeOptions["colors"]> => {
	const groupBg = p.groupBackground ?? p.surface;
	const navBg = p.navigationBackground ?? p.surface;
	const primaryHover = p.primaryHover ?? darken(0.08, p.primary);
	const primaryActive = p.primaryActive ?? darken(0.14, p.primary);
	const primaryLight = p.primaryLight ?? lighten(0.35, p.primary);
	const primaryTint = p.primaryTint ?? lighten(0.45, p.primary);
	const textSecondary = p.textSecondary ?? p.textPrimary;

	return {
		text: {
			color: p.textPrimary,
			secondaryColor: textSecondary,
			secondaryColorDark: textSecondary,
			headlineColor: p.textTitle ?? p.textPrimary,
			titleColor: p.textTitle ?? p.textPrimary,
			placeholderColor: textSecondary
		},
		background: {
			primaryBackground: p.pageBackground,
			secondaryBackground: p.surface,
			tertiaryBackground: groupBg,
			interactiveBackground: p.surface,
			nonInteractiveBackground: p.pageBackground,
			groupBackground: groupBg,
			invertedBackground: navBg,
			navigationBackground: navBg,
			navigationAccent: p.navigationAccent ?? p.primary
		},
		divider: {
			color: p.border,
			colorDark: p.border,
			colorSubtle: p.borderSubtle ?? p.border,
			colorMuted: p.border
		},
		interaction: {
			primaryInteractionColor: p.primary,
			secondaryInteractionColor: p.primary,
			color: p.primary,
			colorDark: primaryHover,
			colorBG: primaryTint,
			colorBGLight: primaryLight,
			hover: {
				color: primaryHover,
				colorLight: primaryLight,
				colorInverted: p.pageBackground
			},
			active: {
				color: primaryActive,
				colorLight: primaryLight,
				colorTouch: p.primary
			},
			selected: {
				color: p.primary,
				colorLight: primaryLight,
				colorInverted: p.pageBackground,
				colorDark: primaryHover
			},
			disabled: {
				color: p.border,
				colorDark: textSecondary,
				colorLight: p.borderSubtle ?? p.border
			},
			draggable: { color: p.primary },
			focus: { color: primaryHover, colorInverted: p.pageBackground, outline: p.textPrimary },
			readonly: { color: p.border, colorDark: p.border }
		},
		variant: {
			errorColor: p.error,
			errorColorDark: p.error,
			constructiveColor: p.success,
			destructiveColor: p.error,
			infoColor: p.info,
			infoColorDark: p.info,
			successColor: p.success,
			successColorDark: p.success,
			warningColor: p.warning,
			warningColorDark: p.warning,
			text: { error: p.pageBackground, warning: p.pageBackground, info: p.pageBackground, success: p.pageBackground }
		}
	};
};

/**
 * Expand a flat `QuickThemeOptions` into a full `BaseThemeOptions` object.
 *
 * The result is spreadable — combine with advanced overrides:
 *
 * ```ts
 * getBaseTheme({
 *   ...buildQuickThemeOptions({ palette }),
 *   components: { button: { ... } }
 * });
 * ```
 */
export const buildQuickThemeOptions = (input: QuickThemeOptions): BaseThemeOptions => {
	const options: BaseThemeOptions = {};

	if (input.palette) {
		options.colors = paletteToColors(input.palette);
	}

	if (input.fontFamily !== undefined || input.fontSize !== undefined) {
		options.typography = {};

		if (input.fontFamily !== undefined) {
			options.typography.font = input.fontFamily;
		}

		if (input.fontSize !== undefined) {
			options.typography.fontSize = createFontSizeConfig(input.fontSize);
		}
	}

	if (input.spacing !== undefined) {
		options.spacing = { base: input.spacing };
	}

	return options;
};

export const getQuickTheme = (input: QuickThemeOptions): BaseThemeConfig => getBaseTheme(buildQuickThemeOptions(input));
