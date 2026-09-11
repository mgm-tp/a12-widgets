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

import type { ReactElement, ReactNode } from "react";
import { useLayoutEffect, useContext, useRef, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

import type { DefaultThemeType } from "../../theme/schema.js";

import type { Container, Ref } from "./base-props.js";
import { PortalContext } from "./widgets-root.view.js";
import { useIsMount } from "./hooks.js";

function DummyRenderer(props: Container & { theme: DefaultThemeType; callback?: () => void }): ReactElement {
	const { callback, theme, children } = props;

	useLayoutEffect(() => {
		callback?.();
	}, [callback]);

	return (
		<ThemeProvider theme={theme}>
			<div style={{ position: "fixed", top: "100%", left: "100%" }}>{children}</div>
		</ThemeProvider>
	);
}

DummyRenderer.displayName = "DummyRenderer";

export namespace ResponsiveHandler {
	/**
	 * @deprecated use {@link ElementSizeMeasurer} instead since it provide a better way than blocking with ReactDOM.render
	 */
	export function renderDummyElementForMeasure(
		theme: DefaultThemeType,
		elementToRender: ReactNode,
		mountPoint: HTMLElement,
		callback: () => void
	): void {
		const root = createRoot(mountPoint);

		const newCallback = (): void => {
			callback();
			setTimeout(() => {
				root.unmount();
				document.body.removeChild(mountPoint);
			});
		};

		root.render(
			<DummyRenderer theme={theme} callback={newCallback}>
				{elementToRender}
			</DummyRenderer>
		);
	}

	/**
	 * Render the element to the DOM.
	 * Calculating the width and the spacing of its condensed children.
	 * @deprecated use {@link ElementSizeMeasurer} instead since it provide a better way than blocking with ReactDOM.render
	 */
	export function computeSpacingValues(
		wrapperElement: HTMLElement,
		elementToRender: ReactElement,
		itemClassName: string,
		callback: (condensedItemWidth: number) => void,
		theme: DefaultThemeType
	): void {
		const mountPoint = document.body.appendChild(wrapperElement);

		renderDummyElementForMeasure(theme, elementToRender, mountPoint, () => {
			const item = mountPoint.getElementsByClassName(itemClassName)[0];
			const condensedItemWidth = item.getBoundingClientRect().width;
			callback(condensedItemWidth);
		});
	}

	/**
	 * Get number of non-condensed items if not enough space is available for placement.
	 *
	 * Responsive direction is "left to right".
	 */
	export function getNonCondensedItemNumber(
		domRef: Element | null,
		items: Element[],
		condensedItemWidth: number,
		parentPadding = 0
	): number {
		if (!domRef) {
			return 0;
		}

		const availableWidth = domRef.getBoundingClientRect().width - parentPadding;
		let indexOfFittingItems = 0;
		let indexWhereCondensedItemStillFits = 0;
		let sumOfElementWidths = 0;

		while (indexOfFittingItems < items.length && sumOfElementWidths <= availableWidth) {
			const item = items[indexOfFittingItems];
			const itemWidth = item.getBoundingClientRect().width;

			sumOfElementWidths += itemWidth + getHorizontalSpacing(item, "margin");

			if (sumOfElementWidths <= availableWidth - condensedItemWidth) {
				indexWhereCondensedItemStillFits++;
			}

			indexOfFittingItems++;
		}

		const doAllItemsFit = indexOfFittingItems === items.length && sumOfElementWidths <= availableWidth;

		return doAllItemsFit ? indexOfFittingItems : indexWhereCondensedItemStillFits;
	}

	/**
	 * Get number of non-condensed items if not enough space is available for placement.
	 *
	 * Responsive direction is "right to left" (rtl).
	 */
	export function getNonCondensedItemNumberRtl(
		domRef: Element | null,
		items: Element[],
		condensedItemWidth: number,
		parentGap: number,
		availableWidthOverride?: number
	): number {
		if (!domRef) {
			return 0;
		}

		const availableWidth = availableWidthOverride ?? domRef.getBoundingClientRect().width;
		let nonCondensedItem = items.length;
		let sumOfElementWidths = 0;

		for (let index = items.length - 1; index >= 0; index--) {
			const item = items[index];
			const itemWidth = item.getBoundingClientRect().width;
			const gap = index < items.length - 1 ? parentGap : 0;
			sumOfElementWidths += itemWidth + getHorizontalSpacing(item, "margin") + gap;

			if (sumOfElementWidths > availableWidth - (index === 0 ? 0 : condensedItemWidth)) {
				nonCondensedItem--;
			}
		}

		return nonCondensedItem;
	}
}

export function getHorizontalSpacing(element: Element | undefined | null, cssAttribute: string): number {
	if (!element) {
		return 0;
	}

	const computedElement = window.getComputedStyle(element);
	const spaceLeft = parseFloat(
		computedElement.getPropertyValue(cssAttribute === "border" ? "border-left-width" : `${cssAttribute}-left`)
	);
	const spaceRight = parseFloat(
		computedElement.getPropertyValue(cssAttribute === "border" ? "border-right-width" : `${cssAttribute}-right`)
	);

	return spaceLeft + spaceRight;
}

export function getVerticalSpacing(element: Element | undefined | null, cssAttribute: string): number {
	if (!element) {
		return 0;
	}

	const computedElement = window.getComputedStyle(element);
	const spaceTop = parseFloat(
		computedElement.getPropertyValue(cssAttribute === "border" ? "border-top-width" : `${cssAttribute}-top`)
	);
	const spaceBottom = parseFloat(
		computedElement.getPropertyValue(cssAttribute === "border" ? "border-bottom-width" : `${cssAttribute}-bottom`)
	);

	return spaceTop + spaceBottom;
}

/**
 * A component that measures the size of a rendered element.
 * It uses a portal to render the element off-screen and then measures its width.
 *
 * @param props.elementToRender - The element to render and measure.
 * @param props.itemDataRole - The data-role attribute of the item to measure.
 * @param props.callback - A callback function that receives the measured width.
 */
export function ElementSizeMeasurer(
	props: {
		elementToRender: ReactNode;
		itemDataRole?: string;
		callback?: (condensedItemWidth: number) => void;
	} & Ref
): ReactElement | null {
	const portalContext = useContext(PortalContext);
	const {
		portalPlaceholderRef: { current: portalPlaceHolderElement }
	} = portalContext;
	const rootDiv = useRef<HTMLDivElement | null>(null);
	const isMount = useIsMount();
	const { callback, elementToRender, itemDataRole } = props;

	const getRootRef = (ref: HTMLDivElement | null) => {
		rootDiv.current = ref;
		props.wrapperRef?.(ref);
	};

	useEffect(() => {
		if (!isMount) {
			return;
		} else {
			const item = itemDataRole ? rootDiv.current?.querySelector(`[data-role="${itemDataRole}"]`) : rootDiv.current;
			const itemWidth = item?.getBoundingClientRect().width;
			callback?.(itemWidth ?? 0);
		}
	}, [callback, isMount, itemDataRole]);

	return (
		portalPlaceHolderElement &&
		createPortal(
			<div ref={getRootRef} style={{ position: "fixed", top: "100%", left: "100%" }}>
				{elementToRender}
			</div>,
			portalPlaceHolderElement
		)
	);
}
