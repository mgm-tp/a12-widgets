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
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";

export type IconPickerConfigType = {
	containerMargin: string;
	inputSelectedIconColor: string;
	item: {
		hoverColor: string;
		icon: { fontSize: string; size: string };
		label: { fontSize: string; width: number };
		padding: string;
	};
	selectedItem: { color: string; icon: { backgroundColor: string; color: string } };
	smallContainerIconPadding: string;
	input?: { focus?: { customBorder?: CustomBorder } };
};

export const iconPickerConfig = (theme: BaseThemeCore): IconPickerConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		containerMargin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0 0 0`,
		inputSelectedIconColor: colors.text.color,
		item: {
			hoverColor: colors.interaction.hover.color,
			icon: {
				fontSize: typography.fontSize.lgFontSize,
				size: spacing.spacing.spacingMd + "px"
			},
			label: {
				fontSize: typography.fontSize.tinyFontSize,
				width: spacing.spacing.spacingLg
			},
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px ${spacing.verticalSpacing.vertWhiteSpacingxs}px`
		},
		selectedItem: {
			color: colors.text.color,
			icon: {
				backgroundColor: colors.interaction.selected.color,
				color: colors.text.invertedColor
			}
		},
		smallContainerIconPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
	};
};
