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

export type RadioConfigType = {
	active: { background: string; border: string; checkedBG: string };
	background: string;
	checked: { background: string; border: string; size: string };
	disabled: { background: string; border: string; checkedBG: string };
	error: { border: string; checkedBG: string };
	focus: { border: string; checkedBG: string };
	hover: { background: string; border: string; checkedBG: string };
	info: { border: string; checkedBG: string };
	inputHeight: string;
	label: { color: string; fontFamily: string; fontSize: string; fontWeight: number };
	readOnly: { background: string; border: string; checkedBG: string };
	warning: { border: string; checkedBG: string };
};

const defaultRadioConfig = (theme: BaseThemeCore): RadioConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		active: {
			background: colors.background.primaryBackground,
			border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
			checkedBG: colors.interaction.active.colorTouch
		},
		background: colors.background.primaryBackground,
		checked: {
			background: colors.boxShadowBackground,
			border: `${theme.border.width.medium} solid ${colors.background.primaryBackground}`,
			size: "10px"
		},
		disabled: {
			background: colors.interaction.disabled.color,
			border: `${theme.border.width.thin} solid ${colors.interaction.disabled.colorDark}`,
			checkedBG: colors.interaction.disabled.colorDark
		},
		error: {
			border: `${theme.border.width.thin} solid ${colors.variant.errorColor}`,
			checkedBG: colors.variant.errorColor
		},
		focus: {
			border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
			checkedBG: colors.interaction.focus.color
		},
		hover: {
			background: colors.background.primaryBackground,
			border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
			checkedBG: colors.interaction.hover.color
		},
		info: {
			border: `${theme.border.width.thin} solid ${colors.variant.infoColor}`,
			checkedBG: colors.variant.infoColor
		},
		inputHeight: `${spacing.spacing.spacingMd - 4}px`,
		label: {
			color: colors.text.color,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight
		},
		readOnly: {
			background: colors.interaction.disabled.color,
			border: `${theme.border.width.thin} solid ${colors.interaction.disabled.colorDark}`,
			checkedBG: colors.interaction.disabled.colorDark
		},
		warning: {
			border: `${theme.border.width.thin} solid ${colors.variant.warningColorDark}`,
			checkedBG: colors.variant.warningColorDark
		}
	};
};

export const radioOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		readOnly: {
			border: `${theme.border.width.thin} solid ${colors.graphicSecondaryColorDark}`,
			checkedBG: colors.graphicSecondaryColorDark
		}
	};
};

export const radioConfig = (theme: BaseThemeCore) => mergeConfig(defaultRadioConfig(theme), radioOverrides(theme));
