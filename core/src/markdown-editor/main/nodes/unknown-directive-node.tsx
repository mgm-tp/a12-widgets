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
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import type { LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import type { Nodes } from "mdast";
import type { ContainerDirective, LeafDirective, TextDirective } from "mdast-util-directive";
import type { ReactElement, ReactNode } from "react";
import { useContext } from "react";
import { styled, css } from "styled-components";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";

/*
 * The three directive shapes, passed straight through from `mdast-util-directive`.
 *
 * They show up in every import and export rule, so an extension written outside this
 * library needs them too. They are re-exported here so that extension does not have
 * to add `mdast-util-directive` to its own dependencies just to name a type.
 */
export type { ContainerDirective, LeafDirective, TextDirective } from "mdast-util-directive";

/**
 * A directive as `remark-directive` parses it, in any of its three shapes:
 *
 * - `ContainerDirective` — a block with content: `:::name` … `:::`
 * - `LeafDirective` — a single line of its own: `::name[label]`
 * - `TextDirective` — inline, inside a sentence: `:name[label]`
 */
export type DirectiveMdast = ContainerDirective | LeafDirective | TextDirective;

/** Which of the three directive shapes a node holds. */
export type DirectiveKind = DirectiveMdast["type"];

type DirectiveMarker = ":::" | "::" | ":";

export type SerializedUnknownDirectiveNode = Spread<
	{
		/** Which of the three directive shapes this is. */
		kind: DirectiveKind;

		/** The directive's name — the `spoiler` in `:::spoiler`. */
		name: string;

		/** The parsed directive, frozen as JSON. Export writes exactly this back. */
		directive: string;

		/** The text between the markers, shown in the placeholder box. */
		preview: string;
	},
	SerializedLexicalNode
>;

/**
 * Deletes every `position` field before the directive is frozen.
 *
 * `position` says where in the markdown text the node was found:
 *
 * ```
 * { type: "containerDirective", name: "spoiler",
 *   position: { start: { line: 3 }, end: { line: 5 } },
 *   children: [ … each with its own position … ] }
 * ```
 *
 * We throw the location away because:
 *
 * - it becomes wrong after any edit above the directive
 * - the serializer does not need it to write the directive back
 * - without it, equal directives get equal JSON, no matter where they are
 */
function removePositionsFromDirectiveMdast(node: Nodes): void {
	delete node.position;

	// In mdast, nested nodes only ever live in `children`.
	if ("children" in node) {
		for (const child of node.children) {
			removePositionsFromDirectiveMdast(child);
		}
	}
}

/**
 * The plain text of a node and everything inside it, for the placeholder preview.
 *
 * ```
 * :::spoiler
 * The answer is **42**.
 * :::
 * ```
 * Output → "The answer is 42."
 */
function getTextContent(node: Nodes): string {
	// A text-carrying node (text, inline code, html) is its own content.
	if ("value" in node) {
		return node.value;
	}

	// A parent is the content of its children; anything else (a break, an image) has none.
	return "children" in node ? node.children.map(getTextContent).join("") : "";
}

/**
 * The colons a directive of this kind starts with, shown in front of its name
 * in the badge: `:::spoiler`, `::figure`, `:abbr`.
 */
function getDirectiveMarker(kind: DirectiveKind): DirectiveMarker {
	if (kind === "containerDirective") {
		return ":::";
	}

	if (kind === "leafDirective") {
		return "::";
	}

	return ":";
}

/**
 * Placeholder for a directive the editor does not recognize.
 * Dashed border and monospace name signal "foreign, kept as written"; source mode is where it is edited.
 */
const StyledUnknownDirective = styled.div.withConfig({ displayName: "StyledUnknownDirective-sc-" })<{
	$inline?: boolean;
}>(({ theme, $inline }) => {
	const { richSurface } = theme.components.markdownEditor;

	return css`
		align-items: baseline;
		cursor: pointer;
		border: 1px dashed ${theme.colors.text.secondaryColorDark};
		border-radius: ${richSurface.code.borderRadius};
		display: ${$inline ? "inline-flex" : "flex"};
		gap: ${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		padding: ${$inline ? "0" : `${theme.spacing.verticalSpacing.vertWhiteSpacing3xs}px`}
			${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px;

		${
			!$inline &&
			css`
				margin: ${theme.spacing.verticalSpacing.vertWhiteSpacing2xs}px 0;
			`
		}

		&[data-selected] {
			box-shadow: 0 0 0 2px ${theme.colors.interaction.focus.color};
		}

		> code {
			flex-shrink: 0;
			color: ${theme.colors.text.secondaryColorDark};
			font-family: ${richSurface.code.fontFamily};
			font-size: ${theme.typography.fontSize.smallFontSize};
		}

		> span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	`;
});

/**
 * The placeholder box: marker and name as a badge, the inner text after it.
 * Read-only on purpose — editing an unknown construct is what source mode is for.
 */
function UnknownDirectiveView({
	nodeKey,
	kind,
	name,
	preview
}: {
	nodeKey: NodeKey;
	kind: DirectiveKind;
	name: string;
	preview: string;
}): ReactElement {
	const [isSelected] = useLexicalNodeSelection(nodeKey);
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);

	const isInline = kind === "textDirective";

	return (
		<StyledUnknownDirective
			as={isInline ? "span" : "div"}
			$inline={isInline}
			data-selected={isSelected || undefined}
			title={titles?.directiveUnknown}
		>
			<code>
				{getDirectiveMarker(kind)}
				{name}
			</code>
			{preview && <span>{preview}</span>}
		</StyledUnknownDirective>
	);
}

