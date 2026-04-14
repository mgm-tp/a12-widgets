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
import { useState, useCallback } from "react";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { Autocomplete, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const GROUPED_ITEMS: DropDownItem[] = [
	{
		label: "A",
		children: [{ label: "ActionScript" }, { label: "AppleScript" }, { label: "Asp" }]
	},
	{
		label: "B",
		children: [
			{
				label: "BASIC",
				secondaryText: (
					<span className="-sc-dropdown__secondary-text">
						&hellip; <Icon>chevron_right</Icon> General Data
					</span>
				)
			}
		]
	},
	{
		label: "C",
		children: [{ label: "C#" }, { label: "C++" }, { label: "Clojure" }, { label: "COBOL" }, { label: "ColdFusion" }]
	},
	{
		label: "E",
		children: [
			{
				label: "Erlang",
				secondaryText: (
					<span className="-sc-dropdown__secondary-text">
						&hellip; <Icon>chevron_right</Icon> Partner
					</span>
				)
			}
		]
	},
	{
		label: "F",
		children: [{ label: "Fortran" }]
	},
	{
		label: "G",
		children: [{ label: "Groovy" }]
	},
	{
		label: "H",
		children: [{ label: "Haskell" }]
	},
	{
		label: "J",
		children: [{ label: "Java" }, { label: "JavaScript" }]
	},
	{
		label: "L",
		children: [{ label: "Lisp" }]
	},
	{
		label: "P",
		children: [{ label: "Perl" }, { label: "PHP" }, { label: "Python" }]
	},
	{
		label: "R",
		children: [{ label: "Ruby" }]
	},
	{
		label: "S",
		children: [{ label: "Scala" }, { label: "Scheme" }]
	},
	{
		label: "T",
		children: [{ label: "TypeScript" }]
	},
	{
		label: "Offer",
		children: [{ label: "C++" }, { label: "JavaScript" }]
	}
].map((item: DropDownItem, index) => {
	item.value = `value ${index}`;

	if (item.children?.length) {
		for (const childIndex in item.children) {
			item.children[childIndex].value = `value ${index} ${childIndex}`;
		}
	}

	return item;
});

export function AutocompleteGroupedItemsShowcase(): ReactElement {
	const [selectedValue, setSelectedValue] = useState<DropDownItem>();
	const [items, setItems] = useState(GROUPED_ITEMS);

	const handleOnValueChange = useCallback((value: DropDownItem): void => {
		setSelectedValue(value);
	}, []);

	const filterItemRecursively = useCallback((filterText: string, items: DropDownItem[]): DropDownItem[] => {
		const result: DropDownItem[] = [];

		for (const item of items) {
			const checkText = item.label.toLocaleLowerCase();

			if (item.children && item.children.length > 0) {
				const childResult = filterItemRecursively(filterText, item.children);
				const newItem = JSON.parse(JSON.stringify(item));

				if (childResult.length > 0) {
					newItem.children = childResult;
					result.push(newItem);
				}
			} else if (checkText.startsWith(filterText)) {
				result.push(item);
			} else if (checkText.includes(filterText)) {
				result.push(item);
			}
		}

		return result;
	}, []);

	const filterItems = useCallback(
		(itemsToBeFiltered: DropDownItem[], filterText: string): DropDownItem[] => {
			if (filterText !== "") {
				return filterItemRecursively(filterText.toLocaleLowerCase(), itemsToBeFiltered);
			}

			return itemsToBeFiltered;
		},
		[filterItemRecursively]
	);

	const handleSearch = useCallback(
		(value: string): void => {
			setItems(filterItems(GROUPED_ITEMS, value));
		},
		[filterItems]
	);

	return (
		<Autocomplete
			id="autocomplete-grouped-items"
			label="Grouped Items"
			inputPlaceHolder="Please select or start typing"
			hintTemplate="{count} matches"
			items={items}
			value={selectedValue}
			onValueChange={handleOnValueChange}
			onSearch={handleSearch}
		/>
	);
}
