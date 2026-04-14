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

import type { ReactNode } from "react";
import { useState, useCallback, useRef } from "react";

import { Autocomplete } from "../../src/input/autocomplete/main/autocomplete.view.js";
import type { DropDownItem } from "../../src/dropdown/main/template/dropdown.tpl.api.js";

export const ExampleAutoComplete = ({ items }: { items: string[] | DropDownItem[] }): ReactNode => {
	const [selectedValue, setSelectedValue] = useState<string>();

	const handleOnValueChange = useCallback((value: string): void => {
		setSelectedValue(value);
	}, []);

	return (
		<Autocomplete
			id="autocomplete-basic"
			label="Location"
			inputPlaceHolder="Please select or start typing"
			hintTemplate="{count} matches"
			onValueChange={handleOnValueChange}
			items={items}
			value={selectedValue}
		/>
	);
};

function filterItems(items: string[], filterText: string): string[] {
	const toLowerCase = (value: string): string => value.toLocaleLowerCase();

	return [
		...items.filter((i) => toLowerCase(i).startsWith(toLowerCase(filterText))).sort(),
		...items.filter(
			(i) => !toLowerCase(i).startsWith(toLowerCase(filterText)) && toLowerCase(i).includes(toLowerCase(filterText))
		)
	];
}

export const ExampleAsynchronousAutoComplete = ({
	itemsProps,
	timeout
}: {
	itemsProps: string[];
	timeout: number;
}): ReactNode => {
	const asyncSearch = useRef<number | undefined>(undefined);
	const [selectedValue, setSelectedValue] = useState("");
	const [items, setItems] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handleOnSearch = (value: string) => {
		clearTimeout(asyncSearch.current);
		setLoading(true);
		asyncSearch.current = window.setTimeout(() => {
			setLoading(false);
			setItems(filterItems(itemsProps, value));
		}, timeout);
	};

	const handleOnValueChange = (value: string): void => {
		setSelectedValue(value);
	};

	return (
		<Autocomplete
			hintTemplate="{count} matches"
			id="autocomplete-async"
			items={items}
			onSearch={handleOnSearch}
			loading={loading}
			loadingLabel="Loading..."
			inputPlaceHolder="Please select or start typing"
			label="Asynchronous"
			onValueChange={handleOnValueChange}
			value={selectedValue}
		/>
	);
};
