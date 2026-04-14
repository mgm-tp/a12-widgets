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

import { GeneralFlatColorsConfig } from "../base/colors.config.js";

const commonItemConfigs = (theme: FlatThemeType) => {
	const { colors } = theme;

	return {
		active: {
			border: "none",
			borderBottom: `2px solid ${colors.interaction.active.colorTouch}`,
			color: colors.interaction.primaryInteractionColor
		},
		hover: {
			border: "none",
			borderBottom: `2px solid ${colors.interaction.hover.color}`,
			color: colors.interaction.primaryInteractionColor
		},
		focus: {
			borderBottom: `2px solid ${colors.interaction.focus.color}`,
			color: colors.interaction.primaryInteractionColor
		},
		selected: {
			border: "none",
			borderBottom: `2px solid ${colors.interaction.color}`,
			color: colors.text.color,
			focus: {
				borderBottom: `2px solid ${colors.interaction.color}`,
				color: colors.interaction.primaryInteractionColor
			},
			hover: {
				borderBottom: `2px solid ${colors.interaction.color}`,
				color: colors.text.color
			}
		}
	};
};

export const menuFlatConfig = (theme: FlatThemeType) => {
	const { colors, spacing, typography } = theme;
	const itemConfigs = commonItemConfigs(theme);

	return {
		header: {
			item: {
				focus: {
					borderBottom: `2px solid ${colors.interaction.color}`
				}
			}
		},
		icon: {
			color: colors.interaction.primaryInteractionColor,
			status: {
				variant: {
					open: colors.text.color,
					info: colors.variant.infoColor,
					error: colors.variant.errorColor,
					warning: colors.variant.warningColorDark,
					inProgress: colors.variant.infoColorDark,
					done: colors.variant.successColor
				}
			}
		},
		item: {
			horizontal: {
				active: {
					borderBottom: `2px solid ${colors.interaction.active.colorTouch}`
				},
				badge: {
					backgroundColor: {
						warning: colors.variant.warningColorDark
					}
				},
				hover: {
					borderBottom: `2px solid ${colors.interaction.hover.color}`
				},
				focus: {
					borderBottom: itemConfigs.focus.borderBottom
				},

				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
				selected: {
					borderBottom: itemConfigs.selected.borderBottom,
					color: colors.interaction.color,
					focus: {
						borderBottom: `2px solid ${colors.interaction.focus.color}`
					},
					hover: {
						borderBottom: itemConfigs.selected.borderBottom,
						color: colors.interaction.color
					}
				}
			},
			placeholderDisabled: {
				background: "transparent",
				color: colors.interaction.disabled.colorDark
			},
			subHorizontal: {
				active: {
					background: colors.interaction.active.colorTouchInverted,
					border: `2px solid ${colors.interaction.active.colorTouch}`
				},
				focus: {
					background: colors.interaction.focus.colorInverted,
					border: `2px solid ${colors.interaction.focus.color}`
				},
				hover: {
					background: colors.interaction.hover.colorInverted,
					border: `2px solid ${colors.interaction.hover.color}`
				},
				selected: {
					activeBorderLeft: `4px solid ${colors.interaction.active.colorTouch}`,
					background: colors.background.primaryBackground,
					borderLeft: `4px solid ${colors.interaction.selected.color}`,
					textColor: colors.interaction.selected.color,
					focusBorderLeft: `4px solid ${colors.interaction.focus.color}`,
					hoverBorderLeft: `4px solid ${colors.interaction.hover.color}`,
					hover: {
						borderBottom: itemConfigs.selected.borderBottom,
						color: colors.interaction.selected.color
					}
				}
			},
			vertical: {
				selected: {
					background: colors.interaction.selected.colorInverted
				}
			}
		},
		label: {
			color: colors.interaction.primaryInteractionColor
		},
		mainLayer: {
			horizontalPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
			verticalBG: GeneralFlatColorsConfig.blueLight
		},
		mainMenu: {
			before: {
				background: GeneralFlatColorsConfig.blue87
			},
			borderTop: "none",
			mainLayer: {
				background: GeneralFlatColorsConfig.blueLight
			},
			subLayer: {
				background: GeneralFlatColorsConfig.blueLight
			},
			item: {
				color: colors.interaction.primaryInteractionColor,
				fontSize: typography.fontSize.smallFontSize,
				textTransform: "none",
				...itemConfigs
			}
		},
		placeholder: {
			background: "transparent",
			color: colors.interaction.primaryInteractionColor
		},
		slidingMenu: {
			background: GeneralFlatColorsConfig.blueLight
		},
		subLayer: {
			background: GeneralFlatColorsConfig.blueLight,
			verticalBG: GeneralFlatColorsConfig.blueLight
		},
		tabNavigation: {
			mainLayer: {
				background: colors.background.primaryBackground
			},
			subLayer: {
				background: colors.background.primaryBackground
			},
			item: {
				color: colors.interaction.primaryInteractionColor,
				fontSize: typography.fontSize.smallFontSize,
				textTransform: "none",
				...itemConfigs
			}
		},
		triggerButton: {
			iconColor: colors.interaction.primaryInteractionColor
		}
	};
};
