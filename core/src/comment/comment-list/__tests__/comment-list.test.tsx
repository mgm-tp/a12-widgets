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
import { getAllByDataRole, getByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";
import { addPrefix } from "../../../common/main/utils.js";
import { Comment } from "../../comment/main/comment.view.js";
import { CommentList } from "../main/comment-list.view.js";

describe("com.mgmtp.a12.widgets.comment.comment-list", () => {
	const commentMeta = {
		avatar: "avatar",
		author: "Matt",
		action: "wrote",
		date: "date"
	};
	const comments: ReactNode[] = [
		<Comment commentMeta={commentMeta} key="0">
			content
		</Comment>,
		<Comment commentMeta={commentMeta} key="1">
			content
		</Comment>,
		<Comment commentMeta={commentMeta} key="2">
			content
		</Comment>,
		<Comment commentMeta={commentMeta} key="3">
			content
		</Comment>,
		<Comment commentMeta={commentMeta} key="4">
			content
		</Comment>
	];
	const commentListComponent = <CommentList>{comments}</CommentList>;

	test("rendering-comment-list", () => {
		const { container } = render(commentListComponent);
		expect(container.firstChild).toMatchSnapshot();
	});

	describe("behavior", () => {
		const baseClassName = addPrefix("comment-list");
		const renderComments = (count: number): ReactNode[] =>
			Array.from({ length: count }, (_, index) => (
				<Comment commentMeta={commentMeta} key={index}>
					comment {index}
				</Comment>
			));
		const getList = (container: HTMLElement): HTMLElement => getByDataRole(container, DataRoles.CommentList);
		const getItems = (container: HTMLElement): HTMLElement[] => getAllByDataRole(container, DataRoles.CommentList.Item);
		const isScrolledToBottom = (list: HTMLElement): boolean =>
			Math.abs(list.scrollTop - (list.scrollHeight - list.clientHeight)) <= 1;
		// The list scrolls to the bottom in a timeout after mounting.
		const waitForMountTimeout = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));
		// Keeps the list shorter than its content so it has something to scroll; the theme's min height is overridden.
		const scrollableStyle = { height: "120px", minHeight: "0" };

		describe("rendering and prop updates", () => {
			test("renders every child as a list item", () => {
				const { container } = render(<CommentList>{renderComments(3)}</CommentList>);
				const list = getList(container);
				const items = getItems(container);

				expect(list.tagName).toBe("UL");
				expect(list).toHaveClass(baseClassName);
				expect(items).toHaveLength(3);
				items.forEach((item, index) => {
					expect(item.tagName).toBe("LI");
					expect(item).toHaveClass(`${baseClassName}__item`);
					expect(item).toMatchTextContent(`comment ${index}`);
					expect(getByDataRole(item, DataRoles.Comment)).toBeTruthy();
				});
			});

			test("skips empty children and wraps a single child", () => {
				const { container } = render(
					<CommentList>
						{null}
						{false}
						{renderComments(1)}
					</CommentList>
				);

				expect(getItems(container)).toHaveLength(1);
			});

			test("appends and removes comments after mount", () => {
				const { container, rerender } = render(<CommentList>{renderComments(2)}</CommentList>);
				expect(getItems(container)).toHaveLength(2);

				rerender(
					<CommentList>
						{renderComments(2)}
						<Comment commentMeta={commentMeta} key="new">
							new comment
						</Comment>
					</CommentList>
				);
				const items = getItems(container);
				expect(items).toHaveLength(3);
				expect(items[2]).toMatchTextContent("new comment");

				rerender(<CommentList>{renderComments(1)}</CommentList>);
				expect(getItems(container)).toHaveLength(1);
				expect(getItems(container)[0]).toMatchTextContent("comment 0");
			});

			test("applies id, className and style to the list and updates them", () => {
				const { container, rerender } = render(
					<CommentList id="first-id" className="first-class" style={{ color: "rgb(255, 0, 0)" }}>
						{renderComments(1)}
					</CommentList>
				);

				expect(getList(container)).toHaveAttribute("id", "first-id");
				expect(getList(container)).toHaveClass(baseClassName, "first-class");
				expect(getList(container)).toHaveStyle({ color: "rgb(255, 0, 0)" });

				rerender(
					<CommentList id="second-id" className="second-class" style={{ color: "rgb(0, 0, 255)" }}>
						{renderComments(1)}
					</CommentList>
				);

				expect(getList(container)).toHaveAttribute("id", "second-id");
				expect(getList(container)).toHaveClass(baseClassName, "second-class");
				expect(getList(container)).not.toHaveClass("first-class");
				expect(getList(container)).toHaveStyle({ color: "rgb(0, 0, 255)" });
			});

			test("renders an empty list without children", () => {
				const { container } = render(<CommentList />);

				expect(getList(container)).toBeEmptyDOMElement();
			});
		});

		describe("scrolling", () => {
			test("scrolls to the bottom after mount when scrollToBottom is set", async () => {
				const { container } = render(
					<CommentList scrollToBottom style={scrollableStyle}>
						{renderComments(20)}
					</CommentList>
				);
				const list = getList(container);

				expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
				await vi.waitFor(() => expect(isScrolledToBottom(list)).toBe(true));
			});

			test("stays at the top without scrollToBottom", async () => {
				const { container } = render(<CommentList style={scrollableStyle}>{renderComments(20)}</CommentList>);
				const list = getList(container);
				await waitForMountTimeout();

				expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
				expect(list.scrollTop).toBe(0);
			});

			test("scrolls to the bottom again when a comment is appended", async () => {
				const { container, rerender } = render(
					<CommentList scrollToBottom style={scrollableStyle}>
						{renderComments(20)}
					</CommentList>
				);
				const list = getList(container);
				await vi.waitFor(() => expect(isScrolledToBottom(list)).toBe(true));

				list.scrollTop = 0;
				expect(isScrolledToBottom(list)).toBe(false);

				rerender(
					<CommentList scrollToBottom style={scrollableStyle}>
						{renderComments(21)}
					</CommentList>
				);

				expect(getItems(container)).toHaveLength(21);
				expect(isScrolledToBottom(list)).toBe(true);
			});

			test("scrolls to the bottom once scrollToBottom is enabled after mount", async () => {
				const { container, rerender } = render(<CommentList style={scrollableStyle}>{renderComments(20)}</CommentList>);
				const list = getList(container);
				await waitForMountTimeout();
				expect(list.scrollTop).toBe(0);

				rerender(
					<CommentList scrollToBottom style={scrollableStyle}>
						{renderComments(20)}
					</CommentList>
				);

				expect(isScrolledToBottom(list)).toBe(true);
			});

			test("keeps the scroll position once scrollToBottom is disabled", async () => {
				const { container, rerender } = render(
					<CommentList scrollToBottom style={scrollableStyle}>
						{renderComments(20)}
					</CommentList>
				);
				const list = getList(container);
				await vi.waitFor(() => expect(isScrolledToBottom(list)).toBe(true));

				list.scrollTop = 0;
				rerender(<CommentList style={scrollableStyle}>{renderComments(21)}</CommentList>);

				expect(getItems(container)).toHaveLength(21);
				expect(list.scrollTop).toBe(0);
			});
		});
	});
});
