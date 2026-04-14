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

const tabs: TabPanelTemplateProps.TabProps[] = [
	{
		icon: <Icon>navigation</Icon>,
		value: "Navigation Panel",
		id: "tab1",
		title: "Navigation"
	},
	{
		icon: <Icon>search</Icon>,
		value: "Search Panel",
		id: "tab2",
		title: "Search",
		children: <Badge id="info-badge-id" count={9} />,
		ariaLabelledby: "info-badge-id"
	},
	{
		icon: <Icon>event_note</Icon>,
		value: "The highlighted Calendar Panel",
		id: "tab3",
		title: "Calendar",
		highlighted: true
	},
	{
		icon: <Icon>feedback</Icon>,
		value: "Feedback Panel",
		disabled: true,
		id: "tab4",
		title: "Feedback"
	},
	{
		icon: <Icon>airline_seat_legroom_reduced</Icon>,
		value: "Airline Panel",
		title: "Airline"
	},
	{
		icon: <Icon>accessible</Icon>,
		value: "Accessible Panel",
		title: "Accessible"
	}
];

export const TabPanelAccessibilityShowcase: FC = () => {
	const [value, setValue] = useState<string | undefined>("Navigation Panel");

	const handleSelect = useCallback(
		(tab: TabPanelTemplateProps.TabProps) => setValue((oldValue) => (tab.value === oldValue ? undefined : tab.value)),
		[]
	);

	const handleClose = useCallback(() => setValue(undefined), []);

	return (
		<div className="-u-width-full" style={{ height: 300 }}>
			<TabPanel
				focusOnPanelAfterSelect
				onSelect={handleSelect}
				value={value}
				tabs={tabs}
				id="accessibility-panel"
				header={
					<TabPanelTemplate.PanelHeader
						heading="Tab Panel"
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
