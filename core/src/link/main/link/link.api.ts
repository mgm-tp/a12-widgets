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

import type { AnchorHTMLAttributes, MouseEvent } from "react";

import type { Container, Identifiable, Ref, Styleable } from "../../../common/main/base-props.js";

export interface LinkProps extends Ref<HTMLAnchorElement>, Styleable, Identifiable, Container {
	/**
	 * Additional props that will be placed at the real link (anchor) attributes element.
	 * It should be used in case the user want to access to native DOM properties of the original link element but there's no property allows to do that.
	 * For instance, `linkAttributes={{ "aria-disabled": true}}`
	 */
	linkAttributes?: AnchorHTMLAttributes<HTMLAnchorElement>;

	/**
	 * Specifies the linked document, resource, or location.
	 */
	href?: string;

	/**
	 * Title of the link.
	 */
	title?: string;

	/**
	 * Specifies where to open the linked document.
	 */
	target?: string;

	/**
	 * To support accessibility, the link should have better semantics if it triggers an interactive function rather than navigating to an {@link href}.
	 * If set to true, a `role="button"` will be added and the link can be used as a button.
	 */
	useAsButton?: boolean;

	/**
	 * @internal
	 * @default true
	 * Specifies whether hidden text should be shown to screen readers or not.
	 */
	showHiddenText?: boolean;

	/**
	 * Handle event when click on the link.
	 */
	onClick?(event: MouseEvent<HTMLAnchorElement>): void;
}
