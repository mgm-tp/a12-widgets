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

import { render, fireEvent, getByAltText } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { ResponsiveImageContainer } from "../main/responsive-image-container.view.js";

describe("com.mgmtp.a12.widgets.responsive-image-container", () => {
	/**
	 * Rendering an Image component.
	 */
	test("rendering-a-responsive-image-container", () => {
		const { container } = render(<ResponsiveImageContainer src="image-path" alt="Sample Image" />);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Rendering ResponsiveImageContainer without alt.
	 *  - Img tag should have empty 'alt' if no alt is provided.
	 */
	test("rendering-a-responsive-image-container-without-alt", () => {
		const { container } = render(<ResponsiveImageContainer src="image-path" />);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Simulating button click event:
	 *  - If a onCLick event is defined, then it is called at a click on the img tag
	 */
	test("simulating-click-event", () => {
		const onClickEvent = vi.fn();

		const { container } = render(<ResponsiveImageContainer alt="test-image" src="image-path" onClick={onClickEvent} />);
		const image = getByAltText(container, "test-image");
		fireEvent.click(image);

		expect(onClickEvent).toBeCalled();
	});
});
