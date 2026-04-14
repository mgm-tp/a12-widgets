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
 * This widget provides a tag editor that the user can create multiple tags.
 * User can also interact with the editor by use both mouse and keyboard.
 * @module
 */

import type { ReactNode } from "react";

import type { BaseInputProps, InputDOMProps } from "../../input/base/template/base.tpl.api.js";

export interface TagInputProps
	extends
		Omit<BaseInputProps, "breakTooltipsToNewLine" | "fitToParent" | "ariaDescribedby">,
		InputDOMProps<HTMLTextAreaElement> {
	/**
	 * Placeholder for the input area.
	 */
	placeholder?: string;

	/**
	 * The custom characters that can be used to create a tag.
	 * @default comma.
	 */
	keys?: string[];

	/**
	 * Tags to be rendered initially.
	 */
	initialTags?: string[];

	/**
	 * The popular tags that will display when user starts typing a tag.
	 */
	popularTags?: string[];

	/**
	 * The label for the popular tag's DropDown.
	 */
	popularLabel?: string;

	/**
	 * The suggestion tags that will display when user're typing a tag that is similar to the tag in suggestions.
	 */
	suggestionTags?: string[];

	/**
	 * The label for the suggestions's DropDown.
	 */
	suggestionLabel?: string;

	/**
	 * The text input will be focused automatically when the component is mounted.
	 * @default false
	 */
	autoFocus?: boolean;

	/**
	 * Specifies addons will be placed before input wrapper.
	 */
	addonBefore?: ReactNode | ReactNode[];

	/**
	 * Specifies addons will be placed after input wrapper.
	 */
	addonAfter?: ReactNode | ReactNode[];

	/**
	 * aria-describedby attribute for the input.
	 * @deprecated since 32.0.0
	 *
	 *  - Why: NVDA does not read the elements linked by aria-describedby because aria-activedescendant is active when the tags list is opened.
	 *  - Alternative: Use {@link ariaLabelledby}. It will be set to the dropdown content wrapper when the list is shown instead of the input.
	 */
	ariaDescribedby?: string;

	/**
	 * aria-labelledby attribute for the dropdown content wrapper
	 */
	ariaLabelledby?: string;

	/**
	 * Whether the list of items would be opened when focusing the input.
	 * @default true
	 */
	openOnFocus?: boolean;

	/**
	 * This message will be shown when user tries to create the duplicated tag.
	 *
	 * If it's not provided, default localized message will be shown:
	 *
	 * - English: You've already used this tag
	 * - Germany: Stichwort wurde bereits verwendet
	 */
	duplicatedTagMessage?: ReactNode;

	/**
	 * Use for modal on mobile devices
	 */
	mobileModalProps?: {
		/**
		 * Called whenever the modal on touch devices close
		 */
		onModalClose?(): void;

		/**
		 * call when click on save button.
		 */
		onSave?(addedTags: string[], removedTags: string[]): void;

		/**
		 * Use for buttons on footer.
		 *
		 * @default icon-button
		 */
		buttonsProps: {
			saveIcon?: ReactNode;
			saveLabel?: string;
			cancelIcon?: ReactNode;
			cancelLabel?: string;
		};
	};

	/**
	 * Will be triggered when a tag is removed.
	 */
	onRemoveTag?(removedTag?: string): void;

	/**
	 * Will be triggered when one or more tags are added.
	 */
	onAddedTag?(addedTags?: string[]): void;

	/**
	 * A function that defines the sorting order. The return value should be a number indicating the relative order of the two elements:
	 *
	 * - Negative if firstTag is less than secondTag.
	 * - Positive if firstTag is greater than secondTag.
	 * - Zero if they are equal. NaN is treated as 0
	 *
	 * If no specific property is provided, the default sorting order will be ascending.
	 *
	 * @param firstTag – The first tag for comparison.
	 * @param secondTag – The second tag for comparison.
	 */
	comparator?(firstTag: string, secondTag: string): number;
}
