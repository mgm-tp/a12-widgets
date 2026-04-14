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

import { go } from "fuzzysort";

export class SearchComponent {
	static readonly default = new SearchComponent();

	private items: SearchItem[] = [];

	constructor() {
		this.reset = this.reset.bind(this);
		this.register = this.register.bind(this);
		this.search = this.search.bind(this);
	}

	reset(): void {
		this.items = [];
	}

	register(...searchItems: SearchItem[]): void {
		this.items.push(...searchItems);
	}

	search(text: string): SearchItem[] {
		const trimmedText = text.trim().toLowerCase();

		if (trimmedText) {
			const matchedTitles = this.searchWithoutHint(trimmedText);
			const matchedHints = this.searchWithHint(matchedTitles, trimmedText);
			const allMatched = matchedTitles.concat(matchedHints);

			return this.onlyUnique(allMatched).sort((item1: SearchItem, item2: SearchItem) => {
				if (item1.location !== item2.location) {
					return 0;
				}

				const title1 = item1.title.toLowerCase();
				const title2 = item2.title.toLowerCase();

				if (title1.startsWith(trimmedText) && !title2.startsWith(trimmedText)) {
					return -1;
				} else if (title2.startsWith(trimmedText) && !title1.startsWith(trimmedText)) {
					return 1;
				}

				return title1.localeCompare(title2);
			});
		}

		return this.items;
	}

	private searchWithoutHint(trimmedText: string): SearchItem[] {
		const result = go(trimmedText, this.items, { keys: ["title", "location"], threshold: -200 });

		return result.map((item) => item.obj);
	}

	private searchWithHint(matchedTitles: SearchItem[], trimmedText: string): SearchItem[] {
		const itemsWithHint = this.items.filter(
			(item) => item.hint && item.hint.length > 0 && !matchedTitles.find((resultItem) => resultItem === item)
		);
		const flattenItemsWithHint: {
			origin: SearchItem;
			hint: string;
		}[] = [];
		itemsWithHint.forEach((item) => {
			if (item.hint) {
				flattenItemsWithHint.push({
					origin: item,
					hint: item.hint.join(" ")
				});
			}
		});
		const result1 =
			go(trimmedText, flattenItemsWithHint, {
				key: "hint",
				limit: 20,
				threshold: -200
			}) || [];

		return result1.map((item) => item.obj.origin);
	}

	private onlyUnique(allMatched: SearchItem[]): SearchItem[] {
		const ret: SearchItem[] = [];
		allMatched.forEach((item) => {
			if (!ret.find((item1) => item1.link === item.link)) {
				ret.push(item);
			}
		});

		return ret;
	}
}

export interface SearchItem {
	title: string;
	link: string;
	text: string;
	hint?: string[];
	location?: string;
	label?: string;
}
