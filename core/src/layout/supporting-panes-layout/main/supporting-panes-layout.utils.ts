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

import type { RefObject } from "react";
import { useEffect, useMemo, useState } from "react";

import type { SupportingPanesLayoutProps } from "./supporting-panes-layout.api.js";

/**
 * @param parentElement Parent element that wraps the current element which is needed for calculating how many pixels of 1% is.
 * @param dimension A size which can be defined as a number or string. If a number, it's assumed as pixel. If a string, it's assumed as a value in percent or pixel that needs to be converted to a number in pixel.
 *
 * @returns A number in pixel.
 * */
export function convertToPixel(parentElement: HTMLElement | null, dimension?: number | string): number {
	if (parentElement && dimension) {
		if (typeof dimension === "number") {
			return dimension;
		}

		if (dimension.includes("%")) {
			return Number(dimension.split("%")[0]) * 0.01 * parentElement.offsetWidth;
		}

		if (dimension.includes("px")) {
			return Number(dimension.split("px")[0]);
		}
	}

	return 0;
}

export function useLayoutWidth(params: {
	paneRef: RefObject<HTMLElement | null>;
	hide?: boolean;
	widthConfig: SupportingPanesLayoutProps.SecondaryPaneProps["widthConfig"] & {
		minResize?: string | number;
		maxResize?: string | number;
	};
}): {
	resizeMinWidth: number;
	resizeMaxWidth: number;
	collapsedWidth: number;
	expandedWidth: number;
} {
	const { paneRef, widthConfig, hide } = params;
	const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (paneRef.current && !hide) {
			setParentElement(paneRef.current.parentElement);
		}
	}, [paneRef, hide]);

	const resizeMinWidth = useMemo(() => {
		return convertToPixel(parentElement, widthConfig?.minResize);
	}, [parentElement, widthConfig?.minResize]);

	const resizeMaxWidth = useMemo(() => {
		return convertToPixel(parentElement, widthConfig?.maxResize);
	}, [parentElement, widthConfig?.maxResize]);

	const collapsedWidth = useMemo(() => {
		return convertToPixel(parentElement, widthConfig?.collapsed);
	}, [parentElement, widthConfig?.collapsed]);

	const expandedWidth = useMemo(() => {
		return convertToPixel(parentElement, widthConfig?.expanded);
	}, [parentElement, widthConfig?.expanded]);

	return {
		resizeMinWidth,
		resizeMaxWidth,
		collapsedWidth,
		expandedWidth
	};
}
