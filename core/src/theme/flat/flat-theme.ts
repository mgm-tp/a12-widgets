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

import type { DivisionLineStyle } from "../schema/application-styles.api.js";
import { ApplicationStyles } from "../default/config/application/application_styles.config.js";
import { DivisionLineStyles } from "../default/config/application/division-line.config.js";
import { getDefaultTheme } from "../default/default-theme.js";
import { DefaultComponentsConfigs } from "../default/config/components/components.js";

import { FlatColorsConfig } from "./config/base/colors.config.js";
import { FlatComponentsConfigs } from "./config/components/components.js";
import { ApplicationFlatStyles } from "./config/application/application_styles.config.js";
import { FocusFlatStyles } from "./config/application/focus.config.js";
import { HoverFlatStyles } from "./config/application/hover.config.js";
import { FlatDivisionLineStyles } from "./config/application/division-line.config.js";

/** @deprecated since v39.0.0. Use {@link getBaseTheme} from `@com.mgmtp.a12.widgets/widgets-core`. */
export const getFlatTheme = () => {
	const defaultTheme = getDefaultTheme();
	const colors = FlatColorsConfig;
	// The Flat theme has different set of colors than the Default theme, but use the same typography and spacing configuration as the Default theme
	const applicationProps = {
		colors,
		typography: defaultTheme.typography,
		spacing: defaultTheme.spacing
	};

	// The focus, hover style are configured differently in Flat theme.
	const focusStyles = FocusFlatStyles({ colors });
	const hoverStyles = HoverFlatStyles({ colors });

	// The color, typography, spacing, hover and focus styles are then used to derive `applicationStyles`.
	const applicationStyles = merge(ApplicationStyles(applicationProps), ApplicationFlatStyles({ hoverStyles }));

	// The division line is also configured differently in Flat theme
	const divisionLineStyles = merge<DivisionLineStyle>(DivisionLineStyles({ colors }), FlatDivisionLineStyles());

	// The Base Styles is then constructed from the default theme Base Styles, with Flat theme specific variables applied on top
	const baseTheme = {
		...defaultTheme,
		colors,
		applicationStyles,
		focusStyles,
		hoverStyles,
		divisionLineStyles
	};

	return {
		...baseTheme,
		colors,
		components: merge(DefaultComponentsConfigs(baseTheme), FlatComponentsConfigs(baseTheme))
	};
};

/** @deprecated since v39.0.0. Use {@link getBaseTheme} from `@com.mgmtp.a12.widgets/widgets-core`. */
export const flatTheme = getFlatTheme();
