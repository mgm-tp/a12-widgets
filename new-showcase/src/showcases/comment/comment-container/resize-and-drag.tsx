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

import type { ReactElement } from "react";
import { useState, useRef, useCallback } from "react";

import { Button, Comment, CommentContainer, CommentList, CssEllipsis, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { comments } from "../shared-data.js";

export function ResizeAndDragCommentContainer(): ReactElement {
	const [show, setShow] = useState(false);
	const triggerButtonRef = useRef<HTMLElement | null>(null);
	const shouldScrollToBottom = useRef(false);

	const getTriggerButtonRef = useCallback((ref: HTMLElement | null): void => {
		triggerButtonRef.current = ref;
	}, []);

	const showContainer = useCallback((): void => {
		setShow((prevState) => !prevState);
		shouldScrollToBottom.current = true;
	}, []);

	const onCloseCommentContainer = useCallback(() => {
		setShow(false);
	}, []);

	return (
		<>
			<Button
				buttonRef={getTriggerButtonRef}
				icon={<Icon>add_comment</Icon>}
				onClick={showContainer}
				title="Open/close comment container"
			/>
			{show && triggerButtonRef.current && (
				<CommentContainer
					id="resize-and-drag-comment-container"
					onClose={onCloseCommentContainer}
					referenceElement={triggerButtonRef.current}
					header={{
						title: <CssEllipsis maxLine={1}>Comment Container</CssEllipsis>,
						suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={onCloseCommentContainer} />
					}}
					resizeAndDragOptions={{
						referenceElement: triggerButtonRef.current
					}}
				>
					<CommentList scrollToBottom={shouldScrollToBottom.current}>
						{comments.map((comment) => (
							<Comment {...comment} />
						))}
					</CommentList>
				</CommentContainer>
			)}
		</>
	);
}
