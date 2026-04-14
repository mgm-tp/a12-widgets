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

import { produce } from "immer";
import type { ChangeEvent, ReactNode, ReactElement } from "react";
import { useState, useCallback } from "react";

import type { CommentProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Button,
	ButtonGroup,
	Comment,
	CommentList,
	NewComment,
	ReplyActionContainer,
	noop,
	Icon,
	TextAreaStateless,
	List,
	PopUpMenu,
	Tag,
	TagGroup
} from "@com.mgmtp.a12.widgets/widgets-core";

import { createCard } from "../../../helpers/faker.js";

import { getCommentMeta, getComments } from "../shared-data.js";

type CommentType = Omit<CommentProps, "replies"> & {
	key: number;
	type: "text" | "tag";
	buttonsExpanded?: boolean;
	replies?: CommentProps[];
	showMoreReplies?: boolean;
};

const card = createCard();
const commentMeta = getCommentMeta(card);
const replies = getComments(3);

const comments: CommentType[] = [
	{
		commentMeta: commentMeta,
		children: card.posts[0].sentence,
		key: 0,
		type: "text",
		replies: [replies[0]]
	},
	{
		commentMeta: commentMeta,
		children: <span>{card.posts[1].paragraph}</span>,
		key: 1,
		type: "tag",
		commentTags: (
			<TagGroup>
				<Tag icon={<Icon>phone_iphone</Icon>} color="#2e1561">
					iOS phone
				</Tag>
				<Tag color="#2e1561">Windows phone</Tag>
				<Tag icon={<Icon>desktop_mac</Icon>} color="#d9a518">
					macOS desktop
				</Tag>
			</TagGroup>
		),
		replies
	},
	{
		commentMeta: commentMeta,
		children: card.posts[2].sentence,
		key: 2,
		type: "text"
	}
];

