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

import { getAllByDataRole, getByDataRole, render, fireEvent } from "test-utils";
import { describe, expect, test } from "vitest";

import { Tag } from "../../../tag/main/tag/tag.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { PopUpMenu } from "../../../pop-up-menu/main/pop-up-menu.view.js";
import { Button } from "../../../button/main/button.view.js";
import { DataRoles } from "../../../common/index.js";

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
});
