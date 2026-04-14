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
import { useRef, useState } from "react";
import { styled } from "styled-components";

import { ResizeHandler } from "../../src/layout/resizable/resize-handler.view.js";
import type { ResizeHandlerProps } from "../../src/layout/resizable/resize-handler.api.js";

const StyledContainer = styled.div`
	width: 100%;
	height: 700px;
	display: flex;
`;

const StyledFirstView = styled.div<{ width?: string | number }>`
	width: ${({ width }) => `${width}px`};
	flex-shrink: 1;
	background-color: pink;
`;

const StyledSecondView = styled.div`
	flex: 1;
	background-color: red;
`;

export const ExampleResizeHandler: FC<Omit<ResizeHandlerProps, "targetRef">> = (props) => {
	const targetRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(300);

	return (
		<StyledContainer>
			<ResizeHandler {...props} targetRef={targetRef} onResizeStop={(event, data) => setWidth(data.width)}>
				<StyledFirstView ref={targetRef} id="test-div-1" width={width}>
					div 1
				</StyledFirstView>
			</ResizeHandler>
			<StyledSecondView id="test-div-2">div 2</StyledSecondView>
		</StyledContainer>
	);
};
