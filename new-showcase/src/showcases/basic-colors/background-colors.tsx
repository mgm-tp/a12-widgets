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

import { useTheme } from "styled-components";

import type { Color } from "./group-color-contentbox.js";
import { GroupColorContentBox } from "./group-color-contentbox.js";

export function BackgroundColorsShowcase() {
	const themeColors = useTheme().colors;
	const backgroundColors: Color[] = [
		{
			description:
				"The primary background is used as a background for the main content. Example usages: content area of content boxes.",
			textName: "background.primaryBackground",
			colorCode: themeColors.background.primaryBackground,
			textColor: "black"
		},
		{
			description:
				"The secondary background is used for the body background or a slight visual separation from the primary background.",
			textName: "background.secondaryBackground",
			colorCode: themeColors.background.secondaryBackground,
			textColor: "black"
		},
		{
			description:
				"The tertiary background is used for a slight visual separation from primary and secondary backgrounds.",
			textName: "background.tertiaryBackground",
			colorCode: themeColors.background.tertiaryBackground,
			textColor: "black"
		},
		{
			description: "The interactive background is used for supporting smaller or minor interactive elements.",
			textName: "background.interactiveBackground",
			colorCode: themeColors.background.interactiveBackground,
			textColor: "black"
		},
		{
			description:
				"The non-interactive background is used to visually support smaller or minor non-interactive elements.",
			textName: "background.nonInteractiveBackground",
			colorCode: themeColors.background.nonInteractiveBackground,
			textColor: "black"
		},
		{
			description: "The inverted background is used for supporting contrary elements.",
			textName: "background.invertedBackground",
			colorCode: themeColors.background.invertedBackground,
			textColor: "black"
		},
		{
			description: "The group background is used to support elements that group other elements.",
			textName: "background.groupBackground",
			colorCode: themeColors.background.groupBackground,
			textColor: "black"
		}
	];

	return <GroupColorContentBox groupColor={backgroundColors} />;
}
