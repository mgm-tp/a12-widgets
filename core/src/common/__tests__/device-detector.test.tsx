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

import { describe, expect, test } from "vitest";

import * as Detector from "../main/device-detector.js";

describe("com.mgmtp.a12.widgets.device_detector", () => {
	test("node", () => {
		expect(Detector.provider.get()).toEqual("desktop");
	});
	test("phone", () => {
		Detector.configure(
			new Detector.MobileDetectDeviceClassProvider(new MobileDetectMock({ mobile: true, phone: true }))
		);
		expect(Detector.provider.get()).toEqual("phone");
	});
	test("tablet", () => {
		Detector.configure(
			new Detector.MobileDetectDeviceClassProvider(new MobileDetectMock({ mobile: false, tablet: true }))
		);
		expect(Detector.provider.get()).toEqual("tablet");
	});
	test("desktop", () => {
		Detector.configure(new Detector.MobileDetectDeviceClassProvider(new MobileDetectMock({ mobile: false })));
		expect(Detector.provider.get()).toEqual("desktop");
	});
	test("unknown", () => {
		Detector.configure(new Detector.MobileDetectDeviceClassProvider(new MobileDetectMock({ mobile: true })));
		expect(Detector.provider.get()).toEqual("unknown");
	});
	test("provider", () => {
		expect(() => {
			Detector.provider.hasTouch();
		}).not.toThrow();
	});
});

export class MobileDetectMock implements MobileDetect {
	constructor(private conf: { mobile?: boolean; phone?: boolean; tablet?: boolean }) {}

	mobile(): string {
		return this.conf.mobile ? "yep" : "";
	}
	phone(): string {
		return this.conf.phone ? "yep" : "";
	}
	tablet(): string {
		return this.conf.tablet ? "yep" : "";
	}
	userAgent(): string {
		throw new Error("Method not implemented.");
	}
	userAgents(): string[] {
		throw new Error("Method not implemented.");
	}
	os(): string {
		throw new Error("Method not implemented.");
	}
	version(): number {
		throw new Error("Method not implemented.");
	}
	versionStr(): string {
		throw new Error("Method not implemented.");
	}
	is(): boolean {
		throw new Error("Method not implemented.");
	}
	match(): boolean {
		throw new Error("Method not implemented.");
	}
	isPhoneSized(): boolean {
		throw new Error("Method not implemented.");
	}
	mobileGrade(): string {
		throw new Error("Method not implemented.");
	}
}
