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
import { createRef, useState } from "react";
import { render, fireEvent, getByDataRole, queryByDataRole, waitFor, getAllByDataRole, screen } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "../../button/main/button.view.js";
import { A11YLanguageContext, getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { noop } from "../../common/main/utils.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import type { CollapsiblePanelProps } from "../main/collapsible-panel.api.js";
import { CollapsiblePanelElements } from "../main/collapsible-panel.tpl.js";
import { CollapsiblePanel } from "../main/collapsible-panel.view.js";

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

	test("rendering-collapsible-panel-with-header-actions-and-compact-mode", () => {
		const { container } = render(
			<CollapsiblePanel
				{...props}
				swapAddonsPosition
				addons={
					<>
						<Button icon={<span>search</span>} title="Search" />
						<Button icon={<span>filter</span>} title="Filter" />
						<Button icon={<span>download</span>} title="Download" />
					</>
				}
				onClick={noop}
			>
				<p>Panel content with header actions</p>
			</CollapsiblePanel>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	describe("rendering attributes", () => {
		test("exposes a component instance through ref for backwards compatibility", () => {
			const ref = createRef<CollapsiblePanel>();
			render(<CollapsiblePanel ref={ref} title="Title" onClick={noop} />);

			expect(ref.current).toBeInstanceOf(CollapsiblePanel);
		});

		test("binds the methods of a subclass to the instance", () => {
			class CustomCollapsiblePanel extends CollapsiblePanel {
				getTitle(): ReactNode {
					return this.props.title;
				}
			}

			const ref = createRef<CustomCollapsiblePanel>();
			render(<CustomCollapsiblePanel ref={ref} title="Custom title" onClick={noop} />);

			const { getTitle } = ref.current!;
			expect(getTitle()).toBe("Custom title");
		});

		test("applies id, className and style to the root element and role/aria-level to the header", () => {
			const { container } = render(
				<CollapsiblePanel {...props} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const root = getByDataRole(container, DataRoles.CollapsiblePanel);
			expect(root).toBe(container.firstChild);
			expect(root).toHaveAttribute("id", "collapsible-panel-id");
			expect(root).toHaveClass("collapsiblePanel", "collapsible-panel-class");
			expect(root).toHaveStyle({ width: "90%" });

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			expect(header).toHaveAttribute("role", "custom-role");
			expect(header).toHaveAttribute("aria-level", "2");

			const label = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);
			expect(label).toHaveAttribute("role", "button");
			expect(label).toHaveAttribute("tabindex", "0");

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Content)).toHaveAttribute("role", "document");
		});

		test("does not set role or aria-level on the header when they are not provided", () => {
			const { container } = render(
				<CollapsiblePanel title="Title" onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			expect(header).not.toHaveAttribute("role");
			expect(header).not.toHaveAttribute("aria-level");
		});

		test("renders the title as a ReactNode and the info text next to it", () => {
			const { container } = render(
				<CollapsiblePanel
					title={
						<span>
							Rich <strong>title</strong>
						</span>
					}
					info="3 items"
					onClick={noop}
				/>
			);

			const title = getByDataRole(container, DataRoles.CollapsiblePanel.Title);
			expect(title).toHaveTextContent("Rich title");
			expect(title.querySelector("strong")).toHaveTextContent("title");

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Info)).toHaveTextContent("- 3 items");
		});

		test("omits the info and addons elements when they are not provided", () => {
			const { container } = render(<CollapsiblePanel title="Title" onClick={noop} />);

			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Info)).not.toBeInTheDocument();
			expect(queryByDataRole(container, DataRoles.CollapsiblePanelAddons)).not.toBeInTheDocument();
			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Content)).not.toBeInTheDocument();
		});

		test("exposes the display name", () => {
			expect(CollapsiblePanel.displayName).toBe("CollapsiblePanel");
		});
	});

	describe("expanded and collapsed state", () => {
		test("is collapsed without children: aria-expanded=false, no content, right arrow indicator", () => {
			const { container } = render(<CollapsiblePanel title="Title" onClick={noop} />);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute(
				"aria-expanded",
				"false"
			);
			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Content)).not.toBeInTheDocument();
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Indicator)).toHaveTextContent("keyboard_arrow_right");
		});

		test("is expanded with children: aria-expanded=true, content rendered, down arrow indicator", () => {
			const { container } = render(
				<CollapsiblePanel title="Title" onClick={noop}>
					<p>Panel content</p>
				</CollapsiblePanel>
			);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute(
				"aria-expanded",
				"true"
			);
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Content)).toHaveTextContent("Panel content");
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Indicator)).toHaveTextContent("keyboard_arrow_down");
		});

		test("switches between expanded and collapsed when the children prop changes after mount", () => {
			const { container, rerender } = render(<CollapsiblePanel title="Title" onClick={noop} />);

			const label = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);
			expect(label).toHaveAttribute("aria-expanded", "false");

			rerender(
				<CollapsiblePanel title="Title" onClick={noop}>
					<p>Panel content</p>
				</CollapsiblePanel>
			);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute(
				"aria-expanded",
				"true"
			);
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Content)).toHaveTextContent("Panel content");
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Indicator)).toHaveTextContent("keyboard_arrow_down");

			rerender(<CollapsiblePanel title="Title" onClick={noop} />);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute(
				"aria-expanded",
				"false"
			);
			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Content)).not.toBeInTheDocument();
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Indicator)).toHaveTextContent("keyboard_arrow_right");
		});

		test("works as a controlled component: the consumer toggles the children in onClick", async () => {
			function ControlledPanel(): ReactNode {
				const [expanded, setExpanded] = useState(false);

				return (
					<CollapsiblePanel title="Title" onClick={() => setExpanded((value) => !value)}>
						{expanded && <p>Panel content</p>}
					</CollapsiblePanel>
				);
			}

			const { container } = render(<ControlledPanel />);
			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);

			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Content)).not.toBeInTheDocument();

			await userEvent.click(header);
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Content)).toHaveTextContent("Panel content");
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute(
				"aria-expanded",
				"true"
			);

			await userEvent.keyboard("{Enter}");
			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Content)).not.toBeInTheDocument();
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute(
				"aria-expanded",
				"false"
			);
		});
	});

	describe("event handlers", () => {
		test("calls onClick once per header click and focuses the title wrapper", async () => {
			const onClick = vi.fn();
			const { container } = render(
				<CollapsiblePanel title="Title" onClick={onClick}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			await userEvent.click(getByDataRole(container, DataRoles.CollapsiblePanel.Title));

			expect(onClick).toHaveBeenCalledTimes(1);
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveFocus();
		});

		test("calls onClick when the content of the panel is not clicked", async () => {
			const onClick = vi.fn();
			const { container } = render(
				<CollapsiblePanel title="Title" onClick={onClick}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			await userEvent.click(getByDataRole(container, DataRoles.CollapsiblePanel.Content));

			expect(onClick).not.toHaveBeenCalled();
		});

		test("uses the latest onClick handler after the prop changes", async () => {
			const firstHandler = vi.fn();
			const secondHandler = vi.fn();
			const { container, rerender } = render(<CollapsiblePanel title="Title" onClick={firstHandler} />);
			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);

			await userEvent.click(header);
			expect(firstHandler).toHaveBeenCalledTimes(1);

			rerender(<CollapsiblePanel title="Title" onClick={secondHandler} />);

			await userEvent.click(header);
			await userEvent.keyboard("{Enter}");

			expect(firstHandler).toHaveBeenCalledTimes(1);
			expect(secondHandler).toHaveBeenCalledTimes(2);
		});
	});

	describe("keyboard interaction", () => {
		test("focuses the title wrapper with Tab and triggers onClick with Enter", async () => {
			const onClick = vi.fn();
			const { container } = render(<CollapsiblePanel title="Title" onClick={onClick} />);

			await userEvent.tab();
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveFocus();

			await userEvent.keyboard("{Enter}");
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		test("does not trigger onClick for Space, Escape or arrow keys", async () => {
			const onClick = vi.fn();
			const { container } = render(<CollapsiblePanel title="Title" onClick={onClick} />);

			await userEvent.tab();
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveFocus();

			await userEvent.keyboard(" ");
			await userEvent.keyboard("{Escape}");
			await userEvent.keyboard("{ArrowDown}");
			await userEvent.keyboard("a");

			expect(onClick).not.toHaveBeenCalled();
		});
	});

	describe("addons", () => {
		const interactiveAddons = (
			<CollapsiblePanelElements.Addon>
				<Button label="Edit" />
			</CollapsiblePanelElements.Addon>
		);

		test("renders the addons inside the header", () => {
			const { container } = render(
				<CollapsiblePanel title="Title" addons={interactiveAddons} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			const addons = getByDataRole(header, DataRoles.CollapsiblePanelAddons);
			expect(getByDataRole(addons, DataRoles.CollapsiblePanel.Addon)).toHaveTextContent("Edit");
		});

		test("suppresses the header hover effect while an interactive addon is hovered", async () => {
			const { container } = render(
				<CollapsiblePanel title="Title" addons={interactiveAddons} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			const addonButton = getByDataRole(container, DataRoles.Button);
			expect(header).not.toHaveClass(`${baseClassName}__title--no-effect`);

			await userEvent.hover(addonButton);
			expect(header).toHaveClass(`${baseClassName}__title--no-effect`);
			expect(header).toHaveClass(`${baseClassName}__title--no-focus`);

			await userEvent.hover(getByDataRole(container, DataRoles.CollapsiblePanel.Title));
			expect(header).not.toHaveClass(`${baseClassName}__title--no-effect`);
			expect(header).not.toHaveClass(`${baseClassName}__title--no-focus`);
		});

		test("suppresses the header hover effect while an interactive addon is touched", () => {
			const { container } = render(
				<CollapsiblePanel title="Title" addons={interactiveAddons} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			const addonButton = getByDataRole(container, DataRoles.Button);

			fireEvent.touchStart(addonButton);
			expect(header).toHaveClass(`${baseClassName}__title--no-effect`);

			fireEvent.touchEnd(addonButton);
			expect(header).not.toHaveClass(`${baseClassName}__title--no-effect`);
		});

		test("keeps the header effects when a non-interactive addon is hovered", async () => {
			const { container } = render(
				<CollapsiblePanel
					title="Title"
					addons={<CollapsiblePanelElements.Addon>Plain text</CollapsiblePanelElements.Addon>}
					onClick={noop}
				>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);

			await userEvent.hover(getByDataRole(container, DataRoles.CollapsiblePanel.Addon));

			expect(header).not.toHaveClass(`${baseClassName}__title--no-effect`);
			expect(header).not.toHaveClass(`${baseClassName}__title--no-focus`);
		});

		test("suppresses the header focus style while an interactive addon has the focus", async () => {
			const { container } = render(
				<CollapsiblePanel title="Title" addons={interactiveAddons} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			const addonButton = getByDataRole(container, DataRoles.Button);

			// Park the pointer outside the header, so a hover state left behind by the browser cannot interfere
			await userEvent.hover(getByDataRole(container, DataRoles.CollapsiblePanel.Content));

			await userEvent.tab();
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveFocus();
			expect(header).not.toHaveClass(`${baseClassName}__title--no-focus`);

			await userEvent.tab();
			expect(addonButton).toHaveFocus();
			expect(header).toHaveClass(`${baseClassName}__title--no-focus`);

			await userEvent.tab();
			expect(addonButton).not.toHaveFocus();
			expect(header).not.toHaveClass(`${baseClassName}__title--no-focus`);
		});

		test("places the addons after the label and the indicator before the title text by default", () => {
			const { container } = render(
				<CollapsiblePanel title="Title" addons={interactiveAddons} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			const label = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);
			const addons = getByDataRole(container, DataRoles.CollapsiblePanelAddons);
			const indicator = getByDataRole(container, DataRoles.CollapsiblePanel.Indicator);

			expect(header.firstElementChild).toBe(label);
			expect(label.nextElementSibling).toBe(addons);
			expect(label.firstElementChild).toBe(indicator);
		});

		test("swaps the addons and the indicator when swapAddonsPosition changes after mount", () => {
			const { container, rerender } = render(
				<CollapsiblePanel title="Title" addons={interactiveAddons} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			rerender(
				<CollapsiblePanel title="Title" addons={interactiveAddons} swapAddonsPosition onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			const label = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);
			const addons = getByDataRole(container, DataRoles.CollapsiblePanelAddons);
			const indicator = getByDataRole(container, DataRoles.CollapsiblePanel.Indicator);

			expect(header.firstElementChild).toBe(addons);
			expect(addons.nextElementSibling).toBe(label);
			expect(label.lastElementChild).toBe(indicator);
			expect(label.firstElementChild).toBe(getByDataRole(container, DataRoles.CollapsiblePanel.Title));

			rerender(
				<CollapsiblePanel title="Title" addons={interactiveAddons} onClick={noop}>
					<p>Content</p>
				</CollapsiblePanel>
			);

			const labelAfterReset = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Header).firstElementChild).toBe(labelAfterReset);
			expect(labelAfterReset.firstElementChild).toBe(getByDataRole(container, DataRoles.CollapsiblePanel.Indicator));
		});
	});

	describe("prop updates after mount", () => {
		test("updates title, info and addons when the props change", () => {
			const { container, rerender } = render(<CollapsiblePanel title="First title" onClick={noop} />);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title)).toHaveTextContent("First title");
			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Info)).not.toBeInTheDocument();
			expect(queryByDataRole(container, DataRoles.CollapsiblePanelAddons)).not.toBeInTheDocument();

			rerender(
				<CollapsiblePanel
					title="Second title"
					info="updated"
					addons={<CollapsiblePanelElements.Addon>Addon</CollapsiblePanelElements.Addon>}
					onClick={noop}
				/>
			);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title)).toHaveTextContent("Second title");
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Info)).toHaveTextContent("- updated");
			expect(getByDataRole(container, DataRoles.CollapsiblePanelAddons)).toHaveTextContent("Addon");

			rerender(<CollapsiblePanel title="Second title" onClick={noop} />);

			expect(queryByDataRole(container, DataRoles.CollapsiblePanel.Info)).not.toBeInTheDocument();
			expect(queryByDataRole(container, DataRoles.CollapsiblePanelAddons)).not.toBeInTheDocument();
		});

		test("updates id, className, style, role and aria-level when the props change", () => {
			const { container, rerender } = render(<CollapsiblePanel {...props} onClick={noop} />);

			rerender(
				<CollapsiblePanel
					id="other-id"
					className="other-class"
					style={{ width: "50%" }}
					title="Title"
					role="region"
					ariaLevel={3}
					onClick={noop}
				/>
			);

			const root = getByDataRole(container, DataRoles.CollapsiblePanel);
			expect(root).toHaveAttribute("id", "other-id");
			expect(root).toHaveClass("collapsiblePanel", "other-class");
			expect(root).not.toHaveClass("collapsible-panel-class");
			expect(root).toHaveStyle({ width: "50%" });

			const header = getByDataRole(container, DataRoles.CollapsiblePanel.Header);
			expect(header).toHaveAttribute("role", "region");
			expect(header).toHaveAttribute("aria-level", "3");
		});
	});

	describe("a11y language context", () => {
		const a11yTitles = { openPanel: "open", closePanel: "close" };
		const germanTitles = { openPanel: "öffnen", closePanel: "schließen" };

		test("uses the localized panel title as native title when the interaction hint is disabled", () => {
			const { container, rerender } = render(
				<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), collapsiblePanelTitles: a11yTitles }}>
					<CollapsiblePanel title="Title" onClick={noop} />
				</A11YLanguageContext.Provider>
			);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute("title", "open");
			expect(queryByDataRole(container, DataRoles.HiddenText)).not.toBeInTheDocument();

			rerender(
				<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), collapsiblePanelTitles: a11yTitles }}>
					<CollapsiblePanel title="Title" onClick={noop}>
						<p>Content</p>
					</CollapsiblePanel>
				</A11YLanguageContext.Provider>
			);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveAttribute("title", "close");
		});

		test("moves the localized panel title into hidden text when the interaction hint is enabled", () => {
			const { container } = render(
				<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), collapsiblePanelTitles: a11yTitles }}>
					<InteractionHintConfigProvider enableInteractionHint>
						<CollapsiblePanel title="Title" onClick={noop} />
					</InteractionHintConfigProvider>
				</A11YLanguageContext.Provider>
			);

			const label = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);
			expect(label).not.toHaveAttribute("title");
			expect(getByDataRole(label, DataRoles.HiddenText)).toHaveTextContent("open");
		});

		test("renders neither a native title nor hidden text without localized panel titles", () => {
			const { container } = render(
				<InteractionHintConfigProvider enableInteractionHint>
					<CollapsiblePanel title="Title" onClick={noop} />
				</InteractionHintConfigProvider>
			);

			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).not.toHaveAttribute("title");
			expect(queryByDataRole(container, DataRoles.HiddenText)).not.toBeInTheDocument();
		});

		test("follows context changes after mount", () => {
			const { container, rerender } = render(
				<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), collapsiblePanelTitles: a11yTitles }}>
					<InteractionHintConfigProvider enableInteractionHint>
						<CollapsiblePanel title="Title" onClick={noop} />
					</InteractionHintConfigProvider>
				</A11YLanguageContext.Provider>
			);

			expect(getByDataRole(container, DataRoles.HiddenText)).toHaveTextContent("open");

			rerender(
				<A11YLanguageContext.Provider value={{ ...getA11yResource("de"), collapsiblePanelTitles: germanTitles }}>
					<InteractionHintConfigProvider enableInteractionHint>
						<CollapsiblePanel title="Title" onClick={noop} />
					</InteractionHintConfigProvider>
				</A11YLanguageContext.Provider>
			);

			expect(getByDataRole(container, DataRoles.HiddenText)).toHaveTextContent("öffnen");
		});
	});

	describe("unmount", () => {
		test("removes a visible interaction hint and does not throw when unmounted while hovered", async () => {
			const { container, unmount } = render(
				<A11YLanguageContext.Provider
					value={{ ...getA11yResource("en"), collapsiblePanelTitles: { openPanel: "open", closePanel: "close" } }}
				>
					<InteractionHintConfigProvider enableInteractionHint>
						<CollapsiblePanel title="Title" onClick={noop} />
					</InteractionHintConfigProvider>
				</A11YLanguageContext.Provider>
			);

			const label = getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper);
			await userEvent.hover(label);

			await waitFor(() => {
				expect(screen.getByDataRole(DataRoles.InteractionHint)).toHaveTextContent("open");
			});

			unmount();

			expect(screen.queryByDataRole(DataRoles.InteractionHint)).not.toBeInTheDocument();
			expect(screen.queryByDataRole(DataRoles.CollapsiblePanel)).not.toBeInTheDocument();
		});

		test("does not throw when unmounted while the title wrapper has the focus", async () => {
			const onClick = vi.fn();
			const { container, unmount } = render(<CollapsiblePanel title="Title" onClick={onClick} />);

			await userEvent.click(getByDataRole(container, DataRoles.CollapsiblePanel.Header));
			expect(getByDataRole(container, DataRoles.CollapsiblePanel.Title.Wrapper)).toHaveFocus();

			expect(() => unmount()).not.toThrow();
			expect(screen.queryByDataRole(DataRoles.CollapsiblePanel)).not.toBeInTheDocument();
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});
});