/**
 * Holds a directive the editor does not recognize, so it is not lost on save.
 *
 * The node stores the parsed directive as JSON and never touches it:
 * what came in is exactly what goes back out — name, attributes and content.
 * In the editor it shows up as a small read-only box.
 */
export class UnknownDirectiveNode extends DecoratorNode<ReactNode> {
	/** Which of the three directive shapes this is. */
	__kind: DirectiveKind;

	/** The directive's name — the `spoiler` in `:::spoiler`. */
	__name: string;

	/** The parsed directive, frozen as JSON. Export writes exactly this back. */
	__directive: string;

	/** The text between the markers, shown in the placeholder box. */
	__preview: string;

	static getType(): string {
		return "mde-unknown-directive";
	}

	static clone(node: UnknownDirectiveNode): UnknownDirectiveNode {
		return new UnknownDirectiveNode(node.__kind, node.__name, node.__directive, node.__preview, node.__key);
	}

	constructor(kind: DirectiveKind, name: string, directive: string, preview: string, key?: NodeKey) {
		super(key);
		this.__kind = kind;
		this.__name = name;
		this.__directive = directive;
		this.__preview = preview;
	}

	static importJSON(serializedNode: SerializedUnknownDirectiveNode): UnknownDirectiveNode {
		return new UnknownDirectiveNode(
			serializedNode.kind,
			serializedNode.name,
			serializedNode.directive,
			serializedNode.preview
		);
	}

	exportJSON(): SerializedUnknownDirectiveNode {
		return {
			...super.exportJSON(),
			kind: this.__kind,
			name: this.__name,
			directive: this.__directive,
			preview: this.__preview,
			type: UnknownDirectiveNode.getType(),
			version: 1
		};
	}

	/** An inline `:name[…]` run flows with its sentence; the other two shapes are blocks. */
	isInline(): boolean {
		return this.__kind === "textDirective";
	}

	createDOM(): HTMLElement {
		return document.createElement(this.isInline() ? "span" : "div");
	}

	updateDOM(): false {
		return false;
	}

	/**
	 * Turns the stored JSON string back into the directive object,
	 * a fresh copy on every call. The export rule returns this object to the serializer,
	 * which then writes the directive's markdown from it.
	 *
	 * For a stored `:::spoiler{title="Solution"}` block, the call gives:
	 *
	 * ```
	 * {
	 *   type: "containerDirective",
	 *   name: "spoiler",
	 *   attributes: { title: "Solution" },
	 *   children: [ … ]
	 * }
	 * ```
	 */
	getDirectiveMdast(): DirectiveMdast {
		return JSON.parse(this.getLatest().__directive) as DirectiveMdast;
	}

	decorate(): ReactNode {
		return (
			<UnknownDirectiveView kind={this.__kind} name={this.__name} nodeKey={this.getKey()} preview={this.__preview} />
		);
	}
}

/** Freezes a parsed directive into an {@link UnknownDirectiveNode}. */
export function $createUnknownDirectiveNode(directive: DirectiveMdast): UnknownDirectiveNode {
	const clone = structuredClone(directive);

	removePositionsFromDirectiveMdast(clone);

	return $applyNodeReplacement(
		new UnknownDirectiveNode(clone.type, clone.name, JSON.stringify(clone), getTextContent(clone))
	);
}

export function $isUnknownDirectiveNode(node: LexicalNode | null | undefined): node is UnknownDirectiveNode {
	return node instanceof UnknownDirectiveNode;
}
