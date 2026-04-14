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

import type { ReactNode } from "react";
import { useState, useCallback } from "react";

import { Icon } from "../../src/icon/main/icon.view.js";
import { ActionContentbox } from "../../src/contentbox/main/action-contentbox/action-contentbox.view.js";
import { Button } from "../../src/button/main/button.view.js";
import type { TabPanelTemplateProps } from "../../src/tab-panel/main/template/tab-panel.tpl.api.js";
import { TabPanel } from "../../src/tab-panel/main/tab-panel.view.js";
import { TabPanelTemplate } from "../../src/tab-panel/main/template/tab-panel.tpl.view.js";
import { A11YLanguageContext, getA11yResource } from "../../src/common/main/a11y-localization/language-context.js";
import { InteractionHintConfigProvider } from "../../src/interaction-hint/main/interaction-hint-context.js";

interface TabPanelExampleProps {
	tabs?: TabPanelTemplateProps.TabProps[];
	focusOnPanelAfterSelect?: boolean;
}

export const TabPanelExample = (props: TabPanelExampleProps): ReactNode => {
	const tabFit: TabPanelTemplateProps.TabProps[] = [
		{
			icon: <Icon>navigation</Icon>,
			value: "Panel 1",
			id: "tab1",
			title: "Navigation"
		},
		{
			icon: <Icon>event_note</Icon>,
			value: "Panel 3",
			id: "tab3",
			title: "Calendar"
		}
	];

	const tabExceed: TabPanelTemplateProps.TabProps[] = [
		{
			icon: <Icon>event_note</Icon>,
			value: "Panel 3",
			id: "tab3",
			title: "Calendar"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 4",
			disabled: true,
			id: "tab4",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 5",
			disabled: true,
			id: "tab5",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 6",
			disabled: true,
			id: "tab6",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 7",
			disabled: true,
			id: "tab7",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 8",
			disabled: true,
			id: "tab8",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 9",
			disabled: true,
			id: "tab9",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 10",
			disabled: true,
			id: "tab10",
			title: "Feedback"
		}
	];
	const [value, setValue] = useState<string | undefined>("Panel 1");
	const [tabs, setTabs] = useState(tabFit);
	const [a11yLanguage, setA11yLanguage] = useState<string>("en");

	const handleSelect = useCallback(
		(tab: TabPanelTemplateProps.TabProps) => setValue((oldValue) => (tab.value === oldValue ? undefined : tab.value)),
		[]
	);

	const handleClose = useCallback(() => setValue(undefined), []);

	const handleChangeLanguage = useCallback(() => {
		if (a11yLanguage === "en") {
			setA11yLanguage("de");
		} else {
			setA11yLanguage("en");
		}
	}, [a11yLanguage]);

	return (
		<InteractionHintConfigProvider enableInteractionHint>
			<A11YLanguageContext.Provider value={getA11yResource(a11yLanguage)}>
				<Button dataRole="language-button" onClick={handleChangeLanguage}>
					Change Language
				</Button>
				<div className="-u-width-full" style={{ height: 300 }}>
					<TabPanel
						onSelect={handleSelect}
						value={value}
						tabs={props?.tabs ?? tabs}
						id="basic-panel"
						header={
							<TabPanelTemplate.PanelHeader
								suffixes={[<Button invert icon={<Icon>close</Icon>} onClick={handleClose} title="Close" />]}
							/>
						}
						onClose={handleClose}
						focusOnPanelAfterSelect={props.focusOnPanelAfterSelect}
					>
						<ActionContentbox headingElements={null}>
							{value && <div className="-u-padding-t-md">{value}</div>}
							<Button onClick={() => setTabs((tab) => (tab.length === 2 ? tabExceed : tabFit))}>Change tab list</Button>
						</ActionContentbox>
					</TabPanel>
				</div>
			</A11YLanguageContext.Provider>
		</InteractionHintConfigProvider>
	);
};

export const TabPanelExceedTabExample = (): ReactNode => {
	const tabs: TabPanelTemplateProps.TabProps[] = [
		{
			icon: <Icon>event_note</Icon>,
			value: "Panel 3",
			id: "tab3",
			title: "Calendar"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 4",
			id: "tab4",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 5",
			id: "tab5",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 6",
			id: "tab6",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 7",
			id: "tab7",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 8",
			id: "tab8",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 9",
			id: "tab9",
			title: "Feedback"
		},
		{
			icon: <Icon>feedback</Icon>,
			value: "Panel 10",
			id: "tab10",
			title: "Feedback"
		}
	];
	const [value, setValue] = useState<string | undefined>("Panel 3");

	const handleSelect = useCallback(
		(tab: TabPanelTemplateProps.TabProps) => setValue((oldValue) => (tab.value === oldValue ? undefined : tab.value)),
		[]
	);

	return (
		<div className="-u-width-full" style={{ height: 300 }}>
			<TabPanel onSelect={handleSelect} value={value} tabs={tabs} id="basic-panel">
				<ActionContentbox headingElements={null}>
					{value && <div className="-u-padding-t-md">{value}</div>}
				</ActionContentbox>
			</TabPanel>
		</div>
	);
};
