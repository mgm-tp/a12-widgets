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

import type { FC } from "react";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import "@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/themes/rich-text-editor.css";

import {
	Icon,
	AutoLinkPlugin,
	createFollowLinkPopupPlugin,
	RichTextEditor,
	prepopulatedRichText,
	Button
} from "@com.mgmtp.a12.widgets/widgets-core";

const { FollowLinkPopupPlugin, FollowLinkPopup } = createFollowLinkPopupPlugin({
	render: (link) => {
		return (
			<Button
				label="Follow this link"
				onClick={(): void => {
					if (link.target === "_self") {
						window.location.href = link.href;
					} else if (link.target === "_blank") {
						window.open(link.href);
					}
				}}
			/>
		);
	}
});

export const LinkPlugin: FC = () => {
	return (
		<div className="-u-width-full">
			<RichTextEditor
				initialConfig={{
					editorState: prepopulatedRichText(
						"The link plugin will highlight common links. For example, example.com, https://example.com, etc.\n" +
							"A12W-1234, A12W-2345 are links which are detected via customTerms."
					),
					namespace: "Link Plugin",
					nodes: [AutoLinkNode, LinkNode]
				}}
				id="link-plugin-editor"
				labelGraphic={<Icon>info</Icon>}
				placeholder="Type anything..."
			>
				<AutoLinkPlugin
					customTerms={[
						{
							regex: /\bA12W-\d+\b/g,
							getUrl: (text: string) => `https://example.com/${text}`
						}
					]}
					target="_blank"
				/>
				<FollowLinkPopupPlugin>
					<FollowLinkPopup />
				</FollowLinkPopupPlugin>
			</RichTextEditor>
		</div>
	);
};
