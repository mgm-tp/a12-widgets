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

import type { ReactNode, MouseEvent, KeyboardEvent } from "react";

import type { Container, Identifiable, Styleable, Ref } from "../../common/main/base-props.js";

import type { ValidationBarVariant } from "./validation-bar.api.js";

export interface MobileValidationProps extends Styleable, Identifiable, Container, Ref<HTMLDivElement> {
	/**
	 * Variant of the Mobile Validation Bar.
	 * @default error.
	 */
	variant?: ValidationBarVariant;

	/**
	 * Title of the heading.
	 */
	headingTitle: ReactNode;

	/**
	 * Prefix elements are placed before the title.
	 */
	headingPrefixes?: ReactNode;

	/**
	 * Suffix elements are placed after the title.
	 */
	headingSuffixes?: ReactNode;

	/**
	 * Footer of the view.
	 */
	footer?: ReactNode;

	/**
	 * If specified, render a close button.
	 */
	onClose?(): void;
}

export namespace MobileValidationProps {
	export interface BaseProps extends Styleable, Identifiable, Container {}

	export interface OverviewProps extends Styleable, Identifiable {
		/**
		 * Variant of the Mobile Validation Bar Overview.
		 * @default error.
		 */
		variant?: ValidationBarVariant;

		/**
		 * Element on the left of the Overview's title.
		 */
		leftElement?: ReactNode;

		/**
		 * Element on the right of the Overview's title.
		 */
		rightElement?: ReactNode;

		/**
		 * A click handler usually uses to open the Overview.
		 */
		onClick?(event: MouseEvent): void;

		/**
		 * A handler will be triggered on keydown event.
		 */
		onKeyDown?(event: KeyboardEvent<HTMLElement>): void;
	}

	export interface GraphicProps extends BaseProps {
		/**
		 * Variant of the Validation Bar.
		 * @default error.
		 */
		variant?: ValidationBarVariant;

		/**
		 * The icon of the graphic.
		 */
		icon?: ReactNode;

		/**
		 * - Whether a hidden text is added after the graphic's text.
		 * - The supported texts are suitable only for the Overview.
		 *      Error: "Fehler, Klicken für Übersicht" (German) and "Errors, click to show list" (English)
		 * 	    Warning: "Warnungen, Klicken für Übersicht" (German) and "Warnings, click to show list" (English)
		 * @default false
		 */
		a11yTitleSupport?: boolean;
	}

	export type ContentProps = BaseProps;

	export type ActionsProps = BaseProps;

	export type ActionsItemProps = BaseProps;

	export type PreviewListProps = BaseProps;

	export interface PreviewListItemProps extends Styleable, Identifiable {
		/**
		 * Variant of the item.
		 * @default error
		 */
		variant?: ValidationBarVariant;

		/**
		 * Icon for the preview item.
		 */
		icon?: ReactNode;

		/**
		 * Text for the preview item.
		 */
		text: string;

		/**
		 * Max line for the text.
		 * @default 3
		 */
		maxLineOfText?: number;

		/**
		 * Meta item to render.
		 */
		meta?: ReactNode;

		/**
		 * Click handler for the preview item.
		 */
		onClick?(event?: MouseEvent<HTMLElement>): void;
	}
}
