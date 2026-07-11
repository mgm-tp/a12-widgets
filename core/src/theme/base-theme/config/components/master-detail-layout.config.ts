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

import type { DeepPartial } from "../../../../common/main/utils.js";
import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type MasterDetailLayoutConfigType = {
	background: string;
	body: { margin: string };
	borderRadius: number;
	contentBoxHeaderPadding: string;
	header: { padding: string };
	pane: { animationDuration: string; secondChildLeftBorder: string; nonFirstChildLeftBorder?: string };
	spacingBetweenPanes: string;
	spacingForBoxShadow: string;
	title: {
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		lineHeight: string;
		margin: string;
		padding: string;
		width: string;
	};
};

const defaultMasterDetailLayoutConfig = (theme: BaseThemeCore): MasterDetailLayoutConfigType => {
	const spacing = theme.spacing;
	const typography = theme.typography;

	return {
		background: "none",
		borderRadius: spacing.spacing.spacingXs + spacing.spacing.spacing3xs,
		spacingBetweenPanes: `${spacing.horizontalSpacing.horizWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacingxs}px`,
		spacingForBoxShadow: "2px",
		contentBoxHeaderPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
		header: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`
		},
		title: {
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.bigFontSize,
			fontWeight: typography.fontWeight.boldFontWeight,
			lineHeight: `${spacing.spacing.spacingLg}px`,
			margin: "0",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
			width: "100%"
		},
		body: {
			margin: "0"
		},
		pane: {
			animationDuration: "0.35s",
			secondChildLeftBorder: "none",
			nonFirstChildLeftBorder: "none"
		}
	};
};

export const masterDetailLayoutOverrides = (theme: BaseThemeCore): DeepPartial<MasterDetailLayoutConfigType> => ({
	contentBoxHeaderPadding: `0 ${theme.spacing.horizontalSpacing.horizWhiteSpacingxl}px`,
	spacingForBoxShadow: "1px",
	spacingBetweenPanes: `${theme.spacing.verticalSpacing.vertWhiteSpacing3xs}px ${theme.spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
	header: {
		padding: `${theme.spacing.verticalSpacing.vertWhiteSpacingsm}px ${theme.spacing.horizontalSpacing.horizWhiteSpacingxl}px`
	},
	pane: {
		secondChildLeftBorder: `${theme.border.width.thin} solid ${theme.colors.divider.colorSubtle}`,
		nonFirstChildLeftBorder: `${theme.border.width.thin} solid ${theme.colors.divider.colorSubtle}`
	}
});

export const masterDetailLayoutConfig = (theme: BaseThemeCore): MasterDetailLayoutConfigType => {
	const defaultConfig: MasterDetailLayoutConfigType = defaultMasterDetailLayoutConfig(theme);
	const overrides: DeepPartial<MasterDetailLayoutConfigType> = masterDetailLayoutOverrides(theme);
	const config: MasterDetailLayoutConfigType = mergeConfig(defaultConfig, overrides);

	return config;
};
