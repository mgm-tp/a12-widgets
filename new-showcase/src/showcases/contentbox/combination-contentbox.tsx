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

import { loremIpsum } from "lorem-ipsum";
import type { ReactElement } from "react";
import { useState, useCallback, useMemo } from "react";

import type { ActionContentboxProps, MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Breadcrumb,
	Button,
	ActionContentbox,
	ContentBoxElements,
	Icon,
	FlyoutMenu,
	MessageBox,
	Wizard
} from "@com.mgmtp.a12.widgets/widgets-core";

const content = (): string => loremIpsum({ units: "sentences", count: 200 });

function NavBar() {
	const [selectedItem, setSelectedItem] = useState({ label: "HOME" });
	const navItems: MenuItem[] = [
		{ label: "HOME" },
		{ label: "ABOUT" },
		{ label: "DUMMY NAVIGATOR 1" },
		{ label: "DUMMY NAVIGATOR 2" },
		{ label: "DUMMY NAVIGATOR 3" },
		{ label: "DUMMY NAVIGATOR 4" },
		{ label: "DUMMY NAVIGATOR 5" },
		{ label: "DUMMY NAVIGATOR 6" },
		{ label: "DUMMY NAVIGATOR 7" },
		{ label: "COMING SOON", disabled: true }
	].map((navItem) => ({
		...navItem,
		selected: navItem === selectedItem,
		onClick: () => setSelectedItem(navItem)
	}));

	return <FlyoutMenu items={navItems} type="horizontal" useAs="tabNavigation" />;
}

export const actionButtons: ActionContentboxProps.ButtonConfiguration[] = [
	{ label: "Action 1", align: "left" },
	{ label: "Action 2", align: "left" },
	{ label: "Action 3", align: "right" },
	{ label: "Action 4", align: "right" }
].map((item, index) => ({
	align: item.align as ActionContentboxProps.ButtonAlignment,
	button: <Button key={index} label={item.label} />
}));

export interface InteractiveState {
	selectedIndex: number;
}

export interface WizardBarProps {
	steps: { label: string; icon: string }[];

	handlePrevious?(): void;

	handleNext?(): void;

	setSelectedIndex(index: number): void;
}

function WizardBar(props: WizardBarProps & InteractiveState): ReactElement<WizardBarProps & InteractiveState> {
	const { handlePrevious, handleNext, selectedIndex, setSelectedIndex, steps } = props;

	return (
		<Wizard responsive truncate>
			<Wizard.PreviousStepButton disabled={selectedIndex === 0} onClick={handlePrevious} />
			{steps.map((step, index) => (
				<Wizard.Step
					key={index}
					label={step.label}
					icon={<Icon>{step.icon}</Icon>}
					selected={selectedIndex === index}
					onClick={() => setSelectedIndex(index)}
				/>
			))}
			<Wizard.NextStepButton disabled={selectedIndex === steps.length - 1} onClick={handleNext} />
		</Wizard>
	);
}

const steps = [
	{
		label: "Preconditions",
		icon: "description"
	},
	{
		label: "Example for Step with long label",
		icon: "list"
	},
	{
		label: "Intl. Cover",
		icon: "phone_android"
	},
	{
		label: "Partner",
		icon: "people"
	},
	{
		label: "Preconditions",
		icon: "description"
	},
	{
		label: "Quote",
		icon: "forum"
	},
	{
		label: "Policy",
		icon: "assignment"
	}
];

export function CombinationContentbox(): ReactElement<{}> {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleNext = useCallback((): void => {
		setSelectedIndex((prevSelectedIndex) =>
			prevSelectedIndex < steps.length - 1 ? prevSelectedIndex + 1 : steps.length - 1
		);
	}, []);

	const handlePrevious = useCallback((): void => {
		setSelectedIndex((prevSelectedIndex) => (prevSelectedIndex > 0 ? prevSelectedIndex - 1 : 0));
	}, []);

	const breadcrumbs = useMemo(() => {
		const breadcrumbItems = [
			{ label: "Breadcrumb 1" },
			{ label: "Breadcrumb 2" },
			{ label: "Breadcrumb 3", currentPage: true }
		];

		return (
			<Breadcrumb>
				{breadcrumbItems.map((item) => (
					<Breadcrumb.Item key={item.label} currentPage={item.currentPage}>
						{item.label}
					</Breadcrumb.Item>
				))}
			</Breadcrumb>
		);
	}, []);

	return (
		<ActionContentbox
			breadcrumbs={breadcrumbs}
			buttons={actionButtons}
			wizardBar={
				<WizardBar
					steps={steps}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					handleNext={handleNext}
					handlePrevious={handlePrevious}
				/>
			}
			footer={<ContentBoxElements.Footer />}
			hideWizardBarOnScroll
			headingElements={<ContentBoxElements.Title text="Combination Content box" />}
			notificationArea={
				<MessageBox label="This optional area provides space for a notification." focusOnMessage={false} />
			}
			navigation={<NavBar />}
			style={{ height: "500px" }}
		>
			<h3>{steps[selectedIndex].label}</h3>
			<p>{content()}</p>
		</ActionContentbox>
	);
}
