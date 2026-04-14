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

import type { MouseEvent, ReactElement } from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { styled, css } from "styled-components";

import { TooltipPortal } from "../../tooltip/main/tooltip-portal.view.js";
import { addPrefix, getParentElement, joinClassNames } from "../../common/main/utils.js";
import { ellipsis } from "../../theme/base/mixins/_ellipsis.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { CssEllipsisProps } from "./css-ellipsis.api.js";

const baseClassName = addPrefix("css-ellipsis");

const StyledCssEllipsis = styled.div.withConfig({ displayName: "StyledCssEllipsis-sc-" })<{ maxLine?: number }>(
	({ maxLine }) => {
		return css`
			${ellipsis(maxLine)}
			> * {
				margin: 0 !important;
				padding: 0 !important;
			}
			${maxLine === 1 &&
			css`
				word-break: break-all;
			`}
		`;
	}
);
export function CssEllipsis({
	children,
	className,
	domProps,
	id,
	maxLine: maxLineProp,
	style,
	tooltipVariant = "hint",
	useTooltip
}: CssEllipsisProps): ReactElement<CssEllipsisProps> {
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [maxLine, setMaxLine] = useState(maxLineProp || 1);
	const lineHeight = useRef<number>(1);

	const wrapperRef = useRef<HTMLElement | null>(null);

	const isEllipsisActive = useCallback((): boolean => {
		if (!wrapperRef.current) {
			return false;
		}

		if (Math.floor(wrapperRef.current.scrollHeight) > Math.floor(wrapperRef.current.clientHeight)) {
			return true;
		}

		return Math.floor(wrapperRef.current.scrollWidth) > Math.floor(wrapperRef.current.clientWidth);
	}, []);

	const onMouseEnter = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			// For native title attribute when not using tooltip
			if (!useTooltip && isEllipsisActive()) {
				setTitle(wrapperRef.current?.textContent || undefined);
			}

			domProps?.onMouseOver?.(event);
		},
		[domProps, useTooltip, isEllipsisActive]
	);

	const onMouseLeave = useCallback(() => {
		if (!useTooltip) {
			setTitle(undefined);
		}
	}, [useTooltip]);

	const calculateMaxLine = useCallback((): number => {
		// See if the parent is a table cell. In a table cell, we will look for the cell height instead of the parent's height
		// This is because in table cell the widget is not using 100% height (for alignment to work) so calculation is not correct.
		const parentElement =
			getParentElement(wrapperRef.current, (element) => element.getAttribute("data-role") === "table-body-cell") ||
			wrapperRef.current?.parentElement;

		if (parentElement) {
			// in the first render the default is one line
			const parentStyle = window.getComputedStyle(parentElement);
			const parentInnerSpace =
				parentElement.clientHeight - parseFloat(parentStyle.paddingTop) - parseFloat(parentStyle.paddingBottom);

			return Math.max(1, Math.floor(parentInnerSpace / lineHeight.current));
		}

		return lineHeight.current;
	}, []);

	useEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		if (maxLineProp) {
			setMaxLine(maxLineProp);

			return;
		}

		// Fix bug CSS Ellipsis content not truncated correctly when initial children is empty.
		if (lineHeight.current !== 1) {
			return;
		}

		if (wrapperRef.current.clientHeight) {
			lineHeight.current = wrapperRef.current.clientHeight;
			setMaxLine(calculateMaxLine());
		}
	}, [calculateMaxLine, maxLineProp, children]);

	return (
		<StyledCssEllipsis
			id={id}
			className={joinClassNames(`${baseClassName}`, `${baseClassName}-${maxLine}-lines`, className)}
			ref={(ref) => {
				wrapperRef.current = ref;
			}}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			title={title}
			style={style}
			data-role={DataRoles.CssEllipsis}
			maxLine={maxLine}
		>
			{children}
			{useTooltip && (
				<TooltipPortal
					referenceElementRef={wrapperRef}
					variant={tooltipVariant}
					dataRole={DataRoles.CssEllipsis.Tooltip}
					tooltipContentDataRole={DataRoles.CssEllipsis.Content}
					shouldShowTooltip={isEllipsisActive}
				>
					{children}
				</TooltipPortal>
			)}
		</StyledCssEllipsis>
	);
}

CssEllipsis.displayName = "CssEllipsis";
