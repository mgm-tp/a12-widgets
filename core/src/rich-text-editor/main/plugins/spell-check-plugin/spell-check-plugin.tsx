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
import { createRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { LexicalEditor } from "lexical";
import { $getNodeByKey } from "lexical";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";

import { $isInlineStyleTextNode, InlineStyleTextNode } from "../../nodes/inline-style-text-node.js";
import { editorThemeClasses } from "../../themes/themes.js";
import { decorateComponentWithProps } from "../../utils/decorate-component-with-props.js";
import { useAddClassToTextMatchers } from "../../utils/hooks.js";

import type { SpellCheckConfig, SpellCheckPlugin, SpellCheckPopupProps } from "./spell-check-plugin.api.js";
import { SpellCheckPopupInternal } from "./view/spell-check-popup.view.js";
import type { SpellCheckPopupInternalProps } from "./view/spell-check-popup.api.js";

export function createSpellCheckPlugin(config: SpellCheckConfig): SpellCheckPlugin {
	let changeVisibilityOfSpellPopup: (misspelledWord: string, pageX: number, pageY: number) => void | undefined;
	let closeSpellPopup: () => void | undefined;
	const popupRef = createRef<HTMLDivElement>();

	const SpellCheckPlugin = (props: any): ReactElement => {
		const [editor] = useLexicalComposerContext();

		useAddClassToTextMatchers(editor, config.spellCheck, editorThemeClasses.misspelledWord);

		const handleMouseOver = (e: Event, editor: LexicalEditor, nodeKey: string): void => {
			const node = $getNodeByKey(nodeKey) as InlineStyleTextNode;
			const element = editor.getElementByKey(nodeKey);
			const classList = node.getSelectedStyleName();

			if (
				!$isInlineStyleTextNode(node) ||
				!changeVisibilityOfSpellPopup ||
				!classList.includes(editorThemeClasses.misspelledWord) ||
				!element
			) {
				return;
			}

			const visibleArea = element.getBoundingClientRect();

			if (e instanceof MouseEvent) {
				changeVisibilityOfSpellPopup(node.getTextContent(), visibleArea.left, visibleArea.bottom);
			}
		};

		const handleMouseLeave = (event: Event): void => {
			if (event instanceof MouseEvent) {
				if (!event.relatedTarget || !popupRef.current?.contains(event.relatedTarget as HTMLElement)) {
					closeSpellPopup?.();
				}
			}
		};

		return (
			<>
				<NodeEventPlugin nodeType={InlineStyleTextNode} eventType="mouseover" eventListener={handleMouseOver} />
				<NodeEventPlugin nodeType={InlineStyleTextNode} eventType="mouseleave" eventListener={handleMouseLeave} />
				{props.children}
			</>
		);
	};

	SpellCheckPlugin.displayName = "SpellCheckPlugin";

	return {
		SpellCheckPlugin,
		SpellCheckPopup: decorateComponentWithProps<SpellCheckPopupProps, SpellCheckPopupInternalProps>(
			SpellCheckPopupInternal,
			{
				delayRender: config?.popupDelayRender,
				open: (handler: (misspelledWord: string, pageX: number, pageY: number) => void) =>
					(changeVisibilityOfSpellPopup = handler),
				close: (handle) => (closeSpellPopup = handle),
				popupRef: popupRef
			}
		)
	};
}
