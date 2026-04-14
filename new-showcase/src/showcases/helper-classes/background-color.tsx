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

import { CommonShowcases } from "./common.js";

const colorBG = [
	{ name: "default", value: "undefined" },
	{ name: "h_blueBG", value: "GeneralColorsConfig.blue" },
	{ name: "h_blueDarkBG", value: "GeneralColorsConfig.blueDark" },
	{ name: "h_blueLightBG", value: "GeneralColorsConfig.blueLight" },
	{ name: "h_greenBG", value: "GeneralColorsConfig.green" },
	{ name: "h_greenDarkBG", value: "GeneralColorsConfig.greenDark" },
	{ name: "h_greenLightBG", value: "GeneralColorsConfig.greenLight" },
	{ name: "h_greyBG", value: "GeneralColorsConfig.grey" },
	{ name: "h_greyDarkBG", value: "GeneralColorsConfig.greyDark" },
	{ name: "h_greyLightBG", value: "GeneralColorsConfig.greyLight" },
	{ name: "h_orangeBG", value: "GeneralColorsConfig.orange" },
	{ name: "h_orangeDarkBG", value: "GeneralColorsConfig.orangeDark" },
	{ name: "h_orangeLightBG", value: "GeneralColorsConfig.orangeLight" },
	{ name: "h_purpleBG", value: "GeneralColorsConfig.purple" },
	{ name: "h_purpleDarkBG", value: "GeneralColorsConfig.purpleDark" },
	{ name: "h_purpleLightBG", value: "GeneralColorsConfig.purpleLight" },
	{ name: "h_redBG", value: "GeneralColorsConfig.red" },
	{ name: "h_redDarkBG", value: "GeneralColorsConfig.redDark" },
	{ name: "h_redLightBG", value: "GeneralColorsConfig.redLight" },
	{ name: "h_yellowBG", value: "GeneralColorsConfig.yellow" },
	{ name: "h_yellowDarkBG", value: "GeneralColorsConfig.yellowDark" },
	{ name: "h_yellowLightBG", value: "GeneralColorsConfig.yellowLight" },
	{ name: "h_whiteBG", value: "GeneralColorsConfig.white" },
	{ name: "h_transparentBG", value: "transparent" },
	{ name: "h_blackBG", value: "GeneralColorsConfig.black" }
];

export function BackgroundColor(): ReactElement {
	return <CommonShowcases title="background color" helperClasses={colorBG} hasIconButtonExamples />;
}
