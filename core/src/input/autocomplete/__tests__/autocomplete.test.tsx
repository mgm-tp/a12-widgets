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

import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect } from "vitest";

import { Icon } from "../../../icon/main/icon.view.js";
import { Link } from "../../../link/main/link/link.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { Autocomplete } from "../main/autocomplete.view.js";

import { inputProps } from "./data.js";

describe("com.mgmtp.a12.widgets.autocomplete", () => {
	test("render basic autocomplete", () => {
		const { container } = render(<Autocomplete {...inputProps} />);
		const input = getByDataRole(container, DataRoles.Textline.Input);

		expect(container.firstChild).toMatchSnapshot();

		fireEvent.click(input);
		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});

	test("render autocomplete with link options", () => {
		const { container } = render(
			<Autocomplete
				id={inputProps.id}
				label="Autocomplete with Links"
				hintTemplate={inputProps.hintTemplate}
				items={inputProps.items}
				links={[
					<Link>Assign to me</Link>,
					<Link>
						<Icon>person_remove</Icon> Remove assignment
					</Link>
				]}
			/>
		);

		const input = getByDataRole(container, DataRoles.Textline.Input);
		fireEvent.click(input);

		const portal = getByDataRole(container, DataRoles.AttachedPortal);
		expect(portal).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
