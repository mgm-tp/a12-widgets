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

import { render, fireEvent, queryByDataRole, getByDataRole } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { ContentBox, ContentBoxElements } from "../main/template/contentbox.tpl.view.js";

describe("com.mgmtp.a12.widgets.contentbox", () => {
	test("rendering-contentbox-with-provided-properties", () => {
		const properties = {
			id: "test-id",
			style: {
				backgroundColor: "red"
			},
			className: "test-class"
		};
		const { container } = render(<ContentBox heading={<div id="test" />} {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("other-elements-contentbox", () => {
		const { container } = render(
			<ContentBox
				notificationArea={<div id="test" />}
				footer={<div id="footer" />}
				subHeading={<div id="sub-heading" />}
				heading={<div />}
				wizardBar={<div id="wizard">a</div>}
				tabIndex={0}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("padding-contentbox", () => {
		const padding = [undefined, false, 24, "24px"];

		padding.forEach((e) => {
			const { container } = render(<ContentBox padding={e} heading={<div />} />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("embedded-contentbox", () => {
		const { container } = render(<ContentBox embedded heading={<div />} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-wrapperRef-contentRef", () => {
		const wrapperRefSpy = vi.fn();
		const contentRefSpy = vi.fn();
		render(<ContentBox contentRef={contentRefSpy} wrapperRef={wrapperRefSpy} heading={<div />} />);
		expect(wrapperRefSpy).toHaveBeenCalledTimes(1);
		expect(contentRefSpy).toHaveBeenCalledTimes(1);
	});

	test("simulating-onBlur-onFocus-onKeyDown-Contentbox", () => {
		const onBlurSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onKeyDownSpy = vi.fn();

		const { container } = render(
			<ContentBox onFocus={onFocusSpy} onBlur={onBlurSpy} onKeyDown={onKeyDownSpy} heading={<div />} />
		);

		const contentBox = getByDataRole(container, DataRoles.Contentbox);

		fireEvent.blur(contentBox);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);
		fireEvent.focus(contentBox);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(contentBox);
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.contentboxTpl", () => {
	const properties = {
		id: "test-id",
		style: {
			color: "red"
		},
		className: "test-class"
	};
	const components = [
		{
			component: (
				<ContentBoxElements.Heading {...properties}>
					<div id="children" />
				</ContentBoxElements.Heading>
			),
			componentName: "Heading"
		},
		{
			component: (
				<ContentBoxElements.HeadingAddon {...properties}>
					<div id="children" />
				</ContentBoxElements.HeadingAddon>
			),
			componentName: "HeadingAddon"
		},
		{
			component: (
				<ContentBoxElements.NotificationArea {...properties}>
					<div id="children" />
				</ContentBoxElements.NotificationArea>
			),
			componentName: "NotificationArea"
		},
		{
			component: <ContentBoxElements.Title {...properties} />,
			componentName: "Title"
		},
		{
			component: (
				<ContentBoxElements.SubHeading {...properties}>
					<div id="children" />
				</ContentBoxElements.SubHeading>
			),
			componentName: "SubHeading"
		},
		{
			component: (
				<ContentBoxElements.ActionBar {...properties}>
					<div id="children" />
				</ContentBoxElements.ActionBar>
			),
			componentName: "ActionBar"
		},
		{
			component: (
				<ContentBoxElements.SubActionBar {...properties}>
					<div id="children" />
				</ContentBoxElements.SubActionBar>
			),
			componentName: "SubActionBar"
		},
		{
			component: <ContentBoxElements.ActionBarGroupArea {...properties} />,
			componentName: "ActionBarGroupArea"
		},
		{
			component: (
				<ContentBoxElements.ActionBarGroup {...properties}>
					<div id="children" />
				</ContentBoxElements.ActionBarGroup>
			),
			componentName: "ActionBarGroup"
		},
		{
			component: (
				<ContentBoxElements.ActionBarGroupDivider {...properties}>
					<div id="children" />
				</ContentBoxElements.ActionBarGroupDivider>
			),
			componentName: "ActionBarGroupDivider"
		},
		{
			component: (
				<ContentBoxElements.Footer {...properties}>
					<div id="children" />
				</ContentBoxElements.Footer>
			),
			componentName: "Footer"
		}
	];

	components.forEach((e) => {
		test(`rendering-base-${e.componentName}`, () => {
			const { container } = render(e.component);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("rendering-heading", () => {
		const { container } = render(
			<ContentBoxElements.Heading icon="reply" prefixes={<div>prefix</div>} suffixes={<div>suffix</div>} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-color-heading", () => {
		const { container } = render(<ContentBoxElements.Heading icon="reply" color="red" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("testing-on-click-heading", () => {
		const onClickSpy = vi.fn();
		const { container } = render(<ContentBoxElements.Heading onClick={onClickSpy} />);

		fireEvent.click(getByDataRole(container, DataRoles.Contentbox.Heading));
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});

	test("rendering-title", () => {
		const { container } = render(<ContentBoxElements.Title ariaLevel={1} text="text" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-action-bar-group-area", () => {
		const { container } = render(
			<ContentBoxElements.ActionBarGroupArea
				leftSlot={[<div key={0} id="leftSlotElement" />]}
				rightSlot={[<div key={1} id="rightSlotElement" />]}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("back-button", () => {
		const backButtonClickSpy = vi.fn();
		const backButtonTitle = "back-title";
		const { container } = render(
			<A11YLanguageContext.Provider value={{ contentboxTitles: { backButtonTitle: backButtonTitle } }}>
				<ContentBoxElements.BackButton onClick={backButtonClickSpy} />
			</A11YLanguageContext.Provider>
		);
		expect(container.firstChild).toMatchSnapshot();
		fireEvent.click(container.getElementsByTagName("button")[0]);
		expect(backButtonClickSpy).toHaveBeenCalledTimes(1);
	});

	test("box-shadow", () => {
		const { container: containerWithBoxShadow } = render(<ContentBox heading={<div />} boxShadow="always" />);
		expect(containerWithBoxShadow.firstChild).toHaveStyle({ boxShadow: "0 1px 2px 0 rgba(22,25,29,0.4)" });

		const { container: containerWithoutBoxShadow } = render(<ContentBox heading={<div />} boxShadow="none" />);
		expect(containerWithoutBoxShadow.firstChild).toHaveStyle({ boxShadow: "none" });
	});

	test("should not show heading if childrenOnly is true", () => {
		const { container } = render(
			<ContentBox heading={<ContentBoxElements.Heading childrenOnly={true} />} boxShadow="always" />
		);

		expect(queryByDataRole(container, DataRoles.Contentbox.Heading)).toBeNull();
	});

	test("Check Title element with custom attributes by `htmlAttributes` property", () => {
		const htmlAttributes = {
			"data-testid": "custom-title",
			"aria-label": "Custom Aria Label"
		};

		const { getByDataRole } = render(
			<ContentBoxElements.Title text={<span>Title with HTML attributes</span>} htmlAttributes={htmlAttributes} />
		);

		const titleElement = getByDataRole(DataRoles.Contentbox.Title);

		expect(titleElement.textContent).toBe("Title with HTML attributes");
		expect(titleElement).toHaveAttribute("data-testid", "custom-title");
		expect(titleElement).toHaveAttribute("aria-label", "Custom Aria Label");
	});

	test("rendering-contentbox-with-sidepanel", () => {
		const { container } = render(
			<ContentBox
				heading={<div />}
				sidePanels={{
					right: {
						hide: false,
						mode: "overlay",
						width: "300px",
						content: <div id="side-panel">side</div>
					}
				}}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});
