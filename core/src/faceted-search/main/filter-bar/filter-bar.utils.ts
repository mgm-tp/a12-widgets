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

const getElementOuterWidth = (element: Element): number => {
	const { width } = element.getBoundingClientRect();
	const { marginLeft = "0", marginRight = "0" } = window.getComputedStyle(element);

	return width + parseFloat(marginLeft) + parseFloat(marginRight);
};

/** @internal */
export const getContentBoxWidth = (element: HTMLElement): number => {
	const { width } = element.getBoundingClientRect();
	const { paddingLeft = "0", paddingRight = "0" } = window.getComputedStyle(element);

	return width - parseFloat(paddingLeft) - parseFloat(paddingRight);
};

/** @internal */
export const handleCompactMode = (filters: Element[], hiddenClass: string, availableWidth: number): number[] => {
	let usedWidth = 0;

	return filters.reduce<number[]>((hiddenIndices, filter, index) => {
		const filterWidth = getElementOuterWidth(filter);

		if (usedWidth + filterWidth <= availableWidth) {
			usedWidth += filterWidth;
			filter.classList.remove(hiddenClass);
		} else {
			filter.classList.add(hiddenClass);
			hiddenIndices.push(index);
		}

		return hiddenIndices;
	}, []);
};

/** @internal */
export const handleCollapseMode = (params: {
	filters: Element[];
	hiddenClass: string;
	contentElement: HTMLElement;
	actionElement: HTMLElement;
	collapsed?: boolean;
}): void => {
	const { filters, hiddenClass, contentElement, actionElement, collapsed } = params;

	const actionButtonWidth = actionElement.getBoundingClientRect().width;
	const availableWidth = Math.round(getContentBoxWidth(contentElement));

	actionElement.classList.add(hiddenClass);

	let sumOfElementsWidth = 0;

	for (const filter of filters) {
		sumOfElementsWidth += getElementOuterWidth(filter);

		if (collapsed && Math.round(sumOfElementsWidth) > availableWidth - actionButtonWidth) {
			filter.classList.add(hiddenClass);
		}
	}

	sumOfElementsWidth = Math.round(sumOfElementsWidth);

	if (sumOfElementsWidth > availableWidth) {
		actionElement.classList.remove(hiddenClass);

		if (collapsed) {
			const firstFilter = filters[0];
			firstFilter.classList.remove(hiddenClass);

			const filterWidth = Math.round(getElementOuterWidth(firstFilter));

			if (filterWidth > availableWidth - actionButtonWidth) {
				firstFilter.classList.add(hiddenClass);
			}
		}
	}

	if (collapsed && sumOfElementsWidth <= availableWidth) {
		filters[filters.length - 1].classList.remove(hiddenClass);
	}
};
