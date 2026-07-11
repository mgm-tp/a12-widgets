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
import { useEffect } from "react";
import "@com.mgmtp.a12.widgets/widgets-core/styles/rich-text-editor.css";
import type { DOMExportOutput, LexicalEditor, LexicalNode, NodeKey } from "lexical";
import { $getRoot, $getSelection, $isRangeSelection, $selectAll, createEditor, DecoratorNode } from "lexical";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";

import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core";

import { StyleContentEditable, TextColorDecoratorStyleWrapper } from "../style/text-color-decorator.styled.js";

type SerializedTextColorDecoratorNode = {
	type: string;
	version: number;
	tagName: string;
};

const TextColorWrapper: FC<{ editorContent: LexicalEditor; initText: string }> = ({ editorContent, initText }) => {
	useEffect(() => {
		editorContent.update(() => {
			const root = $getRoot();
			root.select();
			const selection = $getSelection();

			if ($isRangeSelection(selection) && !root.getTextContent()) {
				selection.insertRawText(initText);
				$selectAll();
			}
		});
	}, [editorContent, initText]);

	return (
		<PlainTextPlugin
			contentEditable={
				<StyleContentEditable
					data-role={DataRoles.RichTextEditor.ColorDecoration}
					style={{ color: "#c91d1d", fontWeight: 700 }}
				/>
			}
			placeholder={null}
			ErrorBoundary={LexicalErrorBoundary}
		/>
	);
};

export class TextColorDecoratorNode extends DecoratorNode<ReactNode> {
	__text: string;
	__editorContent: LexicalEditor;

	static getType(): string {
		return "text-color-decorator";
	}

	static clone(node: TextColorDecoratorNode): TextColorDecoratorNode {
		return new TextColorDecoratorNode(node.__text, node.__key);
	}

	constructor(__text: string, key?: NodeKey) {
		super(key);
		this.__text = __text;
		this.__editorContent = createEditor();
	}

	createDOM(): HTMLElement {
		const element = document.createElement("span");

		return element;
	}

	exportDOM(): DOMExportOutput {
		const element = this.createDOM();
		element.textContent = this.__text;
		element.style.color = "red";

		return { element };
	}

	updateDOM(): false {
		return false;
	}

	static importJSON(serializedNode: SerializedTextColorDecoratorNode): TextColorDecoratorNode {
		const node = $createTextColorDecoratorNode(serializedNode.tagName);

		return node;
	}

	exportJSON(): SerializedTextColorDecoratorNode {
		return {
			tagName: this.__text,
			type: this.getType(),
			version: 1
		};
	}

	decorate(): ReactNode {
		return (
			<LexicalNestedComposer initialEditor={this.__editorContent}>
				<TextColorDecoratorStyleWrapper>
					<TextColorWrapper initText={this.__text} editorContent={this.__editorContent} />
				</TextColorDecoratorStyleWrapper>
			</LexicalNestedComposer>
		);
	}
}

export function $createTextColorDecoratorNode(__text: string): TextColorDecoratorNode {
	return new TextColorDecoratorNode(__text);
}

export function $isTextColorDecoratorNode(node: LexicalNode | null | undefined): node is TextColorDecoratorNode {
	return node instanceof TextColorDecoratorNode;
}
