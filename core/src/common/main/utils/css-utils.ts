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

import type { Duration } from "../type-utilities.js";

type Spacing = {
	top: string;
	right: string;
	bottom: string;
	left: string;
};

/**
 * Parses a CSS shorthand spacing string and returns an object with individual values for the top, right, bottom, and left sides.
 *
 * This function supports the following shorthand forms:
 * - 1 value: Applies the same value to all sides (e.g., "10px").
 * - 2 values: The first value applies to top and bottom, the second to left and right (e.g., "10px 20px").
 * - 3 values: The first value applies to top, the second to left and right, and the third to bottom (e.g., "10px 20px 30px").
 * - 4 values: Each value applies to a specific side (top, right, bottom, left) (e.g., "10px 20px 30px 40px").
 */
export const parseShorthandSpacing = (spaces: string): Spacing => {
	const values = spaces.split(" ");
	const [top, right = top, bottom = top, left = right] = values;

	return { top, right, bottom, left };
};

/**
 * @internal
 * Converts a duration string to a number in seconds.
 */
export const getTransitionDuration = (duration: Duration): number => {
	if (duration === "0" || duration === "initial") {
		return 0;
	}

	if (duration.endsWith("ms")) {
		return Number(duration.split("ms")[0]) / 1000;
	}

	if (duration.endsWith("s")) {
		return Number(duration.split("s")[0]);
	}

	throw new Error(`Invalid duration format: ${duration}`);
};

/**
 * @internal
 */
export const getVerticalGap = (gap: string): number => {
	const match = gap.match(/^(?<value>\d+(\.\d+)?)(?<unit>px|rem)$/);

	if (!match?.groups) {
		throw new Error("Unsupported unit for gap value");
	}

	const { value, unit } = match.groups;
	const int = Number.parseFloat(value);

	if (unit === "rem") {
		const fontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

		return int * fontSize;
	}

	if (unit === "px") {
		return int;
	}

	throw new Error("Unsupported unit for gap value");
};
