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
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type BaseInputConfigType = {
	boolean: {
		border: string;
		disabled: { activeColor: string; background: string; color: string; hoverColor: string };
		size: number;
		textAlign: string;
		vertAlign: string;
	};
	field: {
		booleanGroupTouch: { background: string; childrenPadding: string; padding: string };
		controlBoolean: { inlineGap: string; margin: string };
		tooltipWidth: string;
	};
	input: {
		addon: { afterMargin: string; beforeMargin: string };
		border: string;
		buttonIconSize: string;
		disabled: { background: string; boxShadow: string; color: string };
		error: {
			activeBoxShadow: string;
			boxShadow: string;
			focusBoxShadow: string;
			customDashedFocus?: CustomBorder;
			hoverBoxShadow: string;
		};
		focusBoxShadow: string;
		customDashedFocus?: CustomBorder;

		/**
		 * @deprecated
		 * use {@link applicationStyles.input.height} instead
		 */
		height: string;
		helperText: { color: string; lineHeight: number; margin: string; fontSize: string; fontFamily: string };
		horizontalSpacing: string;
		info: {
			activeBoxShadow: string;
			boxShadow: string;
			focusBoxShadow: string;
			customDashedFocus?: CustomBorder;
			hoverBoxShadow: string;
		};
		invalidBoxShadow: string;
		labelMargin: string;
		labelGap: string;
		messageMargin: string;
		mobileContentboxPadding: string;
		outlineOffset: string | number;
		padding: string;
		placeholderColor: string;
		popupIconFontSize: string;
		prefixMinWidth: string;
		readonly: { background: string; boxShadow: string };
		tooltipInNewLineMargin: string;
		warning: {
			activeBoxShadow: string;
			boxShadow: string;
			focusBoxShadow: string;
			customDashedFocus?: CustomBorder;
			hoverBoxShadow: string;
		};
	};
	message: {
		error: { background: string; color: string; iconColor: string };
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		iconFontSize: string;
		iconMarginRight: string;
		info: { background: string; color: string; iconColor: string };
		padding: string;
		textListPaddingLeft: string;
		warning: { background: string; color: string; iconColor: string };
	};
	selectionSuffixColor: string;
};

const defaultBaseInputConfig = (theme: BaseThemeCore): BaseInputConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const applicationStyles = theme.applicationStyles;

	return {
		boolean: {
			border: `${theme.border.width.thin} solid ${colors.secondaryColor}`,
			disabled: {
				activeColor: colors.interaction.disabled.colorDark,
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark,
				hoverColor: colors.interaction.disabled.colorDark
			},
			//the "size" variable represents width & height values
			//and using pure number instead of a spacing value
			//so that it can be re-calculated in Checkboxes & Radio
			size: 14,
			textAlign: "left",
			vertAlign: "top"
		},
		field: {
			controlBoolean: {
				margin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacing3xs}px 0`,
				inlineGap: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
			},
			booleanGroupTouch: {
				background: colors.background.secondaryBackground,
				childrenPadding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			tooltipWidth: `${spacing.spacing.spacingMd + spacing.spacing.spacing2xs}px`
		},
		input: {
			addon: {
				afterMargin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				beforeMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`
			},
			border: "none",
			buttonIconSize: `${spacing.spacing.spacingLg}px`,
			disabled: {
				background: colors.interaction.disabled.color,
				boxShadow: `${applicationStyles.input.defaultBorder} ${colors.interaction.disabled.colorDark}`,
				color: colors.interaction.disabled.colorDark
			},
			error: {
				activeBoxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.errorColor}`,
				boxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.errorColor}`,
				focusBoxShadow: `${applicationStyles.input.focusBorder} ${colors.interaction.focus.color}`,
				hoverBoxShadow: `${applicationStyles.input.hoverBorder} ${colors.interaction.hover.color}`
			},
			focusBoxShadow: `${applicationStyles.input.focusBorder} ${colors.interaction.focus.color}`,
			height: applicationStyles.input.height ?? spacing.spacing.spacingLg + "px",
			helperText: {
				color: colors.text.secondaryColorDark,
				fontFamily: typography.font.MAIN_FONT,
				fontSize: typography.fontSize.tinyFontSize,
				lineHeight: theme.typography.lineHeight?.tight,
				margin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0 0 0`
			},
			horizontalSpacing: `${spacing.horizontalSpacing.horizWhiteSpacingsm - 4}px`,
			info: {
				activeBoxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.infoColor}`,
				boxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.infoColor}`,
				focusBoxShadow: `${applicationStyles.input.focusBorder} ${colors.interaction.focus.color}`,
				hoverBoxShadow: `${applicationStyles.input.hoverBorder} ${colors.interaction.hover.color}`
			},
			invalidBoxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.errorColor}`,
			labelMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
			labelGap: `${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			messageMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
			mobileContentboxPadding: `${spacing.verticalSpacing.vertWhiteSpacingmd}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px 0`,
			outlineOffset: 0,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm - 4}px`,
			placeholderColor: colors.secondaryColor,
			popupIconFontSize: typography.fontSize.lgFontSize,
			prefixMinWidth: `${spacing.spacing.spacingLg}px`,
			readonly: {
				background: colors.background.interactiveBackground,
				boxShadow: "none"
			},
			tooltipInNewLineMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
			warning: {
				activeBoxShadow: `${applicationStyles.input.hoverBorder} ${colors.interaction.active.colorTouch}`,
				boxShadow: `${applicationStyles.input.defaultBorder} ${colors.variant.warningColorDark}`,
				focusBoxShadow: `${applicationStyles.input.focusBorder} ${colors.interaction.focus.color}`,
				hoverBoxShadow: `${applicationStyles.input.hoverBorder} ${colors.interaction.hover.color}`
			}
		},
		message: {
			error: {
				background: colors.variant.errorColorLight,
				color: colors.variant.errorColor,
				iconColor: colors.variant.errorColor
			},
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			iconFontSize: typography.fontSize.lgFontSize,
			iconMarginRight: `${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			info: {
				background: colors.variant.infoColorLight,
				color: colors.variant.infoColor,
				iconColor: colors.variant.infoColor
			},
			textListPaddingLeft: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			warning: {
				background: colors.variant.warningColorLight,
				color: colors.variant.text.warning,
				iconColor: colors.variant.warningColor
			}
		},
		selectionSuffixColor: colors.graphicSecondaryColorDark
	};
};

export const baseInputOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		boolean: {
			border: `${theme.border.width.thin} solid ${colors.graphicSecondaryColorDark}`
		},
		input: {
			error: {
				activeBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.errorColor}`,
				focusBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.errorColor}`,
				hoverBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.errorColor}`
			},
			info: {
				activeBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.infoColor}`,
				focusBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.infoColor}`,
				hoverBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.infoColor}`
			},
			outlineOffset: theme.border.width.medium,
			placeholderColor: colors.text.secondaryColorDark,
			popupIconFontSize: typography.fontSize.lgFontSize,
			warning: {
				activeBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.warningColorDark}`,
				focusBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.warningColorDark}`,
				hoverBoxShadow: `0 0 0 ${theme.border.width.medium} ${colors.variant.warningColorDark}`
			}
		}
	};
};

export const baseInputConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultBaseInputConfig(theme), baseInputOverrides(theme));
