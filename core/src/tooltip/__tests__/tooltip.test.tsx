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

import { render, getByDataRole, setupDevice, findByDataRole, queryByDataRole, waitFor } from "test-utils";
import { beforeAll, describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "../../button/main/button.view.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { Tooltip } from "../main/tooltip.view.js";
import { ErrorTooltip } from "../error/main/error.view.js";
import { HintTooltip } from "../hint/main/hint.view.js";
import { SuccessTooltip } from "../success/main/success.view.js";
import { WarningTooltip } from "../warning/main/warning.view.js";

describe("com.mgmtp.a12.widgets.tooltip", () => {
	test("render basic tooltip", async () => {
		const { container } = render(
			<Tooltip text="test tooltip">
				<Button icon={<Icon>warning</Icon>} />
			</Tooltip>
		);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		expect(container.firstChild).toMatchSnapshot();
		await userEvent.hover(tooltipTrigger);

		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeInTheDocument();
		expect(attachedPortal).toMatchSnapshot();

		await userEvent.tab();
		expect(tooltipTrigger).toHaveFocus();
	});

	test("render tooltip with big icon", async () => {
		const { container } = render(
			<Tooltip text="test tooltip">
				<Button icon={<Icon size="big">warning</Icon>} />
			</Tooltip>
		);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		expect(container.firstChild).toMatchSnapshot();
		await userEvent.hover(tooltipTrigger);

		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeVisible();
		expect(attachedPortal).toMatchSnapshot();
	});

	test("tooltip events", async () => {
		const { container } = render(
			<Tooltip text="test tooltip">
				<Button icon={<Icon>warning</Icon>} />
			</Tooltip>
		);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		await userEvent.click(tooltipTrigger);
		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeTruthy();

		await userEvent.keyboard("{Escape}");

		expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();

		await userEvent.unhover(tooltipTrigger);

		await userEvent.hover(tooltipTrigger);

		expect(attachedPortal).toBeTruthy();

		await userEvent.unhover(tooltipTrigger);

		await waitFor(() => {
			expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();
		});
	});

	test("render disabled tooltip", () => {
		const { container } = render(
			<Tooltip disabled text="test tooltip">
				<Button icon={<Icon>warning</Icon>} />
			</Tooltip>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render dark tooltip", () => {
		const { container } = render(
			<Tooltip invert text="test tooltip">
				<Button icon={<Icon>warning</Icon>} />
			</Tooltip>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render error tooltip", async () => {
		const { container } = render(<ErrorTooltip text="test tooltip" />);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		expect(container.firstChild).toMatchSnapshot();
		await userEvent.hover(tooltipTrigger);

		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeVisible();
		expect(attachedPortal).toMatchSnapshot();
	});

	test("render hint tooltip", async () => {
		const { container } = render(<HintTooltip text="test tooltip" />);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		expect(container.firstChild).toMatchSnapshot();
		await userEvent.hover(tooltipTrigger);

		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeVisible();
		expect(attachedPortal).toMatchSnapshot();
	});

	test("render success tooltip", async () => {
		const { container } = render(<SuccessTooltip text="test tooltip" />);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		expect(container.firstChild).toMatchSnapshot();
		await userEvent.hover(tooltipTrigger);

		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeVisible();
		expect(attachedPortal).toMatchSnapshot();
	});

	test("render warning tooltip", async () => {
		const { container } = render(<WarningTooltip text="test tooltip" />);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		expect(container.firstChild).toMatchSnapshot();
		await userEvent.hover(tooltipTrigger);

		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

		expect(attachedPortal).toBeVisible();
		expect(attachedPortal).toMatchSnapshot();
	});

	test("render tooltip with wrapper which has title attribute", async () => {
		const parentTitle = "parent title";
		const { container } = render(
			<div title={parentTitle}>
				<Tooltip data-testid="test" text="test tooltip">
					<Button icon={<Icon>warning</Icon>} />
				</Tooltip>
			</div>
		);
		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		await userEvent.hover(tooltipTrigger);

		await waitFor(() => {
			const tooltip = getByDataRole(getByDataRole(container, DataRoles.AttachedPortal), DataRoles.Tooltip);
			expect(tooltip).not.toHaveAttribute("title");
		});
		expect(container.firstChild).toMatchSnapshot();
	});

	test("tooltip position is consistent on second open with large content", async () => {
		const longText = "a ".repeat(5000);

		const { container } = render(
			<Tooltip text={longText}>
				<Button icon={<Icon>warning</Icon>} />
			</Tooltip>
		);

		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		// First open
		await userEvent.hover(tooltipTrigger);
		const firstPortal = await findByDataRole(container, DataRoles.AttachedPortal);
		const firstTooltip = getByDataRole(firstPortal, DataRoles.Tooltip);

		const firstPortalStyle = { top: firstPortal.style.top, left: firstPortal.style.left };
		const firstTooltipStyle = {
			top: firstTooltip.style.top,
			left: firstTooltip.style.left,
			transform: firstTooltip.style.transform
		};

		// Close
		await userEvent.unhover(tooltipTrigger);
		await waitFor(() => {
			expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();
		});

		// Second open
		await userEvent.hover(tooltipTrigger);
		const secondPortal = await findByDataRole(container, DataRoles.AttachedPortal);
		const secondTooltip = getByDataRole(secondPortal, DataRoles.Tooltip);

		expect(secondPortal.style.top).toBe(firstPortalStyle.top);
		expect(secondPortal.style.left).toBe(firstPortalStyle.left);
		expect(secondTooltip.style.top).toBe(firstTooltipStyle.top);
		expect(secondTooltip.style.left).toBe(firstTooltipStyle.left);
		expect(secondTooltip.style.transform).toBe(firstTooltipStyle.transform);
		expect(secondTooltip.className).toBe(firstTooltip.className);
	});

	test("tooltip position consistency", async () => {
		// Simulate a scrolled page with element near the top and narrow viewport (700px width)
		const originalInnerWidth = window.innerWidth;
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 700
		});

		const { container } = render(
			<div style={{ height: "2000px", paddingTop: "50px", width: "700px" }}>
				<Tooltip text="test tooltip near top">
					<Button icon={<Icon>warning</Icon>} />
				</Tooltip>
			</div>
		);

		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		// Scroll the trigger element to near the top of viewport
		tooltipTrigger.scrollIntoView({ block: "start" });

		await userEvent.hover(tooltipTrigger);
		const firstAttachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);
		const firstTooltip = getByDataRole(firstAttachedPortal, DataRoles.Tooltip);

		const firstPortalStyle = {
			top: firstAttachedPortal.style.top,
			left: firstAttachedPortal.style.left
		};
		const firstTooltipStyle = {
			top: firstTooltip.style.top,
			left: firstTooltip.style.left,
			transform: firstTooltip.style.transform
		};
		const firstOrientation = firstTooltip.className;

		await userEvent.unhover(tooltipTrigger);
		await waitFor(() => {
			expect(queryByDataRole(container, DataRoles.AttachedPortal)).toBeFalsy();
		});

		await userEvent.hover(tooltipTrigger);
		const secondAttachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);
		const secondTooltip = getByDataRole(secondAttachedPortal, DataRoles.Tooltip);

		const secondPortalStyle = {
			top: secondAttachedPortal.style.top,
			left: secondAttachedPortal.style.left
		};
		const secondTooltipStyle = {
			top: secondTooltip.style.top,
			left: secondTooltip.style.left,
			transform: secondTooltip.style.transform
		};
		const secondOrientation = secondTooltip.className;

		expect(secondPortalStyle.top).toBe(firstPortalStyle.top);
		expect(secondPortalStyle.left).toBe(firstPortalStyle.left);
		expect(secondTooltipStyle.top).toBe(firstTooltipStyle.top);
		expect(secondTooltipStyle.left).toBe(firstTooltipStyle.left);
		expect(secondTooltipStyle.transform).toBe(firstTooltipStyle.transform);
		expect(secondOrientation).toBe(firstOrientation);

		// Restore original window width
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: originalInnerWidth
		});
	});

	test("tooltip maintains position and orientation when hovering between trigger and tooltip content", async () => {
		const { container } = render(
			<Tooltip text="test tooltip content">
				<Button icon={<Icon>warning</Icon>} />
			</Tooltip>
		);

		const tooltipTrigger = getByDataRole(container, DataRoles.Button);

		// Initial hover on trigger element
		await userEvent.hover(tooltipTrigger);

		const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);
		const tooltip = getByDataRole(attachedPortal, DataRoles.Tooltip);
		const tooltipContent = getByDataRole(tooltip, DataRoles.Tooltip.Content);

		// Capture initial position and orientation
		const initialPortalStyle = {
			top: attachedPortal.style.top,
			left: attachedPortal.style.left
		};
		const initialTooltipStyle = {
			top: tooltip.style.top,
			left: tooltip.style.left,
			transform: tooltip.style.transform
		};
		const initialOrientation = tooltip.className;

		// Hover over tooltip content
		await userEvent.hover(tooltipContent);

		// Verify tooltip is still visible
		expect(attachedPortal).toBeInTheDocument();
		expect(tooltip).toBeInTheDocument();

		// Hover back to trigger element while tooltip is still open
		await userEvent.hover(tooltipTrigger);

		// Verify position and orientation remain unchanged
		const afterPortalStyle = {
			top: attachedPortal.style.top,
			left: attachedPortal.style.left
		};
		const afterTooltipStyle = {
			top: tooltip.style.top,
			left: tooltip.style.left,
			transform: tooltip.style.transform
		};
		const afterOrientation = tooltip.className;

		expect(afterPortalStyle.top).toBe(initialPortalStyle.top);
		expect(afterPortalStyle.left).toBe(initialPortalStyle.left);
		expect(afterTooltipStyle.top).toBe(initialTooltipStyle.top);
		expect(afterTooltipStyle.left).toBe(initialTooltipStyle.left);
		expect(afterTooltipStyle.transform).toBe(initialTooltipStyle.transform);
		expect(afterOrientation).toBe(initialOrientation);

		// Hover over tooltip content again
		await userEvent.hover(tooltipContent);

		// Verify position and orientation still remain unchanged
		expect(attachedPortal.style.top).toBe(initialPortalStyle.top);
		expect(attachedPortal.style.left).toBe(initialPortalStyle.left);
		expect(tooltip.style.top).toBe(initialTooltipStyle.top);
		expect(tooltip.style.left).toBe(initialTooltipStyle.left);
		expect(tooltip.style.transform).toBe(initialTooltipStyle.transform);
		expect(tooltip.className).toBe(initialOrientation);
	});

	describe("mobile", () => {
		beforeAll(() => {
			setupDevice();
		});

		test("render desktop tooltip on mobile", async () => {
			const { container } = render(
				<Tooltip useDesktopView text="test tooltip">
					<Button icon={<Icon>warning</Icon>} />
				</Tooltip>
			);

			const tooltipTrigger = getByDataRole(container, DataRoles.Button);
			await userEvent.hover(tooltipTrigger);

			const attachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);

			expect(attachedPortal).toBeVisible();
			expect(attachedPortal).toMatchSnapshot();
		});

		test("tooltip orientation consistency after scroll", async () => {
			const originalInnerWidth = window.innerWidth;
			const originalInnerHeight = window.innerHeight;
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: 375 // Mobile width
			});
			Object.defineProperty(window, "innerHeight", {
				writable: true,
				configurable: true,
				value: 667 // Mobile height
			});

			const { container } = render(
				<div style={{ height: "3000px", width: "375px", margin: 0, padding: 0 }}>
					<Tooltip useDesktopView text="test tooltip after scroll">
						<Button icon={<Icon>warning</Icon>} />
					</Tooltip>
				</div>
			);

			const tooltipTrigger = getByDataRole(container, DataRoles.Button);

			// Scroll to end to ensure tooltip orientation is bottom-start
			tooltipTrigger.scrollIntoView({ block: "end" });

			// First open after scroll
			await userEvent.click(tooltipTrigger);
			const firstAttachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);
			const firstTooltip = getByDataRole(firstAttachedPortal, DataRoles.Tooltip);

			const firstPortalStyle = {
				top: firstAttachedPortal.style.top,
				left: firstAttachedPortal.style.left
			};
			const firstTooltipStyle = {
				top: firstTooltip.style.top,
				left: firstTooltip.style.left,
				transform: firstTooltip.style.transform
			};

			await userEvent.keyboard("{Escape}");
			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.AttachedPortal)).not.toBeInTheDocument();
			});

			// Second open after scroll - should have same orientation and position as first open
			await userEvent.click(tooltipTrigger);
			const secondAttachedPortal = await findByDataRole(container, DataRoles.AttachedPortal);
			const secondTooltip = getByDataRole(secondAttachedPortal, DataRoles.Tooltip);

			const secondPortalStyle = {
				top: secondAttachedPortal.style.top,
				left: secondAttachedPortal.style.left
			};
			const secondTooltipStyle = {
				top: secondTooltip.style.top,
				left: secondTooltip.style.left,
				transform: secondTooltip.style.transform
			};

			expect(secondPortalStyle.top).toBe(firstPortalStyle.top);
			expect(secondPortalStyle.left).toBe(firstPortalStyle.left);
			expect(secondTooltipStyle.top).toBe(firstTooltipStyle.top);
			expect(secondTooltipStyle.left).toBe(firstTooltipStyle.left);
			expect(secondTooltipStyle.transform).toBe(firstTooltipStyle.transform);

			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: originalInnerWidth
			});
			Object.defineProperty(window, "innerHeight", {
				writable: true,
				configurable: true,
				value: originalInnerHeight
			});
		});
	});
});
