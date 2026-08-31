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

export type DatePickerConfigType = {
	body: { color: string; padding: string; horizontalCellSpacing: string; verticalCellSpacing: string };
	caption: {
		fieldSelect: { arrowIcon: { color: string; fontSize: string; width: string }; firstChildMargin: string };
		fontWeight: number;
		height: string;
		selectInput: {
			active: { background: string; border: string };
			background: string;
			border: string;
			borderRadius: string | number;
			color: string;
			focus: { background: string; border: string; color: string };
			height: string;
			hover: { background: string; border: string };
			padding: string;
			yearSelector?: {
				width: string;
			};
		};
		selectOption: {
			active: { background: string; color: string };
			background: string;
			color: string;
			hover: { background: string; color: string };
		};
	};
	day: {
		active: { background: string; border: string };
		border: string;
		disabled: { color: string };
		focus: { background: string; border: string };
		fontSize: string;
		hover: { background: string; border: string };
		margin: string;
		outside: { color: string };
		selected: {
			background: string;
			color: string;
			range: { background: string; color: string; disabled: { background: string; color: string } };
			interaction: {
				active: { background: string; border: string; color: string };
				focus: { background: string; border: string; color: string };
				hover: { background: string; border: string; color: string };
			};
		};
		size: string;
		today: { background: string; borderRadius: string | number; fontWeight: number };
	};
	footer: { background: string; minHeight: string; padding: string };
	mobile: {
		container: {
			borderRadius: string;
		};
		day: { size: string };
		fieldSelect: {
			background: string;
			color: string;
			firstChildMargin: string;
			focusBoxShadow: string;
			fontSize: string;
		};
		footer: { borderTop: string };
		header: {
			background: string;
			height: string;
			icon: { color: string; fontSize: string };
			padding: string;
			title: { color: string; fontSize: string; fontWeight: number };
		};
		navBar: { background: string };
	};
	month: { background: string; borderRadius: string; fontSize: string };
	navBar: { background: string };
	navButton: {
		size: string;
	};
	root: { boxShadow: string };
	week: { margin: string };
	weekday: { color: string; fontSize: string; fontWeight: number; padding: string; width: string };
	wrapper: { boxShadow: string };
	input?: {
		focus?: {
			customBorder?: CustomBorder;
		};
	};
};

