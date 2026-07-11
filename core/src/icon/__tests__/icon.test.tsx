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

import { getAllByDataRole, render, screen } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";

import { IconMappingContext } from "../main/icon-mapping-context.js";
import { Icon } from "../main/icon.view.js";
import type { IconMappingDefinition } from "../main/icon.api.js";

describe("com.mgmtp.a12.widgets.icon", () => {
	const iconName = "reply";
	const baseClassName = "plasma-icon";

	test("rendering-icon", () => {
		const { container } = render(<Icon title="icon-title">{iconName}</Icon>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * Testing icon is rendered when user defines it in the 'variant' prop:
	 *  - Icon with variant should have class 'a12-plasma-icon--'variant.
	 */
	test("rendering-variant-icon", () => {
		type variant = "info" | "success" | "warning" | "error";
		const arr: variant[] = ["info", "success", "warning", "error"];
		arr.forEach((variant) => {
			const { container } = render(
				<Icon title={variant} variant={variant}>
					{iconName}
				</Icon>
			);

			expect(container.firstChild).toMatchSnapshot();
		});
	});

	/**
	 * Testing showTitleAsTooltip
	 *  - If showTitleAsTooltip is set to false, there's still an unseenButRead title but the title will not display as
	 * tooltip
	 */
	test("rendering-showTitleAsTooltip-icon", () => {
		const { getByDataRole } = render(
			<Icon showTitleAsTooltip={false} title="Title">
				{iconName}
			</Icon>
		);
		expect(getByDataRole(DataRoles.Icon)?.getAttribute("title")).toBeNull();
		expect(screen.getByText("Title")).toBeTruthy();
	});

	/**
	 * Testing theme Icon
	 * 	- Theme include: filled, outlined, custom. default is filled
	 * 	- Icon should have class 'plasma-icon--custom' if prop theme='custom'
	 * 	- Icon should have class 'plasma-icon--outlined' if prop theme='outlined'
	 */
	test("rendering-icon-theme", () => {
		const customWrapper = render(<Icon iconTheme="custom">{iconName}</Icon>);
		expect(customWrapper.container.querySelector(`.${baseClassName}--custom`)).toBeTruthy();
		expect(customWrapper.container.firstChild).toHaveStyle({ fontFamily: "custom-icons" });

		const outlinedWrapper = render(<Icon iconTheme="outlined">{iconName}</Icon>);
		expect(outlinedWrapper.container.querySelector(`.${baseClassName}--outlined`)).toBeTruthy();
		expect(outlinedWrapper.container.firstChild).toHaveStyle({ fontFamily: "Material Symbols Outlined" });

		const roundedWrapper = render(<Icon iconTheme="rounded">{iconName}</Icon>);
		expect(roundedWrapper.container.querySelector(`.${baseClassName}--rounded`)).toBeTruthy();
		expect(roundedWrapper.container.firstChild).toHaveStyle({ fontFamily: "Material Symbols Rounded" });

		const filledWrapper = render(<Icon>{iconName}</Icon>);
		expect(filledWrapper.container.firstChild).toHaveStyle({ fontFamily: "Material Symbols Outlined" });
	});

	/**
	 * Testing mapping icons
	 */
	test("rendering-mapped-icons", () => {
		const ICON_MAPPING_DEFINITIONS: IconMappingDefinition[] = [
			{ originalIcon: "info", mappedIcon: "report_problem", theme: "filled" },
			{ originalIcon: "help", mappedIcon: "help_center", theme: "outlined" }
		];

		const { container } = render(
			<IconMappingContext value={ICON_MAPPING_DEFINITIONS}>
				<Icon iconTheme="filled" title="info">
					info
				</Icon>
				<Icon iconTheme="outlined" title="help">
					help
				</Icon>
			</IconMappingContext>
		);
		const icons = getAllByDataRole(container, DataRoles.Icon);
		expect(icons[0]).toHaveTextContent("report_problem");
		expect(icons[1]).toHaveTextContent("help_center");
	});

	/**
	 * Testing size Icon
	 * 	- Size include: medium, big. default is medium
	 * 	- Icon should have class ${baseClassName}--big if set prop size='big'
	 */
	test("rendering-icon-size", () => {
		const { container } = render(<Icon size="big">{iconName}</Icon>);
		expect(container.firstChild).toMatchSnapshot();
	});

	describe("hiddenText property", () => {
		test("icon-with-specific-value-hiddenText", () => {
			const { getByDataRole } = render(
				<Icon hiddenText="Custom Icon" title="Tooltip Title">
					{iconName}
				</Icon>
			);
			expect(getByDataRole(DataRoles.Icon)).toHaveAttribute("title", "Tooltip Title");
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Custom Icon");
		});

		test("icon-with-empty-string-hiddenText", () => {
			const { getByDataRole, queryByDataRole } = render(
				<Icon hiddenText="" title="Tooltip Title">
					{iconName}
				</Icon>
			);
			expect(getByDataRole(DataRoles.Icon)).toHaveAttribute("title", "Tooltip Title");
			expect(queryByDataRole(DataRoles.HiddenText)).toBeNull();
		});

		test("icon-with-undefined-hiddenText", () => {
			const { getByDataRole } = render(<Icon title="Fallback Title">{iconName}</Icon>);
			expect(getByDataRole(DataRoles.Icon)).toHaveAttribute("title", "Fallback Title");
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Fallback Title");
		});
	});

	/**
	 * 	Testing iconRef icon
	 * 	- iconRef should be triggerred when mount
	 */
	test("rendering-iconRef-icon", () => {
		const iconRef = vi.fn();
		render(<Icon iconRef={iconRef}>{iconName}</Icon>);
		expect(iconRef).toHaveBeenCalledTimes(1);
	});
});
