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

import type { ChangeEvent, ReactElement } from "react";
// start code removal
import { useState, useCallback, useMemo } from "react";
// end code removal

import { BarChart, ResponsiveChartContainer, provider } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ShowcaseSlider } from "../../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../../helpers/showcase-example.js";

const CHART_DATA = [
	{ month: "Jan", sale: 145 },
	{ month: "Feb", sale: 150 },
	{ month: "Mar", sale: 90 },
	{ month: "Apr", sale: 80 },
	{ month: "May", sale: 50 },
	{ month: "Jun", sale: 130 },
	{ month: "Jul", sale: 140 }
];
const BAR_PROPS_MAP = {
	sale: {
		dataKey: "sale",
		color: "#0088FE"
	}
};
const MAX_PERCENTAGE = 80;
const MIN_PERCENTAGE = 20;
const TOTAL_PERCENTAGE = MAX_PERCENTAGE + MIN_PERCENTAGE;
const AVERAGE_PERCENTAGE = TOTAL_PERCENTAGE / 2;
const CHART_CONTAINER_WIDTH = provider.isPhone() ? 320 : 600;
// end code removal
export function WithPercentageDimension(): ReactElement {
	// start code removal
	const [percentage, setPercentage] = useState(AVERAGE_PERCENTAGE);

	const handleSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		const value = parseFloat(event.target.value);
		setPercentage(value);
	}, []);

	const legendWidth = useMemo(() => Number.parseInt(`${CHART_CONTAINER_WIDTH * (percentage / 100)}`), [percentage]);

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div>
					<p>
						The width of Chart: <strong>{TOTAL_PERCENTAGE - percentage}%</strong> ({CHART_CONTAINER_WIDTH - legendWidth}
						px)
					</p>
					<p>
						The width of Legend: <strong>{percentage}%</strong> ({legendWidth}px)
					</p>
					<ShowcaseSlider
						value={percentage}
						onChange={handleSliderChange}
						range={{ min: MIN_PERCENTAGE, max: MAX_PERCENTAGE }}
					/>
				</div>
			}
		>
			<CodeSnippetGenerationWrapper>
				<ResponsiveChartContainer aspect={1.5} width={CHART_CONTAINER_WIDTH}>
					<BarChart
						data={CHART_DATA}
						labelKey="month"
						xAxisProps={{ dataKey: "month" }}
						xAxisLabel="Month"
						yAxisLabel="Sale"
						barPropsMap={BAR_PROPS_MAP}
						legendProps={{ width: legendWidth }}
					/>
				</ResponsiveChartContainer>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
