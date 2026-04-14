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

export const StyledDnDContainerShowcase = styled.div(({ theme }) => {
	const { spacing } = theme;

	return css`
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		margin: ${spacing.spacing.spacingSm}px;
		width: 100%;
	`;
});

export const StyledDnDItemShowcase = styled.div(({ theme }) => {
	const { colors } = theme;

	return css`
		align-items: center;
		box-sizing: border-box;
		border: 1px dashed ${colors.variant.infoColor};
		display: flex;
		justify-content: center;
		height: 200px;
		margin: 24px;
		width: 200px;
		user-select: none;
	`;
});

export const StyledDnDImageDragLayerShowcase = styled.div`
	position: fixed;
	pointer-events: none;
	opacity: 0.7;
`;

export const StyledDnDItemSourceShowcase = styled.div`
	cursor: move;
`;

export const StyledDnDImageShowcase = styled.img`
	width: 100px;
	height: 120px;
	user-select: none;
	pointer-events: none;
`;
