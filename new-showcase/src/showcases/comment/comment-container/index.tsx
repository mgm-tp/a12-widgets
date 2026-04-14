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

import { provider } from "@com.mgmtp.a12.widgets/widgets-core";
import CommentContainerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/comment/comment-container/main/comment-container.api.json" with { type: "json" };

import type { Showcase } from "../../../helpers/definitions.js";

import { AddingAndEditingComment } from "./add-and-edit.js";
import { ResizeAndDragCommentContainer } from "./resize-and-drag.js";
import { ReplyToAComment } from "./reply-to-a-comment.js";
import { AccessibilityCommentContainer } from "./accessibility-comment-container.js";

import addingAndEditingCommentCode from "!./add-and-edit.tsx?raw";
import resizeAndDragCommentContainerCode from "!./resize-and-drag.tsx?raw";
import replyToACommentCode from "!./reply-to-a-comment?raw";
import accessibilityCommentContainerCode from "!./accessibility-comment-container.tsx?raw";

const isNotPhone = !provider.isPhone();

const showcases: Showcase[] = [
	{
		label: "Comment Container",
		description: (
			<>
				<p>
					The <strong>Comment Container</strong> Widget is a pop-up container used to display comments and take relevant
					actions such as adding comments.
				</p>
				<p>
					It's needed to have an element to trigger opening the <strong>Comment Container</strong>. The position of the{" "}
					<strong>Comment Container</strong> will be calculated based on the position of the{" "}
					<code>referenceElement</code>.
				</p>
			</>
		),
		sections: [
			{
				label: "Adding and Editing",
				description: (
					<p>
						This example allows you to add and edit a comment. While a comment is being edited, adding new comments and
						any functions related to other comments are disabled.
					</p>
				),
				content: <AddingAndEditingComment />,
				code: { name: "add-and-edit.tsx", code: addingAndEditingCommentCode }
			},
			{
				label: "Replying to a comment",
				description: (
					<p>
						The <strong>Comment Container</strong> allows you to reply to a comment. If a comment is being replied to,
						all functions not related to the reply will be disabled.
					</p>
				),
				content: <ReplyToAComment />,
				code: { name: "reply-to-a-comment.tsx", code: replyToACommentCode }
			},
			{
				label: "Resizing and Dragging",
				description: {
					info: isNotPhone ? (
						<>
							<p>
								A <strong>Comment Container</strong> is also draggable and resizable. To enable this feature, please
								provide the <code>referenceElement</code> for the <code>resizeAndDragOptions</code> property.
							</p>
							<p>In this example, the draggable area is within the header.</p>
						</>
					) : (
						<p>Resizing and dragging behaviors are not intended to be used on mobile devices.</p>
					),
					note: isNotPhone ? (
						<div>Resizing and dragging behaviors are not intended to be used on mobile devices.</div>
					) : undefined
				},
				content: isNotPhone && <ResizeAndDragCommentContainer />,
				code: { name: "resize-and-drag.tsx", code: resizeAndDragCommentContainerCode }
			},
			{
				label: "Accessibility",
				description: {
					info: (
						<>
							<p>
								By default, the <strong>Comment Container</strong> will have the <code>aria-labelledby</code> attribute
								using the ID of the heading title. You can also provide additional HTML attributes for the comment
								container via the <code>htmlAttributes</code> property.
							</p>
							<p>
								In the example below, the <code>aria-label</code> is added and shown in the container through the{" "}
								<code>htmlAttributes</code> property.
							</p>
						</>
					),
					note: (
						<p>
							To fully support accessibility, each <strong>Comment Container</strong> should have its own{" "}
							<code>id</code>. It will be used to generate the header title's id and linked to the{" "}
							<strong>aria-labelledby</strong> attribute, allowing screen readers to provide complete information to
							users.
						</p>
					)
				},
				content: <AccessibilityCommentContainer />,
				code: { name: "accessibility-comment-container.tsx", code: accessibilityCommentContainerCode }
			}
		]
	}
];

export default {
	label: "Comment Container",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: CommentContainerAPI }],
		themingConfiguration: "commentContainer"
	}
};
