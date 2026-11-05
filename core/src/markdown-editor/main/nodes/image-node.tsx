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

import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import type {
	DOMConversionMap,
	DOMConversionOutput,
	DOMExportOutput,
	EditorConfig,
	LexicalEditor,
	LexicalNode,
	LexicalUpdateJSON,
	NodeKey,
	SerializedLexicalNode,
	Spread
} from "lexical";
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { ReactElement, ReactNode } from "react";
import { styled, css } from "styled-components";

import { isAllowedImageSrc } from "../utils/helpers.js";

/**
 * An image in the editor. A click selects the whole node, the border shows that,
 * and Backspace or Delete then removes it.
 */
const StyledEditorImage = styled.img.withConfig({ displayName: "StyledEditorImage-sc-" })(
	({ theme }) => css`
		cursor: pointer;
		max-width: 100%;

		&[data-selected] {
			box-shadow: 0 0 0 2px ${theme.colors.interaction.focus.color};
		}
	`
);

/**
 * How the image looks in the editor.
 *
 * It checks if its own node is selected, so it can show a border when it is.
 * `MdastImageExtension` is what selects the node on a click.
 * Once the node is selected, Backspace or Delete removes the image.
 */
function EditorImage({
	nodeKey,
	src,
	altText,
	title,
	width,
	height
}: {
	nodeKey: NodeKey;
	src: string;
	altText: string;
	title?: string;
	width?: number | string;
	height?: number | string;
}): ReactElement {
	const [isSelected] = useLexicalNodeSelection(nodeKey);

	return (
		<StyledEditorImage
			src={src}
			alt={altText}
			title={title}
			width={width}
			height={height}
			data-selected={isSelected || undefined}
		/>
	);
}

export type SerializedImageNode = Spread<
	{
		src: string;
		altText: string;
		title?: string;
		width?: number | string;
		height?: number | string;
	},
	SerializedLexicalNode
>;

/**
 * A small inline image node. Lexical has no image node of its own,
 * so the MarkdownEditor brings one. `MdastImageExtension` maps it to and from
 * markdown images (`![alt](src "title")`) and it renders as a plain `<img>`.
 *
 * Built to be subclassed: hold your own state, draw something else,
 * then register the subclass through the `extensions` prop.
 *
 * ```tsx
 * defineExtension({
 *   name: "my/CaptionedImage",
 *   nodes: [
 *     CaptionedImageNode,
 *     {
 *       replace: ImageNode,
 *       with: (node: ImageNode) =>
 *         new CaptionedImageNode(node.getSrc(), node.getAltText(), node.getTitle()),
 *       withKlass: CaptionedImageNode
 *     }
 *   ]
 * });
 * ```
 */
export class ImageNode extends DecoratorNode<ReactNode> {
	__src: string;
	__altText: string;
	__title?: string;

	/**
	 * The drawn size: a count of CSS pixels, or a percentage of the space available.
	 *
	 * Markdown's image syntax carries a URL, a title and alt text and nothing else —
	 * https://spec.commonmark.org/0.31.2/#images — so a size only arrives from a picture
	 * written as HTML, `<img src="…" width="200">` or from a host that sets it itself.
	 *
	 * The stylesheet still caps the picture at the width of the editor, so a size wider than
	 * the surface scales down instead of overflowing.
	 */
	__width?: number | string;
	__height?: number | string;

	static getType(): string {
		return "mde-image";
	}

	static clone(node: ImageNode): ImageNode {
		const clone = new ImageNode(node.__src, node.__altText, node.__title, node.__key);

		clone.__width = node.__width;
		clone.__height = node.__height;

		return clone;
	}

	constructor(src: string, altText: string, title?: string, key?: NodeKey) {
		super(key);
		this.__src = src;
		this.__altText = altText;
		this.__title = title;
	}

	static importJSON(serializedNode: SerializedImageNode): ImageNode {
		return $createImageNode({ src: serializedNode.src, altText: serializedNode.altText }).updateFromJSON(
			serializedNode
		);
	}

	/**
	 * Reads the serialized fields onto this node. The work is here rather than in
	 * {@link ImageNode.importJSON} so a subclass inherits it and only adds its own fields.
	 * Calling `super` is what restores any node state the subclass put on the node.
	 */
	updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
		const writable = super.updateFromJSON(serializedNode).getWritable();

		writable.__src = serializedNode.src;
		writable.__altText = serializedNode.altText;
		writable.__title = serializedNode.title;
		writable.__width = serializedNode.width;
		writable.__height = serializedNode.height;

