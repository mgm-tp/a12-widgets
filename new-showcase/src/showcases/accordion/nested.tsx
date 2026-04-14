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
import { isValidElement } from "react";

import type { MenuItem, MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core";
import { Accordion, isMenuGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const { Container, Section, Summary, Details } = Accordion;

const menuItems: MenuItem[] = [
	{
		label: "1",
		className: "additional-class",
		items: [
			{
				label: "1.1",
				className: "additional-class",
				icon: <Icon>cake</Icon>
			},
			{ label: "1.2", icon: <Icon>card_giftcard</Icon> },
			{
				label: "1.3",
				icon: <Icon>local_florist</Icon>,
				disabled: true
			}
		],
		icon: <Icon>dvr</Icon>
	},
	{ label: "2" },
	{
		label: "3",
		disabled: true
	},
	{
		label: "4 with a very long label that is too long to be able to fit on a single line",
		items: [
			{
				label: "First",
				disabled: true
			},
			{
				label: "Second",
				items: [{ label: "2.1st Menu", selected: true }, { label: "2.2nd Menu" }]
			},
			{
				label: "K Menu",
				items: [
					{ label: "A Menu" },
					{ label: "B Menu" },
					{ label: "C Menu" },
					{ label: "D Menu" },
					{ label: "E Menu" },
					{ label: "F Menu" }
				]
			}
		]
	},
	{ label: "", icon: <Icon>settings</Icon>, title: "Settings" },
	{
		label: "Z Menu",
		icon: <Icon>screen_lock_portrait</Icon>,
		items: [
			{
				label: "Z.1 Menu"
			},
			{
				label: "Z.2 Menu",
				disabled: true
			},
			{
				label: "Z.3 Menu",
				disabled: true
			}
		]
	}
];

export function NestedAccordion(): ReactElement {
	function mapToSection(items: MenuItemType[]): ReactElement {
		return (
			<>
				{items.map((item, index) => {
					let detail = null;

					if (isValidElement(item.items)) {
						detail = item.items;
					} else if (item.items && item.items.length > 1) {
						detail = mapToSection(item.items);
					}

					return (
						!isMenuGroup(item) && (
							<Section
								key={index}
								selected={item.label === "2"}
								expanded={
									item.label === "4 with a very long label that is too long to be able to fit on a single line" ||
									item.label === "Second"
								}
							>
								<Summary graphic={item.icon}>{item.label}</Summary>
								<Details>{detail}</Details>
							</Section>
						)
					);
				})}
			</>
		);
	}

	return (
		<div style={{ width: 300 }}>
			<Container>{mapToSection(menuItems)}</Container>
		</div>
	);
}
