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

import { setLightness, rgba } from "polished";
import merge from "deepmerge";

import type { BaseThemeColors } from "../../schema.js";
import type { DeepPartial } from "../../../../common/main/utils.js";

const shared = {
	white: "#fff",
	black: "#16191d",
	black20: "#333",
	black30: "#4d4d4d",

	slateGrey: "#596673",
	slateGreyDark: "#4e5965",
	slateGreyLight: "#b7c0c7",

	grey: "#e2e6e9",
	greyDark: "#a9b3bc",
	greyLight: "#f1f2f4",
	grey98: "#f9fafb",
	grey85: "#d4d9de",
	grey80: "#c6ccd2",
	grey50: "#808080",
	grey55: "#7F8C9B",
	grey43: "#616f7c",

	blue: "#0568ae",
	blueDark: "#056294",
	blueLight: "#b5e4fd",
	blueLighter: "#e5f4ff",
	bluePale: "#f5fbff",

	green: "#297a24",
	greenDark: "#196719",
	greenLight: "#c1f0c1",

	orange: "#b54c17",
	orangeDark: "#b34a00",
	orangeLight: "#ffb580",

	purple: "#6b28d7",
	purpleDark: "#35146c",
	purpleLight: "#c4a9cf",

	red: "#c91d1d",
	redDark: "#9c1616",
	redLight: "#e96363",

	fuchsia: "#d50075",
	fuchsia75: "#ff80c6",

	yellow: "#ffcd29",
	yellowDark: "#dba800",
	yellowLight: "#ffe180",

	amber: "#f9bf30",
	amberDark: "#af7902",
	amberLight: "#fef2da"
} as const;

const extended = {
	grey: "#757575",
	grey78: "#c8c8c8",
	grey59: "#979797",
	grey80: "#cdcdcd",

	red: "#c62828",

	blue: "#0277bd",
	blueDark: "#202e5d",
	blueDark33: "#434f67",
	blue31: "#00589f",
	blue50: "#0087ff",
	blue70: "#80c6ff",
	blue87: "#cddeed",
	blue95: "#ebf1f7",
	blue97: "#f4f7fb",
	blue98: "#f7fafc",
	blueLight: "#f6fafe",

	black: "#333",

	green: "#2e7d32",
	orange: "#ef6c00",
	yellowLight: "#ffffed",

	amber: "#fcce34",
	amberDark: "#ad7d04",
	amberLight: "#fef6db"
} as const;

/**
 * Raw color palette for the tool theme.
 * Advanced consumers (e.g. custom theme factories) may read this to derive their own semantic tokens.
 * Widgets must use semantic tokens (via {@link baseThemeColors}) — not this palette directly.
 */
export const generalPalette = { shared, extended } as const;

/** Shape of the raw color palette consumed by {@link buildSemanticColors}. */
export type PaletteType = {
	shared: Readonly<Record<keyof typeof shared, string>>;
	extended: Readonly<Record<keyof typeof extended, string>>;
};

