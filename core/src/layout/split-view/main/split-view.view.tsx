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
import { useState, useRef, useEffect } from "react";
import { styled, css } from "styled-components";

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { ResizeHandler } from "../../resizable/resize-handler.view.js";
import type { ResizeCallbackData } from "../../resizable/resize-handler.api.js";
import { StyledResizeHandler } from "../../resizable/resize-handler.styled.js";
import { useElementDimensions } from "../../resizable/resize-hook.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { SplitViewProps } from "./split-view.api.js";

const baseClassName = addPrefix("split-view");

const StyledWrapper = styled.div`
	display: flex;
	padding: ${(props) => props.theme.components.splitView.padding};
	width: 100%;
`;

const StyledAreaWrapper = styled.div<{ $width?: number | string; $maxWidth?: number | string }>(
	({ $width, $maxWidth }) => {
		const newMaxWidth = typeof $maxWidth === "number" ? `${$maxWidth}px` : $maxWidth;
		const newWidth = typeof $width === "number" ? `${$width}px` : $width;

		return css`
			box-sizing: border-box;
			min-width: 0;
			flex: ${$width ? "none" : 1};
			max-width: ${newMaxWidth};
			width: ${newWidth};

			&:only-child {
				width: 100%;
				max-width: 100%;
				& > div > ${StyledResizeHandler} {
					display: none;
				}
			}
		`;
	}
);

export function SplitView(props: SplitViewProps): ReactElement<SplitViewProps> {
	const { className, id, style, children } = props;

	const classNames = joinClassNames(baseClassName, className);

	return (
		<StyledWrapper id={id} className={classNames} style={style} data-role={DataRoles.SplitView}>
			{children}
		</StyledWrapper>
	);
}

SplitView.displayName = "SplitView";

export namespace SplitView {
	export function Area(props: SplitViewProps.AreaProps): ReactElement<SplitViewProps.AreaProps> {
		const { className, id, width, style, children, resizableOptions } = props;

		const [isLastElement, setIsLastElement] = useState(false);

		const { maxWidth, minWidth } = resizableOptions || {};

		const elementRef = useRef<HTMLDivElement>(null);
		const { absoluteMinWidth, absoluteMaxWidth } = useElementDimensions({
			elementRef,
			widthConfig: { minWidth, maxWidth }
		});

		const [widthState, setWidthState] = useState<number | string | undefined>(width);

		const classNames = joinClassNames(`${baseClassName}__area`, { [addPrefix("-u-flex-none")]: width }, className);

		const handleResizeStart = (event: MouseEvent, data: ResizeCallbackData): void => {
			if (!widthState) {
				setWidthState(data.width);
			}

			resizableOptions?.onResizeStart?.(event, data);
		};

		const handleResizeStop = (event: MouseEvent, data: ResizeCallbackData): void => {
			setWidthState(data.width);

			resizableOptions?.onResizeStop?.(event, data);
		};

		useEffect(() => {
			const parent = elementRef.current?.parentElement;

			if (!parent) {
				return;
			}

			const updateLastElement = (): void => {
				const lastChild = parent.lastElementChild;
				setIsLastElement(lastChild === elementRef.current);
			};

			// Update the last element when the component mounts.
			updateLastElement();

			// Observe for changes in the parent's children to detect when the last child changes.
			const observer = new MutationObserver(() => {
				updateLastElement();
			});

			observer.observe(parent, { childList: true });

			return (): void => observer.disconnect();
		}, []);

		return (
			<ResizeHandler
				{...resizableOptions}
				maxWidth={absoluteMaxWidth}
				minWidth={absoluteMinWidth}
				targetRef={elementRef}
				onResizeStop={handleResizeStop}
				onResizeStart={handleResizeStart}
				resizable={!!resizableOptions}
				position={isLastElement ? "left" : "right"}
			>
				<StyledAreaWrapper
					ref={elementRef}
					id={id}
					className={classNames}
					style={style}
					data-role={DataRoles.SplitView.Area}
					$width={widthState}
					$maxWidth={resizableOptions ? absoluteMaxWidth : undefined}
				>
					{children}
				</StyledAreaWrapper>
			</ResizeHandler>
		);
	}
}
