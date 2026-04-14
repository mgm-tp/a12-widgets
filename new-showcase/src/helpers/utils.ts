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

import { faker as Faker } from "@faker-js/faker/locale/en";
import MobileDetect from "mobile-detect";

import {
	configure,
	MobileDetectDeviceClassProvider,
	isBrowser,
	isVisibleOnScreen
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { Section, GroupSections } from "./definitions.js";

export class NoTouchDeviceClassProvider extends MobileDetectDeviceClassProvider {
	// override the hasTouch function, make it always return false
	hasTouch(): boolean {
		return false;
	}
}

export function disableTouchSupport(): void {
	const newDeviceClassProvider = new NoTouchDeviceClassProvider(new MobileDetect(window.navigator.userAgent));
	configure(newDeviceClassProvider);
}

/**
 * This is the same as the out-of-the-box provider from Widgets. We need this to check if touch is available on
 * the device or not, independent of whether we want to support touch
 */
export const defaultProvider = new MobileDetectDeviceClassProvider(
	new MobileDetect(isBrowser ? window.navigator.userAgent : "node.js")
);

/**
 * A simple Faker wrapper generates pseudorandom numbers which are predictable with fixed seed,
 * and independent of other invocations.
 */
export function fixedRandomNumber(seed = 2): () => number {
	let lastSeed = seed;

	return (): number => {
		Faker.seed(lastSeed);
		lastSeed = Faker.number.float({ min: 0, max: 100 });

		return lastSeed / 100;
	};
}

declare const __A12_VERSION__: string;

export function setLocalStorage(key: string, value: string): void {
	return localStorage.setItem(`${__A12_VERSION__}-${key}`, value);
}

export function getLocalStorage(key: string): string | null {
	return localStorage.getItem(`${__A12_VERSION__}-${key}`);
}

export function removeLocalStorage(key: string): void {
	return localStorage.removeItem(`${__A12_VERSION__}-${key}`);
}

export const isGroupSection = (sections?: Section[] | GroupSections): sections is GroupSections => {
	return !Array.isArray(sections);
};

export function toLink(label: string): string {
	return label.trim().toLowerCase().replace(/\W+/g, "-");
}

export function getHashId(text: string): string {
	// get only alphanumeric
	// remove extra spaces and replace it with single spaces
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]/gi, " ")
		.replace(/\s+/g, " ")
		.trim()
		.split(" ")
		.join("-");
}

export function convertPathToBreadcrumbTexts(path: string): string[] {
	return path
		.split("/")
		.slice(1)
		.map((item) => item.replace(/[^a-z0-9]/gi, " ").replace(/\w/, (firstLetter) => firstLetter.toUpperCase()));
}

export function getNavLinkId(showcasePath: string, sectionId: string): string {
	const sections = showcasePath.split("/");
	const lastSection = sections.pop();

	if (lastSection === sectionId) {
		if (sections[sections.length - 1] === lastSection) {
			return sections[sections.length - 2] + "-" + sectionId;
		}

		return sections[sections.length - 1] + "-" + sectionId;
	} else {
		return lastSection + "-" + sectionId;
	}
}

export function scrollToHashLink(anchorTag: string, linkId?: string): void {
	const element = document.getElementById(anchorTag);

	if (element) {
		setTimeout(() => {
			element.scrollIntoView({ behavior: "smooth" });
		}, 200);

		return;
	}

	setTimeout(() => {
		const navLinkElement = linkId ? document.getElementById(linkId) : undefined;

		if (navLinkElement && !isVisibleOnScreen(navLinkElement)) {
			navLinkElement.scrollIntoView({ behavior: "smooth" });
		}
	}, 200);
}

export function getDesktopOperatingSystem(): string {
	const userAgent = window.navigator.userAgent.toLowerCase();

	if (userAgent.includes("windows")) {
		return "Windows";
	} else if (userAgent.includes("mac")) {
		return "MacOS";
	} else if (userAgent.includes("linux")) {
		return "Linux";
	} else {
		return "Unknown";
	}
}
