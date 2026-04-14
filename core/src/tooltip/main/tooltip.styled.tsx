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

import { breakWord } from "../../theme/base/mixins/_break-word.js";
import type { Orientation } from "../../common/main/alignment.js";
import { adjustParentMarginForEdges } from "../../common/main/portal-utils.js";
import { StyledBulletListItem, StyledBulletListContent } from "../../bullet-list/main/bullet-list.view.js";
import { basePortalArrow } from "../../theme/base/mixins/_portal-arrow.js";

export const StyledTooltipContent = styled.div.withConfig({ displayName: "StyledTooltipContent-sc-" })(({ theme }) => {
	const { content } = theme.components.tooltip;

	return css`
		max-height: 100%;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: ${content.background};
		border: ${content.border};
		border-radius: ${content.borderRadius};
		box-shadow: ${content.boxShadow};
		font-family: ${content.fontFamily};
		font-size: ${content.fontSize};
		outline: none;
		padding: ${content.padding};
		${breakWord}

		ul,
		ol {
			margin: 0;
		}

		${StyledBulletListItem}, ${StyledBulletListContent} {
			color: inherit;
		}
	`;
});

export const StyledTooltipContainer = styled.div.withConfig({ displayName: "StyledTooltipContainer-sc-" })<{
	$variant?: string;
	$tooltipOrientation?: Orientation;
	$position?: {
		top: number;
		left: number;
	};
	$referenceElement?: HTMLElement | null;
}>(({ theme, $variant, $tooltipOrientation, $referenceElement, $position }) => {
	const { error, warning, hint, success, containerMaxWidth } = theme.components.tooltip;

	const tooltipState = (borderColor: string, textColor: string, backgroundColor: string) => css`
		${StyledTooltipContent}, &:after {
			border-color: ${borderColor};
			background-color: ${backgroundColor};
		}

		${StyledTooltipContent} {
			color: ${textColor};
		}
	`;

	const arrow = {
		...theme.components.tooltip.arrow,
		endPosition: "13px",
		size: theme.spacing.spacing.spacingSm,
		startPosition: "13px",
		parentMargin: adjustParentMarginForEdges("-10px", $tooltipOrientation, $referenceElement)
	};

	return css`
		max-width: ${containerMaxWidth};
		position: relative;
		outline: none;
		+ span {
			outline: none;
		}
		// Arrow of portal
		${$tooltipOrientation &&
		basePortalArrow({
			orientation: $tooltipOrientation,
			arrow: arrow,
			selector: "&:after",
			referenceElement: $referenceElement,
			containerPosition: $position
		})}

		${$variant === "error" && tooltipState(error.color, error.color, error.background)}
		${$variant === "warning" && tooltipState(warning.color, warning.contentColor, warning.background)}
		${$variant === "hint" && tooltipState(hint.color, hint.contentColor, hint.background)}
		${$variant === "success" && tooltipState(success.color, success.contentColor, success.background)}
	`;
});

export const StyledTooltipWrapper = styled.span.withConfig({ displayName: "StyledTooltipWrapper-sc-" })<{
	$variant?: string;
}>(({ theme, $variant }) => {
	const { tooltip } = theme.components;
	let color: string;

	switch ($variant) {
		case "error":
			color = tooltip.error.color;
			break;
		case "warning":
			color = tooltip.warning.color;
			break;
		case "hint":
			color = tooltip.hint.color;
			break;
		case "success":
			color = tooltip.success.color;
			break;
		default:
			color = tooltip.color;
	}

	return css`
		display: inline-block;
		font-size: 0;
		vertical-align: middle;
		color: ${color};
	`;
});
