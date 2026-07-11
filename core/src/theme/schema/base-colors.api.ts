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

export type BaseThemeColorsType = {
	primaryColor: string;
	secondaryColor: string;
	text: {
		headlineColor: string;
		color: string;
		secondaryColor: string;
		secondaryColorDark: string;
		invertedColor: string;
	};
	background: {
		primaryBackground: string;
		secondaryBackground: string;
		interactiveBackground: string;
		nonInteractiveBackground: string;
		invertedBackground: string;
		tertiaryBackground: string;
		groupBackground: string;
		accentBackground: string;
	};
	divider: {
		color: string;
		colorBorder: string;
		colorSubtle: string;
		colorDark: string;
		colorLight: string;
	};
	interaction: {
		primaryInteractionColor: string;
		secondaryInteractionColor: string;
		active: {
			color: string;
			colorLight: string;
			colorTouch: string;
			colorTouchInverted: string;
		};
		selected: {
			color: string;
			colorLight: string;
			colorInverted: string;
			colorDark: string;
		};
		hover: {
			color: string;
			colorInverted: string;
		};
		focus: {
			color: string;
			colorInverted: string;
			outline: string;
		};
		draggable: { color: string };
		disabled: {
			color: string;
			colorDark: string;
			colorLight: string;
		};
		readonly: {
			color: string;
			colorDark: string;
		};
	};
	variant: {
		infoColor: string;
		infoColorLight: string;
		infoColorLighter: string;
		infoColorDark: string;
		successColor: string;
		successColorLight: string;
		successColorDark: string;
		warningColor: string;
		warningColorDark: string;
		warningColorLight: string;
		errorColor: string;
		errorColorDark: string;
		errorColorLight: string;
		constructiveColor: string;
		destructiveColor: string;
		text: {
			info: string;
			success: string;
			warning: string;
			error: string;
		};
	};
	boxShadowBackground: string;
	placeHolderBackgroundDark: string;
	placeHolderBackgroundLight: string;
	graphicSecondaryColorDark: string;
	highlightColor: string;
	highlight: {
		greenColor: string;
		greenBackgroundLight: string;
		greenBackgroundLighter: string;
	};
	status: {
		status1Background: string;
		status2Background: string;
		status3Background: string;
		status2Color: string;
		status3Color: string;
	};
};
