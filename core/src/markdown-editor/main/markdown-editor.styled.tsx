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

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { css, styled } from "styled-components";

import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { breakWord } from "../../theme/base/mixins/_break-word.js";
import { darkFocus, inputDarkFocus } from "../../theme/base/mixins/_interaction.js";

import { A12_SHIKI_CSS_VAR_PREFIX } from "./register-shiki-theme.js";

function toCssSize(value?: number | string): string | undefined {
	if (value === undefined) {
		return undefined;
	}

	return typeof value === "number" ? `${value}px` : value;
}

export const StyledMarkdownPlaceholder = styled.div.withConfig({
	displayName: "StyledMarkdownPlaceholder-sc-"
})(({ theme }) => {
	const { colors } = theme;

	return css`
		color: ${colors.text.secondaryColorDark};
		left: 0;
		padding: ${theme.components.textArea.padding};
		position: absolute;
		top: 0;
		user-select: none;
		pointer-events: none;
	`;
});

export const StyledMarkdownEditorMain = styled(StyledBaseInput.StyledFieldMain).withConfig({
	displayName: "StyledMarkdownEditorMain-sc-"
})`
	> ${StyledBaseInput.StyledField} {
		min-width: 0;
	}
`;

export const StyledMarkdownEditorInput = styled(ContentEditable).withConfig({
	displayName: "StyledMarkdownEditorInput-sc-"
})<{
	$hasFocus?: boolean;
}>(({ theme, $hasFocus }) => {
	const { baseInput } = theme.components;

	return css`
		${
			$hasFocus &&
			css`
				outline-offset: ${baseInput.input.outlineOffset};
				${inputDarkFocus}
			`
		}
	`;
});

