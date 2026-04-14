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

import { Pagination } from "../../pagination/main/pagination.view.js";
import { QuickAccessButton } from "../../quick-access-button/main/quick-access-button.view.js";
import { noop } from "../../common/main/utils.js";

import { ValidationBar } from "../main/validation-bar.view.js";

describe("com.mgmtp.a12.widgets.validation-bar.view", () => {
	test("rendering-default-validation-bar", () => {
		const { container } = render(<ValidationBar />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-validation-bar-with-title", () => {
		const { container } = render(<ValidationBar primaryTitle="Primary Title" secondaryTitle="Secondary Title" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-warning-validation-bar", () => {
		const { container } = render(<ValidationBar variant="warning" />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-warning-validation-bar-with-content", () => {
		const contentHTML = "Content";
		const { container } = render(<ValidationBar>{contentHTML}</ValidationBar>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-info-validation-bar", () => {
		const { container } = render(<ValidationBar variant="info" />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-validation-bar-with-quick-access-menu-and-pagination", () => {
		const { container } = render(
			<ValidationBar
				quickAccessMenu={<QuickAccessButton>Quick Access Menu</QuickAccessButton>}
				pagination={
					<Pagination
						currentPage={3}
						onPageChanged={noop}
						pageCount={10}
						pageLabelTemplate="{page} / {total}"
						type="simple"
					/>
				}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
