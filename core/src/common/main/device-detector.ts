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

import MobileDetect from "mobile-detect";
import { deviceType } from "detect-it";

import { isBrowser } from "./is-browser.js";

/**
 * Provides the device class of the current environment.
 */
export interface DeviceClassProvider {
	get(): DeviceClass;
	hasTouch(): boolean;
	isDesktop(): boolean;
	isPhone(): boolean;
	isTablet(): boolean;
}

/** Known device classes */
export type DeviceClass = "phone" | "tablet" | "desktop" | "unknown";

/**
 * Device class provider using the mobile-detect library. You normally do not need to instantiate this class but
 * can use the preconfigured provider below, which will use the window.navigator.userAgent.
 */
export class MobileDetectDeviceClassProvider implements DeviceClassProvider {
	constructor(private mobileDetect: MobileDetect) {}

	get(): DeviceClass {
		const isIPad =
			isBrowser &&
			(["iPad Simulator", "iPad"].includes(navigator.platform) ||
				// iPad on iOS 13 detection
				(navigator.userAgent.includes("Mac") && "ontouchend" in document));

		if (!this.mobileDetect.phone() && (isIPad || this.mobileDetect.tablet())) {
			return "tablet";
		} else if (this.mobileDetect.mobile()) {
			return this.mobileDetect.phone() ? "phone" : "unknown";
		} else {
			return "desktop";
		}
	}

	hasTouch(): boolean {
		return deviceType === "touchOnly" || deviceType === "hybrid";
	}

	isDesktop(): boolean {
		return this.get() === "desktop";
	}

	isPhone(): boolean {
		return this.get() === "phone";
	}

	isTablet(): boolean {
		return this.get() === "tablet";
	}
}

/** Default provider that you can directly use. */
export let provider: DeviceClassProvider = new MobileDetectDeviceClassProvider(
	new MobileDetect(isBrowser ? window.navigator.userAgent : "node.js")
);

/** Only use if you need to configure a different provider. */
export function configure(dcp: DeviceClassProvider): void {
	provider = dcp;
}

export function getMobileOperatingSystem(): string {
	const userAgent = navigator.userAgent || navigator.vendor;

	if (/android/i.test(userAgent)) {
		return "Android";
	}

	if (/iPad|iPhone/.test(userAgent)) {
		return "iOS";
	}

	return "unknown";
}

/**
 * @internal
 * In some cases, screen readers do not work properly on certain system. Use this method to check desktop operating system for support A11Y in those situations.
 * Note: Avoid using it as much as possible.
 */
export function getDesktopOperatingSystem(): string {
	const userAgent = navigator.userAgent || navigator.vendor;

	if (/Mac/i.test(userAgent)) {
		return "Mac";
	}

	if (/Windows/i.test(userAgent)) {
		return "Windows";
	}

	if (/Linux/i.test(userAgent)) {
		return "Linux";
	}

	return "unknown";
}
