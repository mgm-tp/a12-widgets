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

import type { FlatThemeType } from "../../../schema.js";
import { FontConfig } from "../../../default/config/base/fonts.config.js";
import { commonButtonConfigs } from "../../../default/config/components/button.config.js";

export const contentBoxFlatConfig = (theme: FlatThemeType) => {
	const { colors, spacing, focusStyles } = theme;
	const horizontalSpacing = spacing.horizontalSpacing.horizWhiteSpacingxl;
	const buttonConfigs = commonButtonConfigs(theme);

	return {
		contentBoxBG: "unset",
		contentBoxBorderRadius: "8px",
		contentBoxHeaderMinHeight: `${3 * spacing.baseSpacing.BASE}px`,
		contentBoxBoxShadow: "none",
		contentBoxHorizontalPadding: `${horizontalSpacing}px`,
		heading: {
			background: colors.background.invertedBackground,
			borderBottom: "none",
			borderRadius: "8px 8px 0 0",
			paddingTop: "0",
			paddingBottom: "0",
			paddingLeft: `${horizontalSpacing}px`,
			paddingRight: `${horizontalSpacing}px`
		},
		headingAddon: {
			navButtonColor: colors.interaction.color
		},
		headingActionButton: {
			activated: {
				background: "transparent",
				borderRadius: "50%",
				color: colors.interaction.active.color,
				interaction: {
					active: {
						background: "transparent",
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						borderColor: buttonConfigs.buttonActiveColor
					},
					focus: {
						background: "transparent",
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						borderColor: buttonConfigs.buttonFocusColor,
						outline: focusStyles.focusedBoundaryDark
					},
					hover: {
						background: "transparent",
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
						borderColor: buttonConfigs.buttonHoverColor
					}
				}
			},
			color: colors.interaction.secondaryInteractionColor,
			interaction: {
				active: {
					background: "transparent",
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					borderColor: buttonConfigs.buttonActiveColor
				},
				focus: {
					background: "transparent",
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					borderColor: buttonConfigs.buttonFocusColor,
					outline: focusStyles.focusedBoundaryDark
				},
				hover: {
					background: "transparent",
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					borderColor: buttonConfigs.buttonHoverColor
				}
			}
		},
		content: {
			borderRadius: "0 0 8px 8px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxl}px ${horizontalSpacing}px `
		},
		title: {
			color: colors.text.color,
			fontSize: 1.3 * FontConfig.BASE_FONT_SIZE + "rem"
		},
		subHeading: {
			borderBottom: `1px solid ${colors.primaryColor}`,
			breadcrumbListPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing}px`,
			filterBar: {
				padding: `0 ${horizontalSpacing}px`
			}
		},
		actionBar: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing}px`
		},
		actionBarGroup: {
			secondLevelButton: {
				border: `2px solid ${colors.text.invertedColor}`,
				disabledBorder: `2px solid ${colors.interaction.disabled.color}`
			}
		},
		subActionBar: {
			background: colors.background.invertedBackground,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing}px`
		},
		transitionActionBarItem: {
			borderBottom: `1px solid ${colors.primaryColor}`
		},
		footer: {
			borderTop: "none",
			borderBottom: "none",
			minHeight: spacing.spacing.spacingXl + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing}px`,
			borderRadius: "0 0 8px 8px"
		},
		tile: {
			heading: {
				minHeight: `3 * ${spacing.baseSpacing.BASE}px`
			}
		}
	};
};
