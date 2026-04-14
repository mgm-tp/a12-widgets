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

export const commonInteractiveTileFlatConfigs = (theme: FlatThemeType) => {
	const { colors, spacing } = theme;

	return {
		tilePrimaryPadding: `0 ${2 * spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
		tileSecondaryPadding: `0 ${2 * spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
		tileFocusBG: colors.interaction.colorBG,
		tileHoverBG: colors.interaction.colorBG
	};
};

/** @deprecated since version 38.2.0. Use {@link commonInteractiveTileFlatConfigs} instead. */
export const commonTileConfigs = commonInteractiveTileFlatConfigs;

export const interactiveTileFlatConfig = (theme: FlatThemeType) => {
	const tileConfigs = commonInteractiveTileFlatConfigs(theme);
	const { colors, spacing } = theme;

	return {
		primary: {
			boxShadow: "none",
			padding: `${tileConfigs.tilePrimaryPadding}`,
			activated: {
				padding: `${tileConfigs.tilePrimaryPadding}`
			},
			selected: {
				padding: `${tileConfigs.tilePrimaryPadding}`
			},
			disabled: { padding: `${tileConfigs.tilePrimaryPadding}` }
		},
		secondary: {
			background: colors.interaction.colorBG,
			borderRadius: `${2 * spacing.spacing.spacingXs}px`,
			padding: `${tileConfigs.tileSecondaryPadding}`,
			activated: {
				background: colors.interaction.colorBG,
				padding: `${tileConfigs.tileSecondaryPadding}`,
				interaction: {
					focus: {
						background: tileConfigs.tileFocusBG
					},
					hover: {
						background: tileConfigs.tileHoverBG
					}
				}
			},
			selected: {
				background: colors.interaction.colorBG,
				padding: `${tileConfigs.tileSecondaryPadding}`,
				interaction: {
					focus: {
						background: tileConfigs.tileFocusBG
					},
					hover: {
						background: tileConfigs.tileHoverBG
					}
				}
			},
			disabled: {
				padding: `${tileConfigs.tileSecondaryPadding}`
			},
			interaction: {
				focus: {
					background: tileConfigs.tileFocusBG
				},
				hover: {
					background: tileConfigs.tileHoverBG
				}
			}
		}
	};
};
