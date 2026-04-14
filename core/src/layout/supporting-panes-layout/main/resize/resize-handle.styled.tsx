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

import { createPseudoElement } from "../../../../theme/base/mixins/_pseudo.js";
import { hover } from "../../../../theme/base/mixins/_interaction.js";

import type { ResizeHandleProps } from "./resize-handle.api.js";

function resizeHandleIndicatorWidth(gapNum: number): number {
	if (gapNum <= 12) {
		return gapNum < 4 ? 4 : gapNum;
	}

	return 6;
}

function calculateHoverAreaWidth(layoutGap: number): number {
	return layoutGap < 4 ? 4 : layoutGap;
}

export const StyledResizeHandle = styled.div.withConfig({ displayName: "StyledResizeHandle-sc-" })<{
	$targetPosition: ResizeHandleProps["targetPosition"];
	$resizeCursor?: string;
	$gap: number;
	$targetBorder: number;
}>(({ theme, $targetPosition, $resizeCursor, $gap, $targetBorder }) => {
	const { interaction } = theme.colors;
	const { borderRadius } = theme.components.supportingPanesLayout;

	const height = borderRadius === "0" || borderRadius === "0px" ? "100%" : `calc(100% - ${borderRadius} * 2)`;
	const hoverAreaWidth = calculateHoverAreaWidth($gap);
	const visualIndicatorWidth = resizeHandleIndicatorWidth($gap);
	const pos = `-${hoverAreaWidth + $targetBorder}px`;

	return css`
		cursor: ${$resizeCursor};
		flex-shrink: 0;
		height: ${height};
		position: absolute;
		top: ${borderRadius};
		user-select: none;
		z-index: 1; // To prevent interacting with other elements while dragging
		width: ${hoverAreaWidth}px;
		-webkit-user-select: none;
		-moz-user-select: none;

		${$targetPosition === "left" &&
		css`
			right: ${pos};
		`}

		${$targetPosition === "right" &&
		css`
			left: ${pos};
		`}

		${createPseudoElement(
			":before",
			css`
				height: 100%;
				left: ${(hoverAreaWidth - visualIndicatorWidth) / 2}px;
				width: ${visualIndicatorWidth}px;
			`
		)}
		
		${hover(css`
			&:before {
				background-color: ${interaction.hover.color};
			}
		`)}

		&[draggable="true"] {
			// Create a layer to prevent interacting with other elements on screen while dragging the current resize handle.
			${createPseudoElement(
				":after",
				css`
					height: 100vh;
					width: 100vw;
					top: 0;
					left: 0;
					position: fixed;
				`
			)}
		}
	`;
});
