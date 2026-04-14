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
import { useRef, useState, useCallback } from "react";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { Autocomplete } from "@com.mgmtp.a12.widgets/widgets-core";

import { ITEMS } from "./data.js";

function filterItems(items: string[], filterText: string): string[] {
	const toLowerCase = (value: string): string => value.toLocaleLowerCase();

	return [
		...items.filter((i) => toLowerCase(i).startsWith(toLowerCase(filterText))).sort(),
		...items.filter(
			(i) => !toLowerCase(i).startsWith(toLowerCase(filterText)) && toLowerCase(i).includes(toLowerCase(filterText))
		)
	];
}

export function AutocompleteAsynchronousRequestsShowcase(): ReactElement {
	const asyncSearch = useRef<number | undefined>(undefined);
	const [selectedValue, setSelectedValue] = useState("");
	const [items, setItems] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handleOnValueChange = useCallback((value: string | DropDownItem) => {
		if (typeof value === "string") {
			setSelectedValue(value);
		} else {
			setSelectedValue(value.label);
		}
	}, []);

	const handleOnSearch = useCallback((value: string) => {
		clearTimeout(asyncSearch.current);
		setLoading(true);
		asyncSearch.current = window.setTimeout(() => {
			setLoading(false);
			setItems(filterItems(ITEMS, value));
		}, 1500);
	}, []);

	return (
		<div className="-u-width-full">
			<p>
				Selected value will display here:{" "}
				<strong>
					<em>{selectedValue}</em>
				</strong>
			</p>
			<Autocomplete
				hintTemplate="{count} matches"
				id="autocomplete-async"
				onValueChange={handleOnValueChange}
				items={items}
				onSearch={handleOnSearch}
				loading={loading}
				loadingLabel="Loading..."
				inputPlaceHolder="Please select or start typing"
				label="Asynchronous"
			/>
		</div>
	);
}
