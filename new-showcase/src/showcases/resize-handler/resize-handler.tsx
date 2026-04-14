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

import { useRef, useState } from "react";
import { css, styled } from "styled-components";
import { loremIpsum } from "lorem-ipsum";

import { ResizeHandler } from "@com.mgmtp.a12.widgets/widgets-core";

const ShowcaseStyledWrapper = styled.div`
	display: flex;
	gap: 4px;
	justify-content: center;
	overflow: hidden;
`;

const ShowcaseStyledPaneWrapper = styled.div<{ $width?: number }>(
	({ $width }) => css`
		border-radius: 8px;
		background-color: #ffff;

		${$width
			? css`
					width: ${$width}px;
				`
			: css`
					flex: 1;
					min-width: 0;
				`}
	`
);

const ShowcaseStyledPaneContent = styled.div`
	padding: 20px;
`;

const dummyText = loremIpsum({ count: 2, units: "paragraphs" });

export const ResizeHandlerShowcase = () => {
	const leftDivRef = useRef<HTMLDivElement>(null);
	const [leftWidth, setLeftWidth] = useState(400);

	const handleResizeStop = (event: MouseEvent, { width }: { width: number }) => {
		setLeftWidth(width);
	};

	return (
		<ShowcaseStyledWrapper>
			<ResizeHandler targetRef={leftDivRef} onResizeStop={handleResizeStop} minWidth={200} maxWidth={700}>
				<ShowcaseStyledPaneWrapper ref={leftDivRef} $width={leftWidth}>
					<ShowcaseStyledPaneContent>{dummyText}</ShowcaseStyledPaneContent>
				</ShowcaseStyledPaneWrapper>
			</ResizeHandler>
			<ShowcaseStyledPaneWrapper>
				<ShowcaseStyledPaneContent>{dummyText}</ShowcaseStyledPaneContent>
			</ShowcaseStyledPaneWrapper>
		</ShowcaseStyledWrapper>
	);
};
