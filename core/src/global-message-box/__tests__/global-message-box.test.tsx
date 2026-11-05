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
import { createRef } from "react";
import { getAllByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { BulletList } from "../../bullet-list/main/bullet-list.view.js";
import { ButtonGroup } from "../../button-group/main/button-group.view.js";
import { Button } from "../../button/main/button.view.js";
import { A11YLanguageContext, getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { Icon } from "../../icon/main/icon.view.js";
import type { GlobalMessageBoxVariant } from "../main/global-message-box.api.js";
import { GlobalMessageBox } from "../main/global-message-box.view.js";

describe("com.mgmtp.a12.widgets.global-message-box", () => {
	test("rendering INFO global-message-box", () => {
		const iconName = "info";
		const { container } = render(<GlobalMessageBox variant="info" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering SUCCESS global-message-box", () => {
		const iconName = "check_circle";
		const { container } = render(<GlobalMessageBox variant="success" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering WARNING global-message-box", () => {
		const iconName = "warning";
		const { container } = render(<GlobalMessageBox variant="warning" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering ERROR global-message-box", () => {
		const iconName = "error";
		const { container } = render(<GlobalMessageBox variant="error" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering global-message-box with provided props", () => {
		const properties = {
			id: "box-id",
			className: "test class",
			style: {
				backgroundColor: "blue"
			}
		};
		const { container } = render(<GlobalMessageBox {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering global-message-box with a custom icon", () => {
		const iconName = "speaker_notes";
		const { container } = render(<GlobalMessageBox icon={<Icon>{iconName}</Icon>} variant="info" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering false-ellipsis (multiline) global-message-box", () => {
		const { container } = render(<GlobalMessageBox ellipsis={false} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering CONTENT global-message-box", () => {
		const content = "test content";
		const { container } = render(<GlobalMessageBox content={content} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering base global-message-box", () => {
		const { container, getByDataRole } = render(<GlobalMessageBox content="a" />);
		const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);

		expect(textWrapper?.getAttribute("role") === "heading").toBeTruthy();
		expect(textWrapper?.getAttribute("aria-level") === "2").toBeTruthy();
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering ACTIONS global-message-box", () => {
		const buttons = (
			<ButtonGroup>
				<Button label="Secondary" secondary invert />
				<Button label="Primary" primary invert />
			</ButtonGroup>
		);
		const { container } = render(<GlobalMessageBox actions={buttons} />);

		expect(getAllByDataRole(container, DataRoles.GlobalMessageBox.Actions)).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});

	test.each<GlobalMessageBoxVariant>(["info", "success", "warning", "error"])(
		"bullet-list should inherit the message-box text color and font-weight",
		(variant) => {
			const { getByDataRole, getAllByDataRole } = render(
				<GlobalMessageBox
					variant={variant}
					content={
						<BulletList.Unordered>
							<BulletList.Item>Item 1</BulletList.Item>
							<BulletList.Item>Item 2</BulletList.Item>
						</BulletList.Unordered>
					}
				/>
			);

			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);
			const messageBoxColor = window.getComputedStyle(textWrapper).color;
			const messageBoxFontWeight = window.getComputedStyle(textWrapper).fontWeight;
			const bulletListItems = getAllByDataRole(DataRoles.BulletList.Item);

			expect(bulletListItems.length).toBeGreaterThan(0);
			bulletListItems.forEach((item) => {
				expect(window.getComputedStyle(item).color).toBe(messageBoxColor);
				expect(window.getComputedStyle(item).fontWeight).toBe(messageBoxFontWeight);
				const bulletListContent = item.firstElementChild;
				expect(bulletListContent).not.toBeNull();
				expect(window.getComputedStyle(bulletListContent!).color).toBe(messageBoxColor);
				expect(window.getComputedStyle(bulletListContent!).fontWeight).toBe(messageBoxFontWeight);
			});
		}
	);

	describe("focus management", () => {
		test("focuses the message box on mount by default", () => {
			const { getByDataRole } = render(<GlobalMessageBox content="a" />);
			expect(getByDataRole(DataRoles.GlobalMessageBox)).toHaveFocus();
		});

		test("does not focus the message box on mount when focusOnMount is false", () => {
			const { getByDataRole } = render(<GlobalMessageBox content="a" focusOnMount={false} />);
			expect(getByDataRole(DataRoles.GlobalMessageBox)).not.toHaveFocus();
			expect(document.body).toHaveFocus();
		});

		test("takes the focus away from a previously focused element on mount", () => {
			const outside = document.createElement("button");
			outside.textContent = "outside";
			document.body.appendChild(outside);
			outside.focus();
			expect(outside).toHaveFocus();

			const { getByDataRole } = render(<GlobalMessageBox content="a" />);
			expect(getByDataRole(DataRoles.GlobalMessageBox)).toHaveFocus();

			document.body.removeChild(outside);
		});

		test("does not re-focus the message box when props update after mount", async () => {
			const { getByDataRole, getByRole, rerender } = render(
				<GlobalMessageBox content="a" actions={<Button label="Action" />} />
			);
			expect(getByDataRole(DataRoles.GlobalMessageBox)).toHaveFocus();

			const action = getByRole("button", { name: "Action" });
			await userEvent.click(action);
			expect(action).toHaveFocus();

			rerender(<GlobalMessageBox content="b" variant="warning" actions={<Button label="Action" />} />);
			expect(getByDataRole(DataRoles.GlobalMessageBox.Text)).toMatchTextContent("b");
			expect(action).toHaveFocus();
			expect(getByDataRole(DataRoles.GlobalMessageBox)).not.toHaveFocus();
		});

		test("does not focus the message box when focusOnMount becomes true after mount", () => {
			const { getByDataRole, rerender } = render(<GlobalMessageBox content="a" focusOnMount={false} />);
			expect(getByDataRole(DataRoles.GlobalMessageBox)).not.toHaveFocus();

			rerender(<GlobalMessageBox content="a" focusOnMount />);
			expect(getByDataRole(DataRoles.GlobalMessageBox)).not.toHaveFocus();
		});

		test("is focusable programmatically but not part of the tab order", async () => {
			const { getByDataRole, getByRole } = render(
				<>
					<button type="button">before</button>
					<GlobalMessageBox content="a" focusOnMount={false} />
					<button type="button">after</button>
				</>
			);
			const wrapper = getByDataRole(DataRoles.GlobalMessageBox);
			expect(wrapper).toHaveAttribute("tabindex", "-1");

			getByRole("button", { name: "before" }).focus();
			await userEvent.tab();
			expect(getByRole("button", { name: "after" })).toHaveFocus();
			expect(wrapper).not.toHaveFocus();

			wrapper.focus();
			expect(wrapper).toHaveFocus();
		});

		test("releases the focus and removes its DOM on unmount", () => {
			const { container, getByDataRole, unmount } = render(<GlobalMessageBox content="a" />);
			expect(getByDataRole(DataRoles.GlobalMessageBox)).toHaveFocus();

			unmount();
			expect(container.querySelector(`[data-role="${DataRoles.GlobalMessageBox}"]`)).toBeNull();
			expect(document.body).toHaveFocus();
		});
	});

	describe("ARIA attributes", () => {
		test("applies role heading and aria-level 2 by default", () => {
			const { getByDataRole } = render(<GlobalMessageBox content="a" />);
			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);
			expect(textWrapper).toHaveAttribute("role", "heading");
			expect(textWrapper).toHaveAttribute("aria-level", "2");
		});

		test("applies a custom role and aria-level", () => {
			const { getByDataRole } = render(<GlobalMessageBox content="a" role="alert" ariaLevel={3} />);
			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);
			expect(textWrapper).toHaveAttribute("role", "alert");
			expect(textWrapper).toHaveAttribute("aria-level", "3");
		});

		test("omits role and aria-level when role is false, even if ariaLevel is given", () => {
			const { getByDataRole } = render(<GlobalMessageBox content="a" role={false} ariaLevel={4} />);
			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);
			expect(textWrapper).not.toHaveAttribute("role");
			expect(textWrapper).not.toHaveAttribute("aria-level");
		});

		test("updates role and aria-level when the props change", () => {
			const { getByDataRole, rerender } = render(<GlobalMessageBox content="a" />);
			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);

			rerender(<GlobalMessageBox content="a" ariaLevel={1} />);
			expect(textWrapper).toHaveAttribute("role", "heading");
			expect(textWrapper).toHaveAttribute("aria-level", "1");

			rerender(<GlobalMessageBox content="a" role={false} />);
			expect(textWrapper).not.toHaveAttribute("role");
			expect(textWrapper).not.toHaveAttribute("aria-level");

			rerender(<GlobalMessageBox content="a" role="status" />);
			expect(textWrapper).toHaveAttribute("role", "status");
			expect(textWrapper).toHaveAttribute("aria-level", "2");
		});

		test.each<[GlobalMessageBoxVariant, string]>([
			["info", "Information: "],
			["success", "Success: "],
			["warning", "Warning: "],
			["error", "Error: "]
		])("prefixes the %s content with the localized hidden variant title", (variant, hiddenTitle) => {
			const { getByDataRole } = render(<GlobalMessageBox variant={variant} content="message" />);
			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);
			const hiddenText = getByDataRole(DataRoles.HiddenText);

			expect(hiddenText).toHaveTextContent(hiddenTitle.trim());
			expect(textWrapper).toContainElement(hiddenText);
			expect(textWrapper.textContent).toBe(`${hiddenTitle}message`);
		});

		test("uses the info hidden title when no variant is given", () => {
			const { getByDataRole } = render(<GlobalMessageBox content="message" />);
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Information:");
		});

		test("reads the hidden variant titles from the A11YLanguageContext", () => {
			const { getByDataRole } = render(
				<A11YLanguageContext.Provider value={getA11yResource("de")}>
					<GlobalMessageBox variant="warning" content="message" />
				</A11YLanguageContext.Provider>
			);
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Warnung:");
		});

		test("updates the hidden title when the A11YLanguageContext value changes", () => {
			const { getByDataRole, rerender } = render(
				<A11YLanguageContext.Provider value={getA11yResource("en")}>
					<GlobalMessageBox variant="error" content="message" />
				</A11YLanguageContext.Provider>
			);
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Error:");

			rerender(
				<A11YLanguageContext.Provider value={getA11yResource("de")}>
					<GlobalMessageBox variant="error" content="message" />
				</A11YLanguageContext.Provider>
			);
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Fehler:");
		});

		test("renders no hidden title when the context provides none for the variant", () => {
			const { queryByDataRole, getByDataRole } = render(
				<A11YLanguageContext.Provider value={{ ...getA11yResource("en"), globalMessageBoxTitles: {} }}>
					<GlobalMessageBox variant="success" content="message" />
				</A11YLanguageContext.Provider>
			);
			expect(queryByDataRole(DataRoles.HiddenText)).toBeNull();
			expect(getByDataRole(DataRoles.GlobalMessageBox.Text).textContent).toBe("message");
		});
	});

	describe("rendering", () => {
		test.each<[GlobalMessageBoxVariant, string]>([
			["info", "info"],
			["success", "check_circle"],
			["warning", "warning_amber"]
		])("renders the default %s icon", (variant, iconName) => {
			const { getByDataRole } = render(<GlobalMessageBox variant={variant} />);
			const graphic = getByDataRole(DataRoles.GlobalMessageBox.Graphic);
			const icon = getByDataRole(DataRoles.Icon);
			expect(graphic).toContainElement(icon);
			expect(icon).toHaveTextContent(iconName);
		});

		test("renders a default icon for the error variant", () => {
			const { getByDataRole } = render(<GlobalMessageBox variant="error" />);
			const graphic = getByDataRole(DataRoles.GlobalMessageBox.Graphic);
			const icon = getByDataRole(DataRoles.Icon);
			expect(graphic).toContainElement(icon);
			expect(icon.textContent).not.toBe("");
		});

		test("renders a custom icon instead of the variant icon", () => {
			const { getByDataRole, getAllByDataRole } = render(
				<GlobalMessageBox variant="success" icon={<Icon>speaker_notes</Icon>} />
			);
			const graphic = getByDataRole(DataRoles.GlobalMessageBox.Graphic);
			expect(getAllByDataRole(DataRoles.Icon)).toHaveLength(1);
			expect(graphic).toHaveTextContent("speaker_notes");
			expect(graphic).not.toHaveTextContent("check_circle");
		});

		test("applies id, className and style to the root element and keeps the variant class", () => {
			const { getByDataRole } = render(
				<GlobalMessageBox id="box-id" className="custom-class" style={{ marginTop: "3px" }} variant="warning" />
			);
			const wrapper = getByDataRole(DataRoles.GlobalMessageBox);
			expect(wrapper).toHaveAttribute("id", "box-id");
			expect(wrapper).toHaveClass("custom-class");
			expect(wrapper.className).toMatch(/global-message-box--warning/);
			expect(wrapper).toHaveStyle({ marginTop: "3px" });
		});

		test("marks the box as multiline only when ellipsis is false", () => {
			const { getByDataRole, rerender } = render(<GlobalMessageBox content="a" />);
			const wrapper = getByDataRole(DataRoles.GlobalMessageBox);
			expect(wrapper.className).not.toMatch(/--multiline/);

			rerender(<GlobalMessageBox content="a" ellipsis={false} />);
			expect(wrapper.className).toMatch(/--multiline/);

			rerender(<GlobalMessageBox content="a" ellipsis />);
			expect(wrapper.className).not.toMatch(/--multiline/);
		});

		test("renders rich content inside the text wrapper after the hidden title", () => {
			const { getByDataRole, getByTestId } = render(
				<GlobalMessageBox
					content={
						<span data-testid="rich-content">
							Rich <strong>content</strong>
						</span>
					}
				/>
			);
			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);
			const richContent = getByTestId("rich-content");
			expect(textWrapper).toContainElement(richContent);
			expect(textWrapper.lastElementChild).toBe(richContent);
			expect(textWrapper.textContent).toBe("Information: Rich content");
		});

		test("renders an empty actions container when no actions are given", () => {
			const { getByDataRole } = render(<GlobalMessageBox content="a" />);
			expect(getByDataRole(DataRoles.GlobalMessageBox.Actions)).toBeEmptyDOMElement();
		});
	});

	describe("prop updates", () => {
		test("updates variant class, default icon and hidden title when the variant changes", () => {
			const { getByDataRole, rerender } = render(<GlobalMessageBox variant="info" content="message" />);
			const wrapper = getByDataRole(DataRoles.GlobalMessageBox);
			expect(wrapper.className).toMatch(/global-message-box--info/);
			expect(getByDataRole(DataRoles.Icon)).toHaveTextContent("info");
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Information:");

			rerender(<GlobalMessageBox variant="success" content="message" />);
			expect(wrapper.className).toMatch(/global-message-box--success/);
			expect(wrapper.className).not.toMatch(/global-message-box--info/);
			expect(getByDataRole(DataRoles.Icon)).toHaveTextContent("check_circle");
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Success:");

			rerender(<GlobalMessageBox variant="warning" content="message" />);
			expect(wrapper.className).toMatch(/global-message-box--warning/);
			expect(getByDataRole(DataRoles.Icon)).toHaveTextContent("warning_amber");
			expect(getByDataRole(DataRoles.HiddenText)).toHaveTextContent("Warning:");
		});

		test("updates the content when it changes", () => {
			const { getByDataRole, rerender } = render(<GlobalMessageBox content="first" />);
			const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);
			expect(textWrapper).toMatchTextContent("first");

			rerender(<GlobalMessageBox content="second" />);
			expect(textWrapper).toMatchTextContent("second");
			expect(textWrapper).not.toHaveTextContent("first");

			rerender(<GlobalMessageBox />);
			expect(textWrapper.textContent).toBe("Information: ");
		});

		test("switches between the default and a custom icon", () => {
			const { getByDataRole, rerender } = render(<GlobalMessageBox variant="info" />);
			expect(getByDataRole(DataRoles.Icon)).toHaveTextContent("info");

			rerender(<GlobalMessageBox variant="info" icon={<Icon>speaker_notes</Icon>} />);
			expect(getByDataRole(DataRoles.Icon)).toHaveTextContent("speaker_notes");

			rerender(<GlobalMessageBox variant="info" />);
			expect(getByDataRole(DataRoles.Icon)).toHaveTextContent("info");
		});

		test("updates the actions when they change", () => {
			const { getByDataRole, queryByRole, rerender } = render(
				<GlobalMessageBox content="a" actions={<Button label="Dismiss" />} />
			);
			const actions = getByDataRole(DataRoles.GlobalMessageBox.Actions);
			expect(actions).toContainElement(queryByRole("button", { name: "Dismiss" }));

			rerender(<GlobalMessageBox content="a" actions={<Button label="Retry" />} />);
			expect(queryByRole("button", { name: "Dismiss" })).toBeNull();
			expect(actions).toContainElement(queryByRole("button", { name: "Retry" }));

			rerender(<GlobalMessageBox content="a" />);
			expect(actions).toBeEmptyDOMElement();
		});

		test("updates id, className and style when they change", () => {
			const { getByDataRole, rerender } = render(<GlobalMessageBox id="first" className="one" />);
			const wrapper = getByDataRole(DataRoles.GlobalMessageBox);
			expect(wrapper).toHaveAttribute("id", "first");
			expect(wrapper).toHaveClass("one");

			rerender(<GlobalMessageBox id="second" className="two" style={{ marginTop: "5px" }} />);
			expect(wrapper).toHaveAttribute("id", "second");
			expect(wrapper).toHaveClass("two");
			expect(wrapper).not.toHaveClass("one");
			expect(wrapper).toHaveStyle({ marginTop: "5px" });
		});
	});

	describe("actions", () => {
		test("invokes the action handler on click", async () => {
			const onClick = vi.fn();
			const { getByRole } = render(
				<GlobalMessageBox content="a" actions={<Button label="Dismiss" onClick={onClick} />} />
			);

			await userEvent.click(getByRole("button", { name: "Dismiss" }));
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		test("invokes the action handler via keyboard", async () => {
			const onClick = vi.fn();
			const { getByRole } = render(
				<GlobalMessageBox content="a" actions={<Button label="Dismiss" onClick={onClick} />} />
			);

			const button = getByRole("button", { name: "Dismiss" });
			button.focus();
			await userEvent.keyboard("{Enter}");
			expect(onClick).toHaveBeenCalledTimes(1);
			await userEvent.keyboard(" ");
			expect(onClick).toHaveBeenCalledTimes(2);
		});

		test("uses the latest handler after a re-render", async () => {
			const first = vi.fn();
			const second = vi.fn();
			const { getByRole, rerender } = render(
				<GlobalMessageBox content="a" actions={<Button label="Dismiss" onClick={first} />} />
			);

			rerender(<GlobalMessageBox content="a" actions={<Button label="Dismiss" onClick={second} />} />);
			await userEvent.click(getByRole("button", { name: "Dismiss" }));
			expect(first).not.toHaveBeenCalled();
			expect(second).toHaveBeenCalledTimes(1);
		});
	});

	describe("class compatibility", () => {
		test("keeps the component instance ref and the static defaultProps", () => {
			const ref = createRef<GlobalMessageBox>();
			render(<GlobalMessageBox ref={ref} content="a" />);
			expect(ref.current).toBeInstanceOf(GlobalMessageBox);
			expect(GlobalMessageBox.defaultProps.focusOnMount).toBe(true);
		});

		test("binds the methods of a subclass to the instance", () => {
			class CustomMessageBox extends GlobalMessageBox {
				getContent(): ReactNode {
					return this.props.content;
				}
			}

			const ref = createRef<CustomMessageBox>();
			render(<CustomMessageBox ref={ref} content="custom content" />);

			const { getContent } = ref.current!;
			expect(getContent()).toBe("custom content");
		});

		test("lets a subclass call super.componentDidMount", () => {
			const mounted = vi.fn();

			class CustomMessageBox extends GlobalMessageBox {
				componentDidMount(): void {
					super.componentDidMount();
					mounted();
				}
			}

			const { getByDataRole } = render(<CustomMessageBox content="custom content" />);

			expect(getByDataRole(DataRoles.GlobalMessageBox)).toBeInTheDocument();
			expect(mounted).toHaveBeenCalledTimes(1);
		});
	});
});
