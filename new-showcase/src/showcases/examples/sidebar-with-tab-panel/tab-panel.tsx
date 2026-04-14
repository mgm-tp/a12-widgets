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
import { useMemo } from "react";

import type { TabPanelTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, Icon, TabPanel, TabPanelTemplate } from "@com.mgmtp.a12.widgets/widgets-core";

import { tabPanelData } from "./data.js";
import { Panel } from "./tab-panel-content.js";

const { PanelHeader } = TabPanelTemplate;

interface TabPanelExampleProps {
	onToggleMaximized?(): void;
	onClose?(): void;
	value?: string;
	title?: string;
	maximized?: boolean;
	isMobile?: boolean;
	onSelect(tab: TabPanelTemplateProps.TabProps): void;
}

export const TabPanelExample: FC<TabPanelExampleProps> = (props: TabPanelExampleProps) => {
	const { onClose, value, title, onSelect, maximized, isMobile } = props;

	const panel = useMemo(() => {
		return value && <Panel value={value} />;
	}, [value]);

	return (
		<TabPanel
			onSelect={onSelect}
			value={value}
			tabs={tabPanelData}
			header={
				<PanelHeader
					heading={title}
					suffixes={[
						isMobile ? null : (
							<Button
								icon={<Icon>{maximized ? "fullscreen_exit" : "fullscreen"}</Icon>}
								invert
								onClick={props.onToggleMaximized}
								title={maximized ? "Minimize" : "Maximize"}
							/>
						),
						<Button icon={<Icon>close</Icon>} invert onClick={onClose} title="Close" />
					]}
				/>
			}
			id="side-bar-with-tab-panel"
			onClose={onClose}
		>
			{panel}
		</TabPanel>
	);
};
