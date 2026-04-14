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

import { styled, css } from "styled-components";

import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";
import { hover } from "../../theme/base/mixins/_interaction.js";

import type { ResizeHandlerProps } from "./resize-handler.api.js";

const resizeHandleIndicatorWidth = (gapNum: number, defaultWidth: number = 6): number => {
	if (gapNum <= 12) {
		return gapNum < 4 ? 4 : gapNum;
	}

	return defaultWidth;
};

export const StyledResizeHandler = styled.div.withConfig({ displayName: "StyledResizeHandler-sc-" })<{
	$layoutGap: number;

	/**
	 * Used to adjust the height of the resize handler indicator.
	 */
	$borderRadius: number;
	$position: ResizeHandlerProps["position"];
}>(({ theme, $layoutGap, $borderRadius, $position }) => {
	const { interaction } = theme.colors;
	const hoverAreaWidth = resizeHandleIndicatorWidth($layoutGap, $layoutGap);
	const indicatorWidth = resizeHandleIndicatorWidth($layoutGap);
	const indicatorPosition = $layoutGap < indicatorWidth ? -indicatorWidth / 2 : -hoverAreaWidth;

	return css`
		cursor: col-resize;
		flex-shrink: 0;
		position: absolute;
		right: ${$position === "right" && `${indicatorPosition}px`};
		left: ${$position === "left" && `${indicatorPosition}px`};
		top: ${$borderRadius}px;
		bottom: ${$borderRadius}px;
		user-select: none;
		width: ${hoverAreaWidth}px;
		z-index: 1;
		-webkit-user-select: none;
		-moz-user-select: none;
		${createPseudoElement(
			":before",
			css`
				width: ${indicatorWidth}px;
				left: ${(hoverAreaWidth - indicatorWidth) / 2}px;
			`
		)}
		${hover(css`
			&:before {
				background-color: ${interaction.hover.color};
			}
		`)}
	`;
});

export const StyledResizeHandlerWrapper = styled.div.withConfig({ displayName: "StyledResizeHandlerWrapper-sc-" })<{
	$resizable: boolean;
}>(({ $resizable }) => {
	return css`
		height: 100%;
		width: 100%;
		position: ${$resizable && "relative"};
	`;
});
