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

import type { KeyboardEvent, MouseEvent, RefCallback } from "react";
import type { Props, Rnd } from "react-rnd";

import type { HTMLAttributes, Identifiable, Ref } from "../../common/main/base-props.js";
import type { Orientation } from "../../common/main/alignment.js";

type RemoveIndex<T> = {
	[K in keyof T as {} extends Record<K, 1> ? never : K]: T[K];
};

export interface ResizeAndDragContainerProps
	extends RemoveIndex<Props>, Identifiable, Ref<HTMLDivElement>, HTMLAttributes {
	/**
	 * The element that is used to align this element.
	 *
	 * Undefined signals that the dom was not rendered yet.
	 */
	referenceElement: HTMLElement;

	/**
	 * Aligns the container to the {@link referenceElement} upon the initial mounting process.
	 * @default "bottom-start"
	 */
	orientation?: Orientation;

	/**
	 * List of preferred orientations upon the initial mounting process.
	 * - If both orientationList and {@link orientation} are defined, the container will
	 * prioritize the orientationList
	 * - The priority of orientations decrease from left to right (the first orientation of the list
	 * has the highest priority)
	 */
	orientationList?: Orientation[];

	/**
	 * Focus on the callout when it is opened.
	 * @default true
	 */
	focusOnOpen?: boolean;

	/**
	 * The reference element will be focused after the user pressed esc.
	 * @default true
	 */
	focusOnReferenceElementAfterEsc?: boolean;

	/**
	 * Should the container close when you click outside of it.
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * As fixedOrientation is set to true, the container will remain element's position at the preferred
	 */
	fixedOrientation?: boolean;

	/**
	 * Should the container close when the ESC key is hit.
	 * @default true
	 */
	closeOnEsc?: boolean;

	/**
	 * Specify whether a container should be resizable or not.
	 */
	disableResizing?: boolean;

	/**
	 * Define an HTML DOM element as the Portal component's mount point.
	 */
	wrapper?: Element | null;

	/**
	 * Initial size for ResizeAndDragContainer widget, only supports when {@link Props.default} is undefined
	 */
	initialSize?: ResizeAndDragContainerProps.Size;

	/**
	 * Open container at given position.
	 */
	initialPosition?: {
		readonly x?: number;
		readonly y?: number;
	};

	/**
	 * The function will be fired when closing the container.
	 */
	onClose?(): void;

	/**
	 * Handle event when click on the container.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Handle event when pressing keyboard.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * Rnd Instance ref - this ref allows to execute 'react-rnd' functions e.g. updateSize(), updatePosition()...
	 * @see {@link https://github.com/bokuweb/react-rnd#instance-api}
	 */
	rndRef?: RefCallback<Rnd>;

	/**
	 * Specifies whether the container is shown.
	 * @default true
	 */
	show?: boolean;

	/**
	 * Specifies whether the container has animation.
	 * @requires show property should be used to fully support animations when showing and hiding.
	 */
	animation?: boolean;

	/**
	 * The function to register a handler for closing the animation.
	 * @internal
	 */
	registerAnimationCloseHandler?(handler: () => void): void;
}

export namespace ResizeAndDragContainerProps {
	export interface Size {
		/**
		 * Initial width for ResizeAndDragContainer widget.
		 *
		 * *Note:* As the container’s width depends on its parent’s, using percentage (%) values is not recommended.
		 * Instead, numeric values or strings with units like `px` or `vw` are preferred.
		 */
		width: number | string;

		/**
		 * Initial height for ResizeAndDragContainer widget.
		 *
		 * *Note:* As the container’s height depends on its parent’s, using percentage (%) values is not recommended.
		 * Instead, numeric values or strings with units like `px` or `vh` are preferred.
		 */
		height: number | string;
	}
}