export function CommentActions(): ReactElement {
	const [commentList, setCommentList] = useState<CommentType[]>(comments);
	const [isEditText, setIsEditText] = useState(false);
	const [isEditTag, setIsEditTag] = useState(false);
	const [replyIndex, setReplyIndex] = useState<number | undefined>(undefined);
	const [replyMessage, setReplyMessage] = useState<string | undefined>(undefined);

	const onActionButtonClick = useCallback((label: string, type?: string): void => {
		if (label === "Edit") {
			setIsEditText(true);
		}

		if (label === "Tag") {
			setIsEditTag(true);
		}

		if (label === "Save" || label === "Abort") {
			type === "text" ? setIsEditText(false) : setIsEditTag(false);
		}
	}, []);

	const showReplyForm = useCallback((index: number): void => {
		setReplyIndex(index);
		setReplyMessage(undefined);
	}, []);

	const handleReply = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		setReplyMessage(event.target.value);
	}, []);

	const onCancelReply = useCallback((): void => {
		setReplyIndex(undefined);
		setReplyMessage(undefined);
	}, []);

	const onSubmitReply = useCallback(
		(commentIndex: number): void => {
			setReplyIndex(undefined);
			setCommentList(
				produce((draft) => {
					const newUpdate = draft.find((_, index) => index === commentIndex);

					if (newUpdate) {
						newUpdate.replies = newUpdate.replies
							? [
									...newUpdate.replies,
									{
										commentMeta: getCommentMeta(undefined, "replied"),
										children: replyMessage
									}
								]
							: [
									{
										commentMeta: getCommentMeta(undefined, "replied"),
										children: replyMessage
									}
								];
					}
				})
			);
		},
		[replyMessage]
	);

	const showMoreReplies = useCallback(
		(commentIndex: number): void => {
			const newCommentList = commentList.map((value, index) => {
				return {
					...value,
					showMoreReplies: index === commentIndex ? !value.showMoreReplies : value.showMoreReplies
				};
			});
			setCommentList(newCommentList);
		},
		[commentList]
	);

	const renderReply = useCallback(
		(key: number | string, props: CommentProps): ReactNode => {
			return (
				<Comment
					key={key}
					commentMeta={props.commentMeta}
					isReply
					combinedActionButton={
						<PopUpMenu
							headerTitle="Comment actions"
							triggerButtonTitle="Open comment actions"
							triggerButtonCloseTitle="Close comment actions"
							icon={<Icon>more_vert</Icon>}
							disabled={replyIndex !== undefined}
						>
							<Button key="edit-button" label="Edit" onClick={() => alert("Not implemented")} />
							<Button key="delete-button" label="Delete" onClick={() => alert("Not implemented")} />
						</PopUpMenu>
					}
				>
					{props.children}
				</Comment>
			);
		},
		[replyIndex]
	);

	const renderReplies = useCallback(
		(commentIndex: number, props: CommentType): ReactNode => {
			if (props.replies) {
				const generatedReplies = [...props.replies];
				const newestReply = generatedReplies.pop();
				const olderReplies = [...generatedReplies];

				return (
					<>
						{props.showMoreReplies &&
							olderReplies &&
							olderReplies.map((olderReply, index) => {
								return renderReply(`older-reply-${index}`, olderReply);
							})}
						{olderReplies.length > 0 && (
							<ReplyActionContainer>
								<Button onClick={() => showMoreReplies(commentIndex)}>
									{`
									${props.showMoreReplies ? "MINIMIZE" : "SHOW"} OLDER REPLIES (${props.replies && props.replies.length - 1})
								`}
								</Button>
							</ReplyActionContainer>
						)}
						{newestReply && renderReply(`newest-reply-${commentIndex}`, newestReply)}
					</>
				);
			}

			return undefined;
		},
		[renderReply, showMoreReplies]
	);

	const renderReplyForm = useCallback(
		(commentIndex: number): ReactElement<CommentProps> => {
			return (
				<NewComment
					commentMeta={{
						avatar: <Icon>account_circle</Icon>,
						author: "Livia Böhme"
					}}
					actionButtons={[
						<Button key="cancel-button" label="Cancel" destructive onClick={onCancelReply} />,
						<Button
							key="send-button"
							label="Send"
							primary
							disabled={!replyMessage || replyMessage.trim().length === 0}
							onClick={() => onSubmitReply(commentIndex)}
						/>
					]}
					isReply
				>
					<NewComment.Input
						key="reply-input"
						value={replyMessage}
						autoExpand
						placeholder="Reply"
						onChange={handleReply}
					/>
				</NewComment>
			);
		},
		[handleReply, onCancelReply, onSubmitReply, replyMessage]
	);

	const renderActionButtons = useCallback(
		(index: number, props: CommentType): ReactNode => {
			const reply = replyIndex === index;

			if (!reply && ((!isEditText && props.type === "text") || (!isEditTag && props.type === "tag"))) {
				return (
					<Button
						key="reply-button"
						label="Reply"
						disabled={replyIndex !== undefined && !reply}
						onClick={() => showReplyForm(index)}
					/>
				);
			}

			return undefined;
		},
		[isEditTag, isEditText, replyIndex, showReplyForm]
	);

	const renderPopupMenuItems = useCallback(
		(type: "text" | "tag"): ReactNode => {
			return (
				<List>
					<List.Item text="Delete" onClick={() => alert("Not implemented")} />
					{type === "tag" ? (
						<List.Item text="Tag" onClick={() => onActionButtonClick("Tag", type)} />
					) : (
						<List.Item text="Edit" onClick={() => onActionButtonClick("Edit", type)} />
					)}
				</List>
			);
		},
		[onActionButtonClick]
	);

	const renderEditForm = useCallback(
		(type: "text" | "tag", text?: string): ReactNode => {
			const buttons = (
				<ButtonGroup className="-u-justify-end" style={{ marginTop: 8 }}>
					<Button label="Abort" onClick={() => onActionButtonClick("Abort", type)} destructive key="abort" />
					<Button label="Save" onClick={() => onActionButtonClick("Save", type)} primary key="save" />
				</ButtonGroup>
			);

			return (
				<>
					<TextAreaStateless
						value={type === "text" ? text : undefined}
						placeholder="Placeholder"
						autoExpand
						onChange={noop}
					/>
					{buttons}
				</>
			);
		},
		[onActionButtonClick]
	);

	const renderComment = useCallback(
		(index: number, props: CommentType): ReactElement<CommentProps> => {
			const reply = replyIndex === index;

			return (
				<Comment
					key={`comment-${index}`}
					commentMeta={props.commentMeta}
					commentTags={props.type === "tag" && (!isEditTag ? props.commentTags : renderEditForm(props.type))}
					actionButtonPosition={
						reply || (isEditText && props.type === "text") || (isEditTag && props.type === "tag") ? "right" : "left"
					}
					actionButtons={renderActionButtons(index, props)}
					combinedActionButton={
						props.type && (
							<PopUpMenu
								headerTitle="Comment actions"
								triggerButtonTitle="Open comment actions"
								triggerButtonCloseTitle="Close comment actions"
								icon={<Icon>more_vert</Icon>}
								disabled={replyIndex !== undefined}
							>
								{renderPopupMenuItems(props.type)}
							</PopUpMenu>
						)
					}
					replies={
						<>
							{renderReplies(index, props)}
							{reply ? renderReplyForm(index) : undefined}
						</>
					}
				>
					{props.type === "text"
						? !isEditText
							? props.children
							: renderEditForm(props.type, props.children as string)
						: props.children}
				</Comment>
			);
		},
		[
			replyIndex,
			isEditTag,
			renderEditForm,
			isEditText,
			renderActionButtons,
			renderPopupMenuItems,
			renderReplies,
			renderReplyForm
		]
	);

	return <CommentList>{commentList.map((comment, index) => renderComment(index, comment))}</CommentList>;
}
