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

import type { FC, ReactNode } from "react";
import { useRef, useState, useCallback } from "react";

import {
	Chat,
	Icon,
	ResizeAndDragContainer,
	Button,
	ContentBox,
	ContentBoxElements
} from "@com.mgmtp.a12.widgets/widgets-core";

const { Container, Message, MessageGroup } = Chat;

export const ResizeAndDragAccessibilityShowcase: FC = () => {
	const referenceElement = useRef<HTMLDivElement | null>(null);
	const [showContainer, setShowContainer] = useState<boolean>(false);
	const headerTitleId = "container-header-title";

	const openContainer = useCallback((): void => {
		setShowContainer(true);
	}, []);

	const closeContainer = useCallback((): void => {
		setShowContainer(false);
	}, []);

	const generateHeadingElements = useCallback((): ReactNode => {
		return (
			<ContentBoxElements.Heading
				className="handle"
				suffixes={<ContentBoxElements.CloseButton onClick={closeContainer} />}
			>
				<ContentBoxElements.Title id={headerTitleId} text="Accessible Chat" />
			</ContentBoxElements.Heading>
		);
	}, [closeContainer, headerTitleId]);

	return (
		<>
			<div key="trigger" className="h_inlineBlock" ref={referenceElement}>
				<Button icon={<Icon>add</Icon>} title="Open Accessible Chat" onClick={openContainer} />
			</div>
			{showContainer && referenceElement.current && (
				<ResizeAndDragContainer
					closeOnOutsideClick
					cancel="button"
					referenceElement={referenceElement.current}
					minHeight={300}
					minWidth={400}
					maxWidth={600}
					onClose={closeContainer}
					htmlAttributes={{
						"aria-labelledby": headerTitleId
					}}
				>
					<ContentBox heading={generateHeadingElements()} padding={false}>
						<Container>
							<MessageGroup>
								<Message status="11:11 am">Hello! How can I help you today?</Message>
							</MessageGroup>
							<MessageGroup position="right">
								<Message status="11:11 am">What accessible information is provided here?</Message>
							</MessageGroup>
							<MessageGroup>
								<Message status="11:11 am">
									This dialog demonstrates the proper use of the <em>aria-labelledby</em> attribute, which references
									the header title
								</Message>
							</MessageGroup>
							<MessageGroup position="right">
								<Message status="11:11 am">Perfect! Thank you.</Message>
							</MessageGroup>
						</Container>
					</ContentBox>
				</ResizeAndDragContainer>
			)}
		</>
	);
};
