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
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isTextNode } from "lexical";
import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";

import { Icon, InlineStyleTextNode, RichTextEditor } from "@com.mgmtp.a12.widgets/widgets-core";

const HyphenToEnDashPlugin: FC = () => {
	const [editor] = useLexicalComposerContext();
	const hyphenWordRegex = /\w+\s-\s\w+\s/;

	useEffect(() => {
		const nodeHyphenToEnDashTransformRemove = editor.registerNodeTransform(InlineStyleTextNode, (textNode) => {
			if (!$isTextNode(textNode)) {
				return;
			}

			const textNodeContent = textNode.getTextContent();

			const hyphenWordPositionMatch = textNodeContent.match(hyphenWordRegex);

			if (!hyphenWordPositionMatch) {
				return;
			}

			const hyphenWord = hyphenWordPositionMatch[0];
			const dashedWord = hyphenWord.replace("-", "–");
			textNode.setTextContent(textNodeContent.replace(hyphenWord, dashedWord));
		});

		return (): void => {
			nodeHyphenToEnDashTransformRemove();
		};
	});

	return <></>;
};

export const HyphenToEnDashPluginEditor: FC = () => {
	return (
		<div className="-u-width-full">
			<RichTextEditor
				initialConfig={{
					namespace: "Hyphen To En Dash Plugin Editor"
				}}
				id="hyphen-to-en-dash-plugin-editor"
				labelGraphic={<Icon>info</Icon>}
				placeholder="Type a single hyphen (-) between 2 words to convert it to an en dash (–)"
			>
				<HyphenToEnDashPlugin />
			</RichTextEditor>
		</div>
	);
};
