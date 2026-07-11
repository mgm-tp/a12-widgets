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
import { useCallback, useState } from "react";

import type { TabPanelTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { ActionContentbox, Button, Icon, TabPanel, TabPanelTemplate } from "@com.mgmtp.a12.widgets/widgets-core";

import { groupedTabs } from "./grouped-tab-panel-data.js";

export const GroupedHorizontalTabPanelShowcase: FC = () => {
	const [value, setValue] = useState<string | undefined>("Map Panel");

	const handleSelect = useCallback(
		(tab: TabPanelTemplateProps.TabProps) => setValue((prev) => (tab.value === prev ? undefined : tab.value)),
		[]
	);

	const handleClose = useCallback(() => setValue(undefined), []);

	return (
		<div className="-u-width-full" style={{ height: 350 }}>
			<TabPanel
				id="grouped-horizontal-panel"
				orientation="horizontal"
				tabs={groupedTabs}
				value={value}
				onSelect={handleSelect}
				onClose={handleClose}
				header={
					<TabPanelTemplate.PanelHeader
						heading="Grouped Horizontal"
						suffixes={
							value ? [<Button invert icon={<Icon>close</Icon>} onClick={handleClose} title="Close" />] : undefined
						}
					/>
				}
			>
				<ActionContentbox headingElements={null}>
					{value && <div className="-u-padding-t-md">{value}</div>}
				</ActionContentbox>
			</TabPanel>
		</div>
	);
};
