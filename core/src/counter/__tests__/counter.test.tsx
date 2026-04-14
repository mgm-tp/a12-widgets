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

import { getAllByDataRole, getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import type { CounterProps } from "../main/counter.api.js";
import { Counter } from "../main/counter.view.js";

describe("com.mgmtp.a12.widgets.counter", () => {
	const props: Partial<CounterProps> = {
		id: "test-id",
		className: "test-class",
		style: { background: "red" },
		value: 23
	};

	test("render counter", () => {
		const { container } = render(<Counter {...props} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render counter with placeholder", () => {
		const placeholder = "---";
		const { container } = render(<Counter placeholder={placeholder} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render counter with addon", () => {
		const { container } = render(
			<Counter value={props.value} addonBefore={<Icon>done</Icon>} addonAfter={<Icon>error</Icon>} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render variant counter", () => {
		const types: CounterProps["type"][] = ["default", "constructive", "destructive", undefined];
		types.forEach((type) => {
			const { container } = render(<Counter value={props.value} type={type} />);
			expect(container.firstChild).toMatchSnapshot();
		});
	});

	test("render secondary counter", () => {
		const { container } = render(<Counter value={props.value} secondary />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render interactive counter", () => {
		const { container } = render(<Counter value={props.value} interactive />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render overflowed counter", () => {
		const { container } = render(<Counter value={props.value} overflowCount={99} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render hidden description", () => {
		const { container } = render(<Counter value={props.value} hiddenDescription="Hidden description" />);
		expect(getAllByDataRole(container, "hidden-text")[0]?.textContent).toContain("Hidden description");
	});

	test("test onMouseOver and onMouseLeave events", () => {
		const onMouseOverSpy = vi.fn();
		const onMouseLeaveSpy = vi.fn();
		const { container } = render(
			<Counter value={props.value} onMouseOver={onMouseOverSpy} onMouseLeave={onMouseLeaveSpy} />
		);
		const counter = getByDataRole(container, DataRoles.Counter);

		fireEvent.mouseOver(counter);
		expect(onMouseOverSpy).toHaveBeenCalledTimes(1);

		fireEvent.mouseLeave(counter);
		expect(onMouseLeaveSpy).toHaveBeenCalledTimes(1);
	});

	describe("interaction hint", () => {
		const title = "12 tasks completed";

		test("show interaction hint on interactive counter", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint>
					<Counter value={props.value} interactive title={title} />
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const interactionHint = queryByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toContain(title);
		});

		test("interactive counter should show hint when componentConfigs.counter=true", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ counter: true }}>
					<Counter value={42} title={title} interactive />
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const interactionHint = queryByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toContain(title);
		});

		test("interactive counter should not show hint when componentConfigs.counter=false", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ counter: false }}>
					<Counter value={42} title={title} interactive />
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});
