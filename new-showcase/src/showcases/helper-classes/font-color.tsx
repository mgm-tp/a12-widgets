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

const fontColors = [
	{ name: "default", value: "undefined" },
	{ name: "h_blueFC", value: "GeneralColorsConfig.blue" },
	{ name: "h_blueDarkFC", value: "GeneralColorsConfig.blueDark" },
	{ name: "h_blueLightFC", value: "GeneralColorsConfig.blueLight" },
	{ name: "h_greenFC", value: "GeneralColorsConfig.green" },
	{ name: "h_greenDarkFC", value: "GeneralColorsConfig.greenDark" },
	{ name: "h_greenLightFC", value: "GeneralColorsConfig.greenLight" },
	{ name: "h_greyFC", value: "GeneralColorsConfig.grey" },
	{ name: "h_greyDarkFC", value: "GeneralColorsConfig.greyDark" },
	{ name: "h_greyLightFC", value: "GeneralColorsConfig.greyLight" },
	{ name: "h_orangeFC", value: "GeneralColorsConfig.orange" },
	{ name: "h_orangeDarkFC", value: "GeneralColorsConfig.orangeDark" },
	{ name: "h_orangeLightFC", value: "GeneralColorsConfig.orangeLight" },
	{ name: "h_purpleFC", value: "GeneralColorsConfig.purple" },
	{ name: "h_purpleDarkFC", value: "GeneralColorsConfig.purpleDark" },
	{ name: "h_purpleLightFC", value: "GeneralColorsConfig.purpleLight" },
	{ name: "h_redFC", value: "GeneralColorsConfig.red" },
	{ name: "h_redDarkFC", value: "GeneralColorsConfig.redDark" },
	{ name: "h_redLightFC", value: "GeneralColorsConfig.redLight" },
	{ name: "h_yellowFC", value: "GeneralColorsConfig.yellow" },
	{ name: "h_yellowDarkFC", value: "GeneralColorsConfig.yellowDark" },
	{ name: "h_yellowLightFC", value: "GeneralColorsConfig.yellowLight" },
	{ name: "h_whiteFC", value: "GeneralColorsConfig.white" },
	{ name: "h_blackFC", value: "GeneralColorsConfig.black" }
];

export function FontColor(): ReactElement {
	return <CommonShowcases title="font color" helperClasses={fontColors} hasIconButtonExamples />;
}
