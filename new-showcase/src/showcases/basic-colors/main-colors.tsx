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

import { useContext } from "react";
import { useTheme } from "styled-components";

import { ThemeContext } from "../../helpers/theme-selector.js";

import type { Color } from "./group-color-contentbox.js";
import { GroupColorContentBox } from "./group-color-contentbox.js";

export function MainColorsShowcase() {
	const { theme } = useContext(ThemeContext);
	const isBrightTheme = theme.includes("flat") || theme.includes("base");
	const themeColors = useTheme().colors;
	const mainColors: Color[] = [
		{
			description: `The primary color defines the overall look and feel. 
			It is regularly used for the application header, and content headings.`,
			textName: "primaryColor",
			colorCode: themeColors.primaryColor,
			textColor: isBrightTheme ? "black" : "white"
		},
		{
			description: `The secondary color is a supportive main color and indicates the second-level information. 
			It is used to split primary information for a better overview. Example usages: Main menu, Tab navigation, etc.`,
			textName: "secondaryColor",
			colorCode: themeColors.secondaryColor,
			textColor: isBrightTheme ? "black" : "white"
		}
	];

	return <GroupColorContentBox groupColor={mainColors} />;
}
