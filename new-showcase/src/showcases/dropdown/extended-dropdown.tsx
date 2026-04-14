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
import { styled, css } from "styled-components";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { Checkbox, DropDown, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";
import { Text } from "../../helpers/text-generator.js";

const CustomSecondaryText = styled.span(({ theme }) => {
	return css`
		[data-role="plasma-icon"] {
			font-size: ${theme.typography.fontSize.nanoFontSize};
			vertical-align: middle;
			margin-bottom: 2px;
		}
	`;
});

const ITEMS: DropDownItem[] = [
	{
		label: "Cost Report"
	},
	{
		label: `Cost Report with ${Text.WORD}`,
		id: "section-1-1",
		children: [
			{
				label: "Costs",
				secondaryText: (
					<CustomSecondaryText>
						&hellip; <Icon>chevron_right</Icon> {`General Data with ${Text.SENTENCE}`}
					</CustomSecondaryText>
				)
			},
			{
				label: "Insurance Company",
				secondaryText: (
					<CustomSecondaryText>
						&hellip; <Icon>chevron_right</Icon> General Data
					</CustomSecondaryText>
				)
			},
			{
				label: `Client with ${Text.SENTENCE}`,
				secondaryText: (
					<CustomSecondaryText>
						&hellip; <Icon>chevron_right</Icon> Partner
					</CustomSecondaryText>
				)
			},
			{
				label: "Insurance Company",
				secondaryText: (
					<CustomSecondaryText>
						&hellip; <Icon>chevron_right</Icon> Partner
					</CustomSecondaryText>
				)
			},
			{
				label: "Disabled item",
				secondaryText: (
					<CustomSecondaryText>
						&hellip; <Icon>chevron_right</Icon> Disabled secondary text
					</CustomSecondaryText>
				),
				disabled: true
			}
		]
	},
	{
		label: "Offer",
		id: "section-1-2",
		children: [
			{
				label: "Coverage"
			},
			{
				label: "Clauses",
				disabled: true
			}
		]
	},
	{
		label: "Policy",
		id: "section-1-3",
		children: [
			{
				label: "Coverage"
			},
			{
				label: "Clauses"
			}
		]
	}
].map((item: DropDownItem, index) => {
	item.value = `value ${index}`;
	item.tabIndex = 0;

	if (item.children?.length) {
		for (const childIndex in item.children) {
			item.children[childIndex].value = `value ${index} ${childIndex}`;
			item.children[childIndex].tabIndex = 0;
		}
	}

	return item;
});

export function ExtendedDropdownShowcase(): ReactElement {
	const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);
	const [lightBackground, setLightBackground] = useState<boolean>(false);

	const getDataLength = (data: DropDownItem[]): number => {
		let length = data.length;
		data.forEach((item: DropDownItem) => {
			if (item.children) {
				length = length - 1 + item.children.length;
			}
		});

		return length;
	};

	return (
		<ConfigurationView
			reportLabel="WithLinkItems"
			configuration={
				<Checkbox
					fitToParent={false}
					checked={lightBackground}
					label="Light Background"
					onChange={() => setLightBackground(!lightBackground)}
				/>
			}
			useDarkBackground
		>
			<DropDown
				hint={`${getDataLength(ITEMS)} of ${getDataLength(ITEMS)} options shown`}
				items={ITEMS}
				lightBackground={lightBackground}
				onSelectedItemChange={setSelectedItem}
				selectedItem={selectedItem}
			/>
		</ConfigurationView>
	);
}