export const StyledMarkdownRichWrapper = styled(StyledBaseInput.StyledFieldInput).withConfig({
	displayName: "StyledMarkdownRichWrapper-sc-"
})<{
	$focused?: boolean;
	$minHeight?: number | string;
	$maxHeight?: number | string;
}>(({ theme, $disabled, $readonly, $focused, $error, $warning, $info, $minHeight, $maxHeight }) => {
	const { applicationStyles } = theme;
	const { baseInput, checkbox, textArea } = theme.components;
	const { heading, richSurface } = theme.components.markdownEditor;
	const codeToken = richSurface.codeBlock.token;
	const checkboxSize = `${baseInput.boolean.size}px`;
	const variant = $error ? "error" : $warning ? "warning" : $info ? "info" : undefined;

	return css`
		display: block;
		height: auto;
		position: relative;
		isolation: isolate;
		max-height: ${toCssSize($maxHeight)};
		min-height: ${toCssSize($minHeight)};

		${breakWord}
		${StyledMarkdownEditorInput} {
			background-color: inherit;
			border: ${baseInput.input.border};
			border-radius: ${applicationStyles.input.borderRadius};
			color: ${applicationStyles.input.fontColor};
			font-family: ${applicationStyles.input.fontFamily};
			font-size: ${applicationStyles.input.fontSize};
			font-weight: ${applicationStyles.input.fontWeight};
			height: auto;
			max-height: inherit;
			min-height: inherit;
			overflow: auto;
			padding: ${textArea.padding};
			position: relative;
			text-align: inherit;
			vertical-align: top;

			> :first-child {
				margin-top: 0;
			}

			> :last-child {
				margin-bottom: 0;
			}

			${
				$focused &&
				css`
					box-shadow: ${variant ? baseInput.input[variant].focusBoxShadow : baseInput.input.focusBoxShadow};
					outline-offset: ${baseInput.input.outlineOffset};
					${darkFocus}
				`
			}
			${
				$disabled &&
				css`
					background: ${baseInput.input.disabled.background};
					box-shadow: ${baseInput.input.disabled.boxShadow};
					color: ${baseInput.input.disabled.color};
				`
			}
			${
				$readonly &&
				css`
					background: ${baseInput.input.readonly.background};
					box-shadow: none;
				`
			}

			.mde-h1,
			.mde-h2,
			.mde-h3,
			.mde-h4,
			.mde-h5,
			.mde-h6 {
				color: ${theme.colors.text.headlineColor};
				font-weight: ${theme.typography.fontWeight.boldFontWeight};
			}

			${Object.entries(heading).map(
				([level, size]) => css`
					.mde-${level} {
						font-size: ${size};
					}
				`
			)}

			.mde-link {
				color: ${richSurface.link.color};
				text-decoration: underline;
			}

			.mde-bold {
				font-weight: ${theme.typography.fontWeight.boldFontWeight};
			}

			.mde-italic {
				font-style: italic;
			}

			.mde-underline {
				text-decoration: underline;
			}

			.mde-strikethrough {
				text-decoration: line-through;
			}

			.mde-underline.mde-strikethrough {
				text-decoration: underline line-through;
			}

			.mde-highlight,
			mark {
				background-color: ${theme.colors.variant.warningColorLight};
				border-radius: 2px;
				padding: 0 2px;
			}

			.mde-code,
			code {
				background-color: ${richSurface.code.background};
				border-radius: ${richSurface.code.borderRadius};
				color: ${richSurface.code.color};
				font-family: ${richSurface.code.fontFamily};
				padding: ${richSurface.code.padding};
			}

			/* 	Shiki paints a fenced code block with inline styles, so no class here can repaint a token.
				The editor hands it a css-variables theme instead (see register-shiki-theme.ts),
			   	which makes each inline value a var(). Setting the variables is what colors the block,
			   	and a consumer overrides them through the theme config like any other token. */
			.mde-codeblock {
				display: block;
				${A12_SHIKI_CSS_VAR_PREFIX}background: ${richSurface.codeBlock.background};
				${A12_SHIKI_CSS_VAR_PREFIX}foreground: ${richSurface.codeBlock.foreground};
				${A12_SHIKI_CSS_VAR_PREFIX}token-comment: ${codeToken.comment};
				${A12_SHIKI_CSS_VAR_PREFIX}token-keyword: ${codeToken.keyword};
				${A12_SHIKI_CSS_VAR_PREFIX}token-operator: ${codeToken.operator};
				${A12_SHIKI_CSS_VAR_PREFIX}token-string: ${codeToken.string};
				${A12_SHIKI_CSS_VAR_PREFIX}token-string-expression: ${codeToken.stringExpression};
				${A12_SHIKI_CSS_VAR_PREFIX}token-regex: ${codeToken.regex};
				${A12_SHIKI_CSS_VAR_PREFIX}token-number: ${codeToken.number};
				${A12_SHIKI_CSS_VAR_PREFIX}token-constant: ${codeToken.constant};
				${A12_SHIKI_CSS_VAR_PREFIX}token-variable: ${codeToken.variable};
				${A12_SHIKI_CSS_VAR_PREFIX}token-property: ${codeToken.property};
				${A12_SHIKI_CSS_VAR_PREFIX}token-parameter: ${codeToken.parameter};
				${A12_SHIKI_CSS_VAR_PREFIX}token-function: ${codeToken.function};
				${A12_SHIKI_CSS_VAR_PREFIX}token-type: ${codeToken.type};
				${A12_SHIKI_CSS_VAR_PREFIX}token-tag: ${codeToken.tag};
				${A12_SHIKI_CSS_VAR_PREFIX}token-attribute: ${codeToken.attribute};
				${A12_SHIKI_CSS_VAR_PREFIX}token-punctuation: ${codeToken.punctuation};
				${A12_SHIKI_CSS_VAR_PREFIX}token-link: ${codeToken.link};
				${A12_SHIKI_CSS_VAR_PREFIX}token-inserted: ${codeToken.inserted};
				${A12_SHIKI_CSS_VAR_PREFIX}token-deleted: ${codeToken.deleted};
				${A12_SHIKI_CSS_VAR_PREFIX}token-changed: ${codeToken.changed};
			}

			.mde-quote {
				border-left: ${richSurface.blockquote.border};
				color: ${richSurface.blockquote.color};
				margin-left: 0;
				padding-left: ${richSurface.blockquote.paddingLeft};
			}

			hr {
				border: none;
				border-top: 1px solid ${richSurface.horizontalRule.color};
				margin: ${richSurface.horizontalRule.margin};
			}

			ul.mde-checklist {
				list-style: none;
				padding-left: ${richSurface.checklist.paddingLeft};

				.mde-li {
					padding-left: ${richSurface.checklist.itemPaddingLeft};
					position: relative;

					/* The box and the tick share one square, centred on the first line of text. */
					&::before,
					&::after {
						align-items: center;
						display: flex;
						height: ${checkboxSize};
						justify-content: center;
						left: 0;
						position: absolute;
						top: calc((${applicationStyles.input.lineHeight}em - ${checkboxSize}) / 2);
						width: ${checkboxSize};
					}

					&::before {
						border: ${baseInput.boolean.border};
						border-radius: ${checkbox.borderRadius};
						content: "";
						cursor: pointer;
					}

					&.mde-li-checked {
						text-decoration: line-through;

						&::before {
							background-color: ${checkbox.checked.background};
							border-color: transparent;
						}

						&::after {
							color: ${checkbox.background};
							content: "check";
							cursor: pointer;
							font-family: "Material Symbols Outlined";
							font-size: ${checkboxSize};
						}
					}
				}
			}

			/* Same look as the Table widget, but with a border around every cell,
			   so the cell being edited stays visible. */
			.mde-table {
				border-collapse: collapse;
				font-size: ${richSurface.table.fontSize};
				margin: ${richSurface.table.margin};
				table-layout: fixed;
				width: 100%;

				.mde-table-cell {
					border: ${richSurface.table.border};

					/* On a table cell, height works as a minimum. It keeps an empty row open. */
					height: ${richSurface.table.cellMinHeight};
					padding: ${richSurface.table.cellPadding};
					vertical-align: top;

					/* Remove the browser's paragraph margins. They made every row twice as tall. */
					p {
						margin-bottom: 0;
						margin-top: 0;
					}
				}

				.mde-table-cell-header {
					background-color: ${richSurface.table.headerBackground};
					font-weight: ${richSurface.table.headerFontWeight};
					height: ${richSurface.table.headerMinHeight};
					padding: ${richSurface.table.headerPadding};
					text-align: left;
				}
			}

			/* A diff-<lang> fence cuts the first character off the line and gives it a class
			   instead of an inline style, so it needs a rule here. Same colors as the vars above.
			   No rule for unchanged on purpose: an untouched line reads as plain text.
			   Class names come from theme.ts. */
			.mde-code-deleted {
				color: ${codeToken.deleted};
			}

			.mde-code-inserted {
				color: ${codeToken.inserted};
			}
		}

		${
			$disabled &&
			css`
				${StyledMarkdownEditorInput} {
					hr {
						border-top-color: ${richSurface.horizontalRule.disabled.color};
					}

					ul.mde-checklist .mde-li::before {
						border: ${richSurface.checklist.disabled.border};
					}

					.mde-table {
						.mde-table-cell {
							border: ${richSurface.table.disabled.border};
						}

						.mde-table-cell-header {
							background-color: ${richSurface.table.disabled.headerBackground};
						}
					}
				}
			`
		}
	`;
});

