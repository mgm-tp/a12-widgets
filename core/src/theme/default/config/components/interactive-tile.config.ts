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

import type { BaseThemeType } from "../../../schema/base-theme.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";

export type InteractiveTileConfigType = {
	/** @deprecated since 37.2.0.
	 * Use {@link primary.border} and {@link secondary.border} to define the border for each type instead.
	 */
	border?: string;
	borderRadius: string;
	fontFamily: string;
	fontSize: string;
	fontWeight: string | number;
	minHeight: string;
	textTransform: string;
	primary: {
		background: string;
		border: string;
		boxShadow: string;
		color: string;
		padding: string;
		icon: { color: string };
		activated: {
			background: string;
			color: string;
			padding: string;
			icon: { color: string };
			interaction: {
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					outline: string;
					textDecoration: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
			};
		};
		selected: {
			background: string;
			color: string;
			padding: string;
			icon: { color: string; fontSize: string; right: string; top: string };
			interaction: {
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					outline: string;
					textDecoration: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
			};
		};
		disabled: {
			background: string;
			border: string;
			boxShadow: string;
			color: string;
			padding: string;
			icon: { color: string };
		};
		interaction: {
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				textDecoration: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
			};
		};
	};
	secondary: {
		background: string;
		border: string;
		borderRadius: string | number;
		color: string;
		padding: string;
		icon: { color: string };
		activated: {
			background: string;
			color: string;
			padding: string;
			icon: { color: string };
			interaction: {
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					outline: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
			};
		};
		selected: {
			background: string;
			color: string;
			padding: string;
			icon: { color: string; fontSize: string; right: string; top: string };
			interaction: {
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					outline: string;
					textDecoration: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
			};
		};
		disabled: {
			background: string;
			border: string;
			boxShadow: string;
			color: string;
			padding: string;
			icon: { color: string };
		};
		interaction: {
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				textDecoration: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
			};
		};
	};
};

