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

/**
 * The Autocomplete's option list. Shared by both presentations — the dropdown attached to the field
 * and the fullscreen dialog — so the listbox contract, the loading overlay and the windowing
 * threshold cannot drift apart between them.
 * @module
 */

import type { ReactElement, ReactNode } from "react";

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import type {
	DropDownItem,
	DropdownNavigationHandle,
	SelectedItemPosition
} from "../../../dropdown/main/template/dropdown.tpl.api.js";
import { DropDown } from "../../../dropdown/main/template/dropdown.tpl.view.js";
import { getDropDownItemsLength } from "../../../dropdown/main/template/dropdown.utils.js";
import { ProgressIndicator } from "../../../progress-indicator/main/progress-indicator.view.js";

import { StyledAutocompleteDropdownWrapper } from "./autocomplete.styled.js";

const baseClassName = addPrefix("autocomplete");

/**
 * Matches above this count are windowed, so a long list stays responsive to open and filter. A
 * grouped list is measured by the options it holds rather than by its headings, since it is the
 * options that are rendered.
 */
export const VIRTUALIZE_FROM_ITEM_COUNT = 150;

export interface AutocompleteDropdownProps {
	id: string | undefined;
	items: DropDownItem[];
	selectedItem: DropDownItem | undefined;
	hint: string | undefined;
	ariaLabelledby: string | undefined;
	selectedItemPosition: SelectedItemPosition | undefined;
	lightBackground: boolean | undefined;
	links: ReactNode[] | undefined;
	footer: ReactNode;
	loading: boolean | undefined;
	loadingLabel: ReactNode;

	/** Only the attached presentation styles the option list with it — see AutocompleteModal. */
	itemsWrapperClassName?: string;

	virtualize: boolean | undefined;

	/** Width the list should align to. Omitted inside the dialog, where the list fills the width. */
	width?: number;

	/**
	 * Whether the list is the popup anchored to the field rather than the dialog's, which decides
	 * whether it keeps its height cap on touch — see StyledAutocompleteDropdownWrapper.
	 */
	attached?: boolean;

	/** The active option, held by the caller's `useDropdownNavigation`. */
	navigation: DropdownNavigationHandle;

	onSelectedItemChange(item: DropDownItem): void;

	onPreselectedItemChange(item: DropDownItem): void;

	onPreselectedLinkChange(index: number | undefined): void;

	onScroll?(): void;
}

export function AutocompleteDropdown({
	id,
	items,
	selectedItem,
	hint,
	ariaLabelledby,
	selectedItemPosition,
	lightBackground,
	links,
	footer,
	loading,
	loadingLabel,
	itemsWrapperClassName,
	virtualize,
	width,
	attached,
	navigation,
	onSelectedItemChange,
	onPreselectedItemChange,
	onPreselectedLinkChange,
	onScroll
}: AutocompleteDropdownProps): ReactElement {
	return (
		<StyledAutocompleteDropdownWrapper
			isLoading={loading}
			$attached={attached}
			// The list carries the width too, but it renders nothing at all while a search has not
			// produced its options — and then this is what the loading overlay has to fill.
			style={width === undefined ? undefined : { width }}
			onScrollCapture={() => undefined}
			className={joinClassNames(
				`${baseClassName}__dropdown`,
				{ [`${baseClassName}__dropdown--loading`]: loading },
				itemsWrapperClassName
			)}
		>
			<DropDown
				navigation={navigation}
				onSelectedItemChange={onSelectedItemChange}
				onPreselectedItemChange={onPreselectedItemChange}
				onPreselectedLinkChange={onPreselectedLinkChange}
				lightBackground={lightBackground}
				id={id ? `${id}-dropdown` : undefined}
				selectedItem={selectedItem}
				items={items}
				hint={hint}
				style={width === undefined ? undefined : { width }}
				ariaLabelledby={ariaLabelledby}
				selectedItemPosition={selectedItemPosition}
				virtualize={virtualize ?? getDropDownItemsLength(items) >= VIRTUALIZE_FROM_ITEM_COUNT}
				links={links}
				footer={footer}
				onScroll={onScroll}
			/>
			{loading && (
				<ProgressIndicator
					singleOverlay
					outerOverlayVariant="bright"
					innerOverlayVariant="bright"
					size="medium"
					label={loadingLabel}
					type="horizontal"
				/>
			)}
		</StyledAutocompleteDropdownWrapper>
	);
}

AutocompleteDropdown.displayName = "AutocompleteDropdown";
