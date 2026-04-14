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

import type { CustomBorder } from "../base/mixins/_borderEffects.js";

export type ApplicationStyle = {
	background: string;
	boxShadow: string;
	color: string;
	fontFamily: string;
	fontSize: string;
	input: {
		activeBoxShadow: string;
		background: string;
		borderRadius: string | number;
		boxShadow: string;
		defaultBorder: string;
		focusBorder: string;
		focusBoxShadow: string;
		focusCustomBoxShadow?: CustomBorder;
		fontColor: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		hoverBorder: string;
		hoverBoxShadow: string;
		lineHeight: number;
		height: string;
	};
	label: {
		disabledColor: string;
		fontColor: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		textTransform: string;
	};
	paragraphMargin: string;
	responsive: { desktopMinWidth: string; mobileMaxWidth: string; tabletMinWidth: string };
};

export type DivisionLineStyle = { bottomLine: string; initialLine: string; lineHeight: string; topLine: string };
