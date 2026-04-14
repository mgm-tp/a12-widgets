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
// start code removal
import { useState } from "react";
// end code removal

import { Chat, Icon, ProgressIndicator, Radio } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";
// end code removal

const { Container, Message, UserInfo, MessageGroup, SecondaryContent, TypingMarker } = Chat;

export function TypingChatShowcase(): ReactElement {
	// start code removal
	const [typingContent, setTypingContent] = useState("dots");
	// end code removal

	return (
		// start code removal
		<ConfigurationView
			configuration={
				<Radio
					label="Loading with:"
					inline
					value={typingContent}
					onValueChanged={setTypingContent}
					id="loading-config"
					fitToParent={false}
				>
					<Radio.Item label="Progress Indicator as dots" value="dots" />
					<Radio.Item label="Progress Indicator as spinner" value="spinner" />
				</Radio>
			}
			useDarkBackground
		>
			<CodeSnippetGenerationWrapper
				namespaceOptions={[
					{
						name: "Chat",
						subComponents: ["Container", "Message", "UserInfo", "MessageGroup", "SecondaryContent", "Avatar"]
					}
				]}
				options={{ showDefaultProps: false }}
			>
				<Container style={{ width: "100%", maxWidth: 500, background: "white" }}>
					<MessageGroup userInfo={<UserInfo userName="Peter" />}>
						<Message status="11:11 am">Hello, my name is Peter. How can I help you?</Message>
					</MessageGroup>

					<MessageGroup position="right">
						<Message status="11:13 am">Hello! I have a question about room service.</Message>
					</MessageGroup>

					<MessageGroup userInfo={<UserInfo userName="Peter" />}>
						<Message status="11:11 am">
							Could you please tell me which service you're asking about?
							<SecondaryContent>For example: Delivery, pet services, wake-up call,...</SecondaryContent>
						</Message>
					</MessageGroup>

					<MessageGroup position="right">
						<Message status="11:14 am">It's about pet services.</Message>
						<Message status="11:15 am">
							My puppies are staying with me and I would like to request food and in-room cleaning services.
						</Message>
					</MessageGroup>

					<MessageGroup userInfo={<UserInfo userName="Peter" />}>
						<Message status="11:16 am">
							Yes, sure. Please check the attached files with all the information about our pet services.
						</Message>
						<Message status="11:16 am">
							Pet Services Policy and Agreement <Icon>attachment</Icon>
						</Message>
						<Message status="11:16 am">
							Pet Services Registration <Icon>attachment</Icon>
						</Message>
					</MessageGroup>

					<MessageGroup position="right">
						<Message status="11:17 am">Great. I'll take a look.</Message>
					</MessageGroup>

					<TypingMarker>
						<ProgressIndicator
							size="small"
							type="horizontal"
							fastAppear
							innerOverlayVariant="transparent"
							outerOverlayVariant="transparent"
							label="Peter is typing"
							useLoadingDots={typingContent !== "spinner"}
							hideLoadingCircle={typingContent !== "spinner"}
						/>
					</TypingMarker>
				</Container>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
