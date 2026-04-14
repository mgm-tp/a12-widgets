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

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Icon, Badge, Button } from "@com.mgmtp.a12.widgets/widgets-core";

import { getCurrentTheme } from "../../../helpers/theme-selector.js";

function createMenuItems(collapsed: boolean): MenuItem[] {
	return [
		{
			label: "1 Menu Item",
			badge: <Badge tiny variant="warning" hidden={!collapsed} />,
			additionalInfoIcon: (
				<Icon variant="warning" iconTheme="outlined">
					warning_amber
				</Icon>
			)
		},
		{
			label: "Menu Item",
			...(collapsed && { title: "Menu Item" }),
			icon: <Icon>dvr</Icon>,
			badge: <Badge tiny hidden={!collapsed} />,
			additionalInfoIcon: <Icon variant="info">lock_open</Icon>
		},
		{
			label: "3 Long Menu Item Lorem Ipsum"
		},
		{
			label: "4 Menu Item",
			badge: <Badge tiny variant="error" hidden={!collapsed} />,
			additionalInfoIcon: (
				<Icon variant="error" iconTheme="custom">
					error
				</Icon>
			)
		},
		{
			label: "Custom Additional Info Icon Name",
			...(collapsed && { title: "Custom Additional Info Icon Name" }),
			badge: <Badge tiny variant="info" hidden={!collapsed} />,
			icon: <Icon>alternate_email</Icon>,
			additionalInfoIcon: <Icon variant="info">alternate_email</Icon>
		}
	];
}

export function CollapsibleSidebar(): ReactElement {
	const [collapsed, setCollapsed] = useState(false);
	const menuWidth = (): string => (getCurrentTheme() === "compact" ? "40px" : "60px");

	const collapseMenu = (): void => {
		setCollapsed(!collapsed);
	};

	return (
		<div style={{ width: 300 }}>
			<Button primary onClick={collapseMenu} className="-u-margin-b-base">
				{collapsed ? "Expand Menu" : "Collapse Menu"}
			</Button>
			<FlyoutMenu
				type="vertical"
				items={createMenuItems(collapsed)}
				collapsed={collapsed}
				style={{ width: collapsed ? menuWidth() : 300 }}
			/>
		</div>
	);
}
