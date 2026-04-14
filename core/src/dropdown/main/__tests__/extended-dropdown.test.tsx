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

import { render, getAllByDataRole } from "test-utils";
import { describe, expect, test } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";

import { DropDown } from "../template/dropdown.tpl.view.js";
import type { DropDownItem } from "../template/dropdown.tpl.api.js";

const items: DropDownItem[] = [
	{
		label: "Cost Report"
	},
	{
		label: "Cost Report with something",
		children: [
			{
				label: "Costs",
				secondaryText: "Secondary text"
			},
			{
				label: "Insurance Company"
			}
		],
		secondaryText: "Section Secondary Text",
		className: "section-class",
		id: "section-id",
		style: { color: "red" }
	},
	{
		label: "Offer",
		children: [
			{
				label: "Coverage"
			},
			{
				label: "Clauses"
			}
		]
	}
];

describe("com.mgmtp.a12.widgets.extended-dropdown", () => {
	test("extended-dropdown", () => {
		const { container } = render(<DropDown items={items} />);
		const dropdownSectionItems = getAllByDataRole(container, DataRoles.Dropdown.SectionItem);

		expect(container.firstChild).toMatchSnapshot();
		expect(dropdownSectionItems.length).toBe(2);
	});
});
