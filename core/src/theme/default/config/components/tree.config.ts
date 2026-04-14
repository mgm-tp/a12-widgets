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

import { rgba, setLightness } from "polished";

import type { BaseThemeType } from "../../../schema/base-theme.js";

export type TreeConfigType = {
	actionButtons: { gap: string; padding: string };
	dropHint: { background: string; forbidden: { background: string; border: string }; openedBorder: string };
	hintHeight: string;
	insertHint: { background: string; border: string; focus: { background: string; border: string } };
	node: { indentPaddingLeft: number; titleSpacingLeft: string };
	nodeActions: { margin: string };
	nodeArrow: {
		button: {
			active: { background: string; color: string };
			focusBG: string;
			fontSize: string;
			hover: { background: string; color: string };
			iconFontWeight: number;
			size: string;
		};
		margin: string;
		marginLeft: string;
	};
	nodeContent: {
		active: { background: string; border: string };
		borderBottom: string;
		disabled: { background: string; color: string; fontWeight: number };
		dragOver: { background: string; borderLeft: string };
		dragging: { activeBG: string; hoverBG: string };
		dropForbidden: { background: string; borderLeft: string };
		focus: { background: string; border: string; outline: string };
		hover: { background: string; border: string };
		minHeight: string;
		selected: {
			activeBorderLeft: string;
			background: string;
			borderLeft: string;
			focusBorderLeft: string;
			hoverBorderLeft: string;
		};
		successBG: string;
	};
	nodeIcon: { fontSize: string; maxHeight: string; minHeight: string; padding: string; width: string };
	nodeName: { fontFamily: string; fontSize: string; marginLeft: string; padding: string };
	nodePreview: { background: string; boxShadow: string; opacity: number };
};

export const treeConfig = (theme: BaseThemeType): TreeConfigType => {
	const { colors, spacing, typography, focusStyles } = theme;

	return {
		actionButtons: {
			gap: spacing.horizontalSpacing.horizWhiteSpacingxs + "px",
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		dropHint: {
			background: rgba(colors.interaction.draggable.color, 0.5),
			forbidden: {
				background: rgba(colors.variant.errorColor, 0.5),
				border: `1px solid ${colors.variant.errorColor}`
			},
			openedBorder: `1px solid ${colors.interaction.draggable.color}`
		},
		hintHeight: spacing.spacing.spacingXs + "px",
		insertHint: {
			background: rgba(colors.interaction.hover.color, 0.5),
			border: `1px solid ${colors.interaction.hover.color}`,
			focus: {
				background: rgba(colors.interaction.focus.color, 0.5),
				border: `1px solid ${colors.interaction.focus.color}`
			}
		},
		node: {
			indentPaddingLeft: spacing.horizontalSpacing.horizWhiteSpacinglg,
			titleSpacingLeft: spacing.horizontalSpacing.horizWhiteSpacingxs + "px"
		},
		nodeActions: {
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		nodeArrow: {
			margin: `${
				spacing.verticalSpacing.vertWhiteSpacingsm - (spacing.spacing.spacingMd + spacing.spacing.spacingXs) * 0.25
			}px 0`,
			marginLeft:
				-(spacing.horizontalSpacing.horizWhiteSpacinglg + spacing.horizontalSpacing.horizWhiteSpacingxs) + "px",
			button: {
				active: {
					background: colors.interaction.active.colorTouchInverted,
					color: colors.interaction.secondaryInteractionColor
				},
				focusBG: colors.interaction.focus.colorInverted,
				fontSize: typography.fontSize.hugeFontSize,
				iconFontWeight: typography.fontWeight.semiBoldFontWeight,
				hover: {
					background: colors.interaction.hover.colorInverted,
					color: colors.interaction.hover.color
				},
				size: spacing.spacing.spacingMd + spacing.spacing.spacingXs + "px"
			}
		},
		nodeContent: {
			active: {
				background: colors.background.interactiveBackground,
				border: `2px solid ${colors.interaction.active.colorTouch}`
			},
			borderBottom: `1px solid ${colors.divider.colorSubtle}`,
			disabled: {
				background: colors.interaction.disabled.colorLight,
				color: colors.interaction.disabled.colorDark,
				fontWeight: typography.fontWeight.regularFontWeight
			},
			dragging: {
				activeBG: colors.background.primaryBackground,
				hoverBG: colors.background.primaryBackground
			},
			dragOver: {
				background: setLightness(0.95, colors.interaction.draggable.color),
				borderLeft: `4px solid ${colors.interaction.draggable.color}`
			},
			dropForbidden: {
				background: colors.variant.errorColorLight,
				borderLeft: `4px solid ${colors.variant.errorColor}`
			},
			focus: {
				background: colors.background.interactiveBackground,
				border: `2px solid ${colors.interaction.focus.color}`,
				outline: focusStyles.focusedBoundaryDark
			},
			hover: {
				background: colors.background.interactiveBackground,
				border: `2px solid ${colors.interaction.hover.color}`
			},
			minHeight: 2 * spacing.spacing.spacingMd + "px",
			selected: {
				activeBorderLeft: `4px solid ${colors.interaction.active.colorTouch}`,
				background: colors.interaction.selected.colorLight,
				borderLeft: `4px solid ${colors.interaction.selected.color}`,
				focusBorderLeft: `4px solid ${colors.interaction.focus.color}`,
				hoverBorderLeft: `4px solid ${colors.interaction.hover.color}`
			},
			successBG: colors.variant.successColorLight
		},
		nodeIcon: {
			fontSize: typography.fontSize.mediumFontSize,
			maxHeight: 1.25 * spacing.baseSpacing.BASE + "px",
			minHeight: 2 * spacing.spacing.spacingMd + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
			width: 1.25 * spacing.baseSpacing.BASE + "px"
		},
		nodeName: {
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			marginLeft: spacing.horizontalSpacing.horizWhiteSpacingxs + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`
		},
		nodePreview: {
			background: colors.background.primaryBackground,
			boxShadow: `0 1px 4px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
			opacity: 0.1
		}
	};
};
