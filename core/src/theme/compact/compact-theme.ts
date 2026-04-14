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

import merge from "deepmerge";

import { getDefaultTheme } from "../default/default-theme.js";
import type { BaseThemeSpacingType } from "../schema/spacing.api.js";
import {
	HorizontalSpacingConfig,
	SpacingConfig,
	VerticalSpacingConfig
} from "../default/config/application/spacing.config.js";
import { ApplicationStyles } from "../default/config/application/application_styles.config.js";
import { DefaultComponentsConfigs } from "../default/config/components/components.js";

import { CompactSpacing } from "./config/base/spacing.config.js";
import { CompactComponentsConfigs } from "./config/components/components.js";

export const getCompactTheme = () => {
	const defaultTheme = getDefaultTheme();
	const compactSpacing = CompactSpacing;

	const spacing: BaseThemeSpacingType = {
		baseSpacing: compactSpacing,
		spacing: SpacingConfig(compactSpacing.BASE),
		horizontalSpacing: HorizontalSpacingConfig(compactSpacing.BASE_HORIZONTAL_WHITE_SPACING),
		verticalSpacing: VerticalSpacingConfig(compactSpacing.BASE_VERTICAL_WHITE_SPACING)
	};

	const applicationStyles = ApplicationStyles({
		colors: defaultTheme.colors,
		typography: defaultTheme.typography,
		spacing
	});

	const baseTheme = {
		...defaultTheme,
		applicationStyles,
		spacing
	};

	return {
		...baseTheme,
		components: merge(DefaultComponentsConfigs(baseTheme), CompactComponentsConfigs(baseTheme))
	};
};

export const compactTheme = getCompactTheme();
