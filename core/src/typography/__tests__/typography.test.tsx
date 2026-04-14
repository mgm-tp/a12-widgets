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

import { getByDataRole, render, fireEvent } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test } from "vitest";

import { Icon } from "../../icon/main/icon.view.js";

import { Typography } from "../main/typography.view.js";
import type { BodyProps, HeadlineProps } from "../main/typography.api.js";

const { Headline, Body, Section } = Typography;

describe("com.mgmtp.a12.widgets.typography", () => {
	const baseProps = {
		id: "test-id",
		className: "test-class",
		style: { backgroundColor: "red" }
	};
	const headlineProperties: HeadlineProps = {
		...baseProps,
		color: "blue",
		alignment: "left",
		level: 1,
		ariaLevel: 1
	};

	test("rendering typography", () => {
		const { container } = render(
			<Headline {...headlineProperties} divider>
				Test Headline
			</Headline>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering typography with custom html tag", () => {
		const { container } = render(
			<Headline level={1} htmlTag="span">
				Test Headline
			</Headline>
		);
		expect(container.firstElementChild?.tagName).toEqual("SPAN");
	});

	test("rendering typography with center alignment", () => {
		const { container } = render(
			<Headline level={1} alignment="center">
				Test Headline
			</Headline>
		);
		const title = getByDataRole(container, "typography-headline-title");
		expect(title).toHaveStyle({ justifyContent: "center" });
	});

	test("rendering typography with right alignment", () => {
		const { container } = render(
			<Headline level={1} alignment="right">
				Test Headline
			</Headline>
		);
		const title = getByDataRole(container, "typography-headline-title");
		expect(title).toHaveStyle({ justifyContent: "flex-end" });
	});

	test("rendering collapsible typography", () => {
		const { container } = render(
			<Headline level={1} collapsible>
				Test Headline
			</Headline>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("swap position of graphic icon and addons and align icons to center", () => {
		const { container } = render(
			<Headline level={1} collapsible addons={<Icon>edit</Icon>} swapAddonsPosition iconVerticalAlignment="middle">
				<p>Test Headline</p>
				<p>With positions of graphic icon and addons swapped</p>
			</Headline>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("align addons and graphic icon to bottom", () => {
		const { container } = render(
			<Headline level={1} collapsible addons={<Icon>edit</Icon>} swapAddonsPosition iconVerticalAlignment="bottom">
				<p>Test Headline</p>
				<p>With positions of graphic icon and addons swapped</p>
			</Headline>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering typography body", () => {
		const bodyProperties: BodyProps = {
			...baseProps,
			color: "blue",
			alignment: "center"
		};
		const { container } = render(<Body {...bodyProperties}>Test Body</Body>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering typography section", () => {
		const { container } = render(
			<Section role="form" {...baseProps}>
				Test Section
			</Section>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate typography headline events", () => {
		const onCollapsingChangeSpy = vi.fn();
		const { container } = render(
			<Headline level={1} collapsible onCollapsingChange={onCollapsingChangeSpy}>
				Test Headline
			</Headline>
		);

		fireEvent.click(getByDataRole(container, "typography-headline"));
		expect(onCollapsingChangeSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(getByDataRole(container, "typography-headline"), { key: Key.Enter });
		expect(onCollapsingChangeSpy).toHaveBeenCalledTimes(1);
	});
});
