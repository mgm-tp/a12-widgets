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
import { motion } from "framer-motion";

import { DataRoles } from "../../../common/main/data-roles.js";

import type { SupportingPanesLayoutProps } from "./supporting-panes-layout.api.js";
import { StyledResizeHandle } from "./resize/resize-handle.styled.js";

export const StyledSupportingPanesLayout = styled.div.withConfig({ displayName: "StyledSupportingPanesLayout-sc-" })(
	({ theme }) => {
		const { height, width } = theme.components.supportingPanesLayout;

		return css`
			display: flex;
			flex: 1;
			height: ${height};
			position: relative;
			width: ${width};
		`;
	}
);

export const StyledPrimaryPane = styled.div.withConfig({ displayName: "StyledPrimaryPane-sc-" })(({ theme }) => {
	const { borderRadius, primaryPane } = theme.components.supportingPanesLayout;

	return css`
		background-color: ${primaryPane.backgroundColor};
		border-radius: ${borderRadius};
		box-sizing: border-box;
		flex: 1;
		overflow: auto;
		margin: ${primaryPane.margin};
		padding: ${primaryPane.padding};

		/* Nesting layout */
		&:has(div[data-role="${DataRoles.SupportingPanesLayout}"]) {
			// To ensure the whole layout does not have "overflow" property, only individual panes have.
			overflow: hidden;

			// To ensure the nested SPL will take up the remaining free space.
			display: flex;
			flex-direction: column;
		}
	`;
});

interface StyledSecondaryPaneProps {
	$width: number | string;
	$position: SupportingPanesLayoutProps.SecondaryPaneProps["position"];
}

const animationTransformOrigin = {
	["right"]: "right center",
	["left"]: "left center"
};

export const StyledSecondaryPane = styled(motion.div).withConfig({
	displayName: "StyledSecondaryPane-sc-"
})<StyledSecondaryPaneProps>(({ theme, $position, $width }) => {
	const { borderRadius, secondaryPane, gap } = theme.components.supportingPanesLayout;

	return css`
		background-color: ${secondaryPane.backgroundColor};
		border-radius: ${borderRadius};
		box-sizing: border-box;
		padding: 0;
		position: relative;
		width: ${$width};
		transform-origin: ${animationTransformOrigin[$position]};

		${$position === "left"
			? css`
					margin-right: ${gap};
				`
			: css`
					margin-left: ${gap};
				`}

		&:has(${StyledResizeHandle}[draggable="true"]) ~ & {
			pointer-events: none;
		}
	`;
});

export const StyledSecondaryPaneContent = styled(motion.div).withConfig({
	displayName: "StyledSecondaryPaneContent-sc-"
})(({ theme }) => {
	const { content } = theme.components.supportingPanesLayout.secondaryPane;

	return css`
		height: 100%;
		overflow: auto;
		padding: ${content.padding};
		width: 100%;
	`;
});
