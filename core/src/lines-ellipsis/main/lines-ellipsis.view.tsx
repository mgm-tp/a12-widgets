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

import type { ReactElement } from "react";
import { useState, useCallback } from "react";
import { styled } from "styled-components";
import { useResizeDetector } from "react-resize-detector";

import { ElementSizeMeasurer } from "../../common/main/responsive-handler.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { WidgetHtmlLinesEllipsis, WidgetLinesEllipsis } from "./widget-lines-ellipsis.js";
import type { LinesEllipsisProps } from "./lines-ellipsis.api.js";

export const StyledLinesEllipsis = styled.div.withConfig({ displayName: "StyledLinesEllipsis-sc-" })`
	width: 100%;
	> div {
		text-transform: none;
		white-space: pre-wrap;
	}
`;

export function LinesEllipsis({
	htmlSupport,
	responsive = true,
	text,
	trimRight,
	...rest
}: LinesEllipsisProps): ReactElement<LinesEllipsisProps> {
	const [content, setContent] = useState<string>(text as string);
	const { ref, width } = useResizeDetector({ refreshMode: "debounce", refreshRate: 0 });
	const setText = useCallback((ref: HTMLElement | null) => {
		if (ref) {
			setContent(ref?.innerHTML);
		}
	}, []);

	if (!responsive) {
		return htmlSupport ? (
			<WidgetHtmlLinesEllipsis unsafeHTML={content} {...rest} />
		) : (
			<WidgetLinesEllipsis text={content} trimRight={trimRight} {...rest} />
		);
	}

	return (
		<>
			<StyledLinesEllipsis ref={ref} data-role={DataRoles.LinesEllipsis.Wrapper}>
				{htmlSupport ? (
					<WidgetHtmlLinesEllipsis winWidth={width} unsafeHTML={content} {...rest} />
				) : (
					<WidgetLinesEllipsis winWidth={width} text={content} trimRight={trimRight} {...rest} />
				)}
			</StyledLinesEllipsis>

			{typeof text !== "string" && <ElementSizeMeasurer elementToRender={text} wrapperRef={setText} />}
		</>
	);
}

LinesEllipsis.displayName = "LinesEllipsis";
