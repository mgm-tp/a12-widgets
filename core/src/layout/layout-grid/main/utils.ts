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

import type { LayoutGridProps } from "./layout-grid.api.js";

export namespace LayoutGridUtils {
	/**
	 * Calculate the size of columns inside a row, based on the layout and offset, span information given in responsive
	 * config.
	 * @param columnCount Number of columns in the actual row
	 * @param layoutConfig see properties of {@link LayoutConfig}
	 */
	export const calculateSize = (
		columnCount: number,
		layoutConfig?: LayoutGridProps.LayoutConfig
	): LayoutGridProps.SizeCalculationResult | null => {
		if (!layoutConfig) {
			return null;
		}

		const { layout, offsets: offsetsConfig, spans: spansConfig } = layoutConfig;
		const results: LayoutGridProps.SizeCalculationResult = [];

		// utility function to calculate at each breakpoint
		const calculateSizeAtBreakPoint = (layout: number[], offsets: number[], spans: number[]) => {
			let usedColumns = 0;
			const results: { spacing: LayoutGridProps.ColumnNumber; width: LayoutGridProps.ColumnNumber }[] = [];

			for (let i = 0; i < columnCount; i++) {
				const offset = offsets[i];
				const span = spans[i];
				// A little helper that sums the column sizes of a given range
				const layoutSum = (start: number, end: number) =>
					layout.slice(start, end).reduce((a, b) => a + b, 0) as LayoutGridProps.ColumnNumber;

				const spacing = layoutSum(usedColumns, usedColumns + offset);
				const width = layoutSum(usedColumns + offset, usedColumns + offset + span);
				usedColumns += offset + span;

				results.push({ spacing, width });
			}

			return results;
		};

		const prefillOffsets = Array.from(Array(columnCount)).fill(0, 0, columnCount);
		const prefillSpans = Array.from(Array(columnCount)).fill(1, 0, columnCount);

		// fill the offsets & spans with default value if they are not given
		type RequiredResponsiveConfig = {
			lg: LayoutGridProps.ColumnNumber[];
			md: LayoutGridProps.ColumnNumber[];
			sm: LayoutGridProps.ColumnNumber[];
		};
		const offsets: RequiredResponsiveConfig = {
				lg: offsetsConfig ? offsetsConfig.lg : prefillOffsets,
				md: offsetsConfig && offsetsConfig.md ? offsetsConfig.md : prefillOffsets,
				sm: offsetsConfig && offsetsConfig.sm ? offsetsConfig.sm : prefillOffsets
			},
			spans: RequiredResponsiveConfig = {
				lg: spansConfig ? spansConfig.lg : prefillSpans,
				md: spansConfig && spansConfig.md ? spansConfig.md : prefillSpans,
				sm: spansConfig && spansConfig.sm ? spansConfig.sm : prefillSpans
			};

		const resultLG = calculateSizeAtBreakPoint(layout["lg"], offsets.lg, spans.lg);
		const resultMD = layout["md"] ? calculateSizeAtBreakPoint(layout["md"], offsets["md"], spans["md"]) : resultLG;
		const resultSM = layout["sm"] ? calculateSizeAtBreakPoint(layout["sm"], offsets["sm"], spans["sm"]) : resultMD;

		for (let i = 0; i < resultLG.length; i++) {
			const result = {
				columnSize: { lg: resultLG[i].width, md: resultMD[i].width, sm: resultSM[i].width },
				spacerSize: { lg: resultLG[i].spacing, md: resultMD[i].spacing, sm: resultSM[i].spacing }
			};
			results.push(result);
		}

		return results;
	};
}
