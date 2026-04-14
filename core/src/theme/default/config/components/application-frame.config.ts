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

import { commonButtonConfigs } from "./button.config.js";

export type ApplicationFrameConfigType = {
	background: string;
	content: { position: string };
	header: { boxShadow: string; minHeight: string };
	mainContainer: { padding: string; fontSize: string };
	sidebar: {
		background: string;
		boxShadow: string;
		containerBackground: string;
		containerBorderRight?: string;

		/**
		 * Minimum width constraint for the sidebar in expanded-minimized state (non-resizable).
		 * This works together with `expandedMinimizedWidth` as a safety floor value.
		 */
		expandedMinimizedMinWidth: string;

		/**
		 * Target width for the sidebar in expanded-minimized state.
		 * This ensures the sidebar doesn't become too narrow on small screens.
		 * The value uses a percentage of screen width {@default "30%"} to adapt to different screen sizes.
		 *
		 * Note: This applies when {@link ApplicationFrameProps.subExpandedState}="minimized" and {@link ApplicationFrameProps.subExpanded}={true}.
		 */
		expandedMinimizedWidth: string;

		/**
		 * Width of the sidebar when fully expanded.
		 */
		expandedWidth: string;
		width: string;
		paddingBottom: string;
		scrollableWidth: string;
		transition: string;
	};
	trigger: {
		color: string;
		fontSize: string;
		height: string;
		iconPadding: string;
		background: string;
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
		mobile: {
			background: string;
			bottom: string;
			boxShadow: string;
			collapsedFontSize: string;
			color: string;
			right: string;
			size: string;
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
			};
		};
	};
};

export const applicationFrameConfig = (theme: BaseThemeType): ApplicationFrameConfigType => {
	const { colors, spacing, typography, focusStyles } = theme;
	const buttonConfigs = commonButtonConfigs(theme);

	return {
		background: colors.background.secondaryBackground,
		content: {
			position: "relative"
		},
		header: {
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
			minHeight: `${3 * spacing.baseSpacing.BASE}px`
		},
		sidebar: {
			background: colors.primaryColor,
			boxShadow: `0 1px 4px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
			containerBackground: colors.background.primaryBackground,
			containerBorderRight: "none",
			expandedMinimizedMinWidth: `${4.5 * spacing.spacing.spacing2Xl}px`,
			expandedMinimizedWidth: "30%",
			expandedWidth: `${spacing.spacing.spacing2Xl + 128}px`,
			paddingBottom: `${spacing.verticalSpacing.vertWhiteSpacing2xl}px`,
			scrollableWidth: `${4.3 * spacing.baseSpacing.BASE}px`,
			transition: "0.3s",
			width: `${spacing.spacing.spacingXl}px`
		},
		mainContainer: {
			fontSize: typography.fontSize.mediumFontSize,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingmd}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
		},
		trigger: {
			background: "transparent",
			color: colors.text.invertedColor,
			fontSize: `${2.5 * typography.font.BASE_FONT_SIZE}rem`,
			height: `${spacing.spacing.spacingXl}px`,
			iconPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			mobile: {
				background: colors.interaction.secondaryInteractionColor,
				bottom: `${spacing.verticalSpacing.vertWhiteSpacingmd}px`,
				boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
				color: colors.text.invertedColor,
				right: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
				size: `${2 * spacing.spacing.spacingMd}px`,
				collapsedFontSize: `${1.75 * typography.font.BASE_FONT_SIZE}rem`,
				interaction: {
					active: {
						background: colors.interaction.active.colorTouchInverted,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						borderColor: colors.interaction.active.colorTouch,
						color: colors.interaction.active.colorTouch
					},
					focus: {
						background: colors.interaction.active.colorTouchInverted,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						borderColor: colors.interaction.focus.color,
						color: colors.interaction.focus.color,
						outline: focusStyles.focusedBoundaryLight
					}
				}
			},
			interaction: {
				active: {
					background: "transparent",
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					borderColor: colors.interaction.active.colorTouchInverted,
					color: colors.interaction.active.colorTouchInverted
				},
				focus: {
					background: "transparent",
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					borderColor: colors.interaction.focus.colorInverted,
					color: colors.interaction.focus.colorInverted,
					outline: focusStyles.focusedBoundaryLight
				},
				hover: {
					background: "transparent",
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					borderColor: colors.interaction.hover.colorInverted,
					color: colors.interaction.hover.colorInverted
				}
			}
		}
	};
};
