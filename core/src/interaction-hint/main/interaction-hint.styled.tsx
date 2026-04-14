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

import { basePortalArrow } from "../../theme/base/mixins/_portal-arrow.js";
import { breakWord } from "../../theme/base/mixins/_break-word.js";
import type { Orientation } from "../../common/main/alignment.js";

import type { InteractionHintPosition } from "./interaction-hint.api.js";

export const StyledInteractionHintContent = styled.div.withConfig({ displayName: "StyledInteractionHintContent-sc-" })(
	({ theme }) => {
		const { content } = theme.components.interactionHint;

		return css`
			background-color: ${content.background};
			border: ${content.border};
			border-radius: ${content.borderRadius};
			box-shadow: ${content.boxShadow};
			font-family: ${content.fontFamily};
			font-size: ${content.fontSize};
			max-height: 100%;
			outline: none;
			overflow-y: auto;
			padding: ${content.padding};
			${breakWord}
		`;
	}
);

const getInteractionHintState = (borderColor: string, textColor: string, backgroundColor: string) => css`
	${StyledInteractionHintContent}, &:before {
		border-color: ${borderColor};
		background-color: ${backgroundColor};
	}

	${StyledInteractionHintContent} {
		color: ${textColor};
	}
`;

export const StyledInteractionHintContainer = styled.div.withConfig({
	displayName: "StyledInteractionHintContainer-sc-"
})<{
	$variant?: string;
	$orientation?: Orientation;
	$referenceElementRect?: DOMRect;
	$containerRect?: DOMRect;
	$showArrow?: boolean;
	$followCursor?: boolean;
	$position?: InteractionHintPosition;
}>(
	({
		theme,
		$orientation,
		$variant,
		$referenceElementRect,
		$containerRect,
		$showArrow = true,
		$followCursor,
		$position
	}) => {
		const {
			variants: { error, warning, hint, success },
			containerMaxWidth,
			margin,
			arrow
		} = theme.components.interactionHint;

		const arrowPositionLeft =
			$containerRect && $referenceElementRect
				? Math.floor($referenceElementRect.left + $referenceElementRect.width / 2 - $containerRect?.left)
				: undefined;

		return css`
			max-width: ${containerMaxWidth};
			margin: ${$followCursor ? "0" : margin};

			${$position &&
			css`
				margin-left: 0;
				margin-right: 0;
			`}

			position: relative;
			outline: none;

			${$followCursor &&
			css`
				pointer-events: none;

				${StyledInteractionHintContent} {
					pointer-events: auto;
				}
			`}

			+ span {
				outline: none;
			}
			// Arrow of portal
			${$showArrow &&
			$orientation &&
			basePortalArrow({
				orientation: $orientation,
				arrow: {
					...arrow,
					styles: {
						...(["top", "bottom", "top-start", "top-end", "bottom-start", "bottom-end"].includes($orientation) && {
							left: $position && !arrowPositionLeft ? `${arrow.size / 2}px` : `${arrowPositionLeft}px`
						})
					}
				}
			})}

			${$variant === "error" && getInteractionHintState(error.color, error.color, error.background)}
		${$variant === "warning" && getInteractionHintState(warning.color, warning.contentColor, warning.background)}
		${$variant === "hint" && getInteractionHintState(hint.color, hint.contentColor, hint.background)}
		${$variant === "success" && getInteractionHintState(success.color, success.contentColor, success.background)}
		`;
	}
);
