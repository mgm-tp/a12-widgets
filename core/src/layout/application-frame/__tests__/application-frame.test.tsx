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
	fireEvent,
	getAllByDataRole,
	getByDataRole,
	queryAllByDataRole,
	queryByDataRole,
	render,
	setupDevice
} from "test-utils";
import { describe, vi, expect, test, beforeAll, afterEach } from "vitest";
import { page } from "vitest/browser";

import { DataRoles } from "../../../common/main/data-roles.js";
import { ApplicationHeader } from "../../../application-header/main/application-header.view.js";
import { Button } from "../../../button/main/button.view.js";
import { ButtonGroup } from "../../../button-group/main/button-group.view.js";
import { ContentBox } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { FlyoutMenu } from "../../../menu/main/flyout-menu.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { MasterDetail } from "../../master-detail/main/master-detail.view.js";
import type { MenuItem } from "../../../menu/main/menu.api.js";

import { ApplicationFrame } from "../main/application-frame.view.js";

const properties = {
	id: "test-id",
	className: "test-class",
	style: { color: "red" },
	main: <div>main</div>,
	sub: <div>sub</div>,
	subToolbar: <div>sub toolbar</div>,
	content: <div>content</div>,
	contentToolbar: <div>content toolbar</div>,
	footer: <div>footer</div>
};

