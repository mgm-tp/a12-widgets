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

import { CUSTOM_ICONS } from "../../../icon/main/custom-icons-data.js";
import { MATERIAL_ICONS } from "../../../icon/main/material-icons-data.js";
import type { IconTheme } from "../../../icon/index.js";

import type { IconPickerProps } from "./icon-picker.api.js";

const ORIGINAL_ICONS: string[] = [...Object.keys(CUSTOM_ICONS), ...MATERIAL_ICONS];

export namespace IconPickerUtils {
	const NUMBER_OF_ICONS = 50;

	export function getIconLabel(icon?: IconPickerProps.Icon): string {
		return icon ? `${icon.label}${icon.theme ? ` (${icon.theme})` : ""}` : "";
	}

	export function isDifferentIcons(
		icon1: IconPickerProps.Icon | undefined,
		icon2: IconPickerProps.Icon | undefined
	): boolean {
		if (icon1 && icon2) {
			return icon1?.label !== icon2.label || icon1.theme !== icon2.theme;
		}

		return (!!icon1 && !icon2) || (!icon1 && !!icon2);
	}

	export function filterIconByName(searchText: string, selectedIcon?: IconPickerProps.Icon): IconPickerProps.Icon[] {
		let filteredIcons = ORIGINAL_ICONS;

		if (searchText !== "") {
			const lowerCase = (value: string): string => value.toLocaleLowerCase();
			filteredIcons = [
				...filteredIcons.filter((iconName) => lowerCase(iconName).startsWith(lowerCase(searchText))).sort(),
				...filteredIcons.filter(
					(iconName) =>
						!lowerCase(iconName).startsWith(lowerCase(searchText)) &&
						lowerCase(iconName).includes(lowerCase(searchText))
				)
			];
		} else {
			return Object.keys(CUSTOM_ICONS).map((icon) => ({ label: icon, theme: "custom" }));
		}

		const numberOfIcon = selectedIcon ? NUMBER_OF_ICONS - 1 : NUMBER_OF_ICONS;
		// first attempt to reduce the size of working set
		filteredIcons = filteredIcons.slice(0, numberOfIcon);
		const returnData: IconPickerProps.Icon[] = [];
		const themes: IconTheme[] = ["filled", "rounded", "outlined"];

		filteredIcons.forEach((icon) => {
			if (CUSTOM_ICONS[icon]) {
				returnData.push({ label: icon, theme: "custom" });
			}

			themes.forEach((theme) => {
				// ignore building the selected icon
				if (!MATERIAL_ICONS.includes(icon) || (icon === selectedIcon?.label && theme === selectedIcon.theme)) {
					return;
				}

				returnData.push({ label: icon, theme: theme });
			});
		});

		return returnData.slice(0, numberOfIcon);
	}
}
