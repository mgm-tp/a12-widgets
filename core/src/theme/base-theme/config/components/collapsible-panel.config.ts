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

import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type CollapsiblePanelConfigType = {
	addons: { gap: string };
	content: { color: string };
	fontFamily: string;
	fontSize: string;
	icon: {
		color: string;
		focusColor: string;
		fontSize: string;
	};
	indicator: {
		backgroundColor: string;
		borderRadius: string | number;
		fontSize: string;

		/** @deprecated since 34.4.0, this left value is now calculated internally based on indicator.fontSize.*/
		left: string;
		marginRight: string;

		/** @deprecated since 34.4.0, this top value is now calculated internally based on indicator.fontSize.*/
		top: string;
		width: string;
	};
	label: { marginLeft: string };
	labelInfo: { fontStyle: string; fontWeight: string };
	minHeight: string;
	title: {
		activeBackgroundColor: string;
		activeBoxShadow: string;
		backgroundColor: string;
		color: string;
		focusByTab: { backgroundColor: string; border: string; color: string };
		fontSize: string;
		fontWeight: number;
		hoverBackgroundColor: string;
		hoverBoxShadow: string;
		padding: string;
	};
};

const defaultCollapsiblePanelConfig = (theme: BaseThemeCore): CollapsiblePanelConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;

	const indicatorMarginRight = spacing.horizontalSpacing.horizWhiteSpacing2xs;
	const indicatorFontSize = `calc(${typography.fontSize.mediumFontSize} * 1.2)`;
	const focusTitleColor = colors.interaction.focus.colorInverted;

	return {
		addons: {
			gap: `${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		content: {
			color: colors.text.color
		},
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		icon: {
			color: "inherit",
			fontSize: `calc(${indicatorFontSize})`,
			focusColor: focusTitleColor
		},
		indicator: {
			backgroundColor: "transparent",
			borderRadius: 0,
			fontSize: indicatorFontSize,
			marginRight: `${indicatorMarginRight}px`,
			width: "auto",
			top: `calc((${spacing.verticalSpacing.vertWhiteSpacingsm}px - ${indicatorFontSize}) * 0.5)`,
			left: `calc(0px - ${indicatorFontSize} - ${indicatorMarginRight}px)`
		},
		label: {
			marginLeft: `calc(${indicatorFontSize} + ${indicatorMarginRight}px)`
		},
		labelInfo: {
			fontStyle: "italic",
			fontWeight: `${typography.fontWeight.regularFontWeight}`
		},
		minHeight: `${spacing.spacing.spacingSm * 3}px`,
		title: {
			backgroundColor: colors.secondaryColor,
			color: colors.text.invertedColor,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.boldFontWeight,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			activeBackgroundColor: colors.interaction.active.colorTouch,
			activeBoxShadow: "none",
			hoverBackgroundColor: colors.interaction.hover.color,
			hoverBoxShadow: "none",
			focusByTab: {
				backgroundColor: colors.interaction.focus.color,
				color: focusTitleColor,
				border: focusStyles.focusedBoundaryLight
			}
		}
	};
};

export const collapsiblePanelOverrides = (theme: BaseThemeCore) => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const hoverStyles = theme.hoverStyles;

	const indicatorMarginRight = spacing.horizontalSpacing.horizWhiteSpacing2xs;
	const indicatorFontSize = typography.fontSize.hugeFontSize;

	return {
		title: {
			color: colors.interaction.color,
			fontSize: typography.fontSize.smallFontSize,
			activeBackgroundColor: "transparent",
			activeBoxShadow: hoverStyles.hoverStyleInset,
			hoverBackgroundColor: "transparent",
			hoverBoxShadow: hoverStyles.hoverStyleInset
		},
		indicator: {
			backgroundColor: "transparent",
			borderRadius: spacing.spacing.spacingSm + "px",
			marginRight: `${indicatorMarginRight}px`,
			top: `calc((${spacing.verticalSpacing.vertWhiteSpacingsm}px - ${indicatorFontSize}) * 0.5)`,
			left: `calc(0px - ${indicatorFontSize} - ${indicatorMarginRight}px)`
		},
		label: {
			marginLeft: `calc(${indicatorFontSize} + ${indicatorMarginRight}px)`
		},
		icon: {
			fontSize: indicatorFontSize
		}
	};
};

export const collapsiblePanelConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultCollapsiblePanelConfig(theme), collapsiblePanelOverrides(theme));
