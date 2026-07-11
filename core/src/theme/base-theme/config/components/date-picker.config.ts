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

import type { BaseThemeCore } from "../../schema.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";
import { mergeConfig } from "../../utils/merge-config.js";

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

const defaultDatePickerConfig = (theme: BaseThemeCore): DatePickerConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		wrapper: {
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`
		},
		navBar: {
			background: colors.primaryColor
		},
		navButton: {
			size: `${spacing.spacing.spacingLg + spacing.spacing.spacing3xs * 2}px`
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
					width: `${spacing.spacing.spacingLg + spacing.spacing.spacing3xs * 2}px`
				}
			},
			selectInput: {
				background: colors.secondaryColor,
				border: `${theme.border.width.medium} solid transparent`,
				borderRadius: theme.border.radius.sm,
				color: colors.text.invertedColor,
				height: `${spacing.spacing.spacingLg + spacing.spacing.spacing3xs * 2}px`,
				padding: `0 ${spacing.verticalSpacing.vertWhiteSpacingmd}px 0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
				active: {
					background: colors.interaction.touchOverlay,
					border: `${theme.border.width.medium} solid ${colors.interaction.secondaryInteractionColor}`
				},
				hover: {
					background: colors.interaction.touchOverlay,
					border: `${theme.border.width.medium} solid ${colors.interaction.hover.colorInverted}`
				},
				focus: {
					background: colors.interaction.touchOverlay,
					border: `${theme.border.width.medium} solid ${colors.interaction.focus.colorInverted}`,
					color: colors.interaction.focus.colorInverted
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
			margin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px 0 0 0`
		},
		weekday: {
			color: colors.text.color,
			fontSize: typography.fontSize.smallFontSize,
			fontWeight: typography.fontWeight.boldFontWeight,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingmd + 0.5}px 0 calc(${
				spacing.verticalSpacing.vertWhiteSpacingmd + 1
			}px / 2)`,
			width: `${2 * spacing.spacing.spacing3xs + spacing.spacing.spacingLg}px`
		},
		body: {
			color: colors.text.color,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px ${spacing.verticalSpacing.vertWhiteSpacingmd}px`,
			horizontalCellSpacing: "0",
			verticalCellSpacing: "0"
		},
		day: {
			border: `${theme.border.width.medium} solid transparent`,
			fontSize: typography.fontSize.tinyFontSize,
			size: `${2 * spacing.spacing.spacing3xs + spacing.spacing.spacingLg}px`,
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			active: {
				background: colors.interaction.active.colorTouchInverted,
				border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`
			},
			hover: {
				background: colors.interaction.hover.colorInverted,
				border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
			},
			focus: {
				background: colors.interaction.focus.colorInverted,
				border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`
			},
			today: {
				background: colors.background.tertiaryBackground,
				borderRadius: theme.border.radius.full,
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
						border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
						color: colors.interaction.active.colorTouch
					},
					focus: {
						background: colors.interaction.selected.colorInverted,
						border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
						color: colors.interaction.focus.color
					},
					hover: {
						background: colors.interaction.selected.colorInverted,
						border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
						color: colors.interaction.hover.color
					}
				}
			},
			disabled: {
				color: colors.interaction.disabled.colorDark
			}
		},
		root: {
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`
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
					color: colors.interaction.secondaryInteractionColor,
					fontSize: typography.fontSize["4XlFontSize"]
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
				fontSize: typography.fontSize.mediumFontSize,
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

export const datePickerOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		caption: {
			fieldSelect: {
				arrowIcon: {
					color: colors.interaction.color
				}
			},
			selectInput: {
				background: colors.secondaryColor,
				color: colors.interaction.color,
				active: {
					background: colors.interaction.color
				},
				hover: {
					border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
				},
				focus: {
					background: colors.interaction.colorBG,
					border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
					color: colors.interaction.color
				}
			}
		},
		mobile: {
			header: {
				title: {
					color: colors.text.color
				}
			},
			fieldSelect: {
				focusBoxShadow: `0 0 2px 0 ${colors.interaction.focus.color}`
			}
		}
	};
};

export const datePickerConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultDatePickerConfig(theme), datePickerOverrides(theme));
