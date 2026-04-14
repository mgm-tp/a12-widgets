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

import type { ReactElement } from "react";
import { useState, useRef, useCallback } from "react";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { Autocomplete, Link, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const ITEMS = [
	"John Doe",
	"Paul Walters",
	"Lola Sporer",
	"Malcolm Spencer",
	"Naomi Jones",
	"Christoper Kunde",
	"Katelynn Schmidt",
	"Hubert Davis",
	"Vito Spencer",
	"Kathryn Bernier",
	"Stephania Lockman",
	"Michaela Monahan",
	"Westley Fahey",
	"Stevie Kerluke",
	"Clinton Marquardt",
	"Casandra Huel",
	"Leora Howe"
];

export function AutocompleteWithLinkItemsShowcase(): ReactElement {
	const [selectedValue, setSelectedValue] = useState<string>("Lola Sporer");
	const closeDropdownHandler = useRef<() => void>(undefined);

	const handleOnValueChange = useCallback((value: string | DropDownItem): void => {
		setSelectedValue(typeof value === "string" ? value : value.label);
	}, []);

	const getCloseDropdownHandler = useCallback((handler: () => void) => {
		closeDropdownHandler.current = handler;
	}, []);

	const assignToMe = useCallback(() => {
		setSelectedValue("John Doe");
		closeDropdownHandler.current?.();
	}, []);

	const removeAssignment = useCallback(() => {
		setSelectedValue("");
		closeDropdownHandler.current?.();
	}, []);

	return (
		<Autocomplete
			id="autocomplete-with-link-items"
			label="Assignee"
			inputPlaceHolder="Not assigned"
			hintTemplate=""
			onValueChange={handleOnValueChange}
			items={ITEMS}
			value={selectedValue}
			closeAndResetOption={getCloseDropdownHandler}
			links={[
				<Link useAsButton onClick={assignToMe}>
					Assign to me
				</Link>,
				<Link useAsButton onClick={removeAssignment}>
					<Icon>person_remove</Icon> Remove assignment
				</Link>
			]}
			prefixes={<Icon>account_circle</Icon>}
		/>
	);
}
