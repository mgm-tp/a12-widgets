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

import { activeAndHover, darkFocus } from "../../theme/base/mixins/_interaction.js";

import { mainGridPointSVG, subGridPointSVG } from "./grid-point-svgs.js";
import type { DiagramLabelType } from "./model-graph-diagram.tpl.api.js";

export const StyledDiagramNodeWrapper = styled.div.withConfig({ displayName: "StyledDiagramNodeWrapper-sc-" })<{
	$isSelected?: boolean;
	$isUseAsLink?: boolean;
	$readOnly?: boolean;
}>(({ theme, $isSelected, $isUseAsLink, $readOnly }) => {
	const { node } = theme.components.diagramConfig;

	return css`
		align-items: center;
		box-sizing: border-box;
		background-color: ${node.background};
		border: ${$isUseAsLink ? node.link.border : node.border};
		display: flex;
		font-family: ${node.fontFamily};
		font-size: ${node.fontSize};
		font-weight: ${node.fontWeight};
		justify-content: center;
		height: ${node.height};
		line-height: 1.35;
		position: relative;
		padding: ${node.padding};
		text-align: center;
		width: ${node.width};

		${$isSelected &&
		css`
			background-color: ${node.selectedBG};
			border-left: ${node.leftEdgeBorder};
			box-shadow: ${node.boxShadow};
			color: ${node.selectedColor};
		`}

		${$readOnly
			? css`
					border-color: ${node.readOnly.borderColor};
				`
			: css`
					cursor: pointer;
					color: ${node.color};

					${activeAndHover(css`
						border-color: ${node.hoverBorderColor};
						box-shadow: ${node.boxShadow};
					`)}

					&:focus {
						border-color: ${node.focusBorderColor};
						box-shadow: ${node.boxShadow};
						${darkFocus}
					}
				`}
	`;
});

export const StyledDiagramLabelWrapper = styled.div.withConfig({ displayName: "StyledDiagramLabelWrapper-sc-" })<{
	$diagramLabelType: DiagramLabelType;
	$isSelected?: boolean;
	$readOnly?: boolean;
}>(({ theme, $diagramLabelType, $isSelected, $readOnly }) => {
	const { label } = theme.components.diagramConfig;
	const isMain = $diagramLabelType === "main";

	return css`
		align-items: center;
		border-radius: ${isMain ? label.mainLabel.borderRadius : label.subLabel.borderRadius};
		color: ${label.color};
		display: inline-flex;
		font-family: ${label.fontFamily};
		font-size: ${isMain ? label.mainLabel.fontSize : label.subLabel.fontSize};
		font-weight: ${isMain ? label.mainLabel.fontWeight : label.subLabel.fontWeight};
		gap: ${label.gap};
		justify-content: center;
		height: ${isMain ? label.mainLabel.height : label.subLabel.height};
		padding: ${label.padding};
		position: relative;

		// interactive border
		&:before {
			border: ${label.border};
			border-radius: ${isMain ? label.mainLabel.borderRadius : label.subLabel.borderRadius};
			content: "";
			inset: 0;
			position: absolute;
		}

		${$isSelected &&
		css`
			background-color: ${label.selected.background};
			box-shadow: ${label.boxShadow};
			color: ${label.selected.color};

			// left edge of selected label
			&:after {
				border-left: ${label.selected.leftEdge.border};
				border-top-left-radius: ${isMain ? label.mainLabel.borderRadius : label.subLabel.borderRadius};
				border-bottom-left-radius: ${isMain ? label.mainLabel.borderRadius : label.subLabel.borderRadius};
				content: "";
				position: absolute;
				width: 0;
				inset: ${isMain ? label.selected.leftEdge.mainLabel.top : label.selected.leftEdge.subLabel.top} 0 0 1px;
				height: ${isMain ? label.selected.leftEdge.mainLabel.height : label.selected.leftEdge.subLabel.height};
			}

			// interactive border
			&:before {
				border-color: ${label.selected.borderColor};
				z-index: 1;
			}
		`}

		${$readOnly
			? css`
					background-color: ${label.readOnly.background};
				`
			: css`
					background-color: ${label.background};
					cursor: pointer;

					${activeAndHover(css`
						box-shadow: ${label.boxShadow};
						&:before {
							border-color: ${label.hoverBorderColor};
						}
						&:after {
							border-left-color: ${label.hoverBorderColor};
						}
					`)}

					&:focus {
						box-shadow: ${label.boxShadow};
						${darkFocus}
						&:before {
							border-color: ${label.focusBorderColor};
						}
						&:after {
							border-left-color: ${label.focusBorderColor};
						}
					}
				`}
	`;
});

export const StyledDiagramLabelSubText = styled.div.withConfig({ displayName: "StyledDiagramLabelSubText-sc-" })`
	font-style: italic;
`;

export const StyledDiagramPort = styled.div.withConfig({ displayName: "StyledDiagramPort-sc-" })<{
	$isSelected?: boolean;
	$isCornerPoint?: boolean;
	$readOnly?: boolean;
}>(({ theme, $isSelected, $isCornerPoint, $readOnly }) => {
	const { port } = theme.components.diagramConfig;

	const size = $isCornerPoint ? port.cornerPoint.size : port.size;

	return css`
		border-radius: 50%;
		box-shadow: ${port.boxShadow};
		filter: blur(1px);
		height: ${size};
		width: ${size};

		${$isSelected &&
		css`
			background-color: ${port.selectedBG};
			box-shadow: none;
			filter: blur(0);
			padding: 0;
		`}

		${$readOnly
			? css`
					background-color: ${port.readOnly.background};
				`
			: css`
					background-color: ${port.background};
					cursor: pointer;

					${activeAndHover(css`
						background-color: ${port.hoverBG};
						box-shadow: ${port.interactiveBoxShadow};
						filter: blur(0);
						padding: 0;
					`)}
				`}
	`;
});

export const StyledDiagramGridMainPoint = styled.div.withConfig({ displayName: "StyledDiagramGridMainPoint-sc-" })`
	border-radius: 50%;
	height: 12px;
	width: 12px;
	background-image: url("${mainGridPointSVG}");
	margin-right: 12px;
`;

export const StyledDiagramGridSubPoint = styled.div.withConfig({ displayName: "StyledDiagramGridSubPoint-sc-" })<{
	$isBeforeMainPoint?: boolean;
}>(({ $isBeforeMainPoint }) => {
	return css`
		border-radius: 50%;
		margin-right: ${$isBeforeMainPoint ? 12 : 16}px;
		width: 4px;
		height: 4px;
		background-image: url("${subGridPointSVG}");
	`;
});
