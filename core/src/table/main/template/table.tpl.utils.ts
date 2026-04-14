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

import type { MutableRefObject, MouseEventHandler, MouseEvent } from "react";
import { useRef, useEffect } from "react";
import type { CSSObject } from "styled-components";
import { css } from "styled-components";

import { createContext, useContextSelector } from "../../../context/index.js";
import { getNearestFocusableParent } from "../../../common/main/utils.js";

import type { RowScrollManager } from "../table.internal.js";

/** @internal */
export const getRole = (role?: string | boolean, defaultRole?: string): string | undefined =>
	typeof role === "string" ? role : role !== false ? defaultRole : undefined;

/** @internal **/
export namespace RowScrollManagerContextType {
	export interface Type {
		rowScrollManager?: RowScrollManager;
	}
}

/** @internal **/
export const RowScrollManagerContext = createContext<RowScrollManagerContextType.Type>({});

/** @internal */
export function useRowScrollManagerContext<
	Selector extends (context: RowScrollManagerContextType.Type) => any = (
		context: RowScrollManagerContextType.Type
	) => any
>(selector: Selector): ReturnType<Selector> {
	return useContextSelector(RowScrollManagerContext, selector);
}

export const useRowScrollManager = (ref: MutableRefObject<HTMLDivElement | null>): void => {
	const rowScrollManager = useRowScrollManagerContext((context) => context.rowScrollManager);
	const added = useRef(false);

	useEffect(() => {
		const currentRef = ref.current;

		if (!added.current && currentRef && rowScrollManager?.isAcceptable(currentRef)) {
			rowScrollManager?.addElement(currentRef);
			added.current = true;
		}

		return () => {
			if (added.current && currentRef) {
				rowScrollManager?.removeElement(currentRef);
			}

			added.current = false;
		};
	}, [ref, rowScrollManager]);
};

/** @internal */
export const handleContextMenu =
	(wrapperRef: MutableRefObject<HTMLDivElement | null>, onContextMenu: MouseEventHandler<HTMLElement> | undefined) =>
	(event: MouseEvent<HTMLElement>): void => {
		const target = event.target as HTMLElement;

		// prevent open the context menu from portals
		if (!wrapperRef?.current?.contains(target)) {
			return;
		}

		const nearestFocusableParentElement = getNearestFocusableParent(target);
		const isInteractiveElement =
			nearestFocusableParentElement &&
			wrapperRef.current !== nearestFocusableParentElement &&
			wrapperRef.current?.contains(nearestFocusableParentElement);

		if (!isInteractiveElement) {
			onContextMenu?.(event);
		}
	};

/** @internal */
export const resetBoxShadowForSubInfoCell = (rowSegmentSelector: CSSObject | string) => css`
	@media (pointer: fine) {
		${rowSegmentSelector}:hover &&&:last-of-type,
    &&&:first-of-type {
			box-shadow: none;
		}
	}

	@media (pointer: coarse) {
		${rowSegmentSelector}:active &&&:last-of-type,
    &&&:first-of-type {
			box-shadow: none;
		}
	}

	${rowSegmentSelector}:focus-within &&&:last-of-type,
  &&&:first-of-type {
		box-shadow: none;
	}
`;