/** Builds the fully assembled semantic color config from a raw palette. */
export const buildSemanticColors = (palette: PaletteType): BaseThemeColors => {
	const { shared, extended } = palette;

	const defaultSemanticColors = {
		primaryColor: shared.slateGreyDark,
		secondaryColor: shared.slateGrey,

		text: {
			color: shared.black30,
			secondaryColor: shared.grey,
			secondaryColorDark: shared.grey43,
			invertedColor: shared.white,
			headlineColor: shared.black
		},

		background: {
			primaryBackground: shared.white,
			secondaryBackground: shared.greyLight,
			tertiaryBackground: shared.grey,
			interactiveBackground: shared.greyLight,
			nonInteractiveBackground: shared.grey98,
			invertedBackground: shared.white,
			groupBackground: "#DDDDDD",
			accentBackground: shared.yellowLight
		},

		divider: {
			color: shared.grey,
			colorDark: shared.greyDark,
			colorLight: shared.white,
			colorSubtle: "#D3D6DC"
		},

		interaction: {
			primaryInteractionColor: shared.green,
			secondaryInteractionColor: shared.blue,
			active: {
				color: shared.orange,
				colorLight: shared.orangeLight,
				colorTouch: shared.fuchsia,
				colorTouchInverted: shared.white
			},
			disabled: {
				color: shared.grey,
				colorDark: shared.greyDark,
				colorLight: shared.greyLight
			},
			draggable: { color: shared.orange },
			focus: {
				color: shared.fuchsia,
				colorInverted: shared.white,
				outline: shared.black20
			},
			hover: {
				color: shared.fuchsia,
				colorInverted: shared.white
			},
			selected: {
				color: setLightness(0.35, shared.blue),
				colorLight: shared.bluePale,
				colorInverted: shared.white,
				colorDark: "#2c333a"
			},
			readonly: {
				color: shared.greyDark,
				colorDark: shared.grey43
			}
		},

		variant: {
			errorColor: shared.red,
			errorColorDark: shared.red,
			errorColorLight: setLightness(0.95, shared.red),
			constructiveColor: shared.green,
			destructiveColor: shared.red,
			infoColor: shared.blue,
			infoColorDark: shared.blue,
			infoColorLight: setLightness(0.95, shared.blue),
			infoColorLighter: shared.blueLighter,
			successColor: shared.green,
			successColorDark: shared.green,
			successColorLight: setLightness(0.95, shared.green),
			warningColor: shared.amber,
			warningColorDark: shared.amberDark,
			warningColorLight: shared.amberLight,
			text: {
				error: shared.white,
				warning: shared.black,
				info: shared.white,
				success: shared.white
			}
		},

		graphicSecondaryColorDark: shared.grey55,

		placeHolderBackgroundDark: shared.slateGreyDark,
		placeHolderBackgroundLight: shared.slateGreyLight,
		boxShadowBackground: shared.black,

		highlightColor: "#079ae9",
		highlight: {
			greenColor: "#067B6F",
			greenBackgroundLighter: "#F0F7F6",
			greenBackgroundLight: "#E8F3F2"
		},
		status: {
			status1Background: "#EBF5FD",
			status2Background: "#C5E9AA",
			status3Background: "#F7E455",
			status2Color: "#3F572F",
			status3Color: "#725D35"
		}
	} satisfies DeepPartial<BaseThemeColors>;

	const semanticOverrides = {
		primaryColor: shared.white,
		secondaryColor: extended.blue95,

		text: {
			color: extended.black,
			titleColor: extended.blueDark,
			placeholderColor: shared.black30
		},

		background: {
			secondaryBackground: extended.blue98,
			groupBackground: extended.blue95
		},

		divider: {
			colorSubtle: "#becfe2"
		},

		interaction: {
			color: extended.blue31,
			colorDark: extended.blueDark33,
			colorBG: extended.blue95,
			colorBGLight: extended.blue98,
			primaryInteractionColor: extended.blue31,
			secondaryInteractionColor: extended.blue31,
			active: {
				color: shared.fuchsia,
				colorLight: shared.fuchsia75,
				colorTouch: extended.blue31
			},
			draggable: { color: extended.blue31 },
			focus: {
				outline: "none"
			},
			hover: {
				color: extended.blue31,
				colorLight: extended.blue70,
				colorInverted: shared.white
			},
			selected: {
				color: extended.blue31,
				colorLight: shared.bluePale,
				colorDark: extended.blue31
			}
		},

		variant: {
			errorColor: extended.red,
			errorColorDark: extended.red,
			errorColorLight: setLightness(0.95, extended.red),
			destructiveColor: extended.red,
			infoColor: extended.blue,
			infoColorDark: extended.blue,
			infoColorLight: extended.blueLight,
			successColor: extended.green,
			successColorDark: extended.green,
			warningColor: extended.amber,
			warningColorDark: extended.amberDark,
			warningColorLight: extended.amberLight
		}
	} satisfies DeepPartial<BaseThemeColors>;

	const linkedExtensions = {
		background: {
			navigationBackground: extended.blueLight,
			navigationAccent: extended.blue87,
			overlayLight: "rgba(255, 255, 255, 0.4)"
		},
		divider: {
			colorMuted: extended.grey80,
			colorBorder: extended.grey78
		},
		interaction: {
			touchOverlay: "rgba(0, 0, 0, 0.2)",
			touchOverlayDark: "rgba(0, 0, 0, 0.4)"
		},
		shadow: {
			overlayFaint: rgba(shared.black, 0.12),
			overlaySoft: rgba(shared.black, 0.2),
			overlayMid: rgba(shared.black, 0.3),
			overlayDark: rgba(shared.black, 0.4),
			overlayDeep: rgba(shared.black, 0.8)
		}
	} satisfies DeepPartial<BaseThemeColors>;

	return merge.all([defaultSemanticColors, semanticOverrides, linkedExtensions]) as BaseThemeColors;
};

/** Fully assembled semantic color config */
export const baseThemeColors = buildSemanticColors(generalPalette);
