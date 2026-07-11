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

import { contentBoxConfig } from "./contentbox.config.js";

export type FilterSelectorConfigType = {
	actionBar: { borderBottom: string; elementMargin: string; minHeight: string; padding: string };
	actionBarHorizontalPadding: string;
	body: { background: string; minHeight: string };
	borderRadius: number;
	boxShadow: string;
	childrenWrapper: { border: string; focusByKeyBoardBorder: string };
	containerWidth: string;
	content: {
		color: string;
		maxHeight: string;
		primary: { headerBorderRight: string; width: string };
		secondary: {
			borderLeft: string;
			contentBoxContent: { minHeight: string; padding: string };
			listItemPadding: string;
			subHeaderMargin: string;
			width: string;
		};
	};
	footerPadding: string;
	headerPadding: string;
	height: string;
	list: { optionItem: { background: { default: string; hover: string } }; sectionPadding: string };
	listItem: {
		activeBG: string;
		activeBorderLeft: { active: string; default: string; focus: string; hover: string };
		activeIndicator: { background: string; width: string };
		background: string;
		borderBottom: string;
		disabledColor: string;
		focusByKeyBoardBorder: string;
		graphicWidth: string;
		minHeight: string;
		padding: string;
		secondaryTextColor: string;
		text: { fontSize: string; lineHeight: string };
	};
	filterSelectorList: {
		sectionHeadlineColor: string;
		dividerTopMarginExpanded: string;
	};
	messageBoxMargin: string;
	secondaryContent: {
		borderLeft: string;
		contentBoxContent: { minHeight: string; padding: string };
		listItemPadding: string;
		subHeaderMargin: string;
		width: string;
	};
};

export const filterSelectorConfig = (theme: BaseThemeCore): FilterSelectorConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;

	const actionBarHorizontalPadding = `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`;
	const containerPadding = `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${actionBarHorizontalPadding}`;
	const containerWidth = "248px";
	const graphicWidth = "48px";
	const activeIndicatorWidth = `${spacing.spacing.spacing2xs}px`;
	const activeIndicatorBackground = colors.interaction.selected.color;

	return {
		filterSelectorList: {
			sectionHeadlineColor: colors.interaction.primaryInteractionColor,
			dividerTopMarginExpanded: `${spacing.verticalSpacing.vertWhiteSpacingxs * 2.5}px`
		},
		actionBarHorizontalPadding: actionBarHorizontalPadding,
		height: `${9 * spacing.spacing.spacingXl}px`,

		boxShadow: `0px 0px 20px 0px ${rgba(colors.boxShadowBackground, theme.opacity.subtle)}`,
		borderRadius: 0,
		messageBoxMargin: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
		headerPadding: containerPadding,
		footerPadding: containerPadding,
		containerWidth: containerWidth,
		body: {
			background: colors.background.primaryBackground,
			minHeight: `${4.7 * spacing.spacing.spacingXl}px`
		},
		content: {
			color: colors.text.color,
			maxHeight: `${9 * spacing.spacing.spacingXl}px`,
			primary: {
				width: containerWidth,
				headerBorderRight: `${theme.border.width.thin} solid ${rgba(colors.background.primaryBackground, theme.opacity.slightly)}`
			},
			secondary: {
				width: containerWidth,
				borderLeft: `${theme.border.width.thin} solid ${rgba(colors.boxShadowBackground, theme.opacity.hint)}`,
				listItemPadding: `0 ${actionBarHorizontalPadding}`,
				subHeaderMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
				contentBoxContent: {
					minHeight: `${2 * spacing.spacing.spacingMd}px`,
					padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${actionBarHorizontalPadding}`
				}
			}
		},
		secondaryContent: {
			width: containerWidth,
			borderLeft: `${theme.border.width.thin} solid ${rgba(colors.boxShadowBackground, theme.opacity.hint)}`,
			listItemPadding: `0 ${actionBarHorizontalPadding}`,
			subHeaderMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`,
			contentBoxContent: {
				minHeight: `${2 * spacing.spacing.spacingMd}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${actionBarHorizontalPadding}`
			}
		},
		list: {
			sectionPadding: containerPadding,
			optionItem: {
				background: {
					default: colors.background.primaryBackground,
					hover: colors.interaction.selected.colorLight
				}
			}
		},
		listItem: {
			text: {
				fontSize: typography.fontSize.tinyFontSize,
				lineHeight: `${theme.typography.lineHeight.base}`
			},
			minHeight: `${spacing.baseSpacing.BASE * 3}px`,
			activeBG: `linear-gradient(to right, ${setLightness(
				0.9,
				colors.interaction.selected.colorLight
			)} ${graphicWidth}, ${colors.interaction.selected.colorLight} ${graphicWidth})`,
			background: `linear-gradient(to right, ${colors.background.interactiveBackground} ${graphicWidth}, ${colors.background.primaryBackground} ${graphicWidth})`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${actionBarHorizontalPadding} ${spacing.verticalSpacing.vertWhiteSpacingxs}px calc(${graphicWidth} + ${spacing.horizontalSpacing.horizWhiteSpacingxs}px)`,
			borderBottom: `${theme.border.width.thin} solid ${colors.divider.color}`,
			focusByKeyBoardBorder: focusStyles.focusedBoundaryDark,
			activeIndicator: {
				background: activeIndicatorBackground,
				width: activeIndicatorWidth
			},
			activeBorderLeft: {
				default: `${activeIndicatorWidth} solid ${activeIndicatorBackground}`,
				active: `${activeIndicatorWidth} solid ${colors.interaction.active.colorTouch}`,
				hover: `${activeIndicatorWidth} solid ${colors.interaction.hover.color}`,
				focus: `${activeIndicatorWidth} solid ${colors.interaction.focus.color}`
			},
			disabledColor: colors.interaction.disabled.color,
			graphicWidth: graphicWidth,
			secondaryTextColor: colors.text.secondaryColorDark
		},
		childrenWrapper: {
			border: "1px dotted transparent",
			focusByKeyBoardBorder: focusStyles.focusedBoundaryDark
		},
		actionBar: {
			borderBottom: `${theme.border.width.thin} solid ${rgba(colors.boxShadowBackground, theme.opacity.hint)}`,
			minHeight: contentBoxConfig(theme).actionBar.minHeight,
			padding: containerPadding,
			elementMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 0`
		}
	};
};
