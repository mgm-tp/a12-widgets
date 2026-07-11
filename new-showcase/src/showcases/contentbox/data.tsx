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

import { faker as Faker } from "@faker-js/faker/locale/en";

import { Range, provider, ResponsiveImageContainer } from "@com.mgmtp.a12.widgets/widgets-core";
import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core";

export const ROWS_COUNT = 500;
export const ROWS_PER_PAGE = 25;

export const TABLE_COLUMNS: BaseColumnType[] = [
	{ label: "Title", pinning: !provider.isDesktop() ? undefined : "left" },
	{ label: "Author", fixedWidth: true },
	{ label: "Photo", fixedWidth: true, width: 0.6 },
	{ label: "Genre", fixedWidth: true },
	{ label: "Publisher" },
	{ label: "Year", fixedWidth: true },
	{ label: "Rating", fixedWidth: true },
	{ label: "Format", fixedWidth: true },
	{ label: "Language", fixedWidth: true },
	{ label: "Availability", fixedWidth: true },
	{ label: "Condition", fixedWidth: true },
	{ label: "Category", fixedWidth: true },
	{ label: "Price", fixedWidth: true, pinning: "right", width: !provider.isDesktop() ? 0.7 : 1 }
];

const GENRES = [
	"Fantasy",
	"Crime",
	"Fiction",
	"Science",
	"Romance",
	"Mystery",
	"Horror",
	"Thriller",
	"Biography",
	"History"
];
const FORMATS = ["Hardcover", "Paperback", "Ebook", "Audiobook"];
const LANGUAGES = ["English", "German", "French", "Vietnamese"];
const AVAILABILITIES = ["In Stock", "Out of Stock", "Pre-order"];
const CONDITIONS = ["New", "Used", "Like New"];
const CATEGORIES = [
	"Fiction",
	"Science",
	"Art",
	"History",
	"Biography",
	"Children",
	"Technology",
	"Self-Help",
	"Travel",
	"Cooking"
];
const YEARS = Array.from({ length: 20 }, (_, i) => String(2005 + i));

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const toTitleCase = (str: string): string =>
	str
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");

const generateTableCell = (colIndex: number, rowIndex: number): any => {
	switch (colIndex) {
		case 0:
			return toTitleCase(Faker.lorem.words(Math.floor(Math.random() * 3) + 2));
		case 1:
			return `${Faker.person.firstName()} ${Faker.person.lastName()}`;
		case 2:
			return (
				<ResponsiveImageContainer
					src={`images/user_avatar_${1 + Math.floor(Math.random() * 9)}.png`}
					alt={`Book cover ${rowIndex}`}
				/>
			);
		case 3:
			return pickRandom(GENRES);
		case 4:
			return Faker.company.name();
		case 5:
			return pickRandom(YEARS);
		case 6:
			return (Math.round((3 + Math.random() * 2) * 10) / 10).toFixed(1);
		case 7:
			return pickRandom(FORMATS);
		case 8:
			return pickRandom(LANGUAGES);
		case 9:
			return pickRandom(AVAILABILITIES);
		case 10:
			return pickRandom(CONDITIONS);
		case 11:
			return pickRandom(CATEGORIES);
		default:
			return `$${(9.99 + Math.random() * 40).toFixed(2)}`;
	}
};

export const createTableData = (rowCount = ROWS_COUNT, columns = TABLE_COLUMNS): any[] => {
	return Array.from(new Range(rowCount)).map((_, rowIndex) => {
		return Array.from(new Range(columns.length)).map((__, colIndex) => {
			return generateTableCell(colIndex, rowIndex);
		});
	});
};

export const updateOrAddFilter = <T extends { id: string }>(filters: T[], updatedFilter: T): T[] => {
	const existingIndex = filters.findIndex((f) => f.id === updatedFilter.id);

	if (existingIndex !== -1) {
		return filters.map((f, i) => (i === existingIndex ? updatedFilter : f));
	}

	return [...filters, updatedFilter];
};
