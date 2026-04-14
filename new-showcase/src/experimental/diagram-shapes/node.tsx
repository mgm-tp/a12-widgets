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

import type { FC } from "react";
import { styled } from "styled-components";

import { CssEllipsis, DiagramNode } from "@com.mgmtp.a12.widgets/widgets-core";

export const StyledBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	flex-wrap: wrap;
	border: 1px solid rgb(226, 230, 233);
	padding: 32px;
	min-width: 300px;
	position: relative;
`;

export const StyledTitle = styled.div`
	position: absolute;
	top: -12px;
	left: 16px;
	margin-left: 16px;
	background: white;
	padding: 0 8px;
`;
export const DiagramNodeShowcase: FC = () => {
	return (
		<div>
			<StyledBox>
				<StyledTitle>Default</StyledTitle>
				<DiagramNode>Node</DiagramNode>
				<DiagramNode>
					<CssEllipsis>This-is-a-very-long-node-name-that-cannot-be-shown-here-please-hover-to-see</CssEllipsis>
				</DiagramNode>
				<DiagramNode>
					<CssEllipsis>Grundstücksverkehrsgenehmigungszuständigkeitsübertragungsverordnung</CssEllipsis>
				</DiagramNode>
			</StyledBox>
			<br />
			<br />
			<StyledBox>
				<StyledTitle>Selected</StyledTitle>
				<DiagramNode selected>Node</DiagramNode>
			</StyledBox>
			<br />
			<br />
			<StyledBox>
				<StyledTitle>Link Documentation</StyledTitle>
				<DiagramNode useAsLink>Link Node</DiagramNode>
			</StyledBox>
			<br />
			<br />
			<StyledBox>
				<StyledTitle>Selected Link Documentation</StyledTitle>
				<DiagramNode useAsLink selected>
					Link Node
				</DiagramNode>
			</StyledBox>
			<br />
			<br />
			<StyledBox>
				<StyledTitle>Readonly</StyledTitle>
				<DiagramNode readOnly>Node</DiagramNode>
				<DiagramNode useAsLink readOnly>
					Link Node
				</DiagramNode>
			</StyledBox>
		</div>
	);
};
