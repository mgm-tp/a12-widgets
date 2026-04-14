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

import { render, getByDataRole } from "test-utils";
import { describe, expect, test } from "vitest";

import { Button } from "../../button/main/button.view.js";
import { getA11yResource } from "../../common/main/a11y-localization/language-context.js";

import { MessageBox } from "../main/message-box.view.js";

describe("com.mgmtp.a12.widgets.message-box", () => {
	const a11yTitles = getA11yResource("en").messageBoxTitles;
	const label = "The specified attribute is not between the expected value of 0 and 100.";
	const button = <Button label="SHOW DETAILS" />;

	test("default-message-box", () => {
		const { container } = render(<MessageBox label={label}>Test error message line</MessageBox>);
		expect(container.firstChild).toMatchSnapshot();
		expect(getByDataRole(container, "hidden-text").firstChild?.textContent).toBe(a11yTitles?.errorElement);
	});

	test("rendering-message-box-with-variant-warning", () => {
		const { container } = render(
			<MessageBox label={label} variant="warning" action={button}>
				Test warning message line
			</MessageBox>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-message-box-with-variant-info", () => {
		const { container } = render(
			<MessageBox label={label} variant="info" action={button}>
				Test info message line
			</MessageBox>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-message-box-with-variant-success", () => {
		const { container } = render(
			<MessageBox label={label} variant="success" action={button}>
				Test success message line
			</MessageBox>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-icon-as-passed-in", () => {
		const { container } = render(
			<MessageBox label={label} variant="success" action={button} icon="icon">
				Test success message line
			</MessageBox>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});
