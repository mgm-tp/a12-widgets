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

import { render, getAllByDataRole, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { Card } from "../main/card.view.js";

const baseClassName = "card";

describe("com.mgmtp.a12.widgets.card", () => {
	const properties = {
		id: "test-id",
		style: {
			backgroundColor: "red"
		},
		className: "test-class",
		useLinkRole: true
	};

	const testText = "Test Text";

	test("rendering-card", () => {
		const { container } = render(<Card {...properties} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-card-with-card-contain", () => {
		const { container } = render(
			<Card>
				<Card.Content>{testText}</Card.Content>
			</Card>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-card-media", () => {
		const { container } = render(
			<Card.Media {...properties}>
				<div id="test">{testText}</div>
			</Card.Media>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-card-content", () => {
		const { container } = render(
			<Card.Content {...properties}>
				<div id="test">{testText}</div>
			</Card.Content>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-card-action-area", () => {
		const { container } = render(
			<Card.ActionArea {...properties}>
				<div id="test">{testText}</div>
			</Card.ActionArea>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-click-event-on-card-action-area", () => {
		const onClickEvent = vi.fn();

		const { container } = render(<Card.ActionArea useLinkRole={false} onClick={onClickEvent} />);
		const items = getAllByDataRole(container, `${baseClassName}-action-area`);
		fireEvent.click(items[0]);

		expect(onClickEvent).toHaveBeenCalledTimes(1);
	});

	test("simulating-enter-keydown-on-card-action-area", () => {
		const onClickEvent = vi.fn();

		const { container } = render(<Card.ActionArea useLinkRole={false} onClick={onClickEvent} />);

		const items = getAllByDataRole(container, `${baseClassName}-action-area`);
		fireEvent.keyDown(items[0], { key: "Enter", code: "Enter", charCode: 13 });
		expect(onClickEvent).toHaveBeenCalledTimes(1);
	});
});
