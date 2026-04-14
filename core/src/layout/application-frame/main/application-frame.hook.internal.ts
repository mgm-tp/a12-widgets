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
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "styled-components";
import { useResizeDetector } from "react-resize-detector";
import { clamp } from "lodash-es";

import { DataRoles } from "../../../common/main/data-roles.js";
import { DOMUtils } from "../../../common/main/utils/dom-utils.js";

import convertToPixel = DOMUtils.convertToPixel;

export const useSideBarExpandedWidth = ({
	sideBarRef,
	maxWidth,
	minWidth
}: {
	sideBarRef: RefObject<HTMLElement | null>;
	maxWidth?: string | number;
	minWidth?: string | number;
}): string => {
	const {
		components: {
			applicationFrame: { sidebar }
		}
	} = useTheme();

	const [expandedMinimizedWidth, setExpandedMinimizedWidth] = useState<string>("");

	const maxWidthRef = useRef(maxWidth);
	const minWidthRef = useRef(minWidth);

	useEffect(() => {
		maxWidthRef.current = maxWidth;
		minWidthRef.current = minWidth;
	});

	const calculateWidth = useCallback((): void => {
		const contentElement = sideBarRef.current?.closest<HTMLElement>(
			`[data-role="${DataRoles.ApplicationFrame.Content}"]`
		);

		if (!contentElement) {
			return;
		}

		const maxWidthValue = convertToPixel(contentElement, maxWidthRef.current);
		const minWidthValue = convertToPixel(contentElement, minWidthRef.current);
		const expandedMinimizedWidthValue = convertToPixel(contentElement, sidebar.expandedMinimizedWidth);

		if (expandedMinimizedWidthValue) {
			setExpandedMinimizedWidth(
				`${clamp(expandedMinimizedWidthValue, minWidthValue || 0, maxWidthValue || Infinity)}px`
			);
		} else {
			setExpandedMinimizedWidth(sidebar.expandedMinimizedWidth);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sideBarRef.current, sidebar.expandedMinimizedWidth]);

	useEffect(() => {
		calculateWidth();
	}, [calculateWidth]);

	const contentRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		contentRef.current =
			sideBarRef.current?.closest<HTMLElement>(`[data-role="${DataRoles.ApplicationFrame.Content}"]`) || null;
	}, [sideBarRef]);

	useResizeDetector({
		targetRef: contentRef,
		onResize: calculateWidth
	});

	return expandedMinimizedWidth;
};
