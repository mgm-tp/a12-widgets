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

import { TouchTransition, MultiBackend, MouseTransition } from "dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { provider } from "./device-detector.js";

export namespace DragAndDropUtils {
	const isAndroidChrome = (): boolean => {
		return navigator.userAgent.includes("Android") && navigator.userAgent.includes("Chrome");
	};

	/**
	 * Select a backend that suits the running device.
	 * There are two backend provided from react-dnd.
	 */
	const DnDOptions = {
		backends: [
			{
				id: "html5",
				backend: HTML5Backend,
				transition: MouseTransition
			},
			{
				id: "touch",
				backend: TouchBackend,
				options: {
					delayTouchStart: 500,
					enableKeyboardEvents: false,
					enableMouseEvents: provider.isDesktop(),
					ignoreContextMenu: true
				},
				transition: TouchTransition
			}
		]
	};

	// Use MultiBackend for desktop and touch devices, HTML5Backend for Android Chrome to make sure Drag and Drop works properly on Android devices.
	export const DefaultDndBackend = isAndroidChrome() ? HTML5Backend : MultiBackend;
	export const DefaultDndBackendOptions = DnDOptions;

	export function canUseDragPreview(): boolean {
		return provider.hasTouch();
	}
}
