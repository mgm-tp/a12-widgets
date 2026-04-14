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

import ChatAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/chat/main/chat.api.json" with { type: "json" };
import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../../helpers/definitions.js";

import { BasicChatShowcase } from "./basic.js";
import { DateMarkerAndNotificationsChatShowcase } from "./date-marker-and-notifications.js";
import { ScrollHandlingChatShowcase } from "./scroll-handling.js";
import { TypingChatShowcase } from "./typing.js";

import basicCode from "!./basic.tsx?raw";
import dateMarkerAndNotificationsCode from "!./date-marker-and-notifications.tsx?raw";
import scrollHandlingCode from "!./scroll-handling.tsx?raw";
import typingCode from "!./typing.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Chat",
		description: (
			<p>
				The <strong>Chat</strong> Widget is used for displaying virtual conversations.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<div>
						<p>
							In the <strong>Chat</strong> Widget, the <strong>Container</strong> is used to wrap a stack of{" "}
							<strong>MessageGroup</strong> elements. Each <strong>MessageGroup</strong> may include:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>userInfo</code>: allows you to use the <strong>UserInfo</strong> widget to provide information
								about the user such as their username and avatar.
							</BulletList.Item>
							<BulletList.Item>
								<code>position</code>: allows for specifying whether the <strong>MessageGroup</strong> should be aligned
								to the <code>left</code> or <code>right</code>. This property is set to <code>left</code> by default.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							You can add multiple <strong>Message</strong> elements to a <strong>MessageGroup</strong> as its children.
							You can use the <code>status</code> property of each <strong>Message</strong> to shows its additional
							information such as date, time, sent/received status, etc. that is displayed at the bottom of a message.
						</p>
						<p>
							To display additional content besides the main Message, please use the <code>SecondaryContent</code>{" "}
							element.
						</p>
					</div>
				),
				content: <BasicChatShowcase />,
				useDarkBackground: true,
				code: { name: "basic.tsx", code: basicCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Date Markers and Notifications",
				description: (
					<div>
						<p>
							We provide elements for you to decorate and add additional information to the <strong>Chat</strong>:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>DateMarker</strong>: this element helps to group messages according to the date they were sent.
								You should put it before the <strong>MessageGroup</strong> elements that you want to group.
							</BulletList.Item>
							<BulletList.Item>
								<strong>Notification</strong>: this element helps to display notifications that come in from the chat.
								You can change its variant via the <code>variant</code> property (there are 4 variants available: info,
								success, warning, and error).
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							The example below uses the <strong>DateMarker</strong> and all variants of the{" "}
							<strong>Notification</strong> element.
						</p>
					</div>
				),
				content: <DateMarkerAndNotificationsChatShowcase />,
				useDarkBackground: true,
				code: { name: "date-marker-and-notifications.tsx", code: dateMarkerAndNotificationsCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Typing Marker",
				description: (
					<div>
						<p>
							To indicate whether the user is typing, you can make use of the <strong>TypingMarker</strong> element.
						</p>
						<p>
							The example below uses the <strong>TypingMarker</strong> and shows how it works when combined with the{" "}
							<Link href="#/widgets/feedback/progress-indicator">Progress Indicator</Link> widget.
						</p>
					</div>
				),
				content: <TypingChatShowcase />,
				useConfiguration: true,
				code: { name: "typing.tsx", code: typingCode },
				toggleBetweenPartialAndFullCode: true
			},
			{
				label: "Scroll Handling",
				description: (
					<div>
						<p>
							The Container element of the <strong>Chat</strong> Widget can automatically scroll to the bottom if the
							scrollbar is at the bottom when new message come in.
						</p>
						<p>It also provides the following properties to handle scroll events:</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>onScroll</code>: a handler function that will be fired continuously while the scrollbar is
								scrolling.
								<br />
								Use the param <code>isAutomaticallyScrolling</code> to detect whether the scroll event is triggered
								manually or programmatically.
							</BulletList.Item>
							<BulletList.Item>
								<code>onScrollStart</code>: a handler function that will be fired when the user start scrolling the
								scrollbar.
							</BulletList.Item>
							<BulletList.Item>
								<code>onScrollEnd</code>: a handler function that will be fired when the user stop scrolling the
								scrollbar for a time interval defined by the <code>scrollEndDetectingTime</code> property.
							</BulletList.Item>
							<BulletList.Item>
								<code>scrollEndDetectingTime</code>: the amount of time (in milliseconds) between the scroll event
								stopping and the <code>onScrollEnd</code> event starting. The default value is 250ms.
							</BulletList.Item>
							<BulletList.Item>
								<code>ref</code>: a React Reference instance of the Container that includes additional utility functions
								such as: <code>scrollTo</code>, <code>scrollToBottom</code>, and <code>isScrollbarAtBottom</code>.
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							The example below uses the <code>onScrollEnd</code> of the Container to handle the visibility of the
							"Scroll to bottom" Notification element when you scroll. By clicking the Notification or sending a new
							message, the Container's <code>scrollToBottom</code> will be triggered.
						</p>
					</div>
				),
				content: <ScrollHandlingChatShowcase />,
				useDarkBackground: true,
				code: { name: "scroll-handling.tsx", code: scrollHandlingCode }
			}
		]
	}
];

export default {
	label: "Chat",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ChatAPI }],
		themingConfiguration: "chat"
	}
};
