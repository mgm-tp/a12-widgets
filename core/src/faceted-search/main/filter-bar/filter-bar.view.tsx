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

import type { ReactNode, ReactElement } from "react";
import { useRef, useContext, useState, useCallback, Children, isValidElement, cloneElement, useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";

import { Icon } from "../../../icon/main/icon.view.js";
import { joinClassNames, addPrefix } from "../../../common/main/utils.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { FilterProps } from "../filter/filter.api.js";

import {
	StyledFilterBarWrapper,
	StyledFilterBarContent,
	StyledFilterBarAction,
	StyledFilterBarActionButton
} from "./filter-bar.styled.js";
import type { FilterBarProps } from "./filter-bar.api.js";
import { FilterContext } from "./filter-context.js";

const baseClassName = addPrefix("filter-bar");
const hiddenClass = addPrefix("h_hidden");

export function FilterBar(props: FilterBarProps): ReactElement<FilterBarProps> {
	const filterContentElement = useRef<HTMLElement | null>(null);
	const actionElement = useRef<HTMLElement | null>(null);
	const actionElementWidth = useRef(0);
	const context = useContext(A11YLanguageContext);
	const [collapsed, setcollapsed] = useState(props.initialCollapsed);

	const getAvailableWidthOfElement = (element: HTMLElement): number => {
		return (
			element.getBoundingClientRect().width -
			parseFloat(window.getComputedStyle(element).paddingLeft || "0") -
			parseFloat(window.getComputedStyle(element).paddingRight || "0")
		);
	};

	const getFilterWidth = (filter: Element): number => {
		const filterMarginLeft = parseFloat(window.getComputedStyle(filter).marginLeft || "0");
		const filterMarginRight = parseFloat(window.getComputedStyle(filter).marginRight || "0");

		return filter.getBoundingClientRect().width + filterMarginLeft + filterMarginRight;
	};

	const updateCollapseButtonVisibility = useCallback((): void => {
		if (!filterContentElement.current || !actionElement.current) {
			return;
		}

		actionElementWidth.current = actionElement.current?.getBoundingClientRect().width;

		const filters = Array.from(filterContentElement.current.querySelectorAll("[data-role=filter]"));

		if (!filters.length || filters.length !== Children.toArray(props.children).length) {
			return;
		}

		// Show all filters to calculate available space
		for (const filter of filters) {
			filter.classList.remove(hiddenClass);
		}

		actionElement.current.classList.add(hiddenClass);

		const availableWidth = Math.round(getAvailableWidthOfElement(filterContentElement.current));
		let sumOfElementsWidth = 0;

		for (const filter of filters) {
			sumOfElementsWidth += getFilterWidth(filter);

			if (collapsed && Math.round(sumOfElementsWidth) > availableWidth - actionElementWidth.current) {
				filter.classList.add(hiddenClass);
			}
		}

		sumOfElementsWidth = Math.round(sumOfElementsWidth);

		if (sumOfElementsWidth > availableWidth) {
			actionElement.current.classList.remove(hiddenClass);

			if (!collapsed) {
				return;
			}

			const firstFilter = filters[0];
			firstFilter.classList.remove(hiddenClass);

			const filterWidth = Math.round(getFilterWidth(firstFilter));

			if (filterWidth > availableWidth - actionElementWidth.current) {
				firstFilter.classList.add(hiddenClass);
			}
		}

		if (collapsed && sumOfElementsWidth <= availableWidth) {
			filters[filters.length - 1].classList.remove(hiddenClass);
		}
	}, [collapsed, props.children]);

	const handleCollapsing = (): void => {
		setcollapsed((collapsed) => !collapsed);
	};

	const getChildren = (): ReactNode => {
		const children = Children.toArray(props.children);

		return Children.map(children, (child, index) => {
			if (isValidElement<FilterProps>(child)) {
				const originalOnCloseEvent = child.props.onClose;

				return cloneElement(child, {
					key: index,
					onClose: async () => {
						if (originalOnCloseEvent) {
							await Promise.resolve(originalOnCloseEvent());
						}

						updateCollapseButtonVisibility();
					}
				});
			}

			return null;
		});
	};

	const setContentElementRef = (ref: HTMLElement | null): void => {
		filterContentElement.current = ref;
	};

	const setActionElementRef = (ref: HTMLElement | null): void => {
		actionElement.current = ref;
	};

	const className = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--disabled`]: props.disabled },
		{ [`${baseClassName}--collapsed`]: collapsed },
		props.className
	);

	const filterBarA11yTitles = context.filterBarTitles;

	useEffect(() => {
		updateCollapseButtonVisibility();
	}, [updateCollapseButtonVisibility, collapsed]);

	const { ref: resizeRef } = useResizeDetector({
		onResize: updateCollapseButtonVisibility,
		refreshMode: "debounce",
		refreshRate: 0
	});

	return (
		<StyledFilterBarWrapper
			id={props.id}
			className={className}
			style={props.style}
			role="region"
			aria-label={context.filterBarTitles && context.filterBarTitles.ariaLabel}
			data-role={DataRoles.Filterbar}
			ref={resizeRef}
		>
			<StyledFilterBarContent
				collapsed={collapsed}
				className={`${baseClassName}__content`}
				ref={setContentElementRef}
				data-role={DataRoles.Filterbar.Content}
			>
				<FilterContext value={{ disabled: props.disabled }}>{getChildren()}</FilterContext>
			</StyledFilterBarContent>
			<StyledFilterBarAction
				className={`${baseClassName}__action`}
				ref={setActionElementRef}
				data-role={DataRoles.Filterbar.Action}
			>
				<StyledFilterBarActionButton
					collapsed={collapsed}
					className={`${baseClassName}__action-button`}
					icon={<Icon>{`keyboard_arrow_${collapsed ? "down" : "up"}`}</Icon>}
					title={
						(collapsed ? filterBarA11yTitles?.expandButton : filterBarA11yTitles?.collapseButton) ??
						filterBarA11yTitles?.actionButton
					}
					disabled={props.disabled}
					buttonAttributes={{ "aria-expanded": !collapsed }}
					onClick={props.disabled ? undefined : handleCollapsing}
				/>
			</StyledFilterBarAction>
		</StyledFilterBarWrapper>
	);
}

FilterBar.displayName = "FilterBar";
