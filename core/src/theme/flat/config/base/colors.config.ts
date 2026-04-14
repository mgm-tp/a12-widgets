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

import { setLightness } from "polished";
import merge from "deepmerge";

import { GeneralColorsConfig } from "../../../base/colors.config.js";
import type { BaseThemeColorsType } from "../../../schema/base-colors.api.js";
import { DefaultColorsConfig } from "../../../default/config/base/colors.config.js";

export const GeneralFlatColorsConfig = {
	/*------------------------------------*\
      #GENERAL COLOR PALETTE
    \*------------------------------------*/
	grey: "#757575",
	grey78: "#c8c8c8",
	grey59: "#979797",
	grey80: "#cdcdcd",

	// Red
	red: "#c62828",

	// Blue
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

	// Black
	black: "#333",

	green: "#2e7d32",
	orange: "#ef6c00",
	yellowLight: "#ffffed",

	// Amber
	amber: "#fcce34",
	amberDark: "#ad7d04",
	amberLight: "#fef6db"
};

export interface FlatColorsConfigType extends BaseThemeColorsType {
	text: BaseThemeColorsType["text"] & { titleColor: string; placeholderColor: string };
	interaction: BaseThemeColorsType["interaction"] & {
		color: string;
		colorDark: string;
		colorBG: string;
		colorBGLight: string;
		hover: { colorLight: string };
	};
}

export const FlatColorsConfig: FlatColorsConfigType = merge(DefaultColorsConfig, {
	primaryColor: GeneralColorsConfig.white,
	secondaryColor: GeneralFlatColorsConfig.blue95,

	text: {
		color: GeneralFlatColorsConfig.black,

		titleColor: GeneralFlatColorsConfig.blueDark,

		placeholderColor: GeneralColorsConfig.black30
	},
	background: {
		secondaryBackground: GeneralFlatColorsConfig.blue98,

		groupBackground: "#EBF1F7"
	},
	divider: {
		colorSubtle: "#becfe2"
	},
	interaction: {
		color: GeneralFlatColorsConfig.blue31,
		colorDark: GeneralFlatColorsConfig.blueDark33,
		colorBG: GeneralFlatColorsConfig.blue95,
		colorBGLight: GeneralFlatColorsConfig.blue98,
		primaryInteractionColor: GeneralFlatColorsConfig.blue31,
		secondaryInteractionColor: GeneralFlatColorsConfig.blue31,
		active: {
			color: GeneralColorsConfig.fuchsia,
			colorLight: GeneralColorsConfig.fuchsia75,
			colorTouch: GeneralFlatColorsConfig.blue31
		},
		draggable: { color: GeneralFlatColorsConfig.blue31 },
		focus: {
			outline: "none"
		},
		hover: {
			color: GeneralFlatColorsConfig.blue31,
			colorLight: GeneralFlatColorsConfig.blue70,
			colorInverted: GeneralColorsConfig.white
		},
		selected: {
			color: GeneralFlatColorsConfig.blue31,
			colorLight: GeneralColorsConfig.bluePale,
			colorDark: GeneralFlatColorsConfig.blue31
		}
	},
	variant: {
		errorColor: GeneralFlatColorsConfig.red,
		errorColorDark: GeneralFlatColorsConfig.red,
		errorColorLight: setLightness(0.95, GeneralFlatColorsConfig.red),
		destructiveColor: GeneralFlatColorsConfig.red,
		infoColor: GeneralFlatColorsConfig.blue,
		infoColorDark: GeneralFlatColorsConfig.blue,
		infoColorLight: GeneralFlatColorsConfig.blueLight,
		successColor: GeneralFlatColorsConfig.green,
		successColorDark: GeneralFlatColorsConfig.green,
		warningColor: GeneralFlatColorsConfig.amber,
		warningColorDark: GeneralFlatColorsConfig.amberDark,
		warningColorLight: GeneralFlatColorsConfig.amberLight
	}
});
