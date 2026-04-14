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

import { fireEvent, render, getByDataRole, setupDevice, queryByDataRole, waitFor } from "test-utils";
import { describe, test, expect, vi, beforeAll } from "vitest";

import { Button } from "../../button/main/button.view.js";
import { getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { ActionContentbox } from "../main/action-contentbox/action-contentbox.view.js";
import type { ActionContentboxProps } from "../main/action-contentbox/action-contentbox.api.js";
import { ActionBar, Heading, SubHeading } from "../main/action-contentbox/action-contentbox.internal.js";

const actionButtons = [
	{ label: "Action 1", align: "left" },
	{ label: "Action 2", align: "right" }
].map((item, index) => ({
	align: item.align as ActionContentboxProps.ButtonAlignment,
	button: <Button key={index} label={item.label} />
}));

describe("com.mgmtp.a12.widgets.contentbox.action-contentbox", () => {
	const baseActionContentboxProps: Partial<ActionContentboxProps> = {
		id: "test-id",
		className: "test-class",
		style: { color: "red" },
		role: "test-role",
		ariaLabel: "test-aria-label"
	};
	test("rendering-action-contentbox", () => {
		const test = "test";
		const wrapperRefSpy = vi.fn();
		const contentRefSpy = vi.fn();
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();
		const onKeyDownSpy = vi.fn();

		const { container } = render(
			<ActionContentbox
				{...baseActionContentboxProps}
				headingElements={test}
				notificationArea={test}
				wizardBar={test}
				hideWizardBarOnScroll={true}
				footer={test}
				padding={20}
				embedded={true}
				wrapperRef={wrapperRefSpy}
				contentRef={contentRefSpy}
				onBlur={onBlurSpy}
				onFocus={onFocusSpy}
				onKeyDown={onKeyDownSpy}
			>
				test
			</ActionContentbox>
		);

		expect(container.firstChild).toMatchSnapshot();
		expect(wrapperRefSpy).toHaveBeenCalledTimes(1);
		expect(contentRefSpy).toHaveBeenCalledTimes(1);

		const contentBox = getByDataRole(container, DataRoles.Contentbox);

		fireEvent.focus(contentBox);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);
		fireEvent.blur(contentBox);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(contentBox);
		expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
	});

	test("rendering-heading-subheading-action-content-box", () => {
		const test = "test";

		const { container } = render(
			<ActionContentbox
				navigation={test}
				subActionBar={test}
				breadcrumbs={test}
				headingButtons={test}
				headingElements={test}
				buttons={actionButtons}
				headingPrefixes={test}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});

describe("com.mgmtp.a12.widgets.contentbox.action-contentbox.template", () => {
	const propertiesGlobal = {
		id: "test-id",
		style: {
			color: "red"
		},
		className: "test-class"
	};

	describe("desktop", () => {
		test("rendering-heading", () => {
			const properties = {
				...propertiesGlobal,
				headingElement: <div id="headingElement">heading element</div>,
				headingPrefixes: "prefix",
				headingButton: "heading button"
			};
			const { container } = render(<Heading headingElements={properties.headingElement} {...properties} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-heading-with-subtitles", () => {
			const properties = {
				...propertiesGlobal,
				headingElements: (
					<>
						<div id="headingElement">heading element</div>
						<p id="subtitle">heading subtitle</p>
					</>
				),
				headingPrefixes: "prefix",
				headingButton: "heading button"
			};
			const { container } = render(<Heading {...properties} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-sub-heading", () => {
			const properties = {
				...propertiesGlobal,
				navigation: <div id="navigation" />,
				subActionBar: <div id="subActionBar" />,
				breadcrumbs: <div id="breadcrumbs" />
			};
			const { container } = render(<SubHeading {...properties} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("rendering-action-bar", () => {
			const { container } = render(<ActionBar {...propertiesGlobal} buttons={actionButtons} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render-no-back-button-when-no-context-defined", () => {
			const { container } = render(<ActionContentbox headingElements="test" />);
			expect(container.firstChild).toMatchSnapshot();
		});

		test("should render the default heading if there's no custom heading", () => {
			const { container } = render(
				<ActionContentbox
					headingElements={<div>Heading Elements</div>}
					headingButtons={<Button>Close</Button>}
					headingPrefixes={<div>Heading prefix</div>}
				/>
			);

			expect(getByDataRole(container, DataRoles.Contentbox.Heading)).toBeTruthy();
			expect(getByDataRole(container, DataRoles.Contentbox.Addon.Suffix)).toBeTruthy();
			expect(getByDataRole(container, DataRoles.Contentbox.Addon.Prefix)).toBeTruthy();
		});

		test("should render the custom heading", () => {
			const customHeadingDataRole = "custom-heading";
			const { container } = render(
				<ActionContentbox
					componentRenderers={{ heading: <div data-role={customHeadingDataRole}>Custom Heading</div> }}
					headingElements={<div>Heading Elements</div>}
					headingButtons={<Button>Close</Button>}
					headingPrefixes={<div>Heading prefix</div>}
				/>
			);

			expect(getByDataRole(container, customHeadingDataRole)).toBeTruthy();
			expect(queryByDataRole(container, DataRoles.Contentbox.Heading)).toBeFalsy();
			expect(queryByDataRole(container, DataRoles.Contentbox.Addon.Prefix)).toBeFalsy();
			expect(queryByDataRole(container, DataRoles.Contentbox.Addon.Suffix)).toBeFalsy();
		});

		test("should update the hint for heading action button after opening popup menu", async () => {
			const properties = {
				...propertiesGlobal,
				headingElements: (
					<>
						<div id="headingElement">heading element</div>
						<p id="subtitle">heading subtitle</p>
					</>
				),
				headingPrefixes: "prefix",
				headingButton: <Button label="heading button" />
			};
			const { container } = render(
				<InteractionHintConfigProvider enableInteractionHint>
					<Heading {...properties} compact={true} buttons={<Button label="Test heading" />} />
				</InteractionHintConfigProvider>
			);

			const triggerElement = getByDataRole(container, "popup-trigger-element");

			fireEvent.focus(triggerElement);

			const hint = getByDataRole(container, "interaction-hint").textContent;

			expect(hint).toEqual(getA11yResource("en").contentboxTitles?.combinationMenuTriggerOpen);

			fireEvent.click(triggerElement);

			const popup = getByDataRole(container, "popup");

			expect(popup).toBeTruthy();

			fireEvent.mouseOver(triggerElement);

			await waitFor(() => {
				const hint = getByDataRole(container, "interaction-hint").textContent;
				expect(hint).toEqual(getA11yResource("en").contentboxTitles?.combinationMenuTriggerClose);
			});
		});
	});

	describe("mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("should have default headerTitle combination content box", () => {
			const properties = {
				...propertiesGlobal,
				headingElements: (
					<>
						<div id="headingElement">heading element</div>
						<p id="subtitle">heading subtitle</p>
					</>
				),
				headingPrefixes: "prefix",
				headingButton: "heading button",
				compact: true,
				buttons: actionButtons
			};
			const { container } = render(<Heading {...properties} />);

			const popUp = getByDataRole(container, DataRoles.Popup);
			const buttonTrigger = getByDataRole(popUp, DataRoles.Popup.TriggerElement);
			fireEvent.click(buttonTrigger);

			expect(container).toMatchSnapshot();

			const headingTitle = getByDataRole(container, DataRoles.Popup.HeaderTitle);
			expect(headingTitle.textContent).toEqual(getA11yResource("en").contentboxTitles?.combinationMenuTitle);
		});
	});
});
