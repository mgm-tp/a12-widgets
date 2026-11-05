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

/** @internal */
export type PaneTransformOrigin = "left center" | "right center";

/** @internal */
export function getTransformOrigins(
	index: number,
	columnsCount: number,
	isRtl: boolean
): { enterTransformOrigin?: PaneTransformOrigin; exitTransformOrigin?: PaneTransformOrigin } {
	const isFirstPane = index === 0;
	const isLastPane = index === columnsCount - 1;
	const isSinglePane = columnsCount <= 1;

	if (isSinglePane) {
		return {
			enterTransformOrigin: isRtl ? "right center" : "left center",
			exitTransformOrigin: isRtl ? "left center" : "right center"
		};
	}

	if (isFirstPane && !isLastPane) {
		const origin = isRtl ? "right center" : "left center";

		return { enterTransformOrigin: origin, exitTransformOrigin: origin };
	}

	if (isLastPane && !isFirstPane) {
		const origin = isRtl ? "left center" : "right center";

		return { enterTransformOrigin: origin, exitTransformOrigin: origin };
	}

	return {};
}

/** @internal */
export function updateSeenOrder(seenOrder: string[], visibleIds: string[]): void {
	visibleIds.forEach((id, idx) => {
		if (seenOrder.includes(id)) {
			return;
		}

		const leftId = visibleIds[idx - 1];
		const rightId = visibleIds[idx + 1];
		const leftPos = leftId ? seenOrder.indexOf(leftId) : -1;
		const rightPos = rightId ? seenOrder.indexOf(rightId) : -1;

		const insertAt = leftPos !== -1 ? leftPos + 1 : rightPos !== -1 ? rightPos : seenOrder.length;

		seenOrder.splice(insertAt, 0, id);
	});
}
