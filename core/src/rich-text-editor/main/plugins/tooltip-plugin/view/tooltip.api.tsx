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

import type { ReactNode, MouseEvent } from "react";

import type { Container, Identifiable, Ref, Styleable } from "../../../../../common/main/base-props.js";

/**
 * @deprecated since version 38.2.0. Use {@link TooltipPluginProps} instead.
 */
export type TooltipProps = TooltipPluginProps;
export interface TooltipPluginProps extends Styleable, Identifiable {
	/**
	 * Open the tooltip after a certain amount of time.
	 * Notice that this delay will just work with hover mode.
	 * @default 500
	 */
	openedDelay?: number;

	/**
	 * Close the tooltip after a certain amount of time.
	 * Notice that this delay will just work with hover mode.
	 * @default 200
	 */
	closedDelay?: number;

	/**
	 * How to trigger the tooltip.
	 * @default hover
	 */
	triggerMode?: TooltipPluginProps.TriggerMode;

	/**
	 * Content of the tooltip.
	 */
	render?: TooltipPluginProps.Render;

	/**
	 * Change how tooltip is displayed.
	 */
	changeVisible?(handler?: TooltipPluginProps.ChangeVisibleHandler): void;

	/**
	 * Change tooltip position.
	 */
	changePosition?(handler?: TooltipPluginProps.ChangePositionHandler): void;
}

/**
 * @deprecated since version 38.2.0. Use {@link TooltipPluginProps} instead.
 */
export namespace TooltipProps {
	export type ChangeVisibleHandler = TooltipPluginProps.ChangePositionHandler;
	export type ChangePositionHandler = TooltipPluginProps.ChangePositionHandler;
	export type Render = TooltipPluginProps.Render;
	export type TriggerMode = TooltipPluginProps.TriggerMode;
}

export namespace TooltipPluginProps {
	export type ChangeVisibleHandler = (visible: boolean, render?: Render) => void;

	export type ChangePositionHandler = (centerX: number, centerY: number, target?: EventTarget | null) => void;

	export type Render = () => ReactNode;

	export type TriggerMode = "focus" | "hover";
}

/**
 * @deprecated since version 38.2.0. Use {@link TooltipPluginWrapperProps} instead.
 */
export type TooltipWrapperProps = TooltipPluginWrapperProps;
export interface TooltipPluginWrapperProps extends Styleable, Identifiable, Container, Ref {
	/**
	 * The event trigger when move mouse over the tooltip wrapper.
	 */
	onMouseOver?(event: MouseEvent<HTMLElement>): void;

	/**
	 * The event trigger when move mouse leave the tooltip wrapper.
	 */
	onMouseLeave?(event: MouseEvent<HTMLElement>): void;

	/**
	 * The event trigger when click outside the tooltip wrapper.
	 */
	onClickOutside?(event: Event): void;
}
