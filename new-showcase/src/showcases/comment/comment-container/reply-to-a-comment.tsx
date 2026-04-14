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

import type { FC, ChangeEvent, ReactElement, ReactNode } from "react";
import { useState, useRef, useCallback } from "react";
import { faker as Faker } from "@faker-js/faker/locale/en";
import { loremIpsum } from "lorem-ipsum";
import DOMPurify from "dompurify";

import type { CommentProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Comment,
	CommentContainer,
	CommentList,
	NewComment,
	ReplyActionContainer,
	Icon,
	Button,
	Tag,
	TagGroup,
	PopUpMenu,
	ButtonGroupContainer,
	ButtonGroup
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { Card } from "../../../helpers/definitions.js";

import { comments, getCommentMeta } from "../shared-data.js";

const currentUser = Faker.person.firstName() + " " + Faker.person.lastName();
export type CommentOptions = Omit<CommentProps, "replies"> & {
	key: number;
	buttonsExpanded?: boolean;
	replies?: CommentProps[];
	showMoreReplies?: boolean;
};

export const ReplyToAComment: FC = () => {
	const [newCommentValue, setNewCommentValue] = useState("");
	const triggerButtonRef = useRef<HTMLElement | null>(null);
	const [show, setShow] = useState(false);
	const shouldScrollToBottom = useRef(false);
	const [replyIndex, setReplyIndex] = useState<number | undefined>();
	const [replyMessage, setReplyMessage] = useState<string | undefined>();
	const [commentList, setCommentList] = useState<CommentOptions[]>(() => {
		return comments.map((value, index) => ({
			...value,
			replies:
				index === 0
					? [
							{
								commentMeta: getCommentMeta(undefined, "replied"),
								children: loremIpsum({ units: "sentences", count: 3 })
							},
							{
								commentMeta: getCommentMeta(undefined, "replied"),
								children:
									"Cupidatat nisi do irure excepteur laboris enim consectetur nisi ea quis do adipisicing eiusmod Lorem."
							},
							{
								commentMeta: getCommentMeta(undefined, "replied"),
								children: "Laboris duis ut do culpa sit dolor reprehenderit veniam in do."
							}
						]
					: index === 1
						? [
								{
									commentMeta: getCommentMeta(undefined, "replied"),
									children: "Laboris duis ut do culpa"
								}
							]
						: undefined
		}));
	});

	const createCommentOptions = useCallback((): CommentOptions => {
		return {
			commentMeta: getCommentMeta(),
			children: newCommentValue,
			key: commentList.length
		};
	}, [commentList.length, newCommentValue]);

	const showMoreReplies = useCallback(
		(commentIndex: number): void => {
			const newCommentList = commentList.map((value, index) => {
				return {
					...value,
					showMoreReplies: index === commentIndex ? !value.showMoreReplies : value.showMoreReplies
				};
			});
			setCommentList(newCommentList);
			shouldScrollToBottom.current = false;
		},
		[commentList]
	);

	const showReplyForm = useCallback((index: number): void => {
		setReplyIndex(index);
		setReplyMessage(undefined);
		shouldScrollToBottom.current = true;
	}, []);

	const handleReplyChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		setReplyMessage(event.target.value);
	}, []);

	const onSubmitReply = useCallback(
		(commentIndex: number): void => {
			const generateReply = (): CommentProps => ({
				commentMeta: getCommentMeta({ name: currentUser } as Card, "replied"),
				children: replyMessage
			});

			const newCommentList = commentList.map((value, index) => {
				if (index === commentIndex) {
					return {
						...value,
						replies: value.replies ? [...value.replies, generateReply()] : [generateReply()]
					};
				}

				return value;
			});

			setReplyIndex(undefined);
			setCommentList(newCommentList);
		},
		[commentList, replyMessage]
	);

	const onCancelReply = useCallback((): void => {
		setReplyMessage(replyMessage);
		setReplyIndex(undefined);
	}, [replyMessage]);

	const onLeaveCommentChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		setNewCommentValue(event.target.value);
	}, []);

	const handleSend = useCallback((): void => {
		if (newCommentValue.trim()) {
			setNewCommentValue("");
			setCommentList((oldCommentList) => [...oldCommentList, createCommentOptions()]);
		}
	}, [createCommentOptions, newCommentValue]);

	const handleCancel = useCallback((): void => {
		setNewCommentValue("");
	}, []);

	const toggleCommentContainer = useCallback((): void => {
		setShow(!show);
	}, [show]);

	const getTriggerButtonRef = useCallback((ref: HTMLElement | null): void => {
		triggerButtonRef.current = ref;
	}, []);

	const renderReplyForm = (commentIndex: number): ReactElement<CommentProps> => {
		return (
			<NewComment
				commentMeta={{
					avatar: <Icon>account_circle</Icon>,
					author: currentUser
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
					onChange={handleReplyChange}
				/>
			</NewComment>
		);
	};

	const renderAndKeepNewLine = (st: string): ReactElement<{}> => {
		const html = st.replace(/\n/g, "<br />");

		return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) ?? "" }} />;
	};

	const renderComment = (index: number, props: CommentOptions): ReactElement<CommentProps> => {
		const reply = replyIndex === index;
		const inactive = index === 1;
		const text = props.children as string;

		return (
			<Comment
				key={`comment-${index}`}
				commentMeta={props.commentMeta}
				commentTags={
					index === 0 && (
						<TagGroup>
							<Tag>Tag</Tag>
							<Tag>Tag Lorem ipsum</Tag>
						</TagGroup>
					)
				}
				actionButtonPosition={reply ? "right" : "left"}
				actionButtons={
					!reply &&
					!inactive && (
						<Button
							key="reply-button"
							label="Reply"
							disabled={replyIndex !== undefined && !reply}
							onClick={() => showReplyForm(index)}
						/>
					)
				}
				combinedActionButton={
					<PopUpMenu
						triggerElement={<Button icon={<Icon>more_vert</Icon>} />}
						disabled={replyIndex !== undefined || inactive}
						headerTitle="Comment actions"
						triggerButtonTitle="Open comment actions"
						triggerButtonCloseTitle="Close comment actions"
					>
						<Button key="tag-button" icon={<Icon>label</Icon>} label="Tag" />
						<Button key="edit-button" label="Edit" />
						<Button key="delete-button" label="Delete" />
					</PopUpMenu>
				}
				replies={
					<>
						{renderReplies(index, props)}
						{reply ? renderReplyForm(index) : undefined}
					</>
				}
				inactive={inactive}
			>
				{inactive ? text : renderAndKeepNewLine(text)}
			</Comment>
		);
	};

	const renderReply = (key: number | string, props: CommentProps, disabled?: boolean): ReactNode => (
		<Comment
			key={key}
			commentMeta={props.commentMeta}
			isReply
			inactiveCommentMeta={props.inactiveCommentMeta}
			combinedActionButton={
				<PopUpMenu
					headerTitle="Comment actions"
					triggerElement={<Button icon={<Icon>more_vert</Icon>} />}
					disabled={replyIndex !== undefined || disabled}
					triggerButtonTitle="Open comment actions"
					triggerButtonCloseTitle="Close comment actions"
				>
					<Button key="edit-button" label="Edit" />
					<Button key="delete-button" label="Delete" />
				</PopUpMenu>
			}
		>
			{props.children}
		</Comment>
	);

	const renderReplies = (commentIndex: number, props: CommentOptions): ReactNode => {
		if (props.replies) {
			const generatedReplies = [...props.replies];
			const newestReply = generatedReplies.pop();
			const olderReplies = [...generatedReplies];

			return (
				<>
					{olderReplies.length > 0 && (
						<ReplyActionContainer>
							<Button onClick={() => showMoreReplies(commentIndex)}>
								{`
									${props.showMoreReplies ? "MINIMIZE" : "SHOW"} OLDER REPLIES (${props.replies && props.replies.length - 1})
								`}
							</Button>
						</ReplyActionContainer>
					)}
					{props.showMoreReplies &&
						olderReplies &&
						olderReplies.map((olderReply, index) => {
							return renderReply(`older-reply-${index}`, olderReply);
						})}
					{newestReply && renderReply(`newest-reply-${commentIndex}`, newestReply, commentIndex === 1)}
				</>
			);
		}

		return undefined;
	};

	return (
		<>
			<Button
				buttonRef={getTriggerButtonRef}
				icon={<Icon>add_comment</Icon>}
				title="Open/close comment container"
				onClick={toggleCommentContainer}
			/>
			{show && triggerButtonRef.current && (
				<CommentContainer
					id="reply-to-a-comment-container"
					referenceElement={triggerButtonRef.current}
					onClose={toggleCommentContainer}
					header={{
						title: <p>Comment Container ({commentList.length})</p>,
						suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={toggleCommentContainer} />
					}}
					footer={
						replyIndex === undefined && (
							<>
								<NewComment>
									<NewComment.Input
										value={newCommentValue}
										autoExpand
										placeholder="Leave a comment"
										onChange={onLeaveCommentChange}
									/>
								</NewComment>
								<ButtonGroupContainer>
									<ButtonGroup alignment="right">
										<Button label="Clear" destructive onClick={handleCancel} />
										<Button label="Send" disabled={!newCommentValue} primary onClick={handleSend} />
									</ButtonGroup>
								</ButtonGroupContainer>
							</>
						)
					}
				>
					<CommentList scrollToBottom={shouldScrollToBottom.current}>
						{commentList.map((comment, index) => renderComment(index, comment))}
					</CommentList>
				</CommentContainer>
			)}
		</>
	);
};
