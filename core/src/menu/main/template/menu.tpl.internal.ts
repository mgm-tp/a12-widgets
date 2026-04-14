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

import { generateUid } from "../../../common/main/utils.js";

import type { MenuGroup, MenuItemType } from "../menu.api.js";
import { isMenuGroup } from "../menu.utils.js";

import type { FlattenedMenuItemType } from "./menu.tpl.api.js";

export namespace MenuTplUtils {
	/**
	 * @internal
	 * This function is used to flatten group menu items, if any, and convert all deprecated `children` data into `items`.
	 */
	export function flattenToMenuItems(menu: MenuItemType[]): FlattenedMenuItemType[] {
		return menu.flatMap((item) => {
			if (!isMenuGroup(item)) {
				const { children, items, ...restOfItem } = item;
				const subItems = items || children;

				return {
					...restOfItem,
					items: subItems && flattenToMenuItems(subItems)
				};
			}

			const group: MenuGroup = { ...item, id: item.id ?? generateUid() };

			return group.items?.map((groupItem) => {
				const subItems = groupItem.items || groupItem.children;

				return {
					...groupItem,
					group,
					items: subItems && flattenToMenuItems(subItems)
				};
			});
		});
	}

	/**
	 * @internal
	 * This function is used to calculate the position of the badge related to the menu type.
	 */
	export const getBadgePosition = ({
		hasNonLabel,
		subLayer,
		isVertical,
		badgeHeight,
		badgeRightPos,
		tinyBadgeHeight,
		tinyBadgeWidth
	}: {
		hasNonLabel?: boolean;
		subLayer?: boolean;
		isVertical?: boolean;
		badgeHeight: string;
		badgeRightPos: string;
		tinyBadgeHeight: string;
		tinyBadgeWidth: string;
	}) => {
		const badgePosition: { top: string; right?: string; margin?: string } = {
			top: `calc(${badgeHeight} * (${subLayer || isVertical ? -0.75 : -0.7}))`,
			right: hasNonLabel ? `calc(${badgeRightPos} / 2)` : badgeRightPos,
			margin: subLayer || (isVertical && !hasNonLabel) ? `calc(${badgeHeight} / 3) 0` : undefined
		};

		if (isVertical && hasNonLabel) {
			badgePosition.top = `calc(${badgeHeight} * (-1))`;
			badgePosition.right = "0";
		}

		const tinyBadgePosition = {
			top: `calc(${tinyBadgeHeight} * (-0.5))`,
			right: `calc(${tinyBadgeWidth} * (-0.5))`
		};

		return { badgePosition, tinyBadgePosition };
	};
}
