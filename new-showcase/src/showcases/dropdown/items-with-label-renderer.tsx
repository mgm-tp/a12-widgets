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

import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { styled } from "styled-components";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { StyledIconWrapper, DropDown, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

const ShowcaseStyledRichLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;

	${StyledIconWrapper} {
		color: inherit;
	}
`;

const descriptions: Record<string, string> = {
	dashboard: "Overview of all your data and metrics",
	analytics: "Detailed analysis and reports",
	settings: "Configure your preferences",
	profile: "Manage your account information",
	notifications: "View and manage alerts",
	help: "Get assistance and documentation"
};

const icons: Record<string, string> = {
	dashboard: "dashboard",
	analytics: "analytics",
	settings: "settings",
	profile: "account_circle",
	notifications: "notifications",
	help: "help_outline"
};

const labelRenderer = (item: DropDownItem): ReactNode => {
	const itemValue: string = item.value || "";

	return (
		<ShowcaseStyledRichLabel>
			<Icon>{icons[itemValue]}</Icon>
			<div className="-u-flex -u-flex-col" style={{ gap: "4px" }}>
				<span>{item.label}</span>
				<span className="-u-italic">{descriptions[itemValue]}</span>
			</div>
		</ShowcaseStyledRichLabel>
	);
};

const items: DropDownItem[] = [
	{ label: "Dashboard", value: "dashboard", tabIndex: 0 },
	{ label: "Analytics", value: "analytics", tabIndex: 0 },
	{ label: "Settings", value: "settings", tabIndex: 0 },
	{ label: "Profile", value: "profile", tabIndex: 0 },
	{ label: "Notifications", value: "notifications", tabIndex: 0 },
	{ label: "Help", value: "help", tabIndex: 0 }
];

export function DropDownWithLabelRendererShowcase(): ReactElement {
	const [selectedItem, setSelectedItem] = useState<DropDownItem | undefined>(undefined);

	return (
		<DropDown
			hint={`${items.length} navigation options`}
			items={items}
			onSelectedItemChange={setSelectedItem}
			selectedItem={selectedItem}
			labelRenderer={labelRenderer}
		/>
	);
}
