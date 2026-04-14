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

import type { ReactElement, ComponentType } from "react";
import { useEffect } from "react";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import { $isLinkNode, LinkNode } from "@lexical/link";
import type { LexicalEditor } from "lexical";
import { $getNodeByKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { decorateComponentWithProps } from "../../utils/decorate-component-with-props.js";
import type { Container } from "../../../../common/main/base-props.js";
import { InlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { TooltipPluginProps } from "../tooltip-plugin/view/tooltip.api.js";
import { TooltipPlugin } from "../tooltip-plugin/view/tooltip.view.js";

import type { FollowLinkPopupProps } from "./follow-link-popup-plugin.api.js";

export function createFollowLinkPopupPlugin({ render }: { render?: FollowLinkPopupProps["render"] }): {
	FollowLinkPopupPlugin: ComponentType<Container>;
	FollowLinkPopup: ComponentType<TooltipPluginProps>;
} {
	let changeVisibilityOfPopup: TooltipPluginProps.ChangeVisibleHandler | undefined;
	let changePositionOfPopup: TooltipPluginProps.ChangePositionHandler | undefined;

	const FollowLinkPopupPlugin = (props: Container): ReactElement => {
		const [editor] = useLexicalComposerContext();

		useEffect(() => {
			editor.registerNodeTransform(InlineStyleTextNode, () => {
				changeVisibilityOfPopup?.(false);
			});
		}, [editor]);

		const handleMouseOver = (_: Event, editor: LexicalEditor, nodeKey: string): void => {
			const node = $getNodeByKey(nodeKey);

			if (!$isLinkNode(node)) {
				return;
			}

			if (changeVisibilityOfPopup) {
				const popup = render?.({
					target: node.__target ?? "_self",
					href: node.__url
				});

				changeVisibilityOfPopup(true, () => popup);
			}
		};

		const handleMouseLeave = (e: Event): void => {
			if (!(e instanceof MouseEvent)) {
				return;
			}

			const toolTip = document.querySelector(`[data-role=${DataRoles.RichTextEditor.Tooltip}]`);

			if (changeVisibilityOfPopup && !toolTip?.contains(e.relatedTarget as HTMLElement)) {
				changeVisibilityOfPopup(false);
			}
		};

		const handleMouseMove = (e: Event): void => {
			if (changePositionOfPopup && e instanceof MouseEvent) {
				changePositionOfPopup(e.clientX, e.clientY, e.target);
			}
		};

		return (
			<>
				<NodeEventPlugin nodeType={LinkNode} eventType="mouseover" eventListener={handleMouseOver} />
				<NodeEventPlugin nodeType={LinkNode} eventType="mouseleave" eventListener={handleMouseLeave} />
				<NodeEventPlugin nodeType={LinkNode} eventType="mousemove" eventListener={handleMouseMove} />
				{props.children}
			</>
		);
	};

	FollowLinkPopupPlugin.displayName = "FollowLinkPopupPlugin";

	return {
		FollowLinkPopupPlugin,
		FollowLinkPopup: decorateComponentWithProps<TooltipPluginProps>(TooltipPlugin, {
			changeVisible: (handler?: TooltipPluginProps.ChangeVisibleHandler) => (changeVisibilityOfPopup = handler),
			changePosition: (handler?: TooltipPluginProps.ChangePositionHandler) => (changePositionOfPopup = handler)
		})
	};
}
