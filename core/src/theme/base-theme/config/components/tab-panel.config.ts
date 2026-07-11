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

import { contentBoxConfig, contentBoxOverrides } from "./contentbox.config.js";

export type TabPanelConfigType = {
	background: string;
	contentBorder: string;
	header: {
		addonGap: string;
		background: string;
		buttonColor: string;
		minHeight: string;
		padding: string;
		heading: { color: string; fontSize: string; fontWeight: number; padding: string };
	};
	tab: {
		active: { background: string; borderColor: string; color: string };
		border: string;
		color: string;
		disabled: { background: string; color: string };
		focus: { background: string; borderColor: string; color: string; margin: string };
		fontSize: string;
		hover: { background: string; borderColor: string; color: string };
		minHeight: string;
		minWidth: string;
		selected: {
			activeBackground: string;
			afterBackground: string;
			background: string;
			borderLeftWidth: string;
			borderTopWidth: string;
			color: string;
			focusBackground: string;
			fontSize: string;
			hoverBackground: string;
		};
		highlighted: {
			activeBackground: string;
			afterBackground: string;
			background: string;
			borderColor: string;
			borderLeftWidth: string;
			borderTopWidth: string;
			color: string;
			focusBackground: string;
			fontSize: string;
			hoverBackground: string;
		};
	};
	tabs: { background: string; minWidth: string; minHeight: string; padding: string; horizontalPadding: string };
	groupTab: {
		subGroup: {
			background: string;
			fontSize: string;
			fontWeight: string;
			padding: string;
		};
		divider: {
			background: string;
			margin: string;
		};
		subItem: {
			gap: string;
			padding: string;
			iconFontSize: string;
			iconMinWidth: string;
			labelFontSize: string;
			margin: string;
		};
	};
};

const defaultTabPanelConfig = (theme: BaseThemeCore): TabPanelConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const contentBoxConfigVar = contentBoxConfig(theme);

	return {
		tabs: {
			background: colors.secondaryColor,
			minWidth: `${spacing.spacing.spacingXl}px`,
			minHeight: `${spacing.spacing.spacingXl}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xl}px 0 0`,
			horizontalPadding: "0"
		},
		groupTab: {
			subGroup: {
				background: colors.background.secondaryBackground,
				fontSize: typography.fontSize.tinyFontSize,
				fontWeight: `${typography.fontWeight.regularFontWeight}`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			divider: {
				background: colors.divider.colorSubtle,
				margin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px`
			},
			subItem: {
				gap: `${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
				iconFontSize: typography.fontSize.lgFontSize,
				iconMinWidth: typography.fontSize.hugeFontSize,
				labelFontSize: typography.fontSize.tinyFontSize,
				margin: "0 1px"
			}
		},
		tab: {
			active: {
				background: colors.shadow.overlayMid,
				borderColor: colors.interaction.active.colorTouchInverted,
				color: colors.text.invertedColor
			},
			border: `${theme.border.width.medium} solid transparent`,
			color: colors.text.invertedColor,
			disabled: {
				background: "transparent",
				color: colors.interaction.disabled.colorDark
			},
			focus: {
				background: colors.shadow.overlayMid,
				borderColor: colors.interaction.hover.colorInverted,
				color: colors.text.invertedColor,
				margin: "0"
			},
			fontSize: typography.fontSize.lgFontSize,
			hover: {
				background: colors.shadow.overlayMid,
				borderColor: colors.interaction.hover.colorInverted,
				color: colors.text.invertedColor
			},
			minHeight: `${3 * spacing.baseSpacing.BASE}px`,
			minWidth: `${3 * spacing.baseSpacing.BASE}px`,
			selected: {
				activeBackground: colors.shadow.overlayMid,
				afterBackground: colors.interaction.selected.colorInverted,
				background: colors.interaction.selected.colorDark,
				borderLeftWidth: `${spacing.spacing.spacing2xs}px`,
				borderTopWidth: `${spacing.spacing.spacing2xs}px`,
				color: colors.text.invertedColor,
				focusBackground: colors.shadow.overlayMid,
				fontSize: typography.fontSize.bigFontSize,
				hoverBackground: colors.shadow.overlayMid
			},
			highlighted: {
				activeBackground: colors.shadow.overlayMid,
				afterBackground: colors.interaction.selected.colorDark,
				background: colors.background.primaryBackground,
				borderLeftWidth: `${spacing.spacing.spacing2xs}px`,
				borderTopWidth: `${spacing.spacing.spacing2xs}px`,
				borderColor: colors.interaction.selected.colorDark,
				color: colors.interaction.selected.colorDark,
				focusBackground: colors.shadow.overlayMid,
				fontSize: typography.fontSize.bigFontSize,
				hoverBackground: colors.shadow.overlayMid
			}
		},
		background: colors.secondaryColor,
		contentBorder: `${spacing.spacing.spacingXs}px solid ${colors.interaction.selected.colorDark}`,
		header: {
			addonGap: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			background: colors.interaction.selected.colorDark,
			minHeight: `${2 * spacing.spacing.spacingMd}px`,
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			buttonColor: colors.text.invertedColor,
			heading: {
				color: colors.text.invertedColor,
				fontSize: contentBoxConfigVar.title.fontSize,
				fontWeight: contentBoxConfigVar.title.fontWeight,
				padding: `${contentBoxConfigVar.heading.paddingTop} ${contentBoxConfigVar.heading.paddingLeft} ${contentBoxConfigVar.heading.paddingBottom} ${contentBoxConfigVar.heading.paddingRight}`
			}
		}
	};
};

export const tabPanelOverrides = (theme: BaseThemeCore) => {
	const colors = theme.colors;
	const contentBoxConfigVar = contentBoxOverrides(theme);
	const navBg = colors.background.navigationBackground;
	const overlayLight = colors.background.overlayLight;

	return {
		tabs: {
			background: navBg
		},
		tab: {
			active: {
				background: overlayLight,
				borderColor: colors.interaction.active.colorTouch,
				color: colors.interaction.active.colorTouch
			},
			color: colors.interaction.color,
			focus: {
				background: overlayLight,
				borderColor: colors.interaction.focus.color,
				color: colors.interaction.focus.color
			},
			hover: {
				background: overlayLight,
				borderColor: colors.interaction.hover.color,
				color: colors.interaction.hover.color
			},
			selected: {
				activeBackground: colors.interaction.active.colorTouchInverted,
				focusBackground: colors.interaction.focus.colorInverted,
				hoverBackground: colors.interaction.hover.colorInverted
			},
			highlighted: {
				activeBackground: colors.interaction.active.colorTouchInverted,
				focusBackground: colors.interaction.focus.colorInverted,
				hoverBackground: colors.background.primaryBackground
			}
		},
		header: {
			heading: {
				fontSize: contentBoxConfigVar.title.fontSize,
				padding: `${contentBoxConfigVar.heading.paddingTop} ${contentBoxConfigVar.heading.paddingLeft} ${contentBoxConfigVar.heading.paddingBottom} ${contentBoxConfigVar.heading.paddingRight}`
			}
		}
	};
};

export const tabPanelConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultTabPanelConfig(theme), tabPanelOverrides(theme));
