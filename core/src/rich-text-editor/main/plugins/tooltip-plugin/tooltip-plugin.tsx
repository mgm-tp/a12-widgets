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

import type { ComponentType, ReactElement } from "react";
import { useEffect, useMemo } from "react";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import type { LexicalEditor, LexicalNode } from "lexical";
import {
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_LOW,
	SELECTION_CHANGE_COMMAND,
	TextNode
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { decorateComponentWithProps } from "../../utils/decorate-component-with-props.js";
import { editorThemeClasses } from "../../themes/themes.js";
import { textSearchByRegex } from "../../utils/common.js";
import { useAddClassToTextMatchers } from "../../utils/hooks.js";
import type { InlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import { $isInlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import { provider } from "../../../../common/main/device-detector.js";
import type { Container } from "../../../../common/main/base-props.js";

import type { TextMatcher } from "../plugin.internal.api.js";

import type { TooltipPluginConfig } from "./tooltip-plugin.api.js";
import { TooltipPlugin as Tooltip } from "./view/tooltip.view.js";
import type { TooltipPluginProps } from "./view/tooltip.api.js";

export function createTooltipPlugin(config?: TooltipPluginConfig): {
	TooltipPlugin: ComponentType<Container>;
	TooltipPopup: ComponentType<TooltipPluginProps>;
} {
	let changeVisibilityOfTooltip: TooltipPluginProps.ChangeVisibleHandler | undefined;
	let changePositionOfTooltip: TooltipPluginProps.ChangePositionHandler | undefined;

	const TooltipPlugin = (props: Container): ReactElement<Container> => {
		const [editor] = useLexicalComposerContext();
		const isDesktop = provider.isDesktop();

		const matcher: TextMatcher[] = useMemo(
			() =>
				config?.customTerms
					?.filter((el) => el.regex)
					.map((el) => (text: string) => textSearchByRegex(text, el.regex!)) ?? [],
			[]
		);

		useAddClassToTextMatchers(editor, matcher, editorThemeClasses.withTooltipWord);

		const isWithTooltipWord = (node: LexicalNode): boolean => {
			if (!$isInlineStyleTextNode(node)) {
				return false;
			}

			return (
				node.hasClass(editorThemeClasses.withTooltipWord) || node.hasClass(editorThemeClasses.withDefaultTooltipWord)
			);
		};

		const openTooltip = (
			triggerTextNode: InlineStyleTextNode,
			pageX: number,
			pageY: number,
			target?: EventTarget | null
		): void => {
			const triggerText = triggerTextNode.getTextContent() ?? "";
			const term =
				config?.customTerms?.find((el) => (el.regex ? triggerText.match(el.regex) : null)) ??
				config?.customTerms?.find((el) => !el.regex);

			if (!term) {
				changeVisibilityOfTooltip?.(false);

				return;
			}

			changeVisibilityOfTooltip?.(true, () => term.render?.(triggerTextNode));
			changePositionOfTooltip?.(pageX, pageY, target);
		};

		useEffect(() => {
			const scrollHandle = (): void => {
				changeVisibilityOfTooltip?.(false);
			};

			if (isDesktop) {
				document.addEventListener("scroll", scrollHandle, true);
			}

			return (): void => {
				if (isDesktop) {
					document.removeEventListener("scroll", scrollHandle);
				}
			};
		}, [isDesktop]);

		useEffect(() => {
			const focusHandleRemove = editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					if (config?.triggerMode !== "focus") {
						return false;
					}

					const selection = $getSelection();
					const selectionRange = window.getSelection()?.getRangeAt(0);

					if (!$isRangeSelection(selection) || !selectionRange) {
						return false;
					}

					const anchorNode = selection.anchor.getNode();
					const clientRect = selectionRange?.getBoundingClientRect();

					let isTooltipWord = false;

					if ($isInlineStyleTextNode(anchorNode)) {
						isTooltipWord = isWithTooltipWord(anchorNode);
					}

					if (isTooltipWord && selection.getNodes().length === 1 && $isInlineStyleTextNode(anchorNode)) {
						const selectionStartContainer = selectionRange.startContainer;
						const targetElement =
							selectionStartContainer.nodeType === Node.ELEMENT_NODE
								? selectionStartContainer
								: selectionStartContainer.parentElement;

						openTooltip(anchorNode, clientRect?.left, clientRect?.top, targetElement);
					} else {
						changeVisibilityOfTooltip?.(false);
					}

					return false;
				},
				COMMAND_PRIORITY_LOW
			);

			return (): void => {
				focusHandleRemove();
			};
		}, [editor, isDesktop]);

		const handleMouseOver = (e: Event, _: LexicalEditor, nodeKey: string): void => {
			const node = $getNodeByKey(nodeKey);

			if (!$isInlineStyleTextNode(node)) {
				return;
			}

			if (e instanceof MouseEvent && isWithTooltipWord(node)) {
				openTooltip(node, e.pageX, e.pageY);
			}
		};

		const handleMouseLeave = (): void => changeVisibilityOfTooltip?.(false);

		const handleMouseMove = (e: Event): void => {
			if (e instanceof MouseEvent) {
				changePositionOfTooltip?.(e.pageX, e.pageY, e.target);
			}
		};

		const tooltipEventHandle = {
			focus: <></>,
			hover: (
				<>
					<NodeEventPlugin nodeType={TextNode} eventType="mouseover" eventListener={handleMouseOver} />
					<NodeEventPlugin nodeType={TextNode} eventType="mouseleave" eventListener={handleMouseLeave} />
					<NodeEventPlugin nodeType={TextNode} eventType="mousemove" eventListener={handleMouseMove} />
				</>
			)
		};

		return (
			<>
				{tooltipEventHandle[config?.triggerMode ?? "hover"]}
				{props.children}
			</>
		);
	};

	TooltipPlugin.displayName = "TooltipPlugin";

	return {
		TooltipPlugin,
		TooltipPopup: decorateComponentWithProps<TooltipPluginProps, object>(Tooltip, {
			changeVisible: (handler?: TooltipPluginProps.ChangeVisibleHandler) => (changeVisibilityOfTooltip = handler),
			changePosition: (handler?: TooltipPluginProps.ChangePositionHandler) => (changePositionOfTooltip = handler),
			triggerMode: config && config.triggerMode
		})
	};
}
