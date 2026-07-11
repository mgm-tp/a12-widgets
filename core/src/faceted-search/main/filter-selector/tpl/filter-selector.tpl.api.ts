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

import type {
	ReactNode,
	RefCallback,
	KeyboardEvent,
	MouseEvent,
	FocusEvent,
	HTMLAttributes,
	DetailedHTMLProps,
	InputEventHandler
} from "react";

import type { Container, Identifiable, Ref, Styleable } from "../../../../common/main/base-props.js";
import type { ActionContentboxProps } from "../../../../contentbox/main/action-contentbox/action-contentbox.api.js";
import type {
	BaseInputEventHandler,
	BaseInputProps,
	InputDOMProps
} from "../../../../input/base/template/base.tpl.api.js";

export interface FilterSelectorTemplateProps extends Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * Content to be displayed on the left side.
	 */
	primaryContent?: ReactNode;

	/**
	 * aria-labelledby attribute for the Header of the primary content.
	 */
	primaryHeaderAriaLabelledby?: string;

	/**
	 * Content to be displayed on the right side.
	 */
	secondaryContent?: ReactNode;

	/**
	 * Content to be displayed on the footer.
	 */
	footerContent?: ReactNode;

	/**
	 * Reference element of the secondary content wrapper.
	 */
	secondaryRef?: RefCallback<HTMLElement>;

	/**
	 * Reference element of the footer content wrapper.
	 */
	footerRef?: RefCallback<HTMLElement>;

	/**
	 * A callback will be triggered when the wrapper element of the Filter Selector receives a KeyDown event.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * A callback will be triggered when the wrapper element of the Filter Selector receives a MouseLeave event.
	 */
	onMouseLeave?(event: MouseEvent<HTMLElement>): void;

	/**
	 * A callback will be triggered when the wrapper element of the Filter Selector receives a Click event.
	 */
	onClick?(event: MouseEvent): void;
}

export namespace FilterSelectorTemplateProps {
	export interface SearchInputProps
		extends BaseInputProps, BaseInputEventHandler<HTMLInputElement>, InputDOMProps, Container {
		/**
		 * Specifies placeholder that is shown in the input when its empty.
		 */
		placeholder?: string;

		/**
		 * Custom element for the search button.
		 */
		searchButton?: ReactNode;

		/**
		 * Custom element for the clear button.
		 */
		clearButton?: ReactNode;

		/**
		 * Event handler when clicking the clear button
		 */
		onClearButtonClick?(event: MouseEvent<HTMLButtonElement>): void;

		/**
		 * Value of the input.
		 */
		value?: string;

		/**
		 * Key down handler for the input.
		 */
		onKeyDown?(ev: KeyboardEvent<HTMLInputElement>): void;

		/**
		 * The ref to the input field.
		 */
		inputRef?: RefCallback<HTMLInputElement>;

		/**
		 * A callback will be triggered when the Search Input receives a onChange event.
		 */
		onInput?: InputEventHandler<HTMLInputElement>;
	}

	export interface ListProps extends Container, Styleable, Identifiable, Ref<HTMLUListElement> {}

	export interface ItemProps extends Container, Styleable, Identifiable, Ref<HTMLLIElement> {
		/** @internal */
		lastSelectedDivider?: boolean;

		/**
		 * Displays an element before the Item's children.
		 */
		graphic?: ReactNode;

		/**
		 * Displays an element after the Item's children.
		 */
		meta?: ReactNode;

		/**
		 * Displays the Item's secondary text.
		 */
		secondaryText?: ReactNode;

		/**
		 * Specifies whether the Item is active.
		 */
		active?: boolean;

		/**
		 * Specifies whether the Item is disabled.
		 */
		disabled?: boolean;

		/**
		 * Specifies whether the Item is readonly.
		 */
		readonly?: boolean;

		/**
		 * Specifies whether the Item is selected.
		 */
		selected?: boolean;

		/**
		 * @internal
		 */
		expanded?: boolean;

		/**
		 * Native onKeyDown event.
		 */
		onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

		/**
		 * Event that will be fired when the item is clicked.
		 */
		onClick?(event: MouseEvent<HTMLElement>): void;

		/**
		 * Event that will be fired when the item is moving over.
		 */
		onMouseOver?(event?: MouseEvent<HTMLElement>): void;

		/**
		 * Event that will be fired when the item is focused.
		 */
		onFocus?(event?: FocusEvent<HTMLElement>): void;

		/**
		 * Additional props for the Item's graphic wrapper.
		 */
		graphicWrapperProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
	}

	export interface SectionProps extends Container, Styleable, Identifiable {
		/**
		 * Use <div/> tag to render section to avoid syntax error if using outside the <ul/>.
		 * @default <li/> tag.
		 */
		useDivTag?: boolean;
	}

	export interface ContentProps extends ActionContentboxProps {
		/**
		 * Event that will be fired when the content is blurred.
		 */
		onBlur?(event: FocusEvent<HTMLElement>): void;

		/**
		 * Event that will be fired when the content is focused.
		 */
		onFocus?(event: FocusEvent<HTMLElement>): void;
	}

	export interface DividerProps extends Identifiable, Styleable {}

	export interface ActionBarProps extends Identifiable, Container, Styleable {}

	export interface ActionElementProps extends Identifiable, Container, Styleable {}

	export interface MessageProps extends Identifiable, Container, Styleable {}
}