		return writable;
	}

	exportJSON(): SerializedImageNode {
		return {
			...super.exportJSON(),
			src: this.__src,
			altText: this.__altText,
			title: this.__title,
			width: this.__width,
			height: this.__height,
			type: this.getType(),
			version: 1
		};
	}

	static importDOM(): DOMConversionMap | null {
		return {
			img: () => ({
				conversion: (element: HTMLElement): DOMConversionOutput => {
					const img = element as HTMLImageElement;

					return {
						node: $createImageNode({
							src: img.getAttribute("src") ?? "",
							altText: img.getAttribute("alt") ?? "",
							title: img.getAttribute("title") ?? undefined,
							width: readSize(img.getAttribute("width")),
							height: readSize(img.getAttribute("height"))
						})
					};
				},
				priority: 0
			})
		};
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement("img");
		element.setAttribute("src", this.sanitizeSrc(this.__src));
		element.setAttribute("alt", this.__altText);

		if (this.__title) {
			element.setAttribute("title", this.__title);
		}

		if (this.__width !== undefined) {
			element.setAttribute("width", String(this.__width));
		}

		if (this.__height !== undefined) {
			element.setAttribute("height", String(this.__height));
		}

		return { element };
	}

	/**
	 * The `src` to draw, or `about:blank` if an image may not point there.
	 *
	 * Same job as `LinkNode.sanitizeUrl`, for pictures. It runs when the `src` is written to the `<img>`,
	 * not when it is stored. That way it catches every address, however it got in:
	 * a paste, a drop, markdown passed in through `value`, or a state loaded back from JSON.
	 *
	 * The document itself is never changed. The markdown still says what it said.
	 * Only the picture is left out.
	 *
	 * The rule is {@link isAllowedImageSrc}: `http:`, `https:`, or no scheme at all.
	 * If we need a different rule, subclass this node and override this method.
	 */
	sanitizeSrc(src: string): string {
		// While an upload runs, `src` is a local blob URL. No protocol list takes those.
		// The real address comes when the upload ends and that one is checked.
		if (this.hasTemporarySrc()) {
			return src;
		}

		return isAllowedImageSrc(src) ? src : "about:blank";
	}

	createDOM(): HTMLElement {
		return document.createElement("span");
	}

	updateDOM(): false {
		return false;
	}

	getSrc(): string {
		return this.getLatest().__src;
	}

	getAltText(): string {
		return this.getLatest().__altText;
	}

	getTitle(): string | undefined {
		return this.getLatest().__title;
	}

	/**
	 * Whether `src` is a placeholder rather than the address the image will keep
	 * a local object URL during an upload, say. `false` for an ordinary image.
	 */
	hasTemporarySrc(): boolean {
		return false;
	}

	/**
	 * Replaces `src`, plus any alt or title supplied with it.
	 * A subclass with a placeholder calls this once the real address arrives.
	 */
	updateImage({ src, altText, title }: { src: string; altText?: string; title?: string }): void {
		const writable = this.getWritable();
		writable.__src = src;

		if (altText !== undefined) {
			writable.__altText = altText;
		}

		if (title !== undefined) {
			writable.__title = title;
		}
	}

	/** The drawn width, or `undefined` when the picture keeps its own size. */
	getWidth(): number | string | undefined {
		return this.getLatest().__width;
	}

	/** The drawn height, or `undefined` when the picture keeps its own size. */
	getHeight(): number | string | undefined {
		return this.getLatest().__height;
	}

	/** Sets the drawn size. Pass `undefined` for either to let the picture decide it. */
	setSize(width?: number | string, height?: number | string): void {
		const writable = this.getWritable();

		writable.__width = width;
		writable.__height = height;
	}

	/**
	 * The plain picture, and nothing else. A subclass that wants more around it calls
	 * `super.decorate(editor, config)` for this element and wraps what it gets back.
	 */
	decorate(_editor: LexicalEditor, _config: EditorConfig): ReactNode {
		return (
			<EditorImage
				nodeKey={this.getKey()}
				src={this.sanitizeSrc(this.__src)}
				altText={this.__altText}
				title={this.__title}
				width={this.__width}
				height={this.__height}
			/>
		);
	}
}

export interface ImageNodePayload {
	src: string;
	altText: string;
	title?: string;
	width?: number | string;
	height?: number | string;
	key?: NodeKey;
}

/**
 * Reads an HTML `width` or `height` attribute as a size to draw at.
 */
export function readSize(value: string | null | undefined): number | string | undefined {
	const size = value?.trim();

	if (size === undefined || !/^\d+%?$/.test(size)) {
		return undefined;
	}

	return size.endsWith("%") ? size : Number(size);
}

export function $createImageNode({ src, altText, title, width, height, key }: ImageNodePayload): ImageNode {
	const node = $applyNodeReplacement(new ImageNode(src, altText, title, key));

	if (width !== undefined || height !== undefined) {
		node.setSize(width, height);
	}

	return node;
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
	return node instanceof ImageNode;
}
