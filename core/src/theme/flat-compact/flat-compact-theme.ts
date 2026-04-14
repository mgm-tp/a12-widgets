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

import type { BaseThemeSpacingType } from "../schema/spacing.api.js";
import { DefaultComponentsConfigs } from "../default/config/components/components.js";
import { ApplicationStyles } from "../default/config/application/application_styles.config.js";
import { DivisionLineStyles } from "../default/config/application/division-line.config.js";
import {
	HorizontalSpacingConfig,
	SpacingConfig,
	VerticalSpacingConfig
} from "../default/config/application/spacing.config.js";
import { getDefaultTheme } from "../default/default-theme.js";
import type { FlatColorsConfigType } from "../flat/config/base/colors.config.js";
import { FlatColorsConfig } from "../flat/config/base/colors.config.js";
import { CompactSpacing } from "../compact/config/base/spacing.config.js";
import { HoverFlatStyles } from "../flat/config/application/hover.config.js";
import { FocusFlatStyles } from "../flat/config/application/focus.config.js";
import { FlatDivisionLineStyles } from "../flat/config/application/division-line.config.js";
import { ApplicationFlatStyles } from "../flat/config/application/application_styles.config.js";
import { CompactComponentsConfigs } from "../compact/config/components/components.js";
import { FlatComponentsConfigs } from "../flat/config/components/components.js";
import type { DivisionLineStyle } from "../schema/application-styles.api.js";

import { FlatCompactComponentsConfigs } from "./config/components/components.js";
import { FlatCompactColorsConfig } from "./config/base/colors.config.js";

export const getFlatCompactTheme = () => {
	const defaultTheme = getDefaultTheme();
	const colors: FlatColorsConfigType = merge<FlatColorsConfigType>(FlatColorsConfig, FlatCompactColorsConfig);
	const flatCompactSpacing = CompactSpacing;

	const spacing: BaseThemeSpacingType = {
		baseSpacing: flatCompactSpacing,
		spacing: SpacingConfig(flatCompactSpacing.BASE),
		horizontalSpacing: HorizontalSpacingConfig(flatCompactSpacing.BASE_HORIZONTAL_WHITE_SPACING),
		verticalSpacing: VerticalSpacingConfig(flatCompactSpacing.BASE_VERTICAL_WHITE_SPACING)
	};
	const applicationProps = {
		colors,
		typography: defaultTheme.typography,
		spacing: spacing
	};
	const focusStyles = FocusFlatStyles({ colors });
	const hoverStyles = HoverFlatStyles({ colors });

	const applicationStyles = merge(ApplicationStyles(applicationProps), ApplicationFlatStyles({ hoverStyles }));

	const divisionLineStyles = merge<DivisionLineStyle>(DivisionLineStyles({ colors }), FlatDivisionLineStyles());
	const baseTheme = {
		...defaultTheme,
		applicationStyles,
		colors,
		divisionLineStyles,
		focusStyles,
		hoverStyles,
		spacing
	};

	return {
		...baseTheme,
		colors,
		components: merge(
			merge(DefaultComponentsConfigs(baseTheme), FlatComponentsConfigs(baseTheme)),
			merge(CompactComponentsConfigs(baseTheme), FlatCompactComponentsConfigs(baseTheme))
		)
	};
};

export const flatCompactTheme = getFlatCompactTheme();
