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

export function InteractionStatesColorsShowcase() {
	const themeColors = useTheme().colors;
	const { theme } = useContext(ThemeContext);
	const isBrightTheme = theme.includes("flat") || theme.includes("base");

	const activeColors: Color[] = [
		{
			title: "Active",
			textName: "interaction.active.color",
			colorCode: themeColors.interaction.active.color
		},
		{
			textName: "interaction.active.colorLight",
			colorCode: themeColors.interaction.active.colorLight,
			textColor: "black"
		}
	];

	const activeColorsTouch: Color[] = [
		{
			title: "Active on Touch",
			textName: "interaction.active.colorTouch",
			colorCode: themeColors.interaction.active.colorTouch
		},
		{
			textName: "interaction.active.colorTouchInverted",
			colorCode: themeColors.interaction.active.colorTouchInverted,
			textColor: "black"
		}
	];

	const selectedColors: Color[] = [
		{
			title: "Selected",
			textName: "interaction.selected.color",
			colorCode: themeColors.interaction.selected.color,
			textColor: "white"
		},
		{
			textName: "interaction.selected.colorLight",
			colorCode: themeColors.interaction.selected.colorLight,
			textColor: "black"
		},
		{
			textName: "interaction.selected.colorInverted",
			colorCode: themeColors.interaction.selected.colorInverted,
			textColor: "black"
		},
		{
			textName: "interaction.selected.colorDark",
			colorCode: themeColors.interaction.selected.colorDark,
			textColor: "white"
		}
	];

	const hoverColors: Color[] = [
		{
			title: "Hover",
			textName: "interaction.hover.color",
			colorCode: themeColors.interaction.hover.color
		},
		{
			textName: "interaction.hover.colorInverted",
			colorCode: themeColors.interaction.hover.colorInverted,
			textColor: "black"
		},
		...(isBrightTheme
			? [
					{
						textName: "interaction.hover.colorLight",
						colorCode: FlatColorsConfig.interaction.hover.colorLight,
						textColor: "white"
					}
				]
			: [])
	];

	const focusColors: Color[] = [
		{
			title: "Focus",
			textName: "interaction.focus.color",
			colorCode: themeColors.interaction.focus.color
		},
		{
			textName: "interaction.focus.colorInverted",
			colorCode: themeColors.interaction.focus.colorInverted,
			textColor: "black"
		},
		{
			textName: "interaction.focus.outline",
			colorCode: themeColors.interaction.focus.outline,
			...(isBrightTheme && { textColor: "black" })
		}
	];

	const draggableColors: Color[] = [
		{
			title: "Draggable",
			textName: "interaction.draggable.color",
			colorCode: themeColors.interaction.draggable.color
		}
	];

	const disabledColors: Color[] = [
		{
			title: "Disabled",
			textName: "interaction.disabled.color",
			colorCode: themeColors.interaction.disabled.color,
			textColor: "black"
		},
		{
			textName: "interaction.disabled.colorDark",
			colorCode: themeColors.interaction.disabled.colorDark,
			textColor: "black"
		},
		{
			textName: "interaction.disabled.colorLight",
			colorCode: themeColors.interaction.disabled.colorLight,
			textColor: "black"
		}
	];

	const readonlyColors: Color[] = [
		{
			title: "Readonly",
			textName: "interaction.readonly.color",
			colorCode: themeColors.interaction.readonly.color,
			textColor: "black"
		},
		{
			textName: "interaction.readonly.colorDark",
			colorCode: themeColors.interaction.readonly.colorDark,
			textColor: "white"
		}
	];

	return (
		<div className="-u-width-full">
			<GroupColorContentBox groupColor={activeColors} />
			<GroupColorContentBox groupColor={activeColorsTouch} />
			<GroupColorContentBox groupColor={selectedColors} />
			<GroupColorContentBox groupColor={hoverColors} />
			<GroupColorContentBox groupColor={focusColors} />
			<GroupColorContentBox groupColor={draggableColors} />
			<GroupColorContentBox groupColor={disabledColors} />
			<GroupColorContentBox groupColor={readonlyColors} />
		</div>
	);
}
