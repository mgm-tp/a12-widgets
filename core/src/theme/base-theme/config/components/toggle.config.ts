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

export type ToggleConfigType = {
	content: {
		active: { border: string; minHeight: string };
		border: string;
		focus: { border: string; minHeight: string; outline: string; customBorder?: CustomBorder };
		horizSpacing: string;
		hover: { border: string; minHeight: string };
		minHeight: string;
		padding: string;
	};
	item: {
		active: { color: string; textDecoration: string };
		background: string;
		border: string;
		color: string;
		disabled: { background: string; color: string };
		focus: { color: string; textDecoration: string };
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		gap: string;
		hover: { color: string; textDecoration: string };
		iconMargin: string;
		lineHeight: number;
		minHeight: string;
		mouseOver: { borderWidth: string };
		borderRadius: string | number;
		readonly: { background: string; color: string };
		selected: {
			active: { background: string; color: string };
			background: string;
			color: string;
			disabled: { background: string; color: string };
			focus: { background: string; color: string };
			hover: { background: string; color: string };
			readonly: { background: string; color: string };
		};
		variant: {
			status1: {
				background: string;
				color: string;
			};
			status2: {
				background: string;
				color: string;
			};
			status3: {
				background: string;
				color: string;
			};
		};
		withOverlay: {
			border: string;
			borderRadius: string;
			selected: {
				background: string;
				border: string;
				borderRadius: string;
				color: string;
				disabled: { background: string; color: string };
				focus: { borderColor: string };
				fontFamily: string;
				fontSize: string;
				fontWeight: number;
				minHeight: string;
				readonly: { background: string; color: string };
			};
		};
	};
};

const defaultToggleConfig = (theme: BaseThemeCore): ToggleConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;
	const itemMinHeight = spacing.spacing.spacingLg;

	return {
		content: {
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			horizSpacing: `${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			minHeight: `${itemMinHeight - 2}px`,
			border: `${theme.border.width.thin} solid transparent`,
			active: {
				border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
				minHeight: `${itemMinHeight}px`
			},
			focus: {
				border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
				minHeight: `${itemMinHeight}px`,
				outline: focusStyles.focusedBoundaryDark
			},
			hover: {
				border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
				minHeight: `${itemMinHeight}px`
			}
		},
		item: {
			minHeight: `${itemMinHeight}px`,
			color: colors.interaction.secondaryInteractionColor,
			background: colors.background.interactiveBackground,
			border: `${theme.border.width.thin} solid ${colors.boxShadowBackground}`,
			borderRadius: `${spacing.spacing.spacing2xs}px`,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			iconMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`,
			lineHeight: theme.typography.lineHeight?.relaxed,

			disabled: {
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			active: {
				color: colors.interaction.active.colorTouch,
				textDecoration: "underline"
			},
			gap: spacing.horizontalSpacing.horizWhiteSpacing3xs + "px",
			hover: {
				color: colors.interaction.hover.color,
				textDecoration: "underline"
			},
			focus: {
				color: colors.interaction.focus.color,
				textDecoration: "underline"
			},
			mouseOver: {
				borderWidth: theme.border.width.medium
			},
			readonly: {
				background: colors.background.interactiveBackground,
				color: colors.text.color
			},
			selected: {
				background: colors.interaction.selected.color,
				color: colors.interaction.selected.colorInverted,
				active: {
					background: colors.interaction.active.colorTouch,
					color: colors.text.invertedColor
				},
				disabled: {
					background: colors.interaction.disabled.colorDark,
					color: colors.interaction.disabled.color
				},
				focus: {
					background: colors.interaction.focus.color,
					color: colors.interaction.focus.colorInverted
				},
				hover: {
					background: colors.interaction.hover.color,
					color: colors.text.invertedColor
				},
				readonly: {
					background: colors.interaction.readonly.colorDark,
					color: colors.text.invertedColor
				}
			},
			variant: {
				status1: {
					color: colors.status.status1Background,
					background: colors.status.status1Background
				},
				status2: {
					color: colors.status.status2Color,
					background: colors.status.status2Background
				},
				status3: {
					color: colors.status.status3Color,
					background: colors.status.status3Background
				}
			},
			withOverlay: {
				border: `${theme.border.width.thin} solid transparent`,
				borderRadius: "inherit",
				selected: {
					background: colors.background.interactiveBackground,
					border: `${theme.border.width.medium} solid transparent`,
					borderRadius: `${spacing.spacing.spacing2xs}px`,
					color: colors.interaction.secondaryInteractionColor,
					disabled: {
						background: colors.interaction.disabled.color,
						color: colors.interaction.disabled.colorDark
					},
					focus: {
						borderColor: colors.interaction.focus.color
					},
					fontFamily: typography.font.MAIN_FONT,
					fontSize: typography.fontSize.tinyFontSize,
					fontWeight: typography.fontWeight.semiBoldFontWeight,
					minHeight: `${itemMinHeight}px`,
					readonly: {
						background: colors.background.interactiveBackground,
						color: colors.text.color
					}
				}
			}
		}
	};
};

export const toggleOverrides = (theme: BaseThemeCore) => {
	const spacing = theme.spacing;
	const colors = theme.colors;

	return {
		content: {
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			horizSpacing: `${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		item: {
			background: colors.interaction.colorBG,
			border: `${theme.border.width.thin} solid ${colors.divider.colorMuted}`,
			borderRadius: theme.border.radius.md,
			withOverlay: {
				selected: {
					background: colors.interaction.colorBG,
					borderRadius: theme.border.radius.md
				}
			}
		}
	};
};

export const toggleConfig = (theme: BaseThemeCore) => mergeConfig(defaultToggleConfig(theme), toggleOverrides(theme));
