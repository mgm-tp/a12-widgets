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

import { LoginLayout } from "../main/login-layout.view.js";

describe("com.mgmtp.a12.widgets.layout.login-layout", () => {
	const testProps = {
		id: "test-id",
		className: "test-class",
		style: { color: "hotpink" }
	};

	test("rendering-login-layout", () => {
		const child = "Children";
		const { container } = render(<LoginLayout {...testProps}>{child}</LoginLayout>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-fullscreen-login-layout", () => {
		const { container } = render(<LoginLayout fullscreen>Children</LoginLayout>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-fullscreen-login-layout", () => {
		const { container } = render(<LoginLayout mobile>Children</LoginLayout>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-noGutter-login-layout", () => {
		const { container } = render(<LoginLayout noGutter>Children</LoginLayout>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-layout-with-background", () => {
		const bgImage = "background image";
		const { container } = render(<LoginLayout backgroundImage={bgImage}>Children</LoginLayout>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-container", () => {
		const child = "container";
		const { container } = render(
			<LoginLayout.Container {...testProps} secondary>
				{child}
			</LoginLayout.Container>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-logo", () => {
		const logo = "Login layout logo";
		const { container } = render(<LoginLayout.Logo {...testProps}>{logo}</LoginLayout.Logo>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-headline", () => {
		const headline = "Login layout headline";
		const { container } = render(<LoginLayout.Headline {...testProps}>{headline}</LoginLayout.Headline>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-headline-ariaLevel", () => {
		const { container } = render(<LoginLayout.Headline ariaLevel={2}>headline</LoginLayout.Headline>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-form", () => {
		const child = "Login layout form child";
		const { container } = render(<LoginLayout.Form {...testProps}>{child}</LoginLayout.Form>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-form-item", () => {
		const child = "Login layout form item child";
		const { container } = render(<LoginLayout.FormItem {...testProps}>{child}</LoginLayout.FormItem>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-login-footer", () => {
		const footer = "footer";
		const { container } = render(<LoginLayout.Footer {...testProps}>{footer}</LoginLayout.Footer>);

		expect(container.firstChild).toMatchSnapshot();
	});
});
