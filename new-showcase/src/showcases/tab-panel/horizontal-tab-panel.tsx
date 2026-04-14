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

import type { FC } from "react";
import { useState, useCallback } from "react";

import type { TabPanelTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Badge, Button, ActionContentbox, Icon, TabPanel, TabPanelTemplate } from "@com.mgmtp.a12.widgets/widgets-core";
// Generate unique tabs with increasing value and id
const tabs: TabPanelTemplateProps.TabProps[] = Array.from({ length: 20 }, (_, i) => {
	const idx = i + 1;
	const icons = [
		<Icon>navigation</Icon>,
		<Icon>search</Icon>,
		<Icon>event_note</Icon>,
		<Icon>feedback</Icon>,
		<Icon>airline_seat_legroom_reduced</Icon>,
		<Icon>accessible</Icon>
	];
	const titles = ["Navigation", "Search", "Calendar", "Feedback", "Airline", "Accessible"];
	const icon = icons[i % icons.length];
	const title = titles[i % titles.length];
	const id = `tab${idx}`;
	const value = `Panel ${idx}`;
	const disabled = title === "Feedback";
	const children = title === "Search" ? <Badge id={`info-badge-id-${idx}`} count={9} /> : undefined;
	const ariaLabelledby = title === "Search" ? `info-badge-id-${idx}` : undefined;

	return {
		icon,
		value,
		id,
		title,
		disabled,
		children,
		ariaLabelledby
	};
});

export const HorizontalTabPanelShowcase: FC = () => {
	const [value, setValue] = useState<string | undefined>("Panel 1");

	const handleSelect = useCallback(
		(tab: TabPanelTemplateProps.TabProps) => setValue((oldValue) => (tab.value === oldValue ? undefined : tab.value)),
		[]
	);

	const handleClose = useCallback(() => setValue(undefined), []);

	return (
		<div className="-u-width-full" style={{ height: 300 }}>
			<TabPanel
				orientation="horizontal"
				onSelect={handleSelect}
				value={value}
				tabs={tabs}
				id="horizontal-tab-panel"
				header={
					<TabPanelTemplate.PanelHeader
						suffixes={
							value ? [<Button invert icon={<Icon>close</Icon>} onClick={handleClose} title="Close" />] : undefined
						}
					/>
				}
				onClose={handleClose}
			>
				<ActionContentbox headingElements={null}>
					{value && <div className="-u-padding-t-md">{value}</div>}
				</ActionContentbox>
			</TabPanel>
		</div>
	);
};
