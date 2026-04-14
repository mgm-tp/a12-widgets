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

import { Chat } from "@com.mgmtp.a12.widgets/widgets-core";
// start code removal

import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
// end code removal

const { Container, Message, UserInfo, MessageGroup, DateMarker, Notification } = Chat;

export function DateMarkerAndNotificationsChatShowcase(): ReactElement {
	return (
		// start code removal
		<CodeSnippetGenerationWrapper
			namespaceOptions={[
				{
					name: "Chat",
					subComponents: [
						"Container",
						"Message",
						"UserInfo",
						"MessageGroup",
						"SecondaryContent",
						"DateMarker",
						"Notification"
					]
				}
			]}
			options={{ showDefaultProps: false }}
		>
			<Container style={{ maxWidth: 500, background: "white" }}>
				<DateMarker>Mo, 2019-04-22</DateMarker>
				<Notification variant="info">Susan has joined this space</Notification>
				<Notification variant="error">Peter has joined this space</Notification>
				<MessageGroup userInfo={<UserInfo userName="Peter" />}>
					<Message status="11:11 am">Hello, my name is Peter. Nice to meet you!</Message>
				</MessageGroup>
				<MessageGroup userInfo={<UserInfo userName="Susan" />}>
					<Message status="11:11 am">Hello, I'm Susan. Nice to meet you, too!</Message>
				</MessageGroup>
				<DateMarker>Today</DateMarker>
				<Notification variant="success">You have joined this space</Notification>
				<MessageGroup position="right">
					<Message status="11:14 am">
						Hello everyone, my name is Jasmine. I'm looking forward to having a nice chat with you all later!
					</Message>
				</MessageGroup>
				<Notification variant="warning">Janina has joined this space</Notification>
				<MessageGroup userInfo={<UserInfo userName="Janina" />}>
					<Message status="11:15 am">Hi all, you can call me Janina</Message>
					<Message status="11:15 am">Hope we have a good talk</Message>
				</MessageGroup>
			</Container>
		</CodeSnippetGenerationWrapper>
		// end code removal
	);
}
