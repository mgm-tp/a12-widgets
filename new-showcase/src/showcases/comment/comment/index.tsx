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

import { Link, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import CommentAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/comment/comment/main/comment.api.json" with { type: "json" };
import CommentListAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/comment/comment-list/main/comment-list.api.json" with { type: "json" };
import NewCommentAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/comment/new-comment/main/new-comment.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";

import { Basic } from "./basic.js";
import { CommentActions } from "./comment-actions.js";
import { InactiveComment } from "./inactive-comment.js";
import { CommentTag } from "./comment-tag.js";

import sharedDataCode from "!../shared-data.tsx?raw";
import basicCode from "!./basic.tsx?raw";
import commentActionsCode from "!./comment-actions.tsx?raw";
import inactiveCommentCode from "!./inactive-comment.tsx?raw";
import commentTagCode from "!./comment-tag.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Comment Template",
		description: (
			<p>
				The <strong>Comment</strong> and <strong>Comment List</strong> Widgets are components that allows users to
				create a list of comments.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<p>
						Each <strong>Comment</strong> requires <code>commentMeta</code> that represents the additional information
						about the comment such as its author, date, and action. You can either pass a React element to this property
						or an object of type <code>CommentMeta</code>.
					</p>
				),
				content: <Basic />,
				useDarkBackground: true,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Comment Tag",
				description: (
					<p>
						Use the <code>commentTags</code> property to display tags below the comment text. To create a tag, you can
						refer to our <Link href="#/widgets/data-display/tag">Tag</Link> widget.
					</p>
				),
				content: <CommentTag />,
				useDarkBackground: true,
				code: [
					{ name: "comment-tag.tsx", code: commentTagCode },
					{
						code: sharedDataCode,
						name: "shared-data.tsx"
					}
				]
			},
			{
				label: "Inactive Comment",
				description: (
					<>
						<p>
							A <strong>Comment</strong> can also be displayed as inactive by setting the <code>inactive</code> property
							to <code>true</code>. In addition, you can add further information for this mode using the{" "}
							<code>inactiveCommentMeta</code> property.
						</p>
						<p>
							If a comment with a large amount of content is inactive, a button will be shown to minimize/maximize the
							text when you provide the <code>showAllText</code> and <code>minimiseText</code> properties.
						</p>
					</>
				),
				content: <InactiveComment />,
				useDarkBackground: true,
				code: { name: "inactive-comment.tsx", code: inactiveCommentCode }
			},
			{
				label: "Actions",
				description: (
					<>
						<p>To add more actions to a comment, you can use these properties:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>actionButtons</code>: to display buttons below a comment.
							</BulletList.Item>
							<BulletList.Item>
								<code>combinedActionButton</code>: to group buttons in a popup-menu and display it on the right.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							This example shows you how to create replies and how they display. We provide the{" "}
							<code>NewComment.Input</code> component that represents an input for entering a comment. It should be
							placed in <code>NewComment</code> to guarantee the best UI experience. Click the <strong>REPLY</strong>{" "}
							button to see how it looks.
							<br />
							After adding a comment, to make it have the appearance of a reply, set the <code>isReply</code> property
							to <code>true</code>. Do note that for demonstration purposes, we've added some non-functional action
							buttons as well.
						</p>
					</>
				),
				content: <CommentActions />,
				useDarkBackground: true,
				code: [
					{ name: "comment-actions.tsx", code: commentActionsCode },
					{
						code: sharedDataCode,
						name: "shared-data.tsx"
					}
				]
			}
		]
	}
];

export default {
	label: "Comment",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ name: "Comment", declaration: CommentAPI },
			{ name: "Comment List", declaration: CommentListAPI },
			{ name: "New Comment", declaration: NewCommentAPI }
		],
		themingConfiguration: ["comment", "commentList"]
	}
};
