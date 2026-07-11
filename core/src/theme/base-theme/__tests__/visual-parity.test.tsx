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

import type { ReactElement } from "react";
import type { DefaultTheme } from "styled-components";
import { describe, expect, test } from "vitest";

import { render } from "../../../common/test/test-utils.js";
import { Accordion } from "../../../accordion/index.js";
import { Button } from "../../../button/index.js";
import { Card } from "../../../card/index.js";
import { ContentBox } from "../../../contentbox/index.js";
import { DatePicker } from "../../../datepicker/index.js";
import { DropDown } from "../../../dropdown/index.js";
import { TextField, Checkbox, Radio } from "../../../input/index.js";
import { Link } from "../../../link/index.js";
import { List } from "../../../list/index.js";
import { ModalOverlay } from "../../../modal-overlay/index.js";
import { TabPanel } from "../../../tab-panel/index.js";
import { Tag } from "../../../tag/index.js";
import { TagInput } from "../../../tag-input/index.js";
import { Toggle } from "../../../toggle/index.js";
import { Tooltip } from "../../../tooltip/index.js";
import { getFlatCompactTheme } from "../../flat-compact/flat-compact-theme.js";

import { getBaseTheme } from "../base-theme.js";

const KEYS = [
	"backgroundColor",
	"color",
	"borderTopLeftRadius",
	"borderTopRightRadius",
	"borderBottomLeftRadius",
	"borderBottomRightRadius",
	"paddingTop",
	"paddingBottom",
	"paddingLeft",
	"paddingRight",
	"fontFamily",
	"fontSize",
	"fontWeight",
	"borderTopWidth",
	"borderTopStyle",
	"borderTopColor",
	"borderRightWidth",
	"borderRightStyle",
	"borderRightColor",
	"borderBottomWidth",
	"borderBottomStyle",
	"borderBottomColor",
	"borderLeftWidth",
	"borderLeftStyle",
	"borderLeftColor",
	"boxShadow",
	"lineHeight",
	"textAlign"
] as const;

const stylesOf = (element: Element): Record<string, string> => {
	const computedStyle = getComputedStyle(element);
	const out: Record<string, string> = {};

	for (const key of KEYS) {
		out[key] = computedStyle[key as unknown as keyof CSSStyleDeclaration] as string;
	}

	return out;
};

const renderWithTheme = (ui: ReactElement, theme: DefaultTheme): Element => {
	const { container } = render(ui, { theme });

	return container.firstElementChild as Element;
};

const renderPair = (ui: ReactElement) => {
	const base = renderWithTheme(ui, getBaseTheme() as unknown as DefaultTheme);
	const flatCompact = renderWithTheme(ui, getFlatCompactTheme() as unknown as DefaultTheme);

	return { base, flatCompact };
};

describe("base-theme visual parity vs flat-compact", () => {
	test("renders Button identically to flat-compact", () => {
		const { base, flatCompact } = renderPair(<Button>Sample</Button>);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders primary Button identically to flat-compact", () => {
		const { base, flatCompact } = renderPair(<Button primary>Primary</Button>);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders TextField identically to flat-compact", () => {
		const { base, flatCompact } = renderPair(<TextField value="x" onChange={() => undefined} />);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Card identically to flat-compact", () => {
		const { base, flatCompact } = renderPair(
			<Card>
				<Card.Content>Card content</Card.Content>
			</Card>
		);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Accordion identically to flat-compact", () => {
		const tree = (
			<Accordion.Container>
				<Accordion.Section>
					<Accordion.Summary>Summary</Accordion.Summary>
					<Accordion.Details>Detail</Accordion.Details>
				</Accordion.Section>
			</Accordion.Container>
		);
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders ModalOverlay identically to flat-compact", () => {
		const tree = <ModalOverlay>Overlay content</ModalOverlay>;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders ContentBox identically to flat-compact", () => {
		const tree = <ContentBox heading={<span>Heading</span>}>Body content</ContentBox>;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders List identically to flat-compact", () => {
		const tree = (
			<List>
				<List.Item text="Row 1" />
			</List>
		);
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders TabPanel identically to flat-compact", () => {
		const tree = <TabPanel tabs={[{ value: "t1", title: "Tab 1" }]}>Content</TabPanel>;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Tag identically to flat-compact", () => {
		const tree = <Tag>Label</Tag>;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders TagInput identically to flat-compact", () => {
		const tree = <TagInput />;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Toggle identically to flat-compact", () => {
		const tree = (
			<Toggle>
				<Toggle.Item value="a">A</Toggle.Item>
				<Toggle.Item value="b">B</Toggle.Item>
			</Toggle>
		);
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Tooltip identically to flat-compact", () => {
		const tree = (
			<Tooltip text="Hint">
				<button type="button">i</button>
			</Tooltip>
		);
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Checkbox identically to flat-compact", () => {
		const tree = <Checkbox checked label="Check me" onChange={() => undefined} />;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Radio identically to flat-compact", () => {
		const tree = <Radio label="Option" />;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders Link identically to flat-compact", () => {
		const tree = <Link href="#">Click me</Link>;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders DropDown identically to flat-compact", () => {
		const tree = <DropDown items={[{ id: "1", label: "One", title: "One" }]} />;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});

	test("renders DatePicker identically to flat-compact", () => {
		const tree = <DatePicker id="dp1" />;
		const { base, flatCompact } = renderPair(tree);
		expect(stylesOf(base)).toEqual(stylesOf(flatCompact));
	});
});
