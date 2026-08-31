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
import { useRef, useState, useEffect } from "react";
import { styled, css, useTheme } from "styled-components";

import { DataRoles } from "../../common/main/data-roles.js";

import type { ProgressBarProps } from "./progress-bar.api.js";

export const StyledProgressBar = styled.span.withConfig({ displayName: "StyledProgressBar-sc-" })<{
	hasBackground: boolean;
}>(({ theme, hasBackground }) => {
	const { progressBar } = theme.components;

	return css`
		background-color: ${hasBackground ? progressBar.background : progressBar.bufferBG};
		border-radius: inherit;
		inset: 0;
		isolation: isolate;
		outline: ${hasBackground ? "1px dotted transparent" : "1px solid transparent"};
		overflow: hidden;
		position: absolute;
		> * {
			inset: 0;
			position: absolute;
		}
	`;
});

export const StyledProgressBarFill = styled.span.withConfig({
	displayName: "StyledProgressBarFill-sc-"
})<{
	percentage?: number;
	$backgroundColor?: string;
}>(({ theme, percentage, $backgroundColor }) => {
	const { progressBar } = theme.components;

	return css`
		background-color: ${$backgroundColor ?? progressBar.fillBG};
		outline: 1px solid transparent;
		transition: ${progressBar.transition};
		width: ${percentage}%;
		z-index: 1;
	`;
});

export const StyledProgressBarBuffer = styled.span.withConfig({
	displayName: "StyledProgressBarBuffer-sc-"
})(({ theme }) => {
	const { progressBar } = theme.components;

	return css`
		background-color: ${progressBar.bufferBG};
	`;
});

export function ProgressBar(props: ProgressBarProps): ReactElement<ProgressBarProps> {
	const progressBarRef = useRef<HTMLSpanElement | null>(null);
	const parentRef = useRef<HTMLElement | null>(null);
	const [background, setBackground] = useState(false);
	const [parentFillColor, setParentFillColor] = useState<string | undefined>(undefined);
	const theme = useTheme();

	useEffect(() => {
		if (progressBarRef.current) {
			parentRef.current = progressBarRef.current.parentElement;

			if (parentRef.current) {
				const parentBGColor = window.getComputedStyle(parentRef.current).getPropertyValue("background-color");
				parentRef.current.style.cursor = "default";
				parentRef.current.style.position = "relative";

				// if parent element does not have background/background is transparent
				// change background in progress bar from "inherit" to its own color
				if (parentBGColor === "rgba(0, 0, 0, 0)" || parentBGColor === "transparent" || parentBGColor === undefined) {
					setBackground(true);
					setParentFillColor(undefined);
				} else {
					setBackground(false);
					setParentFillColor(parentBGColor);
				}
			}
		}

		return (): void => {
			if (parentRef.current) {
				parentRef.current.style.cursor = "";
				parentRef.current.style.position = "";
			}
		};
	}, [theme.components.progressBar]);

	return (
		<StyledProgressBar hasBackground={background} ref={progressBarRef} data-role={DataRoles.ProgressBar}>
			<StyledProgressBarFill
				data-role={DataRoles.ProgressBar.Fill}
				percentage={props.percentage}
				$backgroundColor={parentFillColor}
			/>
			<StyledProgressBarBuffer data-role={DataRoles.ProgressBar.Buffer} />
		</StyledProgressBar>
	);
}

ProgressBar.displayName = "ProgressBar";
