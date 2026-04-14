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

import { css } from "styled-components";
import svgToTinyDataUri from "mini-svg-data-uri";

export type CustomBorder = {
	color: string;
	width?: number;
	dashArray?: number[];
	borderRadius?: number | string;
	lineCap?: "butt" | "round" | "square";
	offSet?: number;
};

/** @internal */
const generateBorderSvg = (config: CustomBorder): string => {
	const { color, width = 1, dashArray = [], borderRadius = 0, lineCap = "butt" } = config;

	// Generate the SVG string for a custom border.
	const svg =
		`<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>` +
		`<rect width='100%' height='100%' fill='none' ` +
		(borderRadius != 0 ? `rx='${borderRadius}' ry='${borderRadius}' ` : "") +
		`stroke='${color}' ` +
		`stroke-width='${width}' ` +
		`stroke-dasharray='${dashArray}' ` +
		`stroke-linecap='${lineCap}'/>` +
		`</svg>`;

	// Return the SVG string as a data URI.
	return `url("${svgToTinyDataUri(svg)}")`;
};

/** @internal */
const customBorder = (config: CustomBorder, isInnerBorder?: boolean) => {
	const { width = 1, offSet = 0, borderRadius = 0 } = config;
	const borderOffset = (isInnerBorder ? 0 : width) + offSet * 2;

	return css`
		position: relative;

		&:before {
			background-image: ${generateBorderSvg(config)};
			border-radius: ${borderRadius};
			content: "";
			display: block;
			height: calc(100% + ${borderOffset}px);
			left: 50%;
			position: absolute;
			pointer-events: none;
			top: 50%;
			transform: translate(-50%, -50%);
			width: calc(100% + ${borderOffset}px);

			& {
				border: none;
			}
		}
	`;
};

/** @internal */
export const createBoxShadow = (config: string | CustomBorder) => {
	if (typeof config === "string") {
		return css`
			box-shadow: ${config};
		`;
	}

	return css`
		&&& {
			box-shadow: none;
		}

		${customBorder(config)}
	`;
};

/** @internal */
export const createBorder = (config: string | CustomBorder, isInnerBorder?: boolean) => {
	if (typeof config === "string") {
		return css`
			border: ${config};
		`;
	}

	return css`
		&&:not(:hover) {
			border-color: transparent;
		}

		${customBorder(config, isInnerBorder)}
	`;
};

/** @internal */
export const createOutline = (config: string | CustomBorder) => {
	if (typeof config === "string") {
		return css`
			outline: ${config};
		`;
	}

	return css`
		&&& {
			outline: none;
		}

		${customBorder(config)}
	`;
};
