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
import { describe, vi, expect, test } from "vitest";

import type { Variant } from "../../main/common/toast.common.api.js";
import { ConnectedToastTemplate } from "../../main/connected-toast/template/connected-toast.template.view.js";

describe("com.mgmtp.a12.widgets.connected-toast.template", () => {
	test("render connected toast template with id, className and style", () => {
		const id = "id";
		const customClass = "class";
		const style = { fontSize: "10px" };
		const { container } = render(<ConnectedToastTemplate id={id} className={customClass} style={style} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render with wrapperRef", () => {
		const wrapperRef = vi.fn();
		render(<ConnectedToastTemplate wrapperRef={wrapperRef} />);
		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});

	test("render class and icon matching with the variant", () => {
		const variantsAndIcons: { variant: Variant; icon: string }[] = [
			{ variant: "info", icon: "info" },
			{ variant: "success", icon: "check_circle" },
			{ variant: "warning", icon: "warning" },
			{ variant: "error", icon: "error" }
		];

		for (const i of variantsAndIcons) {
			const { container } = render(<ConnectedToastTemplate variant={i.variant} />);
			expect(container.firstChild).toMatchSnapshot();
		}
	});

	test("render with the message", () => {
		const message = "Message";
		const { container } = render(<ConnectedToastTemplate message={message} />);
		expect(container.firstChild).toMatchSnapshot();
	});
});
