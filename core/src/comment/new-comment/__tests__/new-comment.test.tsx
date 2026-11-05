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

import type { ChangeEvent } from "react";
import { useState } from "react";
import { getByDataRole, queryByDataRole, render, fireEvent, within } from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "../../../button/main/button.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { addPrefix } from "../../../common/main/utils.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { NewComment } from "../main/new-comment.view.js";

const baseTextAreaDataRole = "textarea";
describe("com.mgmtp.a12.widgets.new-comment", () => {
	const content = "Some random string";

	test("rendering-new-comment", () => {
		const { container } = render(
			<NewComment
				commentMeta={{
					avatar: <Icon>account_circle</Icon>,
					author: "Livia Böhme"
				}}
			>
				{content}
			</NewComment>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-new-comment-with-reply", () => {
		const { container } = render(<NewComment isReply> {content} </NewComment>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-new-comment-with-actions", () => {
		const { container } = render(
			<NewComment
				actionButtons={[
					<Button key="cancel-button" label="Cancel" destructive />,
					<Button key="send-button" label="Send" primary />
				]}
			>
				{content}
			</NewComment>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	describe("behavior", () => {
		const baseClassName = addPrefix("new-comment");
		const getNewComment = (container: HTMLElement): HTMLElement => getByDataRole(container, DataRoles.NewComment);
		const isScrolledToBottom = (element: HTMLElement): boolean =>
			Math.abs(element.scrollTop - (element.scrollHeight - element.clientHeight)) <= 1;
		// Keeps the wrapper shorter than its content so it has something to scroll.
		const scrollableStyle = { height: "80px" };
		const tallContent = (height: number) => <div style={{ height: `${height}px` }}>tall content</div>;

		describe("rendering and prop updates", () => {
			test("renders avatar and author of a comment meta object", () => {
				const { container } = render(
					<NewComment commentMeta={{ avatar: <span>avatar</span>, author: "Livia" }}>{content}</NewComment>
				);

				expect(getByDataRole(container, DataRoles.NewComment.MetaContainer)).toBeTruthy();
				expect(getByDataRole(container, DataRoles.NewComment.Avatar)).toHaveTextContent("avatar");
				expect(getByDataRole(container, DataRoles.NewComment.Author)).toHaveTextContent("Livia");
			});

			test("renders only the given meta fields", () => {
				const { container } = render(<NewComment commentMeta={{ author: "Livia" }}>{content}</NewComment>);

				expect(queryByDataRole(container, DataRoles.NewComment.Avatar)).toBeNull();
				expect(getByDataRole(container, DataRoles.NewComment.Author)).toHaveTextContent("Livia");
			});

			test("renders a custom meta node and drops the meta container without a meta", () => {
				const { container, rerender } = render(
					<NewComment commentMeta={<span data-testid="custom-meta">Custom meta</span>}>{content}</NewComment>
				);

				expect(getByDataRole(container, DataRoles.NewComment.MetaContainer)).toContainElement(
					within(container).getByTestId("custom-meta")
				);
				expect(queryByDataRole(container, DataRoles.NewComment.Avatar)).toBeNull();
				expect(queryByDataRole(container, DataRoles.NewComment.Author)).toBeNull();

				rerender(<NewComment>{content}</NewComment>);

				expect(queryByDataRole(container, DataRoles.NewComment.MetaContainer)).toBeNull();
			});

			test("renders the children in the content area and updates them", () => {
				const { container, rerender } = render(<NewComment>{content}</NewComment>);
				expect(getByDataRole(container, DataRoles.NewComment.Content)).toHaveTextContent(content);

				rerender(
					<NewComment>
						<NewComment.Input placeholder="Write a comment" />
					</NewComment>
				);

				expect(
					within(getByDataRole(container, DataRoles.NewComment.Content)).getByPlaceholderText("Write a comment")
				).toBeTruthy();
			});

			test("renders the action buttons in a button group and calls their handlers", async () => {
				const onCancel = vi.fn();
				const onSend = vi.fn();
				const { container } = render(
					<NewComment
						actionButtons={[
							<Button key="cancel" label="Cancel" onClick={onCancel} />,
							<Button key="send" label="Send" onClick={onSend} />
						]}
					>
						{content}
					</NewComment>
				);
				const group = getByDataRole(container, DataRoles.ButtonGroup);

				await userEvent.click(within(group).getByRole("button", { name: "Send" }));
				expect(onSend).toHaveBeenCalledTimes(1);
				expect(onCancel).not.toHaveBeenCalled();

				await userEvent.click(within(group).getByRole("button", { name: "Cancel" }));
				expect(onCancel).toHaveBeenCalledTimes(1);
			});

			test("calls the action handler that is current after a rerender", async () => {
				const staleOnSend = vi.fn();
				const currentOnSend = vi.fn();
				const { container, rerender } = render(
					<NewComment actionButtons={<Button label="Send" onClick={staleOnSend} />}>{content}</NewComment>
				);

				rerender(<NewComment actionButtons={<Button label="Send" onClick={currentOnSend} />}>{content}</NewComment>);
				await userEvent.click(within(container).getByRole("button", { name: "Send" }));

				expect(staleOnSend).not.toHaveBeenCalled();
				expect(currentOnSend).toHaveBeenCalledTimes(1);
			});

			test("omits the button group without action buttons", () => {
				const { container } = render(<NewComment>{content}</NewComment>);

				expect(queryByDataRole(container, DataRoles.ButtonGroup)).toBeNull();
			});

			test("applies id, className, style and the reply class and updates them", () => {
				const { container, rerender } = render(
					<NewComment id="first-id" className="first-class" style={{ color: "rgb(255, 0, 0)" }}>
						{content}
					</NewComment>
				);

				expect(getNewComment(container)).toHaveAttribute("id", "first-id");
				expect(getNewComment(container)).toHaveClass(baseClassName, "first-class");
				expect(getNewComment(container)).not.toHaveClass(addPrefix("comment__replies-item"));
				expect(getNewComment(container)).toHaveStyle({ color: "rgb(255, 0, 0)" });

				rerender(
					<NewComment id="second-id" className="second-class" isReply>
						{content}
					</NewComment>
				);

				expect(getNewComment(container)).toHaveAttribute("id", "second-id");
				expect(getNewComment(container)).toHaveClass(baseClassName, "second-class", addPrefix("comment__replies-item"));
				expect(getNewComment(container)).not.toHaveClass("first-class");
			});
		});

		describe("scrolling", () => {
			test("scrolls to the bottom after mount", () => {
				const { container } = render(<NewComment style={scrollableStyle}>{tallContent(400)}</NewComment>);
				const wrapper = getNewComment(container);

				expect(wrapper.scrollHeight).toBeGreaterThan(wrapper.clientHeight);
				expect(isScrolledToBottom(wrapper)).toBe(true);
			});

			test("scrolls to the bottom again after an update", () => {
				const { container, rerender } = render(<NewComment style={scrollableStyle}>{tallContent(400)}</NewComment>);
				const wrapper = getNewComment(container);

				wrapper.scrollTop = 0;
				expect(isScrolledToBottom(wrapper)).toBe(false);

				rerender(<NewComment style={scrollableStyle}>{tallContent(600)}</NewComment>);

				expect(isScrolledToBottom(wrapper)).toBe(true);
			});
		});
	});
});

describe("com.mgmtp.a12.widgets.new-comment.input", () => {
	test("rendering-new-comment-input", () => {
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();

		const { container } = render(<NewComment.Input onFocus={onFocusSpy} onBlur={onBlurSpy} />);
		const input = getByDataRole(container, `${baseTextAreaDataRole}-input`);

		fireEvent.focus(input);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		expect(container.firstChild).toMatchSnapshot();
	});

	describe("behavior", () => {
		const getInput = (container: HTMLElement): HTMLTextAreaElement =>
			getByDataRole(container, DataRoles.Textarea.Input) as HTMLTextAreaElement;

		test("forwards value, placeholder, label and disabled to the textarea", () => {
			const { container, rerender } = render(
				<NewComment.Input value="Hello" placeholder="Write a comment" label="Comment" onChange={vi.fn()} />
			);

			expect(getInput(container)).toHaveValue("Hello");
			expect(getInput(container)).toHaveAttribute("placeholder", "Write a comment");
			expect(getInput(container)).toBeEnabled();
			expect(getByDataRole(container, DataRoles.Textarea.Label)).toMatchTextContent("Comment");

			rerender(
				<NewComment.Input value="Changed" placeholder="Write a comment" label="Comment" disabled onChange={vi.fn()} />
			);

			expect(getInput(container)).toHaveValue("Changed");
			expect(getInput(container)).toBeDisabled();
		});

		test("calls onChange with the typed value", async () => {
			const values: string[] = [];
			const onChange = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => values.push(event.target.value));
			// The input is stateless, so the typed value is written back like a consumer would.
			const ControlledInput = () => {
				const [value, setValue] = useState("");

				return (
					<NewComment.Input
						value={value}
						onChange={(event) => {
							onChange(event);
							setValue(event.target.value);
						}}
					/>
				);
			};

			const { container } = render(<ControlledInput />);

			await userEvent.type(getInput(container), "Hi");

			expect(onChange).toHaveBeenCalledTimes(2);
			expect(values).toEqual(["H", "Hi"]);
			expect(getInput(container)).toHaveValue("Hi");
		});

		test("keeps the given value while typing without an onChange handler", async () => {
			const { container } = render(<NewComment.Input value="Fixed" />);

			await userEvent.type(getInput(container), "H");

			expect(getInput(container)).toHaveValue("Fixed");
		});

		test("calls the onChange handler that is current after a rerender", async () => {
			const staleOnChange = vi.fn();
			const currentOnChange = vi.fn();
			const { container, rerender } = render(<NewComment.Input onChange={staleOnChange} />);

			rerender(<NewComment.Input onChange={currentOnChange} />);
			await userEvent.type(getInput(container), "H");

			expect(staleOnChange).not.toHaveBeenCalled();
			expect(currentOnChange).toHaveBeenCalledTimes(1);
		});

		test("calls onKeyDown for Enter and Escape", async () => {
			const onKeyDown = vi.fn();
			const { container } = render(<NewComment.Input onKeyDown={onKeyDown} />);

			getInput(container).focus();
			await userEvent.keyboard("{Enter}");
			await userEvent.keyboard("{Escape}");

			expect(onKeyDown).toHaveBeenCalledTimes(2);
			expect(onKeyDown.mock.calls.map(([event]) => event.key)).toEqual(["Enter", "Escape"]);
		});

		test("focuses the textarea on mount with autoFocus", () => {
			const { container } = render(<NewComment.Input autoFocus />);

			expect(getInput(container)).toHaveFocus();
		});

		test("leaves the textarea unfocused without autoFocus", () => {
			const { container } = render(<NewComment.Input />);

			expect(getInput(container)).not.toHaveFocus();
		});
	});
});
