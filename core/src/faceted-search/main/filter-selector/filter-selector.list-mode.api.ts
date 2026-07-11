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

import type { FocusEvent, ReactNode, RefCallback } from "react";

import type { Container, Identifiable } from "../../../common/main/base-props.js";

import type { FilterSelectorProps } from "./filter-selector.api.js";

/**
 * Data for a single collapsible filter item in list mode.
 */
export interface FilterItemData extends Omit<FilterSelectorProps.FilterData, "nonRemovable"> {
	/** Label shown in the collapsible heading. */
	label: string;

	/** Content rendered when the panel is expanded. */
	content: ReactNode;

	/**
	 * Badge variant on a collapsed active heading.
	 * @default "info"
	 */
	badgeVariant?: "info" | "error";

	/** When `true`, the meta element is always visible (not only on hover). */
	showMeta?: boolean;

	/** When `true`, renders a group separator divider below this item. */
	lastHiddenItem?: boolean;

	/** When `true`, the filter item is collapsed (filter content hidden). */
	collapsed?: boolean;

	/** Callback invoked when the collapsed state of this filter item changes. */
	onCollapseChange?: (isCollapsed: boolean) => void;

	/** Callback invoked when any element inside this filter item receives focus. */
	onFocus?: (event: FocusEvent<HTMLElement>) => void;
}

/**
 * Data for a section group in list mode.
 */
export interface FilterSectionData extends Identifiable {
	label: string;
	items: FilterItemData[];
}

export interface FilterSelectorListModeConfig extends Identifiable, Container {
	/**
	 * Items to display in the collapsible filter list.
	 * Each item can be a `FilterItemData` (flat filter) or a `FilterSectionData` (group header).
	 */
	items?: (FilterItemData | FilterSectionData)[];

	/**
	 * Content rendered at the top of the pane (e.g., a title row with a close button).
	 */
	headerContent?: ReactNode;

	/**
	 * Content rendered at the bottom of the pane (e.g., action buttons).
	 */
	footerContent?: ReactNode;

	/**
	 * Content rendered in the action bar area (e.g., a `FilterSelectorTemplate.SearchInput`).
	 */
	actionBar?: ReactNode;

	/**
	 * Reference callback forwarded to the outermost wrapper div (used for programmatic focus).
	 */
	wrapperRef?: RefCallback<HTMLDivElement>;

	/**
	 * Custom content that replaces the built-in collapsible filter list.
	 * When provided, `items` is ignored and this node is rendered in the list area instead.
	 */
	customFilterList?: ReactNode;
}

export interface FilterSelectorListModeProps extends Container {
	/**
	 * Enables list mode.
	 */
	listMode: FilterSelectorListModeConfig;

	/**
	 * Specifies Filters that are active.
	 */
	activeFilters?: FilterSelectorProps.FilterData[];

	/**
	 * Specifies Filters that are inactive.
	 */
	inactiveFilters?: FilterSelectorProps.Filters;
}
