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

import { render, fireEvent } from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { ExternalLink } from "../main/external-link/external-link.view.js";
import { Link } from "../main/link/link.view.js";
import { MailtoLink } from "../main/mailto-link/mailto-link.view.js";

describe("com.mgmtp.a12.widgets.link", () => {
	const content = "This is a link";
	const exampleHref = "exampleHref";

	test("render a basic link", () => {
		const { container } = render(
			<Link id="test-id" className="test-class" style={{ color: "red" }} href={exampleHref}>
				{content}
			</Link>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render a link with icon", () => {
		const { container } = render(
			<Link title="Test Title">
				<Icon>check_circle</Icon> {content}
			</Link>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render an external link", () => {
		const { container } = render(<ExternalLink href={exampleHref}>{content}</ExternalLink>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render a mailto link", () => {
		const { container } = render(<MailtoLink to="example@gmail.com">{content}</MailtoLink>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate click event", () => {
		const onClickSpy = vi.fn();

		const { getByDataRole } = render(<Link onClick={onClickSpy}>{content}</Link>);

		fireEvent.click(getByDataRole(DataRoles.Link));
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});

	test("render link with html attribute by linkAttributes property", () => {
		const { container } = render(<Link linkAttributes={{ "aria-disabled": "true" }}>{content}</Link>);
		expect(container.querySelector(`a`)?.getAttribute("aria-disabled")).toBeTruthy();
	});

	test("test the link is used as a button", () => {
		const onClickSpy = vi.fn();

		const { getByDataRole } = render(
			<Link useAsButton onClick={onClickSpy}>
				{content}
			</Link>
		);
		const linkElement = getByDataRole(DataRoles.Link);

		expect(linkElement?.getAttribute("role")).toBe("button");

		// Check if the click event can be triggered by the Spacebar.
		fireEvent.keyDown(linkElement, { key: " ", code: "Space", charCode: 32 });
		expect(onClickSpy).toHaveBeenCalledTimes(1);
	});

	describe("interaction hint", () => {
		test("link should show hint when componentConfigs.link=true", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ link: true }}>
					<Link href="#test" title="Test link">
						{content}
					</Link>
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent?.textContent).toEqual("Test link");
		});

		test("link should show hint when componentConfigs.link=false", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ link: false }}>
					<Link href="#test" title="Test link">
						{content}
					</Link>
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});