export const datePickerConfig = (theme: BaseThemeType): DatePickerConfigType => {
	const { spacing, colors, typography } = theme;

	return {
		wrapper: {
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`
		},
		navBar: {
			background: colors.primaryColor
		},
		navButton: {
			size: 2 * spacing.baseSpacing.BASE + "px"
		},
		month: {
			background: colors.background.primaryBackground,
			borderRadius: "0",
			fontSize: typography.fontSize.smallFontSize
		},
		caption: {
			fontWeight: typography.fontWeight.boldFontWeight,
			height: `${3 * spacing.baseSpacing.BASE}px`,
			fieldSelect: {
				firstChildMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px 0 0`,
				arrowIcon: {
					color: colors.text.invertedColor,
					fontSize: typography.fontSize.bigFontSize,
					width: `${spacing.spacing.spacingLg}px`
				}
			},
			selectInput: {
				background: colors.secondaryColor,
				border: "2px solid transparent",
				borderRadius: "2px",
				color: colors.text.invertedColor,
				height: `${2 * spacing.baseSpacing.BASE}px`,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacinglg}px 0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
				active: {
					background: rgba(0, 0, 0, 0.2),
					border: `2px solid ${colors.interaction.secondaryInteractionColor}`
				},
				hover: {
					background: rgba(0, 0, 0, 0.2),
					border: `2px solid ${colors.interaction.hover.colorInverted}`
				},
				focus: {
					background: rgba(0, 0, 0, 0.2),
					border: `2px solid ${colors.interaction.focus.colorInverted}`,
					color: colors.interaction.focus.colorInverted
				},
				yearSelector: {
					width: `${spacing.horizontalSpacing.horizWhiteSpacing5xl}px`
				}
			},
			selectOption: {
				background: colors.background.primaryBackground,
				color: colors.text.color,
				active: {
					background: colors.interaction.active.colorTouch,
					color: colors.text.invertedColor
				},
				hover: {
					background: colors.interaction.hover.color,
					color: colors.text.invertedColor
				}
			}
		},
		week: {
			margin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0 0 0`
		},
		weekday: {
			color: colors.text.color,
			fontSize: typography.fontSize.smallFontSize,
			fontWeight: typography.fontWeight.boldFontWeight,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingmd + 0.5}px 0 calc(${
				spacing.verticalSpacing.vertWhiteSpacingmd + 1
			}px / 2)`,
			width: `${2 * spacing.baseSpacing.BASE}px`
		},
		body: {
			color: colors.text.color,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm - 2}px ${
				spacing.verticalSpacing.vertWhiteSpacingmd
			}px`,
			horizontalCellSpacing: "4px",
			verticalCellSpacing: "0"
		},
		day: {
			border: "2px solid transparent",
			fontSize: typography.fontSize.tinyFontSize,
			size: `${spacing.spacing.spacingLg}px`,
			margin: "0",
			active: {
				background: colors.interaction.active.colorTouchInverted,
				border: `2px solid ${colors.interaction.active.colorTouch}`
			},
			hover: {
				background: colors.interaction.hover.colorInverted,
				border: `2px solid ${colors.interaction.hover.color}`
			},
			focus: {
				background: colors.interaction.focus.colorInverted,
				border: `2px solid ${colors.interaction.focus.color}`
			},
			today: {
				background: colors.background.tertiaryBackground,
				borderRadius: "50%",
				fontWeight: typography.fontWeight.boldFontWeight
			},
			outside: {
				color: colors.background.tertiaryBackground
			},
			selected: {
				background: colors.interaction.selected.color,
				color: colors.text.invertedColor,
				range: {
					background: colors.interaction.selected.colorLight,
					color: colors.interaction.selected.color,
					disabled: {
						background: colors.interaction.disabled.color,
						color: colors.interaction.disabled.colorDark
					}
				},
				interaction: {
					active: {
						background: colors.interaction.selected.colorInverted,
						border: `2px solid ${colors.interaction.active.colorTouch}`,
						color: colors.interaction.active.colorTouch
					},
					focus: {
						background: colors.interaction.selected.colorInverted,
						border: `2px solid ${colors.interaction.focus.color}`,
						color: colors.interaction.focus.color
					},
					hover: {
						background: colors.interaction.selected.colorInverted,
						border: `2px solid ${colors.interaction.hover.color}`,
						color: colors.interaction.hover.color
					}
				}
			},
			disabled: {
				color: colors.interaction.disabled.colorDark
			}
		},
		root: {
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`
		},
		footer: {
			background: colors.background.interactiveBackground,
			minHeight: `${16 + spacing.spacing.spacingLg}px`,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		mobile: {
			container: {
				borderRadius: "0"
			},
			header: {
				background: colors.primaryColor,
				height: `${2 * spacing.spacing.spacingMd}px`,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
				icon: {
					color: colors.text.invertedColor,
					fontSize: "inherit"
				},
				title: {
					color: colors.text.invertedColor,
					fontSize: typography.fontSize.smallFontSize,
					fontWeight: typography.fontWeight.boldFontWeight
				}
			},
			navBar: {
				background: colors.background.interactiveBackground
			},
			fieldSelect: {
				firstChildMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 0`,
				background: colors.background.primaryBackground,
				color: colors.text.color,
				fontSize: typography.fontSize.tinyFontSize,
				focusBoxShadow: `0 2px 0 0 ${colors.interaction.focus.color}`
			},
			day: {
				size: `${2.5 * spacing.baseSpacing.BASE}px`
			},
			footer: {
				borderTop: "none"
			}
		}
	};
};
