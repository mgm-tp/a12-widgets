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

import {
	findAllByDataRole,
	getAllByDataRole,
	getAllByRole,
	getByDataRole,
	queryByDataRole,
	render,
	waitFor
} from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { FC, ReactNode } from "react";
import { useCallback, useState } from "react";

import { Icon } from "../../icon/main/icon.view.js";
import { getBadgeTitle } from "../../badge/main/badge-utils.js";
import { Badge } from "../../badge/main/badge.view.js";
import { A11YLanguageContext, getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { Button } from "../../button/main/button.view.js";

import { TabPanel } from "../main/tab-panel.view.js";
import type { TabPanelTemplateProps } from "../main/template/tab-panel.tpl.api.js";
import { TabPanelTemplate } from "../main/template/tab-panel.tpl.view.js";
import type { TabPanelProps } from "../main/tab-panel.api.js";

// -- Story components inlined for tab-panel behavior tests --

interface TabPanelExampleProps {
	tabs?: TabPanelTemplateProps.TabProps[];
	focusOnPanelAfterSelect?: boolean;
}

const TabPanelExample = (props: TabPanelExampleProps): ReactNode => {
	const tabFit: TabPanelTemplateProps.TabProps[] = [
		{ icon: <Icon>navigation</Icon>, value: "Panel 1", id: "tab1", title: "Navigation" },
		{ icon: <Icon>event_note</Icon>, value: "Panel 3", id: "tab3", title: "Calendar" }
	];

	const tabExceed: TabPanelTemplateProps.TabProps[] = [
		{ icon: <Icon>event_note</Icon>, value: "Panel 3", id: "tab3", title: "Calendar" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 4", disabled: true, id: "tab4", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 5", disabled: true, id: "tab5", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 6", disabled: true, id: "tab6", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 7", disabled: true, id: "tab7", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 8", disabled: true, id: "tab8", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 9", disabled: true, id: "tab9", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 10", disabled: true, id: "tab10", title: "Feedback" }
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
		setA11yLanguage((lang) => (lang === "en" ? "de" : "en"));
	}, []);

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

const TabPanelExceedTabExample = (): ReactNode => {
	const tabs: TabPanelTemplateProps.TabProps[] = [
		{ icon: <Icon>event_note</Icon>, value: "Panel 3", id: "tab3", title: "Calendar" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 4", id: "tab4", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 5", id: "tab5", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 6", id: "tab6", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 7", id: "tab7", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 8", id: "tab8", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 9", id: "tab9", title: "Feedback" },
		{ icon: <Icon>feedback</Icon>, value: "Panel 10", id: "tab10", title: "Feedback" }
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

const { PanelHeader } = TabPanelTemplate;

const tabs: TabPanelTemplateProps.TabProps[] = [
	{
		icon: <Icon>navigation</Icon>,
		value: "Panel 1",
		id: "tab-1",
		title: "Navigation"
	},
	{
		icon: <Icon>search</Icon>,
		value: "Panel 2",
		id: "tab-1",
		title: "Search",
		style: { color: "red" },
		className: "tab-classname",
		children: <Badge id="info-badge-id" count={9} />
	},
	{
		icon: <Icon>event_note</Icon>,
		value: "Panel 3",
		id: "tab-1",
		disabled: true,
		title: "Calendar"
	}
];

const createTestTabs = (count: number): TabPanelTemplateProps.TabProps[] =>
	Array.from({ length: count }, (_, i) => ({
		icon: <Icon>search</Icon>,
		value: `Panel ${i + 1}`,
		id: `tab-${i + 1}`,
		title: `Tab ${i + 1}`
	}));

describe("com.mgmtp.a12.widgets.tab-panel", () => {
	test("render basic tab-panel", async () => {
		const { container } = render(<TabPanel tabs={tabs} />);

		expect(await findAllByDataRole(container, DataRoles.TabPanel.Tab)).toHaveLength(tabs.length);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render tab-panel with header", async () => {
		const selectedValue = tabs[1];
		const { container, getByText } = render(
			<TabPanel
				tabs={tabs}
				header={<PanelHeader heading="Test heading" suffixes={["Header Suffix"]} />}
				value={selectedValue.value}
			>
				{selectedValue.value}
			</TabPanel>
		);

		expect(getByText("Test heading")).toBeInTheDocument();

		expect(await findAllByDataRole(container, DataRoles.TabPanel.Tab)).toHaveLength(tabs.length);

		const panelContent = getByDataRole(container, DataRoles.TabPanel.Content);
		expect(panelContent.textContent).toEqual(selectedValue.value);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("trigger tab-panel events", async () => {
		const onSelectSpy = vi.fn();
		const onClickSpy = vi.fn();

		const { getByRole } = render(<TabPanel tabs={[{ ...tabs[0], onClick: onClickSpy }]} onSelect={onSelectSpy} />);

		await userEvent.click(getByRole("tab", { name: "Navigation" }));
		expect(onClickSpy).toHaveBeenCalledTimes(1);
		expect(onSelectSpy).toHaveBeenCalledTimes(1);

		onClickSpy.mockClear();
		onSelectSpy.mockClear();

		await userEvent.keyboard("{Enter}");
		expect(onClickSpy).toHaveBeenCalledTimes(1);
		expect(onSelectSpy).toHaveBeenCalledTimes(1);
	});

	test("Should apply different styles for selected and highlighted tabs", () => {
		const tabsWithSelectedAndHighlighted: TabPanelTemplateProps.TabProps[] = [
			{
				icon: <Icon>navigation</Icon>,
				value: "Panel 1",
				id: "tab1",
				title: "Selected Tab",
				selected: true
			},
			{
				icon: <Icon>search</Icon>,
				value: "Panel 2",
				id: "tab2",
				title: "Highlighted Tab",
				highlighted: true
			}
		];

		const { getByRole } = render(<TabPanel tabs={tabsWithSelectedAndHighlighted} />);

		const selectedTab = getByRole("tab", { name: "Selected Tab" });
		const highlightedTab = getByRole("tab", { name: "Highlighted Tab" });

		expect(selectedTab).toBeTruthy();
		expect(highlightedTab).toBeTruthy();

		// Get computed styles
		const selectedTabStyles = window.getComputedStyle(selectedTab);
		const highlightedTabStyles = window.getComputedStyle(highlightedTab);

		// Verify selected tab has different background color from highlighted tab
		expect(selectedTabStyles.backgroundColor).not.toBe(highlightedTabStyles.backgroundColor);

		// Verify selected tab has different text color from highlighted tab
		expect(selectedTabStyles.color).not.toBe(highlightedTabStyles.color);

		expect(selectedTab).toHaveAttribute("aria-selected", "true");

		expect(highlightedTab).toHaveAttribute("aria-selected", "false");
	});

	test("Should set appropriate aria attributes based on tab states (selected, highlighted, disabled)", async () => {
		const onSelectSpy = vi.fn();
		const tabStates: TabPanelTemplateProps.TabProps[] = [
			{
				icon: <Icon>accessible</Icon>,
				value: "Panel 1",
				id: "tab1",
				title: "Selected Tab",
				selected: true
			},
			{
				icon: <Icon>event_note</Icon>,
				value: "Panel 2",
				id: "tab2",
				title: "Highlighted Tab",
				highlighted: true
			},
			{
				icon: <Icon>feedback</Icon>,
				value: "Panel 3",
				id: "tab3",
				title: "Disabled Tab",
				disabled: true
			},
			{
				icon: <Icon>search</Icon>,
				value: "Panel 4",
				id: "tab4",
				title: "Normal Tab"
			}
		];

		const { rerender, getByRole } = render(<TabPanel tabs={tabStates} />);

		const selectedTab = getByRole("tab", { name: "Selected Tab" });
		const highlightedTab = getByRole("tab", { name: "Highlighted Tab" });
		const disabledTab = getByRole("tab", { name: "Disabled Tab" });
		const normalTab = getByRole("tab", { name: "Normal Tab" });

		expect(selectedTab).toBeTruthy();
		expect(highlightedTab).toBeTruthy();
		expect(disabledTab).toBeTruthy();
		expect(normalTab).toBeTruthy();

		// Initial state - selected tab
		expect(selectedTab).toHaveAttribute("aria-selected", "true");
		expect(selectedTab).toHaveAttribute("aria-current", "false");

		// Initial state - highlighted tab (not selected yet)
		expect(highlightedTab).toHaveAttribute("aria-selected", "false");
		expect(highlightedTab).toHaveAttribute("aria-current", "page");

		// Initial state - disabled tab
		expect(disabledTab).toHaveAttribute("aria-disabled", "true");
		expect(disabledTab).toHaveAttribute("aria-selected", "false");
		expect(disabledTab).toHaveAttribute("aria-current", "false");

		// Initial state - normal tab
		expect(normalTab).toHaveAttribute("aria-selected", "false");
		expect(normalTab).toHaveAttribute("aria-current", "false");

		// Click on highlighted tab to make it selected as well
		await userEvent.click(highlightedTab);

		rerender(<TabPanel tabs={tabStates} onSelect={onSelectSpy} value="Panel 2" />);

		// Tab is now both highlighted and selected
		expect(highlightedTab).toHaveAttribute("aria-selected", "true");
		expect(highlightedTab).toHaveAttribute("aria-current", "page");
		// });

		// Previously selected tab should no longer be selected
		expect(selectedTab).toHaveAttribute("aria-selected", "false");
		expect(selectedTab).toHaveAttribute("aria-current", "false");
	});

	test("Custom tab list's aria-label by `tabListAriaLabel` property", async () => {
		const { container } = render(<TabPanel tabs={tabs} tabListAriaLabel="Custom Aria Label" />);
		await waitFor(() => {
			const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);

			expect(tabList.getAttribute("aria-label")).toBe("Custom Aria Label");
		});
	});

	describe("Interaction Hint", () => {
		const TabPanelWithHint = (props: TabPanelProps) => (
			<InteractionHintConfigProvider enableInteractionHint>
				<TabPanel {...props} />
			</InteractionHintConfigProvider>
		);

		test("show the hint when focusing to tab item", async () => {
			const { container } = render(<TabPanelWithHint tabs={tabs} />);

			// Focus first tab
			await userEvent.tab();

			await waitFor(() => {
				expect(getByDataRole(container, DataRoles.InteractionHint).textContent).toEqual(tabs[0].title);
			});
			expect(getByDataRole(container, DataRoles.InteractionHint)).toMatchSnapshot();
		});

		test("showing the hint include badge content when focusing to tab item", async () => {
			const { container } = render(<TabPanelWithHint tabs={tabs} />);

			// Focus second tab
			await userEvent.tab();
			await userEvent.keyboard("{ArrowDown}");

			await waitFor(() => {
				expect(getByDataRole(container, DataRoles.InteractionHint).textContent).toEqual(
					`${tabs[1].title}, ${getBadgeTitle((tabs[1].children as any).props, getA11yResource("en").badgeTitles)}`
				);
			});
			expect(getByDataRole(container, DataRoles.InteractionHint)).toMatchSnapshot();
		});
	});

	describe("Horizontal Tab Panel", () => {
		test("Renders horizontal Tab Panel", async () => {
			const { container } = render(<TabPanel tabs={tabs} orientation="horizontal" />);

			await waitFor(() => {
				const tabList = getByDataRole(container, DataRoles.TabPanel.TabList);

				expect(tabList.getAttribute("aria-orientation")).toBe("horizontal");
			});

			const panelTabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			await waitFor(() => {
				expect(panelTabs.length).toEqual(tabs.length);
			});
		});

		test("Arrow key navigation", async () => {
			const { container } = render(<TabPanel tabs={tabs} orientation="horizontal" />);
			const panelTabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);

			// Focus first tab
			await userEvent.tab();
			expect(panelTabs[0]).toHaveFocus();

			// Simulate ArrowRight (should move to next tab)
			await userEvent.keyboard("{ArrowRight}");
			expect(panelTabs[1]).toHaveFocus();

			// Simulate ArrowLeft (should move back to first tab)
			await userEvent.keyboard("{ArrowLeft}");
			expect(panelTabs[0]).toHaveFocus();

			// Simulate ArrowDown (should not move to next tab)
			await userEvent.keyboard("{ArrowDown}");
			expect(panelTabs[0]).toHaveFocus();

			// Simulate ArrowUp (should not move back to first tab)
			await userEvent.keyboard("{ArrowUp}");
			expect(panelTabs[0]).toHaveFocus();
		});
	});

	test("Render the tab panel on both the main tab and sub-tab when the tabs property changes.", async () => {
		const tabNumBeforeChange = 2;
		const tabNumAfterChange = 8;
		const maxTabOnMainTab = 5;

		const { container, getByRole, getByDataRole } = render(<TabPanelExample />);

		const tabPanel = getByDataRole(DataRoles.TabPanel);

		expect(tabPanel).toBeTruthy();

		const mainTab = getByDataRole(DataRoles.TabPanel.TabList);
		expect(getAllByRole(mainTab, "tab")).toHaveLength(tabNumBeforeChange);

		await getByRole("button", { name: "Change tab list" }).click();
		await waitFor(() => {
			expect(getAllByRole(container, "tab")).toHaveLength(maxTabOnMainTab);
		});
		await userEvent.click(getByRole("button", { name: "Further tab items" }));

		const subTab = getByDataRole(DataRoles.TabPanel.SubTabList);

		// We add + 1 because of the condensed tab
		expect(getAllByRole(subTab, "tab")).toHaveLength(tabNumAfterChange - maxTabOnMainTab + 1);
	});

	test("Panel header title should have text-overflow ellipsis when it exceeds available width", () => {
		const longTitle =
			"This is a very long title that should be truncated with ellipsis when it exceeds the available width";

		const { getByText } = render(
			<TabPanel
				tabs={tabs}
				header={
					<PanelHeader
						heading={longTitle}
						suffixes={[<button key="1">Button 1</button>, <button key="2">Button 2</button>]}
					/>
				}
				value={tabs[0].value}
			>
				Content
			</TabPanel>
		);

		const cssEllipsis = getByText(longTitle);
		const heading = cssEllipsis.parentElement;

		const ellipsisStyles = window.getComputedStyle(cssEllipsis);

		expect(ellipsisStyles.overflow).toBe("hidden");
		expect(ellipsisStyles.webkitLineClamp).toBe("1");
		expect(ellipsisStyles.wordBreak).toBe("break-all");

		// Verify heading has proper flex properties
		if (heading) {
			const headingStyles = window.getComputedStyle(heading);
			expect(headingStyles.minWidth).toBe("0px");
		}
	});

	test("Heading should have flex: 1 to take available space", () => {
		const { getByText } = render(
			<TabPanel
				tabs={tabs}
				header={<PanelHeader heading="Test Title" suffixes={[<button key="1">Button</button>]} />}
				value={tabs[0].value}
			>
				Content
			</TabPanel>
		);

		const heading = getByText("Test Title").parentElement;

		if (heading) {
			const headingStyles = window.getComputedStyle(heading);
			expect(headingStyles.flex).toBe("1 1 0%");
		}
	});

	test("Heading should have role='heading' and default aria-level='2' for accessibility", () => {
		const { getByText } = render(
			<TabPanel tabs={tabs} header={<PanelHeader heading="Test Heading" />} value={tabs[0].value}>
				Content
			</TabPanel>
		);

		const heading = getByText("Test Heading").parentElement;

		expect(heading).toHaveAttribute("role", "heading");
		expect(heading).toHaveAttribute("aria-level", "2");
	});

	test("Heading should accept custom ariaLevel value", () => {
		const { getByText } = render(
			<TabPanel tabs={tabs} header={<PanelHeader heading="Custom Level Heading" ariaLevel={3} />} value={tabs[0].value}>
				Content
			</TabPanel>
		);

		const heading = getByText("Custom Level Heading").parentElement;

		expect(heading).toHaveAttribute("role", "heading");
		expect(heading).toHaveAttribute("aria-level", "3");
	});

	test("Heading with ariaLevel=1 should be read correctly by screen readers", () => {
		const { getByText } = render(
			<TabPanel tabs={tabs} header={<PanelHeader heading="Main Heading" ariaLevel={1} />} value={tabs[0].value}>
				Content
			</TabPanel>
		);

		const heading = getByText("Main Heading").parentElement;

		expect(heading).toHaveAttribute("role", "heading");
		expect(heading).toHaveAttribute("aria-level", "1");
	});

	test("Heading should be accessible via getAllByRole with heading role", () => {
		const { container } = render(
			<TabPanel tabs={tabs} header={<PanelHeader heading="Accessible Heading" ariaLevel={2} />} value={tabs[0].value}>
				Content
			</TabPanel>
		);

		const headings = getAllByRole(container, "heading", { level: 2 });
		expect(headings).toHaveLength(1);
		expect(headings[0].textContent).toContain("Accessible Heading");
	});

	test("TabPanel should recalculate responsive layout on width and height resize", async () => {
		const manyTabs = createTestTabs(10);

		const { getByDataRole } = render(
			<div style={{ width: "200px", height: "500px" }}>
				<TabPanel tabs={manyTabs} orientation="vertical" />
			</div>
		);

		const tabList = getByDataRole(DataRoles.TabPanel.TabList);

		expect(tabList).toBeInTheDocument();
	});

	test("Title should not wrap to multiple lines", () => {
		const longTitle =
			"This is a very long title that should be truncated with ellipsis when it exceeds the available width in a single line";

		const { getByText } = render(
			<div style={{ width: "300px" }}>
				<TabPanel
					tabs={tabs}
					header={<PanelHeader heading={longTitle} suffixes={[<button key="1">Close</button>]} />}
					value={tabs[0].value}
				>
					Content
				</TabPanel>
			</div>
		);

		const cssEllipsis = getByText(longTitle);

		const ellipsisStyles = window.getComputedStyle(cssEllipsis);
		expect(ellipsisStyles.overflow).toBe("hidden");
		expect(ellipsisStyles.webkitLineClamp).toBe("1");
		expect(ellipsisStyles.wordBreak).toBe("break-all");
	});

	test("Horizontal TabPanel should also respond to both dimensions", () => {
		const manyTabs = createTestTabs(8);

		const { getByDataRole } = render(
			<div style={{ width: "800px", height: "100px" }}>
				<TabPanel tabs={manyTabs} orientation="horizontal" />
			</div>
		);

		const tabList = getByDataRole(DataRoles.TabPanel.TabList);

		// Verify tab list is rendered with horizontal orientation
		expect(tabList).toBeInTheDocument();
		expect(tabList.getAttribute("aria-orientation")).toBe("horizontal");
	});

	test("Header with only suffixes (no heading) should work correctly", () => {
		const { getAllByDataRole } = render(
			<TabPanel tabs={tabs} header={<PanelHeader suffixes={[<button key="1">Action</button>]} />} value={tabs[0].value}>
				Content
			</TabPanel>
		);

		const suffixes = getAllByDataRole(DataRoles.TabPanel.Suffix);
		expect(suffixes).toHaveLength(1);

		const suffixContainer = suffixes[0].parentElement;

		if (suffixContainer) {
			const containerStyles = window.getComputedStyle(suffixContainer);
			expect(containerStyles.flex).toBe("1 1 0%");
		}
	});

	test("Header with multiple suffixes should maintain proper spacing", () => {
		const { getAllByDataRole } = render(
			<TabPanel
				tabs={tabs}
				header={
					<PanelHeader
						heading="Title"
						suffixes={[
							<button key="1">Button 1</button>,
							<button key="2">Button 2</button>,
							<button key="3">Button 3</button>
						]}
					/>
				}
				value={tabs[0].value}
			>
				Content
			</TabPanel>
		);

		const suffixes = getAllByDataRole(DataRoles.TabPanel.Suffix);
		expect(suffixes).toHaveLength(3);

		const suffixContainer = suffixes[0].parentElement;

		if (suffixContainer) {
			const containerStyles = window.getComputedStyle(suffixContainer);
			expect(containerStyles.display).toBe("flex");
			expect(containerStyles.gap).toBeTruthy();
		}
	});

	test("TabPanel wrapper should have responsive width constraints", () => {
		const { getByDataRole } = render(
			<TabPanel tabs={tabs} value={tabs[0].value}>
				Content
			</TabPanel>
		);

		const wrapper = getByDataRole(DataRoles.TabPanel);
		expect(wrapper).toBeTruthy();

		if (wrapper) {
			const wrapperStyles = window.getComputedStyle(wrapper);
			expect(wrapperStyles.display).toBe("flex");
			expect(wrapperStyles.minWidth).toBeTruthy(); // Should allow flex children to shrink
		}
	});

	test("TabPanel should be responsive when parent container resizes", () => {
		const { getByDataRole, rerender, container } = render(
			<div style={{ width: "800px" }}>
				<TabPanel tabs={tabs} header={<PanelHeader heading="Title" />} value={tabs[0].value}>
					Content
				</TabPanel>
			</div>
		);

		const wrapper = getByDataRole(DataRoles.TabPanel);
		expect(wrapper).toBeTruthy();

		const initialStyles = window.getComputedStyle(wrapper);
		expect(initialStyles.display).toBe("flex");
		const initialWidth = wrapper.getBoundingClientRect().width;

		// Change width directly on the parent div to 400px
		const parentDiv = container.firstChild as HTMLElement;

		if (parentDiv) {
			parentDiv.style.width = "400px";
			const styles = window.getComputedStyle(wrapper);
			expect(styles.display).toBe("flex");

			const resizedWidth = wrapper.getBoundingClientRect().width;
			expect(resizedWidth).toBeLessThan(initialWidth);
			expect(resizedWidth).toBeLessThanOrEqual(400);
		}

		// Simulate resize by rerender with different parent width (300px)
		rerender(
			<div style={{ width: "300px" }}>
				<TabPanel tabs={tabs} header={<PanelHeader heading="Title" />} value={tabs[0].value}>
					Content
				</TabPanel>
			</div>
		);

		// Wrapper should still be present and have proper constraints
		const resizedWrapper = getByDataRole(DataRoles.TabPanel);
		expect(resizedWrapper).toBeTruthy();

		if (resizedWrapper) {
			const styles = window.getComputedStyle(resizedWrapper);
			expect(styles.display).toBe("flex");

			const finalWidth = resizedWrapper.getBoundingClientRect().width;
			expect(finalWidth).toBeLessThan(initialWidth);
			expect(finalWidth).toBeLessThanOrEqual(300);
		}
	});

	describe("interaction hint", () => {
		const tabs = [
			{ value: "tab1", label: "Tab 1", title: "First tab" },
			{ value: "tab2", label: "Tab 2", title: "Second tab" }
		];

		test("tab shows hint when componentConfigs.tabPanel=true", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ tabPanel: true }}>
					<TabPanel tabs={tabs} value={tabs[0].value}>
						Content
					</TabPanel>
				</InteractionHintConfigProvider>
			);
			await userEvent.tab();

			const hint = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hint?.textContent).toEqual("First tab");
		});

		test("tab should not show hint when componentConfigs.tabPanel=false", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ tabPanel: false }}>
					<TabPanel tabs={tabs} value={tabs[0].value}>
						Content
					</TabPanel>
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hint = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hint).not.toBeInTheDocument();
		});
	});

	test("sub tab list position remains stable when interaction hint appears in submenu", async () => {
		vi.useFakeTimers();
		const manyTabs = createTestTabs(15);

		const { getByDataRole, getAllByDataRole } = render(
			<InteractionHintConfigProvider enableInteractionHint>
				<div style={{ height: "400px" }}>
					<TabPanel tabs={manyTabs} value={manyTabs[0].value} />
				</div>
			</InteractionHintConfigProvider>
		);

		// Open the condensed tab submenu
		const condensedTabButton = getByDataRole(DataRoles.Popup.TriggerElement);
		await userEvent.click(condensedTabButton);

		const subTabList = getByDataRole(DataRoles.TabPanel.SubTabList);

		const subTabListPosition = {
			top: subTabList.style.top,
			left: subTabList.style.left
		};

		const tabItems = getAllByDataRole(DataRoles.TabPanel.Tab);

		await userEvent.hover(tabItems[0]);

		// Wait for the interaction hint delay
		await vi.advanceTimersByTimeAsync(500);

		const hints = document.body.querySelectorAll(`[data-role="${DataRoles.InteractionHint.Content}"]`);
		expect(hints.length).toBeGreaterThan(0);

		const subTabListPositionAfterHint = {
			top: subTabList.style.top,
			left: subTabList.style.left
		};

		expect(subTabListPosition).toEqual(subTabListPositionAfterHint);

		vi.useRealTimers();
	});

	describe("Accessibility", () => {
		test("Should focus on panel after clicking main tab when `focusOnPanelAfterSelect` is enabled", async () => {
			const { container, getByDataRole } = render(
				<TabPanel focusOnPanelAfterSelect tabs={tabs}>
					<div>Panel Content</div>
				</TabPanel>
			);

			const panelTabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const panel = getByDataRole(DataRoles.Panel);

			await userEvent.click(panelTabs[0]);

			// Verify the panel receives focus
			expect(panel).toHaveFocus();
			expect(panel).toHaveAttribute("tabindex", "-1");
		});

		test("Should not focus on panel after clicking main tab when `focusOnPanelAfterSelect` is disabled", async () => {
			const { container, getByDataRole } = render(
				// focusOnPanelAfterSelect is false as default
				<TabPanel tabs={tabs}>
					<div>Panel Content</div>
				</TabPanel>
			);

			const panelTabs = getAllByDataRole(container, DataRoles.TabPanel.Tab);
			const panel = getByDataRole(DataRoles.Panel);

			await userEvent.click(panelTabs[0]);

			// Verify the panel does not receive focus
			expect(panel).not.toHaveFocus();
			expect(panel).not.toHaveAttribute("tabindex");
		});

		test("Should focus on panel after clicking sub tab when focusOnPanelAfterSelect is enabled", async () => {
			const manyTabs = createTestTabs(20);

			const { getByDataRole } = render(
				<div style={{ height: "300px" }}>
					<TabPanel focusOnPanelAfterSelect tabs={manyTabs}>
						<div>Panel Content</div>
					</TabPanel>
				</div>
			);

			const panel = getByDataRole(DataRoles.Panel);

			// Open the sub menu
			const condensedTabButton = getByDataRole(DataRoles.Popup.TriggerElement);
			await userEvent.click(condensedTabButton);

			// Wait for sub tab list to appear
			await waitFor(() => {
				const subTabList = getByDataRole(DataRoles.TabPanel.SubTabList);
				expect(subTabList).toBeInTheDocument();
			});

			const subTabList = getByDataRole(DataRoles.TabPanel.SubTabList);
			const subTabs = getAllByDataRole(subTabList, DataRoles.TabPanel.Tab);

			await userEvent.click(subTabs[0]);

			// Verify the panel receives focus
			expect(panel).toHaveFocus();
			expect(panel).toHaveAttribute("tabindex", "-1");
		});

		test("Should not focus on panel after clicking sub tab when `focusOnPanelAfterSelect` is disabled", async () => {
			const manyTabs = createTestTabs(20);

			const { getByDataRole } = render(
				<div style={{ height: "300px" }}>
					{/* focusOnPanelAfterSelect is false as default*/}
					<TabPanel tabs={manyTabs}>
						<div>Panel Content</div>
					</TabPanel>
				</div>
			);

			const panel = getByDataRole(DataRoles.Panel);

			// Open the sub menu
			const condensedTabButton = getByDataRole(DataRoles.Popup.TriggerElement);
			await userEvent.click(condensedTabButton);

			// Wait for sub tab list to appear
			await waitFor(() => {
				const subTabList = getByDataRole(DataRoles.TabPanel.SubTabList);
				expect(subTabList).toBeInTheDocument();
			});

			const subTabList = getByDataRole(DataRoles.TabPanel.SubTabList);
			const subTabs = getAllByDataRole(subTabList, DataRoles.TabPanel.Tab);

			await userEvent.click(subTabs[0]);

			// Verify the panel does not receive focus
			expect(panel).not.toHaveFocus();
			expect(panel).not.toHaveAttribute("tabindex");
		});

		test("Should focus on panel when children becomes available after tab click", async () => {
			const DynamicTabPanel: FC = () => {
				const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

				return (
					<TabPanel
						focusOnPanelAfterSelect
						tabs={tabs}
						value={selectedValue}
						onSelect={(tab) => setSelectedValue(tab.value)}
					>
						{selectedValue && <div>Panel Content for {selectedValue}</div>}
					</TabPanel>
				);
			};

			const { getAllByDataRole, queryByDataRole } = render(<DynamicTabPanel />);

			// Initially, no panel should exist
			expect(queryByDataRole(DataRoles.Panel)).not.toBeInTheDocument();

			const panelTabs = getAllByDataRole(DataRoles.TabPanel.Tab);

			await userEvent.click(panelTabs[0]);

			// Wait for panel to appear and receive focus
			await waitFor(() => {
				const panel = queryByDataRole(DataRoles.Panel);
				expect(panel).toBeInTheDocument();
				expect(panel).toHaveFocus();
				expect(panel).toHaveAttribute("tabindex", "-1");
			});
		});

		test("Tab Panel with `focusOnPanelAfterSelect` should return focus to previously selected tab when the panel is closed", async () => {
			const { getAllByDataRole, getByDataRole, getByRole } = render(<TabPanelExample focusOnPanelAfterSelect />);

			// Initially, "Panel 1" is selected (default value in TabPanelExample)
			const panelTabs = getAllByDataRole(DataRoles.TabPanel.Tab);
			const firstTab = panelTabs.find((tab) => tab.getAttribute("aria-selected") === "true");
			expect(firstTab).toBeTruthy();

			const panel = getByDataRole(DataRoles.Panel);
			expect(panel).toBeInTheDocument();

			const closeButton = getByRole("button", { name: /close/i });

			expect(closeButton).toBeInTheDocument();

			await userEvent.click(closeButton);

			// Focus should return to the previously selected tab
			await waitFor(() => {
				expect(firstTab).toHaveFocus();
			});
		});

		test("Tab Panel without `focusOnPanelAfterSelect` should return focus to previously selected tab when the panel is closed", async () => {
			const { getAllByDataRole, getByDataRole, getByRole } = render(<TabPanelExample />);

			// Initially, "Panel 1" is selected (default value in TabPanelExample)
			const panelTabs = getAllByDataRole(DataRoles.TabPanel.Tab);
			const firstTab = panelTabs.find((tab) => tab.getAttribute("aria-selected") === "true");
			expect(firstTab).toBeTruthy();

			const panel = getByDataRole(DataRoles.Panel);
			expect(panel).toBeInTheDocument();

			const closeButton = getByRole("button", { name: /close/i });

			expect(closeButton).toBeInTheDocument();

			await userEvent.click(closeButton);

			// Focus should return to the previously selected tab
			await waitFor(() => {
				expect(firstTab).toHaveFocus();
			});
		});
	});

	describe("Mobile Tab Panel", () => {
		test("Should close the sub tab list when pressing Enter on a sub tab item", async () => {
			const { container } = render(<TabPanelExceedTabExample />);

			const mainTab = getByDataRole(container, DataRoles.TabPanel.TabList);
			const condensedTab = mainTab.querySelectorAll("li");
			const lastTab = condensedTab[condensedTab.length - 1];
			await userEvent.click(lastTab);

			const subTab = getByDataRole(container, DataRoles.TabPanel.SubTabList);
			expect(subTab).toBeVisible();

			const firstItemOnSubMenu = subTab.querySelector("li")!;
			firstItemOnSubMenu.focus();
			await userEvent.keyboard("{Enter}");

			await waitFor(() => {
				expect(subTab).not.toBeVisible();
			});
		});
	});

	describe("Tab panel behavior tests", () => {
		const BADGE_COUNT = 9;
		const FIRST_TAB_TITLE = "Navigation";
		const tabsWithBadge: TabPanelTemplateProps.TabProps[] = [
			{
				icon: <Icon>navigation</Icon>,
				value: "Panel 1",
				id: "tab1",
				title: FIRST_TAB_TITLE,
				children: <Badge id="info-badge-id" count={BADGE_COUNT} />
			},
			{
				icon: <Icon>search</Icon>,
				value: "Panel 2",
				id: "tab2",
				title: "Search",
				ariaLabelledby: "info-badge-id"
			},
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
				icon: <Icon>airline_seat_legroom_reduced</Icon>,
				value: "Panel 5",
				title: "Airline"
			},
			{
				icon: <Icon>accessible</Icon>,
				value: "Panel 6",
				title: "Accessible"
			}
		];

		test("Should change hint according to the changing of locale", async () => {
			const { container } = render(<TabPanelExample tabs={tabsWithBadge} />);

			const tabPanel = container.querySelector(`[data-role="${DataRoles.TabPanel}"]`)!;
			expect(tabPanel).toBeTruthy();

			// Test the aria-label of the first tab
			const firstTabItem = tabPanel.querySelectorAll(`[data-role="${DataRoles.TabPanel.Tab}"]`)[0] as HTMLElement;
			const ariaLabel = firstTabItem.getAttribute("aria-label");
			expect(ariaLabel).toEqual(FIRST_TAB_TITLE);

			// Test the interaction hint text of the first tab with locale "en"
			firstTabItem.focus();

			const badgeEnglishTitle = getBadgeTitle({ count: BADGE_COUNT }, getA11yResource("en").badgeTitles);

			await waitFor(() => {
				const interactionHint = container.querySelector(`[data-role="${DataRoles.InteractionHint}"]`);
				expect(interactionHint).toBeTruthy();
				expect(interactionHint!.textContent).toEqual(`${FIRST_TAB_TITLE}, ${badgeEnglishTitle}`);
			});

			// Change the language to German
			const changeLanguageButton = container.querySelector(`[data-role="language-button"]`) as HTMLElement;
			await userEvent.click(changeLanguageButton);

			// Test the interaction hint text of the first tab with locale "de"
			firstTabItem.focus();

			const badgeGermanTitle = getBadgeTitle({ count: BADGE_COUNT }, getA11yResource("de").badgeTitles);

			await waitFor(() => {
				const interactionHint = container.querySelector(`[data-role="${DataRoles.InteractionHint}"]`);
				expect(interactionHint!.textContent).toEqual(`${FIRST_TAB_TITLE}, ${badgeGermanTitle}`);
			});

			// Change the language back to English
			await userEvent.click(changeLanguageButton);

			// Test the interaction hint text of the first tab with locale "en" again
			firstTabItem.focus();

			await waitFor(() => {
				const interactionHint = container.querySelector(`[data-role="${DataRoles.InteractionHint}"]`);
				expect(interactionHint!.textContent).toEqual(`${FIRST_TAB_TITLE}, ${badgeEnglishTitle}`);
			});
		});

		test("Render all items in the main tab when the number of items equals the maximum number that can be displayed in the main tab", async () => {
			const maxTabOnMainTab = 5;
			const tabToFitMainTab = tabsWithBadge.slice(0, maxTabOnMainTab);

			const { container } = render(<TabPanelExample tabs={tabToFitMainTab} />);

			const mainTab = container.querySelector(`[data-role="${DataRoles.TabPanel.TabList}"]`)!;
			expect(mainTab).toBeTruthy();
			expect(mainTab.querySelectorAll("li")).toHaveLength(maxTabOnMainTab);
		});

		test("Focus behavior when opening the sub-menu", async () => {
			const { container } = render(<TabPanelExceedTabExample />);

			const mainTab = container.querySelector(`[data-role="${DataRoles.TabPanel.TabList}"]`)!;
			const condensedTab = Array.from(mainTab.querySelectorAll("li")).at(-1) as HTMLElement;
			await userEvent.click(condensedTab);

			// Wait for sub-tab to appear
			let subTab: Element;
			await waitFor(() => {
				subTab = queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)!;
				expect(subTab).toBeInTheDocument();
			});
			subTab = queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)!;

			// When opened, the first interactive item should be focused (since no item is selected in the sub-menu)
			const firstItemOnSubMenu = subTab.querySelectorAll("li")[0] as HTMLElement;
			await waitFor(() => {
				expect(firstItemOnSubMenu).toHaveFocus();
			});

			// Press Escape to close the sub-menu
			await userEvent.keyboard("{Escape}");
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)).not.toBeInTheDocument();
			});
			expect(condensedTab).toHaveFocus();

			// Re-open sub-menu and press ArrowUp to focus on the last item
			await userEvent.click(condensedTab);
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)).toBeInTheDocument();
			});
			subTab = queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)!;

			await userEvent.keyboard("{ArrowUp}");
			const subTabItems = subTab.querySelectorAll("li");
			const lastItemOnSubMenu = subTabItems[subTabItems.length - 1] as HTMLElement;
			expect(lastItemOnSubMenu).toHaveFocus();

			// Click third item to select it, then close sub-menu
			const selectedItem = subTabItems[2] as HTMLElement;
			await userEvent.click(selectedItem);
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)).not.toBeInTheDocument();
			});

			// Re-open sub-menu: should focus first interactive item (not selected)
			await userEvent.click(condensedTab);
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)).toBeInTheDocument();
			});
			subTab = queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)!;

			const firstItemAfterReopen = subTab.querySelectorAll("li")[0] as HTMLElement;
			await waitFor(() => {
				expect(firstItemAfterReopen).toHaveFocus();
			});

			// Press Escape to close the sub-menu again
			await userEvent.keyboard("{Escape}");
			await waitFor(() => {
				expect(queryByDataRole(document.body, DataRoles.TabPanel.SubTabList)).not.toBeInTheDocument();
			});
			expect(condensedTab).toHaveFocus();
		});
	});
});
