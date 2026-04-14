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

import type { ChangeEvent, ReactElement } from "react";
import { useRef, useState, useCallback } from "react";
import { produce } from "immer";
import DOMPurify from "dompurify";

import type { CommentProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Comment,
	CommentContainer,
	CommentList,
	NewComment,
	Button,
	ButtonGroup,
	ButtonGroupContainer,
	TextAreaStateless,
	Icon
} from "@com.mgmtp.a12.widgets/widgets-core";

import { comments, getCommentMeta } from "../shared-data.js";

type CommentOptions = CommentProps & { key: number };

export function AddingAndEditingComment(): ReactElement {
	const containerWrapperRef = useRef<HTMLElement | null>(null);
	const triggerButtonRef = useRef<HTMLElement | null>(null);
	const shouldScrollToBottom = useRef(false);

	const [commentList, setCommentList] = useState<CommentOptions[]>(comments);
	const [newCommentValue, setNewCommentValue] = useState("");
	const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
	const [editingValue, setEditingValue] = useState<string | undefined>(undefined);
	const [show, setShow] = useState(false);

	const getTriggerButtonRef = useCallback((ref: HTMLElement | null): void => {
		triggerButtonRef.current = ref;
	}, []);

	const getContainerWrapperRef = useCallback((ref: HTMLElement | null): void => {
		containerWrapperRef.current = ref;
	}, []);

	const showContainer = useCallback((): void => {
		setShow((prevState) => !prevState);
		shouldScrollToBottom.current = true;
	}, []);

	const addComment = useCallback((): void => {
		if (newCommentValue.trim()) {
			setCommentList(
				produce((draft) => {
					draft.push({
						commentMeta: getCommentMeta(),
						children: newCommentValue,
						key: draft.length
					});
				})
			);
			setNewCommentValue("");
			shouldScrollToBottom.current = true;
			containerWrapperRef.current?.focus();
		}
	}, [newCommentValue]);

	const switchToEditMode = useCallback((index: number, initialValue: string): void => {
		setEditingIndex(index);
		setEditingValue(initialValue);
		shouldScrollToBottom.current = false;
	}, []);

	const handleAbort = useCallback((): void => {
		setEditingIndex(undefined);
	}, []);

	const handleSave = useCallback(
		(index: number): void => {
			setCommentList(
				produce((draft) => {
					draft[index].children = editingValue || "";
				})
			);
			setEditingIndex(undefined);
		},
		[editingValue]
	);

	const handleEditingInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		setEditingValue(event.target.value);
	}, []);

	const onCloseContainer = useCallback((): void => {
		setShow(false);
		setNewCommentValue("");
	}, []);

	const handleNewCommentInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
		setNewCommentValue(event.target.value);
		shouldScrollToBottom.current = false;
	}, []);

	const renderAndKeepNewLine = useCallback((st: string): ReactElement => {
		const html = st.replace(/\n/g, "<br />");

		return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) ?? "" }} />;
	}, []);

	const renderComment = useCallback(
		(props: CommentOptions, index: number): ReactElement<CommentProps> => {
			const editing = editingIndex === index;
			const shouldDisableButton = editingIndex !== undefined && !editing;
			const text = props.children as string;

			return (
				<Comment
					key={`comment-${index}`}
					commentMeta={props.commentMeta}
					actionButtonPosition={editing ? "right" : "left"}
					actionButtons={
						editing
							? [
									<Button key="abort-button" label="Abort" destructive onClick={handleAbort} />,
									<Button
										key="save-button"
										label="Save"
										primary
										disabled={!editingValue || editingValue.trim().length === 0}
										onClick={() => handleSave(index)}
									/>
								]
							: [
									<Button
										key="tag-button"
										icon={<Icon>label</Icon>}
										label="Tag"
										disabled={shouldDisableButton}
										onClick={() => alert("Not implemented")}
									/>,
									<Button
										key="edit-button"
										disabled={shouldDisableButton}
										label="Edit"
										onClick={() => switchToEditMode(index, text)}
									/>,
									<Button
										key="delete-button"
										label="Delete"
										disabled={shouldDisableButton}
										onClick={() => alert("Not implemented")}
									/>
								]
					}
				>
					{editing ? (
						<TextAreaStateless autoFocus autoExpand value={editingValue} onChange={handleEditingInputChange} />
					) : (
						renderAndKeepNewLine(text)
					)}
				</Comment>
			);
		},
		[
			editingIndex,
			editingValue,
			handleAbort,
			handleEditingInputChange,
			handleSave,
			renderAndKeepNewLine,
			switchToEditMode
		]
	);

	const editing = editingIndex !== undefined;

	return (
		<>
			<Button
				buttonRef={getTriggerButtonRef}
				icon={<Icon>add_comment</Icon>}
				title="Open/close comment container"
				onClick={showContainer}
			/>
			{show && triggerButtonRef.current && (
				<CommentContainer
					id="add-and-edit-comment-container"
					referenceElement={triggerButtonRef.current}
					closeOnClickReferenceElement={false}
					header={{
						title: <p key="comment-container-title">Comment Container ({commentList.length})</p>,
						suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={onCloseContainer} />
					}}
					footer={
						<>
							<NewComment>
								<NewComment.Input
									disabled={editing}
									value={newCommentValue}
									autoExpand
									placeholder="Leave a comment"
									onChange={handleNewCommentInputChange}
								/>
							</NewComment>
							<ButtonGroupContainer>
								<ButtonGroup alignment="right">
									<Button disabled={editing} label="Cancel" destructive onClick={onCloseContainer} />
									<Button label="Send" disabled={!newCommentValue || editing} primary onClick={addComment} />
								</ButtonGroup>
							</ButtonGroupContainer>
						</>
					}
					wrapperRef={getContainerWrapperRef}
					onClose={onCloseContainer}
				>
					<CommentList scrollToBottom={shouldScrollToBottom.current}>{commentList.map(renderComment)}</CommentList>
				</CommentContainer>
			)}
		</>
	);
}