/**
 * Monospace markdown surface for source mode.
 *
 * A wrapper around a Lexical `contenteditable` rather than a `<textarea>`, because
 * the source is highlighted: every construct is a real element
 * (`.mde-token--<micromarkTokenType>`) nested by structure, so styles compose
 * through the ancestor cascade. The frame tokens are unchanged from the textarea
 * it replaced, so the two look identical apart from the colours.
 */
export const StyledMarkdownSourceWrapper = styled(StyledBaseInput.StyledFieldInput).withConfig({
	displayName: "StyledMarkdownSourceWrapper-sc-"
})<{
	$focused?: boolean;
	$minHeight?: number | string;
	$maxHeight?: number | string;
}>(({ theme, $disabled, $readonly, $focused, $error, $warning, $info, $minHeight, $maxHeight }) => {
	const { applicationStyles } = theme;
	const { baseInput, textArea } = theme.components;
	const { heading, sourceSurface } = theme.components.markdownEditor;
	const variant = $error ? "error" : $warning ? "warning" : $info ? "info" : undefined;
	const token = sourceSurface.token;

	return css`
		display: block;
		height: auto;
		position: relative;
		isolation: isolate;
		max-height: ${toCssSize($maxHeight)};
		min-height: ${toCssSize($minHeight)};

		${breakWord}
		${StyledMarkdownEditorInput} {
			background-color: inherit;
			border: ${baseInput.input.border};
			border-radius: ${applicationStyles.input.borderRadius};
			color: ${applicationStyles.input.fontColor};
			font-family: ${sourceSurface.fontFamily};
			font-size: ${applicationStyles.input.fontSize};
			font-weight: ${applicationStyles.input.fontWeight};
			height: auto;
			max-height: inherit;
			min-height: inherit;
			overflow: auto;
			padding: ${textArea.padding};
			position: relative;
			tab-size: 2;
			text-align: inherit;
			vertical-align: top;

			${
				$focused &&
				css`
					box-shadow: ${variant ? baseInput.input[variant].focusBoxShadow : baseInput.input.focusBoxShadow};
					outline-offset: ${baseInput.input.outlineOffset};
					${darkFocus}
				`
			}
			${
				$disabled &&
				css`
					background: ${baseInput.input.disabled.background};
					box-shadow: ${baseInput.input.disabled.boxShadow};
					color: ${baseInput.input.disabled.color};
				`
			}
			${
				$readonly &&
				css`
					background: ${baseInput.input.readonly.background};
					box-shadow: none;
				`
			}
		}

		/* One element per top-level markdown block — the rebuild unit. */
		.mde-source-block {
			margin: 0;
		}

		/* Markup steps back so the authored content reads first. Nested markers inherit
		   the colour from the run they sit in, so only the outermost token needs listing. */

		/* Block markers: the run that opens or rules off a block. */
		.mde-token--atxHeadingSequence,
		.mde-token--setextHeadingLine,
		.mde-token--codeFencedFenceSequence,
		.mde-token--blockQuotePrefix,
		.mde-token--listItemPrefix,
		.mde-token--taskListCheck,
		.mde-token--thematicBreak,
		.mde-token--directiveContainerSequence,
		/* Table frame: the pipes and the delimiter row under the header. */
		.mde-token--tableCellDivider,
		.mde-token--tableDelimiterRow,
		/* Inline markers: the characters that wrap a run of text. */
		.mde-token--strongSequence,
		.mde-token--emphasisSequence,
		.mde-token--strikethroughSequence,
		.mde-token--codeTextSequence,
		.mde-token--directiveTextMarker,
		.mde-token--directiveTextLabelMarker,
		/* Link and image plumbing: brackets, parens, angle brackets. */
		.mde-token--labelMarker,
		.mde-token--labelImageMarker,
		.mde-token--resourceMarker,
		.mde-token--resourceTitleMarker,
		.mde-token--definitionMarker,
		.mde-token--definitionLabelMarker,
		.mde-token--definitionTitleMarker,
		.mde-token--autolinkMarker,
		/* Escapes and entities: syntax that stands in for one character. */
		.mde-token--escapeMarker,
		.mde-token--characterReference {
			color: ${token.markup};
		}

		/* Metadata that is not a delimiter: what a construct is, not what it shows.
		   Fence info strings, directive names and the titles hidden behind a link. */
		.mde-token--codeFencedFenceInfo,
		.mde-token--codeFencedFenceMeta,
		.mde-token--directiveContainerName,
		.mde-token--directiveLeafName,
		.mde-token--directiveTextName,
		.mde-token--resourceTitle,
		.mde-token--definitionTitle {
			color: ${token.meta};
		}

		/* The same colour and weight edit mode gives a heading element; the token
		   defaults to the theme's headline colour for exactly that reason. */
		.mde-token--atxHeadingText,
		.mde-token--setextHeadingText {
			color: ${token.heading.color};
			font-weight: ${token.heading.fontWeight};
		}

		${Object.values(heading).map(
			(size, index) => css`
				.mde-token--atxHeading[data-token-level="${index + 1}"] {
					font-size: ${size};
				}
			`
		)}

		.mde-token--strong {
			font-weight: ${token.strong.fontWeight};
		}

		.mde-token--emphasis {
			font-style: italic;
		}

		.mde-token--strikethrough {
			text-decoration: line-through;
		}

		/* Underlining does not disturb the monospace grid the way raising or
		   shrinking a run would, so this one is mimicked like bold and strike. */
		.mde-token--inlineUnderline {
			text-decoration: underline;
		}

		.mde-token--codeText,
		.mde-token--codeFlowValue {
			color: ${token.code.color};
		}

		/* Highlight carries edit mode's own background, so a marked run reads the
		   same on both surfaces. The delimiters sit inside it and are dimmed by the
		   marker rule below, which keeps the tag legible against the highlight. */
		.mde-token--inlineHighlight {
			background-color: ${token.highlight.background};
			border-radius: ${token.highlight.borderRadius};
		}

		/* Subscript and superscript are highlighted, not imitated: raising and
		   shrinking a run of source text breaks the monospace grid the surface is read
		   on, and the delimiters are already the size cue. Only the markers step back. */
		.mde-token--customInlineFormatMarker {
			color: ${token.markup};
		}

		.mde-token--htmlText,
		.mde-token--htmlFlow {
			color: ${token.html};
		}

		/* Anything that is an address: written out, autolinked or left bare. */
		.mde-token--resourceDestination,
		.mde-token--definitionDestination,
		.mde-token--autolinkProtocol,
		.mde-token--autolinkEmail,
		.mde-token--literalAutolink {
			color: ${token.link};
			text-decoration: underline;
		}

		/* Paint the block, not the token.
		   An open fence keeps its last newline, but takeTrailingBreaks moves that line break out of the token.
			So the token ends one line early — paint it there and the caret's line stays blank,
		    as if the caret had left the fence.

		   Keep the token inline too. As a block it ended the line by itself,
		   and the line break after it added a second one: one Enter, two new lines. */
		.mde-source-block:has(> .mde-token--codeFenced),
		.mde-source-block:has(> .mde-token--codeIndented) {
			background-color: ${token.code.blockBackground};
		}

		.mde-source-block:has(> .mde-token--blockQuote) {
			padding-left: ${token.quote.blockPaddingLeft};
		}
	`;
});
