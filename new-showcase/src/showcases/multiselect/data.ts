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

import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core";

export const ITEMS: MultiselectProps.Item[] = [
	{
		id: "1",
		label: "Java"
	},
	{
		id: "2",
		label: "Groovy"
	},
	{
		id: "3",
		label: "JavaScript"
	},
	{
		id: "4",
		label: "C++"
	},
	{
		id: "5",
		label: "C"
	},
	{
		id: "6",
		label: "Scala"
	},
	{
		id: "7",
		label: "Python"
	},
	{
		id: "8",
		label: "PHP"
	},
	{
		id: "9",
		label: "ActionScript"
	},
	{
		id: "10",
		label: "AppleScript"
	},
	{
		id: "11",
		label: "Asp"
	},
	{
		id: "12",
		label: "Clojure"
	},
	{
		id: "13",
		label: "COBOL"
	},
	{
		id: "14",
		label: "BASIC"
	},
	{
		id: "15",
		label: "ColdFusion"
	},
	{
		id: "16",
		label: "123"
	},
	{
		id: "17",
		label: "456"
	}
];

export function getItems(selectedIds: string[]): MultiselectProps.Item[] {
	return ITEMS.map((i) => (selectedIds.includes(i.id) ? { ...i, selected: true } : i));
}
