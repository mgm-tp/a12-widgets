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
 * This Tag Widget can be used to add a tag into a page.
 * @module
 */

import type { ReactNode, MouseEvent, KeyboardEvent } from "react";

import type { Identifiable, Styleable, Ref } from "../../../common/main/base-props.js";

/**
 * The Props of Tag.
 */
export interface TagProps extends Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * The content of tag.
	 */
	children: ReactNode;

	/**
	 * The close button will be displayed.
	 */
	removable?: boolean;

	/**
	 * Disable remove button in removable tag.
	 */
	disabledRemoveButton?: boolean;

	/**
	 * Icon for tag.
	 */
	icon?: ReactNode;

	/**
	 * Color for tag.
	 */
	color?: string;

	/**
	 * TabIndex for tag and remove button.
	 */
	tabIndex?: number;

	/**
	 * Fire when the remove button is clicked.
	 *
	 * *Note:* Only works if {@link removable} is set to true.
	 */
	onRemove?(): void;

	/**
	 * Triggered when interact by mouse.
	 */
	onMouseDown?(key: string, event: MouseEvent<HTMLElement>): void;

	/**
	 * Triggered when clicking on Tag.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Key down handler for Tag.
	 * @param event – HTML key event.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * If set to true, will exclude the wai-aria attributes from Tag, so screen reader can not reach the Tag.
	 */
	noWaiAria?: boolean;
}
