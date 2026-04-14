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

import type { DropDownItem } from "../../dropdown/main/template/dropdown.tpl.api.js";
import { StringUtils } from "../../common/main/utils.js";

export interface TagInternalProps {
	text: string;
	id: string;
	isFocus: boolean;
}

/**@internal*/
export function filterTags(tags: string[], filterText: string): string[] {
	const lowerCaseText = (value: string): string => value.toLocaleLowerCase();

	return filterText
		? tags.filter((tag) => {
				return (
					lowerCaseText(tag).startsWith(lowerCaseText(filterText)) ||
					lowerCaseText(tag).includes(lowerCaseText(filterText))
				);
			})
		: tags;
}

/**@internal*/
export function filterUsedTags(
	tags: string[],
	tagsToFilter: TagInternalProps[],
	type: string,
	shouldSortTags?: boolean
): DropDownItem[] {
	const sortedTags = shouldSortTags ? StringUtils.sortIgnoreCase(tags) : tags;
	const filteredTags: DropDownItem[] = sortedTags.map((tag) => {
		const usedTag = tagsToFilter.find((createdTag) => {
			return createdTag.text ? createdTag.text === tag : false;
		});
		const id = tag.trim().split(" ").join("-") + "-" + type;

		return usedTag
			? { label: tag, disabled: true, id, dataType: "tag-disabled" }
			: {
					label: tag,
					id,
					tabIndex: 0
				};
	});

	const unusedTags = filteredTags.filter((tag) => !tag.disabled);
	const usedTags = filteredTags.filter((tag) => tag.disabled);

	return [...unusedTags, ...usedTags];
}

/**@internal*/
export function unFocusAllTags(tags: TagInternalProps[]): TagInternalProps[] {
	return tags.map((tag) => (tag.isFocus ? { ...tag, isFocus: false } : tag));
}

/**@internal*/
export function getCreationKey(keys: string[], value: string): string | undefined {
	if (!value) {
		return undefined;
	}

	return keys.find((key) => value.includes(key)) || undefined;
}

/**@internal*/
export function getFocusedTag(tags: TagInternalProps[]): TagInternalProps | undefined {
	return tags.find((tag) => tag.isFocus);
}

/**@internal*/
export function createDataTag(value: string, isFocus: boolean): TagInternalProps {
	return {
		text: value.trim(),
		id: StringUtils.hyphenate(value),
		isFocus
	};
}

/**@internal*/
export function createDataTags(values: string[]): TagInternalProps[] {
	const filteredValues = values.filter((val) => !!val.trim());

	return filteredValues.map((val) => {
		return createDataTag(val, false);
	});
}

/**@internal*/
export function getCurrentSelectedIndex(items: DropDownItem[], selectedItem: DropDownItem | undefined): number {
	if (items.every((item) => !!item.disabled) || !selectedItem) {
		return -1;
	}

	return items.findIndex((item) => item.label === selectedItem.label);
}
