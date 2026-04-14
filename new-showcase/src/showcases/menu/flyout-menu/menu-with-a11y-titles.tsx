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

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledWrapper } from "./scroll-to-selected-item.js";

const longListItems: MenuItem[] = [
	{
		label: "1",
		children: [
			{
				label: "1.1",
				icon: <Icon>cake</Icon>
			},
			{ label: "1.2" },
			{
				label: "1.3",
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
		label: "4 with very long label that will not fit in there",
		children: [
			{
				label: "4.1",
				children: [{ label: "4.1.1" }, { label: "4.1.2", selected: true }]
			},
			{
				label: "4.2",
				disabled: true
			}
		]
	},
	{ label: "", icon: <Icon>settings</Icon>, title: "Settings" },
	{ label: "A Menu" },
	{ label: "B Menu" },
	{ label: "C Menu" },
	{ label: "D Menu" },
	{ label: "5 Menu" },
	{ label: "6 Menu" },
	{ label: "7 Menu" },
	{ label: "E Menu" },
	{ label: "F Menu" },
	{ label: "X Menu" },
	{ label: "T Menu" },
	{ label: "U Menu" },
	{ label: "V Menu" },
	{ label: "S Menu" },
	{ label: "Y Menu" },
	{
		label: "Z Menu",
		icon: <Icon>screen_lock_portrait</Icon>
	}
];

export function MenuWithA11yTitles(): ReactElement {
	return (
		<div className="-u-width-full">
			<div>
				Disabled:
				<ul>
					<li>
						<strong>1</strong> -&gt; <strong>1.3</strong>
					</li>
					<li>
						<strong>3</strong>
					</li>
					<li>
						<strong>4</strong> -&gt; <strong>4.2</strong>
					</li>
				</ul>
				A11y title in <strong>1.3</strong>, <strong>3</strong> and <strong>4.2</strong>
			</div>
			<br />

			<p>
				Selected: <strong>4</strong> -&gt; <strong>4.1</strong> -&gt; <strong>4.1.2</strong>
			</p>
			<ul>
				<li>
					A11y title in selected parents: <strong>Chosen level: 4</strong> and <strong>Chosen level: 4.1</strong>
				</li>
				<li>
					A11y title in selected child: <strong>Current page: 4.1.2</strong>
				</li>
			</ul>
			<StyledWrapper data-role="menu-container">
				<FlyoutMenu items={longListItems} type="vertical" scrollToSelectedItem useAs="main" id="menu-with-a11y" />
			</StyledWrapper>
		</div>
	);
}