export const commonTileConfigs = (theme: BaseThemeType) => {
	const { colors, spacing } = theme;

	return {
		tileBorderWidth: "2px",
		tilePrimaryPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacinglg}px`,
		tileSecondaryPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
		tileFocusBG: colors.interaction.focus.colorInverted,
		tileFocusColor: colors.interaction.focus.color,
		tileHoverBG: colors.interaction.hover.colorInverted,
		tileHoverColor: colors.interaction.hover.color,
		tileTextDecoration: "none",
		tileIconColor: "inherit"
	};
};

export const interactiveTileConfig = (theme: BaseThemeType): InteractiveTileConfigType => {
	const tileConfigs = commonTileConfigs(theme);
	const { colors, spacing, typography, focusStyles } = theme;

	return {
		borderRadius: `${spacing.spacing.spacing2xs}px`,
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		fontWeight: typography.fontWeight.regularFontWeight,
		minHeight: `${2 * spacing.baseSpacing.BASE}px`,
		textTransform: "unset",

		/**
		 * Primary Tile Styles
		 */
		primary: {
			background: colors.interaction.primaryInteractionColor,
			border: `${tileConfigs.tileBorderWidth} solid transparent`,
			boxShadow: `0 1px 2px 0 ${colors.boxShadowBackground}66`,
			color: colors.text.invertedColor,
			padding: `${tileConfigs.tilePrimaryPadding}`,

			// Icon in Tile
			icon: {
				color: `${tileConfigs.tileIconColor}`
			},

			// Activated Tile
			activated: {
				background: colors.interaction.active.color,
				color: colors.text.invertedColor,
				padding: `${tileConfigs.tilePrimaryPadding}`,
				icon: {
					color: `${tileConfigs.tileIconColor}`
				},
				interaction: {
					focus: {
						background: tileConfigs.tileFocusBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileFocusColor}`,
						color: tileConfigs.tileFocusColor,
						outline: focusStyles.focusedBoundaryDark,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					},
					hover: {
						background: tileConfigs.tileHoverBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileHoverColor}`,
						color: tileConfigs.tileHoverColor,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					}
				}
			},

			// Selected Tile
			selected: {
				background: colors.interaction.selected.color,
				color: colors.text.invertedColor,
				padding: `${tileConfigs.tilePrimaryPadding}`,
				icon: {
					color: `${tileConfigs.tileIconColor}`,
					fontSize: typography.fontSize.mediumFontSize,
					right: `${theme.spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
					top: `${theme.spacing.verticalSpacing.vertWhiteSpacingxs}px`
				},
				interaction: {
					focus: {
						background: tileConfigs.tileFocusBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileFocusColor}`,
						color: tileConfigs.tileFocusColor,
						outline: focusStyles.focusedBoundaryDark,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					},
					hover: {
						background: tileConfigs.tileHoverBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileHoverColor}`,
						color: tileConfigs.tileHoverColor,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					}
				}
			},

			// Disabled Tile
			disabled: {
				boxShadow: "none",
				border: `${tileConfigs.tileBorderWidth} solid ${colors.interaction.disabled.color}`,
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark,
				padding: `${tileConfigs.tilePrimaryPadding}`,
				icon: {
					color: `${tileConfigs.tileIconColor}`
				}
			},

			// Interactions: focus and hover.
			interaction: {
				focus: {
					background: tileConfigs.tileFocusBG,
					border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileFocusColor}`,
					color: tileConfigs.tileFocusColor,
					outline: focusStyles.focusedBoundaryDark,
					textDecoration: `${tileConfigs.tileTextDecoration}`
				},
				hover: {
					background: tileConfigs.tileHoverBG,
					border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileHoverColor}`,
					color: tileConfigs.tileHoverColor,
					textDecoration: `${tileConfigs.tileTextDecoration}`
				}
			}
		},

		/**
		 * Secondary Tile Styles
		 */
		secondary: {
			background: "transparent",
			border: `${tileConfigs.tileBorderWidth} solid transparent`,
			borderRadius: "0",
			color: colors.interaction.secondaryInteractionColor,
			padding: `${tileConfigs.tileSecondaryPadding}`,

			// Icon in Tile
			icon: {
				color: `${tileConfigs.tileIconColor}`
			},

			// Activated Tile
			activated: {
				background: "transparent",
				color: colors.interaction.active.color,
				padding: `${tileConfigs.tileSecondaryPadding}`,
				icon: {
					color: `${tileConfigs.tileIconColor}`
				},
				interaction: {
					focus: {
						background: tileConfigs.tileFocusBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileFocusColor}`,
						color: tileConfigs.tileFocusColor,
						outline: focusStyles.focusedBoundaryDark,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					},
					hover: {
						background: tileConfigs.tileHoverBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileHoverColor}`,
						color: tileConfigs.tileHoverColor,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					}
				}
			},

			// Selected Tile
			selected: {
				background: colors.background.secondaryBackground,
				color: colors.interaction.selected.color,
				padding: `${tileConfigs.tileSecondaryPadding}`,
				icon: {
					color: `${tileConfigs.tileIconColor}`,
					fontSize: typography.fontSize.mediumFontSize,
					right: `${theme.spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
					top: `${theme.spacing.verticalSpacing.vertWhiteSpacingxs}px`
				},
				interaction: {
					focus: {
						background: tileConfigs.tileFocusBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileFocusColor}`,
						color: tileConfigs.tileFocusColor,
						outline: focusStyles.focusedBoundaryDark,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					},
					hover: {
						background: tileConfigs.tileHoverBG,
						border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileHoverColor}`,
						color: tileConfigs.tileHoverColor,
						textDecoration: `${tileConfigs.tileTextDecoration}`
					}
				}
			},

			// Disabled Tile
			disabled: {
				background: "transparent",
				border: `${tileConfigs.tileBorderWidth} solid ${colors.interaction.disabled.colorDark}`,
				boxShadow: "none",
				color: colors.interaction.disabled.colorDark,
				padding: `${tileConfigs.tileSecondaryPadding}`,
				icon: {
					color: `${tileConfigs.tileIconColor}`
				}
			},

			// Interactions: focus and hover
			interaction: {
				focus: {
					background: tileConfigs.tileFocusBG,
					border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileFocusColor}`,
					color: tileConfigs.tileFocusColor,
					outline: focusStyles.focusedBoundaryDark,
					textDecoration: `${tileConfigs.tileTextDecoration}`
				},
				hover: {
					background: tileConfigs.tileHoverBG,
					border: `${tileConfigs.tileBorderWidth} solid ${tileConfigs.tileHoverColor}`,
					color: tileConfigs.tileHoverColor,
					textDecoration: `${tileConfigs.tileTextDecoration}`
				}
			}
		}
	};
};
