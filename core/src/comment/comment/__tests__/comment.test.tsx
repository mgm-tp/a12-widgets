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

import { getAllByDataRole, getByDataRole, queryByDataRole, render, fireEvent, within } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Button } from "../../../button/main/button.view.js";
import { DataRoles } from "../../../common/index.js";
import { addPrefix } from "../../../common/main/utils.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { PopUpMenu } from "../../../pop-up-menu/main/pop-up-menu.view.js";
import { Tag } from "../../../tag/main/tag/tag.view.js";
import type { CommentProps } from "../main/comment.api.js";
import { Comment } from "../main/comment.view.js";

describe("com.mgmtp.a12.widgets.comment.comment", () => {
	const content = "Some random string";

	function generateMeta(model?: { ignoredProperties: string[] }): Record<string, any> {
		const defaultMeta: { [key: string]: string | undefined } = {
			avatar: "avatar",
			author: "Matt",
			action: "wrote",
			date: "Fri, 16 Dec 2022 20:24:00 GMT"
		};

		if (model) {
			for (const property in defaultMeta) {
				if (model.ignoredProperties.indexOf(property) !== -1) {
					defaultMeta[property] = undefined;
				}
			}
		}

		return defaultMeta;
	}

	test("rendering-comment", () => {
		const commentMeta = "Comment Meta";
		const { container } = render(<Comment commentMeta={commentMeta}>{content}</Comment>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-comment-with-provided-class-id-style", () => {
		const properties = { className: "test-class", id: "test-id", style: { color: "red" } };
		const { container } = render(
			<Comment commentMeta={null} className={properties.className} id={properties.id} style={properties.style} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-with-comment-meta", () => {
		const meta = ["avatar", "author", "action", "date"];
		const textMeta = "Text Meta";
		const { rerender, container } = render(<Comment commentMeta={null} />);

		expect(container.firstChild).toMatchSnapshot();

		rerender(<Comment commentMeta={textMeta} />);

		expect(container.firstChild).toMatchSnapshot();

		meta.forEach((meta) => {
			rerender(<Comment commentMeta={{ [meta]: meta }} />);
			expect(container.firstChild).toMatchSnapshot();
		});

		rerender(<Comment commentMeta={generateMeta()} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-inactive-comment-meta", () => {
		const inactiveCommentMeta = "Inactive comment meta";
		const { container } = render(
			<Comment inactiveCommentMeta={inactiveCommentMeta} commentMeta={null}>
				{content}
			</Comment>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-comment-with-comment-tags", async () => {
		const tag = (
			<>
				<Tag icon={<Icon>phone_iphone</Icon>} color="#2e1561">
					iOS phone
				</Tag>
				<Tag icon={<Icon>phone_iphone</Icon>} color="#4a9832">
					android phone
				</Tag>
			</>
		);
		const { container } = render(<Comment commentMeta={null} inactive commentTags={tag} />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-inactive-comment", async () => {
		const showAllText = "Show all";
		const minimizeText = "Minimize";
		const { container } = render(
			<Comment commentMeta={generateMeta()} inactive showAllText={showAllText} minimiseText={minimizeText} />
		);
		expect(container.firstChild).toMatchSnapshot();
		const buttonTrigger = getByDataRole(container, DataRoles.Button);
		fireEvent.click(buttonTrigger);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-action-buttons-comment", () => {
		const actionButtons = [<Button label="Reply" key="reply" />, <Button label="Delete" key="delete" />];
		const { rerender, container } = render(<Comment actionButtons={actionButtons} commentMeta={null} />);
		expect(container.firstChild).toMatchSnapshot();

		rerender(<Comment actionButtons={actionButtons} commentMeta={null} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-comment-triggered-action-buttons", () => {
		const { container } = render(
			<Comment
				commentMeta={generateMeta()}
				combinedActionButton={
					<PopUpMenu icon={<Icon>more_vert</Icon>}>
						<Button key="tag-button" icon={<Icon>label</Icon>} label="Tag" />
						<Button key="edit-button" label="Edit" />
						<Button key="delete-button" label="Delete" />
					</PopUpMenu>
				}
			>
				{content}
			</Comment>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-a-comment-reply-item", () => {
		const { container } = render(<Comment commentMeta={generateMeta()} isReply />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-comment-with-replies-comment", () => {
		const { container } = render(<Comment commentMeta={generateMeta()} replies={<p>Comment here</p>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("resets-padding-right-from-reply-level-2-and-above", () => {
		const actionButton = <Button label="Actions" />;
		const { container } = render(
			<Comment
				isReply
				commentMeta={generateMeta()}
				combinedActionButton={actionButton}
				replies={
					<Comment
						isReply
						commentMeta={generateMeta()}
						combinedActionButton={actionButton}
						replies={
							<Comment
								isReply
								commentMeta={generateMeta()}
								combinedActionButton={actionButton}
								replies={
									<Comment isReply commentMeta={generateMeta()} combinedActionButton={actionButton}>
										{content}
									</Comment>
								}
							>
								{content}
							</Comment>
						}
					>
						{content}
					</Comment>
				}
			>
				{content}
			</Comment>
		);

		const commentWrappers = getAllByDataRole(container, DataRoles.Comment);

		// Main comment and its reply (level 1), wrappers keep their non-zero replyComment right padding
		expect(window.getComputedStyle(commentWrappers[0]).paddingRight).not.toBe("0px");
		expect(window.getComputedStyle(commentWrappers[1]).paddingRight).not.toBe("0px");

		// From level 2 (level 1's replies), padding-right is reset so that it will make sure all element inside stay right-aligned
		expect(window.getComputedStyle(commentWrappers[2]).paddingRight).toBe("0px");
		expect(window.getComputedStyle(commentWrappers[3]).paddingRight).toBe("0px");
	});

	describe("behavior", () => {
		const baseClassName = addPrefix("comment");
		const getComment = (container: HTMLElement): HTMLElement => getByDataRole(container, DataRoles.Comment);

		describe("meta", () => {
			test("renders avatar, author, action and date of a comment meta object", () => {
				const { container } = render(<Comment commentMeta={generateMeta()}>{content}</Comment>);
				const meta = getByDataRole(container, DataRoles.Comment.Meta);

				expect(meta.children).toHaveLength(4);
				expect(meta).toMatchTextContent("avatar");
				expect(meta).toMatchTextContent("Matt");
				expect(meta).toMatchTextContent("wrote");
				expect(meta).toMatchTextContent("Fri, 16 Dec 2022 20:24:00 GMT");
				expect(meta).not.toHaveClass(`${baseClassName}__meta--destructive`);
			});

			test("renders only the given meta fields", () => {
				const { container } = render(<Comment commentMeta={{ author: "Matt" }}>{content}</Comment>);
				const meta = getByDataRole(container, DataRoles.Comment.Meta);

				expect(meta.children).toHaveLength(1);
				expect(meta).toHaveTextContent("Matt");
			});

			test("renders a custom meta node as given", () => {
				const { container } = render(
					<Comment commentMeta={<span data-testid="custom-meta">Custom meta</span>}>{content}</Comment>
				);

				expect(queryByDataRole(container, DataRoles.Comment.Meta)).toBeNull();
				expect(within(container).getByTestId("custom-meta")).toHaveTextContent("Custom meta");
			});

			test("renders the inactive meta as destructive next to the meta", () => {
				const { container } = render(
					<Comment commentMeta={generateMeta()} inactiveCommentMeta={{ author: "Anna", action: "deleted" }}>
						{content}
					</Comment>
				);
				const metas = getAllByDataRole(container, DataRoles.Comment.Meta);

				expect(metas).toHaveLength(2);
				expect(metas[0]).toMatchTextContent("Matt");
				expect(metas[0]).not.toHaveClass(`${baseClassName}__meta--destructive`);
				expect(metas[1]).toMatchTextContent("Anna");
				expect(metas[1]).toMatchTextContent("deleted");
				expect(metas[1]).toHaveClass(`${baseClassName}__meta--destructive`);
			});

			test("updates the meta after mount", () => {
				const { container, rerender } = render(<Comment commentMeta={{ author: "Matt" }}>{content}</Comment>);
				expect(getByDataRole(container, DataRoles.Comment.Meta)).toHaveTextContent("Matt");

				rerender(<Comment commentMeta={{ author: "Anna", date: "today" }}>{content}</Comment>);

				const meta = getByDataRole(container, DataRoles.Comment.Meta);
				expect(meta.children).toHaveLength(2);
				expect(meta).toMatchTextContent("Anna");
				expect(meta).toMatchTextContent("today");
			});

			test("groups the meta with a combined action button and calls its handler", async () => {
				const onCombinedClick = vi.fn();
				const { container } = render(
					<Comment
						commentMeta={generateMeta()}
						combinedActionButton={<Button label="More" onClick={onCombinedClick} />}
					>
						{content}
					</Comment>
				);
				const combine = getByDataRole(container, DataRoles.Comment.Actions.Combine);

				expect(getByDataRole(container, DataRoles.Comment.MetaGroup)).toContainElement(
					getByDataRole(container, DataRoles.Comment.Meta)
				);
				await userEvent.click(within(combine).getByRole("button", { name: "More" }));
				expect(onCombinedClick).toHaveBeenCalledTimes(1);
			});

			test("does not render the meta group without a combined action button", () => {
				const { container } = render(<Comment commentMeta={generateMeta()}>{content}</Comment>);

				expect(queryByDataRole(container, DataRoles.Comment.MetaGroup)).toBeNull();
				expect(queryByDataRole(container, DataRoles.Comment.Actions.Combine)).toBeNull();
			});
		});

		describe("content", () => {
			test("renders the children as text and omits the text without children", () => {
				const { container, rerender } = render(<Comment commentMeta={generateMeta()}>{content}</Comment>);
				expect(getByDataRole(container, DataRoles.Comment.Text)).toHaveTextContent(content);

				rerender(<Comment commentMeta={generateMeta()} />);
				expect(queryByDataRole(container, DataRoles.Comment.Text)).toBeNull();
			});

			test("shows the tags of an active comment", () => {
				const { container } = render(
					<Comment commentMeta={generateMeta()} commentTags={<span>tag</span>}>
						{content}
					</Comment>
				);

				expect(getByDataRole(container, DataRoles.Comment.Tag)).toHaveTextContent("tag");
			});

			test("renders the replies", () => {
				const { container } = render(
					<Comment commentMeta={generateMeta()} replies={<Comment commentMeta={{ author: "Anna" }} isReply />}>
						{content}
					</Comment>
				);
				const replies = getByDataRole(container, DataRoles.Comment.Replies);

				expect(replies).toHaveTextContent("Anna");
				expect(within(replies).getByText("Anna").closest(`[data-role="${DataRoles.Comment}"]`)).toHaveClass(
					`${baseClassName}__replies-item`
				);
			});

			test("renders the action buttons and calls their handlers", async () => {
				const onReply = vi.fn();
				const onDelete = vi.fn();
				const { container } = render(
					<Comment
						commentMeta={generateMeta()}
						actionButtons={[
							<Button key="reply" label="Reply" onClick={onReply} />,
							<Button key="delete" label="Delete" onClick={onDelete} />
						]}
					>
						{content}
					</Comment>
				);
				const actions = getByDataRole(container, DataRoles.Comment.Actions);

				await userEvent.click(within(actions).getByRole("button", { name: "Reply" }));
				expect(onReply).toHaveBeenCalledTimes(1);
				expect(onDelete).not.toHaveBeenCalled();

				await userEvent.click(within(actions).getByRole("button", { name: "Delete" }));
				expect(onDelete).toHaveBeenCalledTimes(1);
			});

			test("calls the action handler that is current after a rerender", async () => {
				const staleOnReply = vi.fn();
				const currentOnReply = vi.fn();
				const { container, rerender } = render(
					<Comment commentMeta={generateMeta()} actionButtons={<Button label="Reply" onClick={staleOnReply} />}>
						{content}
					</Comment>
				);

				rerender(
					<Comment commentMeta={generateMeta()} actionButtons={<Button label="Reply" onClick={currentOnReply} />}>
						{content}
					</Comment>
				);
				await userEvent.click(within(container).getByRole("button", { name: "Reply" }));

				expect(staleOnReply).not.toHaveBeenCalled();
				expect(currentOnReply).toHaveBeenCalledTimes(1);
			});

			test("omits the actions and replies areas without them", () => {
				const { container } = render(<Comment commentMeta={generateMeta()}>{content}</Comment>);

				expect(queryByDataRole(container, DataRoles.Comment.Actions)).toBeNull();
				expect(queryByDataRole(container, DataRoles.Comment.Replies)).toBeNull();
				expect(queryByDataRole(container, DataRoles.Comment.Tag)).toBeNull();
			});

			test("applies id, className, style and the reply class and updates them", () => {
				const { container, rerender } = render(
					<Comment
						commentMeta={generateMeta()}
						id="first-id"
						className="first-class"
						style={{ color: "rgb(255, 0, 0)" }}
					>
						{content}
					</Comment>
				);

				expect(getComment(container)).toHaveAttribute("id", "first-id");
				expect(getComment(container)).toHaveClass(baseClassName, "first-class");
				expect(getComment(container)).not.toHaveClass(`${baseClassName}__replies-item`);
				expect(getComment(container)).toHaveStyle({ color: "rgb(255, 0, 0)" });

				rerender(
					<Comment commentMeta={generateMeta()} id="second-id" className="second-class" isReply>
						{content}
					</Comment>
				);

				expect(getComment(container)).toHaveAttribute("id", "second-id");
				expect(getComment(container)).toHaveClass(baseClassName, "second-class", `${baseClassName}__replies-item`);
				expect(getComment(container)).not.toHaveClass("first-class");
			});
		});

		describe("inactive comment", () => {
			const showAllText = "Show all";
			const minimiseText = "Minimise";
			const renderInactive = (props: Partial<CommentProps> = {}) =>
				render(
					<Comment
						commentMeta={generateMeta()}
						inactive
						showAllText={showAllText}
						minimiseText={minimiseText}
						commentTags={<span>tag</span>}
						{...props}
					>
						{content}
					</Comment>
				);
			const queryShowAll = (container: HTMLElement): HTMLElement | null =>
				within(container).queryByRole("button", { name: showAllText });
			const queryMinimise = (container: HTMLElement): HTMLElement | null =>
				within(container).queryByRole("button", { name: minimiseText });

			test("starts minimised with the tags hidden and a show all button", () => {
				const { container } = renderInactive();

				expect(getComment(container)).toHaveClass(`${baseClassName}--inactive`, `${baseClassName}--minimised`);
				expect(queryByDataRole(container, DataRoles.Comment.Tag)).toBeNull();
				expect(queryShowAll(container)).toBeTruthy();
				expect(queryMinimise(container)).toBeNull();
			});

			test("expands on show all and minimises again on click", async () => {
				const { container } = renderInactive();

				await userEvent.click(queryShowAll(container)!);

				expect(getComment(container)).toHaveClass(`${baseClassName}--inactive`);
				expect(getComment(container)).not.toHaveClass(`${baseClassName}--minimised`);
				expect(getByDataRole(container, DataRoles.Comment.Tag)).toHaveTextContent("tag");
				expect(queryShowAll(container)).toBeNull();
				expect(queryMinimise(container)).toBeTruthy();

				await userEvent.click(queryMinimise(container)!);

				expect(getComment(container)).toHaveClass(`${baseClassName}--minimised`);
				expect(queryByDataRole(container, DataRoles.Comment.Tag)).toBeNull();
				expect(queryShowAll(container)).toBeTruthy();
				expect(queryMinimise(container)).toBeNull();
			});

			test("toggles with Enter and Space on the focused button", async () => {
				const { container } = renderInactive();

				queryShowAll(container)!.focus();
				await userEvent.keyboard("{Enter}");
				expect(queryMinimise(container)).toBeTruthy();
				expect(getComment(container)).not.toHaveClass(`${baseClassName}--minimised`);

				queryMinimise(container)!.focus();
				await userEvent.keyboard(" ");
				expect(queryShowAll(container)).toBeTruthy();
				expect(getComment(container)).toHaveClass(`${baseClassName}--minimised`);
			});

			test("keeps the expanded state across prop updates", async () => {
				const { container, rerender } = renderInactive();
				await userEvent.click(queryShowAll(container)!);

				rerender(
					<Comment
						commentMeta={generateMeta()}
						inactive
						showAllText={showAllText}
						minimiseText={minimiseText}
						commentTags={<span>other tag</span>}
					>
						updated content
					</Comment>
				);

				expect(getComment(container)).not.toHaveClass(`${baseClassName}--minimised`);
				expect(getByDataRole(container, DataRoles.Comment.Tag)).toHaveTextContent("other tag");
				expect(getByDataRole(container, DataRoles.Comment.Text)).toHaveTextContent("updated content");
				expect(queryMinimise(container)).toBeTruthy();
			});

			test("drops the minimised class and the toggle once the comment becomes active", () => {
				const { container, rerender } = renderInactive();

				rerender(
					<Comment commentMeta={generateMeta()} showAllText={showAllText} minimiseText={minimiseText} commentTags="tag">
						{content}
					</Comment>
				);

				expect(getComment(container)).not.toHaveClass(`${baseClassName}--inactive`, `${baseClassName}--minimised`);
				expect(getByDataRole(container, DataRoles.Comment.Tag)).toHaveTextContent("tag");
				expect(queryShowAll(container)).toBeNull();
				expect(queryMinimise(container)).toBeNull();
			});

			test("renders no toggle when one of the texts is missing", () => {
				const { container } = renderInactive({ minimiseText: undefined });

				expect(within(container).queryByRole("button")).toBeNull();
				expect(getComment(container)).toHaveClass(`${baseClassName}--minimised`);
				expect(queryByDataRole(container, DataRoles.Comment.Tag)).toBeNull();
			});

			test("renders no toggle for an active comment", () => {
				const { container } = renderInactive({ inactive: false });

				expect(within(container).queryByRole("button")).toBeNull();
				expect(getByDataRole(container, DataRoles.Comment.Tag)).toHaveTextContent("tag");
			});
		});
	});
});
