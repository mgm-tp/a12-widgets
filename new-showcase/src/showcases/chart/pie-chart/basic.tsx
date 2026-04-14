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

import { PieChart, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

const data = [
	{ name: "Africa", value: 47, color: "#ffcd29" },
	{ name: "Europe", value: 54, color: "#9c1616" },
	{ name: "Asia", value: 44, color: "#f56600" },
	{ name: "North America", value: 23, color: "#056294" },
	{ name: "Oceania", value: 14, color: "#196719" },
	{ name: "South America", value: 12, color: "#b5e4fd" },
	{ name: "Antarctica", value: 0, color: "#e96363" }
];

export function BasicPieChart(): ReactElement {
	return (
		<ResponsiveChartContainer aspect={0.5} maxHeight={300}>
			<PieChart innerRadius="50%" outerRadius="100%" data={data} />
		</ResponsiveChartContainer>
	);
}
