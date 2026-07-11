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
import { mergeConfig } from "../../utils/merge-config.js";

export type CalendarConfigType = {
	variant: {
		selected: {
			background: string;
			border?: string;
			color?: string;
			fontWeight?: number;
			hover?: {
				border?: string;
				background?: string;
				color?: string;
			};
			focus?: {
				border?: string;
				background?: string;
				color?: string;
			};
		};
		hover: {
			background?: string;
			border?: string;
			color?: string;
			fontWeight?: number;
		};
		focus?: {
			background?: string;
			border?: string;
			color?: string;
			fontWeight?: number;
		};
		disabled: {
			opacity?: number;
			background?: string;
			border?: string;
			color?: string;
			fontWeight?: number;
		};
		weekend: {
			background: string;
			color?: string;
			border?: string;
			fontWeight?: number;
			hover?: {
				border?: string;
				background?: string;
				color?: string;
			};
			focus?: {
				border?: string;
				background?: string;
				color?: string;
			};
		};
		currentDate: {
			background?: string;
			border?: string;
			color?: string;
			fontWeight?: number;
			hover?: {
				border?: string;
				background?: string;
				color?: string;
			};
			focus?: {
				border?: string;
				background?: string;
				color?: string;
			};
		};
		publicHoliday: {
			background: string;
			border?: string;
			color?: string;
			fontWeight?: number;
			hover?: {
				border?: string;
				background?: string;
				color?: string;
			};
			focus?: {
				border?: string;
				background?: string;
				color?: string;
			};
		};
		outsideDay: {
			background?: string;
			color?: string;
			fontWeight?: number;
			border?: string;
			hover?: {
				border?: string;
				background?: string;
				color?: string;
			};
			focus?: {
				border?: string;
				background?: string;
				color?: string;
			};
		};
		placeholder: {
			background: string;
			padding: string;
		};
	};
	item: {
		selected?: {
			borderLeft?: string;
			hoverBorderLeft?: string;
			focusBorderLeft?: string;
		};
		hoverBorder?: string;
		focusBorder?: string;
	};
	weekView: {
		gap: string;
		background: string;
		header: {
			color: string;
			padding: string;
			fontSize: string;
			fontWeight: number;
			background: string;
			textAlign: string;
		};
		day: {
			background: string;
			padding: string;
			borderRadius: string;
			border?: string;
		};
		dayContent: {
			item: {
				background: string;
				boxShadow?: string;
				borderRadius?: string;
				padding?: string;
				fontSize?: string;
				fontWeight?: number;
				color?: string;
			};
			gap: string;
			overflowX?: string;
			overflowY?: string;
			padding?: string;
		};
	};
	monthView: {
		background: string;
		gap: string;
		header: {
			color: string;
			padding: string;
			fontSize: string;
			fontWeight: number;
			background: string;
			textAlign: string;
		};
		day: {
			borderRadius: string;
			background: string;
			gap: string;
			padding: string;
			border?: string;
		};
		dayHeader?: {
			color?: string;
			padding?: string;
			fontSize?: string;
			fontWeight?: number;
			background?: string;
			textAlign?: string;
		};
		dayContent: {
			item: {
				background: string;
				boxShadow?: string;
				borderRadius?: string;
				padding: string;
				fontSize?: string;
				fontWeight?: number;
				color?: string;
			};
			gap: string;
			overflowX?: string;
			overflowY?: string;
			padding?: string;
		};
	};
};

const defaultCalendarConfig = (theme: BaseThemeCore): CalendarConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	const daySpacing = spacing.spacing.spacing2xs;

	return {
		variant: {
			selected: {
				background: colors.variant.infoColorLighter,
				border: `${theme.border.width.thin} solid ${colors.interaction.secondaryInteractionColor}`
			},
			hover: {
				border: `${theme.border.width.medium} solid ${colors.interaction.secondaryInteractionColor}`
			},
			focus: {
				border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`
			},
			weekend: {
				background: colors.background.tertiaryBackground
			},
			currentDate: {
				fontWeight: typography.fontWeight.boldFontWeight
			},
			disabled: {
				opacity: 0.3
			},
			publicHoliday: {
				background: colors.variant.warningColorLight
			},
			outsideDay: {
				background: colors.interaction.disabled.colorDark
			},
			placeholder: {
				background: colors.background.tertiaryBackground,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			}
		},
		item: {
			selected: {
				borderLeft: `${theme.border.width.thick} solid ${colors.interaction.hover.color}`,
				focusBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.focus.color}`,
				hoverBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.hover.color}`
			},
			hoverBorder: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
			focusBorder: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`
		},
		weekView: {
			background: colors.divider.colorMuted,
			gap: `${daySpacing}px`,
			header: {
				padding: `${spacing.spacing.spacing2xs}px`,
				fontWeight: typography.fontWeight.boldFontWeight,
				color: colors.text.headlineColor,
				fontSize: typography.fontSize.smallFontSize,
				textAlign: "center",
				background: colors.background.interactiveBackground
			},
			day: {
				background: colors.background.interactiveBackground,
				borderRadius: "0",
				padding: `${spacing.spacing.spacingXs}px`
			},
			dayContent: {
				item: {
					background: colors.background.primaryBackground,
					boxShadow: `${colors.shadow.overlayFaint} 0px 1px 3px, ${colors.shadow.overlaySoft} 0px 1px 2px`,
					borderRadius: "0",
					padding: `${spacing.spacing.spacingXs}px`
				},
				gap: `${spacing.spacing.spacingXs}px`,
				overflowX: "auto",
				overflowY: "auto",
				padding: `${spacing.spacing.spacingXs}px`
			}
		},
		monthView: {
			background: colors.divider.colorMuted,
			gap: `${daySpacing}px`,
			header: {
				padding: `${spacing.spacing.spacing2xs}px`,
				fontWeight: typography.fontWeight.boldFontWeight,
				color: colors.text.headlineColor,
				fontSize: typography.fontSize.smallFontSize,
				textAlign: "center",
				background: colors.background.interactiveBackground
			},
			day: {
				background: colors.background.interactiveBackground,
				gap: `${spacing.spacing.spacing2xs}px`,
				borderRadius: "0",
				padding: `${spacing.spacing.spacingXs}px`
			},
			dayHeader: {
				padding: `${spacing.spacing.spacingXs}px`
			},
			dayContent: {
				item: {
					background: colors.background.primaryBackground,
					boxShadow: `${colors.shadow.overlayFaint} 0px 1px 3px, ${colors.shadow.overlaySoft} 0px 1px 2px`,
					borderRadius: "0",
					padding: `${spacing.spacing.spacingSm}px`
				},
				gap: `${spacing.spacing.spacingXs}px`,
				overflowX: "auto",
				overflowY: "auto",
				padding: `${spacing.spacing.spacingXs}px`
			}
		}
	};
};

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };
export const calendarOverrides = (): DeepPartial<CalendarConfigType> => {
	return {
		weekView: {
			dayContent: {
				item: {
					borderRadius: "10px",
					boxShadow: "none"
				}
			},
			day: {
				borderRadius: "10px"
			}
		},
		monthView: {
			day: {
				borderRadius: "10px"
			},
			dayContent: {
				item: {
					boxShadow: "none",
					borderRadius: "5px"
				}
			}
		}
	};
};

export const calendarConfig = (theme: BaseThemeCore) => mergeConfig(defaultCalendarConfig(theme), calendarOverrides());
