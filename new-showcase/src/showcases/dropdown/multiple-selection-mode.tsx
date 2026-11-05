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
import { useState } from "react";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { DropDown } from "@com.mgmtp.a12.widgets/widgets-core";

/** The caller's own model, which the options carry as `data` and hand back untouched. */
interface Language {
	id: string;
	name: string;
}

const languages: Language[] = [
	{ id: "ts", name: "TypeScript" },
	{ id: "js", name: "JavaScript" },
	{ id: "java", name: "Java" },
	{ id: "kotlin", name: "Kotlin" },
	{ id: "python", name: "Python" },
	{ id: "go", name: "Go" }
];

const SELECT_ALL = "select-all";

export function MultipleSelectionModeShowcase(): ReactElement {
	const [selected, setSelected] = useState<Language[]>([languages[0]!]);

	const allSelected = selected.length === languages.length;
	// The option type carries the payload's type, which is what lets every callback hand `data` back.
	const options: DropDownItem<Language>[] = [
		{
			id: SELECT_ALL,
			label: "Select all",
			tabIndex: 0,
			selected: allSelected,
			// A partly made selection: the checkbox shows the mixed state for it.
			indeterminate: selected.length > 0 && !allSelected
		},
		...languages.map((language) => ({
			id: language.id,
			label: language.name,
			tabIndex: 0,
			data: language
		}))
	];

	return (
		<DropDown
			selectionMode="multiple"
			items={options}
			selectedItems={options.filter((option) => (option.data ? selected.includes(option.data) : allSelected))}
			getItemKey={(option) => option.id ?? option.label}
			onSelectionChange={(_selectedOptions, toggledOption) => {
				// The "select all" option carries no `data`, which is what tells it from the others.
				if (!toggledOption.data) {
					setSelected(allSelected ? [] : languages);

					return;
				}

				const language = toggledOption.data;
				setSelected((current) =>
					current.includes(language) ? current.filter((entry) => entry !== language) : [...current, language]
				);
			}}
		/>
	);
}
