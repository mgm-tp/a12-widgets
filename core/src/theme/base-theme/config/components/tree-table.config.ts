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

import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type TreeTableConfigType = {
	bodyCell: { padding: string };
	bodyRow: { minHeight: string };
	node: {
		borderLeft: string;
		draggingOpacity: number;
		droppableBG: string;
		droppableBorderColor: string;
		forbiddenBG: string;
		forbiddenBorderColor: string;
		forbiddenOpacity: number;
		spacingLeft: number;
	};
	nodePreview: { background: string; boxShadow: string; opacity: number };
	target: {
		droppableBG: string;
		droppableBorder: string;
		forbiddenBG: string;
		forbiddenBorder: string;
		height: string;
		opacity: number;
	};
};

const defaultTreeTableConfig = (theme: BaseThemeCore): TreeTableConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;

	return {
		target: {
			height: spacing.spacing.spacingXs + "px",
			opacity: 1,
			droppableBG: rgba(colors.interaction.draggable.color, theme.opacity.medium),
			droppableBorder: `${theme.border.width.thin} solid ${colors.interaction.draggable.color}`,
			forbiddenBG: rgba(colors.variant.errorColor, theme.opacity.medium),
			forbiddenBorder: `${theme.border.width.thin} solid ${colors.variant.errorColor}`
		},
		bodyRow: {
			minHeight: spacing.spacing.spacingLg + "px"
		},
		bodyCell: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		node: {
			borderLeft: `${theme.border.width.thick} solid transparent`,
			draggingOpacity: 0.15,
			droppableBG: setLightness(0.95, colors.interaction.draggable.color),
			droppableBorderColor: colors.interaction.draggable.color,
			forbiddenBG: colors.variant.errorColorLight,
			forbiddenBorderColor: colors.variant.errorColor,
			forbiddenOpacity: 1,
			spacingLeft: spacing.horizontalSpacing.horizWhiteSpacinglg
		},
		nodePreview: {
			background: colors.background.interactiveBackground,
			boxShadow: `0 1px 4px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
			opacity: 0.8
		}
	};
};

export const treeTableOverrides = (theme: BaseThemeCore) => {
	const spacing = theme.spacing;
	const colors = theme.colors;

	return {
		target: {
			height: spacing.spacing.spacingXs + "px",
			opacity: 1,
			droppableBG: rgba(colors.interaction.draggable.color, theme.opacity.medium),
			droppableBorder: `${theme.border.width.thin} solid ${colors.interaction.draggable.color}`,
			forbiddenBG: rgba(colors.variant.errorColor, theme.opacity.medium),
			forbiddenBorder: `${theme.border.width.thin} solid ${colors.variant.errorColor}`
		},
		bodyRow: {
			minHeight: spacing.spacing.spacingLg + "px"
		},
		bodyCell: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		node: {
			draggingOpacity: 0.15,
			droppableBG: setLightness(0.95, colors.interaction.draggable.color),
			droppableBorderColor: colors.interaction.draggable.color,
			forbiddenBG: colors.variant.errorColorLight,
			forbiddenBorderColor: colors.variant.errorColor,
			forbiddenOpacity: 1,
			spacingLeft: spacing.horizontalSpacing.horizWhiteSpacinglg
		},
		nodePreview: {
			background: colors.background.interactiveBackground,
			boxShadow: `0 1px 4px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
			opacity: 0.8
		}
	};
};

export const treeTableConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultTreeTableConfig(theme), treeTableOverrides(theme));
