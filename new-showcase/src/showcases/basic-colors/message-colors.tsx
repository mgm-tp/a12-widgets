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

import type { ReactElement } from "react";
import { useTheme } from "styled-components";

import type { Color } from "./group-color-contentbox.js";
import { GroupColorContentBox } from "./group-color-contentbox.js";

export function MessageColorsShowcase(): ReactElement {
	const themeColors = useTheme().colors;

	const infoColors: Color[] = [
		{
			title: "Info",
			textName: "variant.infoColor",
			colorCode: themeColors.variant.infoColor,
			textColor: themeColors.variant.text.info
		},
		{
			textName: "variant.infoColorLight",
			colorCode: themeColors.variant.infoColorLight,
			textColor: "black"
		},
		{
			textName: "variant.infoColorLighter",
			colorCode: themeColors.variant.infoColorLighter,
			textColor: "black"
		},
		{
			textName: "variant.infoColorDark",
			colorCode: themeColors.variant.infoColorDark,
			textColor: themeColors.variant.text.info
		}
	];

	const successColors: Color[] = [
		{
			title: "Success",
			textName: "variant.successColor",
			colorCode: themeColors.variant.successColor,
			textColor: themeColors.variant.text.success
		},
		{
			textName: "variant.successColorLight",
			colorCode: themeColors.variant.successColorLight,
			textColor: "black"
		},
		{
			textName: "variant.successColorDark",
			colorCode: themeColors.variant.successColorDark,
			textColor: themeColors.variant.text.success
		}
	];

	const warningColors: Color[] = [
		{
			title: "Warning",
			textName: "variant.warningColor",
			colorCode: themeColors.variant.warningColor,
			textColor: themeColors.variant.text.warning
		},
		{
			textName: "variant.warningColorLight",
			colorCode: themeColors.variant.warningColorLight,
			textColor: themeColors.variant.text.warning
		},
		{
			textName: "variant.warningColorDark",
			colorCode: themeColors.variant.warningColorDark,
			textColor: themeColors.variant.text.warning
		}
	];

	const errorColors: Color[] = [
		{
			title: "Error",
			textName: "variant.errorColor",
			colorCode: themeColors.variant.errorColor,
			textColor: themeColors.variant.text.error
		},
		{
			textName: "variant.errorColorLight",
			colorCode: themeColors.variant.errorColorLight,
			textColor: "black"
		},
		{
			textName: "variant.errorColorDark",
			colorCode: themeColors.variant.errorColorDark,
			textColor: themeColors.variant.text.error
		}
	];

	const constructiveColors: Color[] = [
		{
			title: "Constructive",
			textName: "variant.constructiveColor",
			colorCode: themeColors.variant.constructiveColor
		}
	];

	const destructiveColors: Color[] = [
		{
			title: "Destructive",
			textName: "variant.destructiveColor",
			colorCode: themeColors.variant.destructiveColor
		}
	];

	const textColors: Color[] = [
		{
			title: "Text",
			textName: "variant.text.info",
			colorCode: themeColors.variant.text.info,
			textColor: "black"
		},
		{
			textName: "variant.text.success",
			colorCode: themeColors.variant.text.success,
			textColor: "black"
		},
		{
			textName: "variant.text.warning",
			colorCode: themeColors.variant.text.warning
		},
		{
			textName: "variant.text.error",
			colorCode: themeColors.variant.text.error,
			textColor: "black"
		}
	];

	return (
		<div className="-u-width-full">
			<GroupColorContentBox groupColor={infoColors} />
			<GroupColorContentBox groupColor={successColors} />
			<GroupColorContentBox groupColor={warningColors} />
			<GroupColorContentBox groupColor={errorColors} />
			<GroupColorContentBox groupColor={constructiveColors} />
			<GroupColorContentBox groupColor={destructiveColors} />
			<GroupColorContentBox groupColor={textColors} />
		</div>
	);
}
