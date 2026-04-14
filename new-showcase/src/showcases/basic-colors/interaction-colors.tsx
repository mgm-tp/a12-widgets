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

export function InteractionColorsShowcase() {
	const { theme } = useContext(ThemeContext);
	const isFlatTheme = theme.includes("flat");
	const themeColors = useTheme().colors;

	const interactionColors: Color[] = [
		{
			description: "The primary interaction color is used for the most prominent action.",
			textName: "interaction.primaryInteractionColor",
			colorCode: themeColors.interaction.primaryInteractionColor
		},
		{
			description:
				"The secondary interaction color is used for the elements which execute an action but with a minor priority.",
			textName: "interaction.secondaryInteractionColor",
			colorCode: themeColors.interaction.secondaryInteractionColor
		},
		...(isFlatTheme
			? [
					{
						textName: "interaction.color",
						colorCode: FlatColorsConfig.interaction.color,
						textColor: "white"
					},
					{
						textName: "interaction.colorDark",
						colorCode: FlatColorsConfig.interaction.colorDark,
						textColor: "white"
					},
					{
						textName: "interaction.colorBG",
						colorCode: FlatColorsConfig.interaction.colorBG,
						textColor: "black"
					},
					{
						textName: "interaction.colorBGLight",
						colorCode: FlatColorsConfig.interaction.colorBGLight,
						textColor: "black"
					}
				]
			: [])
	];

	return <GroupColorContentBox groupColor={interactionColors} />;
}
