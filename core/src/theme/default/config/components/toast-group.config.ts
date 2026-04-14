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

export type ToastGroupConfigType = {
	childrenMargin: string;
	delayDuration: string;
	duration: string;
	hideDuration: string;
	maxWidth: string;
	mobile: { margin: string };
	moveUpDuration: string;
	padding: string;
	width: string;
	stacked: {
		toastBoxShadow: {
			level1Background: string;
			level2Background: string;
			thickness: string;
		};
		toolbar: {
			background: string;
			borderRadius: string;
			boxShadow: string;
			padding: string;
			title: {
				color: string;
				fontFamily: string;
				fontSize: string;
				fontWeight: number;
			};
		};
	};
};

export const toastGroupConfig = (theme: BaseThemeType): ToastGroupConfigType => {
	const {
		spacing: { verticalSpacing, horizontalSpacing, spacing },
		colors
	} = theme;

	return {
		padding: `${verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing.horizWhiteSpacing2xs}px ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
		width: `${15 * spacing.spacingLg + spacing.spacingXs * 2}px`,
		maxWidth: `calc(100% - ${spacing.spacingXs * 2}px)`,
		duration: "0.2s",
		delayDuration: "0.25s",
		hideDuration: "0.35s",
		moveUpDuration: "0.35s",
		childrenMargin: `${verticalSpacing.vertWhiteSpacing2xs}px 0`,
		mobile: {
			margin: `${verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing.horizWhiteSpacingxs}px`
		},
		stacked: {
			toastBoxShadow: {
				level1Background: colors.interaction.disabled.colorDark,
				level2Background: colors.interaction.disabled.color,
				thickness: "5px"
			},
			toolbar: {
				background: theme.colors.background.secondaryBackground,
				borderRadius: spacing.spacingXs + "px",
				boxShadow: `0px 0px 4px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
				padding: spacing.spacingXs + "px",
				title: {
					color: theme.colors.text.color,
					fontFamily: theme.typography.font.MAIN_FONT,
					fontSize: theme.typography.fontSize.tinyFontSize,
					fontWeight: theme.typography.fontWeight.semiBoldFontWeight
				}
			}
		}
	};
};
