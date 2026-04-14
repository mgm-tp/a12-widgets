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
import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { InteractiveTile } from "../main/interactive-tile.view.js";

const TileContent = ({ label }: { label: string }): ReactElement => (
	<>
		<div>{label}</div>
		<Icon size="big">location_on</Icon>
	</>
);

describe("com.mgmtp.a12.widgets.interactive-tile", () => {
	test("render primary tile", () => {
		const { container } = render(
			<InteractiveTile primary>
				<TileContent label="Primary Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render active primary tile", () => {
		const { container } = render(
			<InteractiveTile primary active>
				<TileContent label="Primary Active Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled primary tile", () => {
		const { container } = render(
			<InteractiveTile primary disabled>
				<TileContent label="Primary Disabled Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render secondary tile", () => {
		const { container } = render(
			<InteractiveTile secondary>
				<TileContent label="Secondary Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render active secondary tile", () => {
		const { container } = render(
			<InteractiveTile secondary active>
				<TileContent label="Secondary Active Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled secondary tile", () => {
		const { container } = render(
			<InteractiveTile secondary disabled>
				<TileContent label="Secondary Disabled Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render primary selected tile", () => {
		const { container } = render(
			<InteractiveTile primary selected>
				<TileContent label="Primary Selected Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render secondary selected tile", () => {
		const { container } = render(
			<InteractiveTile secondary selected>
				<Icon size="big">location_on</Icon>
				<TileContent label="Secondary Selected Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default tile same as the style of secondary title", () => {
		const { container } = render(
			<InteractiveTile>
				<TileContent label="Default Tile" />
			</InteractiveTile>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render interactive tile as a link with alternative text and hint", () => {
		const title = "Interactive Title";
		const ariaLabel = "selected title";
		const { container } = render(
			<InteractionHintConfigProvider enableInteractionHint>
				<InteractiveTile secondary selected title={title} htmlAttributes={{ role: "link", "aria-label": ariaLabel }}>
					<Icon size="big">location_on</Icon>
					<TileContent label="Secondary Selected Tile" />
				</InteractiveTile>
			</InteractionHintConfigProvider>
		);

		const interactiveTile = getByDataRole(container, DataRoles.InteractiveTile);

		expect(interactiveTile.getAttribute("aria-label")).toEqual(`${ariaLabel}, ${title}`);

		fireEvent.focus(interactiveTile);

		expect(getByDataRole(container, DataRoles.InteractionHint).textContent).toEqual(title);
	});

	test("Should not trigger click event when Enter and Space key is pressed when disabled", async () => {
		const handleClick = vi.fn();

		render(
			<InteractiveTile primary onClick={handleClick} disabled>
				<div>Interactive Tile</div>
			</InteractiveTile>
		);

		await userEvent.keyboard("{Enter}");

		expect(handleClick).not.toHaveBeenCalled();
		handleClick.mockReset();

		await userEvent.keyboard("{Space}");

		expect(handleClick).not.toHaveBeenCalled();
	});

	test("triggers click event when Enter and Space key is pressed", async () => {
		const handleClick = vi.fn();

		render(
			<InteractiveTile primary onClick={handleClick}>
				<div>Interactive Tile</div>
			</InteractiveTile>
		);

		await userEvent.tab();
		await userEvent.keyboard("{Enter}");

		expect(handleClick).toHaveBeenCalledTimes(1);
		handleClick.mockReset();

		await userEvent.keyboard("{Space}");

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test("triggers click event when Enter and Space key is pressed with custom role=link", async () => {
		const handleClick = vi.fn();

		render(
			<InteractiveTile primary onClick={handleClick} htmlAttributes={{ role: "link" }}>
				<div>Interactive Tile</div>
			</InteractiveTile>
		);

		await userEvent.tab();

		await userEvent.keyboard("{Enter}");

		expect(handleClick).toHaveBeenCalledTimes(1);
		handleClick.mockReset();

		await userEvent.keyboard("{Space}");

		expect(handleClick).not.toHaveBeenCalled();
	});

	test("should not have aria-label when disableAriaLabel is true", () => {
		const title = "Interactive Title";
		const { getByDataRole } = render(
			<InteractiveTile secondary title={title} disableAriaLabel>
				<TileContent label="Secondary Tile" />
			</InteractiveTile>
		);

		const interactiveTile = getByDataRole(DataRoles.InteractiveTile);

		expect(interactiveTile.getAttribute("aria-label")).toBeNull();
		expect(interactiveTile.getAttribute("title")).toEqual(title);
	});

	test("should display HiddenText when disableAriaLabel is true and interaction hint is enabled", () => {
		const title = "Interactive Title";
		const { getByDataRole } = render(
			<InteractionHintConfigProvider enableInteractionHint>
				<InteractiveTile secondary title={title} disableAriaLabel>
					<TileContent label="Secondary Tile" />
				</InteractiveTile>
			</InteractionHintConfigProvider>
		);

		const interactiveTile = getByDataRole(DataRoles.InteractiveTile);
		const hiddenText = getByDataRole(DataRoles.HiddenText);

		expect(interactiveTile.getAttribute("aria-label")).toBeNull();
		expect(hiddenText.textContent).toEqual(`, ${title}`);
	});

	test("should not display HiddenText when disableAriaLabel is true but interaction hint is disabled", () => {
		const title = "Interactive Title";
		const { getByDataRole, queryAllByDataRole } = render(
			<InteractiveTile secondary title={title} disableAriaLabel>
				<TileContent label="Secondary Tile" />
			</InteractiveTile>
		);

		const interactiveTile = getByDataRole(DataRoles.InteractiveTile);
		const hiddenTexts = queryAllByDataRole(DataRoles.HiddenText);

		expect(interactiveTile.getAttribute("aria-label")).toBeNull();
		expect(interactiveTile.getAttribute("title")).toEqual(title);
		expect(hiddenTexts.length).toBe(0);
	});

	test("should not display HiddenText when title is not provided", () => {
		const { queryAllByDataRole } = render(
			<InteractiveTile secondary disableAriaLabel>
				<TileContent label="Secondary Tile" />
			</InteractiveTile>
		);

		const hiddenTexts = queryAllByDataRole(DataRoles.HiddenText);

		expect(hiddenTexts.length).toBe(0);
	});

	describe("interaction hint", () => {
		test("interactive tile shows hint when componentConfigs.interactiveTile=true", async () => {
			const title = "Tile title";
			const { getByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ interactiveTile: true }}>
					<InteractiveTile title={title}>
						<TileContent label="Test Tile" />
					</InteractiveTile>
				</InteractionHintConfigProvider>
			);
			await userEvent.tab();

			const hintContent = getByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent.textContent).toEqual(title);
		});

		test("interactive tile shows hint when componentConfigs.interactiveTile=false", async () => {
			const title = "Tile title";
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ interactiveTile: false }}>
					<InteractiveTile title={title}>
						<TileContent label="Test Tile" />
					</InteractiveTile>
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});
