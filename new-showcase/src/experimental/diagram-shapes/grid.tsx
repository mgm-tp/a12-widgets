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

import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import { styled, css } from "styled-components";

import { Range, GridMainPoint, GridSubPoint } from "@com.mgmtp.a12.widgets/widgets-core";

const baseDataRole = "diagram";
export const StyledDiagramGridRow = styled.div<{ $isLastSubRow?: boolean; $hasMainRow?: boolean }>(
	({ $isLastSubRow, $hasMainRow }) => {
		return css`
			display: flex;
			align-items: center;

			&:not(:last-child) {
				margin-bottom: ${$hasMainRow || $isLastSubRow ? 12 : 16}px;
			}

			// vertically centered between sub-point and main-point
			${!$hasMainRow &&
			css`
				margin-left: 4px;
			`}

			> [data-type="grid-point"]:last-child {
				margin-right: 0;
			}
		`;
	}
);
StyledDiagramGridRow.displayName = "StyledDiagramGridRow";
export const DiagramGrid: FC = (): ReactElement => {
	const col = 30;
	const row = 20;

	const grid = useMemo(
		() =>
			Array.from(new Range(row)).map((value, rowIdx) => {
				const shouldHasMainPoint = rowIdx % 9 === 0;

				return (
					<StyledDiagramGridRow
						key={rowIdx}
						data-role={`${baseDataRole}-grid-row`}
						$isLastSubRow={(rowIdx + 1) % 9 === 0} // row contains only sub points that stands before the one has main point
						$hasMainRow={shouldHasMainPoint} // row contains main points
					>
						{Array.from(new Range(col)).map((value, pointIdx) => {
							return shouldHasMainPoint && pointIdx % 9 === 0 ? (
								<GridMainPoint
									key={`${rowIdx}-${pointIdx}`}
									data-role={`${baseDataRole}-grid-main-point`}
									data-type="grid-point"
								/>
							) : (
								<GridSubPoint
									key={`${rowIdx}-${pointIdx}`}
									data-role={`${baseDataRole}-grid-sub-point`}
									data-type="grid-point"
									isBeforeMainPoint={shouldHasMainPoint && (pointIdx + 1) % 9 === 0}
								/>
							);
						})}
					</StyledDiagramGridRow>
				);
			}),
		[col, row]
	);

	return <div data-role={`${baseDataRole}-grid-container`}>{grid}</div>;
};

export const DiagramGridShowcase: FC = () => {
	return <DiagramGrid />;
};
