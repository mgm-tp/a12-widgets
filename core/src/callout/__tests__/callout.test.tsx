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

import { createReferenceElement, getAllByDataRole, getByDataRole, removeReferenceElement, render } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";
import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";

import { Callout } from "../main/callout.view.js";
import { CalloutTpl } from "../main/template/callout.tpl.view.js";

const baseClass = "callout";

describe("com.mgmtp.a12.widgets.callout.template", () => {
	const headerTitle = "header";
	const headerPrefix = <Button icon={<Icon>chevron_left</Icon>} />;
	const headerSuffix = <Button icon={<Icon>close</Icon>} />;
	const body = "body";
	const footer = "footer";

	const properties = {
		id: "test-id",
		className: "test-class",
		style: {
			color: "red"
		},
		isPointerVisible: true
	};

	test("rendering-callout-template", () => {
		const { container } = render(<CalloutTpl />);
		expect(getAllByDataRole(container, `${baseClass}`)).toBeTruthy();
		expect(getAllByDataRole(container, `${baseClass}-inner`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-body`)).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-inner-container", () => {
		const { container } = render(
			<CalloutTpl header={{ title: headerTitle, suffix: headerSuffix, prefix: headerPrefix }} footer={footer}>
				{body}
			</CalloutTpl>
		);

		expect(getAllByDataRole(container, `${baseClass}-header`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-header-prefix`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-header-title`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-header-suffix`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-footer`)).toHaveLength(1);
		expect(getAllByDataRole(container, `${baseClass}-footer`)[0].textContent).toEqual(footer);
		expect(getAllByDataRole(container, `${baseClass}-body`)[0].textContent).toEqual(body);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-properties", () => {
		const { container } = render(<CalloutTpl {...properties} />);
		expect(getAllByDataRole(container, `${baseClass}-pointer`)).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-resizeAndDrag", () => {
		const { container } = render(<CalloutTpl resizeAndDrag header={{ title: headerTitle }} />);
		expect(container.querySelectorAll(".handle")).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-define-padding", () => {
		const { container } = render(<CalloutTpl padding={10} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-callout-template-with-zero-padding", () => {
		const { container } = render(<CalloutTpl padding={false} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("get-wrapper-ref", () => {
		const wrapperRef = vi.fn();
		render(<CalloutTpl wrapperRef={wrapperRef} />);
		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});

	test("Callout Template with `htmlAttributes` property", () => {
		const ariaLabel = "Test Custom Label";
		const { getByDataRole } = render(
			<CalloutTpl
				id="callout-with-attrs"
				htmlAttributes={{
					"aria-label": ariaLabel
				}}
			/>
		);

		const calloutElement = getByDataRole(DataRoles.Callout);
		expect(calloutElement).toBeTruthy();
		expect(calloutElement.getAttribute("aria-label")).toBe(ariaLabel);
	});
});

describe("com.mgmtp.a12.widgets.callout", () => {
	test("rendering-default-callout", async () => {
		const referenceElement = createReferenceElement();
		const { container } = render(
			<Callout referenceElement={referenceElement} closeOnOutsideClick closeOnEsc orientationList={["bottom", "top"]}>
				<p>body</p>
			</Callout>
		);
		expect(getByDataRole(container, DataRoles.Portal)).toMatchSnapshot();
		removeReferenceElement(referenceElement);
	});

	test("rendering-callout-with-resizeAndDrag", async () => {
		const referenceElement = createReferenceElement();
		const { container } = render(
			<Callout
				referenceElement={referenceElement}
				closeOnOutsideClick
				closeOnEsc
				orientationList={["bottom", "top"]}
				resizeAndDragOptions={{
					referenceElement: referenceElement,
					minWidth: 320,
					minHeight: 250
				}}
			/>
		);

		expect(getByDataRole(container, DataRoles.Portal)).toMatchSnapshot();
		removeReferenceElement(referenceElement);
	});

	test("Callout with `htmlAttributes` property", async () => {
		const referenceElement = createReferenceElement();
		const ariaLabel = "Test Custom Label";
		const { getByDataRole } = render(
			<Callout
				referenceElement={referenceElement}
				id="callout-test"
				htmlAttributes={{
					"aria-label": ariaLabel
				}}
			>
				<p>Callout content</p>
			</Callout>
		);

		const calloutElement = getByDataRole(DataRoles.Callout);
		expect(calloutElement).toBeTruthy();
		expect(calloutElement.getAttribute("aria-label")).toBe(ariaLabel);

		removeReferenceElement(referenceElement);
	});
});
