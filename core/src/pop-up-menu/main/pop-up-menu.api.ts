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
 * This pop up menu widget displays an icon that open a menu when clicked.
 * This can be used for repeat actions or as a collapsed menu on small screens when space is limited.
 */
import type { ReactNode, ReactElement, RefCallback, HTMLAttributes, MouseEvent } from "react";

import type { Orientation } from "../../common/main/alignment.js";
import type { Ref, Identifiable, Styleable, DataRole, Container } from "../../common/main/base-props.js";

export type PopUpMenuCloseReason =
	| "onItemClick"
	| "onOutsideClick"
	| "onEscape"
	| "onSpace"
	| "onTab"
	| "onCloseButton"
	| "onProgrammatic";

export interface PopUpMenuProps extends Container, Styleable, Identifiable, DataRole, Ref<HTMLDivElement> {
	/**
	 * Contains Icon for button in popup menu.
	 */
	icon?: ReactNode;

	/**
	 * Specifies the element to trigger the menu. It should be an interactive ReactElement, such as a button.
	 */
	triggerElement?: ReactElement;

	/**
	 * Specifies that this widget is disabled.
	 */
	disabled?: boolean;

	/**
	 * Specifies a custom title for the original trigger button when the popup is closed.
	 * By default, it will be "Open menu" in English, and "Menü öffnen" in German.
	 */
	triggerButtonTitle?: string;

	/**
	 * Specifies a custom close title for the original trigger button when the popup is opened.
	 * By default, it will be "Close menu" in English, and "Menü schließen" in German.
	 */
	triggerButtonCloseTitle?: string;

	/**
	 * The additional class names for the Attached Portal.
	 */
	portalClassName?: string;

	/**
	 * The additional class names for the popup menu list.
	 */
	menuClassName?: string;

	/**
	 * If true, the focus will be set to the popup container when it's opened.
	 * @default true
	 */
	focusOnOpen?: boolean;

	/**
	 * Specifies whether the focus should be restored to the trigger element when the popup menu is closed.
	 *
	 * @default true
	 *
	 * - `true`: restores focus to the trigger element for all close reasons.
	 * - `false`: disables focus restoration when the popup menu is closed, except ESC and SPACE, which still restore focus.
	 * - `Object`: configures focus restoration per close reason. Each property is optional and defaults to `true`.
	 * Available reasons include item clicks, outside clicks, ESC, SPACE, TAB, close button clicks and programmatic closes (when the popup is controlled and closed from outside the component).
	 *
	 * Example: `focusOnTriggerElementAfterClose={{ onItemClick: false }}`
	 * (Focus restoration is disabled for item clicks only, all other close reasons still restore focus)
	 */
	focusOnTriggerElementAfterClose?: boolean | Partial<Record<PopUpMenuCloseReason, boolean>>;

	/**
	 * Specifies whether the portal should be closed when the ESC key is hit.
	 * @default true
	 */
	closeOnEsc?: boolean;

	/**
	 * Dictates the portal's position relative to the {@link triggerElement}.
	 */
	orientation?: Orientation;

	/**
	 * Specifies if the portal should close on outer click.
	 * If set the exception, portal will be closed when clicking outside but won't be closed if click on exception.
	 *
	 * *Note:* This flag will be true on desktop or when "enableA11YMobileDesign" is false, or if there is no {@link headerTitle}
	 */
	closeOnOutsideClick?: boolean | { exception?: HTMLElement[] };

	/**
	 * Specifies the HTML tag that will wrap the Popup.
	 * @default "div"
	 */
	htmlTag?: string;

	/**
	 * The reference of the custom trigger element.
	 */
	triggerElementRef?: RefCallback<HTMLElement>;

	/**
	 * The title for the header of the popup menu.
	 * To show the header in the popup menu, you must provide a value for headerTitle.
	 *
	 * *Note:* It only supports for mobile usage.
	 */
	headerTitle?: ReactNode;

	/**
	 * @internal
	 * Indicates whether the popup is part of a responsive group of buttons.
	 */
	isInResponsiveGroupButton?: boolean;

	/**
	 *  Additional props that will be placed at the popup list DOM element.
	 *  It should be used in case a user wants to access to native DOM properties but there's no property allows to do that.
	 */
	popupListAttributes?: HTMLAttributes<HTMLElement>;

	/**
	 * A callback will be triggered when the visibility of the popup has changed.
	 * @param isPopupVisible – whether the popup is shown or not.
	 */
	onVisibilityChange?(isPopupVisible: boolean): void;

	/**
	 * A callback will be triggered when clicking the trigger element by mouse.
	 */
	onTriggerElementClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Returns a handler for closing the popup.
	 */
	close?(handler: () => void): void;
}
