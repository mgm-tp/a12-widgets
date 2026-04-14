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

import { GeneralColorsConfig } from "../../../base/colors.config.js";
import type { BaseThemeColorsType } from "../../../schema/base-colors.api.js";

export const DefaultColorsConfig: BaseThemeColorsType = {
	/**
	 * Defines the overall Look&Feel.
	 * Major Primary Color which reflects the identity.
	 * Usage in Application header, Content headings etc.
	 */
	primaryColor: GeneralColorsConfig.slateGreyDark,

	/**
	 * Supportive primary color, indicating the second level of information, splitting primary information for an better overview.
	 * Used in Main menu, tab navigation etc.
	 */
	secondaryColor: GeneralColorsConfig.slateGrey,

	/**
	 *  TEXT COLORS
	 */
	text: {
		color: GeneralColorsConfig.black30,

		/**
		 * Used for captions, fine print, less important copy.
		 */
		secondaryColor: GeneralColorsConfig.grey,

		secondaryColorDark: GeneralColorsConfig.grey43,

		/**
		 * Used for text on dark backgrounds.
		 */
		invertedColor: GeneralColorsConfig.white,

		/**
		 * Used for the text on the base headline to make a better contrast for the content.
		 */
		headlineColor: GeneralColorsConfig.black
	},

	/**
	 *  BACKGROUND COLORS
	 */
	background: {
		/**
		 * Used as background for main content, such as the content area of content boxes.
		 */
		primaryBackground: GeneralColorsConfig.white,

		/**
		 * Used for body background or for a slight visual separation from primary backgrounds.
		 */
		secondaryBackground: GeneralColorsConfig.greyLight,

		/**
		 * Used as a third option if to further separate content from primary or secondary backgrounds.
		 */
		tertiaryBackground: GeneralColorsConfig.grey,

		/**
		 * Used to support interactive elements.
		 */
		interactiveBackground: GeneralColorsConfig.greyLight,

		/**
		 * Used to support non-interactive elements.
		 */
		nonInteractiveBackground: GeneralColorsConfig.grey98,

		/**
		 * Used for supporting contrary elements.
		 */
		invertedBackground: GeneralColorsConfig.white,

		/**
		 * The group background is used to support elements that group other elements.
		 */
		groupBackground: "#DDDDDD"
	},

	/**
	 * Used as divider in lists, border, etc.
	 */
	divider: {
		color: GeneralColorsConfig.grey,
		colorDark: GeneralColorsConfig.greyDark,
		colorLight: GeneralColorsConfig.white,
		colorSubtle: "#D3D6DC"
	},

	/**
	 * SEMANTIC COLORS, for example: primary, secondary, states of the component: hover, focus, active,...
	 */
	interaction: {
		/**
		 * Used for the most prominent action on each screen.
		 */
		primaryInteractionColor: GeneralColorsConfig.green,

		/**
		 * Used for the second prominent action on each screen.
		 */
		secondaryInteractionColor: GeneralColorsConfig.blue,
		active: {
			color: GeneralColorsConfig.orange,
			colorLight: GeneralColorsConfig.orangeLight,
			colorTouch: GeneralColorsConfig.fuchsia,
			colorTouchInverted: GeneralColorsConfig.white
		},
		disabled: {
			color: GeneralColorsConfig.grey,
			colorDark: GeneralColorsConfig.greyDark,
			colorLight: GeneralColorsConfig.greyLight
		},
		draggable: { color: GeneralColorsConfig.orange },
		focus: {
			color: GeneralColorsConfig.fuchsia,
			colorInverted: GeneralColorsConfig.white,
			outline: GeneralColorsConfig.black20
		},
		hover: {
			color: GeneralColorsConfig.fuchsia,
			colorInverted: GeneralColorsConfig.white
		},
		selected: {
			color: setLightness(0.35, GeneralColorsConfig.blue),
			colorLight: GeneralColorsConfig.bluePale,
			colorInverted: GeneralColorsConfig.white,
			colorDark: "#2c333a"
		},
		readonly: {
			color: GeneralColorsConfig.greyDark,
			colorDark: GeneralColorsConfig.grey43
		}
	},

	/**
	 * Variants of the component: error, success, info, warning,...
	 */
	variant: {
		errorColor: GeneralColorsConfig.red,
		errorColorDark: GeneralColorsConfig.red,
		errorColorLight: setLightness(0.95, GeneralColorsConfig.red),

		constructiveColor: GeneralColorsConfig.green,

		destructiveColor: GeneralColorsConfig.red,

		infoColor: GeneralColorsConfig.blue,
		infoColorDark: GeneralColorsConfig.blue,
		infoColorLight: setLightness(0.95, GeneralColorsConfig.blue),
		infoColorLighter: GeneralColorsConfig.blueLighter,

		successColor: GeneralColorsConfig.green,
		successColorDark: GeneralColorsConfig.green,
		successColorLight: setLightness(0.95, GeneralColorsConfig.green),

		warningColor: GeneralColorsConfig.amber,
		warningColorDark: GeneralColorsConfig.amberDark,
		warningColorLight: GeneralColorsConfig.amberLight,

		text: {
			error: GeneralColorsConfig.white,
			warning: GeneralColorsConfig.black,
			info: GeneralColorsConfig.white,
			success: GeneralColorsConfig.white
		}
	},

	/**
	 * Used for icon.
	 */
	graphicSecondaryColorDark: GeneralColorsConfig.grey55,

	// ---------------- DECORATION COLORS ----------------

	placeHolderBackgroundDark: GeneralColorsConfig.slateGreyDark,
	placeHolderBackgroundLight: GeneralColorsConfig.slateGreyLight,

	boxShadowBackground: GeneralColorsConfig.black,

	// ---------------- HIGHLIGHT COLORS ----------------
	highlightColor: "#079ae9",

	/**
	 * Used for highlighting Table “Variant”.
	 */
	highlight: {
		greenColor: "#067B6F",
		greenBackgroundLighter: "#F0F7F6",
		greenBackgroundLight: "#E8F3F2"
	},

	/**
	 * Used for Simple Toggle Button.
	 */
	status: {
		status1Background: "#EBF5FD",
		status2Background: "#C5E9AA",
		status3Background: "#F7E455",
		status2Color: "#3F572F",
		status3Color: "#725D35"
	}
};
