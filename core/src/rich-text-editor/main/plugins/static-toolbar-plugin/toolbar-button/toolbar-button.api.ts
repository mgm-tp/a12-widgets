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

import type { ReactNode, MouseEvent, KeyboardEvent, MutableRefObject, ComponentType } from "react";
import type { LexicalEditor, BaseSelection } from "lexical";

import type { Container, Identifiable, Styleable, DataRole, Ref } from "../../../../../common/main/base-props.js";
import type { A11yDefinition } from "../../../../../common/main/a11y-localization/a11y-key-definition.api.js";

export interface BaseToolbarButtonProps<LanguageContext = A11yDefinition>
	extends Styleable, Identifiable, DataRole, Container, Partial<Interactable>, Ref {
	/**
	 * Icon of the button.
	 */
	icon?: ReactNode;

	/**
	 * Title displayed when hovering the button.
	 */
	title?: string | ((context: LanguageContext) => string | undefined);

	/**
	 * The label display on button.
	 */
	label?: ReactNode;

	/**
	 * Specifies the tabIndex attribute.
	 */
	tabIndex?: number;

	/**
	 * Trigger when clicking the toolbar button.
	 */
	onClick?(event: MouseEvent<HTMLElement>, editor?: LexicalEditor): void;

	/**
	 * A handler for key down event on the toolbar button.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>, editor?: LexicalEditor): void;

	triggerElementRef?: MutableRefObject<HTMLButtonElement | null | undefined>;
}

export interface Interactable {
	/**
	 * Checks if element from selection is active.
	 */
	isActive(selection: BaseSelection | null, editor: LexicalEditor, selectionCLassListCache?: string[]): boolean;

	/**
	 * Checks if element from selection is disabled.
	 */
	isDisabled?(selection: BaseSelection | null, editor: LexicalEditor): boolean;
}

export interface ButtonType {
	/**
	 * Button component.
	 */
	component: ComponentType<BaseToolbarButtonProps>;

	/**
	 * Button interaction status.
	 */
	interaction: Interactable;

	/**
	 * Button icon.
	 */
	icon?: ReactNode;
}
export namespace ButtonType {
	export function isInstance(obj: unknown): obj is ButtonType {
		return !!obj && typeof obj === "object" && "component" in obj && "interaction" in obj;
	}
}
