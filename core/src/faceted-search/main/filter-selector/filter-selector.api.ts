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

import type { ReactNode, MouseEvent, FocusEvent } from "react";

import type { Styleable, Identifiable } from "../../../common/main/base-props.js";
import type { InputDOMProps } from "../../../input/base/template/base.tpl.api.js";

import type { FilterSelectorTemplateProps } from "./tpl/filter-selector.tpl.api.js";

export namespace FilterSelectorProps {
	export interface FilterData {
		/**
		 * Identifier of the Filter.
		 */
		id: string;

		/**
		 * Label of the Filter.
		 */
		label: ReactNode;

		/**
		 * Specifies whether the Filter is active.
		 */
		active?: boolean;

		/**
		 * Displays an element after the Filter's label.
		 */
		meta?: ReactNode;

		/**
		 * If set to true, the checkbox will be disabled, but the filter remains clickable to modify filter's options.
		 */
		nonRemovable?: boolean;
	}

	export interface SectionData {
		/**
		 * Identifier of the Section.
		 */
		id?: string;

		/**
		 * Label of the Section.
		 */
		label: string;

		/**
		 * An array of Filters belongs to the Section.
		 */
		filters: FilterData[];
	}

	export type Filters = (FilterSelectorProps.FilterData | FilterSelectorProps.SectionData)[];

	export interface FilterItemProps extends Styleable, Identifiable {
		/** @internal */
		lastSelectedDivider?: boolean;

		/** @internal */
		active?: boolean;

		/** @internal */
		mobile?: boolean;

		/** @internal */
		secondaryText?: ReactNode;

		/** @internal */
		expanded?: boolean;

		/**
		 * Specifies the content of the Filter Item.
		 */
		filter: FilterData;

		/**
		 * Specifies whether the Filter Item is active.
		 */
		current: boolean;

		/**
		 * Specifies whether the Filter Item is disabled.
		 */
		disabled?: boolean;

		/**
		 * Displays an element after the Filter Item's label.
		 */
		meta?: ReactNode;

		/**
		 * The reference of the Filter Item's wrapper.
		 * @param id – identifier of the Filter Item.
		 * @param ref – reference element of the Filter Item's wrapper.
		 */
		wrapperRef?(id: string, ref: HTMLElement | null): void;

		/**
		 * The reference of the Filter Item's graphic checkbox.
		 * @param id – identifier of the Filter Item.
		 * @param ref – reference element of the Filter Item's graphic checkbox.
		 */
		graphicRef?(id: string, ref: HTMLInputElement | null): void;

		/**
		 * Event that will be fired when the Filter Item is toggled.
		 * @param id – identifier of the Filter Item.
		 */
		onToggle?(id: string): void;

		/**
		 * Event that will be fired when the Filter Item is clicked.
		 * @param id – identifier of the Filter Item.
		 * @param event
		 */
		onClick?(id: string, event?: MouseEvent<HTMLElement>): void;

		/**
		 * Event that will be fired when the Filter Item is hovered.
		 * @param id – identifier of the Filter Item.
		 * @param event
		 */
		onMouseOver?(id: string, event: MouseEvent<HTMLElement>): void;

		/**
		 * Event that will be fired when the Filter Item is focused.
		 * @param id – identifier of the Filter Item.
		 * @param event
		 */
		onFocus?(id: string, event?: FocusEvent<HTMLElement>): void;
	}
}

/**
 * Props for the FilterSelector component in classic (attached-portal) mode.
 *
 * Also used as the base type for backward-compatible usage.
 * For list mode, use {@link FilterSelectorListModeProps} instead.
 */
export interface FilterSelectorProps extends FilterSelectorBaseProps {
	/**
	 * Element that is used to align the Filter Selector.
	 */
	referenceElement: HTMLElement;

	/**
	 * Close on hitting Escape
	 * @default true
	 */
	closeOnEsc?: boolean;

	/**
	 * Callback that will be fired when the visibility of the Filter Selector is changed.
	 */
	onVisibilityChange?(isVisible: boolean): void;

	/**
	 * Callback that will be fired when the focus of the primary view inside the Filter Selector is changed.
	 */
	onPrimaryViewFocusChange?(focused: boolean): void;

	/**
	 * Event that will be fired when the Filter Item is being hovered.
	 * @param id – identifier of the Filter Item that is being hovered.
	 * @param event
	 */
	onFilterMouseOver?(id: string, event: MouseEvent<HTMLElement>): void;
}

export interface FilterSelectorBaseProps extends Styleable, Identifiable, InputDOMProps {
	/**
	 * Specifies Filters that are active.
	 */
	activeFilters: FilterSelectorProps.FilterData[];

	/**
	 * Specifies Filters that are inactive.
	 */
	inactiveFilters: FilterSelectorProps.Filters;

	/**
	 * Additional properties for the primary content area of the Filter Selector.
	 */
	primaryContentProps: FilterSelectorTemplateProps.ContentProps & { ariaLabelledby?: string };

	/**
	 * Placeholder text for the search input.
	 */
	inputPlaceholder?: string;

	/**
	 * Hidden label for the search input.
	 */
	inputHiddenLabel?: ReactNode;

	/**
	 * Specifies whether the search bar should be hidden.
	 * @default false
	 */
	hideSearchBar?: boolean;

	/**
	 * Specifies whether the Filter Selector is disabled
	 */
	disabled?: boolean;

	/**
	 * Element to be displayed below the search input
	 */
	actionElement?: ReactNode;

	/**
	 * Element to be displayed as the footer of the Filter Selector.
	 */
	footerContent?: ReactNode;

	/**
	 * Event that will be fired when the Filter Item is toggled.
	 * @param id – identifier of the Filter Item.
	 */
	onFilterToggle?(id: string): void;

	/**
	 * Event that will be fired when the Filter Item is clicked.
	 * @param id - identifier of the Filter Item.
	 * @param event
	 */
	onFilterClick?(id: string, event?: MouseEvent<HTMLElement>): void;

	/**
	 * Callback that will be fired when the value of the Search Input is changed.
	 * @param value
	 */
	onSearchChange?(value: string): void;

	/**
	 * Content of the Filter to be displayed on the right side of the Filter Selector.
	 * @param id - identifier of the Filter.
	 */
	renderFilterView?(id?: string): ReactNode;

	/**
	 * Content of the Filter Options to be displayed on the right side of the Filter Selector.
	 * @param filter - data of the Filter.
	 */
	renderFilterOptions?(filter: FilterSelectorProps.FilterData): ReactNode;
}
