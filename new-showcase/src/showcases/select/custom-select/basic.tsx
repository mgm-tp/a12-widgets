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

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Key } from "ts-key-enum";
import { css, styled } from "styled-components";

import { CustomSelect, Icon, StyledIconWrapper } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { items, customItems, itemsWithEmpty } from "../data.js";

const ShowcaseStyledRichLabel = styled.div(({ theme }) => {
	const { spacing } = theme;

	return css`
		display: flex;
		align-items: center;
		margin: ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0;
		gap: 12px;

		${StyledIconWrapper} {
			color: inherit;
		}
	`;
});

export const BasicCustomSelect: FC = () => {
	const [value, setValue] = useState<string>("Avocado");
	const [optionGroupValue, setOptionGroupValue] = useState<string>("Java");
	const [emptyValueItem, setEmptyValueItem] = useState<string>("Empty");
	const [richLabelValue, setRichLabelValue] = useState<string>("Avocado");

	const descriptions: Record<string, string> = {
		Avocado: "Rich in healthy fats and fiber",
		Chestnut: "Sweet and nutty flavor profile",
		"Dragon fruit": "Exotic tropical superfruit",
		Grape: "Perfect for wines and snacking",
		Grapefruit: "Tangy citrus with vitamin C"
	};

	const icons: Record<string, string> = {
		Avocado: "eco",
		Chestnut: "nature",
		"Dragon fruit": "local_fire_department",
		Grape: "wine_bar",
		Grapefruit: "wb_sunny"
	};

	const multiLineLabelRenderer = (item: DropDownItem): ReactNode => {
		const itemValue: string = item.value || "";

		return (
			<ShowcaseStyledRichLabel>
				<Icon>{icons[itemValue]}</Icon>
				<div>
					<span>{item.label} - </span>
					<span className="-u-italic">{descriptions[itemValue]}</span>
				</div>
			</ShowcaseStyledRichLabel>
		);
	};

	return (
		<div className="-u-width-full">
			<CustomSelect
				id="standard-custom-select"
				label="Standard Custom Select"
				placeholder="Please choose..."
				items={items}
				value={value}
				onValueChanged={setValue}
			/>
			<br />
			<CustomSelect
				id="custom-select-option-group-keys"
				label="Custom Select with group options"
				placeholder="Please choose..."
				items={customItems}
				value={optionGroupValue}
				onValueChanged={setOptionGroupValue}
				helperText="This Custom Select also uses option groups to group related items."
			/>
			<br />
			<CustomSelect
				id="custom-select-custom-keys"
				label="Custom Select with custom open/close command keys"
				placeholder="Please choose..."
				items={items}
				value={value}
				onValueChanged={setValue}
				keysToOpen={[Key.Control]}
				keysToClose={[Key.Delete, Key.Backspace]}
			/>
			<br />
			<CustomSelect
				id="custom-select-with-empty-value"
				label="Custom Select with Empty Value Item"
				placeholder="Please choose..."
				items={itemsWithEmpty}
				value={emptyValueItem}
				onValueChanged={setEmptyValueItem}
				helperText="Select 'Empty' to see the empty value styling"
			/>
			<br />
			<CustomSelect
				id="custom-select-with-rich-label"
				label="Custom Select with rich label content"
				items={items.slice(0, 5)}
				value={richLabelValue}
				onValueChanged={setRichLabelValue}
				labelRenderer={multiLineLabelRenderer}
			/>
		</div>
	);
};
