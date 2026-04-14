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

import { FlatColorsConfig } from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContext } from "../../helpers/theme-selector.js";

import type { Color } from "./group-color-contentbox.js";
import { GroupColorContentBox } from "./group-color-contentbox.js";

export function TextColorsShowcase() {
	const { theme } = useContext(ThemeContext);
	const isFlatTheme = theme.includes("flat");
	const themeColors = useTheme().colors;
	const textColors: Color[] = [
		{
			description: "The headline color is used for the title for better contrast to the content.",
			textName: "text.headlineColor",
			colorCode: themeColors.text.headlineColor
		},
		{
			description: "The text color is used for the copy, input labels, etc.",
			textName: "text.color",
			colorCode: themeColors.text.color
		},
		{
			description: "The text secondary color is used for the captions, fine print, less important copy.",
			textName: "text.secondaryColor",
			colorCode: themeColors.text.secondaryColor,
			textColor: "black"
		},
		{
			description: "The text secondary dark color is used for darker captions or fine print.",
			textName: "text.secondaryColorDark",
			colorCode: themeColors.text.secondaryColorDark
		},
		{
			description: "The text inverted color is used for the text on a dark background.",
			textName: "text.invertedColor",
			colorCode: themeColors.text.invertedColor,
			textColor: "black"
		},
		...(isFlatTheme
			? [
					{
						description: "The title color is used for the main titles in the flat theme.",
						textName: "text.titleColor",
						colorCode: FlatColorsConfig.text.titleColor,
						textColor: "white"
					},
					{
						description: "The placeholder color is used for placeholder text in input fields in the flat theme.",
						textName: "text.placeholderColor",
						colorCode: FlatColorsConfig.text.placeholderColor,
						textColor: "white"
					}
				]
			: [])
	];

	return <GroupColorContentBox groupColor={textColors} />;
}
