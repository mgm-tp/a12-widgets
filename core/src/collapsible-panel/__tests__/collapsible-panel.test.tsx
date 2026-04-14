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

import type { ReactNode } from "react";
import { render, fireEvent, getByDataRole, queryByDataRole, waitFor, getAllByDataRole } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { noop } from "../../common/main/utils.js";
import { Button } from "../../button/main/button.view.js";
import { A11YLanguageContext, getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { CollapsiblePanel } from "../main/collapsible-panel.view.js";
import { CollapsiblePanelElements } from "../main/collapsible-panel.tpl.js";
import type { CollapsiblePanelProps } from "../main/collapsible-panel.api.js";

const baseClassName = "collapsiblePanel";

describe("com.mgmtp.a12.widgets.collapsiblePanel", () => {
	const props: Partial<CollapsiblePanelProps> = {
		id: "collapsible-panel-id",
		className: "collapsible-panel-class",
		style: {
			width: "90%"
		},
		title: "Collapsible Panel title",
		role: "custom-role",
		ariaLevel: 2
	};

	test("rendering-collapsible-panel", () => {
		const { container } = render(
			<CollapsiblePanel
				{...props}
				info="Data available"
				addons={<CollapsiblePanelElements.Addon>Test Addon</CollapsiblePanelElements.Addon>}
				onClick={(): void => undefined}
			>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
			</CollapsiblePanel>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-event-on-collapsible-panel", () => {
		const onClickEvent = vi.fn();
		const { container } = render(
			<CollapsiblePanel onClick={onClickEvent} {...props}>
				<p>Lorem ipsum dolor sit amet.</p>
			</CollapsiblePanel>
		);

		const title = getAllByDataRole(container, DataRoles.CollapsiblePanel.Header);

		fireEvent.click(title[0]);
		expect(onClickEvent).toHaveBeenCalledTimes(1);

		onClickEvent.mockClear();
		fireEvent.keyUp(title[0], { key: "Enter", code: "Enter", charCode: 13 });
		expect(onClickEvent).toHaveBeenCalledTimes(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-event-on-collapsible-panel-single-addon", () => {
		const { container } = render(
			<CollapsiblePanel
				{...props}
				addons={<CollapsiblePanelElements.Addon>addon</CollapsiblePanelElements.Addon>}
				onClick={noop}
			>
				<p>Lorem ipsum dolor sit amet.</p>
			</CollapsiblePanel>
		);
		const addons = getByDataRole(container, DataRoles.CollapsiblePanelAddons);
		fireEvent.mouseOver(addons);

		const title = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
		expect(title?.getElementsByClassName(`${baseClassName}__title--no-effect`).length).toBe(0);
		fireEvent.mouseLeave(addons);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulating-event-on-collapsible-panel-multiple-addon", () => {
		const { container } = render(
			<CollapsiblePanel
				{...props}
				addons={
					<>
						<CollapsiblePanelElements.Addon>
							<Button>addon 1</Button>
						</CollapsiblePanelElements.Addon>
						<CollapsiblePanelElements.Addon>
							<Button>addon 2</Button>
						</CollapsiblePanelElements.Addon>
					</>
				}
				onClick={noop}
			>
				<p>Lorem ipsum dolor sit amet.</p>
			</CollapsiblePanel>
		);

		const addons = getByDataRole(container, DataRoles.CollapsiblePanelAddons);
		const addonButton = getAllByDataRole(addons, "button")[0];

		fireEvent.mouseOver(addonButton);
		expect(
			getByDataRole(container, DataRoles.CollapsiblePanel.Header).getElementsByClassName(
				`${baseClassName}__title--no-effect`
			)
		).toBeTruthy();
		fireEvent.mouseLeave(addonButton);

		fireEvent.mouseOver(addons);
		expect(
			getByDataRole(container, DataRoles.CollapsiblePanel.Header).getElementsByClassName(
				`${baseClassName}__title--no-effect`
			)
		).toHaveLength(0);
		fireEvent.mouseLeave(addons);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("swap positions of addons and graphic icon", () => {
		const { container } = render(
			<CollapsiblePanel
				{...props}
				swapAddonsPosition
				addons={<CollapsiblePanelElements.Addon>addon</CollapsiblePanelElements.Addon>}
				onClick={noop}
			>
				<p>Lorem ipsum dolor sit amet.</p>
			</CollapsiblePanel>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	describe("interaction hint", () => {
		const CollapsiblePanelWithHint = ({ isExpanded = false }): ReactNode => (
			<A11YLanguageContext.Provider
				value={{
					...getA11yResource("en"),
					collapsiblePanelTitles: {
						openPanel: "open",
						closePanel: "close"
					}
				}}
			>
				<InteractionHintConfigProvider enableInteractionHint>
					<CollapsiblePanel {...props} onClick={noop}>
						{isExpanded && <p>Lorem ipsum dolor sit amet.</p>}
					</CollapsiblePanel>
				</InteractionHintConfigProvider>
			</A11YLanguageContext.Provider>
		);

		test("should display the hint on hover and hide it on hover leave", async () => {
			const { container } = render(<CollapsiblePanelWithHint />);

			const collapsiblePaneButton = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);

			expect(getByDataRole(container, DataRoles.HiddenText)?.textContent).toEqual("open");

			// Hover the outer wrapper so the hover-based hint (attached to wrapperRef) will show
			await userEvent.hover(collapsiblePaneButton);

			await waitFor(() => {
				const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual("open");
			});

			await userEvent.unhover(collapsiblePaneButton);

			expect(queryByDataRole(container, DataRoles.InteractionHint)).not.toBeInTheDocument();
		});

		test("should display the hint when focusing and hide it when pressing the Tab key", async () => {
			const { container } = render(<CollapsiblePanelWithHint />);

			const collapsiblePaneButton = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);

			expect(getByDataRole(collapsiblePaneButton, DataRoles.HiddenText)?.textContent).toEqual("open");

			fireEvent.focus(collapsiblePaneButton);

			await waitFor(() => {
				const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual("open");
			});

			fireEvent.focusOut(collapsiblePaneButton);
			expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
		});

		test("should hide the hint when pressing the Escape key", async () => {
			const { container } = render(<CollapsiblePanelWithHint />);

			const collapsiblePaneButton = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);

			expect(getByDataRole(collapsiblePaneButton, DataRoles.HiddenText)?.textContent).toEqual("open");

			fireEvent.focus(collapsiblePaneButton);

			await waitFor(() => {
				const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual("open");
			});

			fireEvent.keyDown(collapsiblePaneButton, { key: Key.Escape });
			expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
		});

		test("should update the hint after expanding the pane", async () => {
			const { container } = render(<CollapsiblePanelWithHint isExpanded />);

			const collapsiblePaneButton = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);

			expect(getByDataRole(collapsiblePaneButton, DataRoles.HiddenText)?.textContent).toEqual("close");

			fireEvent.focus(collapsiblePaneButton);

			await waitFor(() => {
				const interactionHint = getByDataRole(container, DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual("close");
			});
		});

		test("collapsible panel should not show hint when componentConfigs.collapsiblePanel=false", async () => {
			const title = "Expand panel";
			const { container } = render(
				<InteractionHintConfigProvider componentConfigs={{ collapsiblePanel: false }}>
					<CollapsiblePanel title={title} onClick={vi.fn()}>
						<div>Content</div>
					</CollapsiblePanel>
				</InteractionHintConfigProvider>
			);

			const collapsiblePaneButton = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);

			fireEvent.focus(collapsiblePaneButton);

			const hintContent = queryByDataRole(container, DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});
