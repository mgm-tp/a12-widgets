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

import { rgba } from "polished";

import type { BaseThemeType } from "../../../schema/base-theme.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";

import { commonButtonConfigs } from "./button.config.js";

export type DateTimePickerConfigType = {
	dateScreen: {
		datePicker: { body: { padding: string }; weekDay: { padding: string } };
		padding: string;
		timePicker: {
			padding: string;
			timeDisplay: { fontStyle: string; fontWeight: number; padding: string };
			timeInputMaxWidth: string;
		};
	};
	headerActionButton: {
		background: string;
		color: string;
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor: string;
				color: string;
				outline: string;
			};
			hover: {
				background: string;
				border: string;
				borderColor: string;
				color: string;
			};
		};
	};
	input?: {
		focus?: {
			customBorder?: CustomBorder;
		};
	};
};

export const dateTimePickerConfig = (theme: BaseThemeType): DateTimePickerConfigType => {
	const { spacing, typography, colors, focusStyles } = theme;
	const buttonConfigs = commonButtonConfigs(theme);

	return {
		dateScreen: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px 0`,
			datePicker: {
				body: {
					padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm - 2}px ${
						spacing.verticalSpacing.vertWhiteSpacing2xs
					}px`
				},
				weekDay: {
					padding: `${spacing.verticalSpacing.vertWhiteSpacingsm + 0.5}px 0 ${
						spacing.horizontalSpacing.horizWhiteSpacing2xs + spacing.horizontalSpacing.horizWhiteSpacingxs + 0.5
					}px`
				}
			},
			timePicker: {
				timeDisplay: {
					fontStyle: "italic",
					fontWeight: typography.fontWeight.semiBoldFontWeight,
					padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`
				},
				timeInputMaxWidth: `${spacing.baseSpacing.BASE + 144}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${
					1.25 * spacing.horizontalSpacing.horizWhiteSpacingsm
				}px`
			}
		},
		headerActionButton: {
			background: "transparent",
			color: colors.text.invertedColor,
			interaction: {
				active: {
					background: rgba(0, 0, 0, 0.2),
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					borderColor: colors.interaction.active.colorTouchInverted,
					color: colors.interaction.active.colorTouchInverted
				},
				focus: {
					background: rgba(0, 0, 0, 0.2),
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					borderColor: colors.interaction.focus.colorInverted,
					color: colors.interaction.focus.colorInverted,
					outline: focusStyles.focusedBoundaryLight
				},
				hover: {
					background: rgba(0, 0, 0, 0.2),
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					borderColor: colors.interaction.hover.colorInverted,
					color: colors.interaction.hover.colorInverted
				}
			}
		}
	};
};
