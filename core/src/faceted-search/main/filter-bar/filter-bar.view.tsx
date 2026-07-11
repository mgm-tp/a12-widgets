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
import { isEmpty, isEqual } from "lodash-es";

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
import { getContentBoxWidth, handleCollapseMode, handleCompactMode } from "./filter-bar.utils.js";

const baseClassName = addPrefix("filter-bar");
const hiddenClass = addPrefix("h_hidden");

export function FilterBar({
	initialCollapsed,
	disabled,
	children,
	id,
	className,
	style,
	compact = false,
	actions,
	onHiddenFiltersChange
}: FilterBarProps): ReactElement<FilterBarProps> {
	const filterContentElementRef = useRef<HTMLElement>(null);
	const parentContainerRef = useRef<HTMLDivElement>(null);
	const actionElementRef = useRef<HTMLDivElement>(null);
	const prevHiddenIndicesRef = useRef<number[]>([]);

	const context = useContext(A11YLanguageContext);
	const [collapsed, setCollapsed] = useState(compact || initialCollapsed);

	const { ref: contentResizeRef, width: contentWidth = 0 } = useResizeDetector({
		refreshMode: "debounce",
		refreshRate: 0
	});

	const setContentElementRef = useCallback((ref: HTMLElement | null) => {
		filterContentElementRef.current = ref;
	}, []);

	const setParentContainerRef = useCallback(
		(ref: HTMLDivElement | null) => {
			parentContainerRef.current = ref;
			contentResizeRef(ref);
		},
		[contentResizeRef]
	);

	const getValidatedFilters = useCallback((): Element[] => {
		if (!filterContentElementRef.current) {
			return [];
		}

		const filters = Array.from(filterContentElementRef.current.querySelectorAll("[data-role=filter]"));
		const childCount = Children.toArray(children).length;

		return filters.length === childCount ? filters : [];
	}, [children]);

	const updateVisibility = useCallback((): void => {
		const filters = getValidatedFilters();

		if (isEmpty(filters) || !filterContentElementRef.current) {
			return;
		}

		filters.forEach((filter) => filter.classList.remove(hiddenClass));

		if (compact) {
			const parentWidth = parentContainerRef.current
				? contentWidth === 0
					? getContentBoxWidth(parentContainerRef.current)
					: contentWidth
				: 0;

			const actionWidth = actionElementRef.current ? actionElementRef.current.getBoundingClientRect().width : 0;
			const availableWidth = Math.max(0, parentWidth - actionWidth);

			const hiddenIndices = handleCompactMode(filters, hiddenClass, availableWidth);

			if (!isEqual(hiddenIndices, prevHiddenIndicesRef.current)) {
				prevHiddenIndicesRef.current = hiddenIndices;
				onHiddenFiltersChange?.(hiddenIndices);
			}

			return;
		}

		if (!actionElementRef.current || !parentContainerRef.current) {
			return;
		}

		handleCollapseMode({
			filters,
			hiddenClass,
			contentElement: parentContainerRef.current,
			actionElement: actionElementRef.current,
			collapsed
		});
	}, [getValidatedFilters, compact, collapsed, contentWidth, onHiddenFiltersChange]);

	const handleCollapsing = (): void => {
		setCollapsed((prev) => !prev);
	};

	const getChildren = (): ReactNode => {
		return Children.map(Children.toArray(children), (child, index) => {
			if (!isValidElement<FilterProps>(child)) {
				return null;
			}

			const originalOnClose = child.props.onClose;

			return cloneElement(child, {
				key: index,
				onClose: async () => {
					if (originalOnClose) {
						await Promise.resolve(originalOnClose());
					}

					updateVisibility();
				}
			});
		});
	};

	const combinedClassName = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--disabled`]: disabled },
		{ [`${baseClassName}--collapsed`]: collapsed },
		className
	);

	const filterBarA11yTitles = context.filterBarTitles;

	useEffect(() => {
		updateVisibility();
	}, [updateVisibility]);

	return (
		<StyledFilterBarWrapper
			id={id}
			className={combinedClassName}
			style={style}
			role="region"
			aria-label={filterBarA11yTitles?.ariaLabel}
			data-role={DataRoles.Filterbar}
			ref={setParentContainerRef}
			$compact={compact}
		>
			<StyledFilterBarContent
				$compact={compact}
				className={`${baseClassName}__content`}
				ref={setContentElementRef}
				data-role={DataRoles.Filterbar.Content}
			>
				<FilterContext value={{ disabled }}>{getChildren()}</FilterContext>
			</StyledFilterBarContent>
			<StyledFilterBarAction
				className={`${baseClassName}__action`}
				ref={actionElementRef}
				data-role={DataRoles.Filterbar.Action}
				$hasCustomActions={!!actions}
			>
				{!compact && (
					<StyledFilterBarActionButton
						collapsed={collapsed}
						className={`${baseClassName}__action-button`}
						icon={<Icon>{`keyboard_arrow_${collapsed ? "down" : "up"}`}</Icon>}
						title={
							(collapsed ? filterBarA11yTitles?.expandButton : filterBarA11yTitles?.collapseButton) ??
							filterBarA11yTitles?.actionButton
						}
						disabled={disabled}
						buttonAttributes={{ "aria-expanded": !collapsed }}
						onClick={disabled ? undefined : handleCollapsing}
					/>
				)}
				{actions}
			</StyledFilterBarAction>
		</StyledFilterBarWrapper>
	);
}

FilterBar.displayName = "FilterBar";