describe("com.mgmtp.a12.widgets.layout.application-frame", () => {
	test("render base structure", () => {
		const { container } = render(
			<ApplicationFrame
				id={properties.id}
				className={properties.className}
				style={properties.style}
				main={properties.main}
				content={properties.content}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render content with full stuff", () => {
		const { container } = render(
			<ApplicationFrame
				main={properties.main}
				sub={properties.sub}
				subToolbar={properties.subToolbar}
				content={properties.content}
				contentToolbar={properties.contentToolbar}
				subExpanded
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render toggle button when sub area is expanded", () => {
		const { container } = render(
			<ApplicationFrame
				main={properties.main}
				sub={properties.sub}
				content={properties.content}
				subExpanded
				useToggleButton
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render toggle button when sub area is collapsed", () => {
		const { container } = render(
			<ApplicationFrame main={properties.main} sub={properties.sub} content={properties.content} useToggleButton />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render footer", () => {
		const { container } = render(
			<ApplicationFrame main={properties.main} content={properties.content} footer={properties.footer} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("disable collapsing sub", () => {
		const { container } = render(
			<ApplicationFrame main={properties.main} content={properties.content} sub={properties.sub} disableCollapsingSub />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("minimized sidebar", () => {
		const { container } = render(
			<ApplicationFrame
				main={properties.main}
				content={properties.content}
				sub={properties.sub}
				subExpandedState="minimized"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("maximized sidebar", () => {
		const { container } = render(
			<ApplicationFrame
				main={properties.main}
				content={properties.content}
				sub={properties.sub}
				subExpandedState="maximized"
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("minimized sidebar respects minWidth constraint on initial render", () => {
		const { container } = render(
			<ApplicationFrame
				main={properties.main}
				content={properties.content}
				sub={properties.sub}
				subExpanded
				subExpandedState="minimized"
				subResizableOptions={{ minWidth: "50%", maxWidth: "70%" }}
			/>
		);

		const sidebar = getByDataRole(container, DataRoles.ApplicationFrame.Sidebar.Wrapper);
		const sidebarStyle = window.getComputedStyle(sidebar);
		const sidebarWidth = parseFloat(sidebarStyle.width);

		// Get the container width to calculate the percentage
		const contentElement = getByDataRole(container, DataRoles.ApplicationFrame.Content);
		const contentWidth = parseFloat(window.getComputedStyle(contentElement).width);
		const minWidthInPx = contentWidth * 0.5;

		// The sidebar width should not be smaller than minWidth (50%)
		expect(sidebarWidth).toBeGreaterThanOrEqual(minWidthInPx);
	});

	test("render Application Frame with custom style", () => {
		const { container } = render(
			<ApplicationFrame
				main={{ content: properties.main, style: properties.style }}
				content={{ content: properties.content, style: properties.style }}
				sub={{ content: properties.sub, style: properties.style }}
				footer={{ content: properties.footer, style: properties.style }}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render application frame without main area", () => {
		const { container } = render(<ApplicationFrame main={null} content={properties.content} />);
		expect(container.querySelector(DataRoles.ApplicationFrame.Header)).toBeNull();
	});

	test("application frame with a custom attribute through `htmlAttributes`", () => {
		const { container } = render(
			<ApplicationFrame
				main={properties.main}
				content={properties.content}
				footer={properties.footer}
				htmlAttributes={{
					headerAttributes: { "aria-hidden": true },
					contentAttributes: { "aria-hidden": true },
					mainContainerAttributes: { role: undefined },
					footerAttributes: { "aria-hidden": true }
				}}
			/>
		);

		const headerElement = getByDataRole(container, DataRoles.ApplicationFrame.Header);
		const contentElement = getByDataRole(container, DataRoles.ApplicationFrame.Content);
		const mainContainerElement = getByDataRole(container, DataRoles.ApplicationFrame.Main);
		const footerElement = getByDataRole(container, DataRoles.ApplicationFrame.Footer);

		expect(headerElement?.getAttribute("aria-hidden")).toBe("true");
		expect(contentElement?.getAttribute("aria-hidden")).toBe("true");
		expect(mainContainerElement?.getAttribute("role")).toBeNull();
		expect(footerElement?.getAttribute("aria-hidden")).toBe("true");
	});
});

describe("com.mgmtp.a12.widgets.layout.application-frame.events", () => {
	describe("desktop", () => {
		test("simulate toggle sidebar button click", () => {
			const onExpansionChangeFn = vi.fn();

			const { container } = render(
				<ApplicationFrame
					main={properties.main}
					content={properties.content}
					sub={properties.sub}
					onExpansionChange={onExpansionChangeFn}
				/>
			);

			const toggleButton = getByDataRole(container, DataRoles.ApplicationFrame.ToggleSidebarButton);
			fireEvent.click(getByDataRole(toggleButton, DataRoles.Button));
			expect(onExpansionChangeFn).toHaveBeenCalledWith(true);
		});

		test("close sidebar on click outside", () => {
			const onExpansionChangeFn = vi.fn();

			render(
				<ApplicationFrame
					main={properties.main}
					content={properties.content}
					sub={properties.sub}
					subExpanded
					closeSubOnClickOutside
					onExpansionChange={onExpansionChangeFn}
				/>
			);

			fireEvent.mouseDown(document.body);
			expect(onExpansionChangeFn).toHaveBeenCalledWith(false);
		});

		test("close sidebar on click outside", () => {
			const onExpansionChangeFn = vi.fn();

			render(
				<ApplicationFrame
					main={properties.main}
					content={properties.content}
					sub={properties.sub}
					subExpanded
					closeSubOnClickOutside
					onExpansionChange={onExpansionChangeFn}
				/>
			);

			fireEvent.mouseDown(document.body);
			expect(onExpansionChangeFn).toHaveBeenCalledWith(false);
		});

		test("not close sidebar on click while disabling collapse", () => {
			const onExpansionChangeFn = vi.fn();

			render(
				<ApplicationFrame
					main={properties.main}
					content={properties.content}
					sub={properties.sub}
					subExpanded
					disableCollapsingSub
					closeSubOnClickOutside
					onExpansionChange={onExpansionChangeFn}
				/>
			);

			fireEvent.mouseDown(document.body);
			expect(onExpansionChangeFn).toHaveBeenCalledTimes(0);
		});
	});

	describe("Mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("The main container should not have tabindex", () => {
			const { container } = render(
				<ApplicationFrame
					main={{ content: properties.main, style: properties.style }}
					content={{ content: properties.content, style: properties.style }}
					sub={{ content: properties.sub, style: properties.style }}
					footer={{ content: properties.footer, style: properties.style }}
				/>
			);

			const mainElement = container.querySelector("[role='main']");
			expect(mainElement?.getAttribute("tabindex")).toBeNull();
		});

		test("Toggle sidebar button visibility based on useToggleButton", () => {
			const { container, rerender } = render(
				<ApplicationFrame
					main={{ content: properties.main, style: properties.style }}
					content={{ content: properties.content, style: properties.style }}
					sub={{ content: properties.sub, style: properties.style }}
					footer={{ content: properties.footer, style: properties.style }}
					useToggleButton
				/>
			);

			const toggleSidebarButton = queryAllByDataRole(container, DataRoles.ApplicationFrame.ToggleSidebarButton)[1];

			expect(toggleSidebarButton).toBeTruthy();

			// Should not display the toggle sidebar button when useToggleButton is false
			rerender(
				<ApplicationFrame
					main={{ content: properties.main, style: properties.style }}
					content={{ content: properties.content, style: properties.style }}
					sub={{ content: properties.sub, style: properties.style }}
					footer={{ content: properties.footer, style: properties.style }}
					useToggleButton={false}
				/>
			);

			expect(queryAllByDataRole(container, DataRoles.ApplicationFrame.ToggleSidebarButton)[1]).toBeFalsy();
		});

		test("Should not display the toggle sidebar button when sub property is not provided", () => {
			const { container } = render(
				<ApplicationFrame
					main={{ content: properties.main, style: properties.style }}
					content={{ content: properties.content, style: properties.style }}
					footer={{ content: properties.footer, style: properties.style }}
					useToggleButton
				/>
			);

			const toggleSidebarButton = queryByDataRole(container, DataRoles.ApplicationFrame.ToggleSidebarButton);

			expect(toggleSidebarButton).toBeFalsy();
		});
	});
});

const masterDetailNavItems: MenuItem[] = [
	{
		id: "data-handling",
		label: "Data Handling",
		title: "Data Handling",
		items: [
			{ id: "import", label: "Import", title: "Import data" },
			{ id: "export", label: "Export", title: "Export data" },
			{ id: "transform", label: "Transform", title: "Transform data" }
		]
	},
	{
		id: "reports",
		label: "Reports",
		title: "Reports",
		items: [
			{ id: "overview-report", label: "Overview", title: "Overview report" },
			{ id: "detail-report", label: "Detail", title: "Detail report" }
		]
	},
	{ id: "settings", label: "Settings", title: "Settings" }
];

const FullAppHeader = () => (
	<>
		<ApplicationHeader
			leftSlots={
				<>
					<a href="/home" aria-label="A12 home">
						<Icon>home</Icon>
					</a>
					<span style={{ cursor: "pointer", marginLeft: "8px" }}>Dev App</span>
				</>
			}
			rightSlots={
				<>
					<Button icon={<Icon>settings</Icon>} title="Settings" primary />
					<Button icon={<Icon>info</Icon>} label="V17.0.0-SNAPSHOT" title="Version info" primary />
				</>
			}
		/>
		<FlyoutMenu id="root" type="horizontal" useAs="main" items={masterDetailNavItems} />
	</>
);

const MasterDetailContent = () => (
	<MasterDetail
		visibleViews={[
			{
				id: "master-detail-example",
				element: (
					<ContentBox
						heading={<h2>Master Detail Example</h2>}
						footer={
							<ButtonGroup alignment="right">
								<Button label="Next" primary title="Go to next step" />
							</ButtonGroup>
						}
					>
						<p>Master Detail Example content.</p>
					</ContentBox>
				),
				width: 12
			}
		]}
	/>
);

describe("com.mgmtp.a12.widgets.layout.application-frame.with-master-detail-layout", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("renders ApplicationFrame with header, horizontal nav and MasterDetail content", () => {
		const { container } = render(<ApplicationFrame main={<FullAppHeader />} content={<MasterDetailContent />} />);

		// Header should be rendered
		const header = getByDataRole(container, DataRoles.ApplicationFrame.Header);
		expect(header).toBeInTheDocument();

		// Horizontal navigation should render the menu items (use data-role query)
		const navItemTexts = getAllByDataRole(container, DataRoles.Menu.Item.Text);
		expect(navItemTexts[0].textContent).toContain("Data Handling");

		// MasterDetail content should render the ContentBox heading
		const main = getByDataRole(container, DataRoles.ApplicationFrame.Main);
		expect(main.textContent).toContain("Master Detail Example");
	});

	test("ContentBox footer with Next button is rendered inside the main content area", () => {
		const { container } = render(<ApplicationFrame main={<FullAppHeader />} content={<MasterDetailContent />} />);

		const main = getByDataRole(container, DataRoles.ApplicationFrame.Main);
		const nextButton = main.querySelector(`[data-role="${DataRoles.Button}"][title="Go to next step"]`);
		expect(nextButton).toBeTruthy();
	});

	test("wrapper fills full height via absolute positioning, not fit-content", () => {
		const { container } = render(<ApplicationFrame main={<FullAppHeader />} content={<MasterDetailContent />} />);

		const wrapper = container.firstChild as HTMLElement;
		const wrapperStyle = window.getComputedStyle(wrapper);
		expect(wrapperStyle.position).toBe("absolute");
		expect(wrapperStyle.top).toBe("0px");
		expect(wrapperStyle.bottom).toBe("0px");

		// The content area must use flex-grow: 1 to fill the remaining height below the header.
		// If flex-grow were 0 or unset, the content area would only be as tall as its children (fit-content).
		const contentArea = getByDataRole(container, DataRoles.ApplicationFrame.Content);
		expect(window.getComputedStyle(contentArea).flexGrow).toBe("1");
	});

	test("wrapper retains absolute positioning on mobile viewport", async () => {
		await page.viewport(375, 667);
		setupDevice();

		const { container } = render(<ApplicationFrame main={<FullAppHeader />} content={<MasterDetailContent />} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(window.getComputedStyle(wrapper).position).toBe("absolute");
	});
});
