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

import type { CSSProperties, HTMLProps, ReactNode, RefCallback, HTMLAttributes as ReactHTMLAttributes } from "react";

export interface Identifiable {
	/**
	 * Specifies an id that is used for html id attribute.
	 *
	 * @see [MDN]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id}
	 */
	id?: string;
}

export interface Container {
	/**
	 * The component's content.
	 */
	readonly children?: ReactNode;
}

export interface Styleable {
	/**
	 * Additional css class names.
	 */
	readonly className?: string;

	/**
	 * Additional styles.
	 */
	readonly style?: CSSProperties;
}

export interface Ref<T extends HTMLElement = HTMLElement> {
	/**
	 * The reference of the element wrapping the main content if one exists.
	 */
	wrapperRef?: RefCallback<T>;
}

export interface DataRole {
	/**
	 * data-role attribute.
	 */
	dataRole?: string;
}

export interface DOMProps<T extends HTMLElement = HTMLDivElement> {
	/**
	 * Additional props that will be passed to the DOM Element.
	 */
	domProps?: HTMLProps<T>;
}

export interface HTMLAttributes<T extends HTMLElement = HTMLElement> {
	/**
	 *  Additional props that will be placed at the DOM element.
	 *  It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.
	 */
	htmlAttributes?: ReactHTMLAttributes<T>;
}
