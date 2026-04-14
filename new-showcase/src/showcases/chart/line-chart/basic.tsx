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
import type { LineProps } from "recharts";

import { LineChart, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

const DATA = [
	{ year: 2000, vn: 56.05, germany: 6.2, france: 12.97, southKorea: 1.49 },
	{ year: 2001, vn: 60.75, germany: 6.51, france: 14.26, southKorea: 1.44 },
	{ year: 2002, vn: 52.14, germany: 7.64, france: 11.6, southKorea: 1.09 },
	{ year: 2003, vn: 47.69, germany: 7.75, france: 11.23, southKorea: 1.56 },
	{ year: 2004, vn: 39.61, germany: 9.5, france: 11.24, southKorea: 1.34 },
	{ year: 2005, vn: 40.68, germany: 10.34, france: 9.86, southKorea: 1.1 },
	{ year: 2006, vn: 34.96, germany: 11.51, france: 10.95, southKorea: 1.04 },
	{ year: 2007, vn: 35.16, germany: 14.14, france: 11.69, southKorea: 1.01 },
	{ year: 2008, vn: 36.68, germany: 14.89, france: 12.98, southKorea: 1.05 },
	{ year: 2009, vn: 37.22, germany: 16.29, france: 13.12, southKorea: 1.09 },
	{ year: 2010, vn: 30.14, germany: 16.84, france: 13.86, southKorea: 1.72 },
	{ year: 2011, vn: 40.59, germany: 20.5, france: 11.64, southKorea: 2.46 },
	{ year: 2012, vn: 46.19, germany: 23.06, france: 15.03, southKorea: 2.5 },
	{ year: 2013, vn: 44.36, germany: 24.14, france: 17.25, southKorea: 2.8 },
	{ year: 2014, vn: 44.51, germany: 26.22, france: 16.61, southKorea: 3.37 },
	{ year: 2015, vn: 36.25, germany: 29.47, france: 16.0, southKorea: 3.67 },
	{ year: 2016, vn: 37.0, germany: 29.5, france: 17.72, southKorea: 3.99 },
	{ year: 2017, vn: 45.58, germany: 33.49, france: 16.66, southKorea: 4.8 },
	{ year: 2018, vn: 40.0, germany: 35.35, france: 19.73, southKorea: 5.23 },
	{ year: 2019, vn: 31.6, germany: 40.3, france: 20.0, southKorea: 5.76 },
	{ year: 2020, vn: 36.17, germany: 43.9, france: 23.49, southKorea: 6.13 },
	{ year: 2021, vn: 35.67, germany: 40.32, france: 21.78, southKorea: 7.77 }
];

const LINE_PROPS_MAP: { [dataKey: string]: LineProps } = {
	vietNam: {
		dataKey: "vn",
		stroke: "#0088FE",
		strokeWidth: 2,
		name: "Viet Nam"
	},
	germany: {
		dataKey: "germany",
		stroke: "#00C49F",
		strokeWidth: 2,
		name: "Germany"
	},
	france: {
		dataKey: "france",
		stroke: "#FFBB28",
		strokeWidth: 2,
		name: "France"
	},
	southKorea: {
		dataKey: "southKorea",
		stroke: "#FF8042",
		strokeWidth: 2,
		name: "South Korea"
	}
};

export function BasicLineChart(): ReactElement {
	return (
		<ResponsiveChartContainer aspect={0.5} maxHeight={300}>
			<LineChart
				data={DATA}
				xAxisProps={{ dataKey: "year", tickCount: 6, type: "number", domain: ["dataMin", "dataMax"] }}
				yAxisProps={{ unit: "%" }}
				xAxisLabel="year"
				yAxisLabel="TWh"
				linePropsMap={LINE_PROPS_MAP}
				cartesianGridProps={{
					horizontal: true,
					vertical: true
				}}
			/>
		</ResponsiveChartContainer>
	);
}
