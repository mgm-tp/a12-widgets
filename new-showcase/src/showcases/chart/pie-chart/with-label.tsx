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
import { useState, useCallback, useMemo } from "react";

import type { SelectItem, PieChartElementsProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Select, PieChart, PieChartElements, ResponsiveChartContainer } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../../helpers/configuration-view.js";

const data = [
	{ name: "Africa", value: 54, color: "#ffcd29" },
	{ name: "Europe", value: 47, color: "#9c1616" },
	{ name: "Asia", value: 44, color: "#f56600" },
	{ name: "North America", value: 23, color: "#056294" },
	{ name: "Oceania", value: 14, color: "#196719" },
	{ name: "South America", value: 12, color: "#b5e4fd" },
	{ name: "Antarctica", value: 0, color: "#e96363" }
];

export function PieChartWithLabelShowCase(): ReactElement {
	const [name, setName] = useState("");
	const [value, setValue] = useState<number | undefined>(undefined);
	const [primaryTextPosition, setPrimaryTextPosition] = useState<PieChartElementsProps.TextPosition>("center");
	const [secondaryTextPosition, setSecondaryTextPosition] = useState<PieChartElementsProps.TextPosition>("center");

	const handleOnMouseOut = useCallback((): void => {
		setName("");
		setValue(undefined);
	}, []);

	const handleMouseOver = useCallback((hoverData: { name: string; value: number }): void => {
		setName(hoverData.name);
		setValue(hoverData.value);
	}, []);

	const handlePrimaryTextPositionChange = useCallback((value: PieChartElementsProps.TextPosition): void => {
		setPrimaryTextPosition(value);
	}, []);

	const handleSecondaryTextPositionChange = useCallback((value: PieChartElementsProps.TextPosition): void => {
		setSecondaryTextPosition(value);
	}, []);

	const getSumOfDataValues = useMemo((): number => {
		return data.reduce((sum, item) => sum + item.value, 0);
	}, []);

	const positions: SelectItem[] = [
		{ label: "Center (Default)", value: "center" },
		{ label: "Top", value: "top" },
		{ label: "Top Left", value: "top-left" },
		{ label: "Top Right", value: "top-right" },
		{ label: "Bottom", value: "bottom" },
		{ label: "Bottom Left", value: "bottom-left" },
		{ label: "Bottom Right", value: "bottom-right" }
	];

	return (
		// ConfigurationView is a showcase utility and you can just delete it.
		<ConfigurationView
			configuration={
				<div className="-u-width-1-2">
					<Select
						label="Primary Text Position"
						value={primaryTextPosition}
						onValueChanged={handlePrimaryTextPositionChange}
						items={positions}
					/>
					<br />
					<Select
						label="Secondary Text Position"
						value={secondaryTextPosition}
						onValueChanged={handleSecondaryTextPositionChange}
						items={positions}
					/>
				</div>
			}
		>
			<ResponsiveChartContainer aspect={0.5} maxHeight={300}>
				<PieChart
					innerRadius="50%"
					outerRadius="100%"
					data={data}
					pieProps={{
						onMouseOver: handleMouseOver,
						onMouseOut: handleOnMouseOut
					}}
					legendProps={{
						onMouseEnter: handleMouseOver,
						onMouseLeave: handleOnMouseOut
					}}
					label={[
						<PieChartElements.Label
							key="chart-label"
							primaryText={
								<PieChartElements.Text position={primaryTextPosition}>
									{!name || primaryTextPosition !== "center" ? getSumOfDataValues : undefined}
								</PieChartElements.Text>
							}
							secondaryText={
								<PieChartElements.Text type="secondary" position={secondaryTextPosition}>
									{value === undefined || secondaryTextPosition !== "center" ? "Countries" : undefined}
								</PieChartElements.Text>
							}
						/>,
						<PieChartElements.Label
							key="segment-label"
							primaryText={<PieChartElements.Text>{value}</PieChartElements.Text>}
							secondaryText={<PieChartElements.Text type="secondary">{name}</PieChartElements.Text>}
						/>
					]}
				/>
			</ResponsiveChartContainer>
		</ConfigurationView>
	);
}
