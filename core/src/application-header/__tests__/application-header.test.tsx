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

import { render } from "test-utils";
import { describe, expect, test } from "vitest";

import { ApplicationHeader } from "../main/application-header.view.js";

describe("com.mgmtp.a12.widgets.application-header", () => {
	/**
	 * Rendering ApplicationHeader
	 */
	test("rendering-application-header", () => {
		const { container } = render(
			<ApplicationHeader
				leftSlots={[<span>Logo</span>, <span>Widgets Showcase</span>]}
				rightSlots={[<span>Version: X.XX</span>]}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Rendering ApplicationHeader with all properties.
	 * - ApplicationHeader should have all properties as passed in.
	 */
	test("rendering-application-header-props", () => {
		const id = "test-id";
		const className = "test-class";
		const { container } = render(
			<ApplicationHeader
				leftSlots={[<span>Logo</span>, <span>Widgets Showcase</span>]}
				rightSlots={[<span>Version: X.XX</span>]}
				id={id}
				className={className}
				style={{ color: "red" }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});
